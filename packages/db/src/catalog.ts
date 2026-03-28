import { Prisma } from "./generated/prisma"
import { prisma } from "./client"
import { ProductSchema, type Product } from "@furnitrack/validators"

type CatalogProductRow = {
  id: string
  slug: string
  name: string
  category: string
  material: string
  price: Prisma.Decimal | number | string
  originalPrice: Prisma.Decimal | number | string | null
  badge: string | null
  images: string[] | Prisma.JsonValue | null
  rating: Prisma.Decimal | number | string | null
  reviewCount: number | bigint | null
  widthCm: Prisma.Decimal | number | string
  depthCm: Prisma.Decimal | number | string
  heightCm: Prisma.Decimal | number | string
  weightKg: Prisma.Decimal | number | string
  description: string
  availableQty: number | bigint | null
  reorderThreshold: number | bigint | null
}

function asNumber(value: Prisma.Decimal | number | string | bigint | null | undefined) {
  if (value == null) {
    return 0
  }

  if (typeof value === "bigint") {
    return Number(value)
  }

  return Number(value)
}

function asStringArray(value: string[] | Prisma.JsonValue | null): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => (typeof entry === "string" ? [entry] : []))
  }

  return []
}

function normalizeBadge(value: string | null) {
  if (!value) {
    return null
  }

  const normalized = value.trim().toUpperCase().replace(/\s+/g, "_")

  if (normalized === "BEST_SELLER" || normalized === "SALE" || normalized === "HOT") {
    return normalized
  }

  return null
}

function deriveStockStatus(availableQty: number, reorderThreshold: number) {
  if (availableQty <= 0) {
    return "OUT_OF_STOCK" as const
  }

  if (availableQty <= reorderThreshold) {
    return "LOW_STOCK" as const
  }

  return "IN_STOCK" as const
}

function mapProduct(row: CatalogProductRow): Product {
  const availableQty = asNumber(row.availableQty)
  const reorderThreshold = asNumber(row.reorderThreshold)

  return ProductSchema.parse({
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    material: row.material,
    price: asNumber(row.price),
    originalPrice: row.originalPrice == null ? null : asNumber(row.originalPrice),
    badge: normalizeBadge(row.badge),
    stockStatus: deriveStockStatus(availableQty, reorderThreshold),
    availableQty,
    colorVariants: [],
    images: asStringArray(row.images),
    rating: asNumber(row.rating),
    reviewCount: asNumber(row.reviewCount),
    description: row.description,
    dimensions: {
      width: asNumber(row.widthCm),
      depth: asNumber(row.depthCm),
      height: asNumber(row.heightCm),
      weight: asNumber(row.weightKg),
    },
  })
}

export async function getStorefrontProducts(): Promise<Product[]> {
  try {
    const rows = await prisma.$queryRaw<CatalogProductRow[]>(Prisma.sql`
      SELECT
        p.id,
        p.slug,
        p.name,
        p.category,
        p.material,
        p.price,
        p."originalPrice",
        p.badge,
        p.images,
        p.rating,
        p."reviewCount",
        p."widthCm",
        p."depthCm",
        p."heightCm",
        p."weightKg",
        p.description,
        s."availableQty",
        s."reorderThreshold"
      FROM public.products p
      INNER JOIN public.stock_items s
        ON s.id = p."stockItemId"
      WHERE p."isPublished" = true
        AND s."itemType" = 'FINISHED_PRODUCT'
      ORDER BY p."createdAt" DESC, p.name ASC
    `)

    return rows.map(mapProduct)
  } catch {
    return []
  }
}

export async function getStorefrontProductBySlug(slug: string) {
  const products = await getStorefrontProducts()
  return products.find((product) => product.slug === slug) ?? null
}
