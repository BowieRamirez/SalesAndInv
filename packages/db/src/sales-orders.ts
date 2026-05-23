// Sales orders helper module.
//
// PURPOSE
// -------
// `sales_orders` and `sales_order_line_items` exist for the formal B2B / multi-line
// order workflow. Today the active customer-facing flow goes through
// `customer_inquiries` (single-product B2C orders from the storefront).
//
// This file provides:
//   - generateSalesOrderNumber(): atomic SO-YYYY-NNNNN generator backed by
//     public.sales_order_number_seq.

import { Prisma } from "./generated/prisma"
import { prisma } from "./client"

/**
 * Generates the next human-readable sales order number using the DB sequence.
 * Returns e.g. "SO-2026-00001". Atomic and race-safe.
 */
export async function generateSalesOrderNumber(
  tx: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<string> {
  const rows = await tx.$queryRaw<Array<{ next_val: number }>>(Prisma.sql`
    SELECT nextval('public.sales_order_number_seq')::int AS next_val
  `)
  const nextSeq = rows[0]?.next_val ?? 1
  const yearStr = new Date().getFullYear().toString()
  return `SO-${yearStr}-${String(nextSeq).padStart(5, "0")}`
}
