import { revalidatePath } from "next/cache"
import { Prisma, prisma } from "@furnitrack/db"

type InquiryRow = {
  id: string
  productName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  message: string
  status: string
  statusNote: string | null
  createdAt: Date
  updatedAt: Date
}

type SalesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const SALES_TABS = new Set(["lead", "quotes", "orders", "tracker"])
const INQUIRY_STATUSES = [
  "RECEIVED",
  "ACCEPTED",
  "GETTING_READY_FOR_BUILDING",
  "WAITING_FOR_PAYMENT",
  "READY_FOR_SHIPMENT",
] as const

function resolveTab(tab?: string | string[]) {
  const value = Array.isArray(tab) ? tab[0] : tab
  return value && SALES_TABS.has(value) ? value : "lead"
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (value) => value.toUpperCase())
}

async function getInquiryRows() {
  return prisma.$queryRaw<InquiryRow[]>(Prisma.sql`
    SELECT
      ci.id,
      p.name AS "productName",
      ci."customerName",
      ci."customerEmail",
      ci."customerPhone",
      ci.message,
      ci.status::text AS status,
      ci."statusNote",
      ci."createdAt",
      ci."updatedAt"
    FROM public.customer_inquiries ci
    INNER JOIN public.products p
      ON p.id = ci."productId"
    ORDER BY ci."updatedAt" DESC, ci."createdAt" DESC
  `)
}

async function updateInquiryStatus(formData: FormData) {
  "use server"

  const inquiryId = String(formData.get("inquiryId") ?? "")
  const status = String(formData.get("status") ?? "")
  const statusNote = String(formData.get("statusNote") ?? "").trim()

  if (!inquiryId || !INQUIRY_STATUSES.includes(status as (typeof INQUIRY_STATUSES)[number])) {
    return
  }

  await prisma.$executeRaw(Prisma.sql`
    UPDATE public.customer_inquiries
    SET
      status = ${status}::"InquiryStatus",
      "statusNote" = ${statusNote || null},
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = ${inquiryId}
  `)

  revalidatePath("/sales")
  revalidatePath("/account/status")
}

function PlaceholderCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white p-8 shadow-sm">
      <h3 className="text-[16px] font-semibold text-[#1f2937]">{title}</h3>
      <p className="mt-3 text-[13px] leading-[22px] text-[#6b7280]">{description}</p>
    </div>
  )
}

export default async function SalesDashboard({ searchParams }: SalesPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const activeTab = resolveTab(resolvedSearchParams.tab)
  const inquiries = activeTab === "lead" ? await getInquiryRows() : []

  return (
    <main className="min-h-screen bg-[#fcfcfc] p-8">
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-[#111827]">Sales Workspace</h1>
        <p className="mt-2 text-[14px] text-[#6b7280]">
          Manage incoming storefront inquiries, move accepted requests forward, and keep customers updated from one place.
        </p>
      </div>

      {activeTab === "lead" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
              <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">Total inquiries</p>
              <p className="mt-2 text-[28px] font-semibold text-[#111827]">{inquiries.length}</p>
            </div>
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
              <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">Waiting on sales</p>
              <p className="mt-2 text-[28px] font-semibold text-[#b45309]">
                {inquiries.filter((inquiry) => inquiry.status === "RECEIVED").length}
              </p>
            </div>
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
              <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">Accepted / active</p>
              <p className="mt-2 text-[28px] font-semibold text-[#047857]">
                {inquiries.filter((inquiry) => inquiry.status !== "RECEIVED").length}
              </p>
            </div>
          </div>

          <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-[20px] font-semibold text-[#111827]">Customer product inquiries</h2>
              <p className="mt-1 text-[13px] text-[#6b7280]">
                These are the orders and customization inquiries coming from the live storefront.
              </p>
            </div>

            {inquiries.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#d1d5db] bg-[#f9fafb] px-6 py-12 text-center text-[13px] text-[#6b7280]">
                No customer inquiries have been submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <article key={inquiry.id} className="rounded-xl border border-[#eef2f7] bg-[#fbfcfd] p-5">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Inquiry</p>
                        <h3 className="mt-1 text-[20px] font-semibold text-[#111827]">{inquiry.productName}</h3>
                        <p className="mt-2 text-[13px] text-[#6b7280]">
                          {inquiry.customerName} · {inquiry.customerEmail} · {inquiry.customerPhone}
                        </p>
                        <p className="mt-3 max-w-[720px] text-[14px] leading-[22px] text-[#1f2937]">{inquiry.message}</p>
                      </div>

                      <div className="text-[12px] text-[#6b7280]">
                        <p>Created {new Date(inquiry.createdAt).toLocaleDateString()}</p>
                        <p className="mt-1">Updated {new Date(inquiry.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <form action={updateInquiryStatus} className="mt-5 grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_auto]">
                      <input type="hidden" name="inquiryId" value={inquiry.id} />
                      <label className="block">
                        <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                          Status
                        </span>
                        <select
                          name="status"
                          defaultValue={inquiry.status}
                          className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                        >
                          {INQUIRY_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {formatStatus(status)}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                          Customer-facing note
                        </span>
                        <input
                          name="statusNote"
                          defaultValue={inquiry.statusNote ?? ""}
                          placeholder="Optional update the customer can read on their status page"
                          className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                        />
                      </label>

                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="rounded-[12px] bg-[#111827] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90"
                        >
                          Save update
                        </button>
                      </div>
                    </form>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === "quotes" && (
        <PlaceholderCard
          title="Quotation workbench"
          description="This area can keep the quotation builder, costing, and approval flow. The new product inquiries are already feeding into the Lead Intake tab for sales follow-up."
        />
      )}

      {activeTab === "orders" && (
        <PlaceholderCard
          title="Sales orders"
          description="Accepted inquiries can be converted into quotations and then into sales orders here as you continue wiring the full order flow."
        />
      )}

      {activeTab === "tracker" && (
        <PlaceholderCard
          title="Workflow tracker"
          description="Use this view for a cross-team timeline of inquiry acceptance, building readiness, payment waiting, and shipment readiness."
        />
      )}
    </main>
  )
}
