"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { useDebounce } from "./hookTs"
import type { DetailedAuditLog } from "@/lib/audit-logs"

const PAGE_SIZE = 10

export function AuditLogsTable({ rows }: { rows: DetailedAuditLog[] }) {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const debouncedQuery = useDebounce(query, 500)

  const filteredRows = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase()

    if (!normalizedQuery) {
      return rows
    }

    return rows.filter((row) =>
      [
        row.actorName ?? "",
        row.action,
        row.entityType,
        row.sku ?? "",
        row.itemName ?? "",
        row.details ?? "",
        row.displayRecord ?? "",
        row.displaySub ?? "",
      ].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    )
  }, [debouncedQuery, rows])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pagedRows = filteredRows.slice(pageStart, pageStart + PAGE_SIZE)

  if (rows.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="py-8 text-center text-[13px] text-slate-500">
          Audit entries will show up here after stock approvals, updates, and company-code actions are recorded.
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
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Search actor, action, account, product, SKU, or item"
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
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-slate-200 bg-white">
              <tr className="text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3 font-medium">Recorded</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Area</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Record</th>
                <th className="px-4 py-3 font-medium">Qty</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-[13px] text-slate-500">
                    No audit entries matched your search.
                  </td>
                </tr>
              ) : (
                pagedRows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 last:border-b-0 align-middle hover:bg-slate-50/60">
                    <td className="px-5 py-4 text-[13px] text-slate-600">{new Date(row.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-4 text-[13px] text-slate-900">{row.actorName ?? "System"}</td>
                    <td className="px-4 py-4 text-[13px] text-slate-700">{row.action.replaceAll("_", " ")}</td>
                    <td className="px-4 py-4 text-[13px] text-slate-700">{row.entityType.replaceAll("_", " ")}</td>
                    <td className="px-4 py-4 text-[13px] text-slate-600">{row.sku ?? "—"}</td>
                    <td className="px-4 py-4 text-[13px] text-slate-700">
                      <div className="font-medium">
                        {row.displayRecord ?? row.itemName ?? row.details ?? "—"}
                      </div>
                      {(row.displaySub ?? (row.displayRecord && row.details)) ? (
                        <div className="mt-0.5 text-[11px] text-slate-500">
                          {row.displaySub ?? row.details}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-[13px] text-slate-700">{row.quantity ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
            onClick={() => setPage((value) => Math.max(1, value - 1))}
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
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
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
