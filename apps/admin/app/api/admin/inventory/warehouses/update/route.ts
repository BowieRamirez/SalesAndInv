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
  const street = String(formData.get("street") ?? "").trim() || null
  const city = String(formData.get("city") ?? "").trim() || null
  const country = String(formData.get("country") ?? "Philippines").trim() || "Philippines"
  const postalCode = String(formData.get("postalCode") ?? "").trim() || null

  if (!warehouseId || !code || !name) {
    return buildRedirect(request, "Warehouse ID, code, and name are required.", "error")
  }

  try {
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
        SET code = ${code}, name = ${name}, street = ${street}, city = ${city},
            country = ${country}, "postalCode" = ${postalCode}, "updatedAt" = CURRENT_TIMESTAMP
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
            street,
            city,
            country,
            postalCode,
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
