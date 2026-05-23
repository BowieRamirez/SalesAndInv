import { randomUUID } from "node:crypto"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { Prisma, prisma } from "@furnitrack/db"
import { getStorefrontSessionUser } from "@/lib/auth/session"

const ALLOWED_METHODS = new Set(["GCASH", "CASH", "CARD"])
const ALLOWED_PAYMENT_TYPES = new Set(["FULL_PAYMENT", "DOWN_PAYMENT"])
const MIN_DOWN_PAYMENT_RATIO = 0.5

const CUSTOMER_PAID_METHOD_PREFIX = "[[customer_paid_method:"
const CUSTOMER_PAID_NOTE_PREFIX = "[[customer_paid_note:"
const CUSTOMER_PAID_METHOD_PATTERN = /\[\[customer_paid_method:([^\]]+)\]\]/i
const CUSTOMER_PAID_NOTE_PATTERN = /\[\[customer_paid_note:([^\]]+)\]\]/i

function injectCustomerPaymentMarkers(
  existingNote: string | null,
  method: string,
  note: string | null,
): string {
  // Strip any previous customer payment markers so we don't double-embed
  const stripped = (existingNote ?? "")
    .replace(CUSTOMER_PAID_METHOD_PATTERN, "")
    .replace(CUSTOMER_PAID_NOTE_PATTERN, "")
    .trim()

  const markers = [
    `${CUSTOMER_PAID_METHOD_PREFIX}${method}]]`,
    note ? `${CUSTOMER_PAID_NOTE_PREFIX}${encodeURIComponent(note)}]]` : null,
  ]
    .filter(Boolean)
    .join(" ")

  return stripped ? `${markers} ${stripped}` : markers
}

export async function POST(request: Request) {
  const sessionUser = await getStorefrontSessionUser()

  if (!sessionUser) {
    return NextResponse.json({ message: "You must be signed in to submit payment." }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 })
  }

  const data = body as Record<string, unknown>
  const inquiryId = typeof data.inquiryId === "string" ? data.inquiryId.trim() : ""
  const paymentMethod = typeof data.paymentMethod === "string"
    ? data.paymentMethod.trim().toUpperCase()
    : ""
  const paymentType = typeof data.paymentType === "string"
    ? data.paymentType.trim().toUpperCase()
    : "FULL_PAYMENT"
  const amountPaidRaw = data.amountPaid
  const amountPaid =
    typeof amountPaidRaw === "number"
      ? amountPaidRaw
      : typeof amountPaidRaw === "string"
        ? Number(amountPaidRaw)
        : NaN
  const paymentNote = typeof data.paymentNote === "string"
    ? data.paymentNote.trim().slice(0, 500)
    : null
  const proofImage = (data.proofImage && typeof data.proofImage === "object")
    ? data.proofImage as { dataUrl: string; fileName: string }
    : null

  if (!inquiryId) {
    return NextResponse.json({ message: "Order ID is required." }, { status: 400 })
  }

  if (!ALLOWED_METHODS.has(paymentMethod)) {
    return NextResponse.json({ message: "Please select a valid payment method." }, { status: 400 })
  }

  if (!ALLOWED_PAYMENT_TYPES.has(paymentType)) {
    return NextResponse.json({ message: "Invalid payment type." }, { status: 400 })
  }

  try {
    // Fetch the inquiry to verify it belongs to this customer and is in the right status
    type InquiryRow = {
      id: string
      status: string
      statusNote: string | null
      productPrice: Prisma.Decimal | number | string | null
      quotedPrice: Prisma.Decimal | number | string | null
    }
    const rows = await prisma.$queryRaw<InquiryRow[]>(
      Prisma.sql`
        SELECT
          ci.id,
          ci.status::text AS status,
          ci."statusNote",
          p.price AS "productPrice",
          ci."quotedPrice"
        FROM public.customer_inquiries ci
        INNER JOIN public.products p ON p.id = ci."productId"
        WHERE ci.id = ${inquiryId}
          AND ci."customerUserId" = ${sessionUser.id}
        LIMIT 1
      `,
    )

    const inquiry = rows[0]

    if (!inquiry) {
      return NextResponse.json({ message: "Order not found." }, { status: 404 })
    }

    // Only allow payment submission when inventory has accepted and accounting is waiting
    if (inquiry.status !== "WAITING_FOR_PAYMENT") {
      return NextResponse.json(
        { message: "This order is not currently waiting for your payment." },
        { status: 400 },
      )
    }

    // Block updates if accounting has already confirmed a payment
    const verifiedCount = await prisma.$queryRaw<Array<{ count: number }>>(Prisma.sql`
      SELECT COUNT(*)::int AS count
      FROM public.payment_records
      WHERE "inquiryId" = ${inquiryId}
        AND status = 'VERIFIED'::"PaymentStatus"
    `)
    if ((verifiedCount[0]?.count ?? 0) > 0) {
      return NextResponse.json(
        { message: "Your payment has already been confirmed and cannot be changed." },
        { status: 400 },
      )
    }

    // Use quotedPrice (VAT-inclusive) as the effective total — falls back to catalog price + VAT
    const basePrice = inquiry.quotedPrice != null
      ? Number(inquiry.quotedPrice)
      : Number(inquiry.productPrice ?? 0)
    const orderTotal = basePrice * 1.12  // VAT-inclusive total
    const minDownPayment = orderTotal * MIN_DOWN_PAYMENT_RATIO

    // Server-side authoritative validation of payment amounts.
    // For GCASH and CARD we treat them as full payment for now (no partial rail
    // wired up). For CASH we enforce the full vs down-payment rules.
    let resolvedPaymentType: "FULL_PAYMENT" | "DOWN_PAYMENT" = "FULL_PAYMENT"
    let resolvedAmount = orderTotal

    if (paymentMethod === "CASH") {
      if (!Number.isFinite(amountPaid) || amountPaid <= 0) {
        return NextResponse.json(
          { message: "Enter the cash amount tendered." },
          { status: 400 },
        )
      }
      if (amountPaid > orderTotal) {
        return NextResponse.json(
          { message: `Amount cannot exceed the order total of ₱${orderTotal.toFixed(2)}.` },
          { status: 400 },
        )
      }
      if (amountPaid < minDownPayment) {
        return NextResponse.json(
          {
            message: `Minimum down payment is 50% of the order total (₱${minDownPayment.toFixed(
              2,
            )}).`,
          },
          { status: 400 },
        )
      }
      // Authoritative: derive the type from the amount, not the client claim.
      resolvedPaymentType = amountPaid >= orderTotal ? "FULL_PAYMENT" : "DOWN_PAYMENT"
      resolvedAmount = amountPaid
    } else {
      // For GCash and Card, use the actual amount the customer sent
      const paid = Number.isFinite(amountPaid) && amountPaid > 0 ? amountPaid : orderTotal
      resolvedPaymentType = paid >= orderTotal ? "FULL_PAYMENT" : "DOWN_PAYMENT"
      resolvedAmount = Math.min(paid, orderTotal)
    }

    const remainingBalance = Math.max(0, orderTotal - resolvedAmount)
    const nextNote = injectCustomerPaymentMarkers(inquiry.statusNote, paymentMethod, paymentNote || null)

    await prisma.$transaction(async (tx) => {
      // 1. Update inquiry: marker for backward compat + new traceability column
      await tx.$executeRaw(Prisma.sql`
        UPDATE public.customer_inquiries
        SET "statusNote" = ${nextNote},
            "customerPaidAt" = CURRENT_TIMESTAMP,
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${inquiryId}
          AND "customerUserId" = ${sessionUser.id}
      `)

      // 2. Find any existing PENDING payment_record for this inquiry. Customers
      //    are allowed to revise their submission (e.g. switch from full to
      //    down payment, fix a reference number) before accounting confirms it,
      //    so we update the existing row in place rather than inserting a new
      //    one. We keep the original paymentNumber so audit trails stay stable.
      const existingPendingRows = await tx.$queryRaw<
        Array<{ id: string; paymentNumber: string | null }>
      >(Prisma.sql`
        SELECT id, "paymentNumber"
        FROM public.payment_records
        WHERE "inquiryId" = ${inquiryId}
          AND status = 'PENDING'::"PaymentStatus"
        ORDER BY "createdAt" ASC
        LIMIT 1
      `)

      const existingPending = existingPendingRows[0]
      let paymentNumber: string
      let isUpdate: boolean

      if (existingPending) {
        // Update the existing PENDING row in place
        paymentNumber = existingPending.paymentNumber ?? ""
        isUpdate = true

        await tx.$executeRaw(Prisma.sql`
          UPDATE public.payment_records
          SET "paymentType"     = ${resolvedPaymentType}::"PaymentType",
              "paymentMethod"   = ${paymentMethod},
              amount            = ${resolvedAmount},
              "remainingBalance" = ${remainingBalance},
              "paymentDate"     = CURRENT_TIMESTAMP,
              "referenceNumber" = ${paymentNote},
              remarks           = ${paymentNote},
              "updatedAt"       = CURRENT_TIMESTAMP
          WHERE id = ${existingPending.id}
        `)

        // If for some reason the existing row had no paymentNumber (legacy data),
        // generate one now so we can return it consistently.
        if (!paymentNumber) {
          const seqRows = await tx.$queryRaw<Array<{ next_val: number }>>(Prisma.sql`
            SELECT nextval('public.payment_number_seq')::int AS next_val
          `)
          const seq = seqRows[0]?.next_val ?? 1
          const yearStr = new Date().getFullYear().toString()
          paymentNumber = `PAY-${yearStr}-${String(seq).padStart(5, "0")}`
          await tx.$executeRaw(Prisma.sql`
            UPDATE public.payment_records
            SET "paymentNumber" = ${paymentNumber}
            WHERE id = ${existingPending.id}
          `)
        }
      } else {
        // No existing pending row → insert a fresh one
        isUpdate = false
        const seqRows = await tx.$queryRaw<Array<{ next_val: number }>>(Prisma.sql`
          SELECT nextval('public.payment_number_seq')::int AS next_val
        `)
        const nextSeq = seqRows[0]?.next_val ?? 1
        const yearStr = new Date().getFullYear().toString()
        paymentNumber = `PAY-${yearStr}-${String(nextSeq).padStart(5, "0")}`

        await tx.$executeRaw(Prisma.sql`
          INSERT INTO public.payment_records (
            id,
            "inquiryId",
            "paymentNumber",
            "recordedById",
            "paymentType",
            "paymentMethod",
            status,
            amount,
            "remainingBalance",
            "paymentDate",
            "referenceNumber",
            remarks,
            "createdAt",
            "updatedAt"
          )
          VALUES (
            ${randomUUID()},
            ${inquiryId},
            ${paymentNumber},
            ${sessionUser.id},
            ${resolvedPaymentType}::"PaymentType",
            ${paymentMethod},
            'PENDING'::"PaymentStatus",
            ${resolvedAmount},
            ${remainingBalance},
            CURRENT_TIMESTAMP,
            ${paymentNote},
            ${paymentNote},
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
          )
        `)
      }

      // 3. Customer-visible chat message
      const typeLabel = resolvedPaymentType === "DOWN_PAYMENT" ? "down payment" : "full payment"
      const action = isUpdate ? "updated" : "submitted"
      const chatBody =
        `Customer ${action} ${typeLabel} ${paymentNumber} via ${paymentMethod.replace(/_/g, " ")} ` +
        `(₱${resolvedAmount.toFixed(2)}${
          remainingBalance > 0 ? `, remaining ₱${remainingBalance.toFixed(2)}` : ""
        })${paymentNote ? ": " + paymentNote : "."}`
      const chatMsgId = randomUUID()
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.order_chat_messages (id, inquiry_id, sender_user_id, sender_role, body)
        VALUES (
          ${chatMsgId},
          ${inquiryId},
          ${sessionUser.id},
          'CLIENT',
          ${chatBody}
        )
      `)

      // 3a. Attach proof image if provided
      if (proofImage?.dataUrl && proofImage.dataUrl.startsWith("data:image/")) {
        const ext = proofImage.dataUrl.split(";")[0]?.split("/")[1] ?? "jpg"
        const fileName = proofImage.fileName || `payment-proof.${ext}`
        const mimeType = proofImage.dataUrl.split(";")[0]?.replace("data:", "") ?? "image/jpeg"
        await tx.$executeRaw(Prisma.sql`
          INSERT INTO public.order_chat_attachments (id, message_id, file_name, mime_type, attachment_type, data_url)
          VALUES (${randomUUID()}, ${chatMsgId}, ${fileName}, ${mimeType}, 'RECEIPT', ${proofImage.dataUrl})
        `)
      }

      // 4. Approval history entry
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.approval_history (id, module, "recordId", action, "fromStatus", "toStatus", remarks, "actedById", "actedAt")
        VALUES (
          ${randomUUID()},
          'CUSTOMER_INQUIRY'::"ApprovalModule",
          ${inquiryId},
          'SUBMITTED'::"ApprovalAction",
          'PENDING_ACCOUNTING_APPROVAL',
          'PENDING_ACCOUNTING_APPROVAL',
          ${`Customer ${action} ${typeLabel} ${paymentNumber} via ${paymentMethod}`},
          ${sessionUser.id},
          CURRENT_TIMESTAMP
        )
      `)
    })

    revalidatePath("/account/status")

    return NextResponse.json({
      message:
        resolvedPaymentType === "DOWN_PAYMENT"
          ? "Down payment submitted. Accounting will confirm it shortly."
          : "Payment submitted. Accounting will confirm it shortly.",
    })
  } catch (error) {
    console.error("[orders/pay] Failed to submit customer payment", error)
    return NextResponse.json({ message: "Failed to submit payment. Please try again." }, { status: 500 })
  }
}
