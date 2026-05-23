"use client"

import { useMemo, useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { useDebounce } from "./hookTs"

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

type ProductFilterData = {
  id: string
  name: string
  recipeDetails: Array<{ id: string }>
}

type SortKey = "qty-asc" | "qty-desc" | "name-asc" | "name-desc" | "sku-asc" | "sku-desc"
type StockFilter = "" | "low-stock"

export function RawMaterialsManager({ rows, products }: { rows: InventoryRow[], products?: ProductFilterData[] }) {
  const [selectedProductId, setSelectedProductId] = useState("")
  const [query, setQuery] = useState("")
  const [stockFilter, setStockFilter] = useState<StockFilter>("")
  const [sortKey, setSortKey] = useState<SortKey>("name-asc")
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [selectedMaterial, setSelectedMaterial] = useState<InventoryRow | null>(null)
  const [stockAction, setStockAction] = useState<"ADD" | "REMOVE">("ADD")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkSearch, setBulkSearch] = useState("")
  const debouncedQuery = useDebounce(query, 400)

  const filteredRows = useMemo(() => {
    let result = rows

    if (selectedProductId) {
      const selectedProduct = products?.find((p) => p.id === selectedProductId)
      if (selectedProduct) {
        const productMaterialIds = new Set(selectedProduct.recipeDetails.map((r) => r.id))
        result = result.filter((row) => productMaterialIds.has(row.id))
      }
    }

    if (stockFilter === "low-stock") {
      result = result.filter((row) => row.availableQty <= row.reorderThreshold)
    }

    const q = debouncedQuery.trim().toLowerCase()
    if (q) {
      result = result.filter((row) =>
        [row.sku, row.itemName, row.warehouseName, row.unitOfMeasure].some((v) =>
          v.toLowerCase().includes(q),
        ),
      )
    }

    return [...result].sort((a, b) => {
      switch (sortKey) {
        case "qty-asc":  return a.availableQty - b.availableQty
        case "qty-desc": return b.availableQty - a.availableQty
        case "name-asc": return a.itemName.localeCompare(b.itemName)
        case "name-desc":return b.itemName.localeCompare(a.itemName)
        case "sku-asc":  return a.sku.localeCompare(b.sku)
        case "sku-desc": return b.sku.localeCompare(a.sku)
        default:         return 0
      }
    })
  }, [debouncedQuery, rows, selectedProductId, products, stockFilter, sortKey])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pagedRows = filteredRows.slice(pageStart, pageStart + PAGE_SIZE)

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  const toggleAll = () => {
    const allFilteredIds = filteredRows.map((r) => r.id)
    const allSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedIds.has(id))
    setSelectedIds(allSelected ? new Set() : new Set(allFilteredIds))
  }

  const selectedRows = rows.filter((r) => selectedIds.has(r.id))

  const visibleBulkRows = useMemo(() => {
    const q = bulkSearch.trim().toLowerCase()
    if (!q) return selectedRows
    return selectedRows.filter((r) =>
      [r.sku, r.itemName, r.warehouseName].some((v) => v.toLowerCase().includes(q))
    )
  }, [selectedRows, bulkSearch])

  const lowStockCount = rows.filter((r) => r.availableQty <= r.reorderThreshold).length

  return (
    <>
      {/* ── Search & Filters card ─────────────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 px-5 py-4">
          {/* Search */}
          <div className="relative min-w-[260px] flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              placeholder="Search SKU, item, warehouse, or unit"
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-[13px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
            />
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            {/* Stock filter pill */}
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-0.5 text-[12px]">
              <button type="button" onClick={() => { setStockFilter(""); setPage(1) }}
                className={`rounded-full px-3 py-1 transition-colors ${stockFilter === "" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"}`}>
                All
              </button>
              <button type="button" onClick={() => { setStockFilter("low-stock"); setPage(1) }}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${stockFilter === "low-stock" ? "bg-amber-600 text-white" : "text-slate-600 hover:text-slate-900"}`}>
                Low stock
                {lowStockCount > 0 && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${stockFilter === "low-stock" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"}`}>
                    {lowStockCount}
                  </span>
                )}
              </button>
            </div>

            {/* Results count */}
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] text-slate-600">
              {filteredRows.length} {filteredRows.length === 1 ? "item" : "items"}
            </span>

            {/* More filters toggle */}
            <button type="button" onClick={() => setMoreFiltersOpen((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${moreFiltersOpen ? "border-slate-300 bg-slate-50 text-slate-900" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
              aria-expanded={moreFiltersOpen}>
              <SlidersHorizontal className="h-3.5 w-3.5" />
              More filters
            </button>
          </div>
        </div>

        {/* Expanded filter row */}
        {moreFiltersOpen && (
          <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 bg-slate-50/40 px-5 py-3">
            {/* Product filter */}
            {products && products.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="text-[12px] font-medium text-slate-500">Product</label>
                <select value={selectedProductId} onChange={(e) => { setSelectedProductId(e.target.value); setPage(1) }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-700 outline-none focus:border-slate-400">
                  <option value="">All materials</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            )}

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label className="text-[12px] font-medium text-slate-500">Sort by</label>
              <select value={sortKey} onChange={(e) => { setSortKey(e.target.value as SortKey); setPage(1) }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-700 outline-none focus:border-slate-400">
                <option value="name-asc">Name A → Z</option>
                <option value="name-desc">Name Z → A</option>
                <option value="sku-asc">SKU A → Z</option>
                <option value="sku-desc">SKU Z → A</option>
                <option value="qty-asc">Qty low → high</option>
                <option value="qty-desc">Qty high → low</option>
              </select>
            </div>

            {/* Clear */}
            {(stockFilter || selectedProductId || sortKey !== "name-asc") && (
              <button type="button" onClick={() => { setStockFilter(""); setSelectedProductId(""); setSortKey("name-asc"); setPage(1) }}
                className="ml-auto rounded-lg px-3 py-1.5 text-[12px] font-medium text-slate-500 transition-colors hover:text-slate-900">
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Bulk action bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3">
            <p className="text-[13px] text-slate-600">{selectedIds.size} item{selectedIds.size > 1 ? "s" : ""} selected</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setSelectedIds(new Set())}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:bg-slate-50">
                <X className="h-3.5 w-3.5" /> Clear
              </button>
              <button type="button" onClick={() => setShowBulkModal(true)}
                className="rounded-lg bg-slate-900 px-4 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-slate-800">
                Bulk add stock ({selectedIds.size})
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── Table card ───────────────────────────────────────────────────── */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-[13px]">
            <thead className="border-b border-slate-200 bg-white">
              <tr className="text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">
                  <input type="checkbox"
                    checked={filteredRows.length > 0 && filteredRows.every((r) => selectedIds.has(r.id))}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-slate-300"
                    title="Select all filtered rows" />
                </th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Warehouse</th>
                <th className="px-4 py-3 font-medium">Unit</th>
                <th className="px-4 py-3 font-medium">Total Stock</th>
                <th className="px-4 py-3 font-medium">Reserved</th>
                <th className="px-4 py-3 font-medium">Available</th>
                <th className="px-4 py-3 font-medium">Threshold</th>
                <th className="px-4 py-3 font-medium">Stock</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-16 text-center text-[13px] text-slate-500">
                    No raw materials matched your search.
                  </td>
                </tr>
              ) : (
                pagedRows.map((row) => {
                  const isLow = row.availableQty <= row.reorderThreshold
                  return (
                    <tr key={row.id} className="border-b border-slate-100 last:border-b-0 align-middle hover:bg-slate-50/60">
                      <td className="px-5 py-4">
                        <input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => toggleSelection(row.id)}
                          className="h-4 w-4 rounded border-slate-300" />
                      </td>
                      <td className="px-4 py-4 font-mono text-[12px] text-slate-600">{row.sku}</td>
                      <td className="px-4 py-4 font-medium text-slate-900">{row.itemName}</td>
                      <td className="px-4 py-4 text-slate-600">{row.warehouseName}</td>
                      <td className="px-4 py-4 text-slate-600">{row.unitOfMeasure}</td>
                      <td className="px-4 py-4 font-semibold text-slate-900">{row.availableQty + row.reservedQty}</td>
                      <td className="px-4 py-4 text-slate-700">{row.reservedQty}</td>
                      <td className="px-4 py-4">
                        <span className={isLow ? "font-semibold text-amber-600" : "text-slate-700"}>
                          {row.availableQty}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{row.reorderThreshold}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => { setStockAction("ADD"); setSelectedMaterial(row) }}
                            className="rounded-lg bg-[#111827] px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#111827]/90">
                            Add
                          </button>
                          <button type="button" onClick={() => { setStockAction("REMOVE"); setSelectedMaterial(row) }}
                            className="rounded-lg bg-rose-600 px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-rose-700">
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 border-t border-slate-100 px-5 py-4">
          <button type="button" onClick={() => setPage(1)} disabled={currentPage <= 1}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:text-[#cbd5e1]"
            aria-label="First page">&lt;&lt;</button>
          <button type="button" onClick={() => setPage((v) => Math.max(1, v - 1))} disabled={currentPage <= 1}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:text-[#cbd5e1]"
            aria-label="Previous page">&lt;</button>
          <div className="min-w-[112px] rounded-md border border-[#111827] bg-white px-4 py-2 text-center text-[13px] font-semibold text-[#6b7280] shadow-sm">
            <span className="rounded-sm bg-[#020617] px-2 py-1 text-white">{currentPage}</span> of {totalPages}
          </div>
          <button type="button" onClick={() => setPage((v) => Math.min(totalPages, v + 1))} disabled={currentPage >= totalPages}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:text-[#cbd5e1]"
            aria-label="Next page">&gt;</button>
          <button type="button" onClick={() => setPage(totalPages)} disabled={currentPage >= totalPages}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:text-[#cbd5e1]"
            aria-label="Last page">&gt;&gt;</button>
        </div>
      </section>

      {/* ── Add / Remove stock modal ──────────────────────────────────────── */}
      {selectedMaterial ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/45 px-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-100 px-6 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                {stockAction === "ADD" ? "Add stock" : "Remove stock"}
              </p>
              <h4 className="mt-1 text-[18px] font-semibold text-slate-900">{selectedMaterial.itemName}</h4>
              <p className="mt-0.5 text-[13px] text-slate-500">{selectedMaterial.sku} · {selectedMaterial.warehouseName}</p>
            </div>
            <form method="post" action={stockAction === "ADD" ? "/api/admin/inventory/raw-materials/restock" : "/api/admin/inventory/raw-materials/deduct"} className="space-y-3 p-6">
              <input type="hidden" name="materialStockId" value={selectedMaterial.id} />
              <label className="block">
                <span className="mb-1 block text-[12px] font-medium text-slate-700">Quantity to {stockAction === "ADD" ? "add" : "remove"}</span>
                <input name="quantity" type="number" min="1" max={stockAction === "REMOVE" ? selectedMaterial.availableQty : undefined} defaultValue="1"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400" />
              </label>
              <label className="block">
                <span className="mb-1 block text-[12px] font-medium text-slate-700">Reference number</span>
                <input name="referenceNumber" placeholder="Optional"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400" />
              </label>
              {stockAction === "REMOVE" && (
                <>
                  <label className="block">
                    <span className="mb-1 block text-[12px] font-medium text-slate-700">Reason for removal</span>
                    <select name="reasonCategory" defaultValue="DAMAGE"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400">
                      <option value="DAMAGE">Damaged Stock</option>
                      <option value="OTHER">Other Reason</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[12px] font-medium text-slate-700">Reason details (required)</span>
                    <input name="reasonDetails" required placeholder="Why is this stock being removed?"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400" />
                  </label>
                </>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setSelectedMaterial(null)}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit"
                  className={`flex-1 rounded-lg px-4 py-2.5 text-[13px] font-medium text-white transition-colors ${stockAction === "ADD" ? "bg-[#111827] hover:bg-[#111827]/90" : "bg-rose-600 hover:bg-rose-700"}`}>
                  {stockAction === "ADD" ? "Save stock" : "Remove stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* ── Bulk restock modal ────────────────────────────────────────────── */}
      {showBulkModal && selectedRows.length > 0 ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0f172a]/45 px-4 pb-10 pt-20">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-100 px-6 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Bulk Add Stock</p>
              <h4 className="mt-1 text-[18px] font-semibold text-slate-900">Updating {selectedRows.length} items</h4>
            </div>
            <div className="px-6 pt-4">
              <input type="text" value={bulkSearch} onChange={(e) => setBulkSearch(e.target.value)}
                placeholder="Search by SKU, item, or warehouse…"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-[13px] text-slate-900 outline-none focus:border-slate-400" />
              {bulkSearch && (
                <p className="mt-1.5 text-[12px] text-slate-500">Showing {visibleBulkRows.length} of {selectedRows.length} selected</p>
              )}
            </div>
            <form method="post" action="/api/admin/inventory/raw-materials/bulk-restock" className="space-y-4 p-6">
              <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
                {visibleBulkRows.map((row) => (
                  <div key={row.id} className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold text-slate-900">{row.itemName}</p>
                      <p className="text-[12px] text-slate-500">{row.sku} · {row.warehouseName}</p>
                    </div>
                    <div className="w-32">
                      <input type="hidden" name="materialStockIds" value={row.id} />
                      <input name={`quantity_${row.id}`} type="number" min="1" defaultValue="1" placeholder="Qty"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none focus:border-slate-400" />
                    </div>
                  </div>
                ))}
                {visibleBulkRows.length === 0 && (
                  <p className="py-6 text-center text-[13px] text-slate-500">No items match your search.</p>
                )}
              </div>
              <label className="block">
                <span className="mb-1 block text-[12px] font-medium text-slate-700">Reference number (applied to all)</span>
                <input name="referenceNumber" placeholder="Optional"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none focus:border-slate-400" />
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowBulkModal(false); setSelectedIds(new Set()); setBulkSearch("") }}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 rounded-lg bg-[#111827] px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90">
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
