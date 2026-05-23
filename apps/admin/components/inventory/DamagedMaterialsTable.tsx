"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { useDebounce } from "./hookTs"

const PAGE_SIZE = 10

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

export function DamagedMaterialsTable({ rows }: { rows: DamagedMaterialRow[] }) {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const debouncedQuery = useDebounce(query, 500)

  const filteredRows = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (!q) return rows

    return rows.filter((row) =>
      [
        row.sku ?? "",
        row.itemName ?? "",
        row.warehouseName ?? "",
        row.requesterName ?? "",
        row.projectPurpose ?? "",
        row.referenceNumber ?? "",
      ].some((value) => value.toLowerCase().includes(q)),
    )
  }, [rows, debouncedQuery])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pagedRows = filteredRows.slice(pageStart, pageStart + PAGE_SIZE)

  if (rows.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="py-8 text-center text-[13px] text-slate-500">
          Damaged materials from completed returns will appear here.
        </p>
      </section>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search — separate container */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 px-5 py-4">
          <div className="relative min-w-[260px] flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Search SKU, material, warehouse, reference"
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-[13px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
            />
          </div>
          <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] text-slate-600">
            {filteredRows.length} {filteredRows.length === 1 ? "entry" : "entries"}
          </span>
        </div>
      </section>

      {/* Table — its own container */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-[15px] font-semibold text-slate-900">Damaged materials from returns</h3>
          <p className="mt-1 max-w-[720px] text-[12px] leading-[20px] text-slate-500">
            Recorded when sales completes a customer return and the product recipe is added back into inventory as damaged materials.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-slate-200 bg-white">
              <tr className="text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3 font-medium">Recorded</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Material</th>
                <th className="px-4 py-3 font-medium">Warehouse</th>
                <th className="px-4 py-3 font-medium">Qty</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Reference</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-[13px] text-slate-500">
                    No damaged materials matched your search.
                  </td>
                </tr>
              ) : (
                pagedRows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 last:border-b-0 align-middle hover:bg-slate-50/60">
                    <td className="px-5 py-4 text-[13px] text-slate-600 whitespace-nowrap">{new Date(row.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-4 text-[13px] text-slate-900">{row.sku}</td>
                    <td className="px-4 py-4 text-[13px] text-slate-900">{row.itemName}</td>
                    <td className="px-4 py-4 text-[13px] text-slate-600">{row.warehouseName}</td>
                    <td className="px-4 py-4 text-[13px] text-slate-900 font-medium">{row.quantity}</td>
                    <td className="px-4 py-4 text-[13px] text-slate-600">{row.projectPurpose ?? row.requesterName ?? "Customer return"}</td>
                    <td className="px-4 py-4 text-[11px] font-mono text-slate-500">{row.referenceNumber ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination — same component used in AuditLogsTable */}
        <div className="flex items-center justify-center gap-2 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={() => setPage(1)}
            disabled={currentPage <= 1}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            aria-label="First page"
          >
            {"<<"}
          </button>
          <button
            type="button"
            onClick={() => setPage((v) => Math.max(1, v - 1))}
            disabled={currentPage <= 1}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            aria-label="Previous page"
          >
            {"<"}
          </button>
          <div className="min-w-[112px] rounded-md border border-[#111827] bg-white px-4 py-2 text-center text-[13px] font-semibold text-[#6b7280] shadow-sm">
            <span className="rounded-sm bg-[#020617] px-2 py-1 text-white">{currentPage}</span> of {totalPages}
          </div>
          <button
            type="button"
            onClick={() => setPage((v) => Math.min(totalPages, v + 1))}
            disabled={currentPage >= totalPages}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            aria-label="Next page"
          >
            {">"}
          </button>
          <button
            type="button"
            onClick={() => setPage(totalPages)}
            disabled={currentPage >= totalPages}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            aria-label="Last page"
          >
            {">>"}
          </button>
        </div>
      </section>
    </div>
  )
}
