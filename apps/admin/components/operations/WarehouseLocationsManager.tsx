"use client"

import { useState } from "react"

export type WarehouseSummaryRow = {
  id: string
  code: string
  name: string
  street: string | null
  city: string | null
  country: string
  postalCode: string | null
  itemCount: number
  archivedAt: string | null
}

const INPUT_CLASS =
  "w-full rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827] focus:ring-1 focus:ring-[#111827]"
const LABEL_CLASS = "block text-[12px] font-medium uppercase tracking-wide text-[#6b7280] mb-1.5"

// Edit Modal
function EditWarehouseModal({
  warehouse,
  onClose,
}: {
  warehouse: WarehouseSummaryRow
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[24px] border border-[#e2e8f0] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] px-7 py-5">
          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a]">Edit warehouse</h2>
            <p className="mt-0.5 text-[13px] text-[#64748b]">Update the details for this location.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-[#e2e8f0] text-[#64748b] hover:bg-[#f1f5f9]"
          >
            ✕
          </button>
        </div>

        <form method="post" action="/api/admin/inventory/warehouses/update" className="p-7 space-y-4">
          <input type="hidden" name="warehouseId" value={warehouse.id} />

          <div>
            <label className={LABEL_CLASS} htmlFor={`code-${warehouse.id}`}>Warehouse code <span className="text-red-500">*</span></label>
            <input
              id={`code-${warehouse.id}`}
              name="code"
              required
              defaultValue={warehouse.code}
              placeholder="e.g. MAIN"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS} htmlFor={`name-${warehouse.id}`}>Warehouse name <span className="text-red-500">*</span></label>
            <input
              id={`name-${warehouse.id}`}
              name="name"
              required
              defaultValue={warehouse.name}
              placeholder="e.g. Main Warehouse"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS} htmlFor={`street-${warehouse.id}`}>Street address</label>
            <input id={`street-${warehouse.id}`} name="street" defaultValue={warehouse.street ?? ""} placeholder="e.g. 001B Carlos cor Dizon St" className={INPUT_CLASS} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL_CLASS} htmlFor={`city-${warehouse.id}`}>City</label>
              <input id={`city-${warehouse.id}`} name="city" defaultValue={warehouse.city ?? ""} placeholder="e.g. Novaliches" className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS} htmlFor={`postalCode-${warehouse.id}`}>Postal code</label>
              <input id={`postalCode-${warehouse.id}`} name="postalCode" defaultValue={warehouse.postalCode ?? ""} placeholder="e.g. 1105" className={INPUT_CLASS} />
            </div>
          </div>
          <div>
            <label className={LABEL_CLASS} htmlFor={`country-${warehouse.id}`}>Country</label>
            <input id={`country-${warehouse.id}`} name="country" defaultValue={warehouse.country ?? "Philippines"} placeholder="Philippines" className={INPUT_CLASS} />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-[#0f172a] py-3 text-[13px] font-semibold text-white transition-all hover:bg-[#1e293b] active:scale-95"
            >
              Save changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-[#e2e8f0] py-3 text-[13px] font-semibold text-[#475569] hover:bg-[#f8fafc]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Archive Confirmation Modal
function ArchiveConfirmModal({
  warehouse,
  onClose,
}: {
  warehouse: WarehouseSummaryRow
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[24px] border border-[#e2e8f0] bg-white p-8 shadow-2xl text-center">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-amber-100 text-amber-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
        <h3 className="text-[18px] font-bold text-[#0f172a]">Archive warehouse?</h3>
        <p className="mt-2 text-[13px] leading-[20px] text-[#64748b]">
          <span className="font-semibold text-[#0f172a]">{warehouse.name}</span> ({warehouse.code}) will be hidden from active warehouse lists. Existing stock data is preserved and it can be restored at any time.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#e2e8f0] py-2.5 text-[13px] font-semibold text-[#475569] hover:bg-[#f8fafc]"
          >
            Cancel
          </button>
          <form method="post" action="/api/admin/inventory/warehouses/archive" className="flex-1">
            <input type="hidden" name="warehouseId" value={warehouse.id} />
            <input type="hidden" name="action" value="archive" />
            <button
              type="submit"
              className="w-full rounded-xl bg-amber-500 py-2.5 text-[13px] font-semibold text-white hover:bg-amber-600 active:scale-95"
            >
              Yes, archive
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// Active warehouses table
export function WarehouseLocationsTable({
  warehouses,
}: {
  warehouses: WarehouseSummaryRow[]
}) {
  const [editing, setEditing] = useState<WarehouseSummaryRow | null>(null)
  const [archiving, setArchiving] = useState<WarehouseSummaryRow | null>(null)

  if (warehouses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#d1d5db] bg-white p-10 text-center text-[13px] text-[#6b7280]">
        No warehouses have been configured yet.
      </div>
    )
  }

  return (
    <>
      {editing && <EditWarehouseModal warehouse={editing} onClose={() => setEditing(null)} />}
      {archiving && <ArchiveConfirmModal warehouse={archiving} onClose={() => setArchiving(null)} />}

      <section className="rounded-xl border border-[#e5e7eb] bg-white p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
                <th className="py-3 pr-4 font-medium">Code</th>
                <th className="py-3 pr-4 font-medium">Warehouse</th>
                <th className="py-3 pr-4 font-medium">Address</th>
                <th className="py-3 pr-4 font-medium">Tracked Items</th>
                <th className="py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((row) => (
                <tr key={row.id} className="border-b border-[#f3f4f6] last:border-b-0">
                  <td className="py-3 pr-4 font-mono font-semibold text-[#111827]">{row.code}</td>
                  <td className="py-3 pr-4 font-medium text-[#111827]">{row.name}</td>
                  <td className="py-3 pr-4 text-[#6b7280]">
                    {[row.street, row.city, row.postalCode, row.country].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-[#111827]">{row.itemCount}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing(row)}
                        className="flex items-center gap-1.5 rounded-lg border border-[#e2e8f0] bg-white px-3 py-1.5 text-[12px] font-medium text-[#374151] transition-all hover:border-[#374151] hover:bg-[#f9fafb]"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setArchiving(row)}
                        className="flex items-center gap-1.5 rounded-lg border border-[#e2e8f0] bg-white px-3 py-1.5 text-[12px] font-medium text-[#92400e] transition-all hover:border-amber-300 hover:bg-amber-50"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

// Archived warehouses table (for the archived-warehouses tab)
export function ArchivedWarehousesTable({
  warehouses,
}: {
  warehouses: WarehouseSummaryRow[]
}) {
  if (warehouses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#d1d5db] bg-white p-10 text-center text-[13px] text-[#6b7280]">
        No archived warehouses.
      </div>
    )
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
              <th className="py-3 pr-4 font-medium">Tracked Items</th>
              <th className="py-3 pr-4 font-medium">Archived</th>
              <th className="py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((row) => (
              <tr key={row.id} className="border-b border-[#f3f4f6] last:border-b-0 opacity-75">
                <td className="py-3 pr-4 font-mono font-semibold text-[#6b7280]">{row.code}</td>
                <td className="py-3 pr-4 font-medium text-[#374151]">{row.name}</td>
                <td className="py-3 pr-4 text-[#9ca3af]">
                  {[row.street, row.city, row.postalCode, row.country].filter(Boolean).join(", ") || "—"}
                </td>
                <td className="py-3 pr-4 text-[#374151]">{row.itemCount}</td>
                <td className="py-3 pr-4 text-[#9ca3af]">
                  {row.archivedAt
                    ? new Date(row.archivedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </td>
                <td className="py-3">
                  <form method="post" action="/api/admin/inventory/warehouses/archive">
                    <input type="hidden" name="warehouseId" value={row.id} />
                    <input type="hidden" name="action" value="restore" />
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-lg border border-[#d1fae5] bg-[#f0fdf4] px-3 py-1.5 text-[12px] font-medium text-[#166534] transition-all hover:bg-[#dcfce7]"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Restore
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
