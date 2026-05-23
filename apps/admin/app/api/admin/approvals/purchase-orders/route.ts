import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma, logAudit } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/approvals", request.url)
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()
  if (!currentUser || currentUser.role !== "ADMIN_MANAGEMENT") {
    return buildRedirect(request, "Only executive admins can approve purchase orders.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin
  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const poId = String(formData.get("poId") ?? "").trim()
  const action = String(formData.get("action") ?? "").trim() // "approve" | "reject"
  const remarks = String(formData.get("remarks") ?? "").trim() || null

  if (!poId || !["approve", "reject"].includes(action)) {
    return buildRedirect(request, "Invalid request.", "error")
  }

  try {
    const pos = await prisma.$queryRaw<Array<{ id: string; poNumber: string; requestedById: string; status: string }>>(Prisma.sql`
      SELECT id, "poNumber", "requestedById", status::text AS status
      FROM public.purchase_orders
      WHERE id = ${poId} AND status = 'PENDING_APPROVAL'::"PurchaseOrderStatus"
      LIMIT 1
    `)

    const po = pos[0]
    if (!po) {
      return buildRedirect(request, "Purchase order not found or already processed.", "error")
    }

    const newStatus = action === "approve" ? "APPROVED" : "REJECTED"

    await prisma.$executeRaw(Prisma.sql`
      UPDATE public.purchase_orders
      SET status = ${newStatus}::"PurchaseOrderStatus",
          "approvedById" = ${currentUser.id},
          remarks = COALESCE(${remarks}, remarks),
          "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${poId}
    `)

    const auditAction = action === "approve" ? "PURCHASE_ORDER_APPROVED" : "PURCHASE_ORDER_REJECTED"

    // Log for executive admin
    await logAudit({
      actorId: currentUser.authUserId,
      action: auditAction as any,
      entityType: "PURCHASE_ORDER" as any,
      entityId: poId,
      metadata: {
        auditLabel: action === "approve" ? "PURCHASE_ORDER_APPROVED" : "PURCHASE_ORDER_REJECTED",
        poNumber: po.poNumber,
        approvedBy: currentUser.name,
        remarks,
      },
    })

    // Mirror log for the operations admin who requested it
    await logAudit({
      actorId: po.requestedById,
      action: auditAction as any,
      entityType: "PURCHASE_ORDER" as any,
      entityId: poId,
      metadata: {
        auditLabel: action === "approve" ? "MY_PURCHASE_ORDER_APPROVED" : "MY_PURCHASE_ORDER_REJECTED",
        poNumber: po.poNumber,
        approvedBy: currentUser.name,
        remarks,
      },
    })

    revalidatePath("/approvals")
    revalidatePath("/operations")

    return buildRedirect(
      request,
      `Purchase order ${po.poNumber} ${action === "approve" ? "approved" : "rejected"}.`,
      "success",
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not process the purchase order."
    return buildRedirect(request, message, "error")
  }
}
