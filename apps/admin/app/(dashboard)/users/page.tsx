import { redirect } from "next/navigation"
import { Prisma, prisma } from "@furnitrack/db"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { APP_ROLES, ROLE_LABELS, ROLE_REDIRECT, type AppRole } from "@/lib/rbac"
import { UsersTable, type ManagedAccount } from "@/components/users/UsersTable"
import { AddUserModal } from "@/components/users/AddUserModal"

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
  emailVerifiedAt: Date | null
  lastLoginAt: Date | null
  createdAt: Date | null
  updatedAt: Date | null
  permissions: any | null
}

const INTERNAL_ROLES = APP_ROLES.filter((role) => role !== "CLIENT")
const STAFF_ROLES = INTERNAL_ROLES.filter((role) => role !== "ADMIN_MANAGEMENT")

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
      app."emailVerifiedAt",
      app."lastLoginAt",
      COALESCE(app."createdAt", auth."createdAt") AS "createdAt",
      COALESCE(app."updatedAt", auth."updatedAt") AS "updatedAt",
      app.permissions
    FROM neon_auth."user" auth
    LEFT JOIN LATERAL (
      SELECT *
      FROM public.users app
      WHERE app."authUserId"::text = auth.id::text OR LOWER(app.email) = LOWER(auth.email)
      ORDER BY CASE WHEN app."authUserId"::text = auth.id::text THEN 0 ELSE 1 END
      LIMIT 1
    ) app ON TRUE
    ORDER BY
      CASE ${AUTH_ROLE_CASE_SQL}
        WHEN 'ADMIN_MANAGEMENT' THEN 0
        WHEN 'SALES' THEN 1
        WHEN 'OPERATIONS_DESIGN' THEN 2
        WHEN 'ACCOUNTING' THEN 3
        WHEN 'CUSTOM' THEN 4
        ELSE 5
      END,
      LOWER(auth.email) ASC
  `)
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

  const serialized: ManagedAccount[] = managedAccounts.map((a) => ({
    id: a.id,
    authUserId: a.authUserId,
    email: a.email,
    name: a.name,
    role: a.role,
    status: a.status,
    emailVerifiedAt: a.emailVerifiedAt ? new Date(a.emailVerifiedAt).toISOString() : null,
    lastLoginAt: a.lastLoginAt ? new Date(a.lastLoginAt).toISOString() : null,
    createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : null,
    updatedAt: a.updatedAt ? new Date(a.updatedAt).toISOString() : null,
    permissions: a.permissions ? (typeof a.permissions === 'string' ? JSON.parse(a.permissions) : a.permissions) : null,
  }))

  const staffRoleOptions = STAFF_ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] }))
  const internalRoleOptions = INTERNAL_ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] }))

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="w-full space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[12px] text-slate-500">Home / Users</p>
            <h1 className="mt-1 text-[24px] font-semibold text-slate-900">User List</h1>
            <p className="mt-1 text-[13px] text-slate-500">Internal staff and client accounts in one place.</p>
          </div>
          <AddUserModal roles={staffRoleOptions} />
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

        <UsersTable
          users={serialized}
          currentAuthUserId={currentUser.authUserId ?? ""}
          variant="internal"
          staffRoleOptions={staffRoleOptions}
          internalRoleOptions={internalRoleOptions}
          roleLabels={ROLE_LABELS}
        />
      </div>
    </main>
  )
}
