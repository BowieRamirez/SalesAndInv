import { redirect } from "next/navigation"
import { Prisma, prisma } from "@furnitrack/db"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { ROLE_LABELS, ROLE_REDIRECT } from "@/lib/rbac"
import { UsersTable, type ManagedAccount } from "@/components/users/UsersTable"

type CustomerRow = {
  id: string
  authUserId: string
  email: string
  name: string
  status: string
  lastLoginAt: Date | null
  createdAt: Date | null
  updatedAt: Date | null
  company: string | null
}

type CustomersPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function getSearchValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

async function getCustomers() {
  return prisma.$queryRaw<CustomerRow[]>(Prisma.sql`
    SELECT
      COALESCE(app.id, auth.id::text) AS id,
      auth.id::text AS "authUserId",
      LOWER(auth.email) AS email,
      COALESCE(NULLIF(app.name, ''), NULLIF(auth.name, ''), split_part(auth.email, '@', 1)) AS name,
      COALESCE(app.status::text, 'ACTIVE') AS status,
      app."lastLoginAt",
      COALESCE(app."createdAt", auth."createdAt") AS "createdAt",
      COALESCE(app."updatedAt", auth."updatedAt") AS "updatedAt",
      c.name AS company
    FROM neon_auth."user" auth
    LEFT JOIN LATERAL (
      SELECT *
      FROM public.users app
      WHERE app."authUserId"::text = auth.id::text OR LOWER(app.email) = LOWER(auth.email)
      ORDER BY CASE WHEN app."authUserId"::text = auth.id::text THEN 0 ELSE 1 END
      LIMIT 1
    ) app ON TRUE
    LEFT JOIN public.companies c ON c.id = app."companyId"
    WHERE (
      CASE
        WHEN auth.role IN ('ADMIN', 'ANALYTICS', 'ADMIN_MANAGEMENT') THEN 'ADMIN_MANAGEMENT'
        WHEN auth.role IN ('SALES', 'INVENTORY', 'ACCOUNTING', 'OPERATIONS_DESIGN', 'CUSTOM') THEN auth.role
        ELSE 'CLIENT'
      END
    ) = 'CLIENT'
    ORDER BY LOWER(auth.email) ASC
  `)
}

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[12px] text-slate-500">{label}</p>
      <p className="mt-2 text-[28px] font-semibold text-slate-900">{value}</p>
      {hint ? <p className="mt-1 text-[11px] text-slate-400">{hint}</p> : null}
    </div>
  )
}

export const dynamic = "force-dynamic"

export default async function CustomersDashboard({ searchParams }: CustomersPageProps) {
  const currentUser = await requireAuthenticatedAppUser()

  if (currentUser.role !== "ADMIN_MANAGEMENT") {
    redirect(ROLE_REDIRECT[currentUser.role])
  }

  const resolvedSearchParams = searchParams ? await searchParams : {}
  const message = getSearchValue(resolvedSearchParams.message)
  const tone = getSearchValue(resolvedSearchParams.tone) === "error" ? "error" : "success"
  const customers = await getCustomers()

  const totalCustomers = customers.length
  const activeCustomers = customers.filter((c) => c.status.toUpperCase() === "ACTIVE").length
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  const newCustomers = customers.filter(
    (c) => c.createdAt && new Date(c.createdAt).getTime() >= thirtyDaysAgo,
  ).length
  const linkedCompanies = customers.filter((c) => c.company).length

  const serialized: ManagedAccount[] = customers.map((c) => ({
    id: c.id,
    authUserId: c.authUserId,
    email: c.email,
    name: c.name,
    role: "CLIENT",
    status: c.status,
    lastLoginAt: c.lastLoginAt ? new Date(c.lastLoginAt).toISOString() : null,
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : null,
    updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : null,
    company: c.company,
  }))

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[12px] text-slate-500">Home / Customers</p>
            <h1 className="mt-1 text-[24px] font-semibold text-slate-900">Customers</h1>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Customers" value={totalCustomers} hint="Client accounts" />
          <StatCard label="New Customers" value={`+${newCustomers}`} hint="Last 30 days" />
          <StatCard label="With Company" value={linkedCompanies} hint="Linked to a company" />
          <StatCard
            label="Active"
            value={activeCustomers}
            hint={`${totalCustomers ? Math.round((activeCustomers / totalCustomers) * 100) : 0}% of customers`}
          />
        </section>

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
          variant="customer"
          roleLabels={ROLE_LABELS}
        />
      </div>
    </main>
  )
}
