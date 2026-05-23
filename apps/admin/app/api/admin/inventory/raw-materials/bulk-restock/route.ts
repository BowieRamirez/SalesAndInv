import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/operations", request.url)
  url.searchParams.set("tab", "all-stocks")
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser || !["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
    return buildRedirect(request, "Only operations or executive admins can add stock.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const materialStockIds = formData.getAll("materialStockIds").map(String)
  const referenceNumber = String(formData.get("referenceNumber") ?? "").trim()

  if (materialStockIds.length === 0) {
    return buildRedirect(request, "No items selected for bulk restock.", "error")
  }

  const updates: Array<{ id: string; quantity: number }> = []

  for (const id of materialStockIds) {
    const qtyRaw = formData.get(`quantity_${id}`)
    const quantity = Number.parseInt(String(qtyRaw ?? "0"), 10)
    if (Number.isFinite(quantity) && quantity > 0) {
      updates.push({ id, quantity })
    }
  }

  if (updates.length === 0) {
    return buildRedirect(request, "All inputted quantities were invalid or zero.", "error")
  }

  try {
    await prisma.$transaction(async (tx) => {
      for (const update of updates) {
        const { id: materialStockId, quantity } = update

        const existingItem = await tx.$queryRaw<Array<{ id: string; sku: string; itemName: string }>>(Prisma.sql`
          SELECT id, sku, "itemName"
          FROM public.material_stocks
          WHERE id = ${materialStockId}
          LIMIT 1
        `)

        if (!existingItem[0]) {
          throw new Error(`Raw material with ID ${materialStockId} could not be found.`)
        }

        await tx.$executeRaw(Prisma.sql`
          UPDATE public.material_stocks
          SET
            "availableQty" = "availableQty" + ${quantity},
            "updatedAt" = CURRENT_TIMESTAMP
          WHERE id = ${materialStockId}
        `)

        await tx.$executeRaw(Prisma.sql`
          INSERT INTO public.stock_movements (
            id,
            "materialStockId",
            "stockItemId",
            type,
            quantity,
            "referenceNumber",
            "createdAt"
          )
          VALUES (
            gen_random_uuid(),
            ${materialStockId},
            ${materialStockId},
            'IN'::"StockMovementType",
            ${quantity},
            ${referenceNumber || null},
            CURRENT_TIMESTAMP
          )
        `)

        await tx.$executeRaw(Prisma.sql`
          INSERT INTO public.audit_logs (
            id,
            "actorId",
            action,
            "entityType",
            "entityId",
            metadata,
            "createdAt"
          )
          VALUES (
            gen_random_uuid(),
            ${currentUser.id},
            'STOCK_ADDED'::"AuditAction",
            'STOCK'::"AuditEntityType",
            ${materialStockId},
            ${JSON.stringify({
              auditLabel: "RAW_MATERIAL_STOCK_ADDED",
              sku: existingItem[0].sku,
              itemName: existingItem[0].itemName,
              quantity,
              referenceNumber: referenceNumber || null,
            })}::jsonb,
            CURRENT_TIMESTAMP
          )
        `)
      }
    })

    revalidatePath("/operations")
    return buildRedirect(request, `Successfully restocked ${updates.length} raw materials.`, "success")
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : "Neon DB could not process the bulk restock."
    return buildRedirect(request, message, "error")
  }
}
