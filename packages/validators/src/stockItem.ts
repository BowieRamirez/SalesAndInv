import { z } from "zod"

export const StockStateEnum = z.enum(["AVAILABLE", "RESERVED", "IN_PRODUCTION", "DELIVERED"])
export const StockMovementTypeEnum = z.enum([
  "IN",
  "OUT",
  "TRANSFER",
  "ADJUSTMENT",
  "DAMAGED",
])

export const StockItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  sku: z.string(),
  warehouseId: z.string(),
  warehouseName: z.string(),
  qtyAvailable: z.number().int().nonnegative(),
  qtyReserved: z.number().int().nonnegative(),
  qtyInProduction: z.number().int().nonnegative(),
  minThreshold: z.number().int().nonnegative(),
  state: StockStateEnum,
})

export type StockItem = z.infer<typeof StockItemSchema>
export type StockState = z.infer<typeof StockStateEnum>
export type StockMovementType = z.infer<typeof StockMovementTypeEnum>
