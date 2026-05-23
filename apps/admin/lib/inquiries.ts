import { randomUUID } from "node:crypto"
import { Prisma, prisma } from "@furnitrack/db"
import type { AccountingPaymentMethod } from "@/lib/accounting-payment-methods"

const COMPLETED_MARKER = "[[completed]]"
const SHIP_AT_PREFIX = "[[ship_at:"
const PAYMENT_METHOD_PREFIX = "[[payment_method:"
const PAYMENT_STATUS_PREFIX = "[[payment_status:"
const PAID_AMOUNT_PREFIX = "[[paid_amount:"
const CUSTOMER_PAID_METHOD_PREFIX = "[[customer_paid_method:"
const CUSTOMER_PAID_NOTE_PREFIX = "[[customer_paid_note:"
const SHIP_AT_PATTERN = /\[\[ship_at:([^\]]+)\]\]/i
const PAYMENT_METHOD_PATTERN = /\[\[payment_method:([^\]]+)\]\]/i
const PAYMENT_STATUS_PATTERN = /\[\[payment_status:([^\]]+)\]\]/i
const PAID_AMOUNT_PATTERN = /\[\[paid_amount:([^\]]+)\]\]/i
const CUSTOMER_PAID_METHOD_PATTERN = /\[\[customer_paid_method:([^\]]+)\]\]/i
const CUSTOMER_PAID_NOTE_PATTERN = /\[\[customer_paid_note:([^\]]+)\]\]/i

export type InquiryPaymentStatus = "PENDING" | "DOWN_PAYMENT" | "PARTIALLY_PAID" | "FULLY_PAID" | "REJECTED"

type InquiryBaseRow = {
  id: string
  inquiryNumber: string | null
  productName: string
  productBadge: string | null
  productOriginalPrice: Prisma.Decimal | number | string | null
  customerName: string
  customerEmail: string
  customerPhone: string
  message: string
  status: string
  statusNote: string | null
  total: Prisma.Decimal | number | string | null
  quotedPrice: Prisma.Decimal | number | string | null
  quotationAccepted: boolean | null
  quotationDeclineReason: string | null
  quotationRevisionCount: number
  quotationDiscount: Prisma.Decimal | number | string | null
  quotedPriceBeforeDiscount: Prisma.Decimal | number | string | null
  createdAt: Date
  updatedAt: Date
  latestPaymentNumber: string | null
  latestPaymentStatus: string | null
  latestPaymentMethod: string | null
  latestPaymentAmount: Prisma.Decimal | number | string | null
  latestPaymentRemaining: Prisma.Decimal | number | string | null
  latestPaymentVerifiedAt: Date | null
  pendingPaymentAmount: Prisma.Decimal | number | string | null
  pendingPaymentRemaining: Prisma.Decimal | number | string | null
}

export type InquiryWorkflowStage =
  | "RECEIVED"
  | "PENDING_INVENTORY_APPROVAL"
  | "PENDING_SALES_QUOTATION"
  | "PENDING_ACCOUNTING_APPROVAL"
  | "GETTING_READY_FOR_BUILDING"
  | "READY_FOR_SHIPPING"
  | "COMPLETED"

export type InquiryWorkflowRow = Omit<
  InquiryBaseRow,
  "latestPaymentAmount" | "latestPaymentRemaining"
> & {
  workflowStatus: InquiryWorkflowStage
  workflowNote: string | null
  shippingScheduledAt: Date | null
  paymentMethod: AccountingPaymentMethod | null
  total: number
  quotedPrice: number | null
  quotationAccepted: boolean | null
  quotationDeclineReason: string | null
  quotationRevisionCount: number
  quotationDiscount: number
  quotedPriceBeforeDiscount: number | null
  productOriginalPrice: number | null
  productBadge: string | null
  downPaymentRequired: number
  paid: number
  remainingBalance: number
  paymentStatus: InquiryPaymentStatus
  paymentReviewStatus: "PENDING" | "APPROVED" | "REJECTED"
  customerPaidMethod: string | null
  customerPaidNote: string | null
  // Convenience accessors derived from the joined payment_records row (if any)
  paymentNumber: string | null
  paymentVerifiedAt: Date | null
  // Decimal columns from SQL get converted to plain numbers before crossing
  // the server -> client boundary
  latestPaymentAmount: number | null
  latestPaymentRemaining: number | null
  // Pending payment amounts (customer submitted, not yet confirmed)
  pendingPaymentAmount: number | null
  pendingPaymentRemaining: number | null
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

function parseCustomerPaidMethod(note: string | null): string | null {
  if (!note) return null
  const match = note.match(CUSTOMER_PAID_METHOD_PATTERN)
  return match?.[1] ?? null
}

function parseCustomerPaidNote(note: string | null): string | null {
  if (!note) return null
  const match = note.match(CUSTOMER_PAID_NOTE_PATTERN)
  return match?.[1] ? decodeURIComponent(match[1]) : null
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
    .replace(CUSTOMER_PAID_METHOD_PATTERN, "")
    .replace(CUSTOMER_PAID_NOTE_PATTERN, "")
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
    case "PENDING_SALES_QUOTATION":
      return "PENDING_SALES_QUOTATION"
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

    // Prefer the real payment_records row when present; fall back to marker parsing.
    const hasRealPayment = row.latestPaymentNumber !== null
    const realPaymentMethod = (row.latestPaymentMethod ?? null) as
      | AccountingPaymentMethod
      | null

    // Use VERIFIED amounts for confirmed balance; fall back to PENDING amounts for unconfirmed submissions
    const realPaid =
      row.latestPaymentAmount != null
        ? Number(row.latestPaymentAmount)
        : row.pendingPaymentAmount != null
          ? Number(row.pendingPaymentAmount)
          : null
    const realRemaining =
      row.latestPaymentRemaining != null
        ? Number(row.latestPaymentRemaining)
        : row.pendingPaymentRemaining != null
          ? Number(row.pendingPaymentRemaining)
          : null

    // Derive paymentStatus: if a verified record exists, use FULLY_PAID/DOWN_PAYMENT
    // based on the remaining balance; otherwise parse from markers.
    // When there's also a PENDING row on top of a VERIFIED one (customer submitted
    // their balance payment), keep the status as DOWN_PAYMENT/PARTIALLY_PAID so the
    // follow-up table still shows the order as having a balance — the button enablement
    // is driven by latestPaymentStatus, not paymentStatus.
    let paymentStatus: InquiryPaymentStatus
    if (hasRealPayment && row.latestPaymentAmount !== null) {
      // latestPaymentAmount/Remaining come from the VERIFIED row (balance facts)
      // Use a small tolerance (< ₱1) to handle floating-point precision from quotedPrice * 1.12
      paymentStatus = (realRemaining ?? 0) < 1 ? "FULLY_PAID" : "DOWN_PAYMENT"
    } else if (hasRealPayment && row.latestPaymentStatus === "PENDING") {
      // Only a PENDING row exists, no VERIFIED row yet — still awaiting initial confirmation
      paymentStatus = "PENDING"
    } else if (hasRealPayment && row.latestPaymentStatus === "REJECTED") {
      paymentStatus = "REJECTED"
    } else {
      paymentStatus = parsePaymentStatus(row.statusNote, workflowStatus)
    }

    const balanceFields = (() => {
      if (hasRealPayment && realPaid !== null && realRemaining !== null) {
        // Use quotedPrice (VAT-inclusive) as the effective total when available
        const effectiveBase = row.quotedPrice != null ? Number(row.quotedPrice) : Number(row.total ?? 0)
        const effectiveTotal = effectiveBase * 1.12  // VAT-inclusive
        const downPaymentRequired = effectiveTotal * 0.7
        // Clamp tiny floating-point remainders (< ₱1) to 0
        const clampedRemaining = realRemaining < 1 ? 0 : realRemaining
        return {
          total: effectiveBase,
          downPaymentRequired,
          paid: realPaid,
          remainingBalance: clampedRemaining,
        }
      }
      // Fall back to catalog price if no quotation
      const effectiveBase = row.quotedPrice != null ? Number(row.quotedPrice) : Number(row.total ?? 0)
      return getBalanceFields(effectiveBase * 1.12, paymentStatus, parsePaidAmount(row.statusNote))
    })()

    const paymentReviewStatus: InquiryWorkflowRow["paymentReviewStatus"] =
      paymentStatus === "REJECTED"
        ? "REJECTED"
        : workflowStatus === "PENDING_ACCOUNTING_APPROVAL"
          ? "PENDING"
          : "APPROVED"

    // Build an explicit, plain-object output. We don't spread `...row` here on
    // purpose — the SELECT pulls Prisma.Decimal columns (total, latestPaymentAmount,
    // latestPaymentRemaining) and Server Components can't pass Decimal instances
    // through to Client Components.
    return {
      // Identity / display fields (already plain types from SQL)
      id: row.id,
      inquiryNumber: row.inquiryNumber,
      productName: row.productName,
      productBadge: row.productBadge,
      productOriginalPrice: row.productOriginalPrice == null ? null : Number(row.productOriginalPrice),
      customerName: row.customerName,
      customerEmail: row.customerEmail,
      customerPhone: row.customerPhone,
      message: row.message,
      status: row.status,
      statusNote: row.statusNote,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      quotedPrice: row.quotedPrice == null ? null : Number(row.quotedPrice),
      quotationAccepted: row.quotationAccepted ?? null,
      quotationDeclineReason: row.quotationDeclineReason ?? null,
      quotationRevisionCount: row.quotationRevisionCount ?? 0,
      quotationDiscount: row.quotationDiscount == null ? 0 : Number(row.quotationDiscount),
      quotedPriceBeforeDiscount: row.quotedPriceBeforeDiscount == null ? null : Number(row.quotedPriceBeforeDiscount),
      // Latest payment_records linkage (kept for downstream consumers; converted
      // to plain primitives so they survive the server -> client boundary)
      latestPaymentNumber: row.latestPaymentNumber,
      latestPaymentStatus: row.latestPaymentStatus,
      latestPaymentMethod: row.latestPaymentMethod,
      latestPaymentAmount: row.latestPaymentAmount == null ? null : Number(row.latestPaymentAmount),
      latestPaymentRemaining: row.latestPaymentRemaining == null ? null : Number(row.latestPaymentRemaining),
      latestPaymentVerifiedAt: row.latestPaymentVerifiedAt,
      pendingPaymentAmount: row.pendingPaymentAmount == null ? null : Number(row.pendingPaymentAmount),
      pendingPaymentRemaining: row.pendingPaymentRemaining == null ? null : Number(row.pendingPaymentRemaining),
      // Derived workflow fields
      ...balanceFields,
      workflowStatus,
      workflowNote: stripWorkflowMarkers(row.statusNote),
      shippingScheduledAt: parseShipAt(row.statusNote),
      paymentMethod: realPaymentMethod ?? parsePaymentMethod(row.statusNote),
      paymentStatus,
      paymentReviewStatus,
      customerPaidMethod: parseCustomerPaidMethod(row.statusNote),
      customerPaidNote: parseCustomerPaidNote(row.statusNote),
      paymentNumber: row.latestPaymentNumber,
      paymentVerifiedAt: row.latestPaymentVerifiedAt,
    }
  })
}

export async function getInquiryWorkflowRows(stages?: readonly InquiryWorkflowStage[]) {
  const rows = await prisma.$queryRaw<InquiryBaseRow[]>(Prisma.sql`
    SELECT
      ci.id,
      ci."inquiryNumber",
      p.name AS "productName",
      p.badge AS "productBadge",
      p."originalPrice" AS "productOriginalPrice",
      ci."customerName",
      ci."customerEmail",
      ci."customerPhone",
      ci.message,
      ci.status::text AS status,
      ci."statusNote",
      p.price AS total,
      ci."quotedPrice",
      ci."quotationAccepted",
      ci."quotationDeclineReason",
      COALESCE(ci."quotationRevisionCount", 0)::int AS "quotationRevisionCount",
      COALESCE(ci."quotationDiscount", 0) AS "quotationDiscount",
      ci."quotedPriceBeforeDiscount",
      ci."createdAt",
      ci."updatedAt",
      -- For balance/amount tracking: use the most recent VERIFIED row
      -- (this represents what has actually been confirmed as received)
      COALESCE(pr_pending."paymentNumber", pr_verified."paymentNumber") AS "latestPaymentNumber",
      COALESCE(pr_pending.status::text, pr_verified.status::text) AS "latestPaymentStatus",
      COALESCE(pr_pending."paymentMethod", pr_verified."paymentMethod") AS "latestPaymentMethod",
      pr_verified.amount AS "latestPaymentAmount",
      pr_verified."remainingBalance" AS "latestPaymentRemaining",
      pr_verified."verifiedAt" AS "latestPaymentVerifiedAt",
      -- Pending row amounts (what the customer has submitted but accounting hasn't confirmed)
      pr_pending.amount AS "pendingPaymentAmount",
      pr_pending."remainingBalance" AS "pendingPaymentRemaining"
    FROM public.customer_inquiries ci
    INNER JOIN public.products p
      ON p.id = ci."productId"
    -- Most recent VERIFIED row: source of truth for paid amount and remaining balance
    LEFT JOIN LATERAL (
      SELECT
        pr."paymentNumber",
        pr.status,
        pr."paymentMethod",
        pr.amount,
        pr."remainingBalance",
        pr."verifiedAt"
      FROM public.payment_records pr
      WHERE pr."inquiryId" = ci.id
        AND pr.status = 'VERIFIED'::"PaymentStatus"
      ORDER BY pr."verifiedAt" DESC, pr."createdAt" DESC
      LIMIT 1
    ) pr_verified ON TRUE
    -- Most recent PENDING row: signals customer has submitted and accounting needs to act
    LEFT JOIN LATERAL (
      SELECT
        pr."paymentNumber",
        pr.status,
        pr."paymentMethod",
        pr.amount,
        pr."remainingBalance"
      FROM public.payment_records pr
      WHERE pr."inquiryId" = ci.id
        AND pr.status = 'PENDING'::"PaymentStatus"
      ORDER BY pr."createdAt" DESC
      LIMIT 1
    ) pr_pending ON TRUE
    ORDER BY ci."updatedAt" DESC, ci."createdAt" DESC /* bust_v6 */
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

function withCustomerPaymentMarkers(
  note: string | null,
  customerPaidMethod: string,
  customerPaidNote: string | null,
) {
  // Preserve existing workflow markers (payment method, status, amounts)
  const paymentMethod = parsePaymentMethod(note)
  const paymentStatus = parsePaymentStatus(note)
  const paidAmount = parsePaidAmount(note)
  const cleanNote = stripWorkflowMarkers(note)

  const markers = [
    paymentMethod ? `${PAYMENT_METHOD_PREFIX}${paymentMethod}]]` : null,
    paymentStatus ? `${PAYMENT_STATUS_PREFIX}${paymentStatus}]]` : null,
    paidAmount != null ? `${PAID_AMOUNT_PREFIX}${paidAmount}]]` : null,
    `${CUSTOMER_PAID_METHOD_PREFIX}${customerPaidMethod}]]`,
    customerPaidNote
      ? `${CUSTOMER_PAID_NOTE_PREFIX}${encodeURIComponent(customerPaidNote)}]]`
      : null,
  ].filter(Boolean)

  const markerText = markers.join(" ")
  return cleanNote ? `${markerText} ${cleanNote}` : markerText
}export async function updateInquiryWorkflowStatus(params: {
  inquiryId: string
  expectedStages: readonly InquiryWorkflowStage[]
  nextStage: InquiryWorkflowStage
  statusNote: string | null
  shippingScheduledAt?: Date | null
  paymentMethod?: AccountingPaymentMethod | null
  paymentStatus?: InquiryPaymentStatus | null
  paidAmount?: number | null
  quotedPrice?: number | null
  actorId?: string | null
  actorRemarks?: string | null
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
    quotedPrice = null,
    actorId = null,
    actorRemarks = null,
  } = params

  if (expectedStages.length === 0) {
    return 0
  }

  const currentRows = await getInquiryWorkflowRows(expectedStages)
  const currentRow = currentRows.find((row) => row.id === inquiryId)

  if (!currentRow) {
    return 0
  }

  const fromStage = currentRow.workflowStatus

  let nextStoredStatus = currentRow.status
  let nextStoredNote = statusNote

  switch (nextStage) {
    case "PENDING_INVENTORY_APPROVAL":
      nextStoredStatus = "ACCEPTED"
      nextStoredNote = stripWorkflowMarkers(statusNote)
      break
    case "PENDING_SALES_QUOTATION":
      nextStoredStatus = "PENDING_SALES_QUOTATION"
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

  let autoMessage: string | null = null
  switch (nextStage) {
    case "PENDING_SALES_QUOTATION":
      autoMessage = "✅ Inventory has confirmed material availability for your order. Our sales team is preparing a quotation for you. You will receive it shortly — please review and accept or decline."
      break
    case "PENDING_ACCOUNTING_APPROVAL":
      autoMessage = "Your order materials have been approved by inventory. It is now waiting for accounting review."
      break
    case "GETTING_READY_FOR_BUILDING":
      autoMessage = "Payment confirmed! Your order is now getting ready for building."
      break
    case "READY_FOR_SHIPPING":
      autoMessage = "Your order is built and ready for shipping. We will set the shipping schedule soon."
      break
    case "COMPLETED":
      autoMessage = "Your order has been marked as complete. Thank you for shopping with FurniTrack!"
      break
  }

  return prisma.$transaction(async (tx) => {
    // Build per-stage column updates (only set the timestamp/actor for the stage we're entering)
    const stageColumnSql = (() => {
      switch (nextStage) {
        case "PENDING_INVENTORY_APPROVAL":
          // Sales endorsed → record sales review timestamp/actor
          return Prisma.sql`,
            "salesReviewedAt" = CURRENT_TIMESTAMP,
            "salesReviewedById" = ${actorId}`
        case "PENDING_SALES_QUOTATION":
          // Inventory approved → record inventory approval + quotation sent
          return Prisma.sql`,
            "inventoryApprovedAt" = CURRENT_TIMESTAMP,
            "inventoryApprovedById" = ${actorId},
            "quotationSentAt" = CURRENT_TIMESTAMP`
        case "PENDING_ACCOUNTING_APPROVAL":
          // Inventory approved → record inventory approval timestamp/actor
          return Prisma.sql`,
            "inventoryApprovedAt" = CURRENT_TIMESTAMP,
            "inventoryApprovedById" = ${actorId}`
        case "GETTING_READY_FOR_BUILDING":
          // Accounting confirmed payment → record accounting confirmation
          return Prisma.sql`,
            "accountingConfirmedAt" = CURRENT_TIMESTAMP,
            "accountingConfirmedById" = ${actorId}`
        case "READY_FOR_SHIPPING":
          // Operations approved build → record build approval; if shipping is being scheduled now, record that too
          return shippingScheduledAt
            ? Prisma.sql`,
              "buildApprovedAt" = COALESCE("buildApprovedAt", CURRENT_TIMESTAMP),
              "buildApprovedById" = COALESCE("buildApprovedById", ${actorId}),
              "shippingScheduledAt" = ${shippingScheduledAt}`
            : Prisma.sql`,
              "buildApprovedAt" = CURRENT_TIMESTAMP,
              "buildApprovedById" = ${actorId}`
        case "COMPLETED":
          return Prisma.sql`,
            "completedAt" = CURRENT_TIMESTAMP,
            "completedById" = ${actorId}`
        case "RECEIVED":
        default:
          return Prisma.sql``
      }
    })()

    const result = await tx.$executeRaw(Prisma.sql`
      UPDATE public.customer_inquiries
      SET
        status = ${nextStoredStatus}::"InquiryStatus",
        "statusNote" = ${nextStoredNote},
        "updatedAt" = CURRENT_TIMESTAMP,
        "quotedPrice" = CASE
          WHEN ${quotedPrice}::numeric IS NOT NULL THEN ${quotedPrice}::numeric
          ELSE "quotedPrice"
        END${stageColumnSql}
      WHERE id = ${inquiryId}
    `)

    if (autoMessage) {
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.order_chat_messages (id, inquiry_id, sender_user_id, sender_role, body)
        VALUES (${randomUUID()}, ${inquiryId}, NULL, 'SALES', ${autoMessage})
      `)
    }

    // When moving to PENDING_ACCOUNTING_APPROVAL, send three structured messages:
    // 1. Order summary with pricing breakdown
    // 2. Company contact & value proposition
    // 3. Terms and Conditions
    if (nextStage === "PENDING_ACCOUNTING_APPROVAL") {
      // Fetch the product price for the order summary
      const priceRows = await tx.$queryRaw<Array<{ productName: string; price: string }>>(Prisma.sql`
        SELECT p.name AS "productName", p.price::text AS price
        FROM public.customer_inquiries ci
        INNER JOIN public.products p ON p.id = ci."productId"
        WHERE ci.id = ${inquiryId}
        LIMIT 1
      `)
      const productName = priceRows[0]?.productName ?? "Your order"
      const basePrice = Number(priceRows[0]?.price ?? 0)
      const vatRate = 0.12
      const vatAmount = basePrice * vatRate
      const total = basePrice + vatAmount

      const formatPeso = (v: number) =>
        new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 2 }).format(v)

      // Message 1 — Order summary
      const orderSummaryMsg = [
        "📋 ORDER SUMMARY",
        "─────────────────────────────",
        `Product: ${productName}`,
        `Base price: ${formatPeso(basePrice)}`,
        `VAT (12%): ${formatPeso(vatAmount)}`,
        `─────────────────────────────`,
        `Total: ${formatPeso(total)}`,
        "",
        "A 70% down payment is required to begin production.",
        `Down payment (70%): ${formatPeso(total * 0.7)}`,
        `Remaining balance (30%): ${formatPeso(total * 0.3)}`,
        "",
        "Please review your order summary and proceed with payment to get started.",
      ].join("\n")

      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.order_chat_messages (id, inquiry_id, sender_user_id, sender_role, body)
        VALUES (${randomUUID()}, ${inquiryId}, NULL, 'SALES', ${orderSummaryMsg})
      `)

      // Message 2 — Company contact & value proposition
      const contactMsg = [
        "🏢 NEED TO CHANGE DESIGN? HAVE A BUDGET IN MIND?",
        "",
        "Let's bring your vision to life!",
        "",
        "1. Schedule a free consultation: Call or Viber us at 09165900555",
        "2. Visit our showroom: 001B Carlos cor Dizon St, San Bartolome, Novaliches, QC",
        "   (Open Mon–Fri 8 am to 5 pm)",
        "",
        "Feel free to visit our showroom to see the actual colors and materials we'll use, and to take advantage of additional discounts. We'll be very glad to accommodate your inquiry / request.",
        "",
        "─────────────────────────────",
        "WHEN YOU PROCEED TO ORDER WITH US, YOU'LL GET:",
        "",
        "✅ Each piece is the result of precision engineering and expert craftsmanship — built with E1 moisture-resistant boards, heavy-duty hardware, and premium finishes that last.",
        "",
        "✅ Expect fast turnaround (7–10 working days), nationwide delivery, and smart layouts that boost productivity.",
        "",
        "✅ We value trust and long-term relationships. That's why we offer free interior design consultations to ensure everything fits not just your space — but your people.",
        "",
        "✅ Create a modern space that impresses clients and energizes your team! Choose from trendy finishes, stylish combinations, and layouts that spark creativity.",
        "",
        "💬 Let's build your dream space together.",
        "Schedule a consultation, request a discount, or simply tell us what you need — we'll take care of the rest.",
        "",
        "📍 Showroom: 001B Carlos cor Dizon St, San Bartolome, Novaliches, QC",
        "📞 Call/Viber: 0906 015 5922",
        "🌐 www.queensartsandtrends.com",
      ].join("\n")

      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.order_chat_messages (id, inquiry_id, sender_user_id, sender_role, body)
        VALUES (${randomUUID()}, ${inquiryId}, NULL, 'SALES', ${contactMsg})
      `)

      // Message 3 — Terms and Conditions
      const termsMsg = [
        "📄 TERMS AND CONDITIONS",
        "",
        "1. PRICING AND PAYMENT TERMS",
        "1.1 Quotation price is VAT inclusive.",
        "1.2 Prices may vary without prior notice and shall not be considered final, unless and until this quotation proposal has been signed and accepted.",
        "1.3 Changes in design or specifications after approval of the proposal may be subject to price adjustment as the parties may agree.",
        "1.4 Quoted prices are based on current material costs, labor rates, and other relevant factors. Any significant changes in these factors may result in a revision of the quoted prices.",
        "1.5 Down Payment: A 70% down payment is required upon receipt of purchase order, unless otherwise agreed. The remaining 30% balance must be paid before the scheduled delivery date. Otherwise, delivery and installation shall be rescheduled if balance payment is NOT settled.",
        "1.6 Visayas and Mindanao: Remaining balance must be settled first before shipment to all provinces of Visayas and Mindanao; otherwise, delivery shall be rescheduled if balance payment is NOT settled.",
        "1.7 Payment Methods: Online Transfer, Bank Deposit, Cash, and Cheque.",
        "1.8 All cheques should be payable to Queens Arts and Trends Corp.",
        "",
        "2. PRODUCTION LEAD TIME AND DELIVERY",
        "2.1 Approval Process: All purchased orders require approval of shop drawings and/or summary of order (SOO) before production begins. The client must review and approve the SOO upon receipt. Failure to provide timely approval may result in a delay of the production schedule.",
        "2.2 Production will start upon receipt of signed Quotation, completion of Down Payment, and client's approval of SOO with affixed signature.",
        "2.3 Disclaimer: Weekends, holidays, and/or natural calamities that may cause delays of operations are not included in each set lead time. Lead time may extend due to availability of raw materials and/or site condition.",
        "2.4 Customized items: All customized items shall be delivered and installed within 7 to 10 working days.",
        "2.5 Sofas/Accent Chairs: All sofas and accent chairs shall be delivered within 3–4 weeks.",
        "2.6 Blinds and Operable Walls: Blinds shall be installed within 2 weeks, and operable walls shall be installed within 3–4 weeks.",
        "2.7 On-hand Items: All office chairs, filing cabinets, etc. shall be delivered within 3–5 working days.",
        "2.8 Site Condition: Site for installation must be clean, ready, and clear of any obstruction or debris before the scheduled delivery and installation to avoid delays, losses, or damages. We require photos of the area status to avoid delays and/or rescheduling.",
        "2.9 Free delivery: Purchased orders amounting ₱50,000 and above within Metro Manila.",
        "",
        "3. ADDITIONAL LEAD TIME FOR SHIPPING",
        "3.1 Visayas and Mindanao: All furniture deliveries to the Visayas and Mindanao regions are subject to an additional lead time of 5 to 7 working days beyond the standard delivery schedule.",
        "3.2 Shipping Delays: Any delays caused by the shipping provider or third-party courier services are beyond the control of the supplier.",
        "",
        "By proceeding with this order, you confirm that you have read, understood, and agreed to these Terms and Conditions.",
      ].join("\n")

      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.order_chat_messages (id, inquiry_id, sender_user_id, sender_role, body)
        VALUES (${randomUUID()}, ${inquiryId}, NULL, 'SALES', ${termsMsg})
      `)
    }

    // Append an approval_history row for traceability (only if we have an actor)
    if (actorId && Number(result) > 0 && fromStage !== nextStage) {
      const action: "SUBMITTED" | "APPROVED" | "FINALIZED" =
        nextStage === "COMPLETED" ? "FINALIZED" : "APPROVED"

      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.approval_history (id, module, "recordId", action, "fromStatus", "toStatus", remarks, "actedById", "actedAt")
        VALUES (
          ${randomUUID()},
          'CUSTOMER_INQUIRY'::"ApprovalModule",
          ${inquiryId},
          ${action}::"ApprovalAction",
          ${fromStage},
          ${nextStage},
          ${actorRemarks},
          ${actorId},
          CURRENT_TIMESTAMP
        )
      `)
    }

    return result
  })
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

  return prisma.$transaction(async (tx) => {
    const result = await tx.$executeRaw(Prisma.sql`
      UPDATE public.customer_inquiries
      SET
        status = 'READY_FOR_SHIPMENT'::"InquiryStatus",
        "statusNote" = ${nextStoredNote},
        "shippingScheduledAt" = ${shippingScheduledAt},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${inquiryId}
    `)

    await tx.$executeRaw(Prisma.sql`
      INSERT INTO public.order_chat_messages (id, inquiry_id, sender_user_id, sender_role, body)
      VALUES (${randomUUID()}, ${inquiryId}, NULL, 'SALES', 'Shipping schedule has been set for this order.')
    `)

    return result
  })
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

export async function setCustomerPayment(params: {
  inquiryId: string
  customerUserId: string
  customerPaidMethod: string
  customerPaidNote: string | null
}) {
  const { inquiryId, customerUserId, customerPaidMethod, customerPaidNote } = params

  // Fetch the current inquiry row, restricted to PENDING_ACCOUNTING_APPROVAL stage
  const currentRows = await getInquiryWorkflowRows(["PENDING_ACCOUNTING_APPROVAL"])
  const currentRow = currentRows.find((row) => row.id === inquiryId)

  if (!currentRow) {
    return 0
  }

  const nextStoredNote = withCustomerPaymentMarkers(currentRow.statusNote, customerPaidMethod, customerPaidNote)

  return prisma.$transaction(async (tx) => {
    const result = await tx.$executeRaw(Prisma.sql`
      UPDATE public.customer_inquiries
      SET
        "statusNote" = ${nextStoredNote},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${inquiryId}
        AND "customerUserId" = ${customerUserId}
    `)

    if (result > 0) {
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.order_chat_messages (id, inquiry_id, sender_user_id, sender_role, body)
        VALUES (
          ${randomUUID()},
          ${inquiryId},
          ${customerUserId},
          'CLIENT',
          ${`Customer submitted payment via ${customerPaidMethod}${customerPaidNote ? `: ${customerPaidNote}` : "."}`}
        )
      `)
    }

    return result
  })
}
