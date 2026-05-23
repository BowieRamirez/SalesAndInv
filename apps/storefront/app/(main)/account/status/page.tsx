import Link from "next/link"
import { redirect } from "next/navigation"
import { Prisma, prisma, getReturnRequests } from "@furnitrack/db"
import { Clock, Truck } from "lucide-react"
import { CancelOrderButton } from "@/components/CancelOrderButton"
import { CompletedOrderReturnCard } from "@/components/CompletedOrderReturnCard"
import { OrderChatPanel } from "@/components/OrderChatPanel"
import { OrderStepper } from "@/components/OrderStepper"
import { CustomerPaymentForm } from "@/components/CustomerPaymentForm"
import { CustomerBalancePaymentForm } from "@/components/CustomerBalancePaymentForm"
import { QuotationResponseCard } from "@/components/QuotationResponseCard"
import { StatusTabs } from "@/components/StatusTabs"
import { getStorefrontSessionUser } from "@/lib/auth/session"
import { formatShortDate } from "@/lib/format"
import { getOrderChatMessages } from "@/lib/order-chat"

export const dynamic = "force-dynamic"

type InquiryRow = {
  id: string
  inquiryNumber: string | null
  productName: string
  productSlug: string
  productId: string
  productPrice: string | number
  quotedPrice: string | number | null
  quotationDiscount: string | number | null
  quotedPriceBeforeDiscount: string | number | null
  quotationRevisionCount: string | number | null
  status: string
  statusNote: string | null
  customerMessage: string
  createdAt: Date
  updatedAt: Date
  verifiedAmount: string | number | null
  verifiedRemaining: string | number | null
  pendingBalanceMethod: string | null
  pendingBalanceNote: string | null
}

type CustomerStatusPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const COMPLETED_MARKER = "[[completed]]"
const PAYMENT_METHOD_PATTERN = /\[\[payment_method:([^\]]+)\]\]/i
const PAYMENT_STATUS_PATTERN = /\[\[payment_status:[^\]]+\]\]/i
const PAID_AMOUNT_PATTERN = /\[\[paid_amount:[^\]]+\]\]/i
const SHIP_AT_PATTERN = /\[\[ship_at:([^\]]+)\]\]/i
const CUSTOMER_PAID_METHOD_PATTERN = /\[\[customer_paid_method:([^\]]+)\]\]/i
const CUSTOMER_PAID_NOTE_PATTERN = /\[\[customer_paid_note:([^\]]+)\]\]/i

function resolveValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

function hasCompletedMarker(note: string | null) {
  return typeof note === "string" && note.includes(COMPLETED_MARKER)
}

function extractShipAt(note: string | null): Date | null {
  if (!note) return null
  const match = SHIP_AT_PATTERN.exec(note)
  if (!match) return null
  const parsed = new Date(match[1]!)
  return isNaN(parsed.getTime()) ? null : parsed
}

function stripWorkflowMarkers(note: string | null) {
  if (!note) return null
  return note
    .replace(COMPLETED_MARKER, "")
    .replace(PAYMENT_METHOD_PATTERN, "")
    .replace(PAYMENT_STATUS_PATTERN, "")
    .replace(PAID_AMOUNT_PATTERN, "")
    .replace(SHIP_AT_PATTERN, "")
    .replace(CUSTOMER_PAID_METHOD_PATTERN, "")
    .replace(CUSTOMER_PAID_NOTE_PATTERN, "")
    .trim() || null
}

function extractCustomerPaidMethod(note: string | null): string | null {
  if (!note) return null
  return CUSTOMER_PAID_METHOD_PATTERN.exec(note)?.[1] ?? null
}

function extractCustomerPaidNote(note: string | null): string | null {
  if (!note) return null
  const m = CUSTOMER_PAID_NOTE_PATTERN.exec(note)
  return m?.[1] ? decodeURIComponent(m[1]) : null
}

function resolveWorkflowStatus(status: string, note: string | null) {
  if (hasCompletedMarker(note)) return "COMPLETED"
  switch (status) {
    case "ACCEPTED": return "PENDING_INVENTORY_APPROVAL"
    case "PENDING_SALES_QUOTATION": return "PENDING_SALES_QUOTATION"
    case "WAITING_FOR_PAYMENT": return "PENDING_ACCOUNTING_APPROVAL"
    case "READY_FOR_SHIPMENT": return "READY_FOR_SHIPPING"
    default: return status
  }
}

export default async function CustomerStatusPage({ searchParams }: CustomerStatusPageProps) {
  const sessionUser = await getStorefrontSessionUser()
  if (!sessionUser) redirect("/sign-in")

  const inquiries = await prisma.$queryRaw<InquiryRow[]>(Prisma.sql`
    SELECT
      ci.id,
      ci."inquiryNumber",
      p.name AS "productName",
      p.slug AS "productSlug",
      p.id AS "productId",
      p.price::text AS "productPrice",
      ci."quotedPrice"::text AS "quotedPrice",
      COALESCE(ci."quotationDiscount", 0)::text AS "quotationDiscount",
      ci."quotedPriceBeforeDiscount"::text AS "quotedPriceBeforeDiscount",
      COALESCE(ci."quotationRevisionCount", 0)::text AS "quotationRevisionCount",
      ci.status::text AS status,
      ci."statusNote",
      ci.message AS "customerMessage",
      ci."createdAt",
      ci."updatedAt",
      pr_v.amount::text AS "verifiedAmount",
      pr_v."remainingBalance"::text AS "verifiedRemaining",
      pr_p."paymentMethod" AS "pendingBalanceMethod",
      pr_p.remarks AS "pendingBalanceNote"
    FROM public.customer_inquiries ci
    INNER JOIN public.products p ON p.id = ci."productId"
    LEFT JOIN LATERAL (
      SELECT amount, "remainingBalance"
      FROM public.payment_records
      WHERE "inquiryId" = ci.id AND status = 'VERIFIED'::"PaymentStatus"
      ORDER BY "verifiedAt" DESC LIMIT 1
    ) pr_v ON TRUE
    LEFT JOIN LATERAL (
      SELECT "paymentMethod", remarks
      FROM public.payment_records
      WHERE "inquiryId" = ci.id AND status = 'PENDING'::"PaymentStatus"
      ORDER BY "createdAt" DESC LIMIT 1
    ) pr_p ON TRUE
    WHERE ci."customerUserId" = ${sessionUser.id}
    ORDER BY ci."updatedAt" DESC, ci."createdAt" DESC
  `)

  const workflowInquiries = inquiries.map((inquiry) => ({
    ...inquiry,
    workflowStatus: resolveWorkflowStatus(inquiry.status, inquiry.statusNote),
    workflowNote: stripWorkflowMarkers(inquiry.statusNote),
    shipAt: extractShipAt(inquiry.statusNote),
    customerPaidMethod: extractCustomerPaidMethod(inquiry.statusNote),
    customerPaidNote: extractCustomerPaidNote(inquiry.statusNote),
    verifiedAmount: inquiry.verifiedAmount == null ? null : Number(inquiry.verifiedAmount),
    verifiedRemaining: inquiry.verifiedRemaining == null ? null : Number(inquiry.verifiedRemaining),
    hasPendingBalance: inquiry.pendingBalanceMethod !== null,
    quotedPrice: inquiry.quotedPrice == null ? null : Number(inquiry.quotedPrice),
    quotationDiscount: inquiry.quotationDiscount == null ? 0 : Number(inquiry.quotationDiscount),
    quotedPriceBeforeDiscount: inquiry.quotedPriceBeforeDiscount == null ? null : Number(inquiry.quotedPriceBeforeDiscount),
    quotationRevisionCount: inquiry.quotationRevisionCount == null ? 0 : Number(inquiry.quotationRevisionCount),
  }))

  const activeInquiries = workflowInquiries.filter((i) => i.workflowStatus !== "COMPLETED")
  const completedInquiries = workflowInquiries.filter((i) => i.workflowStatus === "COMPLETED")

  const chatMessagesByInquiryId = new Map(
    await Promise.all(
      workflowInquiries.map(async (i) => [i.id, await getOrderChatMessages(i.id)] as const),
    ),
  )

  const returnRequests = await getReturnRequests({
    customerUserId: sessionUser.id,
    inquiryIds: completedInquiries.map((i) => i.id),
  })

  const reviewedInquiryIds = completedInquiries.length > 0
    ? await prisma.$queryRaw<Array<{ inquiryId: string }>>(Prisma.sql`
        SELECT "inquiryId" FROM public.product_reviews
        WHERE "inquiryId" IN (${Prisma.join(completedInquiries.map((i) => i.id))})
          AND "customerUserId" = ${sessionUser.id}
      `).then((rows) => new Set(rows.map((r) => r.inquiryId)))
    : new Set<string>()

  const resolvedSearchParams = searchParams ? await searchParams : {}
  const message = resolveValue(resolvedSearchParams.message)
  const tone = resolveValue(resolvedSearchParams.tone) === "error" ? "error" : "success"
  const openOrderChatId = resolveValue(resolvedSearchParams.order)
  const activeTabParam = resolveValue(resolvedSearchParams.tab) ?? "active"

  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      <div className="mx-auto max-w-[1100px] px-6 py-10">

        {/* ── Page header ── */}
        <div className="mb-6 flex items-start justify-between gap-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#99a1af]">Customer account</p>
            <h1 className="mt-2 font-[family-name:var(--font-inter)] text-[32px] font-semibold leading-[38px] text-[#1a1a2e]">
              My Orders
            </h1>
          </div>
          <Link
            href="/shop"
            className="mt-1 shrink-0 rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-2.5 text-[13px] font-medium text-[#1a1a2e] transition-colors hover:bg-[#f9fafb]"
          >
            Browse products
          </Link>
        </div>

        {/* ── Toast banner ── */}
        {message ? (
          <div
            className={`mb-5 rounded-[16px] border px-5 py-3.5 text-[13px] ${
              tone === "error"
                ? "border-[#fecaca] bg-[#fff1f2] text-[#9f1239]"
                : "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
            }`}
          >
            {message}
          </div>
        ) : null}

        {inquiries.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#d1d5dc] bg-white px-8 py-16 text-center">
            <h2 className="text-[22px] font-medium text-[#1a1a2e]">No orders yet</h2>
            <p className="mt-3 text-[14px] leading-[22px] text-[#6a7282]">
              When you inquire about a product, its progress will appear here.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-block rounded-[12px] bg-[#1a1a2e] px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#111]"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <>
            {/* ── Tab bar ── */}
            <StatusTabs
              activeCount={activeInquiries.length}
              completedCount={completedInquiries.length}
              defaultTab={activeTabParam}
            />

            {/* ── Active orders ── */}
            {activeTabParam !== "history" && (
              <div className="mt-5 space-y-4">
                {activeInquiries.length === 0 ? (
                  <div className="rounded-[20px] border border-dashed border-[#d1d5dc] bg-white px-8 py-10 text-center text-[14px] text-[#6a7282]">
                    No active orders right now.
                  </div>
                ) : (
                  activeInquiries.map((inquiry) => (
                    <article key={inquiry.id} className="rounded-[20px] border border-[#e5e7eb] bg-white shadow-sm overflow-hidden">
                      {/* ── Card header strip ── */}
                      <div className="flex items-center justify-between gap-3 border-b border-[#f3f4f6] bg-[#fafafa] px-6 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="shrink-0 rounded-full bg-[#e0fdf4] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#065f46]">
                            Active
                          </span>
                          {inquiry.inquiryNumber && (
                            <span className="font-mono text-[12px] text-[#6a7282]">{inquiry.inquiryNumber}</span>
                          )}
                          <span className="hidden text-[12px] text-[#9ca3af] sm:block">
                            · Updated {formatShortDate(inquiry.updatedAt)}
                          </span>
                        </div>
                        {(
                          inquiry.workflowStatus === "RECEIVED" ||
                          inquiry.workflowStatus === "PENDING_INVENTORY_APPROVAL" ||
                          inquiry.workflowStatus === "PENDING_SALES_QUOTATION" ||
                          (inquiry.workflowStatus === "PENDING_ACCOUNTING_APPROVAL" && !inquiry.customerPaidMethod)
                        ) && (
                          <CancelOrderButton inquiryId={inquiry.id} productName={inquiry.productName} />
                        )}
                      </div>

                      <div className="px-6 py-5">
                        {/* Product name + dates */}
                        <div className="mb-4">
                          <h2 className="font-[family-name:var(--font-inter)] text-[20px] font-semibold text-[#1a1a2e]">
                            {inquiry.productName}
                          </h2>
                          <p className="mt-0.5 text-[12px] text-[#9ca3af]">
                            Placed {formatShortDate(inquiry.createdAt)}
                          </p>
                        </div>

                        {/* Progress stepper */}
                        <div className="rounded-[14px] border border-[#e9f7ef] bg-[#f0fdf4] px-4 py-4">
                          <OrderStepper
                            workflowStatus={inquiry.workflowStatus}
                            updatedAtLabel={formatShortDate(inquiry.updatedAt)}
                          />
                        </div>

                        {/* Payment panels */}
                        {inquiry.workflowStatus === "PENDING_SALES_QUOTATION" && (
                          <QuotationResponseCard
                            inquiryId={inquiry.id}
                            productName={inquiry.productName}
                            quotedPrice={inquiry.quotedPrice ?? Number(inquiry.productPrice)}
                            quotedPriceBeforeDiscount={inquiry.quotedPriceBeforeDiscount}
                            quotationDiscount={inquiry.quotationDiscount}
                            quotationRevisionCount={inquiry.quotationRevisionCount}
                          />
                        )}

                        {inquiry.workflowStatus === "PENDING_ACCOUNTING_APPROVAL" && (
                          <CustomerPaymentForm
                            inquiryId={inquiry.id}
                            productName={inquiry.productName}
                            totalPrice={inquiry.quotedPrice ?? Number(inquiry.productPrice)}
                            quotedPriceBeforeDiscount={inquiry.quotedPriceBeforeDiscount}
                            quotationDiscount={inquiry.quotationDiscount}
                            alreadySubmitted={!!inquiry.customerPaidMethod}
                            submittedMethod={inquiry.customerPaidMethod}
                            submittedNote={inquiry.customerPaidNote}
                            locked={inquiry.verifiedAmount !== null}
                          />
                        )}

                        {(inquiry.workflowStatus === "GETTING_READY_FOR_BUILDING" ||
                          inquiry.workflowStatus === "READY_FOR_SHIPPING") &&
                          (inquiry.verifiedRemaining ?? 0) > 0 && (
                            <CustomerBalancePaymentForm
                              inquiryId={inquiry.id}
                              productName={inquiry.productName}
                              remainingBalance={inquiry.verifiedRemaining ?? 0}
                              alreadySubmitted={inquiry.hasPendingBalance}
                              submittedMethod={inquiry.pendingBalanceMethod}
                              submittedNote={inquiry.pendingBalanceNote}
                            />
                          )}

                        {/* Shipping date banner */}
                        {inquiry.shipAt && (
                          <div className="mt-4 flex items-start gap-3 rounded-[14px] border border-[#fde68a] bg-[#fffbeb] px-4 py-3.5">
                            <div className="mt-0.5 flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full border border-[#fcd34d] bg-[#fef3c7]">
                              <Truck className="h-[16px] w-[16px] text-[#92400e]" strokeWidth={1.75} />
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#92400e]">
                                Scheduled Delivery
                              </p>
                              <p className="mt-0.5 font-[family-name:var(--font-inter)] text-[18px] font-semibold text-[#78350f]">
                                {inquiry.shipAt.toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                              <p className="mt-1 flex items-center gap-1.5 text-[12px] text-[#92400e]">
                                <Clock className="h-[12px] w-[12px]" strokeWidth={1.75} />
                                {inquiry.shipAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Info grid — collapsible on mobile via grid layout */}
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-[14px] bg-[#f9fafb] px-4 py-3.5">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-[#99a1af]">Your inquiry</p>
                            <p className="mt-2 text-[13px] leading-[20px] text-[#1a1a2e] line-clamp-3">
                              {inquiry.customerMessage}
                            </p>
                          </div>
                          <div className="rounded-[14px] bg-[#f9fafb] px-4 py-3.5">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-[#99a1af]">Team update</p>
                            <p className="mt-2 text-[13px] leading-[20px] text-[#1a1a2e] line-clamp-3">
                              {inquiry.workflowNote ??
                                "Your order is progressing. Updates will appear here."}
                            </p>
                          </div>
                        </div>

                        {/* Chat panel */}
                        <div className="mt-4">
                          <OrderChatPanel
                            inquiryId={inquiry.id}
                            messages={chatMessagesByInquiryId.get(inquiry.id) ?? []}
                            contextNode={null}
                            defaultOpen={openOrderChatId === inquiry.id}
                          />
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}

            {/* ── Order history ── */}
            {activeTabParam === "history" && (
              <div className="mt-5 space-y-4">
                {completedInquiries.length === 0 ? (
                  <div className="rounded-[20px] border border-dashed border-[#d1d5dc] bg-white px-8 py-10 text-center text-[14px] text-[#6a7282]">
                    No completed orders yet.
                  </div>
                ) : (
                  completedInquiries.map((inquiry) => (
                    <CompletedOrderReturnCard
                      key={inquiry.id}
                      inquiry={inquiry}
                      existingReturn={returnRequests.find((r) => r.inquiryId === inquiry.id)}
                      productSlug={inquiry.productSlug}
                      alreadyReviewed={reviewedInquiryIds.has(inquiry.id)}
                    />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
