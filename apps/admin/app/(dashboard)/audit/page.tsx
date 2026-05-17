import { redirect } from "next/navigation"
import { Prisma, prisma } from "@furnitrack/db"
import { AuditLogsTable } from "@/components/inventory/AuditLogsTable"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { ROLE_REDIRECT } from "@/lib/rbac"

type DetailedAuditLog = {
  id: string
  action: string
  entityType: string
  entityId: string
  sku: string | null
  itemName: string | null
  quantity: number | null
  details: string | null
  actorName: string | null
  createdAt: Date
}

async function getAuditLogs(role: string) {
  return prisma.$queryRaw<DetailedAuditLog[]>(Prisma.sql`
    SELECT
      a.id,
      COALESCE(a.metadata->>'auditLabel', a.action::text) AS action,
      a."entityType"::text AS "entityType",
      a."entityId",
      a.metadata->>'sku' AS sku,
      COALESCE(
        a.metadata->>'itemName',
        a.metadata->>'name',
        a.metadata->>'updatedName',
        a.metadata->>'createdName',
        a.metadata->>'removedName',
        a.metadata->>'customerName',
        a.metadata->>'customerEmail',
        a.metadata->>'updatedEmail',
        a.metadata->>'createdEmail',
        a.metadata->>'removedEmail'
      ) AS "itemName",
      NULLIF(a.metadata->>'quantity', '')::int AS quantity,
      COALESCE(
        a.metadata->>'updatedEmail',
        a.metadata->>'createdEmail',
        a.metadata->>'removedEmail',
        a.metadata->>'customerEmail',
        a.metadata->>'referenceNumber',
        a.metadata->>'category',
        a.metadata->>'reasonDetails'
      ) AS details,
      u.name AS "actorName",
      a."createdAt"
    FROM public.audit_logs a
    LEFT JOIN public.users u ON u.id = a."actorId"
      OR u."authUserId"::text = a."actorId"
    WHERE u.role = ${role}::"UserRole"
    ORDER BY a."createdAt" DESC
    LIMIT 300
  `)
}

export const dynamic = "force-dynamic"

export default async function AuditDashboard() {
  const currentUser = await requireAuthenticatedAppUser()

  if (currentUser.role !== "ADMIN_MANAGEMENT") {
    redirect(ROLE_REDIRECT[currentUser.role])
  }

  const auditLogs = await getAuditLogs(currentUser.role)

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <p className="text-[12px] text-slate-500">Home / Audit Logs</p>
          <h1 className="mt-1 text-[24px] font-semibold text-slate-900">Audit Logs</h1>
          <p className="mt-2 text-[13px] text-slate-500">
            Account, customer, product, and inventory activity recorded across the admin system.
          </p>
        </div>

        <AuditLogsTable rows={auditLogs} />
      </div>
    </main>
  )
}
