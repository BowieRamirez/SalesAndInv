import { redirect } from "next/navigation"
import { AuditLogsTable } from "@/components/inventory/AuditLogsTable"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { getAuditLogs } from "@/lib/audit-logs"
import { ROLE_REDIRECT } from "@/lib/rbac"

export const dynamic = "force-dynamic"

export default async function AuditDashboard() {
  const currentUser = await requireAuthenticatedAppUser()

  if (currentUser.role !== "ADMIN_MANAGEMENT") {
    redirect(ROLE_REDIRECT[currentUser.role])
  }

  const ids = [currentUser.id, currentUser.authUserId].filter(Boolean) as string[]
  const auditLogs = await getAuditLogs(ids, 300)

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
