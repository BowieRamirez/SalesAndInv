import { z } from "zod"

export const RoleEnum = z.enum(["MANAGEMENT", "SALES", "ACCOUNTING", "INVENTORY", "ADMIN"])

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: RoleEnum,
  branchId: z.string(),
})

export type User = z.infer<typeof UserSchema>
export type Role = z.infer<typeof RoleEnum>
