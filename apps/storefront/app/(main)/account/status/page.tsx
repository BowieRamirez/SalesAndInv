import Link from "next/link"
import { redirect } from "next/navigation"
import { Prisma, prisma, getReturnRequests } from "@furnitrack/db"
import {
  formatInquiryWorkflowStatus,
  getInquiryWorkflowStyle,
} from "@furnitrack/validators"
import { CompletedOrderReturnCard } from "@/components/CompletedOrderReturnCard"
import { getStorefrontSessionUser } from "@/lib/auth/session"
import { formatShortDate } from "@/lib/format"

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

function resolveValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

function hasCompletedMarker(note: string | null) {
  return typeof note === "string" && note.includes(COMPLETED_MARKER)
}

function stripWorkflowMarkers(note: string | null) {
  if (!note) {
    return null
  }

  return note.replace(COMPLETED_MARKER, "").replace(PAYMENT_METHOD_PATTERN, "").trim() || null
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
            <h1 className="mt-3 font-['var(--font-playfair)'] text-[40px] font-medium leading-[44px] text-[#1a1a2e]">
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
                <h2 className="text-[24px] font-medium text-[#1a1a2e]">Active orders</h2>
                <p className="mt-2 text-[14px] text-[#6a7282]">
                  These are still moving through approval, building, or shipping.
                </p>
              </div>

              {activeInquiries.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-[#d1d5dc] bg-white px-8 py-10 text-center text-[14px] text-[#6a7282]">
                  No active orders right now.
                </div>
              ) : (
                activeInquiries.map((inquiry) => (
                  <article key={inquiry.id} className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Product inquiry</p>
                        <h2 className="mt-2 text-[24px] font-medium text-[#1a1a2e]">{inquiry.productName}</h2>
                        <p className="mt-2 text-[13px] text-[#6a7282]">
                          Sent on {formatShortDate(inquiry.createdAt)} and last updated on{" "}
                          {formatShortDate(inquiry.updatedAt)}.
                        </p>
                      </div>
                      <span
                        className={`inline-flex rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] ${getInquiryWorkflowStyle(inquiry.workflowStatus)}`}
                      >
                        {formatInquiryWorkflowStatus(inquiry.workflowStatus)}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
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
                <h2 className="text-[24px] font-medium text-[#1a1a2e]">Order history</h2>
                <p className="mt-2 text-[14px] text-[#6a7282]">
                  Shipped orders are marked complete and stored here.
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
