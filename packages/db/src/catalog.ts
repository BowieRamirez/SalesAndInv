import { Prisma } from "./generated/prisma"
import { prisma } from "./client"
import { ProductSchema, type Product } from "@furnitrack/validators"

// Temporary storefront adapter:
// this reads optional legacy catalog tables only when they already exist in Neon.
// The current live minimized-role production DB does not contain these tables yet,
// so callers must handle an empty result until the catalog schema is migrated.

type ProductRow = {
  id: string
  slug: string
  name: string
  category: string
  material: string
  price: Prisma.Decimal | number | string
  originalPrice: Prisma.Decimal | number | string | null
  badge: string | null
  stockStatus: string
  images: string[] | Prisma.JsonValue | null
  rating: Prisma.Decimal | number | string | null
  reviewCount: number | bigint | null
  widthCm: Prisma.Decimal | number | string
  depthCm: Prisma.Decimal | number | string
  heightCm: Prisma.Decimal | number | string
  weightKg: Prisma.Decimal | number | string
  description: string
}

type ColorVariantRow = {
  productId: string
  name: string
  hex: string
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

async function tableExists(tableName: string) {
  const result = await prisma.$queryRaw<{ exists: boolean }[]>(Prisma.sql`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = ${tableName}
    ) AS "exists"
  `)

  return result[0]?.exists ?? false
}

function mapProduct(row: ProductRow, colorVariants: ColorVariantRow[]): Product {
  return ProductSchema.parse({
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    material: row.material,
    price: asNumber(row.price),
    originalPrice: row.originalPrice == null ? null : asNumber(row.originalPrice),
    badge: row.badge,
    stockStatus: row.stockStatus,
    colorVariants: colorVariants
      .filter((variant) => variant.productId === row.id)
      .map((variant) => ({
        name: variant.name,
        hex: variant.hex,
      })),
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
    const hasProductsTable = await tableExists("products")

    if (!hasProductsTable) {
      return []
    }

    const [productRows, hasVariantsTable] = await Promise.all([
      prisma.$queryRaw<ProductRow[]>(Prisma.sql`
        SELECT
          id,
          slug,
          name,
          category,
          material,
          price,
          "originalPrice",
          badge,
          "stockStatus",
          images,
          rating,
          "reviewCount",
          "widthCm",
          "depthCm",
          "heightCm",
          "weightKg",
          description
        FROM public.products
        ORDER BY "createdAt" DESC, name ASC
      `),
      tableExists("product_color_variants"),
    ])

    const colorVariants = hasVariantsTable
      ? await prisma.$queryRaw<ColorVariantRow[]>(Prisma.sql`
          SELECT
            "productId",
            name,
            hex
          FROM public.product_color_variants
          ORDER BY "productId", name ASC
        `)
      : []

    return productRows.map((row) => mapProduct(row, colorVariants))
  } catch {
    return []
  }
}

export async function getStorefrontProductBySlug(slug: string) {
  const products = await getStorefrontProducts()
  return products.find((product) => product.slug === slug) ?? null
}
