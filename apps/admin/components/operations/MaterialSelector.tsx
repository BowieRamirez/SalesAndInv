"use client"

import { useDeferredValue, useMemo, useState } from "react"

type Material = {
  id: string
  sku: string
  itemName: string
  availableQty: number
  unitOfMeasure: string
}

type MaterialSelectorProps = {
  materials: Material[]
  defaultSelectedIds?: string[]
  defaultQuantities?: Record<string, string>
  defaultNotes?: Record<string, string>
}

export function MaterialSelector({
  materials,
  defaultSelectedIds = [],
  defaultQuantities = {},
  defaultNotes = {},
}: MaterialSelectorProps) {
  const [search, setSearch] = useState("")
  const [showSelectedOnly, setShowSelectedOnly] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelectedIds)
  const deferredSearch = useDeferredValue(search)

  const visibleMaterials = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase()

    return materials.filter((material) => {
      const matchesSearch =
        !query ||
        `${material.itemName} ${material.sku} ${material.unitOfMeasure}`.toLowerCase().includes(query)

      const matchesSelected = !showSelectedOnly || selectedIds.includes(material.id)

      return matchesSearch && matchesSelected
    })
  }, [deferredSearch, materials, selectedIds, showSelectedOnly])

  function toggleSelected(materialId: string, checked: boolean) {
    setSelectedIds((current) => {
      if (checked) {
        return current.includes(materialId) ? current : [...current, materialId]
      }

      return current.filter((id) => id !== materialId)
    })
  }

  return (
    <div className="rounded-3xl border border-[#e2e8f0] bg-white shadow-sm">
      <div className="border-b border-[#eef2f7] px-5 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h3 className="text-[16px] font-semibold text-[#0f172a]">Required materials from inventory</h3>
          </div>
          <div className="flex w-full flex-col gap-3 xl:max-w-2xl xl:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search material name or SKU"
              className="w-full rounded-2xl border border-[#dbe4f0] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
            />
            <label className="inline-flex items-center gap-3 rounded-2xl border border-[#dbe4f0] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#334155]">
              <input
                type="checkbox"
                checked={showSelectedOnly}
                onChange={(event) => setShowSelectedOnly(event.target.checked)}
                className="h-4 w-4"
              />
              Show selected only
            </label>
          </div>
        </div>
        <p className="mt-3 text-[12px] uppercase tracking-[0.14em] text-[#94a3b8]">
          Selected {selectedIds.length} of {materials.length} materials
        </p>
      </div>

      <div className="max-h-[520px] overflow-auto">
        <table className="min-w-full text-left text-[13px]">
          <thead className="sticky top-0 bg-[#f8fafc] text-[#64748b]">
            <tr className="border-b border-[#e5e7eb]">
              <th className="px-5 py-3 font-medium">Use</th>
              <th className="px-4 py-3 font-medium">Material</th>
              <th className="px-4 py-3 font-medium">On hand</th>
              <th className="px-4 py-3 font-medium">Quantity needed</th>
              <th className="px-4 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {visibleMaterials.map((material) => {
              const isSelected = selectedIds.includes(material.id)

              return (
                <tr key={material.id} className="border-b border-[#f1f5f9] align-top last:border-b-0">
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      name="materialIds"
                      value={material.id}
                      checked={isSelected}
                      onChange={(event) => toggleSelected(material.id, event.target.checked)}
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-[#0f172a]">{material.itemName}</p>
                    <p className="mt-1 text-[12px] text-[#64748b]">{material.sku}</p>
                  </td>
                  <td className="px-4 py-4 text-[#475569]">
                    {material.availableQty} {material.unitOfMeasure}
                    {material.availableQty <= 0 ? (
                      <p className="mt-1 text-[11px] text-[#b45309]">Currently out of stock</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4">
                    <input
                      name={`quantityDisplay:${material.id}`}
                      defaultValue={defaultQuantities[material.id] ?? ""}
                      placeholder={`e.g. 2 ${material.unitOfMeasure}`}
                      className="w-full rounded-xl border border-[#dbe4f0] bg-white px-3 py-2.5 text-[13px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input
                      name={`notes:${material.id}`}
                      defaultValue={defaultNotes[material.id] ?? ""}
                      placeholder="Optional usage note"
                      className="w-full rounded-xl border border-[#dbe4f0] bg-white px-3 py-2.5 text-[13px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                    />
                  </td>
                </tr>
              )
            })}
            {visibleMaterials.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-[14px] text-[#64748b]">
                  No materials matched your search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
