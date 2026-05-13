import { Prisma, prisma } from "@furnitrack/db"

type ReservationMaterialRow = {
  stockItemId: string
  sku: string
  itemName: string
  availableQty: number
  quantityRequired: number
}

type ReserveInquiryMaterialsParams = {
  inquiryId: string
  actorId: string
  actorName: string | null
  paymentStatus: string
}

export async function reserveInquiryMaterialsForBuild({
  inquiryId,
  actorId,
  actorName,
  paymentStatus,
}: ReserveInquiryMaterialsParams) {
  const inquiry = await prisma.customerInquiry.findUnique({
    where: { id: inquiryId },
    include: { product: true },
  })

  if (!inquiry) {
    throw new Error("Order not found for material reservation.")
  }

  const existingBuildMovements = await prisma.$queryRaw<Array<{ count: number }>>(Prisma.sql`
    SELECT COUNT(*)::int AS count
    FROM public.stock_movements
    WHERE "referenceNumber" = ${inquiryId}
      AND "projectPurpose" = 'Build Order'
      AND type = 'OUT'::"StockMovementType"
  `)

  if ((existingBuildMovements[0]?.count ?? 0) > 0) {
    return "already_consumed" as const
  }

  const existingReservations = await prisma.$queryRaw<Array<{ count: number }>>(Prisma.sql`
    SELECT COUNT(*)::int AS count
    FROM public.stock_movements
    WHERE "referenceNumber" = ${inquiryId}
      AND "projectPurpose" = 'Reserved for Build Order'
      AND type = 'ADJUSTMENT'::"StockMovementType"
  `)

  if ((existingReservations[0]?.count ?? 0) > 0) {
    return "already_reserved" as const
  }

  const reservationMaterials = await prisma.$queryRaw<ReservationMaterialRow[]>(Prisma.sql`
    SELECT
      pm."stockItemId",
      si.sku,
      si."itemName",
      si."availableQty",
      CEIL(pm."quantityRequired")::int AS "quantityRequired"
    FROM public.product_materials pm
    INNER JOIN public.stock_items si
      ON si.id = pm."stockItemId"
    WHERE pm."productId" = ${inquiry.productId}
      AND COALESCE(pm."quantityRequired", 0) > 0
    ORDER BY si."itemName" ASC
  `)

  if (reservationMaterials.length === 0) {
    throw new Error(`No material requirements are configured for ${inquiry.product.name}.`)
  }

  for (const material of reservationMaterials) {
    if (material.availableQty < material.quantityRequired) {
      throw new Error(
        `Insufficient stock to reserve ${material.itemName}. Need ${material.quantityRequired}, have ${material.availableQty}.`
      )
    }
  }

  await prisma.$transaction(async (tx) => {
    for (const material of reservationMaterials) {
      const required = material.quantityRequired
      if (required <= 0) continue

      const affectedRows = await tx.$executeRaw(Prisma.sql`
        UPDATE public.stock_items
        SET "availableQty" = "availableQty" - ${required},
            "reservedQty" = "reservedQty" + ${required},
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${material.stockItemId}
          AND "availableQty" >= ${required}
      `)

      if (affectedRows === 0) {
        throw new Error(`Insufficient stock to reserve ${material.itemName}.`)
      }

      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.stock_movements (id, "stockItemId", type, quantity, "requesterName", "projectPurpose", "referenceNumber", "createdAt")
        VALUES (
          gen_random_uuid(),
          ${material.stockItemId},
          'ADJUSTMENT'::"StockMovementType",
          ${required},
          ${actorName},
          'Reserved for Build Order',
          ${inquiryId},
          CURRENT_TIMESTAMP
        )
      `)

      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.audit_logs (id, "actorId", action, "entityType", "entityId", metadata, "createdAt")
        VALUES (
          gen_random_uuid(),
          ${actorId},
          'USER_UPDATED'::"AuditAction",
          'USER'::"AuditEntityType",
          ${material.stockItemId},
          ${JSON.stringify({
            auditLabel: "RAW_MATERIAL_STOCK_RESERVED",
            sku: material.sku,
            itemName: material.itemName,
            quantity: required,
            referenceNumber: inquiryId,
            reason: "Accounting payment approved",
            paymentStatus,
          })}::jsonb,
          CURRENT_TIMESTAMP
        )
      `)
    }
  })

  return "reserved" as const
}
