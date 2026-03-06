import { z } from "zod"

export const OrderStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "IN_PRODUCTION",
  "DELIVERED",
  "CANCELLED",
])

export const OrderSchema = z.object({
  id: z.string(),
  soNumber: z.string(),
  poNumber: z.string().nullable(),
  quotationId: z.string(),
  clientName: z.string(),
  status: OrderStatusEnum,
  rushOrder: z.boolean(),
  deliveryDate: z.string(),
  subtotal: z.number().nonnegative(),
  vatAmount: z.number().nonnegative(),
  total: z.number().nonnegative(),
  createdAt: z.string(),
})

export type Order = z.infer<typeof OrderSchema>
export type OrderStatus = z.infer<typeof OrderStatusEnum>
