import { z } from "zod"

export const StockStatusEnum = z.enum(["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"])
export const ProductBadgeEnum = z.enum(["BEST_SELLER", "SALE", "HOT"]).nullable()

export const ColorVariantSchema = z.object({
  name: z.string(),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
})

export const DimensionsSchema = z.object({
  width: z.number().positive(),
  depth: z.number().positive(),
  height: z.number().positive(),
  weight: z.number().positive(),
})

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  category: z.string(),
  material: z.string(),
  price: z.number().positive(),
  originalPrice: z.number().positive().nullable(),
  badge: ProductBadgeEnum,
  stockStatus: StockStatusEnum,
  colorVariants: z.array(ColorVariantSchema),
  images: z.array(z.string()),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  description: z.string(),
  dimensions: DimensionsSchema,
})

export type Product = z.infer<typeof ProductSchema>
export type StockStatus = z.infer<typeof StockStatusEnum>
export type ProductBadge = z.infer<typeof ProductBadgeEnum>
export type ColorVariant = z.infer<typeof ColorVariantSchema>
export type Dimensions = z.infer<typeof DimensionsSchema>
