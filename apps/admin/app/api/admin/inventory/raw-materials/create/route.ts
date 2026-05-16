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

async function generateRawMaterialSku() {
  const rows = await prisma.stockItem.findMany({
    where: {
      sku: {
        startsWith: "RM-",
      },
    },
    select: {
      sku: true,
    },
    orderBy: {
      sku: "desc",
    },
    take: 1,
  })

  const latestSku = rows[0]?.sku ?? "RM-000"
  const latestNumber = Number.parseInt(latestSku.replace("RM-", ""), 10)
  const nextNumber = Number.isFinite(latestNumber) ? latestNumber + 1 : 1

  return `RM-${String(nextNumber).padStart(3, "0")}`
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser || !["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT"].includes(currentUser.role)) {
    return buildRedirect(request, "Only operations or executive admins can add raw materials.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const itemName = String(formData.get("itemName") ?? "").trim()
  const warehouseId = String(formData.get("warehouseId") ?? "").trim()
  const unitOfMeasure = String(formData.get("unitOfMeasure") ?? "pcs").trim() || "pcs"
  const rawSku = String(formData.get("sku") ?? "").trim().toUpperCase()
  const description = String(formData.get("description") ?? "").trim()
  const reorderThreshold = Number.parseInt(String(formData.get("reorderThreshold") ?? "10"), 10)
  const openingQty = Number.parseInt(String(formData.get("openingQty") ?? "0"), 10)
  const referenceNumber = String(formData.get("referenceNumber") ?? "").trim()

  if (!itemName || !warehouseId) {
    return buildRedirect(request, "Item name and warehouse are required.", "error")
  }

  if (!Number.isFinite(reorderThreshold) || reorderThreshold < 0) {
    return buildRedirect(request, "Reorder threshold must be zero or higher.", "error")
  }

  if (!Number.isFinite(openingQty) || openingQty < 0) {
    return buildRedirect(request, "Opening stock must be zero or higher.", "error")
  }

  try {
    const sku = rawSku || (await generateRawMaterialSku())
    const stockItemId = randomUUID()

    await prisma.$executeRaw(Prisma.sql`
      INSERT INTO public.stock_items (
        id,
        "warehouseId",
        sku,
        "itemName",
        description,
        "unitOfMeasure",
        "availableQty",
        "reservedQty",
        "reorderThreshold",
        state,
        "itemType",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${stockItemId},
        ${warehouseId},
        ${sku},
        ${itemName},
        ${description || null},
        ${unitOfMeasure},
        ${openingQty},
        0,
        ${reorderThreshold},
        'AVAILABLE'::"StockState",
        'RAW_MATERIAL'::"InventoryItemType",
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
    `)

    await prisma.$executeRaw(Prisma.sql`
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
          auditLabel: "RAW_MATERIAL_CREATED",
          sku,
          itemName,
          warehouseId,
          openingQty,
          reorderThreshold,
          unitOfMeasure,
          referenceNumber: referenceNumber || null,
        })}::jsonb,
        CURRENT_TIMESTAMP
      )
    `)

    if (openingQty > 0) {
      await prisma.$executeRaw(Prisma.sql`
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
          ${openingQty},
          ${referenceNumber || null},
          CURRENT_TIMESTAMP
        )
      `)

      await prisma.$executeRaw(Prisma.sql`
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
            sku,
            itemName,
            quantity: openingQty,
            referenceNumber: referenceNumber || null,
          })}::jsonb,
          CURRENT_TIMESTAMP
        )
      `)
    }

    revalidatePath("/operations")
    return buildRedirect(request, `Added raw material ${sku} to Neon DB.`, "success")
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Neon DB could not create that raw material."

    return buildRedirect(request, message, "error")
  }
}
