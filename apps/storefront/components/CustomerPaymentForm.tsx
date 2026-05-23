"use client"

import { useMemo, useState, useRef } from "react"
import { CreditCard, Loader2, Upload, X, ImageIcon } from "lucide-react"

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
  amountPaid: string
  transactionDate: string
}

type CashFields = {
  amountTendered: string
  datePaid: string
}

type CardFields = {
  cardNumber: string
  cardholderName: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  cardType: string
}

const MIN_DOWN_PAYMENT_RATIO = 0.7
const VAT_RATE = 0.12

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
        fields.amountPaid && `Amount: ₱${fields.amountPaid}`,
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
        fields.cardholderName && `Name: ${fields.cardholderName}`,
        fields.cardNumber && `Last 4: ${fields.cardNumber.replace(/\s/g, "").slice(-4)}`,
        fields.expiryMonth && fields.expiryYear && `Expiry: ${fields.expiryMonth}/${fields.expiryYear}`,
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
  totalPrice,
  onChange,
}: {
  fields: GCashFields
  totalPrice: number
  onChange: (next: Partial<GCashFields>) => void
}) {
  return (
    <div className="space-y-4">
      {/* Amount to pay — read-only display */}
      <div className="rounded-[12px] border border-[#bfdbfe] bg-[#eff6ff] px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#1d4ed8]">Amount to send via GCash</p>
        <p className="mt-1 text-[22px] font-bold text-[#1e40af]">{formatPeso(totalPrice)}</p>
        <p className="mt-0.5 text-[11px] text-[#3b82f6]">Send this exact amount to our GCash number: <span className="font-semibold">0906 015 5922</span></p>
      </div>
      <label className="grid gap-2">
        <FieldLabel>Your GCash number</FieldLabel>
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
        <FieldLabel>Amount you sent (₱)</FieldLabel>
        <input
          type="number"
          placeholder={String(totalPrice)}
          min="0"
          step="0.01"
          value={fields.amountPaid}
          onChange={(e) => onChange({ amountPaid: e.target.value })}
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
  // Round to 2dp to avoid floating-point false negatives (e.g. 12328.24 < 12328.24)
  const tenderedRounded = Math.round(tendered * 100) / 100
  const totalRounded = Math.round(totalPrice * 100) / 100
  const isFull = tenderedRounded >= totalRounded && totalRounded > 0
  const isOver = tenderedRounded > totalRounded
  const isValidDown = tenderedRounded >= Math.round(minDown * 100) / 100 && tenderedRounded < totalRounded
  const isUnderMin = tenderedRounded > 0 && tenderedRounded < Math.round(minDown * 100) / 100

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
                <span className="font-semibold">{formatPeso(totalRounded - tenderedRounded)}</span>
              </p>
            )}
            {!isOver && isUnderMin && (
              <p className="text-[#dc2626]">
                ✗ Minimum down payment is {formatPeso(minDown)} (70% of full price). Add at least{" "}
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
  totalPrice,
  onChange,
}: {
  fields: CardFields
  totalPrice: number
  onChange: (next: Partial<CardFields>) => void
}) {
  // Auto-detect card type from number
  function detectCardType(num: string): string {
    const n = num.replace(/\s/g, "")
    if (/^4/.test(n)) return "Visa"
    if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "Mastercard"
    if (/^3[47]/.test(n)) return "Amex"
    if (/^35/.test(n)) return "JCB"
    return fields.cardType || ""
  }

  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16)
    return digits.replace(/(.{4})/g, "$1 ").trim()
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 12 }, (_, i) => String(currentYear + i))
  const months = ["01","02","03","04","05","06","07","08","09","10","11","12"]

  const detectedType = detectCardType(fields.cardNumber)

  return (
    <div className="space-y-4">
      {/* Card visual */}
      <div className="relative h-[160px] w-full overflow-hidden rounded-[18px] bg-gradient-to-br from-[#1a1a2e] to-[#374151] p-5 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Card payment</p>
            <p className="mt-1 text-[11px] font-medium text-white/80">{formatPeso(totalPrice)}</p>
          </div>
          <div className="text-right">
            {detectedType && (
              <span className="rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-bold text-white">{detectedType}</span>
            )}
          </div>
        </div>
        <p className="mt-5 font-mono text-[18px] tracking-[0.2em] text-white">
          {fields.cardNumber || "•••• •••• •••• ••••"}
        </p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.15em] text-white/50">Cardholder</p>
            <p className="mt-0.5 text-[12px] font-medium uppercase tracking-wide text-white">
              {fields.cardholderName || "YOUR NAME"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-[0.15em] text-white/50">Expires</p>
            <p className="mt-0.5 text-[12px] font-medium text-white">
              {fields.expiryMonth && fields.expiryYear ? `${fields.expiryMonth}/${fields.expiryYear.slice(-2)}` : "MM/YY"}
            </p>
          </div>
        </div>
      </div>

      {/* Amount to pay */}
      <div className="rounded-[12px] border border-[#e0e7ff] bg-[#eef2ff] px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#4338ca]">Amount to charge</p>
        <p className="mt-1 text-[22px] font-bold text-[#312e81]">{formatPeso(totalPrice)}</p>
        <p className="mt-0.5 text-[11px] text-[#6366f1]">This amount will be charged to your card upon confirmation by accounting.</p>
      </div>

      {/* Card number */}
      <label className="grid gap-2">
        <FieldLabel>Card number</FieldLabel>        <input
          type="text"
          inputMode="numeric"
          placeholder="1234 5678 9012 3456"
          value={fields.cardNumber}
          onChange={(e) => {
            const formatted = formatCardNumber(e.target.value)
            const detected = detectCardType(formatted)
            onChange({ cardNumber: formatted, cardType: detected || fields.cardType })
          }}
          maxLength={19}
          className={inputClass}
          required
        />
      </label>

      {/* Cardholder name */}
      <label className="grid gap-2">
        <FieldLabel>Cardholder name</FieldLabel>
        <input
          type="text"
          placeholder="Name as shown on card"
          value={fields.cardholderName}
          onChange={(e) => onChange({ cardholderName: e.target.value.toUpperCase() })}
          className={inputClass}
          required
        />
      </label>

      {/* Expiry + CVV */}
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-2">
          <FieldLabel>Month</FieldLabel>
          <select value={fields.expiryMonth} onChange={(e) => onChange({ expiryMonth: e.target.value })} className={inputClass} required>
            <option value="">MM</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <label className="grid gap-2">
          <FieldLabel>Year</FieldLabel>
          <select value={fields.expiryYear} onChange={(e) => onChange({ expiryYear: e.target.value })} className={inputClass} required>
            <option value="">YYYY</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </label>
        <label className="grid gap-2">
          <FieldLabel>CVV</FieldLabel>
          <input
            type="password"
            placeholder="•••"
            value={fields.cvv}
            onChange={(e) => onChange({ cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
            maxLength={4}
            className={inputClass}
            required
          />
        </label>
      </div>

      {/* Card type (auto-detected, but editable) */}
      <label className="grid gap-2">
        <FieldLabel>Card type</FieldLabel>
        <select value={fields.cardType} onChange={(e) => onChange({ cardType: e.target.value })} className={inputClass} required>
          <option value="">Select card type</option>
          {["Visa","Mastercard","JCB","Amex","Other"].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  inquiryId: string
  productName: string
  totalPrice: number                        // final quoted price (after discount, before VAT)
  quotedPriceBeforeDiscount?: number | null // original price before discount (if any)
  quotationDiscount?: number                // discount amount in peso
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
  quotedPriceBeforeDiscount,
  quotationDiscount = 0,
  alreadySubmitted,
  submittedMethod,
  submittedNote,
  locked = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodValue>("GCASH")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingPaymentType, setPendingPaymentType] = useState<"FULL_PAYMENT" | "DOWN_PAYMENT">("FULL_PAYMENT")
  const [proofImage, setProofImage] = useState<{ dataUrl: string; fileName: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Compute VAT-inclusive total — this is what the customer actually pays
  const vatAmount = totalPrice * VAT_RATE
  const totalPriceWithVat = totalPrice + vatAmount

  const minDownPayment = useMemo(
    () => totalPriceWithVat * MIN_DOWN_PAYMENT_RATIO,
    [totalPriceWithVat],
  )

  // Per-method field state
  const [gcashFields, setGcashFields] = useState<GCashFields>({
    gcashNumber: "",
    amountPaid: "",
    transactionDate: today(),
  })
  const [cashFields, setCashFields] = useState<CashFields>({
    amountTendered: "",
    datePaid: today(),
  })
  const [cardFields, setCardFields] = useState<CardFields>({
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardType: "",
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
      const tenderedR = Math.round(tendered * 100) / 100
      const totalR = Math.round(totalPriceWithVat * 100) / 100
      const minDownR = Math.round(minDownPayment * 100) / 100
      if (tenderedR > totalR) {
        return {
          ok: false,
          error: `Amount cannot exceed the order total of ${formatPeso(totalPriceWithVat)}.`,
        }
      }
      if (tenderedR < minDownR) {
        return {
          ok: false,
          error: `Minimum down payment is ${formatPeso(
            minDownPayment,
          )} (70% of ${formatPeso(totalPriceWithVat)}). Add at least ${formatPeso(
            minDownPayment - tendered,
          )} more.`,
        }
      }
      const paymentType = tenderedR >= totalR ? "FULL_PAYMENT" : "DOWN_PAYMENT"
      return { ok: true, paymentType, tendered }
    }
    if (paymentMethod === "GCASH") {
      const paid = Number(gcashFields.amountPaid)
      if (!Number.isFinite(paid) || paid <= 0) {
        return { ok: false, error: "Enter the amount you sent via GCash." }
      }
      if (paid > totalPriceWithVat) {
        return { ok: false, error: `Amount cannot exceed the order total of ${formatPeso(totalPriceWithVat)}.` }
      }
      if (paid < minDownPayment) {
        return {
          ok: false,
          error: `Minimum down payment is ${formatPeso(minDownPayment)} (70% of ${formatPeso(totalPriceWithVat)}).`,
        }
      }
      const paymentType = paid >= totalPriceWithVat ? "FULL_PAYMENT" : "DOWN_PAYMENT"
      return { ok: true, paymentType, tendered: paid }
    }
    // CARD: treated as full payment
    return { ok: true, paymentType: "FULL_PAYMENT", tendered: totalPriceWithVat }
  }

  async function actuallySubmit(paymentType: "FULL_PAYMENT" | "DOWN_PAYMENT") {
    setStatus("loading")
    setMessage(null)
    setShowConfirm(false)

    const paymentNote = buildPaymentNote(paymentMethod, getActiveFields(), paymentType)
    const tendered =
      paymentMethod === "CASH"
        ? Number(cashFields.amountTendered) || 0
        : paymentMethod === "GCASH"
        ? Number(gcashFields.amountPaid) || 0
        : totalPriceWithVat

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
          proofImage: proofImage ?? null,
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

    // Always show confirmation step before submitting
    setPendingPaymentType(result.paymentType)
    setShowConfirm(true)
  }

  function handleProofImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setProofImage({ dataUrl: String(reader.result), fileName: file.name })
    }
    reader.readAsDataURL(file)
  }

  function handleOpen() {
    if (alreadySubmitted || locked) return
    setStatus("idle")
    setMessage(null)
    setShowConfirm(false)
    setProofImage(null)
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
            alreadySubmitted ? (
              /* Payment submitted — locked until accounting reviews */
              <div className="inline-flex shrink-0 items-center gap-2 rounded-[12px] border border-[#bfdbfe] bg-[#dbeafe] px-4 py-2.5 text-[13px] font-medium text-[#1d4ed8]">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Awaiting accounting review
              </div>
            ) : (
              <button
                type="button"
                onClick={handleOpen}
                className="inline-flex shrink-0 items-center gap-2 rounded-[12px] bg-[#1d4ed8] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#1e40af]"
              >
                <CreditCard className="h-[15px] w-[15px]" strokeWidth={1.75} />
                Continue Payment
              </button>
            )
          )}
        </div>
      </div>

      {/* ── Modal — only rendered when not locked and not already submitted ── */}
      {!locked && !alreadySubmitted && isOpen ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#111827]/55">
          <div className="flex min-h-full items-center justify-center px-4 py-8">
          <div className="w-full max-w-lg rounded-[24px] bg-white p-6 shadow-2xl"
               style={{ maxHeight: "calc(100vh - 4rem)", overflowY: "auto" }}>
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

            {/* Order summary — VAT-inclusive total */}
            <div className="mt-5 rounded-[16px] border border-[#e0e7ff] bg-[#eef2ff] px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4338ca]">
                    Order total
                  </p>
                  <p className="mt-1 text-[14px] font-medium text-[#312e81]">{productName}</p>
                </div>
                <p className="shrink-0 text-[22px] font-semibold text-[#312e81]">
                  {formatPeso(totalPriceWithVat)}
                </p>
              </div>
              <div className="mt-3 space-y-1 border-t border-[#c7d2fe] pt-3 text-[12px] text-[#4338ca]">
                {/* Show original price + discount if a discount was applied */}
                {quotationDiscount > 0 && quotedPriceBeforeDiscount != null ? (
                  <>
                    <div className="flex justify-between">
                      <span>Original price</span>
                      <span>{formatPeso(quotedPriceBeforeDiscount)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-[#16a34a]">
                      <span>
                        Discount ({((quotationDiscount / quotedPriceBeforeDiscount) * 100).toFixed(1)}%)
                      </span>
                      <span>- {formatPeso(quotationDiscount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price after discount</span>
                      <span>{formatPeso(totalPrice)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span>Base price</span>
                    <span>{formatPeso(totalPrice)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>VAT (12%)</span>
                  <span>{formatPeso(vatAmount)}</span>
                </div>
                <div className="flex justify-between font-semibold text-[#312e81]">
                  <span>Total (VAT inclusive)</span>
                  <span>{formatPeso(totalPriceWithVat)}</span>
                </div>
              </div>
              <p className="mt-3 text-[12px] text-[#4338ca]">
                Pay the full amount, or pay at least {formatPeso(minDownPayment)} (70%) as a down
                payment if paying by cash.
              </p>
            </div>

            {/* Success state */}
            {status === "success" ? (
              <div className="mt-6 rounded-[16px] border border-[#bbf7d0] bg-[#f0fdf4] px-5 py-5 text-center">
                <p className="text-[15px] font-medium text-[#166534]">{message}</p>
                <p className="mt-2 text-[13px] text-[#4ade80]">Refreshing your order status…</p>
              </div>
            ) : showConfirm ? (
              /* ── Confirmation step ── */
              <div className="mt-6 space-y-4">
                {/* Summary */}
                <div className="rounded-[16px] border border-[#e5e7eb] bg-[#f8fafc] px-5 py-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">Payment summary</p>
                  <div className="mt-3 space-y-1.5 text-[13px]">
                    <div className="flex justify-between text-[#374151]">
                      <span>Method</span>
                      <span className="font-medium">{paymentMethod === "GCASH" ? "GCash" : paymentMethod === "CASH" ? "Cash" : "Card"}</span>
                    </div>
                    <div className="flex justify-between text-[#374151]">
                      <span>Payment type</span>
                      <span className="font-medium">{pendingPaymentType === "FULL_PAYMENT" ? "Full payment" : "Down payment (70%)"}</span>
                    </div>
                    <div className="flex justify-between text-[#374151]">
                      <span>Amount</span>
                      <span className="font-semibold text-[#111827]">
                        {formatPeso(
                          paymentMethod === "CASH" ? Number(cashFields.amountTendered) || 0
                          : paymentMethod === "GCASH" ? Number(gcashFields.amountPaid) || 0
                          : totalPriceWithVat
                        )}
                      </span>
                    </div>
                    {pendingPaymentType === "DOWN_PAYMENT" && (
                      <div className="flex justify-between text-[#92400e]">
                        <span>Remaining balance after this</span>
                        <span className="font-medium">
                          {formatPeso(totalPriceWithVat - (
                            paymentMethod === "CASH" ? Number(cashFields.amountTendered) || 0
                            : paymentMethod === "GCASH" ? Number(gcashFields.amountPaid) || 0
                            : totalPriceWithVat
                          ))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Proof of payment upload */}
                <div className="rounded-[16px] border border-[#e5e7eb] bg-white px-5 py-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">
                    Proof of payment <span className="normal-case tracking-normal font-normal text-[#9ca3af]">(optional but recommended)</span>
                  </p>
                  <p className="mt-1 text-[12px] text-[#6b7280]">
                    Attach a screenshot of your receipt or transaction confirmation to speed up accounting review.
                  </p>

                  {proofImage ? (
                    <div className="mt-3 relative">
                      <img
                        src={proofImage.dataUrl}
                        alt="Payment proof"
                        className="w-full max-h-[200px] rounded-[12px] object-contain border border-[#e5e7eb] bg-[#f8fafc]"
                      />
                      <button
                        type="button"
                        onClick={() => { setProofImage(null); if (fileInputRef.current) fileInputRef.current.value = "" }}
                        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#111827]/70 text-white hover:bg-[#111827]"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <p className="mt-2 text-[11px] text-[#6b7280] truncate">{proofImage.fileName}</p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-[#d1d5dc] bg-[#f8fafc] px-4 py-5 text-[13px] text-[#6b7280] transition-colors hover:border-[#111827] hover:bg-[#f1f5f9]"
                    >
                      <Upload className="h-4 w-4" />
                      Click to upload screenshot / receipt
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProofImageChange}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-[#e5e7eb] pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowConfirm(false)}
                    disabled={status === "loading"}
                    className="rounded-[14px] border border-[#d1d5dc] px-5 py-3 text-[14px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb] disabled:opacity-50"
                  >
                    Go back
                  </button>
                  <button
                    type="button"
                    onClick={() => void actuallySubmit(pendingPaymentType)}
                    disabled={status === "loading"}
                    className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#1a1a2e] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#111] disabled:opacity-60"
                  >
                    {status === "loading" ? (
                      <><Loader2 className="h-[14px] w-[14px] animate-spin" />Submitting…</>
                    ) : (
                      <><ImageIcon className="h-[14px] w-[14px]" />Confirm &amp; submit payment</>
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
                      totalPrice={totalPriceWithVat}
                      onChange={(next) => setGcashFields((prev) => ({ ...prev, ...next }))}
                    />
                  )}
                  {paymentMethod === "CASH" && (
                    <CashForm
                      fields={cashFields}
                      totalPrice={totalPriceWithVat}
                      onChange={(next) => setCashFields((prev) => ({ ...prev, ...next }))}
                    />
                  )}
                  {paymentMethod === "CARD" && (
                    <CardForm
                      fields={cardFields}
                      totalPrice={totalPriceWithVat}
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
        </div>
      ) : null}
    </>
  )
}
