export const ACCOUNTING_PAYMENT_METHODS = [
  { value: "GCASH", label: "GCash" },
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Card" },
] as const

export type AccountingPaymentMethod = (typeof ACCOUNTING_PAYMENT_METHODS)[number]["value"]

export function isAccountingPaymentMethod(value: string): value is AccountingPaymentMethod {
  return ACCOUNTING_PAYMENT_METHODS.some((method) => method.value === value)
}

export function formatAccountingPaymentMethod(value: AccountingPaymentMethod | string) {
  // Format historical values that may exist (e.g. BANK_TRANSFER, CHECK) by
  // falling back to a humanized label so they still render reasonably.
  const match = ACCOUNTING_PAYMENT_METHODS.find((method) => method.value === value)
  if (match) {
    return match.label
  }
  // Friendly fallbacks for legacy data
  if (value === "BANK_TRANSFER") return "Bank transfer"
  if (value === "CHECK") return "Check"
  return String(value)
}
