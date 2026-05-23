"use client"

import { useState } from "react"
import { X } from "lucide-react"
import type { InquiryWorkflowRow } from "@/lib/inquiries"

function formatPeso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(value)
}

const VAT_RATE = 0.12

type Props = {
  inquiry: InquiryWorkflowRow
}

export function SalesLeadCard({ inquiry }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [statusNote, setStatusNote] = useState(inquiry.workflowNote ?? "")

  // Pricing breakdown
  const basePrice = inquiry.total
  const originalPrice = inquiry.productOriginalPrice
  const isSale = inquiry.productBadge === "SALE" && originalPrice != null && originalPrice > basePrice
  const discountAmount = isSale ? originalPrice! - basePrice : 0
  const vatAmount = basePrice * VAT_RATE
  const totalWithVat = basePrice + vatAmount
  const downPayment = totalWithVat * 0.7
  const balance = totalWithVat * 0.3

  return (
    <>
      <article className="rounded-xl border border-[#eef2f7] bg-[#fbfcfd] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Customer order inquiry</p>
              {isSale ? (
                <span className="rounded-full bg-[#fb2c36] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  SALE
                </span>
              ) : null}
            </div>
            <h3 className="mt-1 text-[20px] font-semibold text-[#111827]">{inquiry.productName}</h3>
            <p className="mt-2 text-[13px] text-[#6b7280]">
              {inquiry.customerName} · {inquiry.customerEmail} · {inquiry.customerPhone}
            </p>
            <p className="mt-3 max-w-[720px] text-[14px] leading-[22px] text-[#1f2937]">{inquiry.message}</p>
          </div>

          <div className="flex flex-col items-start gap-3 text-[12px] text-[#6b7280] lg:items-end">
            <span className="inline-flex rounded-full bg-[#fef9c3] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#854d0e]">
              Received by Sales
            </span>
            <div>
              <p>Created {new Date(inquiry.createdAt).toLocaleDateString()}</p>
              <p className="mt-1">Updated {new Date(inquiry.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
          <label className="block">
            <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
              Sales note before inventory review
            </span>
            <input
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="Tell inventory what to validate for this customer order"
              className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
            />
          </label>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="rounded-[12px] bg-[#111827] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90"
            >
              Request inventory approval
            </button>
          </div>
        </div>
      </article>

      {/* Confirmation modal */}
      {showConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/55 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Confirm inventory request</p>
                <h4 className="mt-2 text-[22px] font-semibold text-[#111827]">{inquiry.productName}</h4>
                <p className="mt-1 text-[13px] text-[#6b7280]">
                  Review the order and pricing before sending to inventory for material check.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-full border border-[#d1d5dc] p-2 text-[#6b7280] transition-colors hover:bg-[#f9fafb]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Customer info */}
            <div className="mt-5 rounded-[18px] bg-[#f8fafc] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Customer</p>
              <p className="mt-2 text-[14px] font-semibold text-[#111827]">{inquiry.customerName}</p>
              <p className="text-[13px] text-[#6b7280]">{inquiry.customerEmail} · {inquiry.customerPhone}</p>
              {inquiry.inquiryNumber ? (
                <p className="mt-1 font-mono text-[12px] text-[#94a3b8]">{inquiry.inquiryNumber}</p>
              ) : null}
            </div>

            {/* Customer message */}
            <div className="mt-3 rounded-[18px] bg-[#f8fafc] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Customer inquiry</p>
              <p className="mt-2 text-[13px] leading-[22px] text-[#374151]">{inquiry.message}</p>
            </div>

            {/* Pricing breakdown */}
            <div className="mt-4 rounded-[18px] border border-[#e5e7eb] bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <p className="text-[13px] font-semibold text-[#111827]">Order pricing breakdown</p>
                {isSale ? (
                  <span className="rounded-full bg-[#fb2c36] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    SALE
                  </span>
                ) : null}
              </div>

              <div className="space-y-2 text-[13px]">
                {isSale ? (
                  <div className="flex justify-between text-[#6b7280]">
                    <span>Original price</span>
                    <span className="line-through">{formatPeso(originalPrice!)}</span>
                  </div>
                ) : null}

                <div className="flex justify-between text-[#374151]">
                  <span>Product price</span>
                  <span>{formatPeso(basePrice)}</span>
                </div>

                {isSale ? (
                  <div className="flex justify-between text-[#16a34a]">
                    <span>Discount (sale)</span>
                    <span>- {formatPeso(discountAmount)}</span>
                  </div>
                ) : null}

                <div className="flex justify-between text-[#374151]">
                  <span>VAT (12%)</span>
                  <span>{formatPeso(vatAmount)}</span>
                </div>

                <div className="flex justify-between border-t border-[#e5e7eb] pt-2 text-[15px] font-semibold text-[#111827]">
                  <span>Total (VAT inclusive)</span>
                  <span>{formatPeso(totalWithVat)}</span>
                </div>
              </div>

              <div className="mt-4 grid gap-2 rounded-[12px] bg-[#f8fafc] p-3 sm:grid-cols-2 text-[12px]">
                <div>
                  <p className="text-[#94a3b8] uppercase tracking-wide">Down payment (70%)</p>
                  <p className="mt-0.5 font-semibold text-[#111827]">{formatPeso(downPayment)}</p>
                </div>
                <div>
                  <p className="text-[#94a3b8] uppercase tracking-wide">Remaining balance (30%)</p>
                  <p className="mt-0.5 font-semibold text-[#111827]">{formatPeso(balance)}</p>
                </div>
              </div>
            </div>

            {/* Sales note */}
            <div className="mt-4">
              <label className="block">
                <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                  Sales note for inventory
                </span>
                <input
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Tell inventory what to validate for this order"
                  className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                />
              </label>
            </div>

            {/* Actions — actual form submit */}
            <form method="post" action="/api/admin/approvals/sales" className="mt-5 flex flex-col-reverse gap-3 border-t border-[#e5e7eb] pt-4 sm:flex-row sm:justify-end">
              <input type="hidden" name="inquiryId" value={inquiry.id} />
              <input type="hidden" name="statusNote" value={statusNote} />
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-[14px] border border-[#d1d5dc] px-5 py-3 text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-[14px] bg-[#111827] px-6 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#374151]"
              >
                Confirm &amp; send to inventory
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
