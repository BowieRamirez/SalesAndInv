import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound, redirect } from "next/navigation"
import { Prisma, prisma } from "@furnitrack/db"
import { formatInquiryWorkflowStatus } from "@furnitrack/validators"
import { OrderChatPanel } from "@/components/sales/OrderChatPanel"
import { InvoiceDownloadButton } from "@/components/sales/InvoiceDownloadButton"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { getInquiryWorkflowRows } from "@/lib/inquiries"
import { getOrderChatMessages } from "@/lib/order-chat"
import { ROLE_REDIRECT } from "@/lib/rbac"

type SalesOrderDetailPageProps = {
  params: Promise<{ inquiryId: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

type MaterialRow = {
  materialStockId: string
  itemName: string
  sku: string
  quantityDisplay: string | null
  unitOfMeasure: string
  notes: string | null
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

  if (!["SALES", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
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

  // Fetch product SKU + materials
  const productSkuRows = await prisma.$queryRaw<Array<{ sku: string }>>(Prisma.sql`
    SELECT ps.sku
    FROM public.customer_inquiries ci
    INNER JOIN public.products p ON p.id = ci."productId"
    INNER JOIN public.product_stocks ps ON ps.id = p."productStockId"
    WHERE ci.id = ${inquiryId}
    LIMIT 1
  `)
  const productSku = productSkuRows[0]?.sku ?? null

  const materials = await prisma.$queryRaw<MaterialRow[]>(Prisma.sql`
    SELECT
      pm."materialStockId",
      ms."itemName",
      ms.sku,
      pm."quantityDisplay",
      ms."unitOfMeasure",
      pm.notes
    FROM public.customer_inquiries ci
    INNER JOIN public.products p ON p.id = ci."productId"
    INNER JOIN public.product_materials pm ON pm."productId" = p.id
    INNER JOIN public.material_stocks ms ON ms.id = pm."materialStockId"
    WHERE ci.id = ${inquiryId}
    ORDER BY ms."itemName" ASC
  `)

  // Pricing — use quotedPrice if available, otherwise catalog price
  const VAT_RATE = 0.12
  const hasQuotation = inquiry.quotedPrice != null
  const basePrice = inquiry.quotedPrice ?? inquiry.total
  const priceBeforeDiscount = inquiry.quotedPriceBeforeDiscount
  const discountAmount = inquiry.quotationDiscount ?? 0
  const hasDiscount = discountAmount > 0 && priceBeforeDiscount != null
  const discountPct = hasDiscount
    ? ((discountAmount / priceBeforeDiscount!) * 100).toFixed(1)
    : null
  const vatAmount = basePrice * VAT_RATE
  const totalWithVat = basePrice + vatAmount
  const downPayment = totalWithVat * 0.7
  const balance = totalWithVat * 0.3

  return (
    <main className={isChatView ? "flex h-screen flex-col bg-[#fcfcfc]" : "min-h-screen bg-[#fcfcfc] p-8"}>
      <div className={isChatView ? "flex shrink-0 items-center justify-between border-b border-[#e5e7eb] bg-white px-6 py-4" : "mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between"}>
        <div>
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[13px] font-medium text-[#111827] shadow-sm ring-1 ring-inset ring-[#d1d5db] transition-colors hover:bg-[#f8fafc]"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
          {!isChatView && (
            <>
              <h1 className="mt-5 text-[28px] font-semibold text-[#111827]">{inquiry.productName}</h1>
              <p className="mt-2 text-[14px] text-[#6b7280]">
                Order details, inquiry information, and customer information.
              </p>
            </>
          )}
        </div>
        <div className={`flex items-center gap-2 ${!isChatView && "flex-col items-start md:items-end"}`}>
          <span className={`rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] ${
            inquiry.workflowStatus === "PENDING_SALES_QUOTATION"
              ? "bg-[#f1f5f9] text-[#475569]"
              : "bg-[#ecfdf5] text-[#047857]"
          }`}>
            {formatInquiryWorkflowStatus(inquiry.workflowStatus)}
          </span>
          {inquiry.inquiryNumber && !isChatView && (
            <span className="font-mono text-[12px] text-[#94a3b8]">{inquiry.inquiryNumber}</span>
          )}
        </div>
      </div>

      <div className={isChatView ? "flex-1 overflow-hidden" : ""}>
        {message ? (
          <div
            className={`mb-6 rounded-2xl border px-5 py-4 text-[14px] ${
              tone === "error"
                ? "border-[#fecaca] bg-[#fff1f2] text-[#9f1239]"
                : "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
            } ${isChatView ? "m-6" : ""}`}
          >
            {message}
          </div>
        ) : null}

        {isChatView ? (
          <OrderChatPanel 
            inquiryId={inquiry.id} 
            messages={messages} 
            isClosed={inquiry.workflowStatus === "COMPLETED"} 
            defaultOpen={false}
            contextNode={
              <div className="grid gap-4">
                <h1 className="mb-2 text-[30px] font-semibold text-[#111827]">Order Information</h1>
                <h2 className="mb-2 text-[20px] font-semibold text-[#111827]">{inquiry.productName}</h2>
                <InfoCard label="Customer" value={inquiry.customerName} />
                <InfoCard label="Order ID" value={inquiry.id.slice(-8).toUpperCase()} />
              </div>
            }
          />
        ) : (
        <div className="space-y-6">
          {/* ── Customer info ── */}
          <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <h2 className="text-[20px] font-semibold text-[#111827]">Inquiry builder / order information</h2>
            <p className="mt-2 text-[14px] leading-[22px] text-[#6b7280]">
              All customer inquiry information is gathered here so Sales can review and coordinate the order.
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

          {/* ── Final quotation ── */}
          <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[20px] font-semibold text-[#111827]">Final quotation &amp; pricing</h2>
                <p className="mt-1 text-[14px] leading-[22px] text-[#6b7280]">
                  {hasQuotation
                    ? "Agreed pricing from the sales quotation accepted by the customer."
                    : "Catalog pricing — no quotation has been sent yet."}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {hasQuotation && (
                  <span className="rounded-full bg-[#f0fdf4] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#166534]">
                    Quotation accepted
                  </span>
                )}
                {hasQuotation && (
                  <InvoiceDownloadButton inquiryId={inquiryId} productName={inquiry.productName} />
                )}
              </div>
            </div>

            {/* Product + materials */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#e5e7eb] text-[11px] uppercase tracking-wide text-[#6b7280]">
                    <th className="py-3 pr-4 font-medium">Item / Material</th>
                    <th className="py-3 pr-4 font-medium">SKU</th>
                    <th className="py-3 pr-4 font-medium">Qty / Spec</th>
                    <th className="py-3 pr-4 font-medium">Unit</th>
                    <th className="py-3 font-medium text-right">Unit price</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Product row */}
                  <tr className="border-b border-[#e5e7eb] bg-[#f8fafc]">
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-[#111827]">{inquiry.productName}</p>
                      <p className="text-[11px] text-[#94a3b8]">Finished product</p>
                    </td>
                    <td className="py-3 pr-4 font-mono text-[#6b7280]">{productSku ?? "—"}</td>
                    <td className="py-3 pr-4 text-[#374151]">{inquiry.quantity ?? 1}</td>
                    <td className="py-3 pr-4 text-[#374151]">pcs</td>
                    <td className="py-3 text-right font-semibold text-[#111827]">
                      {formatPeso(hasDiscount ? priceBeforeDiscount! : basePrice)}
                    </td>
                  </tr>
                  {/* Material rows */}
                  {materials.length > 0 && (
                    <>
                      <tr>
                        <td colSpan={5} className="pb-1 pt-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                            Bill of materials
                          </p>
                        </td>
                      </tr>
                      {materials.map((mat) => (
                        <tr key={mat.materialStockId} className="border-b border-[#f3f4f6] last:border-b-0">
                          <td className="py-2.5 pr-4 text-[#374151]">{mat.itemName}</td>
                          <td className="py-2.5 pr-4 font-mono text-[12px] text-[#6b7280]">{mat.sku}</td>
                          <td className="py-2.5 pr-4 text-[#374151]">{mat.quantityDisplay ?? "—"}</td>
                          <td className="py-2.5 pr-4 text-[#374151]">{mat.unitOfMeasure}</td>
                          <td className="py-2.5 text-right text-[#94a3b8]">—</td>
                        </tr>
                      ))}
                      {materials.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-3 text-[13px] text-[#94a3b8]">
                            No bill of materials defined for this product.
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pricing totals */}
            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-sm space-y-2 text-[13px]">
                {hasDiscount ? (
                  <>
                    <div className="flex justify-between text-[#6b7280]">
                      <span>Original price</span>
                      <span>{formatPeso(priceBeforeDiscount!)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-[#16a34a]">
                      <span>Discount ({discountPct}%)</span>
                      <span>- {formatPeso(discountAmount)}</span>
                    </div>
                    <div className="flex justify-between text-[#374151]">
                      <span>Price after discount</span>
                      <span>{formatPeso(basePrice)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-[#374151]">
                    <span>{hasQuotation ? "Quoted price" : "Catalog price"}</span>
                    <span>{formatPeso(basePrice)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#374151]">
                  <span>VAT (12%)</span>
                  <span>{formatPeso(vatAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-[#e5e7eb] pt-2 text-[15px] font-semibold text-[#111827]">
                  <span>Total (VAT inclusive)</span>
                  <span>{formatPeso(totalWithVat)}</span>
                </div>
                <div className="mt-3 grid gap-2 rounded-[12px] bg-[#f8fafc] p-3 sm:grid-cols-3 text-[12px]">
                  <div>
                    <p className="text-[#94a3b8] uppercase tracking-wide">Down payment (70%)</p>
                    <p className="mt-0.5 font-semibold text-[#111827]">{formatPeso(downPayment)}</p>
                  </div>
                  <div>
                    <p className="text-[#94a3b8] uppercase tracking-wide">Balance (30%)</p>
                    <p className="mt-0.5 font-semibold text-[#111827]">{formatPeso(balance)}</p>
                  </div>
                  <div>
                    <p className="text-[#94a3b8] uppercase tracking-wide">Paid so far</p>
                    <p className="mt-0.5 font-semibold text-[#111827]">{formatPeso(inquiry.paid)}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
      </div>
    </main>
  )
}
