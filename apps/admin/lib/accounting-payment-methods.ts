export const ACCOUNTING_PAYMENT_METHODS = [
  { value: "BANK_TRANSFER", label: "Bank transfer" },
  { value: "GCASH", label: "GCash" },
  { value: "CASH", label: "Cash" },
  { value: "CHECK", label: "Check" },
  { value: "CARD", label: "Card" },
] as const

export type AccountingPaymentMethod = (typeof ACCOUNTING_PAYMENT_METHODS)[number]["value"]

export function isAccountingPaymentMethod(value: string): value is AccountingPaymentMethod {
  return ACCOUNTING_PAYMENT_METHODS.some((method) => method.value === value)
}

export function formatAccountingPaymentMethod(value: AccountingPaymentMethod) {
  return ACCOUNTING_PAYMENT_METHODS.find((method) => method.value === value)?.label ?? value
}
