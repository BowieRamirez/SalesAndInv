import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getStorefrontSessionUser } from "@/lib/auth/session"

// Statuses where payment has NOT yet been confirmed — cancellation is allowed
const CANCELLABLE_STATUSES = new Set([
  "RECEIVED",
  "ACCEPTED",
  "PENDING_INVENTORY_APPROVAL",
])

// Statuses that mean payment is confirmed or further along — no cancellation
const PAYMENT_CONFIRMED_STATUSES = new Set([
  "WAITING_FOR_PAYMENT",
  "PENDING_ACCOUNTING_APPROVAL",
  "GETTING_READY_FOR_BUILDING",
  "READY_FOR_SHIPMENT",
  "READY_FOR_SHIPPING",
  "COMPLETED",
])

export async function POST(request: Request) {
  const sessionUser = await getStorefrontSessionUser()

  if (!sessionUser) {
    return NextResponse.json(
      { message: "Please sign in before cancelling an order." },
      { status: 401 },
    )
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin
  if (requestOrigin && requestOrigin !== appOrigin) {
    return NextResponse.json({ message: "Invalid request origin." }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const inquiryId = typeof body?.inquiryId === "string" ? body.inquiryId.trim() : ""

  if (!inquiryId) {
    return NextResponse.json({ message: "Order ID is required." }, { status: 400 })
  }

  // Fetch the inquiry and verify ownership + status
  const rows = await prisma.$queryRaw<
    Array<{ id: string; status: string; statusNote: string | null; customerUserId: string | null; productName: string }>
  >(Prisma.sql`
    SELECT
      ci.id,
      ci.status::text AS status,
      ci."statusNote",
      ci."customerUserId",
      p.name AS "productName"
    FROM public.customer_inquiries ci
    INNER JOIN public.products p ON p.id = ci."productId"
    WHERE ci.id = ${inquiryId}
    LIMIT 1
  `)

  const inquiry = rows[0]

  if (!inquiry) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 })
  }

  // Verify ownership
  if (inquiry.customerUserId !== sessionUser.id) {
    return NextResponse.json({ message: "You can only cancel your own orders." }, { status: 403 })
  }

  // Check if already completed
  if (inquiry.statusNote?.includes("[[completed]]")) {
    return NextResponse.json(
      { message: "This order is already completed and cannot be cancelled." },
      { status: 400 },
    )
  }

  // Block cancellation if payment is confirmed or order is further along
  if (PAYMENT_CONFIRMED_STATUSES.has(inquiry.status)) {
    return NextResponse.json(
      {
        message:
          "This order can no longer be cancelled because payment has already been confirmed. Please contact our sales team if you need assistance.",
      },
      { status: 400 },
    )
  }

  if (!CANCELLABLE_STATUSES.has(inquiry.status)) {
    return NextResponse.json(
      { message: "This order cannot be cancelled at its current stage." },
      { status: 400 },
    )
  }

  // Cancel the order — set cancelled timestamp/actor and mark as completed with a cancellation note
  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw(Prisma.sql`
      UPDATE public.customer_inquiries
      SET
        status = 'COMPLETED'::"InquiryStatus",
        "statusNote" = '[[completed]] Cancelled by customer.',
        "cancelledAt" = CURRENT_TIMESTAMP,
        "cancelledById" = ${sessionUser.id},
        "completedAt" = CURRENT_TIMESTAMP,
        "completedById" = ${sessionUser.id},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${inquiryId}
        AND "customerUserId" = ${sessionUser.id}
    `)

    // Approval history entry for traceability
    await tx.$executeRaw(Prisma.sql`
      INSERT INTO public.approval_history (id, module, "recordId", action, "fromStatus", "toStatus", remarks, "actedById", "actedAt")
      VALUES (
        gen_random_uuid(),
        'CUSTOMER_INQUIRY'::"ApprovalModule",
        ${inquiryId},
        'REJECTED'::"ApprovalAction",
        ${inquiry.status},
        'CANCELLED',
        'Cancelled by customer.',
        ${sessionUser.id},
        CURRENT_TIMESTAMP
      )
    `)
  })

  revalidatePath("/account/status")

  return NextResponse.json({
    ok: true,
    message: `Your order for "${inquiry.productName}" has been cancelled.`,
  })
}
