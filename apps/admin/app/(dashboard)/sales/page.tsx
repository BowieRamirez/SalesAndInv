import { redirect } from "next/navigation"
import Link from "next/link"
import { getReturnRequests } from "@furnitrack/db"
import {
  formatInquiryWorkflowStatus,
  getInquiryWorkflowStyle,
} from "@furnitrack/validators"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { ROLE_REDIRECT } from "@/lib/rbac"
import { getInquiryWorkflowRows, type InquiryWorkflowRow } from "@/lib/inquiries"
import { CustomerReturnsTable } from "@/components/sales/CustomerReturnsTable"
import { SalesOrdersTable } from "@/components/sales/SalesOrdersTable"

type SalesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const SALES_TABS = new Set(["lead", "approvals", "returns", "orders", "chats"])

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

function formatPeso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(value)
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

          <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-[20px] font-semibold text-[#111827]">Workflow tracker</h2>
              <p className="mt-2 max-w-[760px] text-[14px] leading-[22px] text-[#6b7280]">
                Quick dashboard view of where customer orders are across the sales-to-delivery workflow.
              </p>
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

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
            <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-[20px] font-semibold text-[#111827]">Sales dashboard</h2>
                <p className="mt-2 max-w-[760px] text-[14px] leading-[22px] text-[#6b7280]">
                  Use the sidebar pages to process approvals, returns, orders, and customer chat threads.
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

          <CustomerReturnsTable requests={returnRequests} />
        </div>
      )}

      {activeTab === "orders" && (
        <SalesOrdersTable inquiries={inquiries} />
      )}

      {activeTab === "chats" && (
        <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-[20px] font-semibold text-[#111827]">Order Chats</h2>
            <p className="mt-2 max-w-[760px] text-[14px] leading-[22px] text-[#6b7280]">
              Open a specific order to chat with the customer, receive images, and send quotation or receipt documents.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {inquiries.map((inquiry) => (
              <Link
                key={inquiry.id}
                href={`/sales/orders/${inquiry.id}?tab=chats`}
                className="rounded-2xl border border-[#eef2f7] bg-[#fbfcfd] p-5 transition-colors hover:border-[#111827]"
              >
                <p className="text-[12px] uppercase tracking-[0.16em] text-[#94a3b8]">Order chat</p>
                <h3 className="mt-2 text-[17px] font-semibold text-[#111827]">{inquiry.productName}</h3>
                <p className="mt-2 text-[13px] text-[#6b7280]">{inquiry.customerName}</p>
                <p className="mt-3 text-[13px] font-medium text-[#111827]">{formatPeso(inquiry.total)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

    </main>
  )
}
