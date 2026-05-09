import { redirect } from "next/navigation"
import { AccountingApprovalsList } from "@/components/accounting/AccountingApprovalsList"
import { ApprovalHistoryTable, PaymentRecordsTable } from "@/components/accounting/AccountingTables"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { getInquiryWorkflowRows } from "@/lib/inquiries"
import { ROLE_REDIRECT } from "@/lib/rbac"

type AccountingPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const ACCOUNTING_TABS = new Set(["approvals", "history", "documents"])

function resolveValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

function resolveTab(tab?: string | string[]) {
  const value = resolveValue(tab)
  return value && ACCOUNTING_TABS.has(value) ? value : "approvals"
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#d1d5db] bg-white p-10 text-center text-[13px] text-[#6b7280]">
      {message}
    </div>
  )
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

export default async function AccountingDashboard({ searchParams }: AccountingPageProps) {
  const currentUser = await requireAuthenticatedAppUser()

  if (!["ACCOUNTING", "ADMIN_MANAGEMENT"].includes(currentUser.role)) {
    redirect(ROLE_REDIRECT[currentUser.role])
  }

  const resolvedSearchParams = searchParams ? await searchParams : {}
  const activeTab = resolveTab(resolvedSearchParams.tab)
  const message = resolveValue(resolvedSearchParams.message)
  const tone = resolveValue(resolvedSearchParams.tone) === "error" ? "error" : "success"
  const inquiries = await getInquiryWorkflowRows(["PENDING_ACCOUNTING_APPROVAL"])
  const accountingHistory = (await getInquiryWorkflowRows()).filter(
    (inquiry) =>
      inquiry.paymentMethod &&
      ["GETTING_READY_FOR_BUILDING", "READY_FOR_SHIPPING", "COMPLETED"].includes(inquiry.workflowStatus),
  )
  const allAccountingRows = [...inquiries, ...accountingHistory]
  const pendingApprovals = inquiries.filter((inquiry) => inquiry.paymentReviewStatus === "PENDING").length
  const totalCollectedToday = allAccountingRows
    .filter((inquiry) => {
      const updatedAt = new Date(inquiry.updatedAt)
      const today = new Date()
      return (
        inquiry.paymentReviewStatus === "APPROVED" &&
        updatedAt.getFullYear() === today.getFullYear() &&
        updatedAt.getMonth() === today.getMonth() &&
        updatedAt.getDate() === today.getDate()
      )
    })
    .reduce((sum, inquiry) => sum + inquiry.paid, 0)
  const outstandingBalances = allAccountingRows.reduce((sum, inquiry) => sum + inquiry.remainingBalance, 0)
  const rejectedPayments = allAccountingRows.filter((inquiry) => inquiry.paymentReviewStatus === "REJECTED").length

  return (
    <main className="min-h-screen bg-[#fcfcfc] p-8">
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-[#111827]">Accounting Workspace</h1>
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

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending Approvals" value={pendingApprovals} />
        <StatCard label="Total Collected Today" value={formatPeso(totalCollectedToday)} />
        <StatCard label="Outstanding Balances" value={formatPeso(outstandingBalances)} />
        <StatCard label="Rejected Payments" value={rejectedPayments} />
      </div>

      {activeTab === "approvals" && (
        <div className="space-y-6">
          <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-[20px] font-semibold text-[#111827]">Accounting approval page</h2>
              <p className="mt-2 max-w-[760px] text-[14px] leading-[22px] text-[#6b7280]">
                Inventory has already confirmed materials for these customer orders. Approve the payment stage here to
                move each order to operations for building preparation.
              </p>
            </div>

            {inquiries.length === 0 ? (
              <EmptyState message="No customer orders are currently waiting on accounting approval." />
            ) : (
              <AccountingApprovalsList rows={inquiries} />
            )}
          </section>
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-6">
          <ApprovalHistoryTable rows={accountingHistory} />
        </div>
      )}

      {activeTab === "documents" && (
        <div className="space-y-6">
          <PaymentRecordsTable rows={accountingHistory} />
        </div>
      )}
    </main>
  )
}
