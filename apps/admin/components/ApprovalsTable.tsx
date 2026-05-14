"use client"

import { useState } from "react"
import { formatInquiryWorkflowStatus, getInquiryWorkflowStyle } from "@furnitrack/validators"
import type { InquiryWorkflowRow } from "@/lib/inquiries"

const PAGE_SIZE = 10

type ApprovalsTableProps = {
  inquiries: InquiryWorkflowRow[]
}

export function ApprovalsTable({ inquiries }: ApprovalsTableProps) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(inquiries.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pagedRows = inquiries.slice(pageStart, pageStart + PAGE_SIZE)

  if (inquiries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#d1d5db] bg-[#f9fafb] px-6 py-12 text-center text-[13px] text-[#6b7280]">
        No customer orders are in the workflow yet.
      </div>
    )
  }

  return (
    <div>
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
            {pagedRows.map((inquiry) => (
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

      <div className="mt-5 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setPage(1)}
          disabled={currentPage <= 1}
          className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
          aria-label="First page"
        >
          {"<<"}
        </button>
        <button
          type="button"
          onClick={() => setPage((v) => Math.max(1, v - 1))}
          disabled={currentPage <= 1}
          className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
          aria-label="Previous page"
        >
          {"<"}
        </button>
        <div className="min-w-[112px] rounded-md border border-[#111827] bg-white px-4 py-2 text-center text-[13px] font-semibold text-[#6b7280] shadow-sm">
          <span className="rounded-md bg-[#020617] px-2 py-1 text-white">{currentPage}</span> of {totalPages}
        </div>
        <button
          type="button"
          onClick={() => setPage((v) => Math.min(totalPages, v + 1))}
          disabled={currentPage >= totalPages}
          className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
          aria-label="Next page"
        >
          {">"}
        </button>
        <button
          type="button"
          onClick={() => setPage(totalPages)}
          disabled={currentPage >= totalPages}
          className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
          aria-label="Last page"
        >
          {">>"}
        </button>
      </div>
    </div>
  )
}
