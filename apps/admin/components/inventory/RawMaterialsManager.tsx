"use client"

import { useMemo, useState } from "react"

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

const PAGE_SIZE = 20

export function RawMaterialsManager({ rows }: { rows: InventoryRow[] }) {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [selectedMaterial, setSelectedMaterial] = useState<InventoryRow | null>(null)

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return rows
    }

    return rows.filter((row) =>
      [row.sku, row.itemName, row.warehouseName, row.unitOfMeasure].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    )
  }, [query, rows])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pagedRows = filteredRows.slice(pageStart, pageStart + PAGE_SIZE)

  return (
    <>
      <section className="rounded-xl border border-[#e5e7eb] bg-white p-6">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-[18px] font-semibold text-[#111827]">Raw Materials</h3>
            <p className="mt-1 text-[13px] text-[#6b7280]">
              Search the list instantly and keep each page capped at 20 materials.
            </p>
          </div>
          <div className="w-full md:w-[320px]">
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Search SKU, item, warehouse, or unit"
              className="w-full rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
                <th className="py-3 pr-4 font-medium">SKU</th>
                <th className="py-3 pr-4 font-medium">Item</th>
                <th className="py-3 pr-4 font-medium">Warehouse</th>
                <th className="py-3 pr-4 font-medium">Unit</th>
                <th className="py-3 pr-4 font-medium">Available</th>
                <th className="py-3 pr-4 font-medium">Reserved</th>
                <th className="py-3 pr-4 font-medium">Threshold</th>
                <th className="py-3 font-medium">Stock</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((row) => (
                <tr key={row.id} className="border-b border-[#f3f4f6] last:border-b-0">
                  <td className="py-3 pr-4 text-[#111827]">{row.sku}</td>
                  <td className="py-3 pr-4 text-[#111827]">{row.itemName}</td>
                  <td className="py-3 pr-4 text-[#6b7280]">{row.warehouseName}</td>
                  <td className="py-3 pr-4 text-[#6b7280]">{row.unitOfMeasure}</td>
                  <td className="py-3 pr-4 text-[#111827]">{row.availableQty}</td>
                  <td className="py-3 pr-4 text-[#111827]">{row.reservedQty}</td>
                  <td className="py-3 pr-4 text-[#111827]">{row.reorderThreshold}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedMaterial(row)}
                      className="rounded-lg bg-[#1d4ed8] px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#1d4ed8]/90"
                    >
                      Add stock
                    </button>
                  </td>
                </tr>
              ))}
              {pagedRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#6b7280]">
                    No raw materials matched your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={currentPage <= 1}
            className="rounded-lg border border-[#d1d5db] px-4 py-2 text-[13px] text-[#111827] transition-colors hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:text-[#cbd5e1]"
          >
            Previous
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`rounded-lg px-3 py-2 text-[13px] ${
                  pageNumber === currentPage
                    ? "bg-[#111827] text-white"
                    : "border border-[#d1d5db] text-[#111827] hover:bg-[#f8fafc]"
                }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={currentPage >= totalPages}
            className="rounded-lg border border-[#d1d5db] px-4 py-2 text-[13px] text-[#111827] transition-colors hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:text-[#cbd5e1]"
          >
            Next
          </button>
        </div>
      </section>

      {selectedMaterial ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/45 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#dbe4f0] bg-white p-6 shadow-2xl">
            <div className="mb-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">Add stock</p>
              <h4 className="mt-2 text-[22px] font-semibold text-[#111827]">{selectedMaterial.itemName}</h4>
              <p className="mt-1 text-[13px] text-[#6b7280]">
                {selectedMaterial.sku} · {selectedMaterial.warehouseName}
              </p>
            </div>

            <form method="post" action="/api/admin/inventory/raw-materials/restock" className="space-y-3">
              <input type="hidden" name="stockItemId" value={selectedMaterial.id} />
              <label className="block">
                <span className="mb-2 block text-[12px] font-medium uppercase tracking-[0.12em] text-[#6b7280]">
                  Quantity to add
                </span>
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  defaultValue="1"
                  className="w-full rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[12px] font-medium uppercase tracking-[0.12em] text-[#6b7280]">
                  Reference number
                </span>
                <input
                  name="referenceNumber"
                  placeholder="Optional reference"
                  className="w-full rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                />
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMaterial(null)}
                  className="flex-1 rounded-xl border border-[#d1d5db] px-4 py-3 text-[13px] font-medium text-[#111827] transition-colors hover:bg-[#f8fafc]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#1d4ed8] px-4 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#1d4ed8]/90"
                >
                  Save stock
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
