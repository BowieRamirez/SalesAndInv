import "server-only"

import { Prisma, prisma } from "@furnitrack/db"

type OverviewSnapshotRow = {
  bookedRevenue: number
  salesOrders: number
  openOrders: number
  deliveredOrders: number
  verifiedCollections: number
  collectionRate: number
  inventoryValue: number
  totalStockItems: number
  lowStockItems: number
  publishedProducts: number
  activeDeliveries: number
}

type MonthlyPerformanceRow = {
  label: string
  revenue: number
  collections: number
}

type CategoryMixRow = {
  category: string
  productCount: number
  inventoryValue: number
}

type LowStockRow = {
  id: string
  itemName: string
  warehouseName: string
  availableQty: number
  reorderThreshold: number
}

type PendingOrderRow = {
  id: string
  soNumber: string
  companyName: string
  total: number
  status: string
}

type DeliveryRow = {
  id: string
  soNumber: string
  companyName: string
  scheduledAt: Date
  status: string
  readinessStatus: string
}

type StatusCountRow = {
  label: string
  count: number
}

const CATEGORY_COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899"]

export type ExecutiveOverviewData = {
  snapshot: OverviewSnapshotRow
  monthlyPerformance: MonthlyPerformanceRow[]
  categoryMix: Array<
    CategoryMixRow & {
      value: number
      color: string
      share: number
    }
  >
  lowStockItems: LowStockRow[]
  pendingOrders: PendingOrderRow[]
  upcomingDeliveries: DeliveryRow[]
}

export type ExecutiveReportsData = {
  snapshot: OverviewSnapshotRow & {
    outstandingReceivables: number
    verifiedPayments: number
    pendingPayments: number
  }
  monthlyPerformance: MonthlyPerformanceRow[]
  orderStatuses: StatusCountRow[]
  paymentStatuses: StatusCountRow[]
  categoryMix: Array<
    CategoryMixRow & {
      value: number
      color: string
      share: number
    }
  >
  lowStockItems: LowStockRow[]
}

async function getOverviewSnapshot() {
  const [row] = await prisma.$queryRaw<OverviewSnapshotRow[]>(Prisma.sql`
    WITH order_totals AS (
      -- Use customer_inquiries as the source of truth for orders (sales_orders is unused B2B scaffolding)
      SELECT
        COUNT(*)::int AS "salesOrders",
        COALESCE(SUM(p.price), 0)::double precision AS "bookedRevenue",
        COUNT(*) FILTER (
          WHERE ci.status::text NOT IN ('COMPLETED','CANCELLED')
            AND NOT (ci."statusNote" LIKE '%[[completed]]%')
        )::int AS "openOrders",
        COUNT(*) FILTER (
          WHERE ci."statusNote" LIKE '%[[completed]]%'
            AND ci."statusNote" NOT LIKE '%Cancelled%'
        )::int AS "deliveredOrders"
      FROM public.customer_inquiries ci
      INNER JOIN public.products p ON p.id = ci."productId"
      WHERE ci.status::text <> 'RECEIVED'
        OR ci."statusNote" IS NOT NULL
    ),
    payment_totals AS (
      SELECT
        COALESCE(SUM(amount) FILTER (WHERE status = 'VERIFIED'), 0)::double precision AS "verifiedCollections"
      FROM public.payment_records
    ),
    inventory_totals AS (
      SELECT
        (SELECT COALESCE(SUM(p.price * s."availableQty"), 0) FROM public.product_stocks s INNER JOIN public.products p ON p."productStockId" = s.id)::double precision AS "inventoryValue",
        ((SELECT COUNT(*) FROM public.product_stocks) + (SELECT COUNT(*) FROM public.material_stocks))::int AS "totalStockItems",
        ((SELECT COUNT(*) FROM public.product_stocks WHERE "availableQty" <= "reorderThreshold") + (SELECT COUNT(*) FROM public.material_stocks WHERE "availableQty" <= "reorderThreshold"))::int AS "lowStockItems",
        (SELECT COUNT(*) FROM public.products WHERE "isPublished" = true)::int AS "publishedProducts"
    ),
    delivery_totals AS (
      SELECT
        COUNT(*) FILTER (WHERE status::text IN ('READY_FOR_SHIPMENT','READY_FOR_SHIPPING'))::int AS "activeDeliveries"
      FROM public.customer_inquiries
    )
    SELECT
      ot."bookedRevenue",
      ot."salesOrders",
      ot."openOrders",
      ot."deliveredOrders",
      pt."verifiedCollections",
      CASE
        WHEN ot."bookedRevenue" > 0
          THEN ROUND((((pt."verifiedCollections" / ot."bookedRevenue") * 100)::numeric), 1)
        ELSE 0
      END::double precision AS "collectionRate",
      it."inventoryValue",
      it."totalStockItems",
      it."lowStockItems",
      it."publishedProducts",
      dt."activeDeliveries"
    FROM order_totals ot
    CROSS JOIN payment_totals pt
    CROSS JOIN inventory_totals it
    CROSS JOIN delivery_totals dt
  `)

  return row
}

async function getMonthlyPerformance() {
  return prisma.$queryRaw<MonthlyPerformanceRow[]>(Prisma.sql`
    WITH months AS (
      SELECT generate_series(
        date_trunc('month', CURRENT_DATE) - INTERVAL '11 months',
        date_trunc('month', CURRENT_DATE),
        INTERVAL '1 month'
      ) AS month_start
    ),
    -- Revenue = value of orders placed that progressed past RECEIVED (i.e. endorsed to inventory or further)
    order_totals AS (
      SELECT
        date_trunc('month', ci."createdAt") AS month_start,
        COALESCE(SUM(p.price), 0)::double precision AS revenue
      FROM public.customer_inquiries ci
      INNER JOIN public.products p ON p.id = ci."productId"
      WHERE ci.status::text <> 'RECEIVED'
      GROUP BY 1
    ),
    payment_totals AS (
      SELECT
        date_trunc('month', "paymentDate") AS month_start,
        COALESCE(SUM(amount), 0)::double precision AS collections
      FROM public.payment_records
      WHERE status = 'VERIFIED'
      GROUP BY 1
    )
    SELECT
      TO_CHAR(m.month_start, 'Mon') AS label,
      COALESCE(o.revenue, 0)::double precision AS revenue,
      COALESCE(p.collections, 0)::double precision AS collections
    FROM months m
    LEFT JOIN order_totals o
      ON o.month_start = m.month_start
    LEFT JOIN payment_totals p
      ON p.month_start = m.month_start
    ORDER BY m.month_start
  `)
}

async function getCategoryMix() {
  const rows = await prisma.$queryRaw<CategoryMixRow[]>(Prisma.sql`
    SELECT
      p.category,
      COUNT(*)::int AS "productCount",
      COALESCE(SUM(p.price * s."availableQty"), 0)::double precision AS "inventoryValue"
    FROM public.products p
    INNER JOIN public.product_stocks s
      ON s.id = p."productStockId"
    WHERE p."isPublished" = true
    GROUP BY p.category
    ORDER BY "productCount" DESC, p.category ASC
    LIMIT 6
  `)

  const totalProducts = rows.reduce((sum, row) => sum + row.productCount, 0)

  return rows.map((row, index) => ({
    ...row,
    value: row.productCount,
    share: totalProducts > 0 ? Number(((row.productCount / totalProducts) * 100).toFixed(1)) : 0,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }))
}

async function getLowStockItems() {
  return prisma.$queryRaw<LowStockRow[]>(Prisma.sql`
    SELECT
      s.id,
      s."itemName",
      w.name AS "warehouseName",
      s."availableQty",
      s."reorderThreshold"
    FROM public.material_stocks s
    INNER JOIN public.warehouses w
      ON w.id = s."warehouseId"
    WHERE s.state = 'AVAILABLE'
      AND s."availableQty" <= s."reorderThreshold"
    ORDER BY s."availableQty" ASC, s."itemName" ASC
    LIMIT 6
  `)
}

async function getPendingOrders() {
  // Use customer_inquiries as the order source — sales_orders is unused B2B scaffolding
  type InquiryOrderRow = {
    id: string
    soNumber: string      // maps to inquiryNumber
    companyName: string   // maps to customerName
    total: number
    status: string
  }
  const rows = await prisma.$queryRaw<InquiryOrderRow[]>(Prisma.sql`
    SELECT
      ci.id,
      COALESCE(ci."inquiryNumber", ci.id) AS "soNumber",
      ci."customerName" AS "companyName",
      p.price::double precision AS total,
      ci.status::text AS status
    FROM public.customer_inquiries ci
    INNER JOIN public.products p ON p.id = ci."productId"
    WHERE ci.status::text NOT IN ('RECEIVED')
      AND NOT (COALESCE(ci."statusNote",'') LIKE '%[[completed]]%')
    ORDER BY ci."createdAt" DESC
    LIMIT 5
  `)
  return rows as PendingOrderRow[]
}

async function getUpcomingDeliveries() {
  type InquiryDeliveryRow = {
    id: string
    soNumber: string
    companyName: string
    scheduledAt: Date
    status: string
    readinessStatus: string
  }
  const rows = await prisma.$queryRaw<InquiryDeliveryRow[]>(Prisma.sql`
    SELECT
      ci.id,
      COALESCE(ci."inquiryNumber", ci.id) AS "soNumber",
      ci."customerName" AS "companyName",
      ci."shippingScheduledAt" AS "scheduledAt",
      ci.status::text AS status,
      'READY' AS "readinessStatus"
    FROM public.customer_inquiries ci
    WHERE ci."shippingScheduledAt" IS NOT NULL
      AND ci.status::text IN ('READY_FOR_SHIPMENT','GETTING_READY_FOR_BUILDING')
      AND NOT (COALESCE(ci."statusNote",'') LIKE '%[[completed]]%')
    ORDER BY ci."shippingScheduledAt" ASC
    LIMIT 5
  `)
  return rows as DeliveryRow[]
}

async function getReportsSnapshot() {
  const [row] = await prisma.$queryRaw<
    Array<
      OverviewSnapshotRow & {
        outstandingReceivables: number
        verifiedPayments: number
        pendingPayments: number
      }
    >
  >(Prisma.sql`
    WITH order_totals AS (
      SELECT
        COUNT(*)::int AS "salesOrders",
        COALESCE(SUM(p.price), 0)::double precision AS "bookedRevenue",
        COUNT(*) FILTER (
          WHERE ci.status::text NOT IN ('COMPLETED','CANCELLED')
            AND NOT (COALESCE(ci."statusNote",'') LIKE '%[[completed]]%')
        )::int AS "openOrders",
        COUNT(*) FILTER (
          WHERE COALESCE(ci."statusNote",'') LIKE '%[[completed]]%'
            AND COALESCE(ci."statusNote",'') NOT LIKE '%Cancelled%'
        )::int AS "deliveredOrders"
      FROM public.customer_inquiries ci
      INNER JOIN public.products p ON p.id = ci."productId"
      WHERE ci.status::text <> 'RECEIVED'
        OR ci."statusNote" IS NOT NULL
    ),
    payment_totals AS (
      SELECT
        COALESCE(SUM(amount) FILTER (WHERE status = 'VERIFIED'), 0)::double precision AS "verifiedCollections"
      FROM public.payment_records
    ),
    inventory_totals AS (
      SELECT
        (SELECT COALESCE(SUM(p.price * s."availableQty"), 0) FROM public.product_stocks s INNER JOIN public.products p ON p."productStockId" = s.id)::double precision AS "inventoryValue",
        ((SELECT COUNT(*) FROM public.product_stocks) + (SELECT COUNT(*) FROM public.material_stocks))::int AS "totalStockItems",
        (SELECT COUNT(*) FROM public.product_stocks WHERE "availableQty" <= "reorderThreshold") +
        (SELECT COUNT(*) FROM public.material_stocks WHERE "availableQty" <= "reorderThreshold") AS "lowStockItems",
        (SELECT COUNT(*) FROM public.products WHERE "isPublished" = true)::int AS "publishedProducts"
    ),
    delivery_totals AS (
      SELECT
        COUNT(*) FILTER (WHERE status::text IN ('READY_FOR_SHIPMENT','READY_FOR_SHIPPING'))::int AS "activeDeliveries"
      FROM public.customer_inquiries
    ),
    -- Outstanding = sum of remaining balance from most recent verified payment per inquiry
    outstanding AS (
      SELECT COALESCE(SUM(pr."remainingBalance"), 0)::double precision AS "outstandingReceivables"
      FROM (
        SELECT DISTINCT ON ("inquiryId")
          "inquiryId",
          "remainingBalance"
        FROM public.payment_records
        WHERE status = 'VERIFIED'
          AND "inquiryId" IS NOT NULL
        ORDER BY "inquiryId", "verifiedAt" DESC, "createdAt" DESC
      ) pr
    ),
    payment_statuses AS (
      SELECT
        COUNT(*) FILTER (WHERE status = 'VERIFIED')::int AS "verifiedPayments",
        COUNT(*) FILTER (WHERE status = 'PENDING')::int AS "pendingPayments"
      FROM public.payment_records
    )
    SELECT
      ot."bookedRevenue",
      ot."salesOrders",
      ot."openOrders",
      ot."deliveredOrders",
      pt."verifiedCollections",
      CASE
        WHEN ot."bookedRevenue" > 0
          THEN ROUND((((pt."verifiedCollections" / ot."bookedRevenue") * 100)::numeric), 1)
        ELSE 0
      END::double precision AS "collectionRate",
      it."inventoryValue",
      it."totalStockItems",
      it."lowStockItems",
      it."publishedProducts",
      dt."activeDeliveries",
      os."outstandingReceivables",
      payment_statuses."verifiedPayments",
      payment_statuses."pendingPayments"
    FROM order_totals ot
    CROSS JOIN payment_totals pt
    CROSS JOIN inventory_totals it
    CROSS JOIN delivery_totals dt
    CROSS JOIN outstanding os
    CROSS JOIN payment_statuses
  `)

  return row
}

async function getOrderStatuses() {
  // Translate customer_inquiries statuses into readable labels
  return prisma.$queryRaw<StatusCountRow[]>(Prisma.sql`
    SELECT
      CASE ci.status::text
        WHEN 'RECEIVED'                   THEN 'Received'
        WHEN 'ACCEPTED'                   THEN 'Pending Inventory'
        WHEN 'WAITING_FOR_PAYMENT'        THEN 'Pending Payment'
        WHEN 'GETTING_READY_FOR_BUILDING' THEN 'Being Built'
        WHEN 'READY_FOR_SHIPMENT'         THEN 'Out for Delivery'
        WHEN 'COMPLETED'                  THEN 'Completed'
        ELSE ci.status::text
      END AS label,
      COUNT(*)::int AS count
    FROM public.customer_inquiries ci
    GROUP BY ci.status
    ORDER BY count DESC, label ASC
  `)
}

async function getPaymentStatuses() {
  return prisma.$queryRaw<StatusCountRow[]>(Prisma.sql`
    SELECT
      status::text AS label,
      COUNT(*)::int AS count
    FROM public.payment_records
    GROUP BY status
    ORDER BY count DESC, label ASC
  `)
}

export async function getExecutiveOverviewData(): Promise<ExecutiveOverviewData> {
  const [snapshot, monthlyPerformance, categoryMix, lowStockItems, pendingOrders, upcomingDeliveries] =
    await Promise.all([
      getOverviewSnapshot(),
      getMonthlyPerformance(),
      getCategoryMix(),
      getLowStockItems(),
      getPendingOrders(),
      getUpcomingDeliveries(),
    ])

  return {
    snapshot,
    monthlyPerformance,
    categoryMix,
    lowStockItems,
    pendingOrders,
    upcomingDeliveries,
  }
}

export async function getExecutiveReportsData(): Promise<ExecutiveReportsData> {
  const [snapshot, monthlyPerformance, orderStatuses, paymentStatuses, categoryMix, lowStockItems] =
    await Promise.all([
      getReportsSnapshot(),
      getMonthlyPerformance(),
      getOrderStatuses(),
      getPaymentStatuses(),
      getCategoryMix(),
      getLowStockItems(),
    ])

  return {
    snapshot,
    monthlyPerformance,
    orderStatuses,
    paymentStatuses,
    categoryMix,
    lowStockItems,
  }
}
