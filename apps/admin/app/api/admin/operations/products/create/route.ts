import { randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma, logAudit } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import {
  buildProductMaterialSummary,
  collectSelectedMaterialIds,
  generateFinishedProductSku,
  generateUniqueProductSlug,
  getExistingRawMaterials,
  parseDecimal,
  parseInteger,
  splitLines,
} from "@/lib/operations-products"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/operations", request.url)
  url.searchParams.set("tab", "new-products")
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser || !["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
    return buildRedirect(request, "Only operations or executive admins can create finished products.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const name = String(formData.get("name") ?? "").trim()
  const category = String(formData.get("category") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const warehouseId = String(formData.get("warehouseId") ?? "").trim()
  const imageUrl = String(formData.get("imageUrl") ?? "").trim()
  const unitOfMeasure = String(formData.get("unitOfMeasure") ?? "pcs").trim() || "pcs"
  const price = parseDecimal(formData.get("price"))
  const openingQty = parseInteger(formData.get("openingQty"), 0)
  const reorderThreshold = parseInteger(formData.get("reorderThreshold"), 10)
  const widthCm = parseDecimal(formData.get("widthCm"), "0")
  const depthCm = parseDecimal(formData.get("depthCm"), "0")
  const heightCm = parseDecimal(formData.get("heightCm"), "0")
  const weightKg = parseDecimal(formData.get("weightKg"), "0")
  const badge = String(formData.get("badge") ?? "").trim() || null
  const isPublished = String(formData.get("isPublished") ?? "").trim() === "on"
  const selectedMaterialIds = collectSelectedMaterialIds(formData)
  const draftId = String(formData.get("draftId") ?? "").trim()

  if (!name || !category || !description || !warehouseId) {
    return buildRedirect(request, "Name, category, description, and warehouse are required.", "error")
  }

  if (!Number.isFinite(price) || price < 0) {
    return buildRedirect(request, "Price must be zero or higher.", "error")
  }

  if (!Number.isFinite(openingQty) || openingQty < 0) {
    return buildRedirect(request, "Opening stock must be zero or higher.", "error")
  }

  if (!Number.isFinite(reorderThreshold) || reorderThreshold < 0) {
    return buildRedirect(request, "Reorder threshold must be zero or higher.", "error")
  }

  if (![widthCm, depthCm, heightCm, weightKg].every((value) => Number.isFinite(value) && value >= 0)) {
    return buildRedirect(request, "Dimensions and weight must be zero or higher.", "error")
  }

  if (selectedMaterialIds.length === 0) {
    return buildRedirect(
      request,
      "Select at least one raw material from inventory before creating a finished product.",
      "error",
    )
  }

  try {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: warehouseId },
      select: { id: true },
    })

    if (!warehouse) {
      return buildRedirect(request, "Choose a valid warehouse for the finished product.", "error")
    }

    const rawMaterials = await getExistingRawMaterials(selectedMaterialIds)

    if (rawMaterials.length !== selectedMaterialIds.length) {
      return buildRedirect(
        request,
        "One or more selected materials are not in raw-material inventory, so the finished product could not be created.",
        "error",
      )
    }

    const materialEntries = rawMaterials.map((material) => ({
      stockItemId: material.id,
      quantityDisplay: String(formData.get(`quantityDisplay:${material.id}`) ?? "").trim() || null,
      notes: String(formData.get(`notes:${material.id}`) ?? "").trim() || null,
      quantityRequired: (() => {
        const value = String(formData.get(`quantityRequired:${material.id}`) ?? "").trim()
        if (!value) {
          return null
        }

        const parsed = Number(value)
        return Number.isFinite(parsed) && parsed >= 0 ? new Prisma.Decimal(parsed) : null
      })(),
    }))

    const stockItemId = randomUUID()
    const productId = randomUUID()
    const sku = await generateFinishedProductSku()
    const slug = await generateUniqueProductSlug(name)
    const imageUrls = splitLines(imageUrl)
    const materialSummary = buildProductMaterialSummary(rawMaterials.map((material) => material.itemName))

    const created = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw(Prisma.sql`
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
          "createdAt",
          "updatedAt",
          "itemType"
        )
        VALUES (
          ${stockItemId},
          ${warehouseId},
          ${sku},
          ${name},
          ${description},
          ${unitOfMeasure},
          ${openingQty},
          0,
          ${reorderThreshold},
          'AVAILABLE'::"StockState",
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP,
          'FINISHED_PRODUCT'::"InventoryItemType"
        )
      `)

      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.products (
          id,
          "stockItemId",
          slug,
          name,
          category,
          material,
          price,
          badge,
          images,
          rating,
          "reviewCount",
          "widthCm",
          "depthCm",
          "heightCm",
          "weightKg",
          description,
          "isPublished",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          ${productId},
          ${stockItemId},
          ${slug},
          ${name},
          ${category},
          ${materialSummary},
          ${new Prisma.Decimal(price)},
          ${badge},
          ${JSON.stringify(imageUrls)}::jsonb,
          0,
          0,
          ${new Prisma.Decimal(widthCm)},
          ${new Prisma.Decimal(depthCm)},
          ${new Prisma.Decimal(heightCm)},
          ${new Prisma.Decimal(weightKg)},
          ${description},
          ${isPublished},
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )
      `)

      if (materialEntries.length > 0) {
        for (const entry of materialEntries) {
          await tx.$executeRaw(Prisma.sql`
            INSERT INTO public.product_materials (
              id,
              "productId",
              "stockItemId",
              "quantityRequired",
              "quantityDisplay",
              notes,
              "createdAt"
            )
            VALUES (
              ${randomUUID()},
              ${productId},
              ${entry.stockItemId},
              ${entry.quantityRequired},
              ${entry.quantityDisplay},
              ${entry.notes},
              CURRENT_TIMESTAMP
            )
          `)
        }
      }

      return { sku }
    })

    if (draftId) {
      await prisma.$executeRaw(Prisma.sql`
        UPDATE public.draft_products
        SET "deletedAt" = CURRENT_TIMESTAMP,
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${draftId}
          AND "createdById" = ${currentUser.id}
          AND "deletedAt" IS NULL
      `)
    }

    revalidatePath("/operations")
    revalidatePath("/shop")
    revalidatePath("/")

    await logAudit({
      actorId: currentUser.authUserId,
      action: "PRODUCT_CREATED",
      entityType: "PRODUCT",
      entityId: productId,
      metadata: {
        sku: created.sku,
        itemName: name,
        name,
        category,
        quantity: openingQty,
        isPublished,
      },
    })

    return buildRedirect(request, `Created finished product ${created.sku} in Neon DB.`, "success")
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Neon DB could not create that finished product."

    return buildRedirect(request, message, "error")
  }
}
