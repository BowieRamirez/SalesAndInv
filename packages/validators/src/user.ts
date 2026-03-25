import { z } from "zod"

export const RoleEnum = z.enum([
  "ADMIN_MANAGEMENT",
  "SALES",
  "INVENTORY",
  "ACCOUNTING",
  "OPERATIONS_DESIGN",
  "CLIENT",
])

export const AccountStatusEnum = z.enum(["ACTIVE", "BLOCKED", "EXPIRED", "PENDING_ACTIVATION"])

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: RoleEnum,
  status: AccountStatusEnum.default("ACTIVE"),
  companyId: z.string().nullable().optional(),
  companyCode: z.string().nullable().optional(),
  accessExpiresAt: z.string().datetime().nullable().optional(),
})

export type User = z.infer<typeof UserSchema>
export type Role = z.infer<typeof RoleEnum>
export type AccountStatus = z.infer<typeof AccountStatusEnum>
