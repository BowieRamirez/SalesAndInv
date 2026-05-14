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

const PAGE_SIZE = 10

export function RawMaterialsManager({ rows }: { rows: InventoryRow[] }) {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [selectedMaterial, setSelectedMaterial] = useState<InventoryRow | null>(null)
  const [stockAction, setStockAction] = useState<"ADD" | "REMOVE">("ADD")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkSearch, setBulkSearch] = useState("")

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

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleAll = () => {
    const allFilteredIds = filteredRows.map((r) => r.id)
    const allSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedIds.has(id))
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(allFilteredIds))
    }
  }

  const selectedRows = rows.filter((r) => selectedIds.has(r.id))

  const visibleBulkRows = useMemo(() => {
    const q = bulkSearch.trim().toLowerCase()
    if (!q) return selectedRows
    return selectedRows.filter((r) =>
      [r.sku, r.itemName, r.warehouseName].some((v) => v.toLowerCase().includes(q))
    )
  }, [selectedRows, bulkSearch])

  return (
    <>
      <section className="rounded-xl border border-[#e5e7eb] bg-white p-6">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-[18px] font-semibold text-[#111827]">Raw Materials</h3>
            {selectedIds.size > 0 && (
              <button
                type="button"
                onClick={() => setShowBulkModal(true)}
                className="rounded-lg bg-[#111827] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90"
              >
                Bulk add stock ({selectedIds.size})
              </button>
            )}
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
                <th className="py-3 pr-4">
                  <input 
                    type="checkbox" 
                    checked={filteredRows.length > 0 && filteredRows.every((r) => selectedIds.has(r.id))}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-[#d1d5db]"
                    title="Select all filtered rows"
                  />
                </th>
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
                  <td className="py-3 pr-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(row.id)}
                      onChange={() => toggleSelection(row.id)}
                      className="h-4 w-4 rounded border-[#d1d5db]"
                    />
                  </td>
                  <td className="py-3 pr-4 text-[#111827]">{row.sku}</td>
                  <td className="py-3 pr-4 text-[#111827]">{row.itemName}</td>
                  <td className="py-3 pr-4 text-[#6b7280]">{row.warehouseName}</td>
                  <td className="py-3 pr-4 text-[#6b7280]">{row.unitOfMeasure}</td>
                  <td className="py-3 pr-4 text-[#111827]">{row.availableQty}</td>
                  <td className="py-3 pr-4 text-[#111827]">{row.reservedQty}</td>
                  <td className="py-3 pr-4 text-[#111827]">{row.reorderThreshold}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => { setStockAction("ADD"); setSelectedMaterial(row); }}
                        className="rounded-lg bg-[#111827] px-3 py-2 text-[12px] font-medium text-white transition-colors transition-colors hover:bg-[#111827]/90"
                      >
                        Add stock
                      </button>
                      <button
                        type="button"
                        onClick={() => { setStockAction("REMOVE"); setSelectedMaterial(row); }}
                        className="rounded-lg bg-red-600 px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-red-600/90"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pagedRows.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#6b7280]">
                    No raw materials matched your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage(1)}
            disabled={currentPage <= 1}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            aria-label="First page"
          >
            &lt;&lt;
          </button>
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={currentPage <= 1}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            aria-label="Previous page"
          >
            &lt;
          </button>
          <div className="min-w-[112px] rounded-md border border-[#111827] bg-white px-4 py-2 text-center text-[13px] font-semibold text-[#6b7280] shadow-sm">
            <span className="rounded-md bg-[#020617] px-2 py-1 text-white">{currentPage}</span> of {totalPages}
          </div>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={currentPage >= totalPages}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            aria-label="Next page"
          >
            &gt;
          </button>
          <button
            type="button"
            onClick={() => setPage(totalPages)}
            disabled={currentPage >= totalPages}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            aria-label="Last page"
          >
            &gt;&gt;
          </button>
        </div>
      </section>

      {selectedMaterial ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/45 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#dbe4f0] bg-white p-6 shadow-2xl">
            <div className="mb-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">
                {stockAction === "ADD" ? "Add stock" : "Remove stock"}
              </p>
              <h4 className="mt-2 text-[22px] font-semibold text-[#111827]">{selectedMaterial.itemName}</h4>
              <p className="mt-1 text-[13px] text-[#6b7280]">
                {selectedMaterial.sku} · {selectedMaterial.warehouseName}
              </p>
            </div>

            <form method="post" action={stockAction === "ADD" ? "/api/admin/inventory/raw-materials/restock" : "/api/admin/inventory/raw-materials/deduct"} className="space-y-3">
              <input type="hidden" name="stockItemId" value={selectedMaterial.id} />
              <label className="block">
                <span className="mb-2 block text-[12px] font-medium uppercase tracking-[0.12em] text-[#6b7280]">
                  Quantity to {stockAction === "ADD" ? "add" : "remove"}
                </span>
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  max={stockAction === "REMOVE" ? selectedMaterial.availableQty : undefined}
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
                  className={`flex-1 rounded-xl px-4 py-3 text-[13px] font-medium text-white transition-colors ${
                    stockAction === "ADD" 
                      ? "bg-[#111827] hover:bg-[#111827]/90" 
                      : "bg-red-600 hover:bg-red-600/90"
                  }`}
                >
                  {stockAction === "ADD" ? "Save stock" : "Remove stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showBulkModal && selectedRows.length > 0 ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/45 px-4 overflow-y-auto pt-20 pb-10">
          <div className="w-full max-w-2xl rounded-2xl border border-[#dbe4f0] bg-white p-6 shadow-2xl">
            <div className="mb-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">Bulk Add Stock</p>
              <h4 className="mt-2 text-[22px] font-semibold text-[#111827]">Updating {selectedRows.length} items</h4>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={bulkSearch}
                onChange={(e) => setBulkSearch(e.target.value)}
                placeholder="Search by SKU, item, or warehouse…"
                className="w-full rounded-xl border border-[#d1d5dc] bg-[#f8fafc] px-4 py-2.5 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
              />
              {bulkSearch && (
                <p className="mt-1.5 text-[12px] text-[#6b7280]">
                  Showing {visibleBulkRows.length} of {selectedRows.length} selected
                </p>
              )}
            </div>

            <form method="post" action="/api/admin/inventory/raw-materials/bulk-restock" className="space-y-4">
              <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-3">
                {visibleBulkRows.map((row) => (
                  <div key={row.id} className="flex items-center gap-4 rounded-xl border border-[#e5e7eb] p-4">
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold text-[#111827]">{row.itemName}</p>
                      <p className="text-[12px] text-[#6b7280]">{row.sku} · {row.warehouseName}</p>
                    </div>
                    <div className="w-32">
                      <input type="hidden" name="stockItemIds" value={row.id} />
                      <input
                        name={`quantity_${row.id}`}
                        type="number"
                        min="1"
                        defaultValue="1"
                        className="w-full rounded-xl border border-[#d1d5dc] bg-white px-3 py-2 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                        placeholder="Qty"
                      />
                    </div>
                  </div>
                ))}
                {visibleBulkRows.length === 0 && (
                  <p className="py-6 text-center text-[13px] text-[#6b7280]">No items match your search.</p>
                )}
              </div>
              <label className="block mt-4">
                <span className="mb-2 block text-[12px] font-medium uppercase tracking-[0.12em] text-[#6b7280]">
                  Reference number (applied to all)
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
                  onClick={() => {
                    setShowBulkModal(false)
                    setSelectedIds(new Set())
                    setBulkSearch("")
                  }}
                  className="flex-1 rounded-xl border border-[#d1d5db] px-4 py-3 text-[13px] font-medium text-[#111827] transition-colors hover:bg-[#f8fafc]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#111827] px-4 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90"
                >
                  Save all stocks
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
