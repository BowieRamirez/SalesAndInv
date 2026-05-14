import { redirect } from "next/navigation"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { getInquiryWorkflowRows } from "@/lib/inquiries"
import { ROLE_REDIRECT } from "@/lib/rbac"
import { formatInquiryWorkflowStatus } from "@furnitrack/validators"
import { ApprovalsTable } from "@/components/ApprovalsTable"

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
            <div key={status} className="flex min-h-[100px] flex-col justify-between rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">{formatInquiryWorkflowStatus(status)}</p>
              <p className="mt-3 text-[28px] font-semibold text-[#111827]">
                {inquiries.filter((inquiry) => inquiry.workflowStatus === status).length}
              </p>
            </div>
          ))}
        </div>

        <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-[20px] font-semibold text-[#111827]">All approval-stage orders</h2>
          </div>
          <ApprovalsTable inquiries={inquiries} />
        </section>
      </div>
    </main>
  )
}

