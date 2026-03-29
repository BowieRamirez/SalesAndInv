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
      SELECT
        COUNT(*)::int AS "salesOrders",
        COALESCE(SUM(total), 0)::double precision AS "bookedRevenue",
        COUNT(*) FILTER (WHERE status NOT IN ('DELIVERED', 'CANCELLED'))::int AS "openOrders",
        COUNT(*) FILTER (WHERE status = 'DELIVERED')::int AS "deliveredOrders"
      FROM public.sales_orders
    ),
    payment_totals AS (
      SELECT
        COALESCE(SUM(amount) FILTER (WHERE status = 'VERIFIED'), 0)::double precision AS "verifiedCollections"
      FROM public.payment_records
    ),
    inventory_totals AS (
      SELECT
        COALESCE(SUM(COALESCE(p.price, 0) * s."availableQty"), 0)::double precision AS "inventoryValue",
        COUNT(s.id)::int AS "totalStockItems",
        COUNT(*) FILTER (WHERE s."availableQty" <= s."reorderThreshold")::int AS "lowStockItems",
        COUNT(p.id) FILTER (WHERE p."isPublished" = true)::int AS "publishedProducts"
      FROM public.stock_items s
      LEFT JOIN public.products p
        ON p."stockItemId" = s.id
    ),
    delivery_totals AS (
      SELECT
        COUNT(*) FILTER (WHERE status IN ('SCHEDULED', 'READY', 'IN_TRANSIT'))::int AS "activeDeliveries"
      FROM public.delivery_schedules
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
    order_totals AS (
      SELECT
        date_trunc('month', "createdAt") AS month_start,
        COALESCE(SUM(total), 0)::double precision AS revenue
      FROM public.sales_orders
      WHERE status <> 'CANCELLED'
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
    INNER JOIN public.stock_items s
      ON s.id = p."stockItemId"
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
    FROM public.stock_items s
    INNER JOIN public.warehouses w
      ON w.id = s."warehouseId"
    WHERE s.state = 'AVAILABLE'
      AND s."availableQty" <= s."reorderThreshold"
    ORDER BY s."availableQty" ASC, s."itemName" ASC
    LIMIT 6
  `)
}

async function getPendingOrders() {
  return prisma.$queryRaw<PendingOrderRow[]>(Prisma.sql`
    SELECT
      so.id,
      so."soNumber",
      c.name AS "companyName",
      so.total::double precision AS total,
      so.status::text AS status
    FROM public.sales_orders so
    INNER JOIN public.companies c
      ON c.id = so."companyId"
    WHERE so.status NOT IN ('DELIVERED', 'CANCELLED')
    ORDER BY so."createdAt" DESC
    LIMIT 5
  `)
}

async function getUpcomingDeliveries() {
  return prisma.$queryRaw<DeliveryRow[]>(Prisma.sql`
    SELECT
      ds.id,
      so."soNumber",
      c.name AS "companyName",
      ds."scheduledAt",
      ds.status::text AS status,
      ds."readinessStatus"::text AS "readinessStatus"
    FROM public.delivery_schedules ds
    INNER JOIN public.sales_orders so
      ON so.id = ds."salesOrderId"
    INNER JOIN public.companies c
      ON c.id = ds."companyId"
    WHERE ds.status <> 'CANCELLED'
    ORDER BY ds."scheduledAt" ASC
    LIMIT 5
  `)
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
    WITH overview AS (
      SELECT *
      FROM (
        WITH order_totals AS (
          SELECT
            COUNT(*)::int AS "salesOrders",
            COALESCE(SUM(total), 0)::double precision AS "bookedRevenue",
            COUNT(*) FILTER (WHERE status NOT IN ('DELIVERED', 'CANCELLED'))::int AS "openOrders",
            COUNT(*) FILTER (WHERE status = 'DELIVERED')::int AS "deliveredOrders"
          FROM public.sales_orders
        ),
        payment_totals AS (
          SELECT
            COALESCE(SUM(amount) FILTER (WHERE status = 'VERIFIED'), 0)::double precision AS "verifiedCollections"
          FROM public.payment_records
        ),
        inventory_totals AS (
          SELECT
            COALESCE(SUM(COALESCE(p.price, 0) * s."availableQty"), 0)::double precision AS "inventoryValue",
            COUNT(s.id)::int AS "totalStockItems",
            COUNT(*) FILTER (WHERE s."availableQty" <= s."reorderThreshold")::int AS "lowStockItems",
            COUNT(p.id) FILTER (WHERE p."isPublished" = true)::int AS "publishedProducts"
          FROM public.stock_items s
          LEFT JOIN public.products p
            ON p."stockItemId" = s.id
        ),
        delivery_totals AS (
          SELECT
            COUNT(*) FILTER (WHERE status IN ('SCHEDULED', 'READY', 'IN_TRANSIT'))::int AS "activeDeliveries"
          FROM public.delivery_schedules
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
      ) snapshot
    ),
    latest_balances AS (
      SELECT DISTINCT ON ("salesOrderId")
        "salesOrderId",
        "remainingBalance"
      FROM public.payment_records
      WHERE status = 'VERIFIED'
      ORDER BY "salesOrderId", "paymentDate" DESC, "createdAt" DESC, id DESC
    ),
    payment_statuses AS (
      SELECT
        COUNT(*) FILTER (WHERE status = 'VERIFIED')::int AS "verifiedPayments",
        COUNT(*) FILTER (WHERE status = 'PENDING')::int AS "pendingPayments"
      FROM public.payment_records
    )
    SELECT
      overview.*,
      COALESCE((SELECT SUM("remainingBalance") FROM latest_balances), 0)::double precision AS "outstandingReceivables",
      payment_statuses."verifiedPayments",
      payment_statuses."pendingPayments"
    FROM overview
    CROSS JOIN payment_statuses
  `)

  return row
}

async function getOrderStatuses() {
  return prisma.$queryRaw<StatusCountRow[]>(Prisma.sql`
    SELECT
      status::text AS label,
      COUNT(*)::int AS count
    FROM public.sales_orders
    GROUP BY status
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
