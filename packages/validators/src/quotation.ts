import { z } from "zod"

export const QuotationStatusEnum = z.enum(["DRAFT", "SENT", "IN_REVIEW", "CONFIRMED", "REJECTED"])

export const QuotationLineItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  dimensions: z.string().optional(),
  finish: z.string().optional(),
  total: z.number().positive(),
})

export const QuotationSchema = z.object({
  id: z.string(),
  quoteNumber: z.string(),
  leadId: z.string(),
  clientName: z.string(),
  clientEmail: z.string().email(),
  status: QuotationStatusEnum,
  lineItems: z.array(QuotationLineItemSchema),
  subtotal: z.number().nonnegative(),
  vatAmount: z.number().nonnegative(),
  total: z.number().nonnegative(),
  orderId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Quotation = z.infer<typeof QuotationSchema>
export type QuotationStatus = z.infer<typeof QuotationStatusEnum>
export type QuotationLineItem = z.infer<typeof QuotationLineItemSchema>
