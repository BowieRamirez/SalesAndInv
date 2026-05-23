import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma, logAudit } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import {
  buildProductMaterialSummary,
  collectSelectedMaterialIds,
  ensureColorVariantSkusAreGlobalUnique,
  generateUniqueProductSlug,
  getExistingRawMaterials,
  parseColorVariantsFromForm,
  parseDecimal,
  splitLines,
} from "@/lib/operations-products"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/operations", request.url)
  url.searchParams.set("tab", "finished-products")
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser || !["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
    return buildRedirect(request, "Only operations or executive admins can update finished products.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const productId = String(formData.get("productId") ?? "").trim()
  const productStockId = String(formData.get("productStockId") ?? "").trim()
  const name = String(formData.get("name") ?? "").trim()
  const category = String(formData.get("category") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const imageUrl = String(formData.get("imageUrl") ?? "").trim()
  const badge = String(formData.get("badge") ?? "").trim() || null
  const price = parseDecimal(formData.get("price"))
  const isPublished = String(formData.get("isPublished") ?? "").trim() === "on"
  const selectedMaterialIds = collectSelectedMaterialIds(formData)

  if (!productId || !productStockId || !name || !category || !description) {
    return buildRedirect(request, "Select a valid product and provide its name, category, and description.", "error")
  }

  if (selectedMaterialIds.length === 0) {
    return buildRedirect(request, "Select at least one raw material for the product's recipe.", "error")
  }

  if (!Number.isFinite(price) || price < 0) {
    return buildRedirect(request, "Price must be zero or higher.", "error")
  }

  try {
    const existingProduct = await prisma.$queryRaw<Array<{ id: string; productStockId: string; sku: string; colorVariants: unknown }>>(Prisma.sql`
      SELECT
        p.id,
        p."productStockId",
        si.sku,
        p."colorVariants"
      FROM public.products p
      INNER JOIN public.product_stocks si ON si.id = p."productStockId"
      WHERE p.id = ${productId}
      LIMIT 1
    `)

    if (!existingProduct[0] || existingProduct[0].productStockId !== productStockId) {
      return buildRedirect(request, "That finished product could not be found.", "error")
    }

    const productMainSku = existingProduct[0].sku

    // Parse and validate optional color variants
    const variantParse = parseColorVariantsFromForm(formData, { productStockSku: productMainSku })
    if (!variantParse.ok) {
      return buildRedirect(request, variantParse.error, "error")
    }
    const colorVariants = variantParse.variants
    if (colorVariants.length > 0) {
      const conflict = await ensureColorVariantSkusAreGlobalUnique(colorVariants, productId)
      if (conflict) {
        return buildRedirect(request, conflict, "error")
      }
    }

    const slug = await generateUniqueProductSlug(name, productId)
    const imageUrls = splitLines(imageUrl)

    const rawMaterials = await getExistingRawMaterials(selectedMaterialIds)

    if (rawMaterials.length !== selectedMaterialIds.length) {
      return buildRedirect(request, "One or more selected materials are not in inventory.", "error")
    }

    const materialEntries = rawMaterials.map((material) => ({
      materialStockId: material.id,
      quantityDisplay: String(formData.get(`quantityDisplay:${material.id}`) ?? "").trim() || null,
      notes: String(formData.get(`notes:${material.id}`) ?? "").trim() || null,
    }))

    const materialSummary = buildProductMaterialSummary(rawMaterials.map((material) => material.itemName))

    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw(Prisma.sql`
        UPDATE public.product_stocks
        SET
          "itemName" = ${name},
          description = ${description},
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${productStockId}
      `)

      await tx.$executeRaw(Prisma.sql`
        UPDATE public.products
        SET
          slug = ${slug},
          name = ${name},
          category = ${category},
          price = ${new Prisma.Decimal(price)},
          badge = ${badge},
          images = ${JSON.stringify(imageUrls)}::jsonb,
          "colorVariants" = ${JSON.stringify(colorVariants)}::jsonb,
          description = ${description},
          material = ${materialSummary},
          "isPublished" = ${isPublished},
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${productId}
      `)

      await tx.$executeRaw(Prisma.sql`
        DELETE FROM public.product_materials
        WHERE "productId" = ${productId}
      `)

      if (materialEntries.length > 0) {
        for (const entry of materialEntries) {
          await tx.$executeRaw(Prisma.sql`
            INSERT INTO public.product_materials (
              id,
              "productId",
              "materialStockId",
              "quantityDisplay",
              notes,
              "createdAt"
            )
            VALUES (
              gen_random_uuid(),
              ${productId},
              ${entry.materialStockId},
              ${entry.quantityDisplay},
              ${entry.notes},
              CURRENT_TIMESTAMP
            )
          `)
        }
      }
    })

    revalidatePath("/operations")
    revalidatePath("/shop")
    revalidatePath("/")

    // Compute color variants diff vs the before state
    const beforeColors = Array.isArray(existingProduct[0].colorVariants)
      ? (existingProduct[0].colorVariants as unknown[]).flatMap((v) => {
          if (v && typeof v === "object" && !Array.isArray(v)) {
            const o = v as Record<string, unknown>
            const n = typeof o.name === "string" ? o.name : null
            const h = typeof o.hex === "string" ? o.hex : null
            const s = typeof o.sku === "string" ? o.sku : null
            if (n && h && s) return [{ name: n, hex: h, sku: s }]
          }
          return []
        })
      : []
    const beforeBySku = new Map(beforeColors.map((v) => [v.sku.toLowerCase(), v]))
    const afterBySku = new Map(colorVariants.map((v) => [v.sku.toLowerCase(), v]))
    const added = colorVariants.filter((v) => !beforeBySku.has(v.sku.toLowerCase()))
    const removed = beforeColors.filter((v) => !afterBySku.has(v.sku.toLowerCase()))
    const updated = colorVariants.filter((v) => {
      const before = beforeBySku.get(v.sku.toLowerCase())
      return before && (before.name !== v.name || before.hex.toLowerCase() !== v.hex.toLowerCase())
    })
    const colorVariantsChanged = added.length > 0 || removed.length > 0 || updated.length > 0
    let colorVariantsSummary: string | null = null
    if (colorVariantsChanged) {
      const parts: string[] = []
      if (added.length > 0) parts.push(`+${added.length} added (${added.map((v) => v.name).join(", ")})`)
      if (removed.length > 0) parts.push(`-${removed.length} removed (${removed.map((v) => v.name).join(", ")})`)
      if (updated.length > 0) parts.push(`${updated.length} updated (${updated.map((v) => v.name).join(", ")})`)
      colorVariantsSummary = parts.join(" · ")
    }

    await logAudit({
      actorId: currentUser.authUserId,
      action: "PRODUCT_UPDATED",
      entityType: "PRODUCT",
      entityId: productId,
      metadata: {
        auditLabel: colorVariantsChanged
          ? "PRODUCT_COLOR_VARIANTS_UPDATED"
          : isPublished
            ? "ADDED_TO_STOREFRONT"
            : "REMOVED_FROM_STOREFRONT",
        sku: existingProduct[0].sku,
        itemName: name,
        name,
        category,
        isPublished,
        ...(colorVariantsChanged
          ? {
              colorVariantsSummary,
              colorVariantsBefore: beforeColors,
              colorVariantsAfter: colorVariants,
              colorVariantsAdded: added,
              colorVariantsRemoved: removed,
              colorVariantsUpdated: updated,
            }
          : {}),
      },
    })

    return buildRedirect(request, `Updated ${name} in Neon DB.`, "success")
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Neon DB could not update that finished product."

    return buildRedirect(request, message, "error")
  }
}
