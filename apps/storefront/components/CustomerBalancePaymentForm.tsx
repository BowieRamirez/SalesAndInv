"use client"

import { useState } from "react"
import { CreditCard, Loader2 } from "lucide-react"

const PAYMENT_METHODS = [
  { value: "GCASH", label: "GCash" },
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Card" },
] as const

type PaymentMethodValue = (typeof PAYMENT_METHODS)[number]["value"]

type GCashFields = { gcashNumber: string; amountPaid: string; transactionDate: string }
type CashFields = { amountTendered: string; datePaid: string }
type CardFields = { cardNumber: string; cardholderName: string; expiryMonth: string; expiryYear: string; cvv: string; cardType: string }

const inputClass = "w-full rounded-[14px] border border-[#d1d5dc] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-colors focus:border-[#111827]"

function formatPeso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(value)
}

function formatMethod(method: string) {
  return method.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

function today() {
  return new Date().toISOString().split("T")[0] as string
}

function buildNote(method: PaymentMethodValue, fields: Record<string, string>): string {
  switch (method) {
    case "GCASH":
      return [
        fields.gcashNumber && `GCash #: ${fields.gcashNumber}`,
        fields.amountPaid && `Amount: ₱${fields.amountPaid}`,
        fields.transactionDate && `Date: ${fields.transactionDate}`,
      ].filter(Boolean).join(" | ")
    case "CASH":
      return [
        fields.amountTendered && `Amount: ₱${fields.amountTendered}`,
        fields.datePaid && `Date: ${fields.datePaid}`,
      ].filter(Boolean).join(" | ")
    case "CARD":
      return [
        fields.cardType && `Card: ${fields.cardType}`,
        fields.cardholderName && `Name: ${fields.cardholderName}`,
        fields.cardNumber && `Last 4: ${fields.cardNumber.replace(/\s/g, "").slice(-4)}`,
        fields.expiryMonth && fields.expiryYear && `Expiry: ${fields.expiryMonth}/${fields.expiryYear}`,
      ].filter(Boolean).join(" | ")
    default:
      return ""
  }
}

type Props = {
  inquiryId: string
  productName: string
  remainingBalance: number
  alreadySubmitted: boolean
  submittedMethod: string | null
  submittedNote: string | null
}

export function CustomerBalancePaymentForm({
  inquiryId,
  productName,
  remainingBalance,
  alreadySubmitted,
  submittedMethod,
  submittedNote,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodValue>("GCASH")
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState<string | null>(null)

  const [gcashFields, setGcashFields] = useState<GCashFields>({ gcashNumber: "", amountPaid: "", transactionDate: today() })
  const [cashFields, setCashFields] = useState<CashFields>({ amountTendered: "", datePaid: today() })
  const [cardFields, setCardFields] = useState<CardFields>({ cardNumber: "", cardholderName: "", expiryMonth: "", expiryYear: "", cvv: "", cardType: "" })

  function getActiveFields(): Record<string, string> {
    if (paymentMethod === "GCASH") return gcashFields
    if (paymentMethod === "CASH") return cashFields
    return cardFields
  }

  function validate(): { ok: true; amountPaid: number } | { ok: false; error: string } {
    if (paymentMethod === "CASH") {
      const tendered = Number(cashFields.amountTendered)
      if (!Number.isFinite(tendered) || tendered <= 0) {
        return { ok: false, error: "Enter the cash amount tendered." }
      }
      if (tendered < remainingBalance) {
        return {
          ok: false,
          error: `The full remaining balance of ${formatPeso(remainingBalance)} must be paid. You entered ${formatPeso(tendered)}.`,
        }
      }
      if (tendered > remainingBalance) {
        return {
          ok: false,
          error: `Amount cannot exceed the remaining balance of ${formatPeso(remainingBalance)}.`,
        }
      }
      return { ok: true, amountPaid: tendered }
    }
    return { ok: true, amountPaid: remainingBalance }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    const validation = validate()
    if (!validation.ok) {
      setSubmitStatus("error")
      setMessage(validation.error)
      return
    }

    setSubmitStatus("loading")
    const paymentNote = buildNote(paymentMethod, getActiveFields())

    try {
      const response = await fetch("/api/orders/pay-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId,
          paymentMethod,
          amountPaid: validation.amountPaid,
          paymentNote: paymentNote || null,
        }),
      })

      const data = (await response.json()) as { message: string }

      if (response.ok) {
        setSubmitStatus("success")
        setMessage(data.message)
        setTimeout(() => {
          setIsOpen(false)
          window.location.reload()
        }, 1800)
      } else {
        setSubmitStatus("error")
        setMessage(data.message ?? "Something went wrong. Please try again.")
      }
    } catch {
      setSubmitStatus("error")
      setMessage("Network error. Please check your connection and try again.")
    }
  }

  function handleOpen() {
    setSubmitStatus("idle")
    setMessage(null)
    setIsOpen(true)
  }

  return (
    <>
      {/* ── Banner ── */}
      <div className="mt-5 rounded-[18px] border border-[#fde68a] bg-[#fffbeb] px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a16207]">
              Remaining Balance Due
            </p>
            {alreadySubmitted ? (
              <div>
                <p className="mt-1 text-[14px] font-medium text-[#92400e]">
                  Balance payment submitted via {formatMethod(submittedMethod ?? "")}
                </p>
                {submittedNote ? (
                  <p className="mt-0.5 text-[13px] text-[#b45309]">{submittedNote}</p>
                ) : null}
                <p className="mt-1 text-[12px] text-[#a16207]">
                  Waiting for accounting to confirm your payment.
                </p>
              </div>
            ) : (
              <div>
                <p className="mt-1 text-[20px] font-bold text-[#78350f]">
                  {formatPeso(remainingBalance)}
                </p>
                <p className="mt-1 text-[13px] text-[#92400e]">
                  Your order is being built. Please settle the remaining balance so it can be released for delivery.
                </p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleOpen}
            className="inline-flex shrink-0 items-center gap-2 rounded-[12px] bg-[#a16207] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#854d0e]"
          >
            <CreditCard className="h-[15px] w-[15px]" strokeWidth={1.75} />
            {alreadySubmitted ? "Update Balance Payment" : "Pay Remaining Balance"}
          </button>
        </div>
      </div>

      {/* ── Modal ── */}
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/55 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#99a1af]">
                  Balance payment
                </p>
                <h3 className="mt-1 text-[22px] font-semibold text-[#1a1a2e]">Pay remaining balance</h3>
                <p className="mt-1 text-[13px] text-[#6a7282]">
                  Settle the remaining balance to release your order for delivery.
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

            {/* Balance summary */}
            <div className="mt-5 rounded-[16px] border border-[#fde68a] bg-[#fffbeb] px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a16207]">
                    Remaining balance
                  </p>
                  <p className="mt-1 text-[13px] text-[#78350f]">{productName}</p>
                </div>
                <p className="shrink-0 text-[26px] font-bold text-[#78350f]">
                  {formatPeso(remainingBalance)}
                </p>
              </div>
              <p className="mt-2 text-[12px] text-[#a16207]">
                This is the remaining balance that must be fully paid.
              </p>
            </div>

            {submitStatus === "success" ? (
              <div className="mt-6 rounded-[16px] border border-[#bbf7d0] bg-[#f0fdf4] px-5 py-5 text-center">
                <p className="text-[15px] font-medium text-[#166534]">{message}</p>
                <p className="mt-2 text-[13px] text-[#4ade80]">Refreshing your order status…</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {message && submitStatus === "error" ? (
                  <div className="rounded-[14px] border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-[13px] text-[#9f1239]">
                    {message}
                  </div>
                ) : null}

                <label className="grid gap-2">
                  <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                    Payment method
                  </span>
                  <select
                    value={paymentMethod}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value as PaymentMethodValue)
                      setMessage(null)
                    }}
                    className={inputClass}
                    required
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </label>

                <div className="rounded-[16px] bg-[#f8fafc] px-4 py-4">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">
                    Payment details
                  </p>

                  {paymentMethod === "GCASH" && (
                    <div className="space-y-4">
                      {/* Amount to send banner */}
                      <div className="rounded-[12px] border border-[#bfdbfe] bg-[#eff6ff] px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#1d4ed8]">Amount to send via GCash</p>
                        <p className="mt-1 text-[22px] font-bold text-[#1e40af]">{formatPeso(remainingBalance)}</p>
                        <p className="mt-0.5 text-[11px] text-[#3b82f6]">Send to our GCash number: <span className="font-semibold">0906 015 5922</span></p>
                      </div>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Your GCash number</span>
                        <input type="tel" placeholder="09XX XXX XXXX" value={gcashFields.gcashNumber} onChange={(e) => setGcashFields(p => ({ ...p, gcashNumber: e.target.value }))} maxLength={13} className={inputClass} required />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Amount you sent (₱)</span>
                        <input type="number" placeholder={String(remainingBalance)} min="0" step="0.01" value={gcashFields.amountPaid} onChange={(e) => setGcashFields(p => ({ ...p, amountPaid: e.target.value }))} className={inputClass} required />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Transaction date</span>
                        <input type="date" value={gcashFields.transactionDate} onChange={(e) => setGcashFields(p => ({ ...p, transactionDate: e.target.value }))} className={inputClass} required />
                      </label>
                    </div>
                  )}

                  {paymentMethod === "CASH" && (
                    <div className="space-y-4">
                      <label className="grid gap-2">
                        <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                          Amount tendered (₱)
                        </span>
                        <input
                          type="number"
                          placeholder={`Remaining balance: ${remainingBalance}`}
                          min={remainingBalance}
                          max={remainingBalance}
                          step="0.01"
                          value={cashFields.amountTendered}
                          onChange={(e) => setCashFields(p => ({ ...p, amountTendered: e.target.value }))}
                          className={inputClass}
                          required
                        />
                        {Number(cashFields.amountTendered) > 0 && Number(cashFields.amountTendered) < remainingBalance && (
                          <p className="text-[12px] text-[#dc2626]">
                            Amount must be at least {formatPeso(remainingBalance)} to cover the full remaining balance.
                          </p>
                        )}
                        {Number(cashFields.amountTendered) > remainingBalance && (
                          <p className="text-[12px] text-[#dc2626]">
                            Amount cannot exceed the remaining balance of {formatPeso(remainingBalance)}.
                          </p>
                        )}
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Date paid</span>
                        <input type="date" value={cashFields.datePaid} onChange={(e) => setCashFields(p => ({ ...p, datePaid: e.target.value }))} className={inputClass} required />
                      </label>
                    </div>
                  )}

                  {paymentMethod === "CARD" && (
                    <div className="space-y-4">
                      {/* Amount banner */}
                      <div className="rounded-[12px] border border-[#e0e7ff] bg-[#eef2ff] px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#4338ca]">Amount to charge</p>
                        <p className="mt-1 text-[22px] font-bold text-[#312e81]">{formatPeso(remainingBalance)}</p>
                      </div>
                      {/* Card visual */}
                      <div className="relative h-[140px] w-full overflow-hidden rounded-[16px] bg-gradient-to-br from-[#1a1a2e] to-[#374151] p-5 text-white shadow-lg">
                        <div className="flex items-start justify-between">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Balance payment</p>
                          {cardFields.cardType && <span className="rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-bold text-white">{cardFields.cardType}</span>}
                        </div>
                        <p className="mt-3 font-mono text-[16px] tracking-[0.2em] text-white">{cardFields.cardNumber || "•••• •••• •••• ••••"}</p>
                        <div className="mt-2 flex items-end justify-between">
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.15em] text-white/50">Cardholder</p>
                            <p className="text-[11px] font-medium uppercase text-white">{cardFields.cardholderName || "YOUR NAME"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] uppercase tracking-[0.15em] text-white/50">Expires</p>
                            <p className="text-[11px] font-medium text-white">{cardFields.expiryMonth && cardFields.expiryYear ? `${cardFields.expiryMonth}/${cardFields.expiryYear.slice(-2)}` : "MM/YY"}</p>
                          </div>
                        </div>
                      </div>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Card number</span>
                        <input type="text" inputMode="numeric" placeholder="1234 5678 9012 3456"
                          value={cardFields.cardNumber}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 16)
                            const formatted = digits.replace(/(.{4})/g, "$1 ").trim()
                            let detected = cardFields.cardType
                            if (/^4/.test(digits)) detected = "Visa"
                            else if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) detected = "Mastercard"
                            else if (/^3[47]/.test(digits)) detected = "Amex"
                            else if (/^35/.test(digits)) detected = "JCB"
                            setCardFields(p => ({ ...p, cardNumber: formatted, cardType: detected }))
                          }}
                          maxLength={19} className={inputClass} required />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Cardholder name</span>
                        <input type="text" placeholder="Name as shown on card" value={cardFields.cardholderName} onChange={(e) => setCardFields(p => ({ ...p, cardholderName: e.target.value.toUpperCase() }))} className={inputClass} required />
                      </label>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <label className="grid gap-2">
                          <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Month</span>
                          <select value={cardFields.expiryMonth} onChange={(e) => setCardFields(p => ({ ...p, expiryMonth: e.target.value }))} className={inputClass} required>
                            <option value="">MM</option>
                            {["01","02","03","04","05","06","07","08","09","10","11","12"].map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </label>
                        <label className="grid gap-2">
                          <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Year</span>
                          <select value={cardFields.expiryYear} onChange={(e) => setCardFields(p => ({ ...p, expiryYear: e.target.value }))} className={inputClass} required>
                            <option value="">YYYY</option>
                            {Array.from({ length: 12 }, (_, i) => String(new Date().getFullYear() + i)).map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                        </label>
                        <label className="grid gap-2">
                          <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">CVV</span>
                          <input type="password" placeholder="•••" value={cardFields.cvv} onChange={(e) => setCardFields(p => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))} maxLength={4} className={inputClass} required />
                        </label>
                      </div>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Card type</span>
                        <select value={cardFields.cardType} onChange={(e) => setCardFields(p => ({ ...p, cardType: e.target.value }))} className={inputClass} required>
                          <option value="">Select card type</option>
                          {["Visa","Mastercard","JCB","Amex","Other"].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </label>
                    </div>
                  )}
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-[#e5e7eb] pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={submitStatus === "loading"}
                    className="rounded-[14px] border border-[#d1d5dc] px-5 py-3 text-[14px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb] disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitStatus === "loading"}
                    className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#a16207] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#854d0e] disabled:opacity-60"
                  >
                    {submitStatus === "loading" ? (
                      <>
                        <Loader2 className="h-[14px] w-[14px] animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      "Submit balance payment"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
