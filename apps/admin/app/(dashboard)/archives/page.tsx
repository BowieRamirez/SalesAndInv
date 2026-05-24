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
    WHEN auth.role = 'CUSTOM' THEN 'CUSTOM'
    ELSE 'CLIENT'
  END
`

async function getAllAccounts() {
  // Fetch every account in neon_auth — no role filter, same as the users page.
  // This ensures deleted accounts, client accounts, and accounts whose auth role
  // was cleared after deletion all appear in the archive.
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
    ORDER BY LOWER(auth.email) ASC
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
    getAllAccounts(),
    getArchivedAccounts(),
  ])

  const accountMap = new Map<string, ManagedAccount>()

  // Add all accounts from neon_auth (active, deleted, clients — everyone)
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

  // Merge adminAccountArchive records:
  // - If the account is already in the map, mark it DELETED and update the timestamp
  // - If it's not in the map (auth record was fully removed), add it
  for (const a of archivedAccounts) {
    const existing = accountMap.get(a.originalUserId)
    if (existing) {
      // Override status to DELETED — the archive record is the source of truth for deletion
      accountMap.set(a.originalUserId, {
        ...existing,
        status: "DELETED",
        updatedAt: new Date(a.archivedAt).toISOString(),
      })
    } else {
      accountMap.set(a.originalUserId, {
        id: a.id,
        authUserId: a.originalUserId,
        email: a.email,
        name: a.name,
        role: a.role as AppRole,
        status: "DELETED",
        lastLoginAt: null,
        createdAt: null,
        updatedAt: new Date(a.archivedAt).toISOString(),
      })
    }
  }

  const serialized = Array.from(accountMap.values()).sort((a, b) => a.name.localeCompare(b.name))

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="w-full space-y-6">
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
