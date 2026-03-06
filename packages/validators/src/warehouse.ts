import { z } from "zod"

export const WarehouseSchema = z.object({
  id: z.string(),
  name: z.string(),
  branchCode: z.string(),
  address: z.string(),
})

export type Warehouse = z.infer<typeof WarehouseSchema>
