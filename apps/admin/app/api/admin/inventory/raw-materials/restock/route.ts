import { randomUUID } from "node:crypto"
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

  if (!currentUser || !["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT"].includes(currentUser.role)) {
    return buildRedirect(request, "Only operations or executive admins can add stock.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const stockItemId = String(formData.get("stockItemId") ?? "").trim()
  const quantity = Number.parseInt(String(formData.get("quantity") ?? "0"), 10)
  const referenceNumber = String(formData.get("referenceNumber") ?? "").trim()

  if (!stockItemId) {
    return buildRedirect(request, "Select a raw material to restock.", "error")
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return buildRedirect(request, "Stock quantity must be greater than zero.", "error")
  }

  try {
    await prisma.$transaction(async (tx) => {
      const existingItem = await tx.$queryRaw<Array<{ id: string; sku: string; itemName: string }>>(Prisma.sql`
        SELECT id, sku, "itemName"
        FROM public.stock_items
        WHERE id = ${stockItemId}
          AND "itemType" = 'RAW_MATERIAL'::"InventoryItemType"
        LIMIT 1
      `)

      if (!existingItem[0]) {
        throw new Error("The selected raw material could not be found.")
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
          ${randomUUID()},
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
          ${randomUUID()},
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
    })

    revalidatePath("/operations")
    return buildRedirect(request, "Stock was added to the selected raw material.", "success")
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Neon DB could not update that raw material stock."

    return buildRedirect(request, message, "error")
  }
}
