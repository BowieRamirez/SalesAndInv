import { Prisma, prisma } from "@furnitrack/db"

const COMPLETED_MARKER = "[[completed]]"
const SHIP_AT_PREFIX = "[[ship_at:"
const SHIP_AT_PATTERN = /\[\[ship_at:([^\]]+)\]\]/i

type InquiryBaseRow = {
  id: string
  productName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  message: string
  status: string
  statusNote: string | null
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

function stripWorkflowMarkers(note: string | null) {
  if (!note) {
    return null
  }

  return note
    .replace(COMPLETED_MARKER, "")
    .replace(SHIP_AT_PATTERN, "")
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

function toWorkflowRows(rows: InquiryBaseRow[]) {
  return rows.map((row) => ({
    ...row,
    workflowStatus: resolveWorkflowStatus(row.status, row.statusNote),
    workflowNote: stripWorkflowMarkers(row.statusNote),
    shippingScheduledAt: parseShipAt(row.statusNote),
  }))
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
      ci."createdAt",
      ci."updatedAt"
    FROM public.customer_inquiries ci
    INNER JOIN public.products p
      ON p.id = ci."productId"
    ORDER BY ci."updatedAt" DESC, ci."createdAt" DESC
  `)

  const workflowRows = toWorkflowRows(rows)

  if (!stages || stages.length === 0) {
    return workflowRows
  }

  return workflowRows.filter((row) => stages.includes(row.workflowStatus))
}

function withCompletedMarker(note: string | null) {
  const cleanNote = stripWorkflowMarkers(note)
  return cleanNote ? `${COMPLETED_MARKER} ${cleanNote}` : COMPLETED_MARKER
}

function withShipAtMarker(note: string | null, shippingScheduledAt: Date | null) {
  const cleanNote = stripWorkflowMarkers(note)

  if (!shippingScheduledAt) {
    return cleanNote
  }

  const scheduleMarker = `${SHIP_AT_PREFIX}${shippingScheduledAt.toISOString()}]]`
  return cleanNote ? `${scheduleMarker} ${cleanNote}` : scheduleMarker
}

export async function updateInquiryWorkflowStatus(params: {
  inquiryId: string
  expectedStages: readonly InquiryWorkflowStage[]
  nextStage: InquiryWorkflowStage
  statusNote: string | null
  shippingScheduledAt?: Date | null
}) {
  const { inquiryId, expectedStages, nextStage, statusNote, shippingScheduledAt = null } = params

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
      nextStoredNote = stripWorkflowMarkers(statusNote)
      break
    case "GETTING_READY_FOR_BUILDING":
      nextStoredStatus = "GETTING_READY_FOR_BUILDING"
      nextStoredNote = stripWorkflowMarkers(statusNote)
      break
    case "READY_FOR_SHIPPING":
      nextStoredStatus = "READY_FOR_SHIPMENT"
      nextStoredNote = withShipAtMarker(statusNote, shippingScheduledAt)
      break
    case "COMPLETED":
      if (!currentRow.shippingScheduledAt) {
        throw new Error("Shipping schedule is required before completing this order.")
      }

      if (currentRow.shippingScheduledAt.getTime() > Date.now()) {
        throw new Error("This order cannot be marked complete before the scheduled shipping time.")
      }

      nextStoredStatus = "READY_FOR_SHIPMENT"
      nextStoredNote = withCompletedMarker(withShipAtMarker(statusNote, currentRow.shippingScheduledAt))
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

  const nextStoredNote = withShipAtMarker(statusNote, shippingScheduledAt)

  return prisma.$executeRaw(Prisma.sql`
    UPDATE public.customer_inquiries
    SET
      status = 'READY_FOR_SHIPMENT'::"InquiryStatus",
      "statusNote" = ${nextStoredNote},
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = ${inquiryId}
  `)
}
