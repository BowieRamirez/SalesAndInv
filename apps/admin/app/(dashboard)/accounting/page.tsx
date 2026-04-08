import { redirect } from "next/navigation"
import {
  formatInquiryWorkflowStatus,
  getInquiryWorkflowStyle,
} from "@furnitrack/validators"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { getInquiryWorkflowRows, type InquiryWorkflowRow } from "@/lib/inquiries"
import { ROLE_REDIRECT } from "@/lib/rbac"

type AccountingPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const ACCOUNTING_TABS = new Set(["auto-compute", "payments", "approvals", "documents"])

function resolveValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

function resolveTab(tab?: string | string[]) {
  const value = resolveValue(tab)
  return value && ACCOUNTING_TABS.has(value) ? value : "payments"
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

function PaymentApprovalCard({ inquiry }: { inquiry: InquiryWorkflowRow }) {
  return (
    <article className="rounded-xl border border-[#eef2f7] bg-[#fbfcfd] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Payment review</p>
          <h3 className="mt-1 text-[20px] font-semibold text-[#111827]">{inquiry.productName}</h3>
          <p className="mt-2 text-[13px] text-[#6b7280]">
            {inquiry.customerName} · {inquiry.customerEmail} · {inquiry.customerPhone}
          </p>
          <p className="mt-3 max-w-[720px] text-[14px] leading-[22px] text-[#1f2937]">{inquiry.message}</p>
          {inquiry.workflowNote ? (
            <p className="mt-3 rounded-xl bg-white px-4 py-3 text-[13px] text-[#4b5563]">
              Latest note: {inquiry.workflowNote}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col items-start gap-3 text-[12px] text-[#6b7280] lg:items-end">
          <WorkflowBadge status={inquiry.workflowStatus} />
          <div>
            <p>Created {new Date(inquiry.createdAt).toLocaleDateString()}</p>
            <p className="mt-1">Updated {new Date(inquiry.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <form method="post" action="/api/admin/approvals/accounting" className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <input type="hidden" name="inquiryId" value={inquiry.id} />
        <label className="block">
          <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
            Accounting approval note
          </span>
          <input
            name="statusNote"
            defaultValue={inquiry.workflowNote ?? ""}
            placeholder="Confirm payment before operations starts building"
            className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
          />
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            className="rounded-[12px] bg-[#111827] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90"
          >
            Approve payment
          </button>
        </div>
      </form>
    </article>
  )
}

function PaymentQueueRow({ inquiry }: { inquiry: InquiryWorkflowRow }) {
  return (
    <tr className="border-b border-[#eef2f7] last:border-b-0">
      <td className="py-4 pr-4 text-[#111827]">{inquiry.productName}</td>
      <td className="py-4 pr-4 text-[#4b5563]">{inquiry.customerName}</td>
      <td className="py-4 pr-4">
        <WorkflowBadge status={inquiry.workflowStatus} />
      </td>
      <td className="py-4 text-[#4b5563]">{inquiry.workflowNote ?? "Waiting for accounting review."}</td>
    </tr>
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
                action lives on the Approvals page, while Payments shows the current accounting queue without actions.
              </p>
            </div>
            <EmptyState message="Billing calculations can be added here without duplicating the approval workflow." />
          </section>
        </div>
      )}

      {activeTab === "payments" && (
        <div className="space-y-6">
          <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-[20px] font-semibold text-[#111827]">Payment queue</h2>
              <p className="mt-2 max-w-[760px] text-[14px] leading-[22px] text-[#6b7280]">
                This page shows what accounting is currently reviewing. To actually approve and move orders to
                operations, use the Approvals page.
              </p>
            </div>
            {inquiries.length === 0 ? (
              <EmptyState message="No customer orders are currently in the accounting payment queue." />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
                      <th className="py-3 pr-4 font-medium">Product</th>
                      <th className="py-3 pr-4 font-medium">Customer</th>
                      <th className="py-3 pr-4 font-medium">Stage</th>
                      <th className="py-3 font-medium">Latest note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inquiry) => (
                      <PaymentQueueRow key={inquiry.id} inquiry={inquiry} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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

      {activeTab === "documents" && (
        <EmptyState message="Document handling can be connected to this same payment queue later." />
      )}
    </main>
  )
}
