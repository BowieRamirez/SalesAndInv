import { redirect } from "next/navigation"
import { Prisma, prisma } from "@furnitrack/db"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { APP_ROLES, ROLE_LABELS, ROLE_REDIRECT, type AppRole } from "@/lib/rbac"
import { UsersTable, type ManagedAccount } from "@/components/users/UsersTable"

type UsersPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

type ManagedAccountRow = {
  id: string
  authUserId: string
  email: string
  name: string
  role: AppRole
  status: string
  lastLoginAt: Date | null
  createdAt: Date | null
  updatedAt: Date | null
}

const INTERNAL_ROLES = APP_ROLES.filter((role) => role !== "CLIENT")
const STAFF_ROLES = INTERNAL_ROLES.filter((role) => role !== "ADMIN_MANAGEMENT")

const AUTH_ROLE_CASE_SQL = Prisma.sql`
  CASE
    WHEN auth.role IN ('ADMIN', 'ANALYTICS', 'ADMIN_MANAGEMENT') THEN 'ADMIN_MANAGEMENT'
    WHEN auth.role = 'SALES' THEN 'SALES'
    WHEN auth.role IN ('INVENTORY', 'OPERATIONS_DESIGN') THEN 'OPERATIONS_DESIGN'
    WHEN auth.role = 'ACCOUNTING' THEN 'ACCOUNTING'
    ELSE 'CLIENT'
  END
`

function getSearchValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

async function getManagedAccounts() {
  return prisma.$queryRaw<ManagedAccountRow[]>(Prisma.sql`
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
    ORDER BY
      CASE ${AUTH_ROLE_CASE_SQL}
        WHEN 'ADMIN_MANAGEMENT' THEN 0
        WHEN 'SALES' THEN 1
        WHEN 'OPERATIONS_DESIGN' THEN 2
        WHEN 'ACCOUNTING' THEN 3
        ELSE 4
      END,
      LOWER(auth.email) ASC
  `)
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string | number
  hint?: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[12px] text-slate-500">{label}</p>
      <p className="mt-2 text-[28px] font-semibold text-slate-900">{value}</p>
      {hint ? <p className="mt-1 text-[11px] text-slate-400">{hint}</p> : null}
    </div>
  )
}

export const dynamic = "force-dynamic"

export default async function UsersDashboard({ searchParams }: UsersPageProps) {
  const currentUser = await requireAuthenticatedAppUser()

  if (currentUser.role !== "ADMIN_MANAGEMENT") {
    redirect(ROLE_REDIRECT[currentUser.role])
  }

  const resolvedSearchParams = searchParams ? await searchParams : {}
  const message = getSearchValue(resolvedSearchParams.message)
  const tone = getSearchValue(resolvedSearchParams.tone) === "error" ? "error" : "success"
  const managedAccounts = await getManagedAccounts()

  const totalUsers = managedAccounts.length
  const activeUsers = managedAccounts.filter((a) => a.status.toUpperCase() === "ACTIVE").length
  const invitedUsers = managedAccounts.filter((a) => a.status.toUpperCase() === "INVITED").length
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  const newUsers = managedAccounts.filter(
    (a) => a.createdAt && new Date(a.createdAt).getTime() >= thirtyDaysAgo,
  ).length

  const serialized: ManagedAccount[] = managedAccounts.map((a) => ({
    id: a.id,
    authUserId: a.authUserId,
    email: a.email,
    name: a.name,
    role: a.role,
    status: a.status,
    lastLoginAt: a.lastLoginAt ? new Date(a.lastLoginAt).toISOString() : null,
    createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : null,
    updatedAt: a.updatedAt ? new Date(a.updatedAt).toISOString() : null,
  }))

  const staffRoleOptions = STAFF_ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] }))
  const internalRoleOptions = INTERNAL_ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] }))

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[12px] text-slate-500">Home / Users</p>
            <h1 className="mt-1 text-[24px] font-semibold text-slate-900">User List</h1>
          </div>
          <a
            href="#add-user"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-slate-800"
          >
            + Add User
          </a>
        </div>

        {message ? (
          <div
            className={`rounded-xl border px-5 py-4 text-[13px] ${
              tone === "error"
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {message}
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Users" value={totalUsers} hint="Internal accounts" />
          <StatCard label="New Users" value={`+${newUsers}`} hint="Last 30 days" />
          <StatCard label="Pending Verifications" value={invitedUsers} hint="Status: Invited" />
          <StatCard
            label="Active Users"
            value={activeUsers}
            hint={`${totalUsers ? Math.round((activeUsers / totalUsers) * 100) : 0}% of users`}
          />
        </section>

        <UsersTable
          users={serialized}
          currentAuthUserId={currentUser.authUserId ?? ""}
          variant="internal"
          staffRoleOptions={staffRoleOptions}
          internalRoleOptions={internalRoleOptions}
          roleLabels={ROLE_LABELS}
        />

        <section
          id="add-user"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-4">
            <h2 className="text-[18px] font-semibold text-slate-900">Add internal account</h2>
            <p className="mt-1 text-[12px] text-slate-500">
              Creates a Neon Auth login and syncs the staff record.
            </p>
          </div>
          <form
            method="post"
            action="/api/admin/accounts/create"
            className="grid gap-3 lg:grid-cols-[1.2fr_1.2fr_1fr_1fr_auto]"
          >
            <input
              name="name"
              placeholder="Full name"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none focus:border-slate-400"
            />
            <input
              name="email"
              type="email"
              placeholder="staff@sims.com"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none focus:border-slate-400"
            />
            <input
              name="password"
              type="password"
              placeholder="Temporary password"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none focus:border-slate-400"
            />
            <select
              name="role"
              defaultValue="SALES"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none focus:border-slate-400"
            >
              {STAFF_ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-slate-800"
            >
              Add account
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
