"use client"

import { useState } from "react"
import { formatInquiryWorkflowStatus, getInquiryWorkflowStyle } from "@furnitrack/validators"
import type { InquiryPaymentStatus, InquiryWorkflowRow } from "@/lib/inquiries"
import {
  ACCOUNTING_PAYMENT_METHODS,
  type AccountingPaymentMethod,
} from "@/lib/accounting-payment-methods"

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
  const [paymentMethod, setPaymentMethod] = useState<AccountingPaymentMethod>("BANK_TRANSFER")
  const [paymentStatus, setPaymentStatus] = useState<InquiryPaymentStatus>("FULLY_PAID")
  const [paidAmount, setPaidAmount] = useState(() => inquiry.total.toFixed(2))
  const requiresPaidAmount = paymentStatus === "DOWN_PAYMENT" || paymentStatus === "PARTIALLY_PAID"

  return (
    <>
      <article className="rounded-xl border border-[#eef2f7] bg-[#fbfcfd] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Payment review</p>
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
          <p className="text-[13px] text-[#6b7280]">
            Review the order details, choose the customer's payment method, then confirm the next stage.
          </p>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="rounded-[12px] bg-[#111827] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90"
          >
            Review and approve
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
                  Confirm the payment details before releasing this order to operations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
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

            <form method="post" action="/api/admin/approvals/accounting" className="mt-6 space-y-4">
              <input type="hidden" name="inquiryId" value={inquiry.id} />
              <input type="hidden" name="paymentMethod" value={paymentMethod} />
              <input type="hidden" name="paymentStatus" value={paymentStatus} />

              <label className="grid gap-2">
                <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                  Customer payment method
                </span>
                <select
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value as AccountingPaymentMethod)}
                  className="w-full rounded-[14px] border border-[#d1d5dc] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                >
                  {ACCOUNTING_PAYMENT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                  Payment status
                </span>
                <select
                  value={paymentStatus}
                  onChange={(event) => {
                    const nextPaymentStatus = event.target.value as InquiryPaymentStatus
                    setPaymentStatus(nextPaymentStatus)
                    if (nextPaymentStatus === "DOWN_PAYMENT") {
                      setPaidAmount(inquiry.downPaymentRequired.toFixed(2))
                    } else if (nextPaymentStatus === "PARTIALLY_PAID") {
                      setPaidAmount(Math.max(inquiry.paid, inquiry.downPaymentRequired).toFixed(2))
                    } else if (nextPaymentStatus === "FULLY_PAID") {
                      setPaidAmount(inquiry.total.toFixed(2))
                    }
                  }}
                  className="w-full rounded-[14px] border border-[#d1d5dc] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                >
                  <option value="DOWN_PAYMENT">Down Payment</option>
                  <option value="PARTIALLY_PAID">Partially Paid</option>
                  <option value="FULLY_PAID">Fully Paid</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </label>

              {requiresPaidAmount ? (
                <label className="grid gap-2">
                  <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                    Customer paid amount
                  </span>
                  <input
                    type="number"
                    name="paidAmount"
                    value={paidAmount}
                    onChange={(event) => setPaidAmount(event.target.value)}
                    min="0"
                    max={inquiry.total}
                    step="0.01"
                    required
                    className="w-full rounded-[14px] border border-[#d1d5dc] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                  />
                  <span className="text-[12px] text-[#6b7280]">
                    Remaining balance will be computed from the order total.
                  </span>
                </label>
              ) : (
                <input type="hidden" name="paidAmount" value={paymentStatus === "FULLY_PAID" ? inquiry.total.toFixed(2) : "0"} />
              )}

              <label className="grid gap-2">
                <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                  Accounting approval note
                </span>
                <textarea
                  name="statusNote"
                  defaultValue={inquiry.workflowNote ?? ""}
                  placeholder="Confirm payment before operations starts building."
                  rows={4}
                  className="w-full rounded-[14px] border border-[#d1d5dc] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                />
              </label>

              <div className="flex flex-col-reverse gap-3 border-t border-[#e5e7eb] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-[14px] border border-[#d1d5dc] px-5 py-3 text-[14px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-[14px] bg-[#111827] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#111827]/90"
                >
                  Confirm payment and release order
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
