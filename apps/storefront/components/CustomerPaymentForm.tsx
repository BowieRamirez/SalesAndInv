"use client"

import { useMemo, useState } from "react"
import { CreditCard, Loader2 } from "lucide-react"

// ─── Payment method config ────────────────────────────────────────────────────

const PAYMENT_METHODS = [
  { value: "GCASH", label: "GCash" },
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Card" },
] as const

type PaymentMethodValue = (typeof PAYMENT_METHODS)[number]["value"]

// Per-method field state shapes
type GCashFields = {
  gcashNumber: string
  referenceNumber: string
  transactionDate: string
}

type CashFields = {
  amountTendered: string
  datePaid: string
}

type CardFields = {
  cardType: string
  lastFourDigits: string
  transactionDate: string
}

const CARD_TYPES = ["Visa", "Mastercard", "JCB", "Amex", "Other"]

// Down payments are accepted only when the cash amount is at least this fraction
// of the full price. Anything less is rejected.
const MIN_DOWN_PAYMENT_RATIO = 0.5

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function buildPaymentNote(
  method: PaymentMethodValue,
  fields: Record<string, string>,
  paymentType: "FULL_PAYMENT" | "DOWN_PAYMENT",
): string {
  const typeLabel = paymentType === "DOWN_PAYMENT" ? "Down payment" : "Full payment"

  switch (method) {
    case "GCASH":
      return [
        `Type: ${typeLabel}`,
        fields.gcashNumber && `GCash #: ${fields.gcashNumber}`,
        fields.referenceNumber && `Ref #: ${fields.referenceNumber}`,
        fields.transactionDate && `Date: ${fields.transactionDate}`,
      ]
        .filter(Boolean)
        .join(" | ")

    case "CASH":
      return [
        `Type: ${typeLabel}`,
        fields.amountTendered && `Amount tendered: ₱${fields.amountTendered}`,
        fields.datePaid && `Date: ${fields.datePaid}`,
      ]
        .filter(Boolean)
        .join(" | ")

    case "CARD":
      return [
        `Type: ${typeLabel}`,
        fields.cardType && `Card: ${fields.cardType}`,
        fields.lastFourDigits && `Last 4: ${fields.lastFourDigits}`,
        fields.transactionDate && `Date: ${fields.transactionDate}`,
      ]
        .filter(Boolean)
        .join(" | ")

    default:
      return ""
  }
}

// ─── Per-method field components ─────────────────────────────────────────────

const inputClass =
  "w-full rounded-[14px] border border-[#d1d5dc] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-colors focus:border-[#111827]"

const labelClass = "text-[12px] font-medium uppercase tracking-wide text-[#6b7280]"

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <span className={labelClass}>
      {children}
      {optional && (
        <span className="ml-1 normal-case tracking-normal text-[#9ca3af]">(optional)</span>
      )}
    </span>
  )
}

function GCashForm({
  fields,
  onChange,
}: {
  fields: GCashFields
  onChange: (next: Partial<GCashFields>) => void
}) {
  return (
    <div className="space-y-4">
      <label className="grid gap-2">
        <FieldLabel>GCash number</FieldLabel>
        <input
          type="tel"
          placeholder="09XX XXX XXXX"
          value={fields.gcashNumber}
          onChange={(e) => onChange({ gcashNumber: e.target.value })}
          maxLength={13}
          className={inputClass}
          required
        />
      </label>
      <label className="grid gap-2">
        <FieldLabel>Reference number</FieldLabel>
        <input
          type="text"
          placeholder="13-digit GCash reference"
          value={fields.referenceNumber}
          onChange={(e) => onChange({ referenceNumber: e.target.value })}
          className={inputClass}
          required
        />
      </label>
      <label className="grid gap-2">
        <FieldLabel>Transaction date</FieldLabel>
        <input
          type="date"
          value={fields.transactionDate}
          onChange={(e) => onChange({ transactionDate: e.target.value })}
          className={inputClass}
          required
        />
      </label>
    </div>
  )
}

function CashForm({
  fields,
  totalPrice,
  onChange,
}: {
  fields: CashFields
  totalPrice: number
  onChange: (next: Partial<CashFields>) => void
}) {
  const tendered = Number(fields.amountTendered) || 0
  const minDown = totalPrice * MIN_DOWN_PAYMENT_RATIO
  const isFull = tendered >= totalPrice && totalPrice > 0
  const isOver = tendered > totalPrice
  const isValidDown = tendered >= minDown && tendered < totalPrice
  const isUnderMin = tendered > 0 && tendered < minDown

  return (
    <div className="space-y-4">
      <label className="grid gap-2">
        <FieldLabel>Amount tendered (₱)</FieldLabel>
        <input
          type="number"
          placeholder={`Full price: ${totalPrice}`}
          min="0"
          max={totalPrice}
          step="0.01"
          value={fields.amountTendered}
          onChange={(e) => onChange({ amountTendered: e.target.value })}
          className={inputClass}
          required
        />
        {tendered > 0 && (
          <div className="mt-1 space-y-1 text-[12px]">
            {isOver && (
              <p className="text-[#dc2626]">
                ✗ Amount cannot exceed the order total of {formatPeso(totalPrice)}.
              </p>
            )}
            {!isOver && isFull && (
              <p className="text-[#16a34a]">✓ Full payment — covers the entire price.</p>
            )}
            {!isOver && isValidDown && (
              <p className="text-[#a16207]">
                Down payment — remaining balance:{" "}
                <span className="font-semibold">{formatPeso(totalPrice - tendered)}</span>
              </p>
            )}
            {!isOver && isUnderMin && (
              <p className="text-[#dc2626]">
                ✗ Minimum down payment is {formatPeso(minDown)} (50% of full price). Add at least{" "}
                {formatPeso(minDown - tendered)} more.
              </p>
            )}
          </div>
        )}
      </label>
      <label className="grid gap-2">
        <FieldLabel>Date paid</FieldLabel>
        <input
          type="date"
          value={fields.datePaid}
          onChange={(e) => onChange({ datePaid: e.target.value })}
          className={inputClass}
          required
        />
      </label>
    </div>
  )
}

function CardForm({
  fields,
  onChange,
}: {
  fields: CardFields
  onChange: (next: Partial<CardFields>) => void
}) {
  return (
    <div className="space-y-4">
      <label className="grid gap-2">
        <FieldLabel>Card type</FieldLabel>
        <select
          value={fields.cardType}
          onChange={(e) => onChange({ cardType: e.target.value })}
          className={inputClass}
          required
        >
          <option value="">Select card type</option>
          {CARD_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2">
        <FieldLabel>Last 4 digits</FieldLabel>
        <input
          type="text"
          placeholder="e.g. 4321"
          value={fields.lastFourDigits}
          onChange={(e) => onChange({ lastFourDigits: e.target.value.replace(/\D/g, "").slice(0, 4) })}
          maxLength={4}
          pattern="\d{4}"
          className={inputClass}
          required
        />
      </label>
      <label className="grid gap-2">
        <FieldLabel>Transaction date</FieldLabel>
        <input
          type="date"
          value={fields.transactionDate}
          onChange={(e) => onChange({ transactionDate: e.target.value })}
          className={inputClass}
          required
        />
      </label>
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  inquiryId: string
  productName: string
  totalPrice: number
  alreadySubmitted: boolean
  submittedMethod: string | null
  submittedNote: string | null
  locked?: boolean
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CustomerPaymentForm({
  inquiryId,
  productName,
  totalPrice,
  alreadySubmitted,
  submittedMethod,
  submittedNote,
  locked = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodValue>("GCASH")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState<string | null>(null)
  const [showDownPaymentConfirm, setShowDownPaymentConfirm] = useState(false)

  const minDownPayment = useMemo(
    () => totalPrice * MIN_DOWN_PAYMENT_RATIO,
    [totalPrice],
  )

  // Per-method field state
  const [gcashFields, setGcashFields] = useState<GCashFields>({
    gcashNumber: "",
    referenceNumber: "",
    transactionDate: today(),
  })
  const [cashFields, setCashFields] = useState<CashFields>({
    amountTendered: "",
    datePaid: today(),
  })
  const [cardFields, setCardFields] = useState<CardFields>({
    cardType: "",
    lastFourDigits: "",
    transactionDate: today(),
  })

  function getActiveFields(): Record<string, string> {
    switch (paymentMethod) {
      case "GCASH": return gcashFields
      case "CASH": return cashFields
      case "CARD": return cardFields
    }
  }

  /**
   * Resolve the payment type and optional client-side error before submitting.
   * For CASH we have to look at the tendered amount; for other methods we treat
   * the payment as a full payment.
   */
  function resolvePaymentType():
    | { ok: true; paymentType: "FULL_PAYMENT" | "DOWN_PAYMENT"; tendered: number }
    | { ok: false; error: string } {
    if (paymentMethod === "CASH") {
      const tendered = Number(cashFields.amountTendered)
      if (!Number.isFinite(tendered) || tendered <= 0) {
        return { ok: false, error: "Enter the cash amount tendered." }
      }
      if (tendered > totalPrice) {
        return {
          ok: false,
          error: `Amount cannot exceed the order total of ${formatPeso(totalPrice)}.`,
        }
      }
      if (tendered < minDownPayment) {
        return {
          ok: false,
          error: `Minimum down payment is ${formatPeso(
            minDownPayment,
          )} (50% of ${formatPeso(totalPrice)}). Add at least ${formatPeso(
            minDownPayment - tendered,
          )} more.`,
        }
      }
      const paymentType = tendered >= totalPrice ? "FULL_PAYMENT" : "DOWN_PAYMENT"
      return { ok: true, paymentType, tendered }
    }
    // GCASH / CARD: treated as full payment in the UI for now
    return { ok: true, paymentType: "FULL_PAYMENT", tendered: totalPrice }
  }

  async function actuallySubmit(paymentType: "FULL_PAYMENT" | "DOWN_PAYMENT") {
    setStatus("loading")
    setMessage(null)
    setShowDownPaymentConfirm(false)

    const paymentNote = buildPaymentNote(paymentMethod, getActiveFields(), paymentType)
    const tendered =
      paymentMethod === "CASH"
        ? Number(cashFields.amountTendered) || 0
        : totalPrice

    try {
      const response = await fetch("/api/orders/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId,
          paymentMethod,
          paymentType,
          amountPaid: tendered,
          paymentNote: paymentNote || null,
        }),
      })

      const data = (await response.json()) as { message: string }

      if (response.ok) {
        setStatus("success")
        setMessage(data.message)
        setTimeout(() => {
          setIsOpen(false)
          window.location.reload()
        }, 1800)
      } else {
        setStatus("error")
        setMessage(data.message ?? "Something went wrong. Please try again.")
      }
    } catch {
      setStatus("error")
      setMessage("Network error. Please check your connection and try again.")
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    const result = resolvePaymentType()
    if (!result.ok) {
      setStatus("error")
      setMessage(result.error)
      return
    }

    // Cash + DOWN_PAYMENT requires explicit confirmation
    if (paymentMethod === "CASH" && result.paymentType === "DOWN_PAYMENT") {
      setShowDownPaymentConfirm(true)
      return
    }

    void actuallySubmit(result.paymentType)
  }

  function handleOpen() {
    setStatus("idle")
    setMessage(null)
    setShowDownPaymentConfirm(false)
    setIsOpen(true)
  }

  return (
    <>
      {/* ── Banner ── */}
      <div className={`mt-5 rounded-[18px] border px-5 py-4 ${locked ? "border-[#bbf7d0] bg-[#f0fdf4]" : "border-[#bfdbfe] bg-[#eff6ff]"}`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${locked ? "text-[#166534]" : "text-[#1d4ed8]"}`}>
              {locked ? "Payment Confirmed" : "Payment Required"}
            </p>
            {locked ? (
              <div>
                <p className="mt-1 text-[14px] font-medium text-[#15803d]">
                  Your payment has been confirmed by accounting.
                </p>
                {submittedNote ? (
                  <p className="mt-0.5 text-[13px] text-[#16a34a]">{submittedNote}</p>
                ) : null}
              </div>
            ) : alreadySubmitted ? (
              <div>
                <p className="mt-1 text-[14px] font-medium text-[#1e40af]">
                  Payment submitted via {formatMethod(submittedMethod ?? "")}
                </p>
                {submittedNote ? (
                  <p className="mt-0.5 text-[13px] text-[#3b82f6]">{submittedNote}</p>
                ) : null}
                <p className="mt-1 text-[12px] text-[#2563eb]">
                  Waiting for accounting to confirm your payment.
                </p>
              </div>
            ) : (
              <p className="mt-1 text-[14px] text-[#1e40af]">
                Your order has been approved by inventory. Please proceed with payment so accounting can
                release your order for building.
              </p>
            )}
          </div>
          {!locked && (
            <button
              type="button"
              onClick={handleOpen}
              className="inline-flex shrink-0 items-center gap-2 rounded-[12px] bg-[#1d4ed8] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#1e40af]"
            >
              <CreditCard className="h-[15px] w-[15px]" strokeWidth={1.75} />
              {alreadySubmitted ? "Update Payment" : "Continue Payment"}
            </button>
          )}
        </div>
      </div>

      {/* ── Modal — only rendered when not locked ── */}
      {!locked && isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/55 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#99a1af]">
                  Continue payment
                </p>
                <h3 className="mt-1 text-[22px] font-semibold text-[#1a1a2e]">Submit your payment</h3>
                <p className="mt-1 text-[13px] text-[#6a7282]">
                  Tell us how you paid and accounting will confirm it.
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

            {/* Order summary — full price */}
            <div className="mt-5 rounded-[16px] border border-[#e0e7ff] bg-[#eef2ff] px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4338ca]">
                    Order total
                  </p>
                  <p className="mt-1 text-[14px] font-medium text-[#312e81]">{productName}</p>
                </div>
                <p className="shrink-0 text-[22px] font-semibold text-[#312e81]">
                  {formatPeso(totalPrice)}
                </p>
              </div>
              <p className="mt-2 text-[12px] text-[#4338ca]">
                Pay the full amount, or pay at least {formatPeso(minDownPayment)} (50%) as a down
                payment if paying by cash.
              </p>
            </div>

            {/* Success state */}
            {status === "success" ? (
              <div className="mt-6 rounded-[16px] border border-[#bbf7d0] bg-[#f0fdf4] px-5 py-5 text-center">
                <p className="text-[15px] font-medium text-[#166534]">{message}</p>
                <p className="mt-2 text-[13px] text-[#4ade80]">Refreshing your order status…</p>
              </div>
            ) : showDownPaymentConfirm ? (
              // Down payment confirmation step
              <div className="mt-6 space-y-4">
                <div className="rounded-[16px] border border-[#fde68a] bg-[#fffbeb] px-5 py-5">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#92400e]">
                    Confirm Down Payment
                  </p>
                  <p className="mt-3 text-[14px] leading-[22px] text-[#7c2d12]">
                    The cash amount you entered ({formatPeso(Number(cashFields.amountTendered))}) is
                    less than the full price of {formatPeso(totalPrice)}.
                  </p>
                  <p className="mt-2 text-[14px] leading-[22px] text-[#7c2d12]">
                    This payment will be recorded as a <strong>down payment</strong>. The remaining
                    balance of{" "}
                    <strong>
                      {formatPeso(totalPrice - (Number(cashFields.amountTendered) || 0))}
                    </strong>{" "}
                    must be settled before delivery.
                  </p>
                  <p className="mt-3 text-[12px] text-[#a16207]">
                    Do you want to continue?
                  </p>
                </div>
                <div className="flex flex-col-reverse gap-3 border-t border-[#e5e7eb] pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowDownPaymentConfirm(false)}
                    disabled={status === "loading"}
                    className="rounded-[14px] border border-[#d1d5dc] px-5 py-3 text-[14px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb] disabled:opacity-50"
                  >
                    Go back
                  </button>
                  <button
                    type="button"
                    onClick={() => void actuallySubmit("DOWN_PAYMENT")}
                    disabled={status === "loading"}
                    className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#a16207] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#854d0e] disabled:opacity-60"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="h-[14px] w-[14px] animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      "Yes, submit as down payment"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {/* Error banner */}
                {message && status === "error" ? (
                  <div className="rounded-[14px] border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-[13px] text-[#9f1239]">
                    {message}
                  </div>
                ) : null}

                {/* Payment method selector */}
                <label className="grid gap-2">
                  <FieldLabel>Payment method</FieldLabel>
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
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Method-specific fields */}
                <div className="rounded-[16px] bg-[#f8fafc] px-4 py-4">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">
                    Payment details
                  </p>

                  {paymentMethod === "GCASH" && (
                    <GCashForm
                      fields={gcashFields}
                      onChange={(next) => setGcashFields((prev) => ({ ...prev, ...next }))}
                    />
                  )}
                  {paymentMethod === "CASH" && (
                    <CashForm
                      fields={cashFields}
                      totalPrice={totalPrice}
                      onChange={(next) => setCashFields((prev) => ({ ...prev, ...next }))}
                    />
                  )}
                  {paymentMethod === "CARD" && (
                    <CardForm
                      fields={cardFields}
                      onChange={(next) => setCardFields((prev) => ({ ...prev, ...next }))}
                    />
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-[#e5e7eb] pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={status === "loading"}
                    className="rounded-[14px] border border-[#d1d5dc] px-5 py-3 text-[14px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb] disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#1d4ed8] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#1e40af] disabled:opacity-60"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="h-[14px] w-[14px] animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      "Submit payment"
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
