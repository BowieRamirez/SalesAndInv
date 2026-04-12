import { redirect } from "next/navigation"
import { getReturnRequests, type ReturnRequestRow } from "@furnitrack/db"
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

const SALES_TABS = new Set(["lead", "approvals", "returns", "orders", "tracker"])

function resolveTab(tab?: string | string[]) {
  const value = Array.isArray(tab) ? tab[0] : tab
  return value && SALES_TABS.has(value) ? value : "lead"
}

function resolveValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
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

function formatReturnStatus(status: ReturnRequestRow["status"]) {
  return status.replaceAll("_", " ")
}

function ReturnStatusBadge({ status }: { status: ReturnRequestRow["status"] }) {
  const classes =
    status === "SUBMITTED"
      ? "bg-[#fff7ed] text-[#c2410c]"
      : status === "APPROVED_FOR_PICKUP"
        ? "bg-[#eff6ff] text-[#1d4ed8]"
        : status === "PICKED_UP_COMPLETED"
          ? "bg-[#ecfdf3] text-[#166534]"
          : "bg-[#fff1f2] text-[#be123c]"

  return (
    <span className={`inline-flex rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] ${classes}`}>
      {formatReturnStatus(status)}
    </span>
  )
}

function toDateTimeLocalValue(value: Date | null) {
  if (!value) {
    return ""
  }

  const local = new Date(value.getTime() - value.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 16)
}

function ReturnRequestCard({ request }: { request: ReturnRequestRow }) {
  const isSubmitted = request.status === "SUBMITTED"
  const isApproved = request.status === "APPROVED_FOR_PICKUP"

  return (
    <article className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Customer return request</p>
          <h3 className="mt-1 text-[20px] font-semibold text-[#111827]">{request.productName}</h3>
          <p className="mt-2 text-[13px] text-[#6b7280]">
            {request.customerName} - {request.customerEmail} - {request.customerPhone}
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-[16px] bg-[#f8fafc] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#94a3b8]">Reason</p>
              <p className="mt-2 text-[14px] font-medium text-[#111827]">{request.reason}</p>
            </div>
            <div className="rounded-[16px] bg-[#f8fafc] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#94a3b8]">Submitted</p>
              <p className="mt-2 text-[14px] font-medium text-[#111827]">
                {new Date(request.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          {request.details ? (
            <div className="mt-4 rounded-[16px] bg-[#fffaf0] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#c2410c]">Customer details</p>
              <p className="mt-2 text-[14px] leading-[22px] text-[#7c2d12]">{request.details}</p>
            </div>
          ) : null}
          {request.imageUrls.length > 0 ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {request.imageUrls.map((imageUrl, index) => (
                <img
                  key={`${request.id}-${index}`}
                  src={imageUrl}
                  alt={`Return evidence ${index + 1}`}
                  className="h-40 w-full rounded-[16px] object-cover"
                />
              ))}
            </div>
          ) : null}
          {request.pickupScheduledAt ? (
            <p className="mt-4 text-[13px] text-[#1d4ed8]">
              Pickup schedule: {new Date(request.pickupScheduledAt).toLocaleString()}
            </p>
          ) : null}
          {request.salesNote ? (
            <p className="mt-2 text-[13px] text-[#4b5563]">Sales note: {request.salesNote}</p>
          ) : null}
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-end">
          <ReturnStatusBadge status={request.status} />
          <p className="text-[12px] text-[#6b7280]">Updated {new Date(request.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>

      {isSubmitted ? (
        <form method="post" action="/api/admin/returns" className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
          <input type="hidden" name="returnRequestId" value={request.id} />
          <input type="hidden" name="submitMode" value="approve" />
          <label className="block">
            <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
              Pickup date and time
            </span>
            <input
              type="datetime-local"
              name="pickupScheduledAt"
              defaultValue={toDateTimeLocalValue(request.pickupScheduledAt)}
              className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
              Sales return note
            </span>
            <input
              name="salesNote"
              defaultValue={request.salesNote ?? ""}
              placeholder="Confirm the return and tell the customer when pickup will happen."
              className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
            />
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-[12px] bg-[#111827] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90"
            >
              Approve return
            </button>
          </div>
        </form>
      ) : null}

      {isApproved ? (
        <form method="post" action="/api/admin/returns" className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
          <input type="hidden" name="returnRequestId" value={request.id} />
          <input type="hidden" name="submitMode" value="complete" />
          <label className="block">
            <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
              Completion note
            </span>
            <input
              name="salesNote"
              defaultValue={request.salesNote ?? ""}
              placeholder="Confirm that the returned item was picked up and closed."
              className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
            />
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-[12px] bg-[#166534] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#166534]/90"
            >
              Mark return completed
            </button>
          </div>
        </form>
      ) : null}
    </article>
  )
}

function SummaryPanel({
  title,
  description,
  value,
  accent,
}: {
  title: string
  description: string
  value: number
  accent: string
}) {
  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
      <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">{title}</p>
      <p className={`mt-3 text-[30px] font-semibold ${accent}`}>{value}</p>
      <p className="mt-2 text-[13px] leading-[21px] text-[#6b7280]">{description}</p>
    </div>
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
  const returnRequests = await getReturnRequests()
  const salesQueue = inquiries.filter((inquiry) => inquiry.workflowStatus === "RECEIVED")
  const forwardedCount = inquiries.filter((inquiry) => inquiry.workflowStatus === "PENDING_INVENTORY_APPROVAL").length
  const completedCount = inquiries.filter((inquiry) => inquiry.workflowStatus === "COMPLETED").length
  const accountingWaitingCount = inquiries.filter((inquiry) => inquiry.workflowStatus === "PENDING_ACCOUNTING_APPROVAL").length
  const inProgressCount = inquiries.filter((inquiry) =>
    ["PENDING_INVENTORY_APPROVAL", "PENDING_ACCOUNTING_APPROVAL", "GETTING_READY_FOR_BUILDING", "READY_FOR_SHIPPING"].includes(
      inquiry.workflowStatus,
    ),
  ).length
  const pendingReturns = returnRequests.filter((request) => request.status === "SUBMITTED")
  const scheduledReturns = returnRequests.filter((request) => request.status === "APPROVED_FOR_PICKUP")
  const finishedReturns = returnRequests.filter((request) => request.status === "PICKED_UP_COMPLETED")
  const recentOverviewItems = [...inquiries]
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .slice(0, 5)

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
            <SummaryPanel
              title="Waiting on Sales"
              value={salesQueue.length}
              accent="text-[#b45309]"
              description="New customer orders that still need sales review on the Approvals page."
            />
            <SummaryPanel
              title="Orders In Progress"
              value={inProgressCount}
              accent="text-[#1d4ed8]"
              description="Orders already moving through inventory, accounting, building, or shipping."
            />
            <SummaryPanel
              title="Open Returns"
              value={pendingReturns.length + scheduledReturns.length}
              accent="text-[#c2410c]"
              description="Customer return requests that still need approval or pickup completion."
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
            <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-[20px] font-semibold text-[#111827]">Sales overview</h2>
                <p className="mt-2 max-w-[760px] text-[14px] leading-[22px] text-[#6b7280]">
                  This page is a simplified summary only. Use the other sales pages to actually process approvals,
                  returns, orders, and workflow details.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[18px] bg-[#f8fafc] p-4">
                  <p className="text-[12px] uppercase tracking-[0.16em] text-[#94a3b8]">Approvals page</p>
                  <p className="mt-3 text-[28px] font-semibold text-[#111827]">{salesQueue.length}</p>
                  <p className="mt-2 text-[13px] leading-[21px] text-[#6b7280]">
                    Orders still waiting for sales to endorse them to inventory.
                  </p>
                </div>
                <div className="rounded-[18px] bg-[#f8fafc] p-4">
                  <p className="text-[12px] uppercase tracking-[0.16em] text-[#94a3b8]">Returns page</p>
                  <p className="mt-3 text-[28px] font-semibold text-[#111827]">{pendingReturns.length}</p>
                  <p className="mt-2 text-[13px] leading-[21px] text-[#6b7280]">
                    Customer return requests still waiting for sales approval.
                  </p>
                </div>
                <div className="rounded-[18px] bg-[#f8fafc] p-4">
                  <p className="text-[12px] uppercase tracking-[0.16em] text-[#94a3b8]">Orders page</p>
                  <p className="mt-3 text-[28px] font-semibold text-[#111827]">{completedCount}</p>
                  <p className="mt-2 text-[13px] leading-[21px] text-[#6b7280]">
                    Completed customer orders already visible in the orders list.
                  </p>
                </div>
                <div className="rounded-[18px] bg-[#f8fafc] p-4">
                  <p className="text-[12px] uppercase tracking-[0.16em] text-[#94a3b8]">Workflow tracker</p>
                  <p className="mt-3 text-[28px] font-semibold text-[#111827]">{accountingWaitingCount}</p>
                  <p className="mt-2 text-[13px] leading-[21px] text-[#6b7280]">
                    Orders currently waiting on accounting before operations can continue.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-[20px] font-semibold text-[#111827]">Recent activity</h2>
                <p className="mt-2 text-[14px] leading-[22px] text-[#6b7280]">
                  A short snapshot of the latest customer orders without replacing the detailed work pages.
                </p>
              </div>

              <div className="space-y-3">
                {recentOverviewItems.length === 0 ? (
                  <div className="rounded-[18px] border border-dashed border-[#d1d5db] bg-[#f9fafb] px-4 py-8 text-center text-[13px] text-[#6b7280]">
                    No recent sales activity yet.
                  </div>
                ) : (
                  recentOverviewItems.map((inquiry) => (
                    <div key={inquiry.id} className="rounded-[18px] border border-[#eef2f7] bg-[#fbfcfd] p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-[15px] font-semibold text-[#111827]">{inquiry.productName}</p>
                          <p className="mt-1 text-[13px] text-[#6b7280]">{inquiry.customerName}</p>
                          <p className="mt-2 text-[12px] text-[#9ca3af]">
                            Updated {new Date(inquiry.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <WorkflowBadge status={inquiry.workflowStatus} />
                      </div>
                      <p className="mt-3 text-[13px] leading-[21px] text-[#4b5563]">
                        {inquiry.workflowNote ?? inquiry.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
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

      {activeTab === "returns" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
              <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">Waiting on sales</p>
              <p className="mt-2 text-[28px] font-semibold text-[#c2410c]">{pendingReturns.length}</p>
            </div>
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
              <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">Pickup scheduled</p>
              <p className="mt-2 text-[28px] font-semibold text-[#1d4ed8]">{scheduledReturns.length}</p>
            </div>
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
              <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">Completed returns</p>
              <p className="mt-2 text-[28px] font-semibold text-[#166534]">{finishedReturns.length}</p>
            </div>
          </div>

          <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-[20px] font-semibold text-[#111827]">Customer returns</h2>
              <p className="mt-2 max-w-[760px] text-[14px] leading-[22px] text-[#6b7280]">
                Review completed-order return requests here, inspect customer details and pictures, approve the return,
                schedule pickup, and close it after the item has been collected.
              </p>
            </div>

            {returnRequests.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#d1d5db] bg-[#f9fafb] px-6 py-12 text-center text-[13px] text-[#6b7280]">
                No customer return requests have been submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {returnRequests.map((request) => (
                  <ReturnRequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

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
