import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma, logAudit } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/accounting/follow-ups", request.url)
  url.searchParams.set("tab", "follow-ups")
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

// Regex patterns for statusNote marker manipulation
const PAYMENT_STATUS_PREFIX = "[[payment_status:"
const PAID_AMOUNT_PREFIX = "[[paid_amount:"
const PAYMENT_STATUS_PATTERN = /\[\[payment_status:[^\]]+\]\]/i
const PAID_AMOUNT_PATTERN = /\[\[paid_amount:[^\]]+\]\]/i

function updatePaymentMarkers(existingNote: string | null, paymentStatus: string, paidAmount: number): string {
  const stripped = (existingNote ?? "")
    .replace(PAYMENT_STATUS_PATTERN, "")
    .replace(PAID_AMOUNT_PATTERN, "")
    .trim()

  const markers = [
    `${PAYMENT_STATUS_PREFIX}${paymentStatus}]]`,
    `${PAID_AMOUNT_PREFIX}${paidAmount}]]`,
  ].join(" ")

  return stripped ? `${markers} ${stripped}` : markers
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser) {
    return buildRedirect(request, "Your session could not be confirmed. Please sign in again.", "error")
  }

  if (!["ACCOUNTING", "ADMIN_MANAGEMENT"].includes(currentUser.role)) {
    return buildRedirect(request, "Only accounting or executive admins can confirm payment follow-ups.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const inquiryId = String(formData.get("inquiryId") ?? "").trim()
  const statusNote = String(formData.get("statusNote") ?? "").trim()

  if (!inquiryId) {
    return buildRedirect(request, "Order ID is required.", "error")
  }

  try {
    // Fetch the customer's pending balance payment row — this is the source of truth.
    const pendingRows = await prisma.$queryRaw<
      Array<{ id: string; amount: number; paymentMethod: string | null; paymentNumber: string | null }>
    >(Prisma.sql`
      SELECT
        id,
        amount::double precision AS amount,
        "paymentMethod",
        "paymentNumber"
      FROM public.payment_records
      WHERE "inquiryId" = ${inquiryId}
        AND status = 'PENDING'::"PaymentStatus"
      ORDER BY "createdAt" DESC
      LIMIT 1
    `)

    const pending = pendingRows[0]

    if (!pending) {
      return buildRedirect(
        request,
        "The customer has not yet submitted their balance payment. Cannot confirm.",
        "error",
      )
    }

    // Sum of all already-verified payments
    const verifiedRows = await prisma.$queryRaw<Array<{ total_paid: number }>>(Prisma.sql`
      SELECT COALESCE(SUM(amount), 0)::double precision AS total_paid
      FROM public.payment_records
      WHERE "inquiryId" = ${inquiryId}
        AND status = 'VERIFIED'::"PaymentStatus"
    `)
    const alreadyVerified = verifiedRows[0]?.total_paid ?? 0
    const totalPaid = alreadyVerified + pending.amount

    // Fetch the inquiry to get the current statusNote for marker patching
    const inquiryRows = await prisma.$queryRaw<
      Array<{ id: string; statusNote: string | null; productPrice: number }>
    >(Prisma.sql`
      SELECT ci.id, ci."statusNote", p.price::double precision AS "productPrice"
      FROM public.customer_inquiries ci
      INNER JOIN public.products p ON p.id = ci."productId"
      WHERE ci.id = ${inquiryId}
      LIMIT 1
    `)

    const inquiry = inquiryRows[0]
    if (!inquiry) {
      return buildRedirect(request, "Order not found.", "error")
    }

    const isFullyPaid = totalPaid >= inquiry.productPrice
    const nextPaymentStatus = isFullyPaid ? "FULLY_PAID" : "PARTIALLY_PAID"
    const confirmNote = statusNote || (isFullyPaid
      ? "Balance payment confirmed. Order is now fully paid."
      : "Partial balance payment confirmed by accounting.")

    // Update the statusNote markers to reflect the new payment status
    const nextStatusNote = updatePaymentMarkers(inquiry.statusNote, nextPaymentStatus, totalPaid)

    await prisma.$transaction(async (tx) => {
      // 1. Mark the pending payment_records row as VERIFIED
      await tx.$executeRaw(Prisma.sql`
        UPDATE public.payment_records
        SET status = 'VERIFIED'::"PaymentStatus",
            "verifiedAt" = CURRENT_TIMESTAMP,
            "verifiedById" = ${currentUser.id},
            "remainingBalance" = 0,
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${pending.id}
      `)

      // 2. Update the inquiry statusNote markers + traceability column
      await tx.$executeRaw(Prisma.sql`
        UPDATE public.customer_inquiries
        SET "statusNote" = ${nextStatusNote},
            "accountingConfirmedAt" = CURRENT_TIMESTAMP,
            "accountingConfirmedById" = ${currentUser.id},
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${inquiryId}
      `)

      // 3. Chat message
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.order_chat_messages (id, inquiry_id, sender_user_id, sender_role, body)
        VALUES (
          gen_random_uuid()::text,
          ${inquiryId},
          NULL,
          'SALES',
          ${confirmNote}
        )
      `)

      // 4. Approval history
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.approval_history (id, module, "recordId", action, "fromStatus", "toStatus", remarks, "actedById", "actedAt")
        VALUES (
          gen_random_uuid()::text,
          'CUSTOMER_INQUIRY'::"ApprovalModule",
          ${inquiryId},
          'APPROVED'::"ApprovalAction",
          'BALANCE_PENDING',
          ${nextPaymentStatus},
          ${confirmNote},
          ${currentUser.id},
          CURRENT_TIMESTAMP
        )
      `)
    })

    // Audit log
    await logAudit({
      actorId: currentUser.authUserId,
      action: "PAYMENT_ACCEPTED",
      entityType: "PAYMENT",
      entityId: inquiryId,
      metadata: {
        paymentNumber: pending.paymentNumber,
        paymentMethod: pending.paymentMethod,
        balanceAmount: pending.amount,
        totalPaid,
        paymentStatus: nextPaymentStatus,
        confirmedBy: currentUser.name,
      },
    })

    revalidatePath("/accounting")
    revalidatePath("/accounting/follow-ups")
    revalidatePath("/inventory")
    revalidatePath("/operations")
    revalidatePath("/account/status")

    return buildRedirect(
      request,
      isFullyPaid
        ? "Balance payment confirmed. Order is now fully paid."
        : "Partial balance payment confirmed.",
      "success",
    )
  } catch (error) {
    console.error("Failed to confirm payment follow-up.", error)
    const message = error instanceof Error ? error.message : "Confirmation failed. Please try again."
    return buildRedirect(request, message, "error")
  }
}
