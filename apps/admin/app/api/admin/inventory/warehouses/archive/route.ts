import { randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"

function buildRedirect(request: Request, message: string, tone: "success" | "error", tab = "locations") {
  const url = new URL("/operations", request.url)
  url.searchParams.set("tab", tab)
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser || !["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
    return buildRedirect(request, "Only operations or executive admins can archive warehouse locations.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin
  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const warehouseId = String(formData.get("warehouseId") ?? "").trim()
  const action = String(formData.get("action") ?? "archive").trim() // "archive" | "restore"
  const returnTab = action === "restore" ? "archived-warehouses" : "locations"

  if (!warehouseId) {
    return buildRedirect(request, "Warehouse ID is required.", "error", returnTab)
  }

  try {
    const rows = await prisma.$queryRaw<Array<{ id: string; code: string; name: string; archivedAt: Date | null }>>(Prisma.sql`
      SELECT id, code, name, "archivedAt" FROM public.warehouses WHERE id = ${warehouseId} LIMIT 1
    `)

    const warehouse = rows[0]
    if (!warehouse) {
      return buildRedirect(request, "Warehouse not found.", "error", returnTab)
    }

    if (action === "restore") {
      if (!warehouse.archivedAt) {
        return buildRedirect(request, "That warehouse is not archived.", "error", returnTab)
      }

      await prisma.$transaction(async (tx) => {
        await tx.$executeRaw(Prisma.sql`
          UPDATE public.warehouses SET "archivedAt" = NULL, "updatedAt" = CURRENT_TIMESTAMP
          WHERE id = ${warehouseId}
        `)

        await tx.$executeRaw(Prisma.sql`
          INSERT INTO public.audit_logs (id, "actorId", action, "entityType", "entityId", metadata, "createdAt")
          VALUES (
            ${randomUUID()},
            ${currentUser.id},
            'USER_UPDATED'::"AuditAction",
            'USER'::"AuditEntityType",
            ${warehouseId},
            ${JSON.stringify({
              auditLabel: "WAREHOUSE_LOCATION_RESTORED",
              warehouseId,
              code: warehouse.code,
              name: warehouse.name,
              restoredBy: currentUser.name,
            })}::jsonb,
            CURRENT_TIMESTAMP
          )
        `)
      })

      revalidatePath("/operations")
      return buildRedirect(request, `Warehouse "${warehouse.name}" restored successfully.`, "success", "locations")
    }

    // Archive
    if (warehouse.archivedAt) {
      return buildRedirect(request, "That warehouse is already archived.", "error", returnTab)
    }

    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw(Prisma.sql`
        UPDATE public.warehouses
        SET "archivedAt" = CURRENT_TIMESTAMP, "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${warehouseId}
      `)

      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.audit_logs (id, "actorId", action, "entityType", "entityId", metadata, "createdAt")
        VALUES (
          ${randomUUID()},
          ${currentUser.id},
          'USER_UPDATED'::"AuditAction",
          'USER'::"AuditEntityType",
          ${warehouseId},
          ${JSON.stringify({
            auditLabel: "WAREHOUSE_LOCATION_ARCHIVED",
            warehouseId,
            code: warehouse.code,
            name: warehouse.name,
            archivedBy: currentUser.name,
          })}::jsonb,
          CURRENT_TIMESTAMP
        )
      `)
    })

    revalidatePath("/operations")
    return buildRedirect(request, `Warehouse "${warehouse.name}" archived successfully.`, "success", "locations")
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not archive the warehouse."
    return buildRedirect(request, message, "error", returnTab)
  }
}
