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

  if (!currentUser || !["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
    return buildRedirect(request, "Only operations or executive admins can remove stock.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const materialStockId = String(formData.get("materialStockId") ?? "").trim()
  const quantity = Number.parseInt(String(formData.get("quantity") ?? "0"), 10)
  const referenceNumber = String(formData.get("referenceNumber") ?? "").trim()
  const reasonCategory = String(formData.get("reasonCategory") ?? "OTHER").trim()
  const reasonDetails = String(formData.get("reasonDetails") ?? "").trim()

  if (!materialStockId) {
    return buildRedirect(request, "Select a raw material to deduct stock from.", "error")
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return buildRedirect(request, "Stock quantity must be greater than zero.", "error")
  }

  try {
    await prisma.$transaction(async (tx) => {
      const existingItem = await tx.$queryRaw<Array<{ id: string; sku: string; itemName: string; availableQty: number }>>(Prisma.sql`
        SELECT id, sku, "itemName", "availableQty"
        FROM public.material_stocks
        WHERE id = ${materialStockId}
        LIMIT 1
      `)

      if (!existingItem[0]) {
        throw new Error("The selected raw material could not be found.")
      }

      if (existingItem[0].availableQty < quantity) {
        throw new Error("Cannot remove more stock than is currently available.")
      }

      await tx.$executeRaw(Prisma.sql`
        UPDATE public.material_stocks
        SET
          "availableQty" = "availableQty" - ${quantity},
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${materialStockId}
      `)

      const movementType = reasonCategory === "DAMAGE" ? "DAMAGE" : "OUT"

      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.stock_movements (
          id,
          "materialStockId",
          "stockItemId",
          type,
          quantity,
          "referenceNumber",
          "projectPurpose",
          "createdAt"
        )
        VALUES (
          ${randomUUID()},
          ${materialStockId},
          ${materialStockId},
          ${movementType}::"StockMovementType",
          ${quantity},
          ${referenceNumber || null},
          ${reasonDetails || null},
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
          'STOCK_REMOVED'::"AuditAction",
          'STOCK'::"AuditEntityType",
          ${materialStockId},
          ${JSON.stringify({
            auditLabel: "RAW_MATERIAL_STOCK_REMOVED",
            sku: existingItem[0].sku,
            itemName: existingItem[0].itemName,
            quantity,
            referenceNumber: referenceNumber || null,
            reasonCategory,
            reasonDetails,
          })}::jsonb,
          CURRENT_TIMESTAMP
        )
      `)
    })

    revalidatePath("/operations")
    return buildRedirect(request, "Stock was removed from the selected raw material.", "success")
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Neon DB could not update that raw material stock."

    return buildRedirect(request, message, "error")
  }
}
