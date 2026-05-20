"use client"

import { useState } from "react"
import { formatInquiryWorkflowStatus, getInquiryWorkflowStyle } from "@furnitrack/validators"
import type { InquiryPaymentStatus, InquiryWorkflowRow } from "@/lib/inquiries"
import { formatAccountingPaymentMethod } from "@/lib/accounting-payment-methods"

function WorkflowBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] ${getInquiryWorkflowStyle(status)}`}
    >
      {formatInquiryWorkflowStatus(status)}
    </span>
  )
}

function formatPeso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(value)
}

function PaymentStatusBadge({ status }: { status: InquiryPaymentStatus }) {
  const label = status
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ")

  const tone =
    status === "FULLY_PAID"
      ? "bg-[#dcfce7] text-[#166534]"
      : status === "REJECTED"
        ? "bg-[#ffe4e6] text-[#be123c]"
        : status === "PENDING"
          ? "bg-[#fef3c7] text-[#92400e]"
          : "bg-[#dbeafe] text-[#1d4ed8]"

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${tone}`}>
      {label}
    </span>
  )
}

export function PaymentApprovalCard({ inquiry }: { inquiry: InquiryWorkflowRow }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showRejectConfirm, setShowRejectConfirm] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  // The customer's submitted payment is the source of truth. Accounting only
  // confirms or rejects — they do not edit the method or status.
  const customerHasPaid = !!inquiry.customerPaidMethod
  const submittedMethod = inquiry.latestPaymentMethod ?? inquiry.customerPaidMethod
  const submittedAmount = inquiry.latestPaymentAmount ?? inquiry.paid
  const submittedRemaining =
    inquiry.latestPaymentRemaining != null
      ? inquiry.latestPaymentRemaining
      : Math.max(inquiry.total - submittedAmount, 0)
  // Derive the payment type from the actual amount submitted
  const derivedPaymentType: "FULL_PAYMENT" | "DOWN_PAYMENT" =
    submittedAmount >= inquiry.total ? "FULL_PAYMENT" : "DOWN_PAYMENT"
  const derivedPaymentStatus: InquiryPaymentStatus =
    derivedPaymentType === "FULL_PAYMENT" ? "FULLY_PAID" : "DOWN_PAYMENT"

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
              {inquiry.customerName} - {inquiry.customerEmail} - {inquiry.customerPhone}
            </p>
            <p className="mt-3 max-w-[720px] text-[14px] leading-[22px] text-[#1f2937]">{inquiry.message}</p>
            {inquiry.workflowNote ? (
              <p className="mt-3 rounded-xl bg-white px-4 py-3 text-[13px] text-[#4b5563]">
                Latest note: {inquiry.workflowNote}
              </p>
            ) : null}
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

        <div className="mt-5 grid gap-3 border-t border-[#e5e7eb] pt-4 sm:grid-cols-2 xl:grid-cols-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Total</p>
            <p className="mt-1 text-[14px] font-semibold text-[#111827]">{formatPeso(inquiry.total)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Down payment required</p>
            <p className="mt-1 text-[14px] font-semibold text-[#111827]">{formatPeso(inquiry.downPaymentRequired)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Paid</p>
            <p className="mt-1 text-[14px] font-semibold text-[#111827]">{formatPeso(inquiry.paid)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Remaining balance</p>
            <p className="mt-1 text-[14px] font-semibold text-[#111827]">{formatPeso(inquiry.remainingBalance)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Payment status</p>
            <div className="mt-1">
              <PaymentStatusBadge status={inquiry.paymentStatus} />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e7eb] pt-4">
          {customerHasPaid ? (
            <div className="rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#166534]">
                Customer payment submitted
              </p>
              <p className="mt-1 text-[13px] text-[#15803d]">
                Method: {submittedMethod ? formatAccountingPaymentMethod(submittedMethod) : "—"}
                {inquiry.customerPaidNote ? ` — ${inquiry.customerPaidNote}` : ""}
              </p>
            </div>
          ) : (
            <p className="text-[13px] text-[#6b7280]">
              Waiting for customer to submit payment details.
            </p>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            disabled={!customerHasPaid}
            className="rounded-[12px] bg-[#111827] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90 disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
          >
            {customerHasPaid ? "Confirm payment" : "Awaiting customer payment"}
          </button>
        </div>
      </article>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/55 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Accounting approval</p>
                <h4 className="mt-2 text-[26px] font-semibold text-[#111827]">{inquiry.productName}</h4>
                <p className="mt-2 text-[14px] text-[#6b7280]">
                  Review the customer&apos;s submitted payment and confirm to release the order to operations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setIsOpen(false); setShowRejectConfirm(false); setRejectReason("") }}
                className="rounded-full border border-[#d1d5dc] px-3 py-2 text-[12px] font-medium text-[#4b5563] transition-colors hover:bg-[#f9fafb]"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[20px] bg-[#f8fafc] p-5">
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Customer details</p>
                <div className="mt-4 space-y-2 text-[14px] text-[#111827]">
                  <p>{inquiry.customerName}</p>
                  <p>{inquiry.customerEmail}</p>
                  <p>{inquiry.customerPhone}</p>
                </div>
              </div>
              <div className="rounded-[20px] bg-[#f8fafc] p-5">
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Order timeline</p>
                <div className="mt-4 space-y-2 text-[14px] text-[#111827]">
                  <p>Status: {formatInquiryWorkflowStatus(inquiry.workflowStatus)}</p>
                  <p>Created: {new Date(inquiry.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(inquiry.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[20px] bg-[#f8fafc] p-5">
              <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Order request</p>
              <p className="mt-3 text-[14px] leading-[24px] text-[#111827]">{inquiry.message}</p>
            </div>

            {inquiry.workflowNote ? (
              <div className="mt-4 rounded-[20px] bg-[#fffaf0] p-5">
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#c2410c]">Latest internal note</p>
                <p className="mt-3 text-[14px] leading-[24px] text-[#7c2d12]">{inquiry.workflowNote}</p>
              </div>
            ) : null}

            {/* Customer payment summary — read-only */}
            {customerHasPaid ? (
              <div className="mt-4 rounded-[20px] border border-[#bbf7d0] bg-[#f0fdf4] p-5">
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#166534]">
                  Customer payment details
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#15803d]">
                      Payment method
                    </p>
                    <p className="mt-1 text-[15px] font-semibold text-[#111827]">
                      {submittedMethod ? formatAccountingPaymentMethod(submittedMethod) : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#15803d]">
                      Payment type
                    </p>
                    <p className="mt-1 text-[15px] font-semibold text-[#111827]">
                      {derivedPaymentType === "FULL_PAYMENT" ? "Full payment" : "Down payment"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#15803d]">
                      Amount paid
                    </p>
                    <p className="mt-1 text-[15px] font-semibold text-[#111827]">
                      {formatPeso(submittedAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#15803d]">
                      Remaining balance
                    </p>
                    <p className="mt-1 text-[15px] font-semibold text-[#111827]">
                      {formatPeso(submittedRemaining)}
                    </p>
                  </div>
                </div>
                {inquiry.customerPaidNote ? (
                  <div className="mt-4 border-t border-[#bbf7d0] pt-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#15803d]">
                      Customer note
                    </p>
                    <p className="mt-1 text-[13px] leading-[20px] text-[#374151]">
                      {inquiry.customerPaidNote}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="mt-4 rounded-[20px] border border-[#fef9c3] bg-[#fffbeb] p-5">
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#a16207]">
                  Awaiting customer payment
                </p>
                <p className="mt-2 text-[13px] text-[#92400e]">
                  The customer has not submitted their payment details yet. You cannot confirm
                  payment until they do.
                </p>
              </div>
            )}

            {/* Accounting note + actions */}
            <form method="post" action="/api/admin/approvals/accounting" className="mt-6 space-y-4">
              <input type="hidden" name="inquiryId" value={inquiry.id} />
              {/* These echo the customer-submitted values so the API has them
                  for backward compatibility, but accounting cannot edit them. */}
              <input type="hidden" name="paymentMethod" value={submittedMethod ?? ""} />
              <input type="hidden" name="paidAmount" value={submittedAmount.toFixed(2)} />

              <label className="grid gap-2">
                <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                  Accounting approval note <span className="normal-case tracking-normal text-[#9ca3af]">(optional)</span>
                </span>
                <textarea
                  name="statusNote"
                  defaultValue=""
                  placeholder="Add an internal note for this approval (e.g. confirmed funds received)."
                  rows={3}
                  className="w-full rounded-[14px] border border-[#d1d5dc] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                />
              </label>

              {/* ── Reject confirmation step ── */}
              {showRejectConfirm ? (
                <div className="rounded-[16px] border border-[#fecaca] bg-[#fff8f8] px-5 py-5 space-y-4">
                  <div>
                    <p className="text-[13px] font-bold text-[#b91c1c]">⚠ Confirm payment rejection</p>
                    <p className="mt-1 text-[13px] text-[#7f1d1d]">
                      Rejecting this payment will notify the customer and return the order to accounting review.
                      This action cannot be undone without the customer re-submitting their payment.
                    </p>
                  </div>
                  <label className="grid gap-2">
                    <span className="text-[12px] font-medium uppercase tracking-wide text-[#b91c1c]">
                      Reason for rejection <span className="font-normal text-[#ef4444]">*</span>
                    </span>
                    <textarea
                      name="statusNote"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g. Payment reference not found. Please re-submit with a valid transaction ID."
                      rows={3}
                      required
                      className="w-full rounded-[14px] border border-[#fca5a5] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-colors focus:border-[#b91c1c]"
                    />
                  </label>
                  <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => { setShowRejectConfirm(false); setRejectReason("") }}
                      className="rounded-[14px] border border-[#d1d5dc] px-5 py-2.5 text-[14px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]"
                    >
                      Go back
                    </button>
                    <button
                      type="submit"
                      name="paymentStatus"
                      value="REJECTED"
                      disabled={!rejectReason.trim()}
                      className="rounded-[14px] bg-[#b91c1c] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#991b1b] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Yes, reject this payment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col-reverse gap-3 border-t border-[#e5e7eb] pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-[14px] border border-[#d1d5dc] px-5 py-3 text-[14px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!customerHasPaid}
                    onClick={() => setShowRejectConfirm(true)}
                    className="rounded-[14px] border border-[#fecaca] bg-white px-5 py-3 text-[14px] font-medium text-[#b91c1c] transition-colors hover:bg-[#fff1f2] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Reject payment
                  </button>
                  <button
                    type="submit"
                    name="paymentStatus"
                    value={derivedPaymentStatus}
                    disabled={!customerHasPaid}
                    className="rounded-[14px] bg-[#111827] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#111827]/90 disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
                  >
                    Confirm payment and release order
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
