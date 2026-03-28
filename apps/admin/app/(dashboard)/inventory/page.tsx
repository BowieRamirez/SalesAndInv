import { Prisma } from "@furnitrack/db"
import { prisma } from "@furnitrack/db"

type InventoryRow = {
  id: string
  sku: string
  itemName: string
  itemType: string
  warehouseName: string
  availableQty: number
  reservedQty: number
  reorderThreshold: number
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

type AuditSummaryRow = {
  action: string
  count: number
}

type InventoryPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const INVENTORY_TABS = new Set(["locations", "all-stocks", "stocks", "requests", "audit"])

export const dynamic = "force-dynamic"

async function getInventoryRows() {
  return prisma.$queryRaw<InventoryRow[]>(Prisma.sql`
    SELECT
      s.id,
      s.sku,
      s."itemName",
      COALESCE(s."itemType"::text, 'RAW_MATERIAL') AS "itemType",
      w.name AS "warehouseName",
      s."availableQty",
      s."reservedQty",
      s."reorderThreshold"
    FROM public.stock_items s
    INNER JOIN public.warehouses w
      ON w.id = s."warehouseId"
    ORDER BY s."itemType" DESC, s."itemName" ASC
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
    LEFT JOIN public.stock_items s
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

async function getAuditSummaries() {
  return prisma.$queryRaw<AuditSummaryRow[]>(Prisma.sql`
    SELECT
      action::text AS action,
      COUNT(*)::int AS count
    FROM public.audit_logs
    GROUP BY action
    ORDER BY COUNT(*) DESC, action ASC
    LIMIT 8
  `)
}

function resolveTab(tab?: string | string[]) {
  const value = Array.isArray(tab) ? tab[0] : tab
  return value && INVENTORY_TABS.has(value) ? value : "all-stocks"
}

function SectionHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="mb-6">
      <h2 className="text-[20px] font-semibold text-[#111827]">{title}</h2>
      <p className="mt-1 text-[13px] text-[#6b7280]">{description}</p>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#d1d5db] bg-white p-10 text-center text-[13px] text-[#6b7280]">
      {message}
    </div>
  )
}

function InventoryTable({
  title,
  description,
  rows,
  emptyMessage,
}: {
  title: string
  description: string
  rows: InventoryRow[]
  emptyMessage: string
}) {
  return (
    <section className="rounded-xl border border-[#e5e7eb] bg-white p-6">
      <div className="mb-4">
        <h3 className="text-[18px] font-semibold text-[#111827]">{title}</h3>
        <p className="mt-1 text-[13px] text-[#6b7280]">{description}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
              <th className="py-3 pr-4 font-medium">SKU</th>
              <th className="py-3 pr-4 font-medium">Item</th>
              <th className="py-3 pr-4 font-medium">Warehouse</th>
              <th className="py-3 pr-4 font-medium">Available</th>
              <th className="py-3 pr-4 font-medium">Reserved</th>
              <th className="py-3 font-medium">Threshold</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[#f3f4f6] last:border-b-0">
                <td className="py-3 pr-4 text-[#111827]">{row.sku}</td>
                <td className="py-3 pr-4 text-[#111827]">{row.itemName}</td>
                <td className="py-3 pr-4 text-[#6b7280]">{row.warehouseName}</td>
                <td className="py-3 pr-4 text-[#111827]">{row.availableQty}</td>
                <td className="py-3 pr-4 text-[#111827]">{row.reservedQty}</td>
                <td className="py-3 text-[#111827]">{row.reorderThreshold}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#6b7280]">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function WarehouseTable({ rows }: { rows: WarehouseSummaryRow[] }) {
  if (rows.length === 0) {
    return <EmptyState message="No warehouses have been configured yet." />
  }

  return (
    <section className="rounded-xl border border-[#e5e7eb] bg-white p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
              <th className="py-3 pr-4 font-medium">Code</th>
              <th className="py-3 pr-4 font-medium">Warehouse</th>
              <th className="py-3 pr-4 font-medium">Address</th>
              <th className="py-3 font-medium">Tracked Items</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[#f3f4f6] last:border-b-0">
                <td className="py-3 pr-4 text-[#111827]">{row.code}</td>
                <td className="py-3 pr-4 text-[#111827]">{row.name}</td>
                <td className="py-3 pr-4 text-[#6b7280]">{row.address}</td>
                <td className="py-3 text-[#111827]">{row.itemCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function SummaryCards({
  rows,
}: {
  rows: Array<{ label: string; value: number; accent?: string }>
}) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {rows.map((row) => (
        <div key={row.label} className="rounded-xl border border-[#e5e7eb] bg-white p-5">
          <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">{row.label}</p>
          <p className={`mt-2 text-[28px] font-semibold ${row.accent ?? "text-[#111827]"}`}>{row.value}</p>
        </div>
      ))}
    </div>
  )
}

function RequestSummary({ rows }: { rows: StockRequestSummaryRow[] }) {
  if (rows.length === 0) {
    return <EmptyState message="Stock requests will appear here once sales orders start requesting materials." />
  }

  return (
    <section className="rounded-xl border border-[#e5e7eb] bg-white p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
              <th className="py-3 pr-4 font-medium">Request Status</th>
              <th className="py-3 font-medium">Count</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.status} className="border-b border-[#f3f4f6] last:border-b-0">
                <td className="py-3 pr-4 text-[#111827]">{row.status.replaceAll("_", " ")}</td>
                <td className="py-3 text-[#111827]">{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function AuditSummary({ rows }: { rows: AuditSummaryRow[] }) {
  if (rows.length === 0) {
    return <EmptyState message="Audit entries will show up here after stock approvals, updates, and company-code actions are recorded." />
  }

  return (
    <section className="rounded-xl border border-[#e5e7eb] bg-white p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
              <th className="py-3 pr-4 font-medium">Audit Action</th>
              <th className="py-3 font-medium">Count</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.action} className="border-b border-[#f3f4f6] last:border-b-0">
                <td className="py-3 pr-4 text-[#111827]">{row.action.replaceAll("_", " ")}</td>
                <td className="py-3 text-[#111827]">{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default async function InventoryDashboard({ searchParams }: InventoryPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const activeTab = resolveTab(resolvedSearchParams.tab)

  const [rows, warehouses, requestSummary, auditSummary] = await Promise.all([
    getInventoryRows(),
    getWarehouseSummaries(),
    getStockRequestSummaries(),
    getAuditSummaries(),
  ])

  const finishedProducts = rows.filter((row) => row.itemType === "FINISHED_PRODUCT")
  const rawMaterials = rows.filter((row) => row.itemType !== "FINISHED_PRODUCT")
  const lowStockItems = rows.filter((row) => row.availableQty <= row.reorderThreshold)

  return (
    <main className="min-h-screen overflow-auto bg-[#fcfcfc] p-8">
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-[#1a1c29]">Inventory Workspace</h1>
        <p className="mt-2 text-[14px] text-[#6b7280]">
          Each inventory menu item now opens its own workspace. Finished products feed the storefront, while raw materials stay in internal stock tracking.
        </p>
      </div>

      {activeTab === "locations" && (
        <div className="space-y-6">
          <SectionHeader
            title="Warehouse Locations"
            description="Review warehouse locations and how many stock records each one is currently tracking."
          />
          <SummaryCards
            rows={[
              { label: "Warehouses", value: warehouses.length },
              { label: "Tracked Items", value: rows.length },
              { label: "Low Stock Items", value: lowStockItems.length, accent: "text-amber-600" },
            ]}
          />
          <WarehouseTable rows={warehouses} />
        </div>
      )}

      {activeTab === "all-stocks" && (
        <div className="space-y-8">
          <SummaryCards
            rows={[
              { label: "Total Inventory Items", value: rows.length },
              { label: "Finished Products", value: finishedProducts.length },
              { label: "Raw Materials", value: rawMaterials.length },
            ]}
          />
          <InventoryTable
            title="Finished Products Used by the Storefront"
            description="Only these items should appear in the storefront catalog."
            rows={finishedProducts}
            emptyMessage="No finished products have been loaded from Neon yet."
          />
          <InventoryTable
            title="Raw Materials"
            description="These items stay in the inventory module and are linked to finished products through material mapping."
            rows={rawMaterials}
            emptyMessage="No raw materials have been loaded from Neon yet."
          />
        </div>
      )}

      {activeTab === "stocks" && (
        <div className="space-y-6">
          <SectionHeader
            title="Incoming Stocks"
            description="Use this view to monitor stock entries and identify which items still need actual on-hand quantities encoded."
          />
          <SummaryCards
            rows={[
              { label: "Zero On-Hand", value: rows.filter((row) => row.availableQty === 0).length, accent: "text-amber-600" },
              { label: "Low Stock", value: lowStockItems.length, accent: "text-amber-600" },
              { label: "Reserved", value: rows.reduce((sum, row) => sum + row.reservedQty, 0) },
            ]}
          />
          <InventoryTable
            title="Items Waiting for Stock Encoding"
            description="These items are live in Neon, but most still need opening balances or stock-in transactions."
            rows={rows}
            emptyMessage="No inventory items are available yet."
          />
        </div>
      )}

      {activeTab === "requests" && (
        <div className="space-y-6">
          <SectionHeader
            title="Stock Requests"
            description="Track the approval flow for internal stock requests raised from sales orders."
          />
          <RequestSummary rows={requestSummary} />
        </div>
      )}

      {activeTab === "audit" && (
        <div className="space-y-6">
          <SectionHeader
            title="Audit Logs"
            description="Inventory-related changes should be visible here once operational actions are being recorded by the system."
          />
          <AuditSummary rows={auditSummary} />
        </div>
      )}
    </main>
  )
}
