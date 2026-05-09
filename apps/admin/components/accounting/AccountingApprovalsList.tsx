"use client"

import { useMemo, useState } from "react"
import { PaymentApprovalCard } from "@/components/accounting/PaymentApprovalCard"
import type { InquiryWorkflowRow, InquiryPaymentStatus } from "@/lib/inquiries"

const FILTER_OPTIONS: Array<{ value: "ALL" | "PENDING" | "APPROVED" | "REJECTED" | InquiryPaymentStatus; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "DOWN_PAYMENT", label: "Down Payment" },
  { value: "PARTIALLY_PAID", label: "Partially Paid" },
  { value: "FULLY_PAID", label: "Fully Paid" },
]

function matchesFilter(row: InquiryWorkflowRow, filter: string) {
  if (filter === "ALL") {
    return true
  }

  if (filter === "PENDING" || filter === "APPROVED" || filter === "REJECTED") {
    return row.paymentReviewStatus === filter
  }

  return row.paymentStatus === filter
}

export function AccountingApprovalsList({ rows }: { rows: InquiryWorkflowRow[] }) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<(typeof FILTER_OPTIONS)[number]["value"]>("ALL")

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return rows.filter((row) => {
      const matchesQuery =
        !normalizedQuery ||
        [row.productName, row.customerName, row.customerEmail, row.customerPhone].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        )

      return matchesQuery && matchesFilter(row, filter)
    })
  }, [filter, query, rows])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="w-full md:max-w-md">
          <label className="grid gap-2">
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Search</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search product, customer, email, phone"
              className="w-full rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
            />
          </label>
        </div>
        <div className="w-full md:w-[240px]">
          <label className="grid gap-2">
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Filter</span>
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as typeof filter)}
              className="w-full rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
            >
              {FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {filteredRows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#d1d5db] bg-white p-10 text-center text-[13px] text-[#6b7280]">
          No accounting approvals matched your filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRows.map((inquiry) => (
            <PaymentApprovalCard key={inquiry.id} inquiry={inquiry} />
          ))}
        </div>
      )}
    </div>
  )
}
