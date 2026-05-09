import { redirect } from "next/navigation"
import { PaymentFollowUpsTable } from "@/components/accounting/PaymentFollowUpsTable"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { getInquiryWorkflowRows } from "@/lib/inquiries"
import { ROLE_REDIRECT } from "@/lib/rbac"

type AccountingFollowUpsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function resolveValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

function formatPeso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(value)
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
      <p className="text-[12px] uppercase tracking-[0.16em] text-[#94a3b8]">{label}</p>
      <p className="mt-3 text-[24px] font-semibold text-[#111827]">{value}</p>
    </div>
  )
}

export const dynamic = "force-dynamic"

export default async function AccountingFollowUpsPage({ searchParams }: AccountingFollowUpsPageProps) {
  const currentUser = await requireAuthenticatedAppUser()

  if (!["ACCOUNTING", "ADMIN_MANAGEMENT"].includes(currentUser.role)) {
    redirect(ROLE_REDIRECT[currentUser.role])
  }

  const resolvedSearchParams = searchParams ? await searchParams : {}
  const message = resolveValue(resolvedSearchParams.message)
  const tone = resolveValue(resolvedSearchParams.tone) === "error" ? "error" : "success"
  const rows = (await getInquiryWorkflowRows()).filter((row) =>
    ["DOWN_PAYMENT", "PARTIALLY_PAID"].includes(row.paymentStatus),
  )
  const downPaymentCount = rows.filter((row) => row.paymentStatus === "DOWN_PAYMENT").length
  const partialCount = rows.filter((row) => row.paymentStatus === "PARTIALLY_PAID").length
  const outstandingBalance = rows.reduce((sum, row) => sum + row.remainingBalance, 0)

  return (
    <main className="min-h-screen bg-[#fcfcfc] p-8">
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-[#111827]">Payment Follow-ups</h1>
        <p className="mt-2 max-w-[760px] text-[14px] leading-[22px] text-[#6b7280]">
          Monitor customer orders that are still down-payment or partially paid, then mark them fully paid once collection is complete.
        </p>
      </div>

      {message ? (
        <div
          className={`mb-6 rounded-2xl border px-5 py-4 text-[14px] ${
            tone === "error"
              ? "border-[#fecaca] bg-[#fff1f2] text-[#9f1239]"
              : "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <StatCard label="Down Payment Orders" value={downPaymentCount} />
        <StatCard label="Partially Paid Orders" value={partialCount} />
        <StatCard label="Outstanding Balance" value={formatPeso(outstandingBalance)} />
      </div>

      <PaymentFollowUpsTable rows={rows} />
    </main>
  )
}
