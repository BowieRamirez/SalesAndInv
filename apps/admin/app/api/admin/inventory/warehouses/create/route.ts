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
    return buildRedirect(request, "Only operations or executive admins can add warehouse locations.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const code = String(formData.get("code") ?? "").trim().toUpperCase()
  const name = String(formData.get("name") ?? "").trim()
  const address = String(formData.get("address") ?? "").trim()

  if (!code || !name || !address) {
    return buildRedirect(request, "Warehouse code, name, and address are required.", "error")
  }

  try {
    const warehouseId = randomUUID()

    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.warehouses (id, code, name, address, "createdAt", "updatedAt")
        VALUES (${warehouseId}, ${code}, ${name}, ${address}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `)

      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.audit_logs (id, "actorId", action, "entityType", "entityId", metadata, "createdAt")
        VALUES (
          ${randomUUID()},
          ${currentUser.id},
          'USER_UPDATED'::"AuditAction",
          'USER'::"AuditEntityType",
          ${warehouseId},
          ${JSON.stringify({ auditLabel: "WAREHOUSE_LOCATION_CREATED", code, name, address })}::jsonb,
          CURRENT_TIMESTAMP
        )
      `)
    })

    revalidatePath("/operations")
    return buildRedirect(request, "Warehouse location was added.", "success")
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : "Neon DB could not create that warehouse location."
    return buildRedirect(request, message, "error")
  }
}
