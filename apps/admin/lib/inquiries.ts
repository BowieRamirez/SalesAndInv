import { Prisma, prisma } from "@furnitrack/db"
import type { AccountingPaymentMethod } from "@/lib/accounting-payment-methods"

const COMPLETED_MARKER = "[[completed]]"
const SHIP_AT_PREFIX = "[[ship_at:"
const PAYMENT_METHOD_PREFIX = "[[payment_method:"
const PAYMENT_STATUS_PREFIX = "[[payment_status:"
const PAID_AMOUNT_PREFIX = "[[paid_amount:"
const SHIP_AT_PATTERN = /\[\[ship_at:([^\]]+)\]\]/i
const PAYMENT_METHOD_PATTERN = /\[\[payment_method:([^\]]+)\]\]/i
const PAYMENT_STATUS_PATTERN = /\[\[payment_status:([^\]]+)\]\]/i
const PAID_AMOUNT_PATTERN = /\[\[paid_amount:([^\]]+)\]\]/i

export type InquiryPaymentStatus = "PENDING" | "DOWN_PAYMENT" | "PARTIALLY_PAID" | "FULLY_PAID" | "REJECTED"

type InquiryBaseRow = {
  id: string
  productName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  message: string
  status: string
  statusNote: string | null
  total: Prisma.Decimal | number | string | null
  createdAt: Date
  updatedAt: Date
}

export type InquiryWorkflowStage =
  | "RECEIVED"
  | "PENDING_INVENTORY_APPROVAL"
  | "PENDING_ACCOUNTING_APPROVAL"
  | "GETTING_READY_FOR_BUILDING"
  | "READY_FOR_SHIPPING"
  | "COMPLETED"

export type InquiryWorkflowRow = InquiryBaseRow & {
  workflowStatus: InquiryWorkflowStage
  workflowNote: string | null
  shippingScheduledAt: Date | null
  paymentMethod: AccountingPaymentMethod | null
  total: number
  downPaymentRequired: number
  paid: number
  remainingBalance: number
  paymentStatus: InquiryPaymentStatus
  paymentReviewStatus: "PENDING" | "APPROVED" | "REJECTED"
}

function hasCompletedMarker(note: string | null) {
  return typeof note === "string" && note.includes(COMPLETED_MARKER)
}

function getShipAtMarker(note: string | null) {
  if (!note) {
    return null
  }

  const match = note.match(SHIP_AT_PATTERN)
  return match?.[1] ?? null
}

function parseShipAt(note: string | null) {
  const value = getShipAtMarker(note)

  if (!value) {
    return null
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function parsePaymentMethod(note: string | null) {
  if (!note) {
    return null
  }

  const match = note.match(PAYMENT_METHOD_PATTERN)
  return (match?.[1] as AccountingPaymentMethod | undefined) ?? null
}

function parsePaymentStatus(note: string | null, workflowStatus?: InquiryWorkflowStage): InquiryPaymentStatus {
  if (!note) {
    return workflowStatus === "PENDING_ACCOUNTING_APPROVAL" ? "PENDING" : "FULLY_PAID"
  }

  const match = note.match(PAYMENT_STATUS_PATTERN)
  const status = match?.[1]

  if (
    status === "PENDING" ||
    status === "DOWN_PAYMENT" ||
    status === "PARTIALLY_PAID" ||
    status === "FULLY_PAID" ||
    status === "REJECTED"
  ) {
    return status
  }

  return workflowStatus === "PENDING_ACCOUNTING_APPROVAL" ? "PENDING" : "FULLY_PAID"
}

function parsePaidAmount(note: string | null) {
  if (!note) {
    return null
  }

  const match = note.match(PAID_AMOUNT_PATTERN)
  const amount = Number(match?.[1])

  return Number.isFinite(amount) ? amount : null
}

function toNumber(value: Prisma.Decimal | number | string | null | undefined) {
  if (value == null) {
    return 0
  }

  return Number(value)
}

function getBalanceFields(
  totalValue: Prisma.Decimal | number | string | null,
  paymentStatus: InquiryPaymentStatus,
  paidAmount: number | null,
) {
  const total = toNumber(totalValue)
  const downPaymentRequired = total * 0.3
  const paid =
    paidAmount != null
      ? Math.min(Math.max(paidAmount, 0), total)
      : paymentStatus === "FULLY_PAID"
      ? total
      : paymentStatus === "PARTIALLY_PAID"
        ? Math.max(downPaymentRequired, total * 0.5)
        : paymentStatus === "DOWN_PAYMENT"
          ? downPaymentRequired
          : 0
  const remainingBalance = Math.max(total - paid, 0)

  return {
    total,
    downPaymentRequired,
    paid,
    remainingBalance,
  }
}

function stripWorkflowMarkers(note: string | null) {
  if (!note) {
    return null
  }

  return note
    .replace(COMPLETED_MARKER, "")
    .replace(SHIP_AT_PATTERN, "")
    .replace(PAYMENT_METHOD_PATTERN, "")
    .replace(PAYMENT_STATUS_PATTERN, "")
    .replace(PAID_AMOUNT_PATTERN, "")
    .trim() || null
}

function resolveWorkflowStatus(status: string, note: string | null): InquiryWorkflowStage {
  if (hasCompletedMarker(note)) {
    return "COMPLETED"
  }

  switch (status) {
    case "RECEIVED":
      return "RECEIVED"
    case "ACCEPTED":
    case "PENDING_INVENTORY_APPROVAL":
      return "PENDING_INVENTORY_APPROVAL"
    case "WAITING_FOR_PAYMENT":
    case "PENDING_ACCOUNTING_APPROVAL":
      return "PENDING_ACCOUNTING_APPROVAL"
    case "GETTING_READY_FOR_BUILDING":
      return "GETTING_READY_FOR_BUILDING"
    case "READY_FOR_SHIPPING":
    case "READY_FOR_SHIPMENT":
      return "READY_FOR_SHIPPING"
    case "COMPLETED":
      return "COMPLETED"
    default:
      return "RECEIVED"
  }
}

function toWorkflowRows(rows: InquiryBaseRow[]): InquiryWorkflowRow[] {
  return rows.map((row) => {
    const workflowStatus = resolveWorkflowStatus(row.status, row.statusNote)
    const paymentStatus = parsePaymentStatus(row.statusNote, workflowStatus)
    const balanceFields = getBalanceFields(row.total, paymentStatus, parsePaidAmount(row.statusNote))

    const paymentReviewStatus: InquiryWorkflowRow["paymentReviewStatus"] =
      paymentStatus === "REJECTED"
        ? "REJECTED"
        : workflowStatus === "PENDING_ACCOUNTING_APPROVAL"
          ? "PENDING"
          : "APPROVED"

    return {
      ...row,
      ...balanceFields,
      workflowStatus,
      workflowNote: stripWorkflowMarkers(row.statusNote),
      shippingScheduledAt: parseShipAt(row.statusNote),
      paymentMethod: parsePaymentMethod(row.statusNote),
      paymentStatus,
      paymentReviewStatus,
    }
  })
}

export async function getInquiryWorkflowRows(stages?: readonly InquiryWorkflowStage[]) {
  const rows = await prisma.$queryRaw<InquiryBaseRow[]>(Prisma.sql`
    SELECT
      ci.id,
      p.name AS "productName",
      ci."customerName",
      ci."customerEmail",
      ci."customerPhone",
      ci.message,
      ci.status::text AS status,
      ci."statusNote",
      p.price AS total,
      ci."createdAt",
      ci."updatedAt"
    FROM public.customer_inquiries ci
    INNER JOIN public.products p
      ON p.id = ci."productId"
    ORDER BY ci."updatedAt" DESC, ci."createdAt" DESC /* bust_v3 */
  `)

  const workflowRows = toWorkflowRows(rows)

  if (!stages || stages.length === 0) {
    return workflowRows
  }

  return workflowRows.filter((row) => stages.includes(row.workflowStatus))
}

function withCompletedMarker(note: string | null) {
  const cleanNote = stripWorkflowMarkers(note)
  const paymentMethod = parsePaymentMethod(note)
  const paymentStatus = parsePaymentStatus(note)
  const paidAmount = parsePaidAmount(note)
  const noteWithPaymentMethod = withPaymentMethodMarker(cleanNote, paymentMethod, paymentStatus, paidAmount)
  return noteWithPaymentMethod ? `${COMPLETED_MARKER} ${noteWithPaymentMethod}` : COMPLETED_MARKER
}

function withShipAtMarker(note: string | null, shippingScheduledAt: Date | null) {
  const cleanNote = stripWorkflowMarkers(note)
  const paymentMethod = parsePaymentMethod(note)
  const paymentStatus = parsePaymentStatus(note)
  const paidAmount = parsePaidAmount(note)

  if (!shippingScheduledAt) {
    return withPaymentMethodMarker(cleanNote, paymentMethod, paymentStatus, paidAmount)
  }

  const scheduleMarker = `${SHIP_AT_PREFIX}${shippingScheduledAt.toISOString()}]]`
  const noteWithPaymentMethod = withPaymentMethodMarker(cleanNote, paymentMethod, paymentStatus, paidAmount)
  return noteWithPaymentMethod ? `${scheduleMarker} ${noteWithPaymentMethod}` : scheduleMarker
}

function withPaymentMethodMarker(
  note: string | null,
  paymentMethod: AccountingPaymentMethod | null,
  paymentStatus: InquiryPaymentStatus | null = null,
  paidAmount: number | null = null,
) {
  const cleanNote = stripWorkflowMarkers(note)
  const markers = [
    paymentMethod ? `${PAYMENT_METHOD_PREFIX}${paymentMethod}]]` : null,
    paymentStatus ? `${PAYMENT_STATUS_PREFIX}${paymentStatus}]]` : null,
    paidAmount != null ? `${PAID_AMOUNT_PREFIX}${paidAmount}]]` : null,
  ].filter(Boolean)

  if (markers.length === 0) {
    return cleanNote
  }

  const markerText = markers.join(" ")
  return cleanNote ? `${markerText} ${cleanNote}` : markerText
}

export async function updateInquiryWorkflowStatus(params: {
  inquiryId: string
  expectedStages: readonly InquiryWorkflowStage[]
  nextStage: InquiryWorkflowStage
  statusNote: string | null
  shippingScheduledAt?: Date | null
  paymentMethod?: AccountingPaymentMethod | null
  paymentStatus?: InquiryPaymentStatus | null
  paidAmount?: number | null
}) {
  const {
    inquiryId,
    expectedStages,
    nextStage,
    statusNote,
    shippingScheduledAt = null,
    paymentMethod = null,
    paymentStatus = null,
    paidAmount = null,
  } = params

  if (expectedStages.length === 0) {
    return 0
  }

  const currentRows = await getInquiryWorkflowRows(expectedStages)
  const currentRow = currentRows.find((row) => row.id === inquiryId)

  if (!currentRow) {
    return 0
  }

  let nextStoredStatus = currentRow.status
  let nextStoredNote = statusNote

  switch (nextStage) {
    case "PENDING_INVENTORY_APPROVAL":
      nextStoredStatus = "ACCEPTED"
      nextStoredNote = stripWorkflowMarkers(statusNote)
      break
    case "PENDING_ACCOUNTING_APPROVAL":
      nextStoredStatus = "WAITING_FOR_PAYMENT"
      nextStoredNote = withPaymentMethodMarker(statusNote, paymentMethod, paymentStatus, paidAmount)
      break
    case "GETTING_READY_FOR_BUILDING":
      nextStoredStatus = "GETTING_READY_FOR_BUILDING"
      nextStoredNote = withPaymentMethodMarker(statusNote, paymentMethod, paymentStatus, paidAmount)
      break
    case "READY_FOR_SHIPPING":
      nextStoredStatus = "READY_FOR_SHIPMENT"
      nextStoredNote = withShipAtMarker(
        withPaymentMethodMarker(statusNote, currentRow.paymentMethod, currentRow.paymentStatus, currentRow.paid),
        shippingScheduledAt,
      )
      break
    case "COMPLETED":
      if (!currentRow.shippingScheduledAt) {
        throw new Error("Shipping schedule is required before completing this order.")
      }

      if (currentRow.paymentStatus !== "FULLY_PAID") {
        throw new Error("This order cannot be shipped until accounting marks the payment as fully paid.")
      }

      if (currentRow.shippingScheduledAt.getTime() > Date.now()) {
        throw new Error("This order cannot be marked complete before the scheduled shipping time.")
      }

      nextStoredStatus = "READY_FOR_SHIPMENT"
      nextStoredNote = withCompletedMarker(
        withShipAtMarker(
          withPaymentMethodMarker(statusNote, currentRow.paymentMethod, currentRow.paymentStatus, currentRow.paid),
          currentRow.shippingScheduledAt,
        ),
      )
      break
    case "RECEIVED":
    default:
      nextStoredStatus = "RECEIVED"
      nextStoredNote = stripWorkflowMarkers(statusNote)
      break
  }

  return prisma.$executeRaw(Prisma.sql`
    UPDATE public.customer_inquiries
    SET
      status = ${nextStoredStatus}::"InquiryStatus",
      "statusNote" = ${nextStoredNote},
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = ${inquiryId}
  `)
}

export async function setInquiryShippingSchedule(params: {
  inquiryId: string
  statusNote: string | null
  shippingScheduledAt: Date
}) {
  const { inquiryId, statusNote, shippingScheduledAt } = params
  const currentRows = await getInquiryWorkflowRows(["READY_FOR_SHIPPING"])
  const currentRow = currentRows.find((row) => row.id === inquiryId)

  if (!currentRow) {
    return 0
  }

  const nextStoredNote = withShipAtMarker(
    withPaymentMethodMarker(statusNote, currentRow.paymentMethod, currentRow.paymentStatus, currentRow.paid),
    shippingScheduledAt,
  )

  return prisma.$executeRaw(Prisma.sql`
    UPDATE public.customer_inquiries
    SET
      status = 'READY_FOR_SHIPMENT'::"InquiryStatus",
      "statusNote" = ${nextStoredNote},
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = ${inquiryId}
  `)
}

export async function updateInquiryPaymentFollowUp(params: {
  inquiryId: string
  statusNote: string | null
  paidAmount: number
}) {
  const { inquiryId, statusNote, paidAmount } = params
  const currentRows = await getInquiryWorkflowRows()
  const currentRow = currentRows.find(
    (row) => row.id === inquiryId && ["DOWN_PAYMENT", "PARTIALLY_PAID"].includes(row.paymentStatus),
  )

  if (!currentRow) {
    return 0
  }

  const nextPaidAmount = Math.min(Math.max(paidAmount, 0), currentRow.total)
  const nextPaymentStatus: InquiryPaymentStatus =
    nextPaidAmount >= currentRow.total
      ? "FULLY_PAID"
      : nextPaidAmount > currentRow.downPaymentRequired
        ? "PARTIALLY_PAID"
        : "DOWN_PAYMENT"
  const nextStoredNote = withShipAtMarker(
    withPaymentMethodMarker(statusNote, currentRow.paymentMethod, nextPaymentStatus, nextPaidAmount),
    currentRow.shippingScheduledAt,
  )

  return prisma.$executeRaw(Prisma.sql`
    UPDATE public.customer_inquiries
    SET
      "statusNote" = ${nextStoredNote},
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = ${inquiryId}
  `)
}
