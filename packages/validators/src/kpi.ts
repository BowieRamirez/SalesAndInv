import { z } from "zod"

export const KpiSchema = z.object({
  dailySales: z.number(),
  monthlySales: z.number(),
  revenue: z.number(),
  profitMargin: z.number(),
  activeOrders: z.number().int(),
  pendingOrders: z.number().int(),
  outstandingReceivables: z.number(),
  supplierLeadTimeDays: z.number(),
  lowStockAlertCount: z.number().int(),
  stockTurnover: z.number(),
  revenueChange: z.number(),
  salesChange: z.number(),
  profitChange: z.number(),
  ordersChange: z.number(),
})

export type Kpi = z.infer<typeof KpiSchema>
