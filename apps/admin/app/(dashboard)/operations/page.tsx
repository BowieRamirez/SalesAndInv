import { Prisma, prisma } from "@furnitrack/db"

type OperationsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

type FinishedProductRow = {
  id: string
  sku: string
  itemName: string
  warehouseName: string
  availableQty: number
  reservedQty: number
  reorderThreshold: number
}

const OPERATIONS_TABS = new Set(["design", "finished-products", "delivery", "company-code"])

export const dynamic = "force-dynamic"

async function getFinishedProducts() {
  return prisma.$queryRaw<FinishedProductRow[]>(Prisma.sql`
    SELECT
      s.id,
      s.sku,
      s."itemName",
      w.name AS "warehouseName",
      s."availableQty",
      s."reservedQty",
      s."reorderThreshold"
    FROM public.stock_items s
    INNER JOIN public.warehouses w
      ON w.id = s."warehouseId"
    WHERE s."itemType" = 'FINISHED_PRODUCT'::"InventoryItemType"
    ORDER BY s."itemName" ASC
  `)
}

function resolveTab(tab?: string | string[]) {
  const value = Array.isArray(tab) ? tab[0] : tab
  return value && OPERATIONS_TABS.has(value) ? value : "design"
}

function PlaceholderCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white p-8 shadow-sm">
      <h3 className="text-[16px] font-semibold text-[#111827]">{title}</h3>
      <p className="mt-3 text-[13px] leading-[22px] text-[#6b7280]">{description}</p>
    </div>
  )
}

export default async function OperationsDashboard({ searchParams }: OperationsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const activeTab = resolveTab(resolvedSearchParams.tab)
  const finishedProducts = activeTab === "finished-products" ? await getFinishedProducts() : []

  return (
    <main className="min-h-screen overflow-auto bg-[#fcfcfc] p-8">
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-[#111827]">Operations / Design Workspace</h1>
        <p className="mt-2 text-[14px] text-[#6b7280]">
          Design approvals, delivery readiness, company-code checks, and finished products now live in one operations workspace.
        </p>
      </div>

      {activeTab === "finished-products" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
              <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">Finished products</p>
              <p className="mt-2 text-[28px] font-semibold text-[#111827]">{finishedProducts.length}</p>
            </div>
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
              <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">Zero on-hand</p>
              <p className="mt-2 text-[28px] font-semibold text-[#b45309]">
                {finishedProducts.filter((row) => row.availableQty === 0).length}
              </p>
            </div>
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
              <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">Reserved units</p>
              <p className="mt-2 text-[28px] font-semibold text-[#111827]">
                {finishedProducts.reduce((sum, row) => sum + row.reservedQty, 0)}
              </p>
            </div>
          </div>

          <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-[20px] font-semibold text-[#111827]">Finished Products</h2>
              <p className="mt-1 text-[13px] text-[#6b7280]">
                These finished products were moved out of the Inventory workspace and into Operations.
              </p>
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
                  {finishedProducts.map((row) => (
                    <tr key={row.id} className="border-b border-[#f3f4f6] last:border-b-0">
                      <td className="py-3 pr-4 text-[#111827]">{row.sku}</td>
                      <td className="py-3 pr-4 text-[#111827]">{row.itemName}</td>
                      <td className="py-3 pr-4 text-[#6b7280]">{row.warehouseName}</td>
                      <td className="py-3 pr-4 text-[#111827]">{row.availableQty}</td>
                      <td className="py-3 pr-4 text-[#111827]">{row.reservedQty}</td>
                      <td className="py-3 text-[#111827]">{row.reorderThreshold}</td>
                    </tr>
                  ))}
                  {finishedProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#6b7280]">
                        No finished products are available yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {activeTab === "design" && (
        <PlaceholderCard
          title="Design Queue"
          description="Use this workspace for design requests, revisions, and final asset handoff once those flows are fully wired."
        />
      )}

      {activeTab === "delivery" && (
        <PlaceholderCard
          title="Delivery Schedule"
          description="Keep delivery readiness, route planning, and shipment confirmation here alongside finished-product visibility."
        />
      )}

      {activeTab === "company-code" && (
        <PlaceholderCard
          title="Company Code Checks"
          description="This area can hold company-code validation and final operational release checks before fulfillment."
        />
      )}
    </main>
  )
}
