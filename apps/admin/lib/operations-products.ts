import { Prisma, prisma } from "@furnitrack/db"

export const OPERATIONS_PRODUCT_CATEGORIES = [
  "Living Room",
  "Bedroom",
  "Dining",
  "Office",
  "Storage",
  "Outdoor",
] as const

export const OPERATIONS_DEFAULT_TAB = "finished-products"

export function slugifyProductName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function splitLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean)
}

export function parseInteger(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number.parseInt(String(value ?? fallback), 10)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

export function parseDecimal(value: FormDataEntryValue | null, fallback = "0") {
  const normalized = String(value ?? fallback).trim()

  if (!normalized) {
    return Number.NaN
  }

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

export function collectSelectedMaterialIds(formData: FormData) {
  return formData
    .getAll("materialIds")
    .map((value) => String(value).trim())
    .filter(Boolean)
}

export async function generateFinishedProductSku(client: typeof prisma = prisma) {
  const rows = await client.productStock.findMany({
    where: {
      sku: {
        startsWith: "FP-",
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

  const latestSku = rows[0]?.sku ?? "FP-000"
  const latestNumber = Number.parseInt(latestSku.replace("FP-", ""), 10)
  const nextNumber = Number.isFinite(latestNumber) ? latestNumber + 1 : 1

  return `FP-${String(nextNumber).padStart(3, "0")}`
}

export async function generateUniqueProductSlug(
  name: string,
  excludeProductId?: string,
  client: typeof prisma = prisma,
) {
  const baseSlug = slugifyProductName(name) || "finished-product"
  const existing = await client.$queryRaw<{ slug: string }[]>(Prisma.sql`
    SELECT slug
    FROM public.products
    WHERE slug LIKE ${`${baseSlug}%`}
    ${excludeProductId ? Prisma.sql`AND id <> ${excludeProductId}` : Prisma.empty}
  `)

  const used = new Set(existing.map((entry: { slug: string }) => entry.slug))

  if (!used.has(baseSlug)) {
    return baseSlug
  }

  let suffix = 2
  while (used.has(`${baseSlug}-${suffix}`)) {
    suffix += 1
  }

  return `${baseSlug}-${suffix}`
}

export async function getExistingRawMaterials(materialIds: string[]) {
  if (materialIds.length === 0) {
    return []
  }

  return prisma.$queryRaw<
    Array<{
      id: string
      sku: string
      itemName: string
      unitOfMeasure: string
      availableQty: number
    }>
  >(Prisma.sql`
    SELECT
      id,
      sku,
      "itemName",
      "unitOfMeasure",
      "availableQty"
    FROM public.material_stocks
    WHERE id IN (${Prisma.join(materialIds.map((materialId) => Prisma.sql`${materialId}`))})
    ORDER BY "itemName" ASC
  `)
}

export function buildProductMaterialSummary(materialNames: string[]) {
  const uniqueNames = [...new Set(materialNames.map((name) => name.trim()).filter(Boolean))]

  if (uniqueNames.length === 0) {
    return "Mixed Materials"
  }

  return uniqueNames.join(", ")
}

export type ColorVariantInput = { name: string; hex: string; sku: string }

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/

/**
 * Parses parallel form fields `colorName[]`, `colorHex[]`, `colorSku[]` from a FormData
 * into a clean ColorVariantInput[]. Validates:
 *   - all three fields are non-empty
 *   - hex matches #RRGGBB
 *   - SKUs are unique within the variants list
 *   - SKUs do not collide with the product's own SKU (productStockSku, if provided)
 * Returns either { ok: true, variants } or { ok: false, error }.
 */
export function parseColorVariantsFromForm(
  formData: FormData,
  options: { productStockSku?: string | null } = {},
): { ok: true; variants: ColorVariantInput[] } | { ok: false; error: string } {
  const names = formData.getAll("colorName").map((v) => String(v ?? "").trim())
  const hexes = formData.getAll("colorHex").map((v) => String(v ?? "").trim())
  const skus = formData.getAll("colorSku").map((v) => String(v ?? "").trim())

  const length = Math.max(names.length, hexes.length, skus.length)
  const variants: ColorVariantInput[] = []
  const seenSkus = new Set<string>()
  const productSku = options.productStockSku?.trim().toLowerCase()

  for (let i = 0; i < length; i++) {
    const name = names[i] ?? ""
    const hex = hexes[i] ?? ""
    const sku = skus[i] ?? ""

    // Skip rows where everything is blank — user added then removed
    if (!name && !hex && !sku) continue

    if (!name) return { ok: false, error: `Color variant #${i + 1} is missing a name.` }
    if (!HEX_PATTERN.test(hex)) {
      return { ok: false, error: `Color variant "${name}" must have a valid hex color like #C9A96E.` }
    }
    if (!sku) return { ok: false, error: `Color variant "${name}" is missing a SKU.` }
    if (sku.length > 80) {
      return { ok: false, error: `Color variant SKU "${sku}" is too long (max 80 characters).` }
    }

    const skuLower = sku.toLowerCase()
    if (seenSkus.has(skuLower)) {
      return { ok: false, error: `Duplicate color variant SKU "${sku}". Each variant must have a unique SKU.` }
    }
    if (productSku && skuLower === productSku) {
      return {
        ok: false,
        error: `Color variant SKU "${sku}" conflicts with the product's main SKU. Use a different SKU.`,
      }
    }
    seenSkus.add(skuLower)
    variants.push({ name, hex, sku })
  }

  return { ok: true, variants }
}

/**
 * Checks that no color-variant SKU is already used by another product (either as the
 * product's own product_stocks.sku or as another product's color variant SKU).
 * Returns null on success, or an error message on conflict.
 */
export async function ensureColorVariantSkusAreGlobalUnique(
  variants: ColorVariantInput[],
  excludeProductId?: string,
): Promise<string | null> {
  if (variants.length === 0) return null

  const skus = variants.map((v) => v.sku)

  // Check against product_stocks SKUs
  const stockClash = await prisma.$queryRaw<Array<{ sku: string }>>(Prisma.sql`
    SELECT ps.sku
    FROM public.product_stocks ps
    WHERE LOWER(ps.sku) IN (${Prisma.join(skus.map((s) => Prisma.sql`LOWER(${s})`))})
      ${excludeProductId
        ? Prisma.sql`AND ps.id <> (SELECT "productStockId" FROM public.products WHERE id = ${excludeProductId})`
        : Prisma.empty}
    LIMIT 1
  `)

  if (stockClash[0]) {
    return `Color variant SKU "${stockClash[0].sku}" is already used by another product. Use a different SKU.`
  }

  // Check against material_stocks SKUs
  const materialClash = await prisma.$queryRaw<Array<{ sku: string }>>(Prisma.sql`
    SELECT ms.sku
    FROM public.material_stocks ms
    WHERE LOWER(ms.sku) IN (${Prisma.join(skus.map((s) => Prisma.sql`LOWER(${s})`))})
    LIMIT 1
  `)

  if (materialClash[0]) {
    return `Color variant SKU "${materialClash[0].sku}" is already used by a raw material. Use a different SKU.`
  }

  // Check against other products' color variants
  const variantClash = await prisma.$queryRaw<Array<{ id: string; name: string; sku: string }>>(Prisma.sql`
    SELECT p.id, p.name, cv->>'sku' AS sku
    FROM public.products p,
         jsonb_array_elements(COALESCE(p."colorVariants", '[]'::jsonb)) cv
    WHERE LOWER(cv->>'sku') IN (${Prisma.join(skus.map((s) => Prisma.sql`LOWER(${s})`))})
      ${excludeProductId ? Prisma.sql`AND p.id <> ${excludeProductId}` : Prisma.empty}
    LIMIT 1
  `)

  if (variantClash[0]) {
    return `Color variant SKU "${variantClash[0].sku}" is already used by product "${variantClash[0].name}". Use a different SKU.`
  }

  return null
}
