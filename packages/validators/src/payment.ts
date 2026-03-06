import { z } from "zod"

export const PaymentTypeEnum = z.enum(["DOWN_PAYMENT", "PARTIAL", "FULL"])
export const PaymentStatusEnum = z.enum(["PENDING", "CONFIRMED", "REJECTED"])

export const PaymentSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  type: PaymentTypeEnum,
  amount: z.number().positive(),
  status: PaymentStatusEnum,
  proofUrl: z.string().nullable(),
  date: z.string(),
})

export type Payment = z.infer<typeof PaymentSchema>
export type PaymentType = z.infer<typeof PaymentTypeEnum>
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>
