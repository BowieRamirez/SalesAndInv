import { z } from "zod"

export const CrmStageEnum = z.enum(["NEW", "QUOTED", "NEGOTIATING", "CONFIRMED", "CLOSED"])
export const LeadStatusEnum = z.enum(["ACTIVE", "INACTIVE", "LOST"])

export const LeadSchema = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string(),
  email: z.string().email(),
  businessType: z.string(),
  budget: z.number().positive(),
  targetDate: z.string(),
  stage: CrmStageEnum,
  status: LeadStatusEnum,
  createdAt: z.string(),
})

export type Lead = z.infer<typeof LeadSchema>
export type CrmStage = z.infer<typeof CrmStageEnum>
export type LeadStatus = z.infer<typeof LeadStatusEnum>
