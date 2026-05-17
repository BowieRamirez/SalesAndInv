import { redirect } from "next/navigation"
import { Prisma, prisma } from "@furnitrack/db"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { ROLE_LABELS, ROLE_REDIRECT, type AppRole } from "@/lib/rbac"
import { ArchivesTable } from "@/components/users/ArchivesTable"
import { type ManagedAccount } from "@/components/users/UsersTable"

export const dynamic = "force-dynamic"

const AUTH_ROLE_CASE_SQL = Prisma.sql`
  CASE
    WHEN auth.role IN ('ADMIN', 'ANALYTICS', 'ADMIN_MANAGEMENT') THEN 'ADMIN_MANAGEMENT'
    WHEN auth.role = 'SALES' THEN 'SALES'
    WHEN auth.role IN ('INVENTORY', 'OPERATIONS_DESIGN') THEN 'OPERATIONS_DESIGN'
    WHEN auth.role = 'ACCOUNTING' THEN 'ACCOUNTING'
    ELSE 'CLIENT'
  END
`

async function getManagedAccounts() {
  return prisma.$queryRaw<any[]>(Prisma.sql`
    SELECT
      COALESCE(app.id, auth.id::text) AS id,
      auth.id::text AS "authUserId",
      LOWER(auth.email) AS email,
      COALESCE(NULLIF(app.name, ''), NULLIF(auth.name, ''), split_part(auth.email, '@', 1)) AS name,
      ${AUTH_ROLE_CASE_SQL}::text AS role,
      COALESCE(app.status::text, 'ACTIVE') AS status,
      app."lastLoginAt",
      COALESCE(app."createdAt", auth."createdAt") AS "createdAt",
      COALESCE(app."updatedAt", auth."updatedAt") AS "updatedAt"
    FROM neon_auth."user" auth
    LEFT JOIN LATERAL (
      SELECT *
      FROM public.users app
      WHERE app."authUserId"::text = auth.id::text OR LOWER(app.email) = LOWER(auth.email)
      ORDER BY CASE WHEN app."authUserId"::text = auth.id::text THEN 0 ELSE 1 END
      LIMIT 1
    ) app ON TRUE
    WHERE ${AUTH_ROLE_CASE_SQL} <> 'CLIENT'
  `)
}

async function getArchivedAccounts() {
  try {
    return await prisma.adminAccountArchive.findMany({
      orderBy: { archivedAt: "desc" },
    })
  } catch (e) {
    // Return empty if the table isn't fully set up yet
    return []
  }
}

export default async function ArchivesDashboard() {
  const currentUser = await requireAuthenticatedAppUser()

  if (currentUser.role !== "ADMIN_MANAGEMENT") {
    redirect(ROLE_REDIRECT[currentUser.role])
  }

  const [activeAccounts, archivedAccounts] = await Promise.all([
    getManagedAccounts(),
    getArchivedAccounts(),
  ])

  const accountMap = new Map<string, ManagedAccount>()

  // Add active ones
  for (const a of activeAccounts) {
    accountMap.set(a.authUserId, {
      id: a.id,
      authUserId: a.authUserId,
      email: a.email,
      name: a.name,
      role: a.role as AppRole,
      status: a.status,
      lastLoginAt: a.lastLoginAt ? new Date(a.lastLoginAt).toISOString() : null,
      createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : null,
      updatedAt: a.updatedAt ? new Date(a.updatedAt).toISOString() : null,
    })
  }

  // Add archived ones if they don't exist
  for (const a of archivedAccounts) {
    if (!accountMap.has(a.originalUserId)) {
      accountMap.set(a.originalUserId, {
        id: a.id,
        authUserId: a.originalUserId,
        email: a.email,
        name: a.name,
        role: a.role as AppRole,
        status: "DELETED", // Archived/deleted
        lastLoginAt: null,
        createdAt: null,
        updatedAt: new Date(a.archivedAt).toISOString(),
      })
    }
  }

  const serialized = Array.from(accountMap.values()).sort((a, b) => a.name.localeCompare(b.name))

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[12px] text-slate-500">Home / Archives</p>
            <h1 className="mt-1 text-[24px] font-semibold text-slate-900">Archived & Active Accounts</h1>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[14px] text-slate-600">
            This master archive displays all admin accounts (both active and deleted) and their historical actions. Even when an account is removed from the main system, their records will remain here.
          </p>
        </div>

        <ArchivesTable
          users={serialized}
          roleLabels={ROLE_LABELS}
        />
      </div>
    </main>
  )
}
