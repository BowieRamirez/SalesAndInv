import Link from "next/link"
import { redirect } from "next/navigation"
import { Prisma, prisma, getReturnRequests } from "@furnitrack/db"
import {
  ClipboardList,
  ScanSearch,
  CreditCard,
  Hammer,
  Truck,
  PackageCheck,
  Clock,
} from "lucide-react"
import { CompletedOrderReturnCard } from "@/components/CompletedOrderReturnCard"
import { getStorefrontSessionUser } from "@/lib/auth/session"
import { formatShortDate } from "@/lib/format"

// --- Order progress stepper config ---
type StepKey =
  | "RECEIVED"
  | "PENDING_INVENTORY_APPROVAL"
  | "PENDING_ACCOUNTING_APPROVAL"
  | "GETTING_READY_FOR_BUILDING"
  | "READY_FOR_SHIPPING"
  | "COMPLETED"

type StepConfig = {
  key: StepKey
  label: string
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
}

const ORDER_STEPS: StepConfig[] = [
  { key: "RECEIVED",                    label: "Order Placed",       Icon: ClipboardList },
  { key: "PENDING_INVENTORY_APPROVAL",  label: "Sales Review",       Icon: ScanSearch },
  { key: "PENDING_ACCOUNTING_APPROVAL", label: "Payment Confirmed",  Icon: CreditCard },
  { key: "GETTING_READY_FOR_BUILDING",  label: "Being Built",        Icon: Hammer },
  { key: "READY_FOR_SHIPPING",          label: "Out for Delivery",   Icon: Truck },
  { key: "COMPLETED",                   label: "Delivered",          Icon: PackageCheck },
]

const STEP_ORDER: StepKey[] = [
  "RECEIVED",
  "PENDING_INVENTORY_APPROVAL",
  "PENDING_ACCOUNTING_APPROVAL",
  "GETTING_READY_FOR_BUILDING",
  "READY_FOR_SHIPPING",
  "COMPLETED",
]

function getStepIndex(workflowStatus: string): number {
  const idx = STEP_ORDER.indexOf(workflowStatus as StepKey)
  return idx === -1 ? 0 : idx
}

function OrderStepper({ workflowStatus, updatedAt }: { workflowStatus: string; updatedAt: Date }) {
  const currentIndex = getStepIndex(workflowStatus)

  return (
    <div className="relative flex items-start justify-between w-full overflow-x-auto py-2">
      {ORDER_STEPS.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex
        const isPending = index > currentIndex

        return (
          <div key={step.key} className="relative flex flex-col items-center flex-1 min-w-[80px]">
            {/* Connector line left */}
            {index > 0 && (
              <div
                className={`absolute top-[22px] right-[50%] w-full h-[3px] ${
                  isCompleted || isCurrent ? "bg-[#22c55e]" : "bg-[#e5e7eb]"
                }`}
                style={{ left: "-50%", right: "50%" }}
              />
            )}

            {/* Step circle */}
            <div
              className={`relative z-10 flex h-[44px] w-[44px] items-center justify-center rounded-full border-[2px] transition-all ${
                isCompleted
                  ? "border-[#22c55e] bg-[#22c55e] shadow-[0_0_0_4px_rgba(34,197,94,0.12)]"
                  : isCurrent
                    ? "border-[#22c55e] bg-white shadow-[0_0_0_5px_rgba(34,197,94,0.15)]"
                    : "border-[#d1d5dc] bg-white"
              }`}
            >
              <step.Icon
                className={`h-[18px] w-[18px] ${
                  isCompleted
                    ? "text-white"
                    : isCurrent
                      ? "text-[#16a34a]"
                      : "text-[#cbd5e1]"
                }`}
                strokeWidth={1.75}
              />
            </div>

            {/* Label */}
            <p
              className={`mt-2 text-center text-[10px] font-medium uppercase tracking-[0.12em] leading-[14px] ${
                isCurrent
                  ? "text-[#15803d]"
                  : isCompleted
                    ? "text-[#16a34a]"
                    : "text-[#b0b8c4]"
              }`}
            >
              {step.label}
            </p>

            {/* Current step date */}
            {isCurrent && (
              <p className="mt-1 text-center text-[10px] tracking-wide text-[#6a7282]">
                {formatShortDate(updatedAt)}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export const dynamic = "force-dynamic"

type InquiryRow = {
  id: string
  productName: string
  status: string
  statusNote: string | null
  customerMessage: string
  createdAt: Date
  updatedAt: Date
}

type CustomerStatusPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const COMPLETED_MARKER = "[[completed]]"
const PAYMENT_METHOD_PATTERN = /\[\[payment_method:([^\]]+)\]\]/i
const SHIP_AT_PATTERN = /\[\[ship_at:([^\]]+)\]\]/i

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
  if (!note) {
    return null
  }

  return note
    .replace(COMPLETED_MARKER, "")
    .replace(PAYMENT_METHOD_PATTERN, "")
    .replace(SHIP_AT_PATTERN, "")
    .trim() || null
}

function resolveWorkflowStatus(status: string, note: string | null) {
  if (hasCompletedMarker(note)) {
    return "COMPLETED"
  }

  switch (status) {
    case "ACCEPTED":
      return "PENDING_INVENTORY_APPROVAL"
    case "WAITING_FOR_PAYMENT":
      return "PENDING_ACCOUNTING_APPROVAL"
    case "READY_FOR_SHIPMENT":
      return "READY_FOR_SHIPPING"
    default:
      return status
  }
}

export default async function CustomerStatusPage({ searchParams }: CustomerStatusPageProps) {
  const sessionUser = await getStorefrontSessionUser()

  if (!sessionUser) {
    redirect("/sign-in")
  }

  const inquiries = await prisma.$queryRaw<InquiryRow[]>(Prisma.sql`
    SELECT
      ci.id,
      p.name AS "productName",
      ci.status::text AS status,
      ci."statusNote",
      ci.message AS "customerMessage",
      ci."createdAt",
      ci."updatedAt"
    FROM public.customer_inquiries ci
    INNER JOIN public.products p
      ON p.id = ci."productId"
    WHERE ci."customerUserId" = ${sessionUser.id}
    ORDER BY ci."updatedAt" DESC, ci."createdAt" DESC
  `)
  const workflowInquiries = inquiries.map((inquiry) => ({
    ...inquiry,
    workflowStatus: resolveWorkflowStatus(inquiry.status, inquiry.statusNote),
    workflowNote: stripWorkflowMarkers(inquiry.statusNote),
    shipAt: extractShipAt(inquiry.statusNote),
  }))
  const activeInquiries = workflowInquiries.filter((inquiry) => inquiry.workflowStatus !== "COMPLETED")
  const completedInquiries = workflowInquiries.filter((inquiry) => inquiry.workflowStatus === "COMPLETED")
  const returnRequests = await getReturnRequests({
    customerUserId: sessionUser.id,
    inquiryIds: completedInquiries.map((inquiry) => inquiry.id),
  })
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const message = resolveValue(resolvedSearchParams.message)
  const tone = resolveValue(resolvedSearchParams.tone) === "error" ? "error" : "success"

  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      <div className="mx-auto max-w-[1100px] px-6 py-12">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-[12px] uppercase tracking-[0.22em] text-[#99a1af]">Customer account</p>
            <h1 className="mt-3 font-[family-name:var(--font-inter)] text-[40px] font-semibold leading-[44px] text-[#1a1a2e]">
              Inquiry Status
            </h1>
            <p className="mt-3 max-w-[640px] text-[14px] leading-[22px] text-[#6a7282]">
              Track every finished-product order as it moves from sales to inventory, accounting, operations,
              shipping, and finally into your completed order history.
            </p>
          </div>
          <Link
            href="/shop"
            className="rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] font-medium text-[#1a1a2e] transition-colors hover:bg-[#f9fafb]"
          >
            Browse products
          </Link>
        </div>

        {message ? (
          <div
            className={`mb-6 rounded-[18px] border px-5 py-4 text-[14px] ${
              tone === "error"
                ? "border-[#fecaca] bg-[#fff1f2] text-[#9f1239]"
                : "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
            }`}
          >
            {message}
          </div>
        ) : null}

        {inquiries.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#d1d5dc] bg-white px-8 py-14 text-center">
            <h2 className="text-[24px] font-medium text-[#1a1a2e]">No inquiries yet</h2>
            <p className="mt-3 text-[14px] leading-[22px] text-[#6a7282]">
              When you inquire about a finished product, sales will review it and status updates will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <section className="space-y-5">
              <div>
                <h2 className="font-[family-name:var(--font-inter)] text-[28px] font-semibold text-[#1a1a2e]">Active orders</h2>
                <p className="mt-2 text-[14px] leading-[22px] text-[#6a7282]">
                  These are still moving through approval, building, or shipping.
                </p>
              </div>

              {activeInquiries.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-[#d1d5dc] bg-white px-8 py-10 text-center text-[14px] text-[#6a7282]">
                  No active orders right now.
                </div>
              ) : (
                activeInquiries.map((inquiry) => (
                  <article key={inquiry.id} className="rounded-[24px] border border-[#e5e7eb] bg-white p-7 shadow-sm">
                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#99a1af]">Active order</p>
                        <h2 className="mt-1 font-[family-name:var(--font-inter)] text-[24px] font-semibold text-[#1a1a2e]">{inquiry.productName}</h2>
                        <p className="mt-1 text-[12px] text-[#6a7282]">
                          Placed {formatShortDate(inquiry.createdAt)} · Last updated {formatShortDate(inquiry.updatedAt)}
                        </p>
                      </div>
                    </div>

                    {/* Progress stepper */}
                    <div className="rounded-[18px] border border-[#e9f7ef] bg-[#f0fdf4] px-4 py-5 mb-6">
                      <OrderStepper workflowStatus={inquiry.workflowStatus} updatedAt={inquiry.updatedAt} />
                    </div>

                    {/* Shipping date banner — shown when operations has set a delivery date */}
                    {inquiry.shipAt && (
                      <div className="mb-5 flex items-start gap-4 rounded-[18px] border border-[#fde68a] bg-[#fffbeb] px-5 py-4">
                        <div className="mt-0.5 flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full border border-[#fcd34d] bg-[#fef3c7]">
                          <Truck className="h-[18px] w-[18px] text-[#92400e]" strokeWidth={1.75} />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#92400e]">
                            Scheduled Delivery
                          </p>
                          <p className="mt-1 font-[family-name:var(--font-inter)] text-[22px] font-semibold text-[#78350f]">
                            {inquiry.shipAt.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-[#92400e]">
                            <Clock className="h-[13px] w-[13px]" strokeWidth={1.75} />
                            Estimated time:{" "}
                            {inquiry.shipAt.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p className="mt-2 text-[12px] text-[#b45309]">
                            Our operations team has scheduled this delivery. Please ensure someone is available to receive the order.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Info grid */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-[18px] bg-[#f9fafb] p-4">
                        <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Your inquiry</p>
                        <p className="mt-3 text-[14px] leading-[22px] text-[#1a1a2e]">{inquiry.customerMessage}</p>
                      </div>
                      <div className="rounded-[18px] bg-[#f9fafb] p-4">
                        <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Team update</p>
                        <p className="mt-3 text-[14px] leading-[22px] text-[#1a1a2e]">
                          {inquiry.workflowNote ??
                            "Your order is progressing through the admin approval flow. New updates will appear here."}
                        </p>
                      </div>
                    </div>
                  </article>

                ))
              )}

            </section>

            <section className="space-y-5">
              <div>
                <h2 className="font-[family-name:var(--font-inter)] text-[28px] font-semibold text-[#1a1a2e]">Order history</h2>
                <p className="mt-2 text-[14px] leading-[22px] text-[#6a7282]">
                  Completed orders are archived here for your reference.
                </p>
              </div>

              {completedInquiries.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-[#d1d5dc] bg-white px-8 py-10 text-center text-[14px] text-[#6a7282]">
                  No completed orders yet.
                </div>
              ) : (
                completedInquiries.map((inquiry) => (
                  <CompletedOrderReturnCard
                    key={inquiry.id}
                    inquiry={inquiry}
                    existingReturn={returnRequests.find((request) => request.inquiryId === inquiry.id)}
                  />
                ))
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
