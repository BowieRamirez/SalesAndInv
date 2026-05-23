import { Prisma, prisma } from "@furnitrack/db"

export type DetailedAuditLog = {
  id: string
  action: string
  entityType: string
  entityId: string
  sku: string | null
  itemName: string | null
  quantity: number | null
  details: string | null
  actorName: string | null
  createdAt: Date
  // Resolved human-readable record label (never a raw UUID)
  displayRecord: string | null
  displaySub: string | null
}

/**
 * Shared audit log query used by all admin pages.
 * Resolves entityId to a human-readable label via LEFT JOINs so the
 * Record column never shows a raw UUID.
 *
 * displayRecord = primary label (product name, customer name, warehouse name, etc.)
 * displaySub    = secondary label (inquiry number, product code, etc.)
 *
 * Pass `actorIds` to scope the query to a specific user (or set of users).
 * Pass an empty array to return every audit log — used by the admin / management
 * audit page so executives can review activity from every role.
 */
export async function getAuditLogs(
  actorIds: string[],
  limit = 300,
): Promise<DetailedAuditLog[]> {
  const actorFilter = actorIds.length === 0
    ? Prisma.empty
    : Prisma.sql`WHERE a."actorId" IN (${Prisma.join(actorIds)})`

  return prisma.$queryRaw<DetailedAuditLog[]>(Prisma.sql`
    SELECT
      a.id,
      COALESCE(a.metadata->>'auditLabel', a.action::text) AS action,
      a."entityType"::text AS "entityType",
      a."entityId",
      a.metadata->>'sku' AS sku,
      -- itemName: human-readable name from metadata
      COALESCE(
        a.metadata->>'itemName',
        a.metadata->>'name',
        a.metadata->>'updatedName',
        a.metadata->>'createdName',
        a.metadata->>'removedName',
        a.metadata->>'customerName',
        a.metadata->>'customerEmail',
        a.metadata->>'updatedEmail',
        a.metadata->>'createdEmail',
        a.metadata->>'removedEmail'
      ) AS "itemName",
      NULLIF(a.metadata->>'quantity', '')::int AS quantity,
      -- details: secondary info from metadata
      COALESCE(
        a.metadata->>'colorVariantsSummary',
        a.metadata->>'updatedEmail',
        a.metadata->>'createdEmail',
        a.metadata->>'removedEmail',
        a.metadata->>'customerEmail',
        a.metadata->>'referenceNumber',
        a.metadata->>'category',
        a.metadata->>'reasonDetails',
        a.metadata->>'remarks',
        a.metadata->>'phone',
        a.metadata->>'contactPerson'
      ) AS details,
      COALESCE(u.name, a."actorId") AS "actorName",
      a."createdAt",

      -- displayRecord: resolve entityId to a readable label, never show raw UUID
      CASE a."entityType"::text

        -- BUILDING_PROJECT / PAYMENT / CHAT → inquiry + product name
        WHEN 'BUILDING_PROJECT' THEN
          COALESCE(
            (SELECT p.name || COALESCE(' · ' || ci."inquiryNumber", '')
             FROM public.customer_inquiries ci
             INNER JOIN public.products p ON p.id = ci."productId"
             WHERE ci.id = a."entityId" LIMIT 1),
            a.metadata->>'customerName',
            'Order'
          )
        WHEN 'PAYMENT' THEN
          COALESCE(
            (SELECT p.name || COALESCE(' · ' || ci."inquiryNumber", '')
             FROM public.customer_inquiries ci
             INNER JOIN public.products p ON p.id = ci."productId"
             WHERE ci.id = a."entityId" LIMIT 1),
            a.metadata->>'customerName',
            'Payment'
          )
        WHEN 'CHAT' THEN
          COALESCE(
            (SELECT p.name || COALESCE(' · ' || ci."inquiryNumber", '')
             FROM public.customer_inquiries ci
             INNER JOIN public.products p ON p.id = ci."productId"
             WHERE ci.id = a."entityId" LIMIT 1),
            a.metadata->>'customerName',
            'Order chat'
          )

        -- PRODUCT → product name + productCode
        WHEN 'PRODUCT' THEN
          COALESCE(
            (SELECT p.name || COALESCE(' (' || p."productCode" || ')', '')
             FROM public.products p
             WHERE p.id = a."entityId" LIMIT 1),
            a.metadata->>'name',
            a.metadata->>'itemName',
            'Product'
          )

        -- STOCK → material item name (usually already in metadata, but resolve as fallback)
        WHEN 'STOCK' THEN
          COALESCE(
            a.metadata->>'itemName',
            (SELECT ms."itemName" FROM public.material_stocks ms WHERE ms.id = a."entityId" LIMIT 1),
            'Stock item'
          )

        -- INVENTORY → same as STOCK
        WHEN 'INVENTORY' THEN
          COALESCE(
            a.metadata->>'itemName',
            a.metadata->>'customerName',
            (SELECT ms."itemName" FROM public.material_stocks ms WHERE ms.id = a."entityId" LIMIT 1),
            'Inventory item'
          )

        -- USER → user name
        WHEN 'USER' THEN
          COALESCE(
            a.metadata->>'name',
            a.metadata->>'updatedName',
            a.metadata->>'createdName',
            a.metadata->>'removedName',
            a.metadata->>'itemName',
            (SELECT u2.name FROM public.users u2 WHERE u2.id = a."entityId" LIMIT 1),
            'User'
          )

        -- RETURN_REQUEST → customer name + product
        WHEN 'RETURN_REQUEST' THEN
          COALESCE(
            a.metadata->>'customerName',
            a.metadata->>'name',
            'Return request'
          )

        ELSE
          COALESCE(
            a.metadata->>'name',
            a.metadata->>'itemName',
            a.metadata->>'customerName',
            NULL
          )
      END AS "displayRecord",

      -- displaySub: secondary line (inquiry number, product code, category, etc.)
      CASE a."entityType"::text
        WHEN 'BUILDING_PROJECT' THEN
          COALESCE(
            (SELECT ci."inquiryNumber" FROM public.customer_inquiries ci WHERE ci.id = a."entityId" LIMIT 1),
            NULL
          )
        WHEN 'PAYMENT' THEN
          COALESCE(
            a.metadata->>'customerName',
            (SELECT ci."customerName" FROM public.customer_inquiries ci WHERE ci.id = a."entityId" LIMIT 1),
            NULL
          )
        WHEN 'PRODUCT' THEN
          COALESCE(
            a.metadata->>'category',
            (SELECT p.category FROM public.products p WHERE p.id = a."entityId" LIMIT 1),
            NULL
          )
        WHEN 'STOCK' THEN
          COALESCE(
            a.metadata->>'referenceNumber',
            NULL
          )
        ELSE NULL
      END AS "displaySub"

    FROM public.audit_logs a
    LEFT JOIN public.users u
      ON u.id = a."actorId"
      OR u."authUserId"::text = a."actorId"
    ${actorFilter}
    ORDER BY a."createdAt" DESC
    LIMIT ${Prisma.raw(String(limit))}
  `)
}
