import { redirect } from "next/navigation"
import {
  formatInquiryWorkflowStatus,
  getInquiryWorkflowStyle,
} from "@furnitrack/validators"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { ROLE_REDIRECT } from "@/lib/rbac"
import { getInquiryWorkflowRows, type InquiryWorkflowRow } from "@/lib/inquiries"

type SalesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const SALES_TABS = new Set(["lead", "approvals", "quotes", "orders", "tracker"])

function resolveTab(tab?: string | string[]) {
  const value = Array.isArray(tab) ? tab[0] : tab
  return value && SALES_TABS.has(value) ? value : "lead"
}

function resolveValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

function PlaceholderCard({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white p-8 shadow-sm">
      <h3 className="text-[16px] font-semibold text-[#1f2937]">{title}</h3>
    </div>
  )
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

function SalesLeadCard({ inquiry }: { inquiry: InquiryWorkflowRow }) {
  return (
    <article className="rounded-xl border border-[#eef2f7] bg-[#fbfcfd] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Customer order inquiry</p>
          <h3 className="mt-1 text-[20px] font-semibold text-[#111827]">{inquiry.productName}</h3>
          <p className="mt-2 text-[13px] text-[#6b7280]">
            {inquiry.customerName} · {inquiry.customerEmail} · {inquiry.customerPhone}
          </p>
          <p className="mt-3 max-w-[720px] text-[14px] leading-[22px] text-[#1f2937]">{inquiry.message}</p>
        </div>

        <div className="flex flex-col items-start gap-3 text-[12px] text-[#6b7280] lg:items-end">
          <WorkflowBadge status={inquiry.workflowStatus} />
          <div>
            <p>Created {new Date(inquiry.createdAt).toLocaleDateString()}</p>
            <p className="mt-1">Updated {new Date(inquiry.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <form method="post" action="/api/admin/approvals/sales" className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <input type="hidden" name="inquiryId" value={inquiry.id} />
        <label className="block">
          <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
            Sales note before inventory review
          </span>
          <input
            name="statusNote"
            defaultValue={inquiry.workflowNote ?? ""}
            placeholder="Tell inventory what to validate for this customer order"
            className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
          />
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            className="rounded-[12px] bg-[#111827] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90"
          >
            Request inventory approval
          </button>
        </div>
      </form>
    </article>
  )
}

function TrackerRow({ inquiry }: { inquiry: InquiryWorkflowRow }) {
  return (
    <tr className="border-b border-[#eef2f7] last:border-b-0">
      <td className="py-4 pr-4 text-[#111827]">{inquiry.productName}</td>
      <td className="py-4 pr-4 text-[#4b5563]">{inquiry.customerName}</td>
      <td className="py-4 pr-4">
        <WorkflowBadge status={inquiry.workflowStatus} />
      </td>
      <td className="py-4 text-[#4b5563]">{inquiry.workflowNote ?? "No note yet."}</td>
    </tr>
  )
}

function SalesInquiryRow({ inquiry }: { inquiry: InquiryWorkflowRow }) {
  return (
    <tr className="border-b border-[#eef2f7] last:border-b-0">
      <td className="py-4 pr-4 text-[#111827]">{inquiry.productName}</td>
      <td className="py-4 pr-4 text-[#4b5563]">{inquiry.customerName}</td>
      <td className="py-4 pr-4">
        <WorkflowBadge status={inquiry.workflowStatus} />
      </td>
      <td className="py-4 text-[#4b5563]">{inquiry.workflowNote ?? inquiry.message}</td>
    </tr>
  )
}

export const dynamic = "force-dynamic"

export default async function SalesDashboard({ searchParams }: SalesPageProps) {
  const currentUser = await requireAuthenticatedAppUser()

  if (!["SALES", "ADMIN_MANAGEMENT"].includes(currentUser.role)) {
    redirect(ROLE_REDIRECT[currentUser.role])
  }

  const resolvedSearchParams = searchParams ? await searchParams : {}
  const activeTab = resolveTab(resolvedSearchParams.tab)
  const message = resolveValue(resolvedSearchParams.message)
  const tone = resolveValue(resolvedSearchParams.tone) === "error" ? "error" : "success"
  const inquiries = await getInquiryWorkflowRows()
  const salesQueue = inquiries.filter((inquiry) => inquiry.workflowStatus === "RECEIVED")
  const forwardedCount = inquiries.filter((inquiry) => inquiry.workflowStatus === "PENDING_INVENTORY_APPROVAL").length
  const completedCount = inquiries.filter((inquiry) => inquiry.workflowStatus === "COMPLETED").length

  return (
    <main className="min-h-screen bg-[#fcfcfc] p-8">
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-[#111827]">Sales Workspace</h1>
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

      {activeTab === "lead" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
              <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">Waiting on sales</p>
              <p className="mt-2 text-[28px] font-semibold text-[#b45309]">{salesQueue.length}</p>
            </div>
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
              <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">Sent to inventory</p>
              <p className="mt-2 text-[28px] font-semibold text-[#1d4ed8]">{forwardedCount}</p>
            </div>
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
              <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">Completed orders</p>
              <p className="mt-2 text-[28px] font-semibold text-[#047857]">{completedCount}</p>
            </div>
          </div>

          <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-[20px] font-semibold text-[#111827]">Lead intake inbox</h2>
              <p className="mt-2 max-w-[760px] text-[14px] leading-[22px] text-[#6b7280]">
                Review every inquiry and current stage here. Use the Approvals page when you want to actively endorse
                a newly received order to inventory.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
                    <th className="py-3 pr-4 font-medium">Product</th>
                    <th className="py-3 pr-4 font-medium">Customer</th>
                    <th className="py-3 pr-4 font-medium">Current stage</th>
                    <th className="py-3 font-medium">Latest detail</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry) => (
                    <SalesInquiryRow key={inquiry.id} inquiry={inquiry} />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {activeTab === "approvals" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
              <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">Waiting on sales</p>
              <p className="mt-2 text-[28px] font-semibold text-[#b45309]">{salesQueue.length}</p>
            </div>
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
              <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">Sent to inventory</p>
              <p className="mt-2 text-[28px] font-semibold text-[#1d4ed8]">{forwardedCount}</p>
            </div>
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
              <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">Completed orders</p>
              <p className="mt-2 text-[28px] font-semibold text-[#047857]">{completedCount}</p>
            </div>
          </div>

          <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-[20px] font-semibold text-[#111827]">Sales approval page</h2>
              <p className="mt-2 max-w-[760px] text-[14px] leading-[22px] text-[#6b7280]">
                New customer orders start here. Once sales confirms the inquiry details, send it to inventory so they
                can approve material availability before accounting handles payment.
              </p>
            </div>

            {salesQueue.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#d1d5db] bg-[#f9fafb] px-6 py-12 text-center text-[13px] text-[#6b7280]">
                No customer orders are currently waiting on sales.
              </div>
            ) : (
              <div className="space-y-4">
                {salesQueue.map((inquiry) => (
                  <SalesLeadCard key={inquiry.id} inquiry={inquiry} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === "quotes" && <PlaceholderCard title="Quotation workbench" />}

      {activeTab === "orders" && (
        <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-[20px] font-semibold text-[#111827]">Orders in the new approval flow</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
                  <th className="py-3 pr-4 font-medium">Product</th>
                  <th className="py-3 pr-4 font-medium">Customer</th>
                  <th className="py-3 pr-4 font-medium">Current stage</th>
                  <th className="py-3 font-medium">Latest note</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <TrackerRow key={inquiry.id} inquiry={inquiry} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "tracker" && (
        <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-[20px] font-semibold text-[#111827]">Cross-team workflow tracker</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {[
              "RECEIVED",
              "PENDING_INVENTORY_APPROVAL",
              "PENDING_ACCOUNTING_APPROVAL",
              "GETTING_READY_FOR_BUILDING",
              "READY_FOR_SHIPPING",
              "COMPLETED",
            ].map((status) => (
              <div key={status} className="rounded-xl border border-[#eef2f7] bg-[#fbfcfd] p-4">
                <p className="text-[12px] uppercase tracking-[0.14em] text-[#94a3b8]">
                  {formatInquiryWorkflowStatus(status)}
                </p>
                <p className="mt-3 text-[28px] font-semibold text-[#111827]">
                  {inquiries.filter((inquiry) => inquiry.workflowStatus === status).length}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
