import { randomUUID } from "node:crypto"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { Prisma, prisma } from "@furnitrack/db"
import { getStorefrontSessionUser } from "@/lib/auth/session"

const ALLOWED_METHODS = new Set(["GCASH", "CASH", "CARD"])

// Statuses where a balance payment is valid (post-build, post-shipping)
const BALANCE_PAYABLE_STATUSES = new Set([
  "GETTING_READY_FOR_BUILDING",
  "READY_FOR_SHIPMENT",
])

const CUSTOMER_PAID_METHOD_PREFIX = "[[customer_paid_method:"
const CUSTOMER_PAID_NOTE_PREFIX = "[[customer_paid_note:"
const CUSTOMER_PAID_METHOD_PATTERN = /\[\[customer_paid_method:([^\]]+)\]\]/i
const CUSTOMER_PAID_NOTE_PATTERN = /\[\[customer_paid_note:([^\]]+)\]\]/i

function injectCustomerPaymentMarkers(
  existingNote: string | null,
  method: string,
  note: string | null,
): string {
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

  if (!inquiryId) {
    return NextResponse.json({ message: "Order ID is required." }, { status: 400 })
  }

  if (!ALLOWED_METHODS.has(paymentMethod)) {
    return NextResponse.json({ message: "Please select a valid payment method." }, { status: 400 })
  }

  try {
    // Fetch inquiry + its outstanding balance from the most recent VERIFIED payment
    type InquiryRow = {
      id: string
      status: string
      statusNote: string | null
      productPrice: Prisma.Decimal | number | string | null
      verifiedAmount: Prisma.Decimal | number | string | null
      verifiedRemaining: Prisma.Decimal | number | string | null
    }

    const rows = await prisma.$queryRaw<InquiryRow[]>(Prisma.sql`
      SELECT
        ci.id,
        ci.status::text AS status,
        ci."statusNote",
        p.price AS "productPrice",
        pr_v.amount AS "verifiedAmount",
        pr_v."remainingBalance" AS "verifiedRemaining"
      FROM public.customer_inquiries ci
      INNER JOIN public.products p ON p.id = ci."productId"
      LEFT JOIN LATERAL (
        SELECT amount, "remainingBalance"
        FROM public.payment_records
        WHERE "inquiryId" = ci.id
          AND status = 'VERIFIED'::"PaymentStatus"
        ORDER BY "verifiedAt" DESC
        LIMIT 1
      ) pr_v ON TRUE
      WHERE ci.id = ${inquiryId}
        AND ci."customerUserId" = ${sessionUser.id}
      LIMIT 1
    `)

    const inquiry = rows[0]

    if (!inquiry) {
      return NextResponse.json({ message: "Order not found." }, { status: 404 })
    }

    if (!BALANCE_PAYABLE_STATUSES.has(inquiry.status)) {
      return NextResponse.json(
        { message: "Remaining balance payment is not available for this order at its current stage." },
        { status: 400 },
      )
    }

    const orderTotal = inquiry.productPrice == null ? 0 : Number(inquiry.productPrice)
    const alreadyPaid = inquiry.verifiedAmount == null ? 0 : Number(inquiry.verifiedAmount)
    const remainingBalance = inquiry.verifiedRemaining == null
      ? Math.max(0, orderTotal - alreadyPaid)
      : Number(inquiry.verifiedRemaining)

    if (remainingBalance <= 0) {
      return NextResponse.json(
        { message: "This order has no remaining balance to pay." },
        { status: 400 },
      )
    }

    // For cash, the amount must equal the remaining balance exactly (no over-payment)
    let resolvedAmount = remainingBalance
    if (paymentMethod === "CASH") {
      if (!Number.isFinite(amountPaid) || amountPaid <= 0) {
        return NextResponse.json({ message: "Enter the cash amount tendered." }, { status: 400 })
      }
      if (amountPaid < remainingBalance) {
        return NextResponse.json(
          { message: `The full remaining balance of ₱${remainingBalance.toFixed(2)} must be paid. You entered ₱${amountPaid.toFixed(2)}.` },
          { status: 400 },
        )
      }
      if (amountPaid > remainingBalance) {
        return NextResponse.json(
          { message: `Amount cannot exceed the remaining balance of ₱${remainingBalance.toFixed(2)}.` },
          { status: 400 },
        )
      }
      resolvedAmount = amountPaid
    }

    // Check: no duplicate pending balance payment already exists
    const existingPending = await prisma.$queryRaw<Array<{ id: string; paymentNumber: string | null }>>(Prisma.sql`
      SELECT id, "paymentNumber"
      FROM public.payment_records
      WHERE "inquiryId" = ${inquiryId}
        AND status = 'PENDING'::"PaymentStatus"
      LIMIT 1
    `)

    const nextNote = injectCustomerPaymentMarkers(inquiry.statusNote, paymentMethod, paymentNote || null)

    await prisma.$transaction(async (tx) => {
      // Update inquiry marker
      await tx.$executeRaw(Prisma.sql`
        UPDATE public.customer_inquiries
        SET "statusNote" = ${nextNote},
            "customerPaidAt" = CURRENT_TIMESTAMP,
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${inquiryId}
          AND "customerUserId" = ${sessionUser.id}
      `)

      let paymentNumber: string

      if (existingPending[0]) {
        // Update the existing pending row (customer revised before accounting confirmed)
        paymentNumber = existingPending[0].paymentNumber ?? ""
        await tx.$executeRaw(Prisma.sql`
          UPDATE public.payment_records
          SET "paymentType"      = 'FULL_PAYMENT'::"PaymentType",
              "paymentMethod"    = ${paymentMethod},
              amount             = ${resolvedAmount},
              "remainingBalance" = 0,
              "paymentDate"      = CURRENT_TIMESTAMP,
              "referenceNumber"  = ${paymentNote},
              remarks            = ${paymentNote},
              "updatedAt"        = CURRENT_TIMESTAMP
          WHERE id = ${existingPending[0].id}
        `)
        if (!paymentNumber) {
          const seqRows = await tx.$queryRaw<Array<{ next_val: number }>>(Prisma.sql`
            SELECT nextval('public.payment_number_seq')::int AS next_val
          `)
          const seq = seqRows[0]?.next_val ?? 1
          paymentNumber = `PAY-${new Date().getFullYear()}-${String(seq).padStart(5, "0")}`
          await tx.$executeRaw(Prisma.sql`
            UPDATE public.payment_records SET "paymentNumber" = ${paymentNumber} WHERE id = ${existingPending[0].id}
          `)
        }
      } else {
        // Insert a fresh PENDING balance payment row
        const seqRows = await tx.$queryRaw<Array<{ next_val: number }>>(Prisma.sql`
          SELECT nextval('public.payment_number_seq')::int AS next_val
        `)
        const nextSeq = seqRows[0]?.next_val ?? 1
        paymentNumber = `PAY-${new Date().getFullYear()}-${String(nextSeq).padStart(5, "0")}`
        await tx.$executeRaw(Prisma.sql`
          INSERT INTO public.payment_records (
            id, "inquiryId", "paymentNumber", "recordedById",
            "paymentType", "paymentMethod", status,
            amount, "remainingBalance", "paymentDate",
            "referenceNumber", remarks, "createdAt", "updatedAt"
          ) VALUES (
            ${randomUUID()}, ${inquiryId}, ${paymentNumber}, ${sessionUser.id},
            'FULL_PAYMENT'::"PaymentType", ${paymentMethod}, 'PENDING'::"PaymentStatus",
            ${resolvedAmount}, 0, CURRENT_TIMESTAMP,
            ${paymentNote}, ${paymentNote}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          )
        `)
      }

      // Chat message
      const chatBody = `Customer submitted remaining balance payment ${paymentNumber} via ${paymentMethod.replace(/_/g, " ")} (₱${resolvedAmount.toFixed(2)})${paymentNote ? ": " + paymentNote : "."}`
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.order_chat_messages (id, inquiry_id, sender_user_id, sender_role, body)
        VALUES (${randomUUID()}, ${inquiryId}, ${sessionUser.id}, 'CLIENT', ${chatBody})
      `)

      // Approval history
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.approval_history (id, module, "recordId", action, "fromStatus", "toStatus", remarks, "actedById", "actedAt")
        VALUES (
          ${randomUUID()}, 'CUSTOMER_INQUIRY'::"ApprovalModule", ${inquiryId},
          'SUBMITTED'::"ApprovalAction", ${inquiry.status}, ${inquiry.status},
          ${`Customer balance payment ${paymentNumber} submitted via ${paymentMethod}`},
          ${sessionUser.id}, CURRENT_TIMESTAMP
        )
      `)
    })

    revalidatePath("/account/status")

    return NextResponse.json({
      message: "Balance payment submitted. Accounting will confirm it shortly.",
    })
  } catch (error) {
    console.error("[orders/pay-balance] Failed to submit balance payment", error)
    return NextResponse.json({ message: "Failed to submit payment. Please try again." }, { status: 500 })
  }
}
