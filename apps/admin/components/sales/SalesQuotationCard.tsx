"use client"

import { useState } from "react"
import { X, FileText, AlertTriangle } from "lucide-react"
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

export function SalesQuotationCard({ inquiry }: Props) {
  const [showModal, setShowModal] = useState(false)

  const catalogPrice = inquiry.total
  const originalPrice = inquiry.productOriginalPrice
  const isSale = inquiry.productBadge === "SALE" && originalPrice != null && originalPrice > catalogPrice

  // Default quoted price: last sent or catalog price
  const defaultPrice = inquiry.quotedPrice != null
    ? String(inquiry.quotedPrice)
    : String(catalogPrice)

  const [quotedPrice, setQuotedPrice] = useState(defaultPrice)
  const [discountPct, setDiscountPct] = useState("0")
  const [salesNote, setSalesNote] = useState("")

  const parsedQuoted = Number(quotedPrice)
  const parsedPct = Math.min(100, Math.max(0, Number(discountPct) || 0))

  // Compute discount amount from percentage
  const discountAmount = Number.isFinite(parsedQuoted) && parsedQuoted > 0
    ? (parsedQuoted * parsedPct) / 100
    : 0
  const finalPrice = Math.max(0, parsedQuoted - discountAmount)
  const isValidPrice = Number.isFinite(finalPrice) && finalPrice > 0

  const vatAmount = isValidPrice ? finalPrice * VAT_RATE : 0
  const totalWithVat = isValidPrice ? finalPrice + vatAmount : 0
  const downPayment = totalWithVat * 0.7
  const balance = totalWithVat * 0.3

  const wasDeclined = inquiry.quotationAccepted === false
  const isPendingResponse = inquiry.quotedPrice != null && inquiry.quotationAccepted === null
  const revisionCount = inquiry.quotationRevisionCount ?? 0

  function handleOpen() {
    setQuotedPrice(inquiry.quotedPrice != null ? String(inquiry.quotedPrice) : String(catalogPrice))
    setDiscountPct("0")
    setSalesNote("")
    setShowModal(true)
  }

  return (
    <>
      <article className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[12px] uppercase tracking-[0.18em] text-[#64748b]">Quotation stage</p>
              {isSale && (
                <span className="rounded-full bg-[#fb2c36] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  SALE
                </span>
              )}
              {revisionCount > 0 && (
                <span className="rounded-full bg-[#f1f5f9] px-2.5 py-0.5 text-[10px] font-semibold text-[#475569]">
                  Revision #{revisionCount}
                </span>
              )}
            </div>
            <h3 className="mt-1 text-[20px] font-semibold text-[#111827]">{inquiry.productName}</h3>
            <p className="mt-2 text-[13px] text-[#6b7280]">
              {inquiry.customerName} · {inquiry.customerEmail} · {inquiry.customerPhone}
            </p>
            {inquiry.inquiryNumber && (
              <p className="mt-1 font-mono text-[12px] text-[#9ca3af]">{inquiry.inquiryNumber}</p>
            )}
            <p className="mt-3 max-w-[720px] text-[14px] leading-[22px] text-[#1f2937]">{inquiry.message}</p>
          </div>

          <div className="flex flex-col items-start gap-3 text-[12px] text-[#6b7280] lg:items-end">
            <span className="inline-flex rounded-full bg-[#f1f5f9] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#475569]">
              {wasDeclined ? "Declined — Revise Offer" : isPendingResponse ? "Awaiting Customer Response" : "Pending Quotation"}
            </span>
            <div>
              <p>Created {new Date(inquiry.createdAt).toLocaleDateString()}</p>
              <p className="mt-1">Updated {new Date(inquiry.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Decline reason banner */}
        {wasDeclined && (
          <div className="mt-4 flex items-start gap-3 rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#64748b]" />
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wide text-[#374151]">Customer declined</p>
              <p className="mt-1 text-[13px] text-[#4b5563]">
                {inquiry.quotationDeclineReason ?? "No reason provided. Please revise the offer."}
              </p>
            </div>
          </div>
        )}

        {/* Pricing summary */}
        <div className="mt-4 grid gap-3 rounded-[14px] bg-[#f8fafc] p-4 sm:grid-cols-3 border border-[#e5e7eb]">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-[#94a3b8]">Catalog price</p>
            <p className="mt-1 text-[14px] font-semibold text-[#111827]">{formatPeso(catalogPrice)}</p>
          </div>
          {inquiry.quotedPrice != null && (
            <>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-[#94a3b8]">Last quoted price</p>
                <p className={`mt-1 text-[14px] font-semibold ${wasDeclined ? "text-[#6b7280] line-through" : "text-[#111827]"}`}>
                  {formatPeso(inquiry.quotedPrice)}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-[#94a3b8]">Total (VAT incl.)</p>
                <p className={`mt-1 text-[14px] font-semibold ${wasDeclined ? "text-[#6b7280] line-through" : "text-[#111827]"}`}>
                  {formatPeso(inquiry.quotedPrice + inquiry.quotedPrice * VAT_RATE)}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleOpen}
            className="inline-flex items-center gap-2 rounded-[12px] bg-[#111827] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#374151]"
          >
            <FileText className="h-4 w-4" />
            {wasDeclined ? "Revise & resend quotation" : isPendingResponse ? "Update quotation" : "Send quotation"}
          </button>
        </div>
      </article>

      {/* Quotation modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/55 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">
                  {wasDeclined
                    ? `Revised quotation${revisionCount > 0 ? ` (Revision #${revisionCount + 1})` : ""}`
                    : "Send quotation"}
                </p>
                <h4 className="mt-2 text-[22px] font-semibold text-[#111827]">{inquiry.productName}</h4>
                <p className="mt-1 text-[13px] text-[#6b7280]">
                  {wasDeclined
                    ? "Customer declined the previous offer. Adjust the price or add a discount and resend."
                    : "Set the negotiated price and send the quotation to the customer for approval."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full border border-[#d1d5dc] p-2 text-[#6b7280] transition-colors hover:bg-[#f9fafb]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Decline reason reminder */}
            {wasDeclined && (
              <div className="mt-4 flex items-start gap-3 rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#64748b]" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#374151]">Customer&apos;s reason for declining</p>
                  <p className="mt-1 text-[13px] text-[#4b5563]">
                    {inquiry.quotationDeclineReason ?? "No reason provided."}
                  </p>
                </div>
              </div>
            )}

            {/* Customer info */}
            <div className="mt-4 rounded-[18px] bg-[#f8fafc] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Customer</p>
              <p className="mt-2 text-[14px] font-semibold text-[#111827]">{inquiry.customerName}</p>
              <p className="text-[13px] text-[#6b7280]">{inquiry.customerEmail} · {inquiry.customerPhone}</p>
            </div>

            {/* Customer message */}
            <div className="mt-3 rounded-[18px] bg-[#f8fafc] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Customer inquiry</p>
              <p className="mt-2 text-[13px] leading-[22px] text-[#374151]">{inquiry.message}</p>
            </div>

            {/* Price negotiation */}
            <div className="mt-4 rounded-[18px] border border-[#e5e7eb] bg-white p-5">
              <p className="mb-3 text-[13px] font-semibold text-[#111827]">Quotation pricing</p>

              <div className="space-y-3">
                {/* Reference prices */}
                <div className="grid gap-2 rounded-[12px] bg-[#f8fafc] p-3 sm:grid-cols-3 text-[12px]">
                  <div>
                    <p className="text-[#94a3b8] uppercase tracking-wide">Catalog price</p>
                    <p className="mt-0.5 font-semibold text-[#111827]">{formatPeso(catalogPrice)}</p>
                  </div>
                  {isSale && originalPrice && (
                    <div>
                      <p className="text-[#94a3b8] uppercase tracking-wide">Original (before sale)</p>
                      <p className="mt-0.5 font-semibold text-[#6b7280] line-through">{formatPeso(originalPrice)}</p>
                    </div>
                  )}
                  {inquiry.quotedPrice != null && (
                    <div>
                      <p className="text-[#94a3b8] uppercase tracking-wide">Previous quote</p>
                      <p className={`mt-0.5 font-semibold ${wasDeclined ? "text-[#6b7280] line-through" : "text-[#111827]"}`}>
                        {formatPeso(inquiry.quotedPrice)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Quoted price input */}
                <label className="grid gap-2">
                  <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                    Quoted price (before VAT &amp; discount)
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(e.target.value)}
                    placeholder="Enter quoted price"
                    className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                  />
                </label>

                {/* Discount % input */}
                <label className="grid gap-2">
                  <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                    Discount (%) — optional
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={discountPct}
                      onChange={(e) => setDiscountPct(e.target.value)}
                      placeholder="0"
                      className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 pr-10 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#94a3b8]">%</span>
                  </div>
                  {parsedPct > 0 && Number.isFinite(parsedQuoted) && parsedQuoted > 0 && (
                    <p className="text-[12px] text-[#16a34a]">
                      Discount amount: {formatPeso(discountAmount)} — price after discount: {formatPeso(finalPrice)}
                    </p>
                  )}
                </label>

                {/* Live breakdown */}
                {isValidPrice && (
                  <div className="space-y-2 rounded-[12px] border border-[#e5e7eb] bg-[#f8fafc] p-4 text-[13px]">
                    <div className="flex justify-between text-[#374151]">
                      <span>Quoted price</span>
                      <span>{formatPeso(parsedQuoted)}</span>
                    </div>
                    {parsedPct > 0 && (
                      <>
                        <div className="flex justify-between text-[#16a34a] font-medium">
                          <span>Discount ({parsedPct}%)</span>
                          <span>- {formatPeso(discountAmount)}</span>
                        </div>
                        <div className="flex justify-between text-[#374151]">
                          <span>Price after discount</span>
                          <span>{formatPeso(finalPrice)}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between text-[#374151]">
                      <span>VAT (12%)</span>
                      <span>{formatPeso(vatAmount)}</span>
                    </div>
                    <div className="flex justify-between border-t border-[#e5e7eb] pt-2 text-[15px] font-semibold text-[#111827]">
                      <span>Total (VAT inclusive)</span>
                      <span>{formatPeso(totalWithVat)}</span>
                    </div>
                    <div className="mt-3 grid gap-2 rounded-[10px] bg-white border border-[#e5e7eb] p-3 sm:grid-cols-2 text-[12px]">
                      <div>
                        <p className="text-[#94a3b8] uppercase tracking-wide">Down payment (70%)</p>
                        <p className="mt-0.5 font-semibold text-[#111827]">{formatPeso(downPayment)}</p>
                      </div>
                      <div>
                        <p className="text-[#94a3b8] uppercase tracking-wide">Balance (30%)</p>
                        <p className="mt-0.5 font-semibold text-[#111827]">{formatPeso(balance)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sales note */}
            <div className="mt-4">
              <label className="block">
                <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                  Sales note to customer (optional)
                </span>
                <textarea
                  value={salesNote}
                  onChange={(e) => setSalesNote(e.target.value)}
                  rows={3}
                  placeholder={wasDeclined ? "e.g. We've revised the price based on your feedback..." : "e.g. Special pricing for your order..."}
                  className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827] resize-none"
                />
              </label>
            </div>

            {/* Actions */}
            <form
              method="post"
              action="/api/admin/approvals/sales/quotation"
              className="mt-5 flex flex-col-reverse gap-3 border-t border-[#e5e7eb] pt-4 sm:flex-row sm:justify-end"
            >
              <input type="hidden" name="inquiryId" value={inquiry.id} />
              <input type="hidden" name="quotedPrice" value={isValidPrice ? String(parsedQuoted) : ""} />
              <input type="hidden" name="discountAmount" value={String(discountAmount)} />
              <input type="hidden" name="salesNote" value={salesNote} />
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-[14px] border border-[#d1d5dc] px-5 py-3 text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValidPrice}
                className="inline-flex items-center gap-2 rounded-[14px] bg-[#111827] px-6 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#374151] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="h-4 w-4" />
                {wasDeclined ? "Send revised quotation" : "Send quotation to customer"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
