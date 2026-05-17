import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma, logAudit } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import {
  buildProductMaterialSummary,
  collectSelectedMaterialIds,
  generateUniqueProductSlug,
  getExistingRawMaterials,
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
  const stockItemId = String(formData.get("stockItemId") ?? "").trim()
  const name = String(formData.get("name") ?? "").trim()
  const category = String(formData.get("category") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const imageUrl = String(formData.get("imageUrl") ?? "").trim()
  const badge = String(formData.get("badge") ?? "").trim() || null
  const price = parseDecimal(formData.get("price"))
  const isPublished = String(formData.get("isPublished") ?? "").trim() === "on"
  const selectedMaterialIds = collectSelectedMaterialIds(formData)

  if (!productId || !stockItemId || !name || !category || !description) {
    return buildRedirect(request, "Select a valid product and provide its name, category, and description.", "error")
  }

  if (selectedMaterialIds.length === 0) {
    return buildRedirect(request, "Select at least one raw material for the product's recipe.", "error")
  }

  if (!Number.isFinite(price) || price < 0) {
    return buildRedirect(request, "Price must be zero or higher.", "error")
  }

  try {
    const existingProduct = await prisma.$queryRaw<Array<{ id: string; stockItemId: string; sku: string }>>(Prisma.sql`
      SELECT
        p.id,
        p."stockItemId",
        si.sku
      FROM public.products p
      INNER JOIN public.stock_items si ON si.id = p."stockItemId"
      WHERE p.id = ${productId}
      LIMIT 1
    `)

    if (!existingProduct[0] || existingProduct[0].stockItemId !== stockItemId) {
      return buildRedirect(request, "That finished product could not be found.", "error")
    }

    const slug = await generateUniqueProductSlug(name, productId)
    const imageUrls = splitLines(imageUrl)

    const rawMaterials = await getExistingRawMaterials(selectedMaterialIds)

    if (rawMaterials.length !== selectedMaterialIds.length) {
      return buildRedirect(request, "One or more selected materials are not in inventory.", "error")
    }

    const materialEntries = rawMaterials.map((material) => ({
      stockItemId: material.id,
      quantityDisplay: String(formData.get(`quantityDisplay:${material.id}`) ?? "").trim() || null,
      notes: String(formData.get(`notes:${material.id}`) ?? "").trim() || null,
    }))

    const materialSummary = buildProductMaterialSummary(rawMaterials.map((material) => material.itemName))

    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw(Prisma.sql`
        UPDATE public.stock_items
        SET
          "itemName" = ${name},
          description = ${description},
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${stockItemId}
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
              "stockItemId",
              "quantityDisplay",
              notes,
              "createdAt"
            )
            VALUES (
              gen_random_uuid(),
              ${productId},
              ${entry.stockItemId},
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

    await logAudit({
      actorId: currentUser.authUserId,
      action: "PRODUCT_UPDATED",
      entityType: "PRODUCT",
      entityId: productId,
      metadata: {
        auditLabel: isPublished ? "ADDED_TO_STOREFRONT" : "REMOVED_FROM_STOREFRONT",
        sku: existingProduct[0].sku,
        itemName: name,
        name,
        category,
        isPublished,
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
