"use client"

import { useState, useEffect } from "react"
import { formatInquiryWorkflowStatus, getInquiryWorkflowStyle } from "@furnitrack/validators"
import type { InquiryPaymentStatus, InquiryWorkflowRow } from "@/lib/inquiries"
import { formatAccountingPaymentMethod } from "@/lib/accounting-payment-methods"

const VAT_RATE = 0.12

type MaterialRow = {
  itemName: string
  sku: string
  quantityDisplay: string | null
  unitOfMeasure: string
}

type ProofRow = {
  id: string
  fileName: string
  mimeType: string
  dataUrl: string
  createdAt: Date
  senderName: string | null
}

function WorkflowBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] ${getInquiryWorkflowStyle(status)}`}>
      {formatInquiryWorkflowStatus(status)}
    </span>
  )
}

function formatPeso(value: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 2 }).format(value)
}

function PaymentStatusBadge({ status }: { status: InquiryPaymentStatus }) {
  const label = status.split("_").map((p) => p.charAt(0) + p.slice(1).toLowerCase()).join(" ")
  const tone =
    status === "FULLY_PAID" ? "bg-[#dcfce7] text-[#166534]"
    : status === "REJECTED" ? "bg-[#ffe4e6] text-[#be123c]"
    : status === "PENDING" ? "bg-[#fef3c7] text-[#92400e]"
    : "bg-[#dbeafe] text-[#1d4ed8]"
  return <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${tone}`}>{label}</span>
}

export function PaymentApprovalCard({ inquiry }: { inquiry: InquiryWorkflowRow }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showRejectConfirm, setShowRejectConfirm] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [materials, setMaterials] = useState<MaterialRow[]>([])
  const [loadingMaterials, setLoadingMaterials] = useState(false)
  const [proofs, setProofs] = useState<ProofRow[]>([])
  const [loadingProofs, setLoadingProofs] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  // Pricing — use quotedPrice if available, otherwise catalog price
  const basePrice = inquiry.quotedPrice ?? inquiry.total
  const priceBeforeDiscount = inquiry.quotedPriceBeforeDiscount
  const discountAmount = inquiry.quotationDiscount ?? 0
  const hasDiscount = discountAmount > 0 && priceBeforeDiscount != null
  const discountPct = hasDiscount ? ((discountAmount / priceBeforeDiscount!) * 100).toFixed(1) : null
  const vatAmount = basePrice * VAT_RATE
  const totalWithVat = basePrice + vatAmount
  const downPaymentRequired = totalWithVat * 0.7

  const customerHasPaid = !!inquiry.customerPaidMethod
  const submittedMethod = inquiry.latestPaymentMethod ?? inquiry.customerPaidMethod
  const submittedAmount = inquiry.latestPaymentAmount ?? inquiry.paid
  const submittedRemaining = inquiry.latestPaymentRemaining != null
    ? inquiry.latestPaymentRemaining
    : Math.max(totalWithVat - submittedAmount, 0)
  const derivedPaymentType: "FULL_PAYMENT" | "DOWN_PAYMENT" =
    submittedAmount >= totalWithVat ? "FULL_PAYMENT" : "DOWN_PAYMENT"
  const derivedPaymentStatus: InquiryPaymentStatus =
    derivedPaymentType === "FULL_PAYMENT" ? "FULLY_PAID" : "DOWN_PAYMENT"

  // Fetch materials when modal opens
  useEffect(() => {
    if (!isOpen || materials.length > 0) return
    setLoadingMaterials(true)
    fetch(`/api/admin/sales/order-materials?inquiryId=${encodeURIComponent(inquiry.id)}`)
      .then(r => r.json())
      .then((data: { materials?: MaterialRow[] }) => { setMaterials(data.materials ?? []) })
      .catch(() => {})
      .finally(() => setLoadingMaterials(false))
  }, [isOpen, inquiry.id, materials.length])

  // Fetch proof images when modal opens
  useEffect(() => {
    if (!isOpen) return
    setLoadingProofs(true)
    fetch(`/api/admin/accounting/payment-proof?inquiryId=${encodeURIComponent(inquiry.id)}`)
      .then(r => r.json())
      .then((data: { proofs?: ProofRow[] }) => { setProofs(data.proofs ?? []) })
      .catch(() => {})
      .finally(() => setLoadingProofs(false))
  }, [isOpen, inquiry.id])

  function handleClose() {
    setIsOpen(false)
    setShowRejectConfirm(false)
    setRejectReason("")
  }

  return (
    <>
      <article className="rounded-xl border border-[#eef2f7] bg-[#fbfcfd] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">
              Payment review{inquiry.inquiryNumber ? ` · ${inquiry.inquiryNumber}` : ""}
            </p>
            <h3 className="mt-1 text-[20px] font-semibold text-[#111827]">{inquiry.productName}</h3>
            <p className="mt-2 text-[13px] text-[#6b7280]">
              {inquiry.customerName} · {inquiry.customerEmail} · {inquiry.customerPhone}
            </p>
            <p className="mt-3 max-w-[720px] text-[14px] leading-[22px] text-[#1f2937]">{inquiry.message}</p>
            {inquiry.workflowNote && (
              <p className="mt-3 rounded-xl bg-white px-4 py-3 text-[13px] text-[#4b5563]">
                Latest note: {inquiry.workflowNote}
              </p>
            )}
          </div>
          <div className="flex flex-col items-start gap-3 text-[12px] text-[#6b7280] lg:items-end">
            <WorkflowBadge status={inquiry.workflowStatus} />
            <PaymentStatusBadge status={inquiry.paymentStatus} />
            <div>
              <p>Created {new Date(inquiry.createdAt).toLocaleDateString()}</p>
              <p className="mt-1">Updated {new Date(inquiry.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Pricing summary on card */}
        <div className="mt-5 grid gap-3 border-t border-[#e5e7eb] pt-4 sm:grid-cols-2 xl:grid-cols-6 text-[13px]">
          {hasDiscount && (
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Original price</p>
              <p className="mt-1 font-semibold text-[#6b7280] line-through">{formatPeso(priceBeforeDiscount!)}</p>
            </div>
          )}
          {hasDiscount && (
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Discount ({discountPct}%)</p>
              <p className="mt-1 font-semibold text-[#16a34a]">- {formatPeso(discountAmount)}</p>
            </div>
          )}
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">
              {hasDiscount ? "Price after discount" : "Product price"}
            </p>
            <p className="mt-1 font-semibold text-[#111827]">{formatPeso(basePrice)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">VAT (12%)</p>
            <p className="mt-1 font-semibold text-[#111827]">{formatPeso(vatAmount)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Total (VAT incl.)</p>
            <p className="mt-1 font-semibold text-[#111827]">{formatPeso(totalWithVat)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Down payment required</p>
            <p className="mt-1 font-semibold text-[#111827]">{formatPeso(downPaymentRequired)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Paid</p>
            <p className="mt-1 font-semibold text-[#111827]">{formatPeso(inquiry.paid)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Remaining balance</p>
            <p className="mt-1 font-semibold text-[#111827]">{formatPeso(inquiry.remainingBalance)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Payment status</p>
            <div className="mt-1"><PaymentStatusBadge status={inquiry.paymentStatus} /></div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e7eb] pt-4">
          {customerHasPaid ? (
            <div className="rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#166534]">Customer payment submitted</p>
              <p className="mt-1 text-[13px] text-[#15803d]">
                Method: {submittedMethod ? formatAccountingPaymentMethod(submittedMethod) : "—"}
                {inquiry.customerPaidNote ? ` — ${inquiry.customerPaidNote}` : ""}
              </p>
            </div>
          ) : (
            <p className="text-[13px] text-[#6b7280]">Waiting for customer to submit payment details.</p>
          )}
          <button type="button" onClick={() => setIsOpen(true)} disabled={!customerHasPaid}
            className="rounded-[12px] bg-[#111827] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90 disabled:cursor-not-allowed disabled:bg-[#9ca3af]">
            {customerHasPaid ? "Confirm payment" : "Awaiting customer payment"}
          </button>
        </div>
      </article>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/55 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Accounting approval</p>
                <h4 className="mt-2 text-[26px] font-semibold text-[#111827]">{inquiry.productName}</h4>
                {inquiry.inquiryNumber && <p className="mt-1 font-mono text-[12px] text-[#94a3b8]">{inquiry.inquiryNumber}</p>}
                <p className="mt-2 text-[14px] text-[#6b7280]">Review the order details and customer payment before confirming.</p>
              </div>
              <button type="button" onClick={handleClose}
                className="rounded-full border border-[#d1d5dc] px-3 py-2 text-[12px] font-medium text-[#4b5563] transition-colors hover:bg-[#f9fafb]">
                Close
              </button>
            </div>

            {/* Customer + timeline */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[20px] bg-[#f8fafc] p-5">
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Customer details</p>
                <div className="mt-3 space-y-1 text-[14px] text-[#111827]">
                  <p className="font-semibold">{inquiry.customerName}</p>
                  <p className="text-[#6b7280]">{inquiry.customerEmail}</p>
                  <p className="text-[#6b7280]">{inquiry.customerPhone}</p>
                </div>
              </div>
              <div className="rounded-[20px] bg-[#f8fafc] p-5">
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Order status</p>
                <div className="mt-3 space-y-2">
                  <WorkflowBadge status={inquiry.workflowStatus} />
                  <p className="text-[13px] text-[#6b7280]">Created {new Date(inquiry.createdAt).toLocaleDateString()}</p>
                  <p className="text-[13px] text-[#6b7280]">Updated {new Date(inquiry.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Customer inquiry message */}
            <div className="mt-4 rounded-[20px] bg-[#f8fafc] p-5">
              <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Customer inquiry</p>
              <p className="mt-3 text-[14px] leading-[24px] text-[#111827]">{inquiry.message}</p>
            </div>

            {/* Product + Bill of Materials */}
            <div className="mt-4 rounded-[20px] border border-[#e5e7eb] bg-white p-5">
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#99a1af]">Product &amp; Bill of Materials</p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#e5e7eb] text-[11px] uppercase tracking-wide text-[#6b7280]">
                      <th className="py-2 pr-4 font-medium">Item</th>
                      <th className="py-2 pr-4 font-medium">SKU</th>
                      <th className="py-2 pr-4 font-medium">Qty / Spec</th>
                      <th className="py-2 font-medium">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#e5e7eb] bg-[#f8fafc]">
                      <td className="py-2.5 pr-4"><p className="font-semibold text-[#111827]">{inquiry.productName}</p><p className="text-[11px] text-[#94a3b8]">Finished product</p></td>
                      <td className="py-2.5 pr-4 font-mono text-[#6b7280]">—</td>
                      <td className="py-2.5 pr-4 text-[#374151]">1</td>
                      <td className="py-2.5 text-[#374151]">pcs</td>
                    </tr>
                    {loadingMaterials && (
                      <tr><td colSpan={4} className="py-3 text-center text-[12px] text-[#94a3b8]">Loading materials…</td></tr>
                    )}
                    {!loadingMaterials && materials.length === 0 && (
                      <tr><td colSpan={4} className="py-3 text-[12px] text-[#94a3b8]">No bill of materials defined.</td></tr>
                    )}
                    {materials.map((mat, i) => (
                      <tr key={i} className="border-b border-[#f3f4f6] last:border-b-0">
                        <td className="py-2 pr-4 text-[#374151]">{mat.itemName}</td>
                        <td className="py-2 pr-4 font-mono text-[12px] text-[#6b7280]">{mat.sku}</td>
                        <td className="py-2 pr-4 text-[#374151]">{mat.quantityDisplay ?? "—"}</td>
                        <td className="py-2 text-[#374151]">{mat.unitOfMeasure}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Final quotation pricing */}
            <div className="mt-4 rounded-[20px] border border-[#e5e7eb] bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#99a1af]">Final quotation &amp; pricing</p>
                {inquiry.quotedPrice != null && (
                  <span className="rounded-full bg-[#f0fdf4] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#166534]">Quotation accepted</span>
                )}
              </div>
              <div className="space-y-2 text-[13px]">
                {hasDiscount ? (
                  <>
                    <div className="flex justify-between text-[#6b7280]"><span>Original price</span><span>{formatPeso(priceBeforeDiscount!)}</span></div>
                    <div className="flex justify-between font-medium text-[#16a34a]"><span>Discount ({discountPct}%)</span><span>- {formatPeso(discountAmount)}</span></div>
                    <div className="flex justify-between text-[#374151]"><span>Price after discount</span><span>{formatPeso(basePrice)}</span></div>
                  </>
                ) : (
                  <div className="flex justify-between text-[#374151]"><span>{inquiry.quotedPrice != null ? "Quoted price" : "Catalog price"}</span><span>{formatPeso(basePrice)}</span></div>
                )}
                <div className="flex justify-between text-[#374151]"><span>VAT (12%)</span><span>{formatPeso(vatAmount)}</span></div>
                <div className="flex justify-between border-t border-[#e5e7eb] pt-2 text-[15px] font-semibold text-[#111827]"><span>Total (VAT inclusive)</span><span>{formatPeso(totalWithVat)}</span></div>
              </div>
              <div className="mt-3 grid gap-2 rounded-[12px] bg-[#f8fafc] p-3 sm:grid-cols-3 text-[12px]">
                <div><p className="text-[#94a3b8] uppercase tracking-wide">Down payment (70%)</p><p className="mt-0.5 font-semibold text-[#111827]">{formatPeso(downPaymentRequired)}</p></div>
                <div><p className="text-[#94a3b8] uppercase tracking-wide">Balance (30%)</p><p className="mt-0.5 font-semibold text-[#111827]">{formatPeso(totalWithVat * 0.3)}</p></div>
                <div><p className="text-[#94a3b8] uppercase tracking-wide">Paid so far</p><p className="mt-0.5 font-semibold text-[#111827]">{formatPeso(inquiry.paid)}</p></div>
              </div>
            </div>

            {/* Customer payment details */}
            {customerHasPaid ? (
              <div className="mt-4 rounded-[20px] border border-[#bbf7d0] bg-[#f0fdf4] p-5">
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#166534]">Customer payment details</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#15803d]">Payment method</p>
                    <p className="mt-1 text-[15px] font-semibold text-[#111827]">{submittedMethod ? formatAccountingPaymentMethod(submittedMethod) : "—"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#15803d]">Payment type</p>
                    <p className="mt-1 text-[15px] font-semibold text-[#111827]">{derivedPaymentType === "FULL_PAYMENT" ? "Full payment" : "Down payment"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#15803d]">Amount paid</p>
                    <p className="mt-1 text-[15px] font-semibold text-[#111827]">{formatPeso(submittedAmount)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#15803d]">Remaining balance</p>
                    <p className="mt-1 text-[15px] font-semibold text-[#111827]">{formatPeso(submittedRemaining)}</p>
                  </div>
                </div>
                {inquiry.customerPaidNote && (
                  <div className="mt-4 border-t border-[#bbf7d0] pt-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#15803d]">Customer note</p>
                    <p className="mt-1 text-[13px] leading-[20px] text-[#374151]">{inquiry.customerPaidNote}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 rounded-[20px] border border-[#fef9c3] bg-[#fffbeb] p-5">
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#a16207]">Awaiting customer payment</p>
                <p className="mt-2 text-[13px] text-[#92400e]">The customer has not submitted their payment details yet.</p>
              </div>
            )}

            {inquiry.workflowNote && (
              <div className="mt-4 rounded-[20px] bg-[#fffaf0] p-5">
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#c2410c]">Latest internal note</p>
                <p className="mt-3 text-[14px] leading-[24px] text-[#7c2d12]">{inquiry.workflowNote}</p>
              </div>
            )}

            {/* ── Proof of payment images ── */}
            <div className="mt-4 rounded-[20px] border border-[#e5e7eb] bg-white p-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#99a1af]">
                  Proof of payment
                </p>
                {proofs.length > 0 && (
                  <span className="rounded-full bg-[#f0fdf4] px-2.5 py-0.5 text-[11px] font-semibold text-[#166534]">
                    {proofs.length} image{proofs.length > 1 ? "s" : ""} attached
                  </span>
                )}
              </div>

              {loadingProofs ? (
                <div className="flex items-center gap-2 py-4 text-[13px] text-[#94a3b8]">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Loading proof images…
                </div>
              ) : proofs.length === 0 ? (
                <div className="rounded-[14px] border border-dashed border-[#e5e7eb] bg-[#f9fafb] px-4 py-6 text-center">
                  <p className="text-[13px] text-[#94a3b8]">No proof of payment uploaded by customer.</p>
                  <p className="mt-1 text-[12px] text-[#cbd5e1]">Customer may not have attached a screenshot.</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {proofs.map((proof) => (
                    <div key={proof.id} className="group relative overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-[#f8fafc]">
                      <button
                        type="button"
                        onClick={() => setLightboxSrc(proof.dataUrl)}
                        className="block w-full"
                      >
                        <img
                          src={proof.dataUrl}
                          alt={proof.fileName}
                          className="h-[160px] w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-[#111827]/0 transition-colors group-hover:bg-[#111827]/20">
                          <span className="rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#111827] opacity-0 transition-opacity group-hover:opacity-100">
                            Click to enlarge
                          </span>
                        </div>
                      </button>
                      <div className="border-t border-[#e5e7eb] px-3 py-2">
                        <p className="truncate text-[11px] font-medium text-[#374151]">{proof.fileName}</p>
                        <p className="text-[10px] text-[#94a3b8]">
                          {proof.senderName ?? "Customer"} · {new Date(proof.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Approval form */}
            <form method="post" action="/api/admin/approvals/accounting" className="mt-6 space-y-4">
              <input type="hidden" name="inquiryId" value={inquiry.id} />
              <input type="hidden" name="paymentMethod" value={submittedMethod ?? ""} />
              <input type="hidden" name="paidAmount" value={submittedAmount.toFixed(2)} />
              <label className="grid gap-2">
                <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                  Accounting approval note <span className="normal-case tracking-normal text-[#9ca3af]">(optional)</span>
                </span>
                <textarea name="statusNote" defaultValue="" placeholder="e.g. confirmed funds received."
                  rows={3} className="w-full rounded-[14px] border border-[#d1d5dc] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-colors focus:border-[#111827]" />
              </label>

              {showRejectConfirm ? (
                <div className="rounded-[16px] border border-[#fecaca] bg-[#fff8f8] px-5 py-5 space-y-4">
                  <div>
                    <p className="text-[13px] font-bold text-[#b91c1c]">⚠ Confirm payment rejection</p>
                    <p className="mt-1 text-[13px] text-[#7f1d1d]">Rejecting will notify the customer and return the order to accounting review.</p>
                  </div>
                  <label className="grid gap-2">
                    <span className="text-[12px] font-medium uppercase tracking-wide text-[#b91c1c]">Reason for rejection <span className="font-normal text-[#ef4444]">*</span></span>
                    <textarea name="statusNote" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g. Payment reference not found." rows={3} required
                      className="w-full rounded-[14px] border border-[#fca5a5] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-colors focus:border-[#b91c1c]" />
                  </label>
                  <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button type="button" onClick={() => { setShowRejectConfirm(false); setRejectReason("") }}
                      className="rounded-[14px] border border-[#d1d5dc] px-5 py-2.5 text-[14px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]">Go back</button>
                    <button type="submit" name="paymentStatus" value="REJECTED" disabled={!rejectReason.trim()}
                      className="rounded-[14px] bg-[#b91c1c] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#991b1b] disabled:cursor-not-allowed disabled:opacity-50">
                      Yes, reject this payment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col-reverse gap-3 border-t border-[#e5e7eb] pt-4 sm:flex-row sm:justify-end">
                  <button type="button" onClick={handleClose}
                    className="rounded-[14px] border border-[#d1d5dc] px-5 py-3 text-[14px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]">Cancel</button>
                  <button type="button" disabled={!customerHasPaid} onClick={() => setShowRejectConfirm(true)}
                    className="rounded-[14px] border border-[#fecaca] bg-white px-5 py-3 text-[14px] font-medium text-[#b91c1c] transition-colors hover:bg-[#fff1f2] disabled:cursor-not-allowed disabled:opacity-50">
                    Reject payment
                  </button>
                  <button type="submit" name="paymentStatus" value={derivedPaymentStatus} disabled={!customerHasPaid}
                    className="rounded-[14px] bg-[#111827] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#111827]/90 disabled:cursor-not-allowed disabled:bg-[#9ca3af]">
                    Confirm payment and release order
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#111827]/90 px-4 py-8"
          onClick={() => setLightboxSrc(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxSrc}
              alt="Payment proof"
              className="max-h-[85vh] max-w-[85vw] rounded-[16px] object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setLightboxSrc(null)}
              className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#111827] shadow-lg hover:bg-[#f9fafb]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            <p className="mt-3 text-center text-[12px] text-white/60">Click outside to close</p>
          </div>
        </div>
      )}
    </>
  )
}
