import { redirect } from "next/navigation"
import { prisma, type Prisma } from "@furnitrack/db"
import {
  formatInquiryWorkflowStatus,
  getInquiryWorkflowStyle,
} from "@furnitrack/validators"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { FinishedProductsManager } from "@/components/operations/FinishedProductsManager"
import { ImageDropField } from "@/components/operations/ImageDropField"
import { MaterialSelector } from "@/components/operations/MaterialSelector"
import { getInquiryWorkflowRows, type InquiryWorkflowRow } from "@/lib/inquiries"
import { ROLE_REDIRECT } from "@/lib/rbac"
import { OPERATIONS_DEFAULT_TAB, OPERATIONS_PRODUCT_CATEGORIES } from "@/lib/operations-products"

type OperationsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

type ProductCardData = {
  id: string
  stockItemId: string
  name: string
  category: string
  price: number
  badge: string | null
  description: string
  isPublished: boolean
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

const OPERATIONS_TABS = new Set(["design", "new-products", "finished-products", "approvals", "delivery", "company-code"])

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

function PlaceholderCard({
  title,
}: {
  title: string
}) {
  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white p-8 shadow-sm">
      <h3 className="text-[16px] font-semibold text-[#111827]">{title}</h3>
    </div>
  )
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
  const canCompleteNow = shippingDayStart ? shippingDayStart.getTime() <= Date.now() : false
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
          <div className="mt-4 rounded-[18px] bg-[#f8fafc] p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Shipping progress</p>
                <p className="mt-2 text-[14px] font-medium text-[#1a1a2e]">
                  {shippingScheduleLabel
                    ? canCompleteNow
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
          This order can only be marked complete on or after {shippingScheduleLabel}.
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
  const [warehouses, rawMaterials, products, recipes] = await Promise.all([
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
      FROM public.stock_items
      WHERE "itemType" = 'RAW_MATERIAL'::"InventoryItemType"
      ORDER BY "itemName" ASC
    `,
    prisma.$queryRaw<
      Array<{
        id: string
        stockItemId: string
        name: string
        category: string
        price: Prisma.Decimal | number | string
        badge: string | null
        description: string
        isPublished: boolean
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
        p."stockItemId",
        p.name,
        p.category,
        p.price,
        p.badge,
        p.description,
        p."isPublished",
        p.images,
        w.name AS "warehouseName",
        s.sku,
        s."availableQty",
        s."reorderThreshold",
        p.material AS "materialSummary",
        COALESCE(recipe_counts."recipeCount", 0)::int AS "recipeCount"
      FROM public.products p
      INNER JOIN public.stock_items s
        ON s.id = p."stockItemId"
      INNER JOIN public.warehouses w
        ON w.id = s."warehouseId"
      LEFT JOIN LATERAL (
        SELECT COUNT(*)::int AS "recipeCount"
        FROM public.product_materials pm
        WHERE pm."productId" = p.id
      ) recipe_counts ON TRUE
      ORDER BY p."createdAt" DESC, p.name ASC
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
      INNER JOIN public.stock_items si
        ON si.id = pm."stockItemId"
      ORDER BY pm."createdAt" ASC
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
    stockItemId: product.stockItemId,
    name: product.name,
    category: product.category,
    price: asNumber(product.price),
    badge: product.badge,
    description: product.description,
    isPublished: product.isPublished,
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
  }
}

export const dynamic = "force-dynamic"

export default async function OperationsDashboard({ searchParams }: OperationsPageProps) {
  const currentUser = await requireAuthenticatedAppUser()

  if (!["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT"].includes(currentUser.role)) {
    redirect(ROLE_REDIRECT[currentUser.role])
  }

  const resolvedSearchParams = searchParams ? await searchParams : {}
  const activeTab = resolveTab(resolvedSearchParams.tab)
  const message = getSearchValue(resolvedSearchParams.message)
  const tone = getSearchValue(resolvedSearchParams.tone) === "error" ? "error" : "success"
  const [{ warehouses, rawMaterials, finishedProducts }, operationsInquiries] = await Promise.all([
    getOperationsWorkspaceData(),
    getInquiryWorkflowRows(["GETTING_READY_FOR_BUILDING", "READY_FOR_SHIPPING"]),
  ])
  const publishedProducts = finishedProducts.filter((product) => product.isPublished).length
  const buildingQueue = operationsInquiries.filter((inquiry) => inquiry.workflowStatus === "GETTING_READY_FOR_BUILDING")
  const shippingQueue = operationsInquiries.filter((inquiry) => inquiry.workflowStatus === "READY_FOR_SHIPPING")

  return (
    <main className="min-h-screen overflow-auto bg-[#fcfcfc] p-8">
      <div className="mx-auto max-w-7xl space-y-8">
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

        {(activeTab === "new-products" || activeTab === "finished-products") && (
          <div className="grid gap-5 md:grid-cols-3">
            <StatCard
              label="Catalog Products"
              value={finishedProducts.length}
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

        {activeTab === "new-products" && (
          <div className="space-y-6">
            <section className="rounded-[28px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <h2 className="text-[22px] font-semibold text-[#111827]">Create finished product</h2>
                </div>
                <div className="rounded-2xl border border-[#dbe4f0] bg-[#f8fafc] px-4 py-3 text-[13px] text-[#475569]">
                  Neon `products` and `stock_items`
                </div>
              </div>

              {rawMaterials.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-[#fca5a5] bg-[#fff7f7] p-6 text-[14px] text-[#b91c1c]">
                  No raw materials exist in inventory yet, so finished products cannot be created. Add the needed
                  materials in Inventory first.
                </div>
              ) : null}

              <form method="post" action="/api/admin/operations/products/create" className="mt-6 space-y-6">
                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="grid gap-4 rounded-3xl border border-[#e2e8f0] bg-[#fbfdff] p-5">
                    <div>
                      <h3 className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">
                        Catalog details
                      </h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Product name</span>
                        <input
                          name="name"
                          placeholder="Executive desk"
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Storefront category</span>
                        <select
                          name="category"
                          defaultValue={OPERATIONS_PRODUCT_CATEGORIES[0]}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        >
                          {OPERATIONS_PRODUCT_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Warehouse</span>
                        <select
                          name="warehouseId"
                          defaultValue={warehouses[0]?.id ?? ""}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        >
                          {warehouses.map((warehouse) => (
                            <option key={warehouse.id} value={warehouse.id}>
                              {warehouse.name} ({warehouse.code})
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Price</span>
                        <input
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="15000"
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="md:col-span-2 grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Product image</span>
                        <ImageDropField name="imageUrl" />
                      </label>
                      <label className="md:col-span-2 grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Description</span>
                        <textarea
                          name="description"
                          rows={5}
                          placeholder="Describe the finished product as it should appear in the storefront."
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid gap-4 rounded-3xl border border-[#e2e8f0] bg-[#fbfdff] p-5">
                    <div>
                      <h3 className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">
                        Stock and storefront settings
                      </h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Opening stock</span>
                        <input
                          name="openingQty"
                          type="number"
                          min="0"
                          defaultValue={0}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Reorder threshold</span>
                        <input
                          name="reorderThreshold"
                          type="number"
                          min="0"
                          defaultValue={10}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Width (cm)</span>
                        <input
                          name="widthCm"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={0}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Depth (cm)</span>
                        <input
                          name="depthCm"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={0}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Height (cm)</span>
                        <input
                          name="heightCm"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={0}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Weight (kg)</span>
                        <input
                          name="weightKg"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={0}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Unit of measure</span>
                        <input
                          name="unitOfMeasure"
                          defaultValue="pcs"
                          placeholder="pcs"
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Badge</span>
                        <input
                          name="badge"
                          placeholder="SALE, HOT, BEST_SELLER"
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                    </div>
                    <label className="inline-flex items-center gap-3 rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#334155]">
                      <input type="checkbox" name="isPublished" defaultChecked className="h-4 w-4" />
                      Publish this product to the customer storefront immediately.
                    </label>
                  </div>
                </div>

                <MaterialSelector materials={rawMaterials} />

                <div className="flex items-center justify-between gap-4 rounded-3xl border border-[#e2e8f0] bg-[#fbfdff] px-5 py-4">
                  <button
                    type="submit"
                    disabled={rawMaterials.length === 0}
                    className="rounded-2xl bg-[#111827] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#111827]/90 disabled:cursor-not-allowed disabled:bg-[#cbd5e1]"
                  >
                    Create finished product
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}

        {activeTab === "finished-products" && (
          <FinishedProductsManager products={finishedProducts} />
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

        {activeTab === "company-code" && (
          <PlaceholderCard
            title="Company Code Checks"
          />
        )}
      </div>
    </main>
  )
}
