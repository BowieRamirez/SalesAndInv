import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma, logAudit } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/operations", request.url)
  url.searchParams.set("tab", "inv-approvals")
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser) {
    return buildRedirect(request, "Your session could not be confirmed. Please sign in again.", "error")
  }

  if (!["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
    return buildRedirect(request, "Only operations or executive admins can reject inventory approvals.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin
  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const inquiryId = String(formData.get("inquiryId") ?? "").trim()
  const rejectReason = String(formData.get("rejectReason") ?? "").trim()
    || "Inventory rejected: required materials are not available or insufficient."

  if (!inquiryId) {
    return buildRedirect(request, "Order ID is required.", "error")
  }

  try {
    // Verify the order is still in the PENDING_INVENTORY_APPROVAL stage
    const rows = await prisma.$queryRaw<Array<{ id: string; status: string; productName: string }>>(Prisma.sql`
      SELECT ci.id, ci.status::text AS status, p.name AS "productName"
      FROM public.customer_inquiries ci
      INNER JOIN public.products p ON p.id = ci."productId"
      WHERE ci.id = ${inquiryId}
        AND ci.status = 'PENDING_INVENTORY_APPROVAL'::"InquiryStatus"
      LIMIT 1
    `)

    const inquiry = rows[0]

    if (!inquiry) {
      return buildRedirect(request, "That order is no longer waiting on inventory approval.", "error")
    }

    // Move back to RECEIVED so sales can re-review, with a rejection note
    await prisma.$executeRaw(Prisma.sql`
      UPDATE public.customer_inquiries
      SET
        status = 'RECEIVED'::"InquiryStatus",
        "statusNote" = ${rejectReason},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${inquiryId}
        AND status = 'PENDING_INVENTORY_APPROVAL'::"InquiryStatus"
    `)

    revalidatePath("/operations")
    revalidatePath("/sales")
    revalidatePath("/account/status")

    await logAudit({
      actorId: currentUser.authUserId,
      action: "STOCK_REQUEST_REJECTED",
      entityType: "INVENTORY",
      entityId: inquiryId,
      metadata: {
        auditLabel: "INVENTORY_APPROVAL_REJECTED",
        productName: inquiry.productName,
        rejectReason,
        rejectedBy: currentUser.name,
      },
    })

    return buildRedirect(
      request,
      `Order for "${inquiry.productName}" rejected and returned to sales. Reason: ${rejectReason}`,
      "success",
    )
  } catch (error) {
    console.error("Failed to reject inventory approval.", error)
    const message = error instanceof Error ? error.message : "Rejection failed. Please try again."
    return buildRedirect(request, message, "error")
  }
}
