"use client"

import { useMemo, useState } from "react"

type DetailedAuditLog = {
  id: string
  action: string
  entityType: string
  entityId: string
  sku: string | null
  itemName: string | null
  quantity: number | null
  details: string | null
  actorName: string | null
  createdAt: Date
}

const PAGE_SIZE = 10

export function AuditLogsTable({ rows }: { rows: DetailedAuditLog[] }) {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return rows
    }

    return rows.filter((row) =>
      [
        row.actorName ?? "",
        row.action,
        row.entityType,
        row.entityId,
        row.sku ?? "",
        row.itemName ?? "",
        row.details ?? "",
      ].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    )
  }, [query, rows])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pagedRows = filteredRows.slice(pageStart, pageStart + PAGE_SIZE)

  if (rows.length === 0) {
    return (
      <section className="rounded-xl border border-[#e5e7eb] bg-white p-6">
        <p className="py-8 text-center text-[13px] text-[#6b7280]">
          Audit entries will show up here after stock approvals, updates, and company-code actions are recorded.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-[#e5e7eb] bg-white p-6">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <h3 className="text-[18px] font-semibold text-[#111827]">Audit Logs</h3>
        <div className="w-full md:w-[320px]">
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder="Search actor, action, account, product, SKU, or item"
            className="w-full rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
              <th className="py-3 pr-4 font-medium">Recorded</th>
              <th className="py-3 pr-4 font-medium">Actor</th>
              <th className="py-3 pr-4 font-medium">Action</th>
              <th className="py-3 pr-4 font-medium">Area</th>
              <th className="py-3 pr-4 font-medium">SKU</th>
              <th className="py-3 pr-4 font-medium">Record</th>
              <th className="py-3 font-medium">Qty</th>
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((row) => (
              <tr key={row.id} className="border-b border-[#f3f4f6] last:border-b-0">
                <td className="py-3 pr-4 text-[#111827]">{new Date(row.createdAt).toLocaleString()}</td>
                <td className="py-3 pr-4 text-[#111827]">{row.actorName ?? "System"}</td>
                <td className="py-3 pr-4 text-[#111827]">{row.action.replaceAll("_", " ")}</td>
                <td className="py-3 pr-4 text-[#111827]">{row.entityType.replaceAll("_", " ")}</td>
                <td className="py-3 pr-4 text-[#111827]">{row.sku ?? "-"}</td>
                <td className="py-3 pr-4 text-[#111827]">
                  <div>{row.itemName ?? row.details ?? row.entityId}</div>
                  {row.itemName && row.details ? (
                    <div className="mt-1 text-[11px] text-[#6b7280]">{row.details}</div>
                  ) : null}
                </td>
                <td className="py-3 text-[#111827]">{row.quantity ?? "-"}</td>
              </tr>
            ))}
            {pagedRows.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#6b7280]">
                  No audit entries matched your search.
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
          <span className="rounded-sm bg-[#020617] px-2 py-1 text-white">{currentPage}</span> of {totalPages}
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
  )
}
