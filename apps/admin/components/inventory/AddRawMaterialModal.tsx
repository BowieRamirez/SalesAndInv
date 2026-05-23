"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Plus, X } from "lucide-react"

type WarehouseOption = { id: string; name: string }

export function AddRawMaterialModal({ warehouses }: { warehouses: WarehouseOption[] }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#374151]"
      >
        <Plus className="h-4 w-4" />
        Add raw material
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/45 px-4 py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false)
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-raw-material-title"
              className="my-auto w-full max-w-[860px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
              initial={{ y: 16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 bg-white px-6 py-4">
                <div>
                  <h2 id="add-raw-material-title" className="text-[15px] font-semibold text-slate-900">
                    Add raw material
                  </h2>
                  <p className="mt-1 text-[12px] text-slate-500">
                    Create a new material stock entry. SKU is auto-generated if left blank.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form
                method="post"
                action="/api/admin/inventory/raw-materials/create"
                className="p-6"
              >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Material name */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-medium text-slate-700">Material name *</span>
                    <input
                      name="itemName"
                      required
                      placeholder="e.g. 18mm Plywood Board"
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                    />
                  </label>

                  {/* SKU */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-medium text-slate-700">SKU</span>
                    <input
                      name="sku"
                      placeholder="Leave blank to auto-generate"
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                    />
                  </label>

                  {/* Warehouse */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-medium text-slate-700">Warehouse *</span>
                    <select
                      name="warehouseId"
                      defaultValue=""
                      required
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                    >
                      <option value="" disabled>Select warehouse</option>
                      {warehouses.map((w) => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </label>

                  {/* Unit of measure */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-medium text-slate-700">Unit of measure</span>
                    <input
                      name="unitOfMeasure"
                      placeholder="e.g. pcs, sheet, kg"
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                    />
                  </label>

                  {/* Reorder threshold */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-medium text-slate-700">Reorder threshold</span>
                    <input
                      name="reorderThreshold"
                      type="number"
                      min="0"
                      defaultValue="10"
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                    />
                  </label>

                  {/* Opening stock */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-medium text-slate-700">Opening stock</span>
                    <input
                      name="openingQty"
                      type="number"
                      min="0"
                      defaultValue="0"
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                    />
                  </label>

                  {/* Reference number */}
                  <label className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
                    <span className="text-[12px] font-medium text-slate-700">Reference number</span>
                    <input
                      name="referenceNumber"
                      placeholder="Optional"
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                    />
                  </label>

                  {/* Description */}
                  <label className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-3">
                    <span className="text-[12px] font-medium text-slate-700">Description</span>
                    <textarea
                      name="description"
                      placeholder="Optional notes about this material"
                      className="min-h-[80px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400 resize-none"
                    />
                  </label>
                </div>

                <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#111827] px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#374151]"
                  >
                    Add raw material
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
