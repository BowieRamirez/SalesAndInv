import { prisma } from "./client"
import { AuditAction, AuditEntityType } from "./generated/prisma"

export async function logAudit(params: {
  actorId?: string | null
  action: AuditAction
  entityType: AuditEntityType
  entityId: string
  /**
   * Optional company code snapshot. Stored on `audit_logs.companyCodeSnapshot`.
   * (The legacy `companyId` column was removed when companies were dropped.)
   */
  companyCodeSnapshot?: string | null
  metadata?: Record<string, any>
}) {
  try {
    const metadata = params.metadata ? JSON.stringify(params.metadata) : null

    await prisma.$executeRaw`
      INSERT INTO public.audit_logs (
        id, "actorId", action, "entityType", "entityId", "companyCodeSnapshot", metadata, "createdAt"
      )
      VALUES (
        gen_random_uuid(),
        ${params.actorId || null},
        ${params.action}::"AuditAction",
        ${params.entityType}::"AuditEntityType",
        ${params.entityId},
        ${params.companyCodeSnapshot || null},
        ${metadata}::jsonb,
        CURRENT_TIMESTAMP
      )
    `
  } catch (error) {
    console.error("Failed to write audit log:", error)
  }
}
