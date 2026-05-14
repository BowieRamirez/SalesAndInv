"use client"

import { useState } from "react"

const PAGE_SIZE = 10

type DamagedMaterialRow = {
  id: string
  stockItemId: string
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
  const [page, setPage] = useState(1)

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#d1d5db] bg-[#f9fafb] px-6 py-12 text-center text-[13px] text-[#6b7280]">
        Damaged materials from completed returns will appear here.
      </div>
    )
  }

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pagedRows = rows.slice(pageStart, pageStart + PAGE_SIZE)

  return (
    <section className="rounded-xl border border-[#e5e7eb] bg-white p-6">
      <div className="mb-4">
        <h3 className="text-[18px] font-semibold text-[#111827]">Damaged materials from returns</h3>
        <p className="mt-2 max-w-[720px] text-[13px] leading-[22px] text-[#6b7280]">
          These entries are recorded when sales completes a customer return and the product recipe is added back into
          inventory as damaged materials.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
              <th className="py-3 pr-4 font-medium">Recorded</th>
              <th className="py-3 pr-4 font-medium">SKU</th>
              <th className="py-3 pr-4 font-medium">Material</th>
              <th className="py-3 pr-4 font-medium">Warehouse</th>
              <th className="py-3 pr-4 font-medium">Qty</th>
              <th className="py-3 pr-4 font-medium">Source</th>
              <th className="py-3 font-medium">Reference</th>
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((row) => (
              <tr key={row.id} className="border-b border-[#f3f4f6] last:border-b-0">
                <td className="py-3 pr-4 text-[#111827] whitespace-nowrap">{new Date(row.createdAt).toLocaleString()}</td>
                <td className="py-3 pr-4 text-[#111827]">{row.sku}</td>
                <td className="py-3 pr-4 text-[#111827]">{row.itemName}</td>
                <td className="py-3 pr-4 text-[#6b7280]">{row.warehouseName}</td>
                <td className="py-3 pr-4 text-[#111827] font-medium">{row.quantity}</td>
                <td className="py-3 pr-4 text-[#6b7280]">{row.projectPurpose ?? row.requesterName ?? "Customer return"}</td>
                <td className="py-3 text-[#6b7280] text-[11px] font-mono">{row.referenceNumber ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 border-t border-[#f3f4f6] pt-5">
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
          <span className="rounded-md bg-[#020617] px-2 py-1 text-white">{currentPage}</span> of {totalPages}
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
  )
}
