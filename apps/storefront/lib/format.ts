const pesoFormatter = new Intl.NumberFormat("en-PH")

const shortDateFormatter = new Intl.DateTimeFormat("en-PH", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

export function formatPeso(value: number) {
  return `₱${pesoFormatter.format(value)}`
}

export function formatShortDate(value: Date | string) {
  return shortDateFormatter.format(new Date(value))
}
