import { redirect } from "next/navigation"
import { prisma, Prisma } from "@furnitrack/db"
import {
  formatInquiryWorkflowStatus,
  getInquiryWorkflowStyle,
} from "@furnitrack/validators"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { FinishedProductsManager } from "@/components/operations/FinishedProductsManager"
import { StorefrontFilterManager } from "@/components/operations/StorefrontFilterManager"
import { DamagedMaterialsTable } from "@/components/inventory/DamagedMaterialsTable"
import { RawMaterialsManager } from "@/components/inventory/RawMaterialsManager"
import { AuditLogsTable } from "@/components/inventory/AuditLogsTable"
import { ReservedMaterialsAccordion } from "@/components/operations/ReservedMaterialsAccordion"
import { getInquiryWorkflowRows, type InquiryWorkflowRow } from "@/lib/inquiries"
import { ROLE_REDIRECT } from "@/lib/rbac"
import { OPERATIONS_DEFAULT_TAB, OPERATIONS_PRODUCT_CATEGORIES } from "@/lib/operations-products"

type OperationsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

type ProductCardData = {
  id: string
  productStockId: string
  name: string
  category: string
  price: number
  badge: string | null
  description: string
  isPublished: boolean
  state: string
  imageUrl: string
  warehouseName: string
  sku: string
  availableQty: number
  reorderThreshold: number
  materialSummary: string
  recipeCount: number
  recipeDetails: Array<{
    id: string
    itemName: string
    sku: string
    quantityDisplay: string | null
    notes: string | null
  }>
}

type InventoryRow = {
  id: string
  sku: string
  itemName: string
  itemType: string
  warehouseId: string
  warehouseName: string
  availableQty: number
  reservedQty: number
  reorderThreshold: number
  unitOfMeasure: string
}

type WarehouseSummaryRow = {
  id: string
  code: string
  name: string
  address: string
  itemCount: number
}

type StockRequestSummaryRow = {
  status: string
  count: number
}

type DetailedAuditLog = {
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
}

type DamagedMaterialRow = {
  id: string
  materialStockId: string
  sku: string
  itemName: string
  warehouseName: string
  quantity: number
  requesterName: string | null
  projectPurpose: string | null
  referenceNumber: string | null
  createdAt: Date
}

export type ReservedMaterialRow = {
  materialStockId: string
  sku: string
  itemName: string
  warehouseName: string
  unitOfMeasure: string
  availableQty: number
  reservedQty: number
  orderCount: number
  orderNumbers: string
}

export type ReservedMaterialDetailRow = {
  eventId: string
  materialStockId: string
  sku: string
  itemName: string
  warehouseName: string
  unitOfMeasure: string
  linkedOrderNo: string
  productName: string | null
  customerName: string | null
  reservationStatus: string
  dateReserved: Date
  reservedQty: number
}

const OPERATIONS_TABS = new Set([
  "design", "new-products", "finished-products", "archived-products", "storefront-filters",
  "locations", "all-stocks", "reserved", "damaged-materials",
  "inv-approvals", "approvals", "delivery", "audit",
])

function getSearchValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

function resolveTab(tab?: string | string[]) {
  const value = Array.isArray(tab) ? tab[0] : tab

  if (!value) {
    return OPERATIONS_DEFAULT_TAB
  }

  if (value === "design") {
    return OPERATIONS_DEFAULT_TAB
  }

  return OPERATIONS_TABS.has(value) ? value : OPERATIONS_DEFAULT_TAB
}

function asNumber(value: Prisma.Decimal | number | string | null | undefined) {
  if (value == null) {
    return 0
  }

  return Number(value)
}

function asImageUrl(value: Prisma.JsonValue | null) {
  if (!Array.isArray(value)) {
    return ""
  }

  return value.find((entry): entry is string => typeof entry === "string") ?? ""
}


function StatCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-3xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
      <p className="text-[12px] uppercase tracking-[0.16em] text-[#94a3b8]">{label}</p>
      <p className="mt-3 text-[30px] font-semibold text-[#0f172a]">{value}</p>
    </div>
  )
}

function WorkflowBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] ${getInquiryWorkflowStyle(status)}`}
    >
      {formatInquiryWorkflowStatus(status)}
    </span>
  )
}

function formatDateTime(value: Date | null) {
  if (!value) {
    return null
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(value)
}

function formatPeso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(value)
}

function formatPaymentStatus(status: InquiryWorkflowRow["paymentStatus"]) {
  return status
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ")
}

function toDateValue(value: Date | null) {
  if (!value) {
    return ""
  }

  const local = new Date(value.getTime() - value.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}

function startOfShippingDay(value: Date | null) {
  if (!value) {
    return null
  }

  const local = new Date(value.getFullYear(), value.getMonth(), value.getDate())
  return local
}

function ShippingProgressBadge({
  shippingScheduledAt,
}: {
  shippingScheduledAt: Date | null
}) {
  if (!shippingScheduledAt) {
    return (
      <span className="inline-flex rounded-full bg-[#fff7ed] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#c2410c]">
        Awaiting Shipping Schedule
      </span>
    )
  }

  const isReadyToComplete = shippingScheduledAt.getTime() <= Date.now()

  return (
    <span
      className={`inline-flex rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] ${
        isReadyToComplete ? "bg-[#ecfdf3] text-[#166534]" : "bg-[#eff6ff] text-[#1d4ed8]"
      }`}
    >
      {isReadyToComplete ? "Ready To Complete" : "In Shipping"}
    </span>
  )
}

function DeliveryQueueCard({
  inquiry,
  action,
}: {
  inquiry: InquiryWorkflowRow
  action: "build" | "ship"
}) {
  const formAction =
    action === "build" ? "/api/admin/approvals/operations/build" : "/api/admin/approvals/operations/ship"
  const buttonLabel = action === "build" ? "Approve for building" : "Mark shipped and complete"
  const placeholder =
    action === "build"
      ? "Confirm that operations has finished preparing this order."
      : "Add the shipping confirmation note for order history."
  const shippingScheduleLabel = formatDateTime(inquiry.shippingScheduledAt)
  const shippingDayStart = startOfShippingDay(inquiry.shippingScheduledAt)
  const isFullyPaid = inquiry.paymentStatus === "FULLY_PAID"
  const canCompleteNow = shippingDayStart ? shippingDayStart.getTime() <= Date.now() && isFullyPaid : false
  const progressWidth = inquiry.shippingScheduledAt ? (canCompleteNow ? "100%" : "66%") : "33%"

  return (
    <article className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Operations queue</p>
          <h3 className="mt-2 text-[24px] font-medium text-[#1a1a2e]">{inquiry.productName}</h3>
          <p className="mt-2 text-[13px] text-[#6a7282]">
            {inquiry.customerName} · {inquiry.customerEmail} · {inquiry.customerPhone}
          </p>
          {shippingScheduleLabel ? (
            <div className="mt-4 inline-flex rounded-[16px] bg-[#eff6ff] px-4 py-3 text-[13px] font-medium text-[#1d4ed8]">
              Shipment scheduled for {shippingScheduleLabel}
            </div>
          ) : null}
          <p className="mt-3 text-[14px] leading-[22px] text-[#1a1a2e]">{inquiry.message}</p>
          {inquiry.workflowNote ? (
            <div className="mt-4 rounded-[18px] bg-[#f9fafb] p-4 text-[13px] leading-[22px] text-[#4b5563]">
              Latest note: {inquiry.workflowNote}
            </div>
          ) : null}
          <div className="mt-4 grid gap-3 rounded-[18px] bg-[#f8fafc] p-4 sm:grid-cols-2 xl:grid-cols-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Total</p>
              <p className="mt-1 text-[13px] font-semibold text-[#111827]">{formatPeso(inquiry.total)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Down payment required</p>
              <p className="mt-1 text-[13px] font-semibold text-[#111827]">{formatPeso(inquiry.downPaymentRequired)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Paid</p>
              <p className="mt-1 text-[13px] font-semibold text-[#111827]">{formatPeso(inquiry.paid)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Remaining balance</p>
              <p className="mt-1 text-[13px] font-semibold text-[#111827]">{formatPeso(inquiry.remainingBalance)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Payment status</p>
              <p className="mt-1 text-[13px] font-semibold text-[#111827]">{formatPaymentStatus(inquiry.paymentStatus)}</p>
            </div>
          </div>
          <div className="mt-4 rounded-[18px] bg-[#f8fafc] p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Shipping progress</p>
                <p className="mt-2 text-[14px] font-medium text-[#1a1a2e]">
                  {shippingScheduleLabel
                    ? !isFullyPaid
                      ? "Shipping is blocked until accounting marks this order as fully paid."
                      : canCompleteNow
                      ? "Scheduled ship date reached. This order can now be completed."
                      : "In shipping. Waiting for the scheduled ship date to be reached."
                    : "Waiting for operations to schedule the shipping date."}
                </p>
                <p className="mt-1 text-[13px] text-[#4b5563]">
                  {shippingScheduleLabel ? `Ship date: ${shippingScheduleLabel}` : "Ship date: not set yet"}
                </p>
              </div>
              {action === "ship" ? (
                <div className="rounded-[14px] bg-white px-4 py-3 text-[13px] font-medium text-[#1d4ed8]">
                  {shippingScheduleLabel ? "In Shipping" : "Pending Shipping"}
                </div>
              ) : null}
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white">
              <div
                className={`h-full rounded-full transition-all ${
                  canCompleteNow ? "bg-[#16a34a]" : shippingScheduleLabel ? "bg-[#2563eb]" : "bg-[#cbd5e1]"
                }`}
                style={{ width: progressWidth }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          {action === "ship" ? (
            <ShippingProgressBadge shippingScheduledAt={inquiry.shippingScheduledAt} />
          ) : (
            <WorkflowBadge status={inquiry.workflowStatus} />
          )}
          <p className="text-[12px] text-[#6a7282]">Updated {new Date(inquiry.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>

      <form method="post" action={formAction} className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <input type="hidden" name="inquiryId" value={inquiry.id} />
        {action === "ship" ? (
          <label className="grid gap-2">
            <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Shipping date</span>
            <input
              type="date"
              name="shippingScheduledAt"
              defaultValue={toDateValue(inquiry.shippingScheduledAt)}
              className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
            />
          </label>
        ) : null}
        <label className="grid gap-2">
          <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Operations note</span>
          <input
            name="statusNote"
            defaultValue={inquiry.workflowNote ?? ""}
            placeholder={placeholder}
            className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
          />
        </label>

        <div className="flex items-end">
          {action === "ship" ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                name="submitMode"
                value="schedule"
                className="rounded-[12px] border border-[#111827] px-5 py-3 text-[13px] font-medium text-[#111827] transition-colors hover:bg-[#f9fafb]"
              >
                Save shipping schedule
              </button>
              <button
                type="submit"
                name="submitMode"
                value="complete"
                disabled={!canCompleteNow}
                className="rounded-[12px] bg-[#111827] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90 disabled:cursor-not-allowed disabled:bg-[#cbd5e1]"
              >
                {!canCompleteNow ? "Waiting for scheduled ship date" : buttonLabel}
              </button>
            </div>
          ) : (
            <button
              type="submit"
              className="rounded-[12px] bg-[#111827] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90"
            >
              {buttonLabel}
            </button>
          )}
        </div>
      </form>
      {action === "ship" && !canCompleteNow && shippingScheduleLabel ? (
        <p className="mt-3 text-[12px] text-[#b45309]">
          {isFullyPaid
            ? `This order can only be marked complete on or after ${shippingScheduleLabel}.`
            : "This order cannot be shipped yet because accounting has not marked it as fully paid."}
        </p>
      ) : null}
      {action === "build" ? (
        <p className="mt-3 text-[12px] text-[#6b7280]">
          Approve the build here first. Operations will set the shipping date in Delivery Schedule.
        </p>
      ) : null}
      {action === "ship" && !shippingScheduleLabel ? (
        <p className="mt-3 text-[12px] text-[#6b7280]">
          Set the shipping date here in Delivery Schedule before this order can be completed.
        </p>
      ) : null}
    </article>
  )
}

async function getOperationsWorkspaceData() {


  const [warehouses, rawMaterials, products, recipes, storefrontCategories] = await Promise.all([
    prisma.warehouse.findMany({
      select: {
        id: true,
        name: true,
        code: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.$queryRaw<
      Array<{
        id: string
        sku: string
        itemName: string
        availableQty: number
        unitOfMeasure: string
      }>
    >`
      SELECT
        id,
        sku,
        "itemName",
        "availableQty",
        "unitOfMeasure"
      FROM public.material_stocks
      ORDER BY "itemName" ASC /* bust_v3 */
    `,
    prisma.$queryRaw<
      Array<{
        id: string
        productStockId: string
        name: string
        category: string
        price: Prisma.Decimal | number | string
        badge: string | null
        description: string
        isPublished: boolean
        state: string
        images: Prisma.JsonValue | null
        warehouseName: string
        sku: string
        availableQty: number
        reorderThreshold: number
        materialSummary: string
        recipeCount: number
      }>
    >`
      SELECT
        p.id,
        p."productStockId",
        p.name,
        p.category,
        p.price,
        p.badge,
        p.description,
        p."isPublished",
        s.state::text AS state,
        p.images,
        w.name AS "warehouseName",
        s.sku,
        s."availableQty",
        s."reorderThreshold",
        p.material AS "materialSummary",
        COALESCE(recipe_counts."recipeCount", 0)::int AS "recipeCount"
      FROM public.products p
      INNER JOIN public.product_stocks s
        ON s.id = p."productStockId"
      INNER JOIN public.warehouses w
        ON w.id = s."warehouseId"
      LEFT JOIN LATERAL (
        SELECT COUNT(*)::int AS "recipeCount"
        FROM public.product_materials pm
        WHERE pm."productId" = p.id
      ) recipe_counts ON TRUE
      ORDER BY p."createdAt" DESC, p.name ASC /* bust_v3 */
    `,
    prisma.$queryRaw<
      Array<{
        productId: string
        id: string
        itemName: string
        sku: string
        quantityDisplay: string | null
        notes: string | null
      }>
    >`
      SELECT
        pm."productId" AS "productId",
        si.id,
        si."itemName",
        si.sku,
        pm."quantityDisplay",
        pm.notes
      FROM public.product_materials pm
      INNER JOIN public.material_stocks si
        ON si.id = pm."materialStockId"
      ORDER BY pm."createdAt" ASC /* bust_v3 */
    `,
    prisma.$queryRaw<Array<{ id: string; name: string }>>`
      SELECT id, name FROM public.storefront_categories ORDER BY name ASC /* bust_v3 */
    `,
  ])

  const recipeMap = recipes.reduce<Record<string, ProductCardData["recipeDetails"]>>((accumulator, recipe) => {
    const current = accumulator[recipe.productId] ?? []
    current.push({
      id: recipe.id,
      itemName: recipe.itemName,
      sku: recipe.sku,
      quantityDisplay: recipe.quantityDisplay,
      notes: recipe.notes,
    })
    accumulator[recipe.productId] = current
    return accumulator
  }, {})

  const finishedProducts: ProductCardData[] = products.map((product) => ({
    id: product.id,
    productStockId: product.productStockId,
    name: product.name,
    category: product.category,
    price: asNumber(product.price),
    badge: product.badge,
    description: product.description,
    isPublished: product.isPublished,
    state: product.state,
    imageUrl: asImageUrl(product.images),
    warehouseName: product.warehouseName,
    sku: product.sku,
    availableQty: product.availableQty,
    reorderThreshold: product.reorderThreshold,
    materialSummary: product.materialSummary,
    recipeCount: product.recipeCount,
    recipeDetails: recipeMap[product.id] ?? [],
  }))

  return {
    warehouses,
    rawMaterials,
    finishedProducts,
    storefrontCategories: storefrontCategories || [],
  }
}

async function getInventoryRows() {
  return prisma.$queryRaw<InventoryRow[]>(Prisma.sql`
    SELECT
      s.id,
      s.sku,
      s."itemName",
      'RAW_MATERIAL' AS "itemType",
      s."warehouseId",
      w.name AS "warehouseName",
      s."availableQty",
      s."reservedQty",
      s."reorderThreshold",
      s."unitOfMeasure"
    FROM public.material_stocks s
    INNER JOIN public.warehouses w
      ON w.id = s."warehouseId"
    ORDER BY s."itemName" ASC
  `)
}

async function getWarehouseSummaries() {
  return prisma.$queryRaw<WarehouseSummaryRow[]>(Prisma.sql`
    SELECT
      w.id,
      w.code,
      w.name,
      w.address,
      COUNT(s.id)::int AS "itemCount"
    FROM public.warehouses w
    LEFT JOIN public.material_stocks s
      ON s."warehouseId" = w.id
    GROUP BY w.id, w.code, w.name, w.address
    ORDER BY w.name ASC
  `)
}

async function getStockRequestSummaries() {
  return prisma.$queryRaw<StockRequestSummaryRow[]>(Prisma.sql`
    SELECT
      status::text AS status,
      COUNT(*)::int AS count
    FROM public.stock_requests
    GROUP BY status
    ORDER BY status
  `)
}

async function getAuditLogs(role: string) {
  return prisma.$queryRaw<DetailedAuditLog[]>(Prisma.sql`
    SELECT
      a.id,
      COALESCE(a.metadata->>'auditLabel', a.action::text) AS action,
      a."entityType"::text AS "entityType",
      a."entityId",
      a.metadata->>'sku' AS sku,
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
      COALESCE(
        a.metadata->>'updatedEmail',
        a.metadata->>'createdEmail',
        a.metadata->>'removedEmail',
        a.metadata->>'customerEmail',
        a.metadata->>'referenceNumber',
        a.metadata->>'category',
        a.metadata->>'reasonDetails'
      ) AS details,
      u.name AS "actorName",
      a."createdAt"
    FROM public.audit_logs a
    LEFT JOIN public.users u ON u.id = a."actorId"
      OR u."authUserId"::text = a."actorId"
    WHERE u.role = ${role}::"UserRole"
    ORDER BY a."createdAt" DESC
    LIMIT 200
  `)
}

async function getDamagedMaterialRows() {
  return prisma.$queryRaw<DamagedMaterialRow[]>(Prisma.sql`
    SELECT
      sm.id,
      sm."materialStockId",
      si.sku,
      si."itemName",
      w.name AS "warehouseName",
      sm.quantity,
      sm."requesterName",
      sm."projectPurpose",
      sm."referenceNumber",
      sm."createdAt"
    FROM public.stock_movements sm
    INNER JOIN public.material_stocks si
      ON si.id = sm."materialStockId"
    INNER JOIN public.warehouses w
      ON w.id = si."warehouseId"
    WHERE sm.type = 'DAMAGE'::"StockMovementType"
    ORDER BY sm."createdAt" DESC
  `)
}

async function getReservedMaterialRows() {
  return prisma.$queryRaw<ReservedMaterialRow[]>(Prisma.sql`
    WITH active_stock_request_reservations AS (
      SELECT
        si.id AS "materialStockId",
        si.sku,
        si."itemName",
        w.name AS "warehouseName",
        si."unitOfMeasure",
        COALESCE(SUM(srl."quantityApproved"), 0)::int AS "reservedQty",
        COUNT(DISTINCT so.id)::int AS "orderCount",
        STRING_AGG(DISTINCT so."soNumber", ', ' ORDER BY so."soNumber") AS "orderNumbers"
      FROM public.stock_request_line_items srl
      INNER JOIN public.stock_requests sr
        ON sr.id = srl."stockRequestId"
      INNER JOIN public.sales_orders so
        ON so.id = sr."salesOrderId"
      INNER JOIN public.material_stocks si
        ON si.id = srl."materialStockId"
      INNER JOIN public.warehouses w
        ON w.id = si."warehouseId"
      WHERE srl."quantityApproved" > 0
        AND sr.status IN ('APPROVED'::"InventoryRequestStatus", 'PARTIALLY_APPROVED'::"InventoryRequestStatus")
        AND so.status NOT IN ('DELIVERED'::"SalesOrderStatus", 'CANCELLED'::"SalesOrderStatus")
      GROUP BY si.id, si.sku, si."itemName", w.name, si."unitOfMeasure"
    ),
    active_accounting_reservations AS (
      SELECT
        si.id AS "materialStockId",
        si.sku,
        si."itemName",
        w.name AS "warehouseName",
        si."unitOfMeasure",
        COALESCE(SUM(sm.quantity), 0)::int AS "reservedQty",
        COUNT(DISTINCT sm."referenceNumber")::int AS "orderCount",
        STRING_AGG(
          DISTINCT COALESCE(p.name || ' - ' || ci."customerName", sm."referenceNumber"),
          ', '
          ORDER BY COALESCE(p.name || ' - ' || ci."customerName", sm."referenceNumber")
        ) AS "orderNumbers"
      FROM public.stock_movements sm
      INNER JOIN public.material_stocks si
        ON si.id = sm."materialStockId"
      INNER JOIN public.warehouses w
        ON w.id = si."warehouseId"
      LEFT JOIN public.customer_inquiries ci
        ON ci.id = sm."referenceNumber"
      LEFT JOIN public.products p
        ON p.id = ci."productId"
      WHERE sm.type = 'ADJUSTMENT'::"StockMovementType"
        AND sm."projectPurpose" = 'Reserved for Build Order'
        AND NOT EXISTS (
          SELECT 1
          FROM public.stock_movements consumed
          WHERE consumed."referenceNumber" = sm."referenceNumber"
            AND consumed."materialStockId" = sm."materialStockId"
            AND consumed."projectPurpose" = 'Build Order'
            AND consumed.type = 'OUT'::"StockMovementType"
        )
      GROUP BY si.id, si.sku, si."itemName", w.name, si."unitOfMeasure"
    ),
    combined AS (
      SELECT * FROM active_stock_request_reservations
      UNION ALL
      SELECT * FROM active_accounting_reservations
    )
    SELECT
      si.id AS "materialStockId",
      si.sku,
      si."itemName",
      w.name AS "warehouseName",
      si."unitOfMeasure",
      si."availableQty",
      COALESCE(SUM(combined."reservedQty"), 0)::int AS "reservedQty",
      COALESCE(SUM(combined."orderCount"), 0)::int AS "orderCount",
      STRING_AGG(DISTINCT combined."orderNumbers", ', ' ORDER BY combined."orderNumbers") AS "orderNumbers"
    FROM combined
    INNER JOIN public.material_stocks si
      ON si.id = combined."materialStockId"
    INNER JOIN public.warehouses w
      ON w.id = si."warehouseId"
    GROUP BY si.id, si.sku, si."itemName", w.name, si."unitOfMeasure", si."availableQty"
    ORDER BY "reservedQty" DESC, si."itemName" ASC
  `)
}

async function getReservedMaterialDetails() {
  return prisma.$queryRaw<ReservedMaterialDetailRow[]>(Prisma.sql`
    WITH active_stock_request_reservations AS (
      SELECT
        sr.id AS "eventId",
        si.id AS "materialStockId",
        si.sku,
        si."itemName",
        w.name AS "warehouseName",
        si."unitOfMeasure",
        so."soNumber" AS "linkedOrderNo",
        order_products."productName",
        so."clientContactName" AS "customerName",
        sr.status::text AS "reservationStatus",
        sr."requestedAt" AS "dateReserved",
        srl."quantityApproved"::int AS "reservedQty"
      FROM public.stock_request_line_items srl
      INNER JOIN public.stock_requests sr ON sr.id = srl."stockRequestId"
      INNER JOIN public.sales_orders so ON so.id = sr."salesOrderId"
      INNER JOIN public.material_stocks si ON si.id = srl."materialStockId"
      INNER JOIN public.warehouses w ON w.id = si."warehouseId"
      LEFT JOIN LATERAL (
        SELECT STRING_AGG(DISTINCT soli."productName", ', ' ORDER BY soli."productName") AS "productName"
        FROM public.sales_order_line_items soli
        WHERE soli."salesOrderId" = so.id
      ) order_products ON TRUE
      WHERE srl."quantityApproved" > 0
        AND sr.status IN ('APPROVED'::"InventoryRequestStatus", 'PARTIALLY_APPROVED'::"InventoryRequestStatus")
        AND so.status NOT IN ('DELIVERED'::"SalesOrderStatus", 'CANCELLED'::"SalesOrderStatus")
    ),
    active_accounting_reservations AS (
      SELECT
        sm.id AS "eventId",
        si.id AS "materialStockId",
        si.sku,
        si."itemName",
        w.name AS "warehouseName",
        si."unitOfMeasure",
        sm."referenceNumber" AS "linkedOrderNo",
        p.name AS "productName",
        ci."customerName" AS "customerName",
        'Accounting Reserved' AS "reservationStatus",
        sm."createdAt" AS "dateReserved",
        sm.quantity::int AS "reservedQty"
      FROM public.stock_movements sm
      INNER JOIN public.material_stocks si ON si.id = sm."materialStockId"
      INNER JOIN public.warehouses w ON w.id = si."warehouseId"
      LEFT JOIN public.customer_inquiries ci ON ci.id = sm."referenceNumber"
      LEFT JOIN public.products p ON p.id = ci."productId"
      WHERE sm.type = 'ADJUSTMENT'::"StockMovementType"
        AND sm."projectPurpose" = 'Reserved for Build Order'
        AND NOT EXISTS (
          SELECT 1 FROM public.stock_movements consumed
          WHERE consumed."referenceNumber" = sm."referenceNumber"
            AND consumed."materialStockId" = sm."materialStockId"
            AND consumed."projectPurpose" = 'Build Order'
            AND consumed.type = 'OUT'::"StockMovementType"
        )
    )
    SELECT * FROM active_stock_request_reservations
    UNION ALL
    SELECT * FROM active_accounting_reservations
    ORDER BY "dateReserved" DESC
  `)
}

export const dynamic = "force-dynamic"

export default async function OperationsDashboard({ searchParams }: OperationsPageProps) {
  const currentUser = await requireAuthenticatedAppUser()

  if (!["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
    redirect(ROLE_REDIRECT[currentUser.role])
  }

  const resolvedSearchParams = searchParams ? await searchParams : {}
  const activeTab = resolveTab(resolvedSearchParams.tab)
  const message = getSearchValue(resolvedSearchParams.message)
  const tone = getSearchValue(resolvedSearchParams.tone) === "error" ? "error" : "success"
  const [
    { warehouses, rawMaterials, finishedProducts, storefrontCategories },
    operationsInquiries,
    inventoryRows,
    warehouseSummaries,
    requestSummary,
    auditSummary,
    inventoryInquiries,
    damagedMaterials,
    reservedMaterials,
    reservedDetails,
  ] = await Promise.all([
    getOperationsWorkspaceData(),
    getInquiryWorkflowRows(["GETTING_READY_FOR_BUILDING", "READY_FOR_SHIPPING"]),
    getInventoryRows(),
    getWarehouseSummaries(),
    getStockRequestSummaries(),
    getAuditLogs(currentUser.role),
    getInquiryWorkflowRows(["PENDING_INVENTORY_APPROVAL"]),
    getDamagedMaterialRows(),
    getReservedMaterialRows(),
    getReservedMaterialDetails(),
  ])

  const activeFinishedProducts = finishedProducts.filter((product) => product.state !== "ARCHIVED")
  const archivedFinishedProducts = finishedProducts.filter((product) => product.state === "ARCHIVED")
  const publishedProducts = activeFinishedProducts.filter((product) => product.isPublished).length
  const buildingQueue = operationsInquiries.filter((inquiry) => inquiry.workflowStatus === "GETTING_READY_FOR_BUILDING")
  const shippingQueue = operationsInquiries.filter((inquiry) => inquiry.workflowStatus === "READY_FOR_SHIPPING")
  const rawMaterialsInv = inventoryRows.filter((row) => row.itemType !== "FINISHED_PRODUCT")
  const lowStockItems = rawMaterialsInv.filter((row) => row.availableQty <= row.reorderThreshold)

  return (
    <main className="min-h-screen overflow-auto bg-[#fcfcfc] p-8">
      <div className="mx-auto max-w-[1600px] space-y-8">
        <div>
          <h1 className="text-[28px] font-semibold text-[#111827]">Operations Product Workspace</h1>
        </div>

        {message ? (
          <div
            className={`rounded-2xl border px-5 py-4 text-[14px] ${
              tone === "error"
                ? "border-[#fecaca] bg-[#fff1f2] text-[#9f1239]"
                : "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
            }`}
          >
            {message}
          </div>
        ) : null}

        {activeTab === "finished-products" && (
          <div className="grid gap-5 md:grid-cols-3">
            <StatCard
              label="Catalog Products"
              value={activeFinishedProducts.length}
            />
            <StatCard
              label="Published"
              value={publishedProducts}
            />
            <StatCard
              label="Raw Materials"
              value={rawMaterials.length}
            />
          </div>
        )}

        {activeTab === "finished-products" && (
          <FinishedProductsManager products={activeFinishedProducts} rawMaterials={rawMaterials} warehouses={warehouses} categories={OPERATIONS_PRODUCT_CATEGORIES} />
        )}

        {activeTab === "archived-products" && (
          <div className="grid gap-5 md:grid-cols-3">
            <StatCard
              label="Archived Products"
              value={archivedFinishedProducts.length}
            />
          </div>
        )}

        {activeTab === "archived-products" && (
          <FinishedProductsManager products={archivedFinishedProducts} rawMaterials={rawMaterials} warehouses={warehouses} categories={OPERATIONS_PRODUCT_CATEGORIES} isArchivedView />
        )}

        {activeTab === "storefront-filters" && (
          <StorefrontFilterManager categories={storefrontCategories} products={finishedProducts} />
        )}

        {activeTab === "approvals" && (
          <div className="space-y-6">
            <div className="grid gap-5 md:grid-cols-3">
              <StatCard label="Building Queue" value={buildingQueue.length} />
              <StatCard label="Shipping Queue" value={shippingQueue.length} />
              <StatCard label="Delivery Flow" value="Step 4-5" />
            </div>

            <section className="rounded-[28px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-[22px] font-semibold text-[#111827]">Operations approval page</h2>
                <p className="mt-2 max-w-[760px] text-[14px] leading-[22px] text-[#64748b]">
                  Accounting-approved orders arrive here first for building preparation. Use this page to approve the
                  build stage and move each order into shipping.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">
                    Getting ready for building
                  </p>
                </div>
                {buildingQueue.length === 0 ? (
                  <div className="rounded-[20px] border border-dashed border-[#dbe4f0] bg-[#fbfdff] p-8 text-[14px] text-[#64748b]">
                    No orders are waiting for building preparation right now.
                  </div>
                ) : (
                  buildingQueue.map((inquiry) => (
                    <DeliveryQueueCard key={inquiry.id} inquiry={inquiry} action="build" />
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === "delivery" && (
          <div className="space-y-6">
            <section className="rounded-[28px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-[22px] font-semibold text-[#111827]">Delivery schedule</h2>
                <p className="mt-2 max-w-[760px] text-[14px] leading-[22px] text-[#64748b]">
                  Orders that already cleared operations show up here for shipping confirmation and completion.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">
                    Ready for shipping
                  </p>
                </div>
                {shippingQueue.length === 0 ? (
                  <div className="rounded-[20px] border border-dashed border-[#dbe4f0] bg-[#fbfdff] p-8 text-[14px] text-[#64748b]">
                    No orders are currently waiting to be marked shipped.
                  </div>
                ) : (
                  shippingQueue.map((inquiry) => (
                    <DeliveryQueueCard key={inquiry.id} inquiry={inquiry} action="ship" />
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === "locations" && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-[20px] font-semibold text-[#111827]">Warehouse Locations</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[{label:"Warehouses",value:warehouseSummaries.length},{label:"Tracked Materials",value:rawMaterialsInv.length},{label:"Low Stock Items",value:lowStockItems.length}].map(r=>(
                <div key={r.label} className="rounded-xl border border-[#e5e7eb] bg-white p-5">
                  <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">{r.label}</p>
                  <p className="mt-2 text-[28px] font-semibold text-[#111827]">{r.value}</p>
                </div>
              ))}
            </div>
            <section className="rounded-xl border border-[#e5e7eb] bg-white p-6">
              <h3 className="text-[18px] font-semibold text-[#111827]">Add new warehouse location</h3>
              <form method="post" action="/api/admin/inventory/warehouses/create" className="mt-5 grid gap-3 lg:grid-cols-[0.7fr_1fr_1.4fr_auto]">
                <input name="code" placeholder="Warehouse code" className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]" />
                <input name="name" placeholder="Warehouse name" className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]" />
                <input name="address" placeholder="Address or location" className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]" />
                <button type="submit" className="rounded-xl bg-[#111827] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90">Add warehouse</button>
              </form>
            </section>
            {warehouseSummaries.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#d1d5db] bg-white p-10 text-center text-[13px] text-[#6b7280]">No warehouses have been configured yet.</div>
            ) : (
              <section className="rounded-xl border border-[#e5e7eb] bg-white p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-[13px]">
                    <thead><tr className="border-b border-[#e5e7eb] text-[#6b7280]">
                      <th className="py-3 pr-4 font-medium">Code</th>
                      <th className="py-3 pr-4 font-medium">Warehouse</th>
                      <th className="py-3 pr-4 font-medium">Address</th>
                      <th className="py-3 font-medium">Tracked Items</th>
                    </tr></thead>
                    <tbody>{warehouseSummaries.map(row=>(
                      <tr key={row.id} className="border-b border-[#f3f4f6] last:border-b-0">
                        <td className="py-3 pr-4 text-[#111827]">{row.code}</td>
                        <td className="py-3 pr-4 text-[#111827]">{row.name}</td>
                        <td className="py-3 pr-4 text-[#6b7280]">{row.address}</td>
                        <td className="py-3 text-[#111827]">{row.itemCount}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === "all-stocks" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[{label:"Raw Materials",value:rawMaterialsInv.length},{label:"Low Stock",value:lowStockItems.length},{label:"Warehouses",value:warehouseSummaries.length}].map(r=>(
                <div key={r.label} className="rounded-xl border border-[#e5e7eb] bg-white p-5">
                  <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">{r.label}</p>
                  <p className="mt-2 text-[28px] font-semibold text-[#111827]">{r.value}</p>
                </div>
              ))}
            </div>
            <section className="rounded-xl border border-[#e5e7eb] bg-white p-6">
              <h3 className="text-[18px] font-semibold text-[#111827]">Add new raw material</h3>
              <form method="post" action="/api/admin/inventory/raw-materials/create" className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_1.1fr_1fr_0.9fr]">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-medium text-[#374151]">Material name</span>
                  <input name="itemName" className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]" />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-medium text-[#374151]">SKU (optional auto-generate)</span>
                  <input name="sku" className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]" />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-medium text-[#374151]">Select warehouse</span>
                  <select name="warehouseId" defaultValue="" className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]">
                    <option value="" disabled>Select warehouse</option>
                    {warehouseSummaries.map(w=>(<option key={w.id} value={w.id}>{w.name}</option>))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-medium text-[#374151]">Unit</span>
                  <input name="unitOfMeasure" defaultValue="0" className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]" />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-medium text-[#374151]">Reorder threshold</span>
                  <input name="reorderThreshold" type="number" min="0" defaultValue="10" className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]" />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-medium text-[#374151]">Opening stock</span>
                  <input name="openingQty" type="number" min="0" defaultValue="0" className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]" />
                </label>
                <label className="flex flex-col gap-1.5 xl:col-span-2">
                  <span className="text-[12px] font-medium text-[#374151]">Reference number (optional)</span>
                  <input name="referenceNumber" className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]" />
                </label>
                <label className="flex flex-col gap-1.5 xl:col-span-3">
                  <span className="text-[12px] font-medium text-[#374151]">Description (optional)</span>
                  <textarea name="description" className="min-h-[96px] rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]" />
                </label>
                <button type="submit" className="mt-auto rounded-xl bg-[#111827] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90 xl:self-stretch">Add raw material</button>
              </form>
            </section>
            <RawMaterialsManager rows={rawMaterialsInv} products={finishedProducts} />
          </div>
        )}

        {activeTab === "reserved" && (
          <div className="space-y-6">
            <div className="mb-6"><h2 className="text-[20px] font-semibold text-[#111827]">Reserved Materials From Orders</h2></div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                {label:"Reserved Material Types",value:reservedMaterials.length},
                {label:"Reserved Units",value:reservedMaterials.reduce((t,r)=>t+r.reservedQty,0)},
                {label:"Linked Orders",value:reservedMaterials.reduce((t,r)=>t+r.orderCount,0)}
              ].map(r=>(
                <div key={r.label} className="rounded-xl border border-[#e5e7eb] bg-white p-5">
                  <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">{r.label}</p>
                  <p className="mt-2 text-[28px] font-semibold text-[#111827]">{r.value}</p>
                </div>
              ))}
            </div>
            {reservedMaterials.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#d1d5db] bg-white p-10 text-center text-[13px] text-[#6b7280]">No materials are currently reserved for active orders.</div>
            ) : (
              <ReservedMaterialsAccordion
                materials={reservedMaterials}
                details={reservedDetails}
              />
            )}
          </div>
        )}

        {activeTab === "damaged-materials" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                {label:"Damaged Entries",value:damagedMaterials.length},
                {label:"Unique Materials",value:new Set(damagedMaterials.map(r=>r.materialStockId)).size},
                {label:"Return References",value:new Set(damagedMaterials.map(r=>r.referenceNumber).filter(Boolean)).size},
              ].map(r=>(
                <div key={r.label} className="rounded-xl border border-[#e5e7eb] bg-white p-5">
                  <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">{r.label}</p>
                  <p className="mt-2 text-[28px] font-semibold text-[#111827]">{r.value}</p>
                </div>
              ))}
            </div>
            <DamagedMaterialsTable rows={damagedMaterials} />
          </div>
        )}

        {activeTab === "inv-approvals" && (
          <div className="space-y-6">
            <div className="mb-6"><h2 className="text-[20px] font-semibold text-[#111827]">Inventory Approval — Order Stock Check</h2></div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                {label:"Orders Waiting",value:inventoryInquiries.length},
                {label:"Low Stock Items",value:lowStockItems.length},
                {label:"Stock Request Logs",value:requestSummary.reduce((t,r)=>t+r.count,0)},
              ].map(r=>(
                <div key={r.label} className="rounded-xl border border-[#e5e7eb] bg-white p-5">
                  <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">{r.label}</p>
                  <p className="mt-2 text-[28px] font-semibold text-[#111827]">{r.value}</p>
                </div>
              ))}
            </div>
            {requestSummary.length > 0 && (
              <section className="rounded-xl border border-[#e5e7eb] bg-white p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-[13px]">
                    <thead><tr className="border-b border-[#e5e7eb] text-[#6b7280]">
                      <th className="py-3 pr-4 font-medium">Request Status</th><th className="py-3 font-medium">Count</th>
                    </tr></thead>
                    <tbody>{requestSummary.map(row=>(
                      <tr key={row.status} className="border-b border-[#f3f4f6] last:border-b-0">
                        <td className="py-3 pr-4 text-[#111827]">{row.status.replaceAll("_"," ")}</td>
                        <td className="py-3 text-[#111827]">{row.count}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </section>
            )}
            <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-[20px] font-semibold text-[#111827]">Customer orders waiting for stock confirmation</h2>
                <p className="mt-2 max-w-[760px] text-[14px] leading-[22px] text-[#6b7280]">
                  Sales has already checked these orders. Approve them here once material availability is confirmed so accounting can continue with payment processing.
                </p>
              </div>
              {inventoryInquiries.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#d1d5db] bg-white p-10 text-center text-[13px] text-[#6b7280]">No customer orders are currently waiting on inventory approval.</div>
              ) : (
                <div className="space-y-4">
                  {inventoryInquiries.map(inquiry=>(
                    <article key={inquiry.id} className="rounded-xl border border-[#eef2f7] bg-[#fbfcfd] p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Material approval request</p>
                          <h3 className="mt-1 text-[20px] font-semibold text-[#111827]">{inquiry.productName}</h3>
                          <p className="mt-2 text-[13px] text-[#6b7280]">{inquiry.customerName} · {inquiry.customerEmail} · {inquiry.customerPhone}</p>
                          <p className="mt-3 max-w-[720px] text-[14px] leading-[22px] text-[#1f2937]">{inquiry.message}</p>
                          {inquiry.workflowNote ? (
                            <p className="mt-3 rounded-xl bg-white px-4 py-3 text-[13px] text-[#4b5563]">Latest note: {inquiry.workflowNote}</p>
                          ) : null}
                        </div>
                        <div className="flex flex-col items-start gap-3 text-[12px] text-[#6b7280] lg:items-end">
                          <span className={`inline-flex rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] ${getInquiryWorkflowStyle(inquiry.workflowStatus)}`}>
                            {formatInquiryWorkflowStatus(inquiry.workflowStatus)}
                          </span>
                          <div>
                            <p>Created {new Date(inquiry.createdAt).toLocaleDateString()}</p>
                            <p className="mt-1">Updated {new Date(inquiry.updatedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <form method="post" action="/api/admin/approvals/inventory" className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
                        <input type="hidden" name="inquiryId" value={inquiry.id} />
                        <label className="block">
                          <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Inventory approval note</span>
                          <input name="statusNote" defaultValue={inquiry.workflowNote ?? ""} placeholder="Confirm stock readiness for accounting" className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]" />
                        </label>
                        <div className="flex items-end">
                          <button type="submit" className="rounded-[12px] bg-[#111827] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90">Approve materials</button>
                        </div>
                      </form>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === "audit" && (
          <div className="space-y-6">
            <div className="mb-6"><h2 className="text-[20px] font-semibold text-[#111827]">Audit Logs</h2></div>
            <AuditLogsTable rows={auditSummary} />
          </div>
        )}

      </div>
    </main>
  )
}

