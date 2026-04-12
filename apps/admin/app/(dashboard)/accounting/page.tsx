import { redirect } from "next/navigation"
import { formatInquiryWorkflowStatus, getInquiryWorkflowStyle } from "@furnitrack/validators"
import { PaymentApprovalCard } from "@/components/accounting/PaymentApprovalCard"
import { formatAccountingPaymentMethod } from "@/lib/accounting-payment-methods"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { getInquiryWorkflowRows, type InquiryWorkflowRow } from "@/lib/inquiries"
import { ROLE_REDIRECT } from "@/lib/rbac"

type AccountingPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const ACCOUNTING_TABS = new Set(["auto-compute", "approvals", "history", "documents"])

function resolveValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

function resolveTab(tab?: string | string[]) {
  const value = resolveValue(tab)
  return value && ACCOUNTING_TABS.has(value) ? value : "approvals"
}

function WorkflowBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] ${getInquiryWorkflowStyle(status)}`}
    >
      {formatInquiryWorkflowStatus(status)}
    </span>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#d1d5db] bg-white p-10 text-center text-[13px] text-[#6b7280]">
      {message}
    </div>
  )
}

function ApprovalHistoryCard({ inquiry }: { inquiry: InquiryWorkflowRow }) {
  return (
    <article className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Accounting history</p>
          <h3 className="mt-1 text-[20px] font-semibold text-[#111827]">{inquiry.productName}</h3>
          <p className="mt-2 text-[13px] text-[#6b7280]">
            {inquiry.customerName} - {inquiry.customerEmail} - {inquiry.customerPhone}
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-[16px] bg-[#f8fafc] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#94a3b8]">Payment method</p>
              <p className="mt-2 text-[14px] font-medium text-[#111827]">
                {inquiry.paymentMethod ? formatAccountingPaymentMethod(inquiry.paymentMethod) : "Not recorded"}
              </p>
            </div>
            <div className="rounded-[16px] bg-[#f8fafc] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#94a3b8]">Approved on</p>
              <p className="mt-2 text-[14px] font-medium text-[#111827]">
                {new Date(inquiry.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[16px] bg-[#fffaf0] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#c2410c]">Approval note</p>
            <p className="mt-2 text-[14px] leading-[22px] text-[#7c2d12]">
              {inquiry.workflowNote ?? "No approval note was saved for this order."}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 text-[12px] text-[#6b7280] lg:items-end">
          <WorkflowBadge status={inquiry.workflowStatus} />
          <p>Current stage after accounting approval</p>
        </div>
      </div>
    </article>
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
  const buildingCount = (await getInquiryWorkflowRows(["GETTING_READY_FOR_BUILDING"])).length

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

      {activeTab === "auto-compute" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
              <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">Waiting on accounting</p>
              <p className="mt-2 text-[28px] font-semibold text-[#c2410c]">{inquiries.length}</p>
            </div>
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
              <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">Released to operations</p>
              <p className="mt-2 text-[28px] font-semibold text-[#b45309]">{buildingCount}</p>
            </div>
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
              <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">Payment gate</p>
              <p className="mt-2 text-[28px] font-semibold text-[#111827]">Step 3 of 5</p>
            </div>
          </div>

          <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-[20px] font-semibold text-[#111827]">Billing basis</h2>
              <p className="mt-2 max-w-[760px] text-[14px] leading-[22px] text-[#6b7280]">
                Use this view as the accounting overview for computation and payment readiness. The actual approval
                action lives on the Approvals page, while Approval History keeps a formal record of previously approved
                orders.
              </p>
            </div>
            <EmptyState message="Billing calculations can be added here without duplicating the approval workflow." />
          </section>
        </div>
      )}

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
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <PaymentApprovalCard key={inquiry.id} inquiry={inquiry} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-6">
          <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-[20px] font-semibold text-[#111827]">Accounting approval history</h2>
              <p className="mt-2 max-w-[760px] text-[14px] leading-[22px] text-[#6b7280]">
                Review previously approved payments here for history and formality. Each record shows the order, the
                payment method chosen by accounting, the note saved during approval, and the stage reached afterward.
              </p>
            </div>

            {accountingHistory.length === 0 ? (
              <EmptyState message="No accounting approvals have been recorded yet." />
            ) : (
              <div className="space-y-4">
                {accountingHistory.map((inquiry) => (
                  <ApprovalHistoryCard key={inquiry.id} inquiry={inquiry} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === "documents" && (
        <EmptyState message="Document handling can be connected to this same payment queue later." />
      )}
    </main>
  )
}
