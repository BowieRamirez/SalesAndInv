"use client"

import { useMemo, useState } from "react"
import type { InquiryWorkflowRow } from "@/lib/inquiries"

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
            Track down-payment and partially paid orders. Once the customer fully pays, update the paid amount to the total so Operations can ship the order.
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
        {filteredRows.map((row) => (
          <article key={row.id} className="rounded-2xl border border-[#eef2f7] bg-[#fbfcfd] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Payment follow-up</p>
                <h3 className="mt-1 text-[20px] font-semibold text-[#111827]">{row.productName}</h3>
                <p className="mt-2 text-[13px] text-[#6b7280]">
                  {row.customerName} - {row.customerEmail} - {row.customerPhone}
                </p>
              </div>
              <span className="inline-flex w-fit rounded-full bg-[#dbeafe] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8]">
                {formatPaymentStatus(row.paymentStatus)}
              </span>
            </div>

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

            <form method="post" action="/api/admin/approvals/accounting/follow-up" className="mt-5 grid gap-3 border-t border-[#e5e7eb] pt-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
              <input type="hidden" name="inquiryId" value={row.id} />
              <label className="grid gap-2">
                <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Total amount collected</span>
                <input
                  type="number"
                  name="paidAmount"
                  defaultValue={row.total.toFixed(2)}
                  min="0"
                  max={row.total}
                  step="0.01"
                  required
                  className="w-full rounded-[14px] border border-[#d1d5dc] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Follow-up note</span>
                <input
                  name="statusNote"
                  defaultValue={row.workflowNote ?? ""}
                  placeholder="Customer completed payment."
                  className="w-full rounded-[14px] border border-[#d1d5dc] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                />
              </label>
              <button
                type="submit"
                className="rounded-[14px] bg-[#111827] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#111827]/90"
              >
                Update payment
              </button>
            </form>
          </article>
        ))}

        {filteredRows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#d1d5db] bg-white p-10 text-center text-[13px] text-[#6b7280]">
            No down-payment or partially paid orders found.
          </div>
        ) : null}
      </div>
    </section>
  )
}
