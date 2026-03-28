import Link from "next/link"
import { redirect } from "next/navigation"
import { Prisma, prisma } from "@furnitrack/db"
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

const STATUS_STYLES: Record<string, string> = {
  RECEIVED: "bg-[#eef2ff] text-[#4338ca]",
  ACCEPTED: "bg-[#ecfdf3] text-[#047857]",
  GETTING_READY_FOR_BUILDING: "bg-[#fff7e6] text-[#b45309]",
  WAITING_FOR_PAYMENT: "bg-[#fff1f2] text-[#be123c]",
  READY_FOR_SHIPMENT: "bg-[#ecfeff] text-[#155e75]",
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (value) => value.toUpperCase())
}

export default async function CustomerStatusPage() {
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
              Track every finished-product inquiry you sent to sales, including whether it has been accepted,
              is getting ready for building, is waiting for payment, or is ready for shipment.
            </p>
          </div>
          <Link
            href="/shop"
            className="rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] font-medium text-[#1a1a2e] transition-colors hover:bg-[#f9fafb]"
          >
            Browse products
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#d1d5dc] bg-white px-8 py-14 text-center">
            <h2 className="text-[24px] font-medium text-[#1a1a2e]">No inquiries yet</h2>
            <p className="mt-3 text-[14px] leading-[22px] text-[#6a7282]">
              When you inquire about a finished product, sales will review it and status updates will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {inquiries.map((inquiry) => (
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
                    className={`inline-flex rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] ${
                      STATUS_STYLES[inquiry.status] ?? "bg-[#f3f4f6] text-[#374151]"
                    }`}
                  >
                    {formatStatus(inquiry.status)}
                  </span>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div className="rounded-[18px] bg-[#f9fafb] p-4">
                    <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Your inquiry</p>
                    <p className="mt-3 text-[14px] leading-[22px] text-[#1a1a2e]">{inquiry.customerMessage}</p>
                  </div>
                  <div className="rounded-[18px] bg-[#f9fafb] p-4">
                    <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Sales update</p>
                    <p className="mt-3 text-[14px] leading-[22px] text-[#1a1a2e]">
                      {inquiry.statusNote ??
                        "Sales has received your inquiry. Status updates will appear here as your request moves forward."}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
