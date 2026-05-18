import { randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/operations", request.url)
  url.searchParams.set("tab", "locations")
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser || !["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
    return buildRedirect(request, "Only operations or executive admins can edit warehouse locations.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin
  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const warehouseId = String(formData.get("warehouseId") ?? "").trim()
  const code = String(formData.get("code") ?? "").trim().toUpperCase()
  const name = String(formData.get("name") ?? "").trim()
  const address = String(formData.get("address") ?? "").trim()

  if (!warehouseId || !code || !name || !address) {
    return buildRedirect(request, "Warehouse ID, code, name, and address are required.", "error")
  }

  try {
    // Check the warehouse exists and is not archived
    const rows = await prisma.$queryRaw<Array<{ id: string; code: string; name: string }>>(Prisma.sql`
      SELECT id, code, name FROM public.warehouses
      WHERE id = ${warehouseId} AND "archivedAt" IS NULL
      LIMIT 1
    `)

    if (!rows[0]) {
      return buildRedirect(request, "Warehouse not found or already archived.", "error")
    }

    const prev = rows[0]

    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw(Prisma.sql`
        UPDATE public.warehouses
        SET code = ${code}, name = ${name}, address = ${address}, "updatedAt" = CURRENT_TIMESTAMP
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
            auditLabel: "WAREHOUSE_LOCATION_UPDATED",
            warehouseId,
            previousCode: prev.code,
            previousName: prev.name,
            newCode: code,
            newName: name,
            newAddress: address,
            updatedBy: currentUser.name,
          })}::jsonb,
          CURRENT_TIMESTAMP
        )
      `)
    })

    revalidatePath("/operations")
    return buildRedirect(request, `Warehouse "${name}" updated successfully.`, "success")
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update the warehouse."
    return buildRedirect(request, message, "error")
  }
}
