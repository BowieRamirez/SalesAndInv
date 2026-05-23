import { randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma, logAudit } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import { generatePoNumber } from "@/lib/procurement"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/operations", request.url)
  url.searchParams.set("tab", "procurement")
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()
  if (!currentUser || !["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
    return buildRedirect(request, "Only operations or executive admins can manage purchase orders.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin
  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const action = String(formData.get("action") ?? "").trim()

  try {
    // ── CREATE ──────────────────────────────────────────────────────────────
    if (action === "create") {
      const supplierId = String(formData.get("supplierId") ?? "").trim() || null
      const remarks = String(formData.get("remarks") ?? "").trim() || null
      const expectedDeliveryAt = String(formData.get("expectedDeliveryAt") ?? "").trim() || null

      const materialIds = formData.getAll("materialId").map((v) => String(v).trim()).filter(Boolean)
      const quantities = formData.getAll("quantity").map((v) => parseInt(String(v), 10))
      const unitCosts = formData.getAll("unitCost").map((v) => {
        const n = parseFloat(String(v))
        return Number.isFinite(n) ? n : null
      })

      if (materialIds.length === 0) {
        return buildRedirect(request, "Add at least one material to the purchase order.", "error")
      }

      const poId = randomUUID()
      const poNumber = await generatePoNumber()

      // Compute total
      let total = 0
      const items = materialIds.map((matId, i) => {
        const qty = quantities[i] ?? 1
        const cost = unitCosts[i] ?? 0
        const lineTotal = qty * cost
        total += lineTotal
        return { matId, qty, cost, lineTotal }
      })

      await prisma.$transaction(async (tx) => {
        await tx.$executeRaw(Prisma.sql`
          INSERT INTO public.purchase_orders (id, "poNumber", "supplierId", "requestedById", status, "totalAmount", remarks, "expectedDeliveryAt", "createdAt", "updatedAt")
          VALUES (${poId}, ${poNumber}, ${supplierId}, ${currentUser.id}, 'DRAFT'::"PurchaseOrderStatus", ${new Prisma.Decimal(total)}, ${remarks}, ${expectedDeliveryAt ? new Date(expectedDeliveryAt) : null}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `)

        for (const item of items) {
          await tx.$executeRaw(Prisma.sql`
            INSERT INTO public.purchase_order_items (id, "purchaseOrderId", "materialStockId", "quantityOrdered", "quantityReceived", "unitCost", "lineTotal", "createdAt")
            VALUES (${randomUUID()}, ${poId}, ${item.matId}, ${item.qty}, 0, ${item.cost != null ? new Prisma.Decimal(item.cost) : null}, ${new Prisma.Decimal(item.lineTotal)}, CURRENT_TIMESTAMP)
          `)
        }
      })

      await logAudit({
        actorId: currentUser.authUserId,
        action: "PURCHASE_ORDER_CREATED",
        entityType: "PURCHASE_ORDER",
        entityId: poId,
        metadata: { poNumber, totalAmount: total, itemCount: items.length },
      })

      revalidatePath("/operations")
      return buildRedirect(request, `Purchase order ${poNumber} created as draft.`, "success")
    }

    // ── SUBMIT FOR APPROVAL ──────────────────────────────────────────────────
    if (action === "submit") {
      const poId = String(formData.get("poId") ?? "").trim()
      await prisma.$executeRaw(Prisma.sql`
        UPDATE public.purchase_orders
        SET status = 'PENDING_APPROVAL'::"PurchaseOrderStatus", "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${poId} AND "requestedById" = ${currentUser.id} AND status = 'DRAFT'::"PurchaseOrderStatus"
      `)
      revalidatePath("/operations")
      revalidatePath("/approvals")
      return buildRedirect(request, "Purchase order submitted for approval.", "success")
    }

    // ── MARK AS ORDERED ──────────────────────────────────────────────────────
    if (action === "mark-ordered") {
      const poId = String(formData.get("poId") ?? "").trim()
      await prisma.$executeRaw(Prisma.sql`
        UPDATE public.purchase_orders
        SET status = 'ORDERED'::"PurchaseOrderStatus", "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${poId} AND status = 'APPROVED'::"PurchaseOrderStatus"
      `)
      revalidatePath("/operations")
      return buildRedirect(request, "Purchase order marked as ordered.", "success")
    }

    // ── CANCEL ───────────────────────────────────────────────────────────────
    if (action === "cancel") {
      const poId = String(formData.get("poId") ?? "").trim()
      await prisma.$executeRaw(Prisma.sql`
        UPDATE public.purchase_orders
        SET status = 'CANCELLED'::"PurchaseOrderStatus", "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${poId} AND status IN ('DRAFT'::"PurchaseOrderStatus", 'PENDING_APPROVAL'::"PurchaseOrderStatus")
      `)
      revalidatePath("/operations")
      revalidatePath("/approvals")
      return buildRedirect(request, "Purchase order cancelled.", "success")
    }

    // ── RECEIVE GOODS ────────────────────────────────────────────────────────
    if (action === "receive") {
      const poId = String(formData.get("poId") ?? "").trim()
      const itemIds = formData.getAll("itemId").map((v) => String(v).trim())
      const receivedQtys = formData.getAll("receivedQty").map((v) => parseInt(String(v), 10))

      if (itemIds.length === 0) {
        return buildRedirect(request, "No items to receive.", "error")
      }

      // Load PO items to get materialStockId and ordered qty
      const poItems = await prisma.$queryRaw<Array<{
        id: string
        materialStockId: string
        quantityOrdered: number
        quantityReceived: number
        sku: string
        itemName: string
      }>>(Prisma.sql`
        SELECT poi.id, poi."materialStockId", poi."quantityOrdered", poi."quantityReceived",
               ms.sku, ms."itemName"
        FROM public.purchase_order_items poi
        INNER JOIN public.material_stocks ms ON ms.id = poi."materialStockId"
        WHERE poi."purchaseOrderId" = ${poId}
      `)

      const po = await prisma.$queryRaw<Array<{ poNumber: string }>>(Prisma.sql`
        SELECT "poNumber" FROM public.purchase_orders WHERE id = ${poId} LIMIT 1
      `)
      const poNumber = po[0]?.poNumber ?? poId

      await prisma.$transaction(async (tx) => {
        for (let i = 0; i < itemIds.length; i++) {
          const itemId = itemIds[i]!
          const qty = receivedQtys[i] ?? 0
          if (qty <= 0) continue

          const poItem = poItems.find((p) => p.id === itemId)
          if (!poItem) continue

          // Update received qty on PO item
          await tx.$executeRaw(Prisma.sql`
            UPDATE public.purchase_order_items
            SET "quantityReceived" = "quantityReceived" + ${qty}
            WHERE id = ${itemId}
          `)

          // Add to material stock
          await tx.$executeRaw(Prisma.sql`
            UPDATE public.material_stocks
            SET "availableQty" = "availableQty" + ${qty}, "updatedAt" = CURRENT_TIMESTAMP
            WHERE id = ${poItem.materialStockId}
          `)

          // Stock movement
          await tx.$executeRaw(Prisma.sql`
            INSERT INTO public.stock_movements (id, "materialStockId", "stockItemId", type, quantity, "referenceNumber", "createdAt")
            VALUES (${randomUUID()}, ${poItem.materialStockId}, ${poItem.materialStockId}, 'IN'::"StockMovementType", ${qty}, ${poNumber}, CURRENT_TIMESTAMP)
          `)
        }

        // Check if fully received
        const updatedItems = await tx.$queryRaw<Array<{ quantityOrdered: number; quantityReceived: number }>>(Prisma.sql`
          SELECT "quantityOrdered", "quantityReceived" FROM public.purchase_order_items WHERE "purchaseOrderId" = ${poId}
        `)
        const allReceived = updatedItems.every((item) => item.quantityReceived >= item.quantityOrdered)
        const newStatus = allReceived ? "GOODS_RECEIVED" : "ORDERED"

        await tx.$executeRaw(Prisma.sql`
          UPDATE public.purchase_orders
          SET status = ${newStatus}::"PurchaseOrderStatus", "updatedAt" = CURRENT_TIMESTAMP
          WHERE id = ${poId}
        `)
      })

      await logAudit({
        actorId: currentUser.authUserId,
        action: "GOODS_RECEIVED",
        entityType: "PURCHASE_ORDER",
        entityId: poId,
        metadata: { poNumber, receivedItemCount: itemIds.length },
      })

      revalidatePath("/operations")
      return buildRedirect(request, `Goods received for ${poNumber}. Stock updated.`, "success")
    }

    return buildRedirect(request, "Invalid action.", "error")
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not process purchase order."
    return buildRedirect(request, message, "error")
  }
}
