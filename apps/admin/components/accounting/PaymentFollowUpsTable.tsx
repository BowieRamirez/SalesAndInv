"use client"

import { useMemo, useState } from "react"
import type { InquiryWorkflowRow } from "@/lib/inquiries"
import { formatAccountingPaymentMethod } from "@/lib/accounting-payment-methods"

function formatPeso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(value)
}

function formatPaymentStatus(status: InquiryWorkflowRow["paymentStatus"]) {
  return status
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ")
}

export function PaymentFollowUpsTable({ rows }: { rows: InquiryWorkflowRow[] }) {
  const [query, setQuery] = useState("")

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return rows.filter((row) =>
      !normalizedQuery ||
      [row.productName, row.customerName, row.customerEmail, row.customerPhone].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    )
  }, [query, rows])

  return (
    <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-[20px] font-semibold text-[#111827]">Payment Follow-ups</h2>
          <p className="mt-2 max-w-[720px] text-[14px] leading-[22px] text-[#6b7280]">
            Orders with an outstanding balance. Once the customer submits their remaining balance payment,
            confirm it here to clear the balance.
          </p>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search customer, product, email, phone"
          className="w-full rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827] md:w-[360px]"
        />
      </div>

      <div className="space-y-4">
        {filteredRows.map((row) => {
          // A pending payment_records row means the customer has submitted their balance
          const customerSubmitted = row.latestPaymentStatus === "PENDING" && row.latestPaymentAmount !== null
          const submittedAmount = row.latestPaymentAmount ?? 0
          const submittedMethod = row.latestPaymentMethod

          return (
            <article key={row.id} className="rounded-2xl border border-[#eef2f7] bg-[#fbfcfd] p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">
                    Payment follow-up{row.inquiryNumber ? ` · ${row.inquiryNumber}` : ""}
                  </p>
                  <h3 className="mt-1 text-[20px] font-semibold text-[#111827]">{row.productName}</h3>
                  <p className="mt-2 text-[13px] text-[#6b7280]">
                    {row.customerName} — {row.customerEmail} — {row.customerPhone}
                  </p>
                </div>
                <span className="inline-flex w-fit rounded-full bg-[#dbeafe] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8]">
                  {formatPaymentStatus(row.paymentStatus)}
                </span>
              </div>

              {/* Payment summary grid */}
              <div className="mt-5 grid gap-3 border-t border-[#e5e7eb] pt-4 sm:grid-cols-2 xl:grid-cols-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Total</p>
                  <p className="mt-1 text-[14px] font-semibold text-[#111827]">{formatPeso(row.total)}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Down payment required</p>
                  <p className="mt-1 text-[14px] font-semibold text-[#111827]">{formatPeso(row.downPaymentRequired)}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Paid</p>
                  <p className="mt-1 text-[14px] font-semibold text-[#111827]">{formatPeso(row.paid)}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Remaining balance</p>
                  <p className="mt-1 text-[14px] font-semibold text-[#111827]">{formatPeso(row.remainingBalance)}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Updated</p>
                  <p className="mt-1 text-[14px] font-semibold text-[#111827]">{new Date(row.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Customer balance payment status */}
              {customerSubmitted ? (
                <div className="mt-5 rounded-[14px] border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#166534]">
                    Customer balance payment submitted
                  </p>
                  <p className="mt-1 text-[13px] text-[#15803d]">
                    {formatPeso(submittedAmount)} via{" "}
                    {submittedMethod ? formatAccountingPaymentMethod(submittedMethod) : "—"}
                    {row.paymentNumber ? ` · ${row.paymentNumber}` : ""}
                  </p>
                </div>
              ) : (
                <div className="mt-5 rounded-[14px] border border-[#fef9c3] bg-[#fffbeb] px-4 py-3">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a16207]">
                    Awaiting customer payment
                  </p>
                  <p className="mt-1 text-[13px] text-[#92400e]">
                    The customer has not yet submitted their remaining balance via the storefront.
                  </p>
                </div>
              )}

              {/* Confirm action — only available when customer has submitted */}
              <form
                method="post"
                action="/api/admin/approvals/accounting/follow-up"
                className="mt-4 flex flex-col gap-3 border-t border-[#e5e7eb] pt-4 sm:flex-row sm:items-end sm:justify-end"
              >
                <input type="hidden" name="inquiryId" value={row.id} />
                <input type="hidden" name="paidAmount" value={row.total.toFixed(2)} />
                <label className="grid w-full gap-2 sm:max-w-[360px]">
                  <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                    Confirmation note{" "}
                    <span className="normal-case tracking-normal text-[#9ca3af]">(optional)</span>
                  </span>
                  <input
                    name="statusNote"
                    placeholder="Balance received and confirmed."
                    className="w-full rounded-[14px] border border-[#d1d5dc] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                  />
                </label>
                <button
                  type="submit"
                  disabled={!customerSubmitted}
                  className="shrink-0 rounded-[14px] bg-[#111827] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#111827]/90 disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
                  title={!customerSubmitted ? "Waiting for customer to submit balance payment" : undefined}
                >
                  Confirm balance received
                </button>
              </form>
            </article>
          )
        })}

        {filteredRows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#d1d5db] bg-white p-10 text-center text-[13px] text-[#6b7280]">
            No down-payment or partially paid orders found.
          </div>
        ) : null}
      </div>
    </section>
  )
}
