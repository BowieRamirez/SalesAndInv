import { redirect } from "next/navigation"
import { prisma, Prisma } from "@furnitrack/db"
import {
  formatInquiryWorkflowStatus,
  getInquiryWorkflowStyle,
} from "@furnitrack/validators"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { FinishedProductsManager } from "@/components/operations/FinishedProductsManager"
import { InventoryApprovalCard } from "@/components/operations/InventoryApprovalCard"
import { WarehouseLocationsTable, ArchivedWarehousesTable, type WarehouseSummaryRow as WarehouseRow } from "@/components/operations/WarehouseLocationsManager"
import { StorefrontFilterManager } from "@/components/operations/StorefrontFilterManager"
import { DamagedMaterialsTable } from "@/components/inventory/DamagedMaterialsTable"
import { RawMaterialsManager } from "@/components/inventory/RawMaterialsManager"
import { AddRawMaterialModal } from "@/components/inventory/AddRawMaterialModal"
import { OperationsDashboard as OperationsDashboardPanel } from "@/components/operations/OperationsDashboard"
import { getOperationsDashboardData } from "@/lib/dashboard/operations"
import { AuditLogsTable } from "@/components/inventory/AuditLogsTable"
import { ReservedMaterialsAccordion } from "@/components/operations/ReservedMaterialsAccordion"
import { SuppliersManager } from "@/components/procurement/SuppliersManager"
import { getInquiryWorkflowRows, type InquiryWorkflowRow } from "@/lib/inquiries"
import { getAuditLogs } from "@/lib/audit-logs"
import { getSuppliers } from "@/lib/procurement"
import { ROLE_REDIRECT } from "@/lib/rbac"
import { OPERATIONS_DEFAULT_TAB, OPERATIONS_PRODUCT_CATEGORIES } from "@/lib/operations-products"

type OperationsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

type ProductCardData = {
  id: string
  productStockId: string
  name: string
  productCode: string | null
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
  colorVariants: Array<{ name: string; hex: string; sku: string }>
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

const OPERATIONS_TABS = new Set([
  "design", "new-products", "finished-products", "archived-products", "storefront-filters",
  "locations", "archived-warehouses", "all-stocks", "reserved", "damaged-materials",
  "inv-approvals", "approvals", "delivery", "audit", "suppliers", "dashboard",
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

  // Remaining balance that the customer still needs to pay
  const hasRemainingBalance = inquiry.remainingBalance > 0
  // For the shipping (delivery) stage, block the button if balance is unpaid
  const isBlockedByBalance = action === "ship" && hasRemainingBalance

  return (
    <article className={`rounded-[24px] border bg-white p-6 shadow-sm ${hasRemainingBalance ? "border-[#fcd34d]" : "border-[#e5e7eb]"}`}>
      {/* ── Remaining balance warning banner ── */}
      {hasRemainingBalance && (
        <div className="mb-5 flex items-start gap-3 rounded-[16px] border border-[#fde68a] bg-[#fffbeb] px-5 py-4">
          <div className="mt-0.5 flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#fef3c7]">
            <span className="text-[16px]">⚠️</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#92400e]">
              Balance Payment Required
            </p>
            <p className="mt-1 text-[13px] text-[#78350f]">
              This order has an unpaid remaining balance of{" "}
              <span className="font-bold">{formatPeso(inquiry.remainingBalance)}</span>.
              The customer must settle this before the order can be set for delivery.
            </p>
            {action === "ship" && (
              <p className="mt-1.5 text-[12px] font-medium text-[#a16207]">
                Delivery scheduling is disabled until the balance is fully paid.
              </p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#92400e]">Remaining</p>
            <p className="mt-0.5 text-[18px] font-bold text-[#78350f]">{formatPeso(inquiry.remainingBalance)}</p>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Operations queue</p>
          <h3 className="mt-2 text-[24px] font-medium text-[#1a1a2e]">{inquiry.productName}</h3>
          <p className="mt-2 text-[13px] text-[#6a7282]">
            {inquiry.customerName} · {inquiry.customerEmail} · {inquiry.customerPhone}
          </p>
          {(inquiry.quantity ?? 1) > 1 && (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#eff6ff] px-3 py-1 text-[12px] font-semibold text-[#1d4ed8]">
              Qty: {inquiry.quantity} units
            </span>
          )}
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
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Quantity</p>
              <p className="mt-1 text-[13px] font-semibold text-[#111827]">{inquiry.quantity ?? 1} {(inquiry.quantity ?? 1) === 1 ? "unit" : "units"}</p>
            </div>
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
                disabled={isBlockedByBalance}
                className="rounded-[12px] border border-[#111827] px-5 py-3 text-[13px] font-medium text-[#111827] transition-colors hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:border-[#cbd5e1] disabled:text-[#cbd5e1]"
              >
                Save shipping schedule
              </button>
              <button
                type="submit"
                name="submitMode"
                value="complete"
                disabled={!canCompleteNow || isBlockedByBalance}
                className="rounded-[12px] bg-[#111827] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90 disabled:cursor-not-allowed disabled:bg-[#cbd5e1]"
              >
                {isBlockedByBalance ? "Balance unpaid — cannot ship" : !canCompleteNow ? "Waiting for scheduled ship date" : buttonLabel}
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
        productCode: string | null
        category: string
        price: Prisma.Decimal | number | string
        badge: string | null
        description: string
        isPublished: boolean
        state: string
        images: Prisma.JsonValue | null
        colorVariants: Prisma.JsonValue | null
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
        p."productCode",
        p.category,
        p.price,
        p.badge,
        p.description,
        p."isPublished",
        s.state::text AS state,
        p.images,
        p."colorVariants",
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
      ORDER BY p."createdAt" DESC, p.name ASC /* bust_v4 */
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
    productCode: product.productCode ?? null,
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
    colorVariants: Array.isArray(product.colorVariants)
      ? product.colorVariants.flatMap((v) => {
          if (v && typeof v === "object" && !Array.isArray(v)) {
            const o = v as Record<string, unknown>
            const n = typeof o.name === "string" ? o.name : null
            const h = typeof o.hex === "string" ? o.hex : null
            const s = typeof o.sku === "string" ? o.sku : null
            if (n && h && s) return [{ name: n, hex: h, sku: s }]
          }
          return []
        })
      : [],
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
  return prisma.$queryRaw<WarehouseRow[]>(Prisma.sql`
    SELECT
      w.id,
      w.code,
      w.name,
      w.street,
      w.city,
      w.country,
      w."postalCode",
      w."archivedAt"::text AS "archivedAt",
      COUNT(s.id)::int AS "itemCount"
    FROM public.warehouses w
    LEFT JOIN public.material_stocks s
      ON s."warehouseId" = w.id
    WHERE w."archivedAt" IS NULL
    GROUP BY w.id, w.code, w.name, w.street, w.city, w.country, w."postalCode", w."archivedAt"
    ORDER BY w.name ASC
  `)
}

async function getArchivedWarehouses() {
  return prisma.$queryRaw<WarehouseRow[]>(Prisma.sql`
    SELECT
      w.id,
      w.code,
      w.name,
      w.street,
      w.city,
      w.country,
      w."postalCode",
      w."archivedAt"::text AS "archivedAt",
      COUNT(s.id)::int AS "itemCount"
    FROM public.warehouses w
    LEFT JOIN public.material_stocks s
      ON s."warehouseId" = w.id
    WHERE w."archivedAt" IS NOT NULL
    GROUP BY w.id, w.code, w.name, w.street, w.city, w.country, w."postalCode", w."archivedAt"
    ORDER BY w."archivedAt" DESC
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
  // Reserved materials are now tracked only via stock_movements (ADJUSTMENT type, 'Reserved for Build Order')
  return prisma.$queryRaw<ReservedMaterialRow[]>(Prisma.sql`
    SELECT
      si.id AS "materialStockId",
      si.sku,
      si."itemName",
      w.name AS "warehouseName",
      si."unitOfMeasure",
      si."availableQty",
      COALESCE(SUM(sm.quantity), 0)::int AS "reservedQty",
      COUNT(DISTINCT sm."referenceNumber")::int AS "orderCount",
      STRING_AGG(DISTINCT COALESCE(p.name || ' - ' || ci."customerName", sm."referenceNumber"), ', '
        ORDER BY COALESCE(p.name || ' - ' || ci."customerName", sm."referenceNumber")) AS "orderNumbers"
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
    GROUP BY si.id, si.sku, si."itemName", w.name, si."unitOfMeasure", si."availableQty"
    ORDER BY "reservedQty" DESC, si."itemName" ASC
  `)
}

async function getReservedMaterialDetails() {
  return prisma.$queryRaw<ReservedMaterialDetailRow[]>(Prisma.sql`
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
    ORDER BY sm."createdAt" DESC
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
    archivedWarehouses,
    auditSummary,
    inventoryInquiries,
    damagedMaterials,
    reservedMaterials,
    reservedDetails,
    operationsDashboardData,
  ] = await Promise.all([
    getOperationsWorkspaceData(),
    getInquiryWorkflowRows(["GETTING_READY_FOR_BUILDING", "READY_FOR_SHIPPING"]),
    getInventoryRows(),
    getWarehouseSummaries(),
    getArchivedWarehouses(),
    getAuditLogs([currentUser.id, currentUser.authUserId].filter(Boolean) as string[], 200),
    getInquiryWorkflowRows(["PENDING_INVENTORY_APPROVAL"]),
    getDamagedMaterialRows(),
    getReservedMaterialRows(),
    getReservedMaterialDetails(),
    activeTab === "dashboard" ? getOperationsDashboardData() : Promise.resolve(null),
  ])

  // Suppliers data (only fetch when on suppliers tab)
  const suppliers = activeTab === "suppliers" ? await getSuppliers() : []

  const activeFinishedProducts = finishedProducts.filter((product) => product.state !== "ARCHIVED")
  const archivedFinishedProducts = finishedProducts.filter((product) => product.state === "ARCHIVED")
  const publishedProducts = activeFinishedProducts.filter((product) => product.isPublished).length
  const buildingQueue = operationsInquiries.filter((inquiry) => inquiry.workflowStatus === "GETTING_READY_FOR_BUILDING")
  const shippingQueue = operationsInquiries.filter((inquiry) => inquiry.workflowStatus === "READY_FOR_SHIPPING")
  const rawMaterialsInv = inventoryRows.filter((row) => row.itemType !== "FINISHED_PRODUCT")
  const lowStockItems = rawMaterialsInv.filter((row) => row.availableQty <= row.reorderThreshold)

  // Fetch product IDs and materials for inventory approval inquiries
  type InvInquiryWithProduct = {
    inquiryId: string
    productId: string
  }
  type InvMaterialRow = {
    inquiryId: string
    materialStockId: string
    sku: string
    itemName: string
    availableQty: number
    quantityRequired: number
  }

  const inventoryInquiryProducts = activeTab === "inv-approvals" && inventoryInquiries.length > 0
    ? await prisma.$queryRaw<InvInquiryWithProduct[]>(Prisma.sql`
        SELECT ci.id AS "inquiryId", ci."productId"
        FROM public.customer_inquiries ci
        WHERE ci.id IN (${Prisma.join(inventoryInquiries.map((i) => i.id))})
      `)
    : []

  const productIdByInquiryId = new Map(
    inventoryInquiryProducts.map((row) => [row.inquiryId, row.productId])
  )

  const inventoryMaterialsByInquiryId = new Map<string, InvMaterialRow[]>()

  if (inventoryInquiryProducts.length > 0) {
    const productIds = [...new Set(inventoryInquiryProducts.map((r) => r.productId))]
    const allMaterials = await prisma.$queryRaw<Array<InvMaterialRow & { productId: string }>>(Prisma.sql`
      SELECT
        pm."productId",
        pm."materialStockId",
        ms.sku,
        ms."itemName",
        ms."availableQty",
        COALESCE(CEIL(pm."quantityRequired")::int, 0) AS "quantityRequired"
      FROM public.product_materials pm
      INNER JOIN public.material_stocks ms ON ms.id = pm."materialStockId"
      WHERE pm."productId" IN (${Prisma.join(productIds)})
      ORDER BY ms."itemName" ASC
    `)

    for (const row of inventoryInquiryProducts) {
      const mats = allMaterials
        .filter((m) => m.productId === row.productId)
        .map(({ productId: _pid, ...rest }) => ({ ...rest, inquiryId: row.inquiryId }))
      inventoryMaterialsByInquiryId.set(row.inquiryId, mats)
    }
  }

  return (
    <main className="min-h-screen overflow-auto bg-[#fcfcfc] p-8">
      <div className={`${activeTab === "dashboard" ? "w-full" : "mx-auto max-w-[1600px]"} space-y-8`}>
        <div>
          <h1 className="text-[20px] font-semibold text-[#111827]">Welcome back, {currentUser.name}</h1>
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

        {activeTab === "dashboard" && (
          <OperationsDashboardPanel data={operationsDashboardData!} />
        )}

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
          <FinishedProductsManager products={activeFinishedProducts} rawMaterials={rawMaterials} warehouses={warehouses} categories={OPERATIONS_PRODUCT_CATEGORIES} userRole={currentUser.role} />
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
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-[20px] font-semibold text-[#111827]">Warehouse Locations</h2>
              {archivedWarehouses.length > 0 && (
                <a
                  href="/operations?tab=archived-warehouses"
                  className="flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-4 py-2 text-[13px] font-medium text-[#64748b] transition-all hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  View archived ({archivedWarehouses.length})
                </a>
              )}
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
              <form method="post" action="/api/admin/inventory/warehouses/create" className="mt-5 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <input name="code" required placeholder="Code (e.g. MAIN)" className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]" />
                  <input name="name" required placeholder="Warehouse name" className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]" />
                  <input name="street" placeholder="Street address" className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]" />
                  <input name="city" placeholder="City" className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]" />
                  <input name="postalCode" placeholder="Postal code" className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]" />
                  <input name="country" placeholder="Country" defaultValue="Philippines" className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]" />
                </div>
                <button type="submit" className="rounded-xl bg-[#111827] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90">Add warehouse</button>
              </form>
            </section>
            <WarehouseLocationsTable warehouses={warehouseSummaries} />
          </div>
        )}

        {activeTab === "archived-warehouses" && (
          <div className="space-y-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-[20px] font-semibold text-[#111827]">Archived Warehouses</h2>
                <p className="mt-1 text-[14px] text-[#6b7280]">
                  These locations are hidden from active lists. Restore them to make them available again.
                </p>
              </div>
              <a
                href="/operations?tab=locations"
                className="flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-4 py-2 text-[13px] font-medium text-[#64748b] hover:bg-[#f8fafc]"
              >
                ← Back to active warehouses
              </a>
            </div>
            <ArchivedWarehousesTable warehouses={archivedWarehouses} />
          </div>
        )}

        {activeTab === "all-stocks" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-semibold text-[#111827]">Online Raw Materials: {rawMaterialsInv.length} </h3>
                <p className="mt-0.5 text-[13px] text-[#6b7280]">All stock entries across warehouses.</p>
              </div>
              <AddRawMaterialModal warehouses={warehouseSummaries.map(w => ({ id: w.id, name: w.name }))} />
            </div>
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
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {[
                {label:"Orders Waiting",value:inventoryInquiries.length},
                {label:"Low Stock Items",value:lowStockItems.length},
              ].map(r=>(
                <div key={r.label} className="rounded-xl border border-[#e5e7eb] bg-white p-5">
                  <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">{r.label}</p>
                  <p className="mt-2 text-[28px] font-semibold text-[#111827]">{r.value}</p>
                </div>
              ))}
            </div>
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
                    <InventoryApprovalCard
                      key={inquiry.id}
                      inquiry={{
                        id: inquiry.id,
                        productName: inquiry.productName,
                        productId: productIdByInquiryId.get(inquiry.id) ?? "",
                        customerName: inquiry.customerName,
                        customerEmail: inquiry.customerEmail,
                        customerPhone: inquiry.customerPhone,
                        message: inquiry.message,
                        quantity: inquiry.quantity,
                        workflowStatus: inquiry.workflowStatus,
                        workflowNote: inquiry.workflowNote,
                        createdAt: inquiry.createdAt,
                        updatedAt: inquiry.updatedAt,
                      }}
                      materials={inventoryMaterialsByInquiryId.get(inquiry.id) ?? []}
                    />
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

        {activeTab === "suppliers" && (
          <div className="space-y-6">
            <SuppliersManager
              suppliers={suppliers}
              materials={rawMaterialsInv.map((m) => ({
                id: m.id,
                sku: m.sku,
                itemName: m.itemName,
                unitOfMeasure: m.unitOfMeasure,
              }))}
            />
          </div>
        )}

      </div>
    </main>
  )
}

