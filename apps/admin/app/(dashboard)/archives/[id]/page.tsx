import { redirect } from "next/navigation"
import { prisma } from "@furnitrack/db"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { ROLE_REDIRECT, ROLE_LABELS } from "@/lib/rbac"
import { History, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ArchiveActivityList } from "@/components/users/ArchiveActivityList"

export const dynamic = "force-dynamic"

export default async function ArchiveDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const currentUser = await requireAuthenticatedAppUser()

  if (currentUser.role !== "ADMIN_MANAGEMENT") {
    redirect(ROLE_REDIRECT[currentUser.role])
  }

  const { id } = await params

  // Try to find the user in app users, then auth users, then archives
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  const appUser = await prisma.user.findFirst({ 
    where: { 
      OR: [
        { id }, 
        ...(isUuid ? [{ authUserId: id }] : [])
      ] 
    } 
  })
  const archivedUser = await prisma.adminAccountArchive.findFirst({ where: { originalUserId: id } })

  const name = appUser?.name || archivedUser?.name || "Unknown User"
  const role = appUser?.role || archivedUser?.role || "UNKNOWN"
  const email = appUser?.email || archivedUser?.email || "No email"
  const status = appUser ? appUser.status : "DELETED"
  const resolvedActorId = appUser?.id || id

  // Fetch the audit logs and approval history for this user
  const [auditLogs, approvalHistory] = await Promise.all([
    prisma.$queryRawUnsafe<any[]>(`
      SELECT id, "actorId", action::text as action, "entityType"::text as "entityType", "entityId", metadata, "createdAt"
      FROM public.audit_logs
      WHERE "actorId" IN (${[resolvedActorId, appUser?.authUserId, id].filter(Boolean).map(x => `'${x}'`).join(',')})
      ORDER BY "createdAt" DESC
      LIMIT 100
    `),
    prisma.approvalHistory.findMany({
      where: { 
        actedById: { 
          in: [resolvedActorId, appUser?.authUserId, id].filter((x): x is string => Boolean(x))
        } 
      },
      orderBy: { actedAt: "desc" },
      take: 100,
    }),
  ])

  // Combine and sort events
  const allEvents = [
    ...auditLogs.map(l => ({
      type: "Audit",
      action: l.action,
      entityType: l.entityType,
      date: l.createdAt,
      metadata: l.metadata,
      id: l.id
    })),
    ...approvalHistory.map(a => ({
      type: "Approval",
      action: a.action,
      entityType: a.module,
      date: a.actedAt,
      metadata: { remarks: a.remarks, fromStatus: a.fromStatus, toStatus: a.toStatus },
      id: a.id
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link 
          href="/archives" 
          className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Archives
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-semibold text-slate-900">{name}</h1>
            <p className="text-[14px] text-slate-500 mt-1">{email}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium ring-1 ring-inset ${
              status === "DELETED" ? "bg-rose-100 text-rose-700 ring-rose-200" : "bg-emerald-100 text-emerald-700 ring-emerald-200"
            }`}>
              {status === "DELETED" ? "Deleted Account" : "Active Account"}
            </span>
            <span className="inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200">
              {ROLE_LABELS[role as keyof typeof ROLE_LABELS] || role}
            </span>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center gap-2">
            <History className="w-5 h-5 text-slate-500" />
            <h2 className="text-[16px] font-semibold text-slate-900">Activity History</h2>
          </div>
          <ArchiveActivityList events={allEvents} />
        </section>
      </div>
    </main>
  )
}
