"use client"

import { useState } from "react"
import Link from "next/link"
import { formatInquiryWorkflowStatus, getInquiryWorkflowStyle } from "@furnitrack/validators"
import type { InquiryWorkflowRow } from "@/lib/inquiries"

const PAGE_SIZE = 10

function formatPeso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(value)
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

function SalesOrderRow({ inquiry }: { inquiry: InquiryWorkflowRow }) {
  return (
    <tr className="border-b border-[#eef2f7] last:border-b-0">
      <td className="py-4 pr-4 text-[#111827]">{inquiry.productName}</td>
      <td className="py-4 pr-4 text-[#4b5563]">
        {inquiry.customerName}
        <br />
        <span className="text-[11px] text-[#94a3b8]">{inquiry.customerEmail}</span>
      </td>
      <td className="py-4 pr-4 text-[#111827] whitespace-nowrap">{formatPeso(inquiry.total)}</td>
      <td className="py-4 pr-4">
        <WorkflowBadge status={inquiry.workflowStatus} />
      </td>
      <td className="py-4 text-right">
        <Link
          href={`/sales/orders/${inquiry.id}?tab=orders`}
          className="rounded-lg bg-[#111827] px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#111827]/90"
        >
          View order
        </Link>
      </td>
    </tr>
  )
}

export function SalesOrdersTable({ inquiries }: { inquiries: InquiryWorkflowRow[] }) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(inquiries.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pagedInquiries = inquiries.slice(pageStart, pageStart + PAGE_SIZE)

  return (
    <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-[20px] font-semibold text-[#111827]">Orders in the new approval flow</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
              <th className="py-3 pr-4 font-medium">Product</th>
              <th className="py-3 pr-4 font-medium">Customer</th>
              <th className="py-3 pr-4 font-medium">Quotation total</th>
              <th className="py-3 pr-4 font-medium">Current stage</th>
              <th className="py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {pagedInquiries.map((inquiry) => (
              <SalesOrderRow key={inquiry.id} inquiry={inquiry} />
            ))}
            {pagedInquiries.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#6b7280]">
                  No sales orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {inquiries.length > 0 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage(1)}
            disabled={currentPage <= 1}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            aria-label="First page"
          >
            &lt;&lt;
          </button>
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={currentPage <= 1}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            aria-label="Previous page"
          >
            &lt;
          </button>
          <div className="min-w-[112px] rounded-md border border-[#111827] bg-white px-4 py-2 text-center text-[13px] font-semibold text-[#6b7280] shadow-sm">
            <span className="rounded-md bg-[#020617] px-2 py-1 text-white">{currentPage}</span> of {totalPages}
          </div>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={currentPage >= totalPages}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            aria-label="Next page"
          >
            &gt;
          </button>
          <button
            type="button"
            onClick={() => setPage(totalPages)}
            disabled={currentPage >= totalPages}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            aria-label="Last page"
          >
            &gt;&gt;
          </button>
        </div>
      )}
    </section>
  )
}
