"use client"

import { useState } from "react"
import { CheckCircle, XCircle, FileText, Loader2, ChevronDown, ChevronUp } from "lucide-react"

const VAT_RATE = 0.12

function formatPeso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(value)
}

type Props = {
  inquiryId: string
  productName: string
  inquiryNumber?: string | null
  quantity: number
  quotedPrice: number
  quotedPriceBeforeDiscount: number | null
  quotationDiscount: number
  quotationRevisionCount: number
  customerMessage?: string | null
  workflowNote?: string | null
}

export function QuotationResponseCard({
  inquiryId,
  productName,
  inquiryNumber,
  quantity,
  quotedPrice,
  quotedPriceBeforeDiscount,
  quotationDiscount,
  quotationRevisionCount,
  customerMessage,
  workflowNote,
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "accepted" | "declined" | "error">("idle")
  const [note, setNote] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const qty = quantity ?? 1
  // quotedPrice is the total for all units (already multiplied by qty on the server)
  const unitPrice = qty > 1 ? quotedPrice / qty : quotedPrice
  const hasDiscount = quotationDiscount > 0 && quotedPriceBeforeDiscount != null
  const discountPct = hasDiscount
    ? ((quotationDiscount / quotedPriceBeforeDiscount!) * 100).toFixed(1)
    : null

  const vatAmount = quotedPrice * VAT_RATE
  const totalWithVat = quotedPrice + vatAmount
  const downPayment = totalWithVat * 0.7
  const balance = totalWithVat * 0.3

  async function respond(accepted: boolean) {
    setStatus("loading")
    setMessage(null)
    try {
      const res = await fetch("/api/orders/quotation-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId, accepted, note: note.trim() || null }),
      })
      const data = await res.json() as { message?: string }
      if (res.ok) {
        setStatus(accepted ? "accepted" : "declined")
        setMessage(data.message ?? (accepted ? "Quotation accepted!" : "Quotation declined."))
        setTimeout(() => window.location.reload(), 2000)
      } else {
        setStatus("error")
        setMessage(data.message ?? "Something went wrong. Please try again.")
      }
    } catch {
      setStatus("error")
      setMessage("Network error. Please check your connection.")
    }
  }

  if (status === "accepted") {
    return (
      <div className="mt-5 rounded-[18px] border border-[#bbf7d0] bg-[#f0fdf4] px-5 py-5 text-center">
        <CheckCircle className="mx-auto h-8 w-8 text-[#16a34a]" />
        <p className="mt-3 text-[15px] font-medium text-[#166534]">{message}</p>
        <p className="mt-1 text-[13px] text-[#4ade80]">Redirecting to payment…</p>
      </div>
    )
  }

  if (status === "declined") {
    return (
      <div className="mt-5 rounded-[18px] border border-[#e5e7eb] bg-[#f9fafb] px-5 py-5 text-center">
        <p className="text-[15px] font-medium text-[#374151]">{message}</p>
        <p className="mt-1 text-[13px] text-[#6b7280]">Refreshing your order…</p>
      </div>
    )
  }

  return (
    <div className="mt-5 rounded-[18px] border border-[#e5e7eb] bg-white px-5 py-5">

      {/* ── Header ── */}
      <div className="flex items-start gap-3">
        <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#f1f5f9]">
          <FileText className="h-5 w-5 text-[#475569]" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748b]">
              Sales Quotation — Action Required
            </p>
            {quotationRevisionCount > 0 && (
              <span className="rounded-full bg-[#f1f5f9] px-2.5 py-0.5 text-[10px] font-semibold text-[#475569]">
                Revision #{quotationRevisionCount}
              </span>
            )}
          </div>
          <p className="mt-1 text-[14px] font-medium text-[#1a1a2e]">
            Our sales team has prepared a quotation for your order.
          </p>
          <p className="mt-0.5 text-[13px] text-[#6a7282]">
            Please review the pricing below and accept or decline.
          </p>
        </div>
      </div>

      {/* ── Pricing breakdown ── */}
      <div className="mt-4 rounded-[14px] border border-[#e5e7eb] bg-[#f8fafc] p-4">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#64748b]">
          Quotation for {productName}
        </p>

        <div className="space-y-2 text-[13px]">
          {/* Quantity row — always shown */}
          {qty > 1 && (
            <>
              <div className="flex justify-between text-[#374151]">
                <span>Unit price</span>
                <span className="font-medium">{formatPeso(unitPrice)}</span>
              </div>
              <div className="flex justify-between text-[#374151]">
                <span>Quantity</span>
                <span className="font-medium">{qty} units</span>
              </div>
              <div className="flex justify-between text-[#374151] border-t border-[#e5e7eb] pt-2">
                <span>Subtotal ({qty} × {formatPeso(unitPrice)})</span>
                <span className="font-medium">{formatPeso(quotedPrice)}</span>
              </div>
            </>
          )}

          {/* Discount rows */}
          {hasDiscount ? (
            <>
              {qty === 1 && (
                <div className="flex justify-between text-[#6b7280]">
                  <span>Original price</span>
                  <span>{formatPeso(quotedPriceBeforeDiscount!)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-[#16a34a]">
                <span>Discount ({discountPct}%)</span>
                <span>- {formatPeso(quotationDiscount)}</span>
              </div>
              <div className="flex justify-between text-[#374151]">
                <span>Price after discount</span>
                <span className="font-medium">{formatPeso(quotedPrice)}</span>
              </div>
            </>
          ) : (
            qty === 1 && (
              <div className="flex justify-between text-[#374151]">
                <span>Quoted price</span>
                <span className="font-medium">{formatPeso(quotedPrice)}</span>
              </div>
            )
          )}

          <div className="flex justify-between text-[#374151]">
            <span>VAT (12%)</span>
            <span>{formatPeso(vatAmount)}</span>
          </div>
          <div className="flex justify-between border-t border-[#e5e7eb] pt-2 text-[15px] font-semibold text-[#111827]">
            <span>Total (VAT inclusive)</span>
            <span>{formatPeso(totalWithVat)}</span>
          </div>
        </div>

        {/* Down payment / balance */}
        <div className="mt-3 grid gap-2 rounded-[10px] bg-white border border-[#e5e7eb] p-3 sm:grid-cols-2 text-[12px]">
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

      {/* ── View all details toggle ── */}
      <button
        type="button"
        onClick={() => setShowDetails((v) => !v)}
        className="mt-3 flex w-full items-center justify-between rounded-[12px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#f1f5f9]"
      >
        <span>View all order details</span>
        {showDetails
          ? <ChevronUp className="h-4 w-4 text-[#6b7280]" />
          : <ChevronDown className="h-4 w-4 text-[#6b7280]" />
        }
      </button>

      {/* ── Expanded order details ── */}
      {showDetails && (
        <div className="mt-2 space-y-3 rounded-[14px] border border-[#e5e7eb] bg-[#f8fafc] p-4 text-[13px]">

          {/* Order reference */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">Order reference</p>
            <div className="mt-2 space-y-1">
              {inquiryNumber && (
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Inquiry number</span>
                  <span className="font-mono font-semibold text-[#111827]">{inquiryNumber}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Product</span>
                <span className="font-semibold text-[#111827]">{productName}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e5e7eb]" />

          {/* Order items table */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">Order items</p>
            <div className="mt-2 overflow-hidden rounded-[10px] border border-[#e5e7eb] bg-white">
              <table className="min-w-full text-left text-[12px]">
                <thead className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                  <tr className="text-[#94a3b8] uppercase tracking-wide">
                    <th className="px-3 py-2 font-medium">Item</th>
                    <th className="px-3 py-2 font-medium text-right">Unit price</th>
                    <th className="px-3 py-2 font-medium text-right">Qty</th>
                    <th className="px-3 py-2 font-medium text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#f1f5f9] last:border-0">
                    <td className="px-3 py-3 font-medium text-[#111827]">{productName}</td>
                    <td className="px-3 py-3 text-right text-[#374151]">{formatPeso(unitPrice)}</td>
                    <td className="px-3 py-3 text-right text-[#374151]">{qty}</td>
                    <td className="px-3 py-3 text-right font-semibold text-[#111827]">{formatPeso(quotedPrice)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-[#e5e7eb]" />

          {/* Full price breakdown */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">Price breakdown</p>
            <div className="mt-2 space-y-1.5">
              {qty > 1 && (
                <div className="flex justify-between text-[#374151]">
                  <span>Subtotal ({qty} units)</span>
                  <span>{formatPeso(quotedPrice)}</span>
                </div>
              )}
              {hasDiscount && (
                <>
                  <div className="flex justify-between text-[#6b7280]">
                    <span>Before discount</span>
                    <span>{formatPeso(quotedPriceBeforeDiscount!)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-[#16a34a]">
                    <span>Discount ({discountPct}%)</span>
                    <span>- {formatPeso(quotationDiscount)}</span>
                  </div>
                  <div className="flex justify-between text-[#374151]">
                    <span>After discount</span>
                    <span>{formatPeso(quotedPrice)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-[#374151]">
                <span>VAT (12%)</span>
                <span>{formatPeso(vatAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-[#e5e7eb] pt-1.5 font-semibold text-[#111827]">
                <span>Total (VAT inclusive)</span>
                <span>{formatPeso(totalWithVat)}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e5e7eb]" />

          {/* Payment schedule */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">Payment schedule</p>
            <div className="mt-2 space-y-1.5">
              <div className="flex justify-between text-[#374151]">
                <span>Down payment required (70%)</span>
                <span className="font-semibold text-[#111827]">{formatPeso(downPayment)}</span>
              </div>
              <div className="flex justify-between text-[#374151]">
                <span>Remaining balance (30%)</span>
                <span className="font-semibold text-[#111827]">{formatPeso(balance)}</span>
              </div>
              <p className="mt-1 text-[11px] text-[#94a3b8]">
                Down payment is required before production begins. Balance is due before delivery.
              </p>
            </div>
          </div>

          {/* Sales note if present */}
          {workflowNote && (
            <>
              <div className="border-t border-[#e5e7eb]" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">Note from sales</p>
                <p className="mt-2 leading-[20px] text-[#374151]">{workflowNote}</p>
              </div>
            </>
          )}

          {/* Customer inquiry */}
          {customerMessage && (
            <>
              <div className="border-t border-[#e5e7eb]" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">Your original inquiry</p>
                <p className="mt-2 leading-[20px] text-[#6b7280]">{customerMessage}</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Error ── */}
      {status === "error" && message && (
        <div className="mt-3 rounded-[12px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-[13px] text-[#374151]">
          {message}
        </div>
      )}

      {/* ── Decline confirm ── */}
      {showDeclineConfirm ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
            <p className="text-[13px] font-medium text-[#111827]">
              Are you sure you want to decline this quotation?
            </p>
            <p className="mt-1 text-[12px] text-[#6b7280]">
              Sales will be notified and may revise the offer.
            </p>
          </div>
          <label className="grid gap-2">
            <span className="text-[12px] font-medium text-[#374151]">Reason (optional)</span>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Price is too high, please revise"
              className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none focus:border-[#111827]"
            />
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowDeclineConfirm(false)}
              className="flex-1 rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] font-medium text-[#374151] hover:bg-[#f9fafb]"
            >
              Go back
            </button>
            <button
              type="button"
              onClick={() => void respond(false)}
              disabled={status === "loading"}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60"
            >
              {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
              Confirm decline
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => void respond(true)}
            disabled={status === "loading"}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#1a1a2e] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#111] disabled:opacity-60"
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            Accept quotation &amp; proceed to payment
          </button>
          <button
            type="button"
            onClick={() => setShowDeclineConfirm(true)}
            disabled={status === "loading"}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#d1d5dc] bg-white px-5 py-3 text-[14px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb] disabled:opacity-60"
          >
            <XCircle className="h-4 w-4" />
            Decline
          </button>
        </div>
      )}
    </div>
  )
}
