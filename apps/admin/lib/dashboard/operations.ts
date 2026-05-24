import "server-only"

import { Prisma, prisma } from "@furnitrack/db"

export type OperationsKpiRow = {
  lowStockCount: number
  noStockCount: number
  damagedQty: number
  pendingApprovalsCount: number
  deliveriesCount: number
  activeSuppliersCount: number
}

export type OpsMostBuiltRow = {
  name: string
  builds: number
}

export type OpsBuildsByCategoryRow = {
  category: string
  value: number
}

export type OpsLowStockRow = {
  id: string
  itemName: string
  sku: string
  warehouse: string
  available: number
  threshold: number
}

export type OpsNoStockRow = {
  id: string
  itemName: string
  sku: string
  warehouse: string
}

export type OpsDamagedRow = {
  id: string
  itemName: string
  sku: string
  qty: number
  source: string
}

export type OpsPendingApprovalRow = {
  id: string
  type: string
  customer: string
  product: string
  date: string
}

export type OpsDeliveryRow = {
  id: string
  customer: string
  product: string
  scheduledDate: string
  status: "Ready" | "Building"
}

export type OperationsDashboardData = {
  kpi: OperationsKpiRow
  mostBuiltMonth: OpsMostBuiltRow[]
  mostBuiltYear: OpsMostBuiltRow[]
  buildsByCategory: OpsBuildsByCategoryRow[]
  lowStockItems: OpsLowStockRow[]
  noStockItems: OpsNoStockRow[]
  damagedMaterials: OpsDamagedRow[]
  pendingApprovals: OpsPendingApprovalRow[]
  deliverySchedule: OpsDeliveryRow[]
}

const PIE_COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899"]

async function getLowAndNoStock() {
  const rows = await prisma.$queryRaw<
    Array<{
      id: string
      itemName: string
      sku: string
      warehouse: string
      availableQty: number
      reorderThreshold: number
    }>
  >(Prisma.sql`
    SELECT
      ms.id,
      ms."itemName",
      ms.sku,
      w.name AS warehouse,
      ms."availableQty",
      ms."reorderThreshold"
    FROM public.material_stocks ms
    INNER JOIN public.warehouses w ON w.id = ms."warehouseId"
    WHERE ms."availableQty" <= ms."reorderThreshold"
    ORDER BY ms."availableQty" ASC, ms."itemName" ASC
    LIMIT 20
  `)

  const lowStockItems: OpsLowStockRow[] = rows
    .filter((r) => r.availableQty > 0)
    .map((r) => ({
      id: r.id,
      itemName: r.itemName,
      sku: r.sku,
      warehouse: r.warehouse,
      available: r.availableQty,
      threshold: r.reorderThreshold,
    }))

  const noStockItems: OpsNoStockRow[] = rows
    .filter((r) => r.availableQty <= 0)
    .map((r) => ({
      id: r.id,
      itemName: r.itemName,
      sku: r.sku,
      warehouse: r.warehouse,
    }))

  return { lowStockItems, noStockItems }
}

async function getDamagedMaterials(): Promise<OpsDamagedRow[]> {
  const rows = await prisma.$queryRaw<
    Array<{
      id: string
      itemName: string
      sku: string
      quantity: number
      projectPurpose: string | null
      referenceNumber: string | null
    }>
  >(Prisma.sql`
    SELECT
      sm.id,
      ms."itemName",
      ms.sku,
      sm.quantity,
      sm."projectPurpose",
      sm."referenceNumber"
    FROM public.stock_movements sm
    INNER JOIN public.material_stocks ms ON ms.id = sm."materialStockId"
    WHERE sm.type = 'DAMAGE'::"StockMovementType"
    ORDER BY sm."createdAt" DESC
    LIMIT 10
  `)

  return rows.map((r) => ({
    id: r.id,
    itemName: r.itemName,
    sku: r.sku,
    qty: r.quantity,
    source: r.projectPurpose ?? r.referenceNumber ?? "Flagged as damaged",
  }))
}

async function getPendingApprovals(): Promise<OpsPendingApprovalRow[]> {
  const rows = await prisma.$queryRaw<
    Array<{
      id: string
      status: string
      customerName: string
      productName: string
      createdAt: Date
    }>
  >(Prisma.sql`
    SELECT
      ci.id,
      ci.status::text AS status,
      ci."customerName",
      p.name AS "productName",
      ci."createdAt"
    FROM public.customer_inquiries ci
    INNER JOIN public.products p ON p.id = ci."productId"
    WHERE ci.status::text IN ('PENDING_INVENTORY_APPROVAL', 'GETTING_READY_FOR_BUILDING')
    ORDER BY ci."createdAt" ASC
    LIMIT 10
  `)

  return rows.map((r) => ({
    id: r.id,
    type:
      r.status === "PENDING_INVENTORY_APPROVAL"
        ? "Inventory Approval"
        : "Build Approval",
    customer: r.customerName,
    product: r.productName,
    date: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(r.createdAt)),
  }))
}

async function getDeliverySchedule(): Promise<OpsDeliveryRow[]> {
  const rows = await prisma.$queryRaw<
    Array<{
      id: string
      customerName: string
      productName: string
      shippingScheduledAt: Date | null
      status: string
    }>
  >(Prisma.sql`
    SELECT
      ci.id,
      ci."customerName",
      p.name AS "productName",
      ci."shippingScheduledAt",
      ci.status::text AS status
    FROM public.customer_inquiries ci
    INNER JOIN public.products p ON p.id = ci."productId"
    WHERE ci.status::text IN ('GETTING_READY_FOR_BUILDING', 'READY_FOR_SHIPPING')
      AND NOT (COALESCE(ci."statusNote", '') LIKE '%[[completed]]%')
    ORDER BY ci."shippingScheduledAt" ASC NULLS LAST, ci."createdAt" ASC
    LIMIT 8
  `)

  return rows.map((r) => ({
    id: r.id,
    customer: r.customerName,
    product: r.productName,
    scheduledDate: r.shippingScheduledAt
      ? new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(new Date(r.shippingScheduledAt))
      : "Not scheduled",
    status: r.status === "READY_FOR_SHIPPING" ? "Ready" : "Building",
  }))
}

async function getMostBuiltProducts(): Promise<{
  month: OpsMostBuiltRow[]
  year: OpsMostBuiltRow[]
}> {
  // "Built" = orders that reached GETTING_READY_FOR_BUILDING or beyond
  const [monthRows, yearRows] = await Promise.all([
    prisma.$queryRaw<Array<{ name: string; builds: number }>>(Prisma.sql`
      SELECT
        p.name,
        COUNT(*)::int AS builds
      FROM public.customer_inquiries ci
      INNER JOIN public.products p ON p.id = ci."productId"
      WHERE ci.status::text IN (
        'GETTING_READY_FOR_BUILDING',
        'READY_FOR_SHIPPING',
        'COMPLETED'
      )
        AND ci."updatedAt" >= date_trunc('month', CURRENT_DATE)
      GROUP BY p.name
      ORDER BY builds DESC, p.name ASC
      LIMIT 6
    `),
    prisma.$queryRaw<Array<{ name: string; builds: number }>>(Prisma.sql`
      SELECT
        p.name,
        COUNT(*)::int AS builds
      FROM public.customer_inquiries ci
      INNER JOIN public.products p ON p.id = ci."productId"
      WHERE ci.status::text IN (
        'GETTING_READY_FOR_BUILDING',
        'READY_FOR_SHIPPING',
        'COMPLETED'
      )
        AND ci."updatedAt" >= date_trunc('year', CURRENT_DATE)
      GROUP BY p.name
      ORDER BY builds DESC, p.name ASC
      LIMIT 6
    `),
  ])

  return {
    month: monthRows.map((r) => ({ name: r.name, builds: r.builds })),
    year: yearRows.map((r) => ({ name: r.name, builds: r.builds })),
  }
}

async function getBuildsByCategory(): Promise<OpsBuildsByCategoryRow[]> {
  const rows = await prisma.$queryRaw<Array<{ category: string; builds: number }>>(Prisma.sql`
    SELECT
      p.category,
      COUNT(*)::int AS builds
    FROM public.customer_inquiries ci
    INNER JOIN public.products p ON p.id = ci."productId"
    WHERE ci.status::text IN (
      'GETTING_READY_FOR_BUILDING',
      'READY_FOR_SHIPPING',
      'COMPLETED'
    )
    GROUP BY p.category
    ORDER BY builds DESC, p.category ASC
    LIMIT 6
  `)

  return rows.map((r, i) => ({
    category: r.category,
    value: r.builds,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }))
}

async function getActiveSuppliersCount(): Promise<number> {
  const [row] = await prisma.$queryRaw<Array<{ count: number }>>(Prisma.sql`
    SELECT COUNT(*)::int AS count FROM public.suppliers
  `)
  return row?.count ?? 0
}

export async function getOperationsDashboardData(): Promise<OperationsDashboardData> {
  const [
    { lowStockItems, noStockItems },
    damagedMaterials,
    pendingApprovals,
    deliverySchedule,
    { month: mostBuiltMonth, year: mostBuiltYear },
    buildsByCategory,
    activeSuppliersCount,
  ] = await Promise.all([
    getLowAndNoStock(),
    getDamagedMaterials(),
    getPendingApprovals(),
    getDeliverySchedule(),
    getMostBuiltProducts(),
    getBuildsByCategory(),
    getActiveSuppliersCount(),
  ])

  const kpi: OperationsKpiRow = {
    lowStockCount: lowStockItems.length,
    noStockCount: noStockItems.length,
    damagedQty: damagedMaterials.reduce((t, d) => t + d.qty, 0),
    pendingApprovalsCount: pendingApprovals.length,
    deliveriesCount: deliverySchedule.length,
    activeSuppliersCount,
  }

  return {
    kpi,
    mostBuiltMonth,
    mostBuiltYear,
    buildsByCategory,
    lowStockItems,
    noStockItems,
    damagedMaterials,
    pendingApprovals,
    deliverySchedule,
  }
}
