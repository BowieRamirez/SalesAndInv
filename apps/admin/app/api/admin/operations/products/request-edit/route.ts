import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma, logAudit } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import {
  ensureColorVariantSkusAreGlobalUnique,
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
    return buildRedirect(request, "Only operations or executive admins can request product edits.", "error")
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
  const warehouseId = String(formData.get("warehouseId") ?? "").trim()
  const badge = String(formData.get("badge") ?? "").trim() || null
  const price = parseDecimal(formData.get("price"))
  const isPublished = String(formData.get("isPublished") ?? "").trim() === "on"

  if (!productId || !productStockId || !name || !category || !description) {
    return buildRedirect(request, "Provide the product name, category, and description.", "error")
  }

  if (!Number.isFinite(price) || price < 0) {
    return buildRedirect(request, "Price must be zero or higher.", "error")
  }

  try {
    // Verify the product exists and load its main SKU for variant validation
    const existing = await prisma.$queryRaw<Array<{ id: string; name: string; sku: string }>>(Prisma.sql`
      SELECT p.id, p.name, ps.sku
      FROM public.products p
      INNER JOIN public.product_stocks ps ON ps.id = p."productStockId"
      WHERE p.id = ${productId}
      LIMIT 1
    `)

    if (!existing[0]) {
      return buildRedirect(request, "Product not found.", "error")
    }

    const productMainSku = existing[0].sku

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

    // Cancel any existing pending request for this product from this user
    await prisma.$executeRaw(Prisma.sql`
      UPDATE public.product_edit_requests
      SET status = 'CANCELLED', "updatedAt" = CURRENT_TIMESTAMP
      WHERE "productId" = ${productId}
        AND "requestedById" = ${currentUser.id}
        AND status = 'PENDING'
    `)

    const imageUrls = splitLines(imageUrl)

    const payload = {
      productId,
      productStockId,
      name,
      category,
      description,
      imageUrls,
      warehouseId,
      badge,
      price,
      isPublished,
      colorVariants,
    }

    await prisma.$executeRaw(Prisma.sql`
      INSERT INTO public.product_edit_requests (
        id,
        "productId",
        "requestedById",
        status,
        payload,
        "createdAt",
        "updatedAt"
      )
      VALUES (
        gen_random_uuid()::text,
        ${productId},
        ${currentUser.id},
        'PENDING',
        ${JSON.stringify(payload)}::jsonb,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
    `)

    revalidatePath("/operations")
    revalidatePath("/approvals")

    // Build a human-readable summary of color variant changes if any are in this request
    let colorVariantsSummary: string | null = null
    if (colorVariants.length > 0) {
      const beforeColorRows = await prisma.$queryRaw<Array<{ colorVariants: unknown }>>(Prisma.sql`
        SELECT "colorVariants" FROM public.products WHERE id = ${productId} LIMIT 1
      `)
      const beforeColors = Array.isArray(beforeColorRows[0]?.colorVariants)
        ? (beforeColorRows[0].colorVariants as unknown[]).flatMap((v) => {
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
        return (
          before &&
          (before.name !== v.name || before.hex.toLowerCase() !== v.hex.toLowerCase())
        )
      })
      const parts: string[] = []
      if (added.length > 0) parts.push(`+${added.length} added (${added.map((v) => v.name).join(", ")})`)
      if (removed.length > 0) parts.push(`-${removed.length} removed (${removed.map((v) => v.name).join(", ")})`)
      if (updated.length > 0) parts.push(`${updated.length} updated (${updated.map((v) => v.name).join(", ")})`)
      colorVariantsSummary = parts.length > 0 ? parts.join(" · ") : "Color variants unchanged"
    }

    await logAudit({
      actorId: currentUser.authUserId,
      action: "PRODUCT_UPDATED",
      entityType: "PRODUCT",
      entityId: productId,
      metadata: {
        auditLabel: colorVariantsSummary
          ? "PRODUCT_COLOR_VARIANTS_REQUESTED"
          : "PRODUCT_EDIT_REQUESTED",
        name,
        category,
        price,
        submittedBy: currentUser.name,
        ...(colorVariantsSummary ? { colorVariantsSummary, colorVariantsProposed: colorVariants } : {}),
      },
    })

    return buildRedirect(
      request,
      `Edit request for "${name}" submitted. Waiting for executive admin approval.`,
      "success",
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not submit the edit request."
    return buildRedirect(request, message, "error")
  }
}
