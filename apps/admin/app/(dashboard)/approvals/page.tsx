import { redirect } from "next/navigation"
import { formatInquiryWorkflowStatus, getInquiryWorkflowStyle } from "@furnitrack/validators"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { getInquiryWorkflowRows } from "@/lib/inquiries"
import { ROLE_REDIRECT } from "@/lib/rbac"

export const dynamic = "force-dynamic"

export default async function AdminApprovalsPage() {
  const currentUser = await requireAuthenticatedAppUser()

  if (currentUser.role !== "ADMIN_MANAGEMENT") {
    redirect(ROLE_REDIRECT[currentUser.role])
  }

  const inquiries = await getInquiryWorkflowRows()
  const stages = [
    "RECEIVED",
    "PENDING_INVENTORY_APPROVAL",
    "PENDING_ACCOUNTING_APPROVAL",
    "GETTING_READY_FOR_BUILDING",
    "READY_FOR_SHIPPING",
    "COMPLETED",
  ] as const

  return (
    <main className="min-h-screen bg-[#fcfcfc] p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-[28px] font-semibold text-[#111827]">Approval Oversight</h1>
          <p className="mt-2 max-w-[760px] text-[14px] leading-[22px] text-[#6b7280]">
            Management can monitor every customer order approval stage here across sales, inventory, accounting,
            operations, shipping, and completion.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-6">
          {stages.map((status) => (
            <div key={status} className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
              <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">{formatInquiryWorkflowStatus(status)}</p>
              <p className="mt-2 text-[28px] font-semibold text-[#111827]">
                {inquiries.filter((inquiry) => inquiry.workflowStatus === status).length}
              </p>
            </div>
          ))}
        </div>

        <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-[20px] font-semibold text-[#111827]">All approval-stage orders</h2>
          </div>

          {inquiries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#d1d5db] bg-[#f9fafb] px-6 py-12 text-center text-[13px] text-[#6b7280]">
              No customer orders are in the workflow yet.
            </div>
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
                    <tr key={inquiry.id} className="border-b border-[#f3f4f6] last:border-b-0">
                      <td className="py-4 pr-4 text-[#111827]">{inquiry.productName}</td>
                      <td className="py-4 pr-4 text-[#4b5563]">{inquiry.customerName}</td>
                      <td className="py-4 pr-4">
                        <span
                          className={`inline-flex rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] ${getInquiryWorkflowStyle(inquiry.workflowStatus)}`}
                        >
                          {formatInquiryWorkflowStatus(inquiry.workflowStatus)}
                        </span>
                      </td>
                      <td className="py-4 text-[#4b5563]">{inquiry.workflowNote ?? "No note yet."}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
