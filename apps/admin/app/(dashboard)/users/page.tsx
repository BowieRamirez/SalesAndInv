import { redirect } from "next/navigation"
import { Prisma, prisma } from "@furnitrack/db"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { APP_ROLES, ROLE_LABELS, ROLE_REDIRECT, type AppRole } from "@/lib/rbac"
import { PasswordField } from "@/components/users/PasswordField"

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
    WHEN auth.role = 'INVENTORY' THEN 'INVENTORY'
    WHEN auth.role = 'ACCOUNTING' THEN 'ACCOUNTING'
    WHEN auth.role = 'OPERATIONS_DESIGN' THEN 'OPERATIONS_DESIGN'
    ELSE 'CLIENT'
  END
`

function getSearchValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function formatDate(value: Date | null) {
  if (!value) {
    return "Never"
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function formatStatusLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
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
        WHEN 'INVENTORY' THEN 4
        ELSE 5
      END,
      LOWER(auth.email) ASC
  `)
}

function StatCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
      <p className="text-[12px] uppercase tracking-[0.18em] text-[#94a3b8]">{label}</p>
      <p className="mt-3 text-[30px] font-semibold text-[#0f172a]">{value}</p>
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

  const roleBreakdown = INTERNAL_ROLES.map((role) => ({
    role,
    count: managedAccounts.filter((account) => account.role === role).length,
  }))

  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {message ? (
          <div
            className={`rounded-2xl border px-5 py-4 text-[14px] ${
              tone === "error"
                ? "border-[#fecaca] bg-[#fff1f2] text-[#9f1239]"
                : "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
            }`}
          >
            {message}
          </div>
        ) : null}

        <section className="grid gap-5 md:grid-cols-3">
          <StatCard label="Internal Accounts" value={managedAccounts.length} />
          <StatCard
            label="Executive Admins"
            value={roleBreakdown.find((entry) => entry.role === "ADMIN_MANAGEMENT")?.count ?? 0}
          />
          <StatCard label="Role Coverage" value={roleBreakdown.filter((entry) => entry.count > 0).length} />
        </section>

        <section className="rounded-[28px] border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-[22px] font-semibold text-[#0f172a]">Add internal account</h2>
            </div>
          </div>

          <form method="post" action="/api/admin/accounts/create" className="grid gap-4 lg:grid-cols-[1.2fr_1.2fr_1fr_1fr_auto]">
            <input
              name="name"
              placeholder="Executive Admin"
              className="w-full rounded-2xl border border-[#dbe4f0] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
            />
            <input
              name="email"
              type="email"
              placeholder="staff@sims.com"
              className="w-full rounded-2xl border border-[#dbe4f0] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
            />
            <input
              name="password"
              type="password"
              placeholder="Temporary password"
              className="w-full rounded-2xl border border-[#dbe4f0] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
            />
            <select
              name="role"
              defaultValue="SALES"
              className="w-full rounded-2xl border border-[#dbe4f0] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
            >
              {STAFF_ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-2xl bg-[#0f172a] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#0f172a]/90"
            >
              Add account
            </button>
          </form>
        </section>

        <section className="space-y-5">
          <div className="rounded-[28px] border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-[22px] font-semibold text-[#0f172a]">Internal account roster</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {roleBreakdown.map((entry) => (
                  <span
                    key={entry.role}
                    className="rounded-full border border-[#dbe4f0] bg-[#f8fafc] px-3 py-1.5 text-[12px] font-medium text-[#475569]"
                  >
                    {ROLE_LABELS[entry.role]}: {entry.count}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {managedAccounts.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-[#cbd5e1] bg-white p-12 text-center text-[14px] text-[#64748b]">
              No internal accounts were found in Neon Auth yet.
            </div>
          ) : (
            <div className="overflow-hidden rounded-[28px] border border-[#e2e8f0] bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-[1120px] w-full text-left">
                  <thead className="bg-[#f8fafc]">
                    <tr className="border-b border-[#e2e8f0] text-[12px] uppercase tracking-[0.16em] text-[#94a3b8]">
                      <th className="px-6 py-4 font-semibold">Account</th>
                      <th className="px-4 py-4 font-semibold">Role</th>
                      <th className="px-4 py-4 font-semibold">Status</th>
                      <th className="px-4 py-4 font-semibold">Last Login</th>
                      <th className="px-4 py-4 font-semibold">Created</th>
                      <th className="px-4 py-4 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  {managedAccounts.map((account) => {
                    const isCurrentUser = currentUser.authUserId === account.authUserId
                    const editableRoles = isCurrentUser ? INTERNAL_ROLES : STAFF_ROLES
                    const isExecutiveAccount = account.role === "ADMIN_MANAGEMENT"

                    return (
                      <tbody key={account.authUserId}>
                        <tr className="border-b border-[#eef2f7] align-top">
                            <td className="px-6 py-5">
                              <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e2e8f0] text-[13px] font-semibold text-[#0f172a]">
                                  {getInitials(account.name)}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-[17px] font-semibold text-[#0f172a]">{account.name}</p>
                                    {isCurrentUser ? (
                                      <span className="rounded-full bg-[#dbeafe] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8]">
                                        Current
                                      </span>
                                    ) : null}
                                  </div>
                                  <p className="mt-1 text-[13px] text-[#475569]">{account.email}</p>
                                  <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">
                                    Last synced {formatDate(account.updatedAt)}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-5">
                              <span className="inline-flex rounded-full bg-[#eaf2ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8]">
                                {ROLE_LABELS[account.role]}
                              </span>
                            </td>
                            <td className="px-4 py-5">
                              <span className="inline-flex rounded-full bg-[#f8fafc] px-3 py-1 text-[11px] font-medium text-[#475569]">
                                {formatStatusLabel(account.status)}
                              </span>
                            </td>
                            <td className="px-4 py-5 text-[13px] text-[#475569]">{formatDate(account.lastLoginAt)}</td>
                            <td className="px-4 py-5 text-[13px] text-[#475569]">{formatDate(account.createdAt)}</td>
                            <td className="px-4 py-5 text-[12px] leading-6 text-[#64748b]">
                              {isExecutiveAccount
                                ? "Protected executive account."
                                : "Inline controls are available below this row."}
                            </td>
                          </tr>
                        <tr className="border-b border-[#eef2f7] last:border-b-0">
                            <td colSpan={6} className="bg-[#fbfdff] px-6 py-5">
                              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_220px]">
                                <form method="post" action="/api/admin/accounts/update" className="rounded-2xl border border-[#e2e8f0] bg-white p-4">
                                  <input type="hidden" name="authUserId" value={account.authUserId} />
                                  <input type="hidden" name="email" value={account.email} />
                                  <div className="mb-3 flex items-center justify-between">
                                    <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Edit details</p>
                                  </div>
                                  <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_150px]">
                                    <input
                                      name="name"
                                      defaultValue={account.name}
                                      disabled={isExecutiveAccount}
                                      className="w-full rounded-xl border border-[#dbe4f0] bg-white px-3 py-2.5 text-[13px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] disabled:cursor-not-allowed disabled:bg-[#f8fafc] disabled:text-[#64748b]"
                                    />
                                    {isExecutiveAccount ? (
                                      <div className="w-full rounded-xl border border-[#dbe4f0] bg-[#f8fafc] px-3 py-2.5 text-[13px] text-[#64748b]">
                                        {ROLE_LABELS[account.role]}
                                      </div>
                                    ) : (
                                      <select
                                        name="role"
                                        defaultValue={account.role}
                                        className="w-full rounded-xl border border-[#dbe4f0] bg-white px-3 py-2.5 text-[13px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                                      >
                                        {editableRoles.map((role) => (
                                          <option key={role} value={role}>
                                            {ROLE_LABELS[role]}
                                          </option>
                                        ))}
                                      </select>
                                    )}
                                    <button
                                      type="submit"
                                      disabled={isExecutiveAccount}
                                      className="w-full rounded-xl bg-[#0f172a] px-3 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#0f172a]/90 disabled:cursor-not-allowed disabled:bg-[#cbd5e1]"
                                    >
                                      {isExecutiveAccount ? "Executive locked" : "Save details"}
                                    </button>
                                  </div>
                                  <p className="mt-2 text-[11px] leading-5 text-[#64748b]">
                                    {isExecutiveAccount
                                      ? "This protected executive account cannot be edited here."
                                      : "Admin / Management stays reserved for the single executive account."}
                                  </p>
                                </form>

                                <form method="post" action="/api/admin/accounts/password" className="rounded-2xl border border-[#e2e8f0] bg-white p-4">
                                  <div className="mb-3 flex items-center justify-between">
                                    <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Password</p>
                                  </div>
                                  <input type="hidden" name="authUserId" value={account.authUserId} />
                                  <input type="hidden" name="email" value={account.email} />
                                  <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_170px]">
                                    <PasswordField
                                      name="newPassword"
                                      placeholder="New password"
                                      className="w-full rounded-xl border border-[#dbe4f0] bg-white px-3 py-2.5 text-[13px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                                    />
                                    <button
                                      type="submit"
                                      className="w-full rounded-xl bg-[#1d4ed8] px-3 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#1d4ed8]/90"
                                    >
                                      Update password
                                    </button>
                                  </div>
                                </form>

                                <form method="post" action="/api/admin/accounts/remove" className="rounded-2xl border border-[#fee2e2] bg-[#fff7f7] p-4">
                                  <div className="mb-3 flex items-center justify-between">
                                    <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#f97316]">Remove</p>
                                  </div>
                                  <input type="hidden" name="authUserId" value={account.authUserId} />
                                  <input type="hidden" name="email" value={account.email} />
                                  <button
                                    type="submit"
                                    disabled={isCurrentUser}
                                    className="w-full rounded-xl bg-[#dc2626] px-3 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#dc2626]/90 disabled:cursor-not-allowed disabled:bg-[#fca5a5]"
                                  >
                                    {isCurrentUser ? "Current account" : "Remove account"}
                                  </button>
                                  <p className="mt-2 text-[11px] leading-5 text-[#b45309]">
                                    {isCurrentUser ? "You cannot remove the active session." : "Deletes the Neon login and app record."}
                                  </p>
                                </form>
                              </div>
                            </td>
                        </tr>
                      </tbody>
                    )
                  })}
                </table>
              </div>
            </div>
          )}
        </section>

      </div>
    </main>
  )
}
