import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/inventory", request.url)
  url.searchParams.set("tab", "all-stocks")
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser || !["INVENTORY", "ADMIN_MANAGEMENT"].includes(currentUser.role)) {
    return buildRedirect(request, "Only inventory or executive admins can add stock.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const stockItemIds = formData.getAll("stockItemIds").map(String)
  const referenceNumber = String(formData.get("referenceNumber") ?? "").trim()

  if (stockItemIds.length === 0) {
    return buildRedirect(request, "No items selected for bulk restock.", "error")
  }

  const updates: Array<{ id: string; quantity: number }> = []

  for (const id of stockItemIds) {
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
        const { id: stockItemId, quantity } = update

        const existingItem = await tx.$queryRaw<Array<{ id: string; sku: string; itemName: string }>>(Prisma.sql`
          SELECT id, sku, "itemName"
          FROM public.stock_items
          WHERE id = ${stockItemId}
            AND "itemType" = 'RAW_MATERIAL'::"InventoryItemType"
          LIMIT 1
        `)

        if (!existingItem[0]) {
          throw new Error(`Raw material with ID ${stockItemId} could not be found.`)
        }

        await tx.$executeRaw(Prisma.sql`
          UPDATE public.stock_items
          SET
            "availableQty" = "availableQty" + ${quantity},
            "updatedAt" = CURRENT_TIMESTAMP
          WHERE id = ${stockItemId}
        `)

        await tx.$executeRaw(Prisma.sql`
          INSERT INTO public.stock_movements (
            id,
            "stockItemId",
            type,
            quantity,
            "referenceNumber",
            "createdAt"
          )
          VALUES (
            gen_random_uuid(),
            ${stockItemId},
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
            'USER_UPDATED'::"AuditAction",
            'USER'::"AuditEntityType",
            ${stockItemId},
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

    revalidatePath("/inventory")
    return buildRedirect(request, `Successfully restocked ${updates.length} raw materials.`, "success")
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : "Neon DB could not process the bulk restock."
    return buildRedirect(request, message, "error")
  }
}
