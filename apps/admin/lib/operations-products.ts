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
