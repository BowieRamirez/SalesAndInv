import { redirect } from "next/navigation"
import { Prisma, prisma } from "@furnitrack/db"
import {
  formatInquiryWorkflowStatus,
  getInquiryWorkflowStyle,
} from "@furnitrack/validators"
import { RawMaterialsManager } from "@/components/inventory/RawMaterialsManager"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { getInquiryWorkflowRows, type InquiryWorkflowRow } from "@/lib/inquiries"
import { ROLE_REDIRECT } from "@/lib/rbac"

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

type AuditSummaryRow = {
  action: string
  count: number
}

type InventoryPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const INVENTORY_TABS = new Set(["locations", "all-stocks", "approvals", "audit"])

function resolveValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

function resolveTab(tab?: string | string[]) {
  const value = resolveValue(tab)
  if (value === "requests") {
    return "approvals"
  }
  return value && INVENTORY_TABS.has(value) ? value : "all-stocks"
}

async function getInventoryRows() {
  return prisma.$queryRaw<InventoryRow[]>(Prisma.sql`
    SELECT
      s.id,
      s.sku,
      s."itemName",
      COALESCE(s."itemType"::text, 'RAW_MATERIAL') AS "itemType",
      s."warehouseId",
      w.name AS "warehouseName",
      s."availableQty",
      s."reservedQty",
      s."reorderThreshold",
      s."unitOfMeasure"
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
      COALESCE(metadata->>'auditLabel', action::text) AS action,
      COUNT(*)::int AS count
    FROM public.audit_logs
    GROUP BY COALESCE(metadata->>'auditLabel', action::text)
    ORDER BY COUNT(*) DESC, COALESCE(metadata->>'auditLabel', action::text) ASC
    LIMIT 8
  `)
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-[20px] font-semibold text-[#111827]">{title}</h2>
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

function WorkflowBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] ${getInquiryWorkflowStyle(status)}`}
    >
      {formatInquiryWorkflowStatus(status)}
    </span>
  )
}

function InventoryApprovalCard({ inquiry }: { inquiry: InquiryWorkflowRow }) {
  return (
    <article className="rounded-xl border border-[#eef2f7] bg-[#fbfcfd] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Material approval request</p>
          <h3 className="mt-1 text-[20px] font-semibold text-[#111827]">{inquiry.productName}</h3>
          <p className="mt-2 text-[13px] text-[#6b7280]">
            {inquiry.customerName} · {inquiry.customerEmail} · {inquiry.customerPhone}
          </p>
          <p className="mt-3 max-w-[720px] text-[14px] leading-[22px] text-[#1f2937]">{inquiry.message}</p>
          {inquiry.workflowNote ? (
            <p className="mt-3 rounded-xl bg-white px-4 py-3 text-[13px] text-[#4b5563]">
              Latest note: {inquiry.workflowNote}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col items-start gap-3 text-[12px] text-[#6b7280] lg:items-end">
          <WorkflowBadge status={inquiry.workflowStatus} />
          <div>
            <p>Created {new Date(inquiry.createdAt).toLocaleDateString()}</p>
            <p className="mt-1">Updated {new Date(inquiry.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <form method="post" action="/api/admin/approvals/inventory" className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <input type="hidden" name="inquiryId" value={inquiry.id} />
        <label className="block">
          <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
            Inventory approval note
          </span>
          <input
            name="statusNote"
            defaultValue={inquiry.workflowNote ?? ""}
            placeholder="Confirm stock readiness for accounting"
            className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
          />
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            className="rounded-[12px] bg-[#111827] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90"
          >
            Approve materials
          </button>
        </div>
      </form>
    </article>
  )
}

export const dynamic = "force-dynamic"

export default async function InventoryDashboard({ searchParams }: InventoryPageProps) {
  const currentUser = await requireAuthenticatedAppUser()

  if (!["INVENTORY", "ADMIN_MANAGEMENT"].includes(currentUser.role)) {
    redirect(ROLE_REDIRECT[currentUser.role])
  }

  const resolvedSearchParams = searchParams ? await searchParams : {}
  const activeTab = resolveTab(resolvedSearchParams.tab)
  const message = resolveValue(resolvedSearchParams.message)
  const tone = resolveValue(resolvedSearchParams.tone) === "error" ? "error" : "success"

  const [rows, warehouses, requestSummary, auditSummary, inquiries] = await Promise.all([
    getInventoryRows(),
    getWarehouseSummaries(),
    getStockRequestSummaries(),
    getAuditSummaries(),
    getInquiryWorkflowRows(["PENDING_INVENTORY_APPROVAL"]),
  ])

  const rawMaterials = rows.filter((row) => row.itemType !== "FINISHED_PRODUCT")
  const lowStockItems = rawMaterials.filter((row) => row.availableQty <= row.reorderThreshold)

  return (
    <main className="min-h-screen overflow-auto bg-[#fcfcfc] p-8">
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-[#1a1c29]">Inventory Workspace</h1>
      </div>

      {message ? (
        <div
          className={`mb-6 rounded-2xl border px-5 py-4 text-[14px] ${
            tone === "error"
              ? "border-[#fecaca] bg-[#fff1f2] text-[#9f1239]"
              : "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
          }`}
        >
          {message}
        </div>
      ) : null}

      {activeTab === "locations" && (
        <div className="space-y-6">
          <SectionHeader title="Warehouse Locations" />
          <SummaryCards
            rows={[
              { label: "Warehouses", value: warehouses.length },
              { label: "Tracked Materials", value: rawMaterials.length },
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
              { label: "Raw Materials", value: rawMaterials.length },
              { label: "Low Stock", value: lowStockItems.length, accent: "text-amber-600" },
              { label: "Warehouses", value: warehouses.length },
            ]}
          />

          <section className="rounded-xl border border-[#e5e7eb] bg-white p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-[18px] font-semibold text-[#111827]">Add new raw material</h3>
              </div>
            </div>
            <form method="post" action="/api/admin/inventory/raw-materials/create" className="mt-5 grid gap-3 xl:grid-cols-[1.2fr_1.1fr_1fr_0.9fr]">
              <input
                name="itemName"
                placeholder="Material name"
                className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
              />
              <input
                name="sku"
                placeholder="SKU (optional auto-generate)"
                className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
              />
              <select
                name="warehouseId"
                defaultValue=""
                className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
              >
                <option value="" disabled>
                  Select warehouse
                </option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
              <input
                name="unitOfMeasure"
                defaultValue="pcs"
                placeholder="Unit"
                className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
              />
              <input
                name="reorderThreshold"
                type="number"
                min="0"
                defaultValue="10"
                placeholder="Reorder threshold"
                className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
              />
              <input
                name="openingQty"
                type="number"
                min="0"
                defaultValue="0"
                placeholder="Opening stock"
                className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
              />
              <input
                name="referenceNumber"
                placeholder="Reference number (optional)"
                className="rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827] xl:col-span-2"
              />
              <textarea
                name="description"
                placeholder="Description (optional)"
                className="min-h-[96px] rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827] xl:col-span-3"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#111827] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90 xl:self-stretch"
              >
                Add raw material
              </button>
            </form>
          </section>

          <RawMaterialsManager rows={rawMaterials} />
        </div>
      )}

      {activeTab === "approvals" && (
        <div className="space-y-6">
          <SectionHeader title="Inventory Approval Page" />
          <SummaryCards
            rows={[
              { label: "Orders Waiting", value: inquiries.length, accent: "text-blue-600" },
              { label: "Low Stock Items", value: lowStockItems.length, accent: "text-amber-600" },
              { label: "Stock Request Logs", value: requestSummary.reduce((total, row) => total + row.count, 0) },
            ]}
          />
          <RequestSummary rows={requestSummary} />

          <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-[20px] font-semibold text-[#111827]">Customer orders waiting for stock confirmation</h2>
              <p className="mt-2 max-w-[760px] text-[14px] leading-[22px] text-[#6b7280]">
                Sales has already checked these orders. Approve them here once material availability is confirmed so
                accounting can continue with payment processing.
              </p>
            </div>

            {inquiries.length === 0 ? (
              <EmptyState message="No customer orders are currently waiting on inventory approval." />
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <InventoryApprovalCard key={inquiry.id} inquiry={inquiry} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="space-y-6">
          <SectionHeader title="Audit Logs" />
          <AuditSummary rows={auditSummary} />
        </div>
      )}
    </main>
  )
}
