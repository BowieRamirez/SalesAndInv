import { randomUUID } from "node:crypto"
import { Prisma } from "./generated/prisma"
import { prisma } from "./client"

export const RETURN_REQUEST_STATUSES = [
  "SUBMITTED",
  "APPROVED_FOR_PICKUP",
  "PICKED_UP_COMPLETED",
  "REJECTED",
] as const

export type ReturnRequestStatus = (typeof RETURN_REQUEST_STATUSES)[number]

type ReturnRequestQueryRow = {
  id: string
  inquiryId: string
  customerUserId: string | null
  productId: string
  productName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  status: string
  reason: string
  details: string | null
  imageUrls: Prisma.JsonValue | null
  salesNote: string | null
  pickupScheduledAt: Date | null
  approvedById: string | null
  approvedAt: Date | null
  completedById: string | null
  completedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type ReturnRequestRow = Omit<ReturnRequestQueryRow, "imageUrls" | "status"> & {
  status: ReturnRequestStatus
  imageUrls: string[]
}

function normalizeImageUrls(value: Prisma.JsonValue | null) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((entry): entry is string => typeof entry === "string")
}

function castStatus(value: string): ReturnRequestStatus {
  if (RETURN_REQUEST_STATUSES.includes(value as ReturnRequestStatus)) {
    return value as ReturnRequestStatus
  }

  return "SUBMITTED"
}

function mapReturnRequestRow(row: ReturnRequestQueryRow): ReturnRequestRow {
  return {
    ...row,
    status: castStatus(row.status),
    imageUrls: normalizeImageUrls(row.imageUrls),
  }
}

export async function getReturnRequests(filters?: {
  customerUserId?: string
  inquiryIds?: string[]
  statuses?: ReturnRequestStatus[]
}) {
  const customerFilter = filters?.customerUserId
    ? Prisma.sql`AND rr."customerUserId" = ${filters.customerUserId}`
    : Prisma.empty
  const inquiryFilter =
    filters?.inquiryIds && filters.inquiryIds.length > 0
      ? Prisma.sql`AND rr."inquiryId" IN (${Prisma.join(filters.inquiryIds)})`
      : Prisma.empty
  const statusFilter =
    filters?.statuses && filters.statuses.length > 0
      ? Prisma.sql`AND rr.status IN (${Prisma.join(filters.statuses)})`
      : Prisma.empty

  const rows = await prisma.$queryRaw<ReturnRequestQueryRow[]>(Prisma.sql`
    SELECT
      rr.id,
      rr."inquiryId",
      rr."customerUserId",
      ci."productId",
      p.name AS "productName",
      ci."customerName",
      ci."customerEmail",
      ci."customerPhone",
      rr.status,
      rr.reason,
      rr.details,
      rr."imageUrls",
      rr."salesNote",
      rr."pickupScheduledAt",
      rr."approvedById",
      rr."approvedAt",
      rr."completedById",
      rr."completedAt",
      rr."createdAt",
      rr."updatedAt"
    FROM public.return_requests rr
    INNER JOIN public.customer_inquiries ci
      ON ci.id = rr."inquiryId"
    INNER JOIN public.products p
      ON p.id = ci."productId"
    WHERE 1 = 1
      ${customerFilter}
      ${inquiryFilter}
      ${statusFilter}
    ORDER BY rr."createdAt" DESC, rr."updatedAt" DESC
  `)

  return rows.map(mapReturnRequestRow)
}

export async function createReturnRequest(params: {
  inquiryId: string
  customerUserId: string
  reason: string
  details: string | null
  imageUrls: string[]
}) {
  const { inquiryId, customerUserId, reason, details, imageUrls } = params
  const existing = await getReturnRequests({
    customerUserId,
    inquiryIds: [inquiryId],
    statuses: ["SUBMITTED", "APPROVED_FOR_PICKUP"],
  })

  if (existing.length > 0) {
    throw new Error("A return request is already active for this completed order.")
  }

  const inquiry = await prisma.$queryRaw<
    Array<{
      id: string
      customerUserId: string | null
      status: string
      statusNote: string | null
    }>
  >(Prisma.sql`
    SELECT
      id,
      "customerUserId",
      status::text AS status,
      "statusNote"
    FROM public.customer_inquiries
    WHERE id = ${inquiryId}
      AND "customerUserId" = ${customerUserId}
    LIMIT 1
  `)

  const inquiryRow = inquiry[0]

  if (!inquiryRow) {
    throw new Error("That order could not be found for your account.")
  }

  if (!(typeof inquiryRow.statusNote === "string" && inquiryRow.statusNote.includes("[[completed]]"))) {
    throw new Error("Only completed orders can be returned.")
  }

  const id = randomUUID()

  await prisma.$executeRaw(Prisma.sql`
    INSERT INTO public.return_requests (
      id,
      "inquiryId",
      "customerUserId",
      status,
      reason,
      details,
      "imageUrls",
      "createdAt",
      "updatedAt"
    )
    VALUES (
      ${id},
      ${inquiryId},
      ${customerUserId},
      'SUBMITTED',
      ${reason},
      ${details},
      ${JSON.stringify(imageUrls)}::jsonb,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    )
  `)

  const [created] = await getReturnRequests({ customerUserId, inquiryIds: [inquiryId] })
  return created ?? null
}

export async function approveReturnRequest(params: {
  returnRequestId: string
  approvedById: string
  salesNote: string | null
  pickupScheduledAt: Date
}) {
  const { returnRequestId, approvedById, salesNote, pickupScheduledAt } = params
  const updatedRows = await prisma.$executeRaw(Prisma.sql`
    UPDATE public.return_requests
    SET
      status = 'APPROVED_FOR_PICKUP',
      "salesNote" = ${salesNote},
      "pickupScheduledAt" = ${pickupScheduledAt},
      "approvedById" = ${approvedById},
      "approvedAt" = CURRENT_TIMESTAMP,
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = ${returnRequestId}
      AND status = 'SUBMITTED'
  `)

  return updatedRows
}

export async function completeReturnRequest(params: {
  returnRequestId: string
  completedById: string
  salesNote: string | null
}) {
  const { returnRequestId, completedById, salesNote } = params
  const requests = await getReturnRequests({ statuses: ["APPROVED_FOR_PICKUP"] })
  const request = requests.find((entry) => entry.id === returnRequestId)

  if (!request) {
    return 0
  }

  const materials = await prisma.$queryRaw<
    Array<{
      stockItemId: string
      quantityRequired: Prisma.Decimal | number | string | null
      quantityDisplay: string | null
      itemName: string
    }>
  >(Prisma.sql`
    SELECT
      pm."stockItemId",
      pm."quantityRequired",
      pm."quantityDisplay",
      si."itemName"
    FROM public.customer_inquiries ci
    INNER JOIN public.product_materials pm
      ON pm."productId" = ci."productId"
    INNER JOIN public.stock_items si
      ON si.id = pm."stockItemId"
    WHERE ci.id = ${request.inquiryId}
  `)

  const updatedRows = await prisma.$transaction(async (tx) => {
    const statusUpdateCount = await tx.$executeRaw(Prisma.sql`
      UPDATE public.return_requests
      SET
        status = 'PICKED_UP_COMPLETED',
        "salesNote" = ${salesNote},
        "completedById" = ${completedById},
        "completedAt" = CURRENT_TIMESTAMP,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${returnRequestId}
        AND status = 'APPROVED_FOR_PICKUP'
    `)

    if (statusUpdateCount === 0) {
      return 0
    }

    for (const material of materials) {
      const resolvedQuantity = Math.max(1, Math.ceil(Number(material.quantityRequired ?? 1)))

      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.stock_movements (
          id,
          "stockItemId",
          type,
          quantity,
          "requesterName",
          "projectPurpose",
          "referenceNumber",
          "createdAt"
        )
        VALUES (
          ${randomUUID()},
          ${material.stockItemId},
          'DAMAGE'::"StockMovementType",
          ${resolvedQuantity},
          ${request.customerName},
          ${`Customer return for ${request.productName}`},
          ${returnRequestId},
          CURRENT_TIMESTAMP
        )
      `)
    }
    return statusUpdateCount
  })

  return updatedRows
}
