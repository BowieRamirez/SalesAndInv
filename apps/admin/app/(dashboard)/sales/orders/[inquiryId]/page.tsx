import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { formatInquiryWorkflowStatus } from "@furnitrack/validators"
import { OrderChatPanel } from "@/components/sales/OrderChatPanel"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { getInquiryWorkflowRows } from "@/lib/inquiries"
import { getOrderChatMessages } from "@/lib/order-chat"
import { ROLE_REDIRECT } from "@/lib/rbac"

type SalesOrderDetailPageProps = {
  params: Promise<{ inquiryId: string }>
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

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#eef2f7] bg-[#fbfcfd] p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-[#94a3b8]">{label}</p>
      <p className="mt-2 text-[14px] font-semibold text-[#111827]">{value}</p>
    </div>
  )
}

export const dynamic = "force-dynamic"

export default async function SalesOrderDetailPage({ params, searchParams }: SalesOrderDetailPageProps) {
  const currentUser = await requireAuthenticatedAppUser()

  if (!["SALES", "ADMIN_MANAGEMENT"].includes(currentUser.role)) {
    redirect(ROLE_REDIRECT[currentUser.role])
  }

  const { inquiryId } = await params
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const message = resolveValue(resolvedSearchParams.message)
  const tone = resolveValue(resolvedSearchParams.tone) === "error" ? "error" : "success"
  const inquiry = (await getInquiryWorkflowRows()).find((row) => row.id === inquiryId)

  if (!inquiry) {
    notFound()
  }

  const messages = await getOrderChatMessages(inquiry.id)
  const activeTab = resolveValue(resolvedSearchParams.tab)
  const isChatView = activeTab === "chats"
  const backHref = isChatView ? "/sales?tab=chats" : "/sales?tab=orders"
  const backLabel = isChatView ? "Back to Order Chats" : "Back to Sales Orders"

  return (
    <main className="min-h-screen bg-[#fcfcfc] p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Link href={backHref} className="text-[13px] font-medium text-[#2563eb] hover:underline">
            {backLabel}
          </Link>
          <h1 className="mt-3 text-[28px] font-semibold text-[#111827]">{inquiry.productName}</h1>
          <p className="mt-2 text-[14px] text-[#6b7280]">
            {isChatView
              ? "Order-specific customer conversation with quick context."
              : "Order-specific quotation, inquiry details, and customer information."}
          </p>
        </div>
        <span className="rounded-full bg-[#ecfdf5] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#047857]">
          {formatInquiryWorkflowStatus(inquiry.workflowStatus)}
        </span>
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

      {isChatView ? (
        <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
          <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <h2 className="text-[20px] font-semibold text-[#111827]">Order context</h2>
            <p className="mt-2 text-[14px] leading-[22px] text-[#6b7280]">
              Use this quick info while chatting with the customer.
            </p>
            <div className="mt-5 grid gap-4">
              <InfoCard label="Customer" value={inquiry.customerName} />
              <InfoCard label="Order ID" value={inquiry.id.slice(-8).toUpperCase()} />
              <InfoCard label="Quotation total" value={formatPeso(inquiry.total)} />
              <InfoCard label="Remaining balance" value={formatPeso(inquiry.remainingBalance)} />
            </div>
          </section>
          <OrderChatPanel inquiryId={inquiry.id} messages={messages} />
        </div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <h2 className="text-[20px] font-semibold text-[#111827]">Inquiry builder / order information</h2>
            <p className="mt-2 text-[14px] leading-[22px] text-[#6b7280]">
              All customer inquiry information is gathered here so Sales can prepare the quotation and coordinate the order.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <InfoCard label="Customer" value={inquiry.customerName} />
              <InfoCard label="Email" value={inquiry.customerEmail} />
              <InfoCard label="Phone" value={inquiry.customerPhone} />
              <InfoCard label="Order ID" value={inquiry.id.slice(-8).toUpperCase()} />
            </div>
            <div className="mt-5 rounded-2xl bg-[#f8fafc] p-5">
              <p className="text-[12px] uppercase tracking-[0.16em] text-[#94a3b8]">Customer inquiry</p>
              <p className="mt-3 whitespace-pre-wrap text-[14px] leading-[24px] text-[#111827]">{inquiry.message}</p>
            </div>
            <div className="mt-5 rounded-2xl bg-[#fff7ed] p-5">
              <p className="text-[12px] uppercase tracking-[0.16em] text-[#c2410c]">Latest team note</p>
              <p className="mt-3 whitespace-pre-wrap text-[14px] leading-[24px] text-[#7c2d12]">
                {inquiry.workflowNote ?? "No internal note has been added yet."}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <h2 className="text-[20px] font-semibold text-[#111827]">Quotation summary</h2>
            <p className="mt-2 text-[14px] leading-[22px] text-[#6b7280]">
              Use this quote summary when preparing quotation documents for the customer.
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
                    <th className="py-3 pr-4 font-medium">Item</th>
                    <th className="py-3 pr-4 font-medium">Qty</th>
                    <th className="py-3 pr-4 font-medium">Unit price</th>
                    <th className="py-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#f3f4f6] last:border-b-0">
                    <td className="py-3 pr-4 text-[#111827]">{inquiry.productName}</td>
                    <td className="py-3 pr-4 text-[#111827]">1</td>
                    <td className="py-3 pr-4 text-[#111827]">{formatPeso(inquiry.total)}</td>
                    <td className="py-3 text-[#111827]">{formatPeso(inquiry.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <InfoCard label="Subtotal" value={formatPeso(inquiry.total)} />
              <InfoCard label="Down payment required" value={formatPeso(inquiry.downPaymentRequired)} />
              <InfoCard label="Remaining balance" value={formatPeso(inquiry.remainingBalance)} />
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
