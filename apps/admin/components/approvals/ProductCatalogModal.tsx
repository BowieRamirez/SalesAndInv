"use client"

import React, { useState, useMemo } from "react"
import { X, Search, Package, Archive, Eye, EyeOff, ChevronDown, ChevronRight } from "lucide-react"

export type CatalogMaterial = {
  materialSku: string
  materialName: string
  quantityRequired: number | null
  quantityDisplay: string | null
  notes: string | null
}

export type CatalogProduct = {
  id: string
  name: string
  category: string
  price: number
  isPublished: boolean
  state: string
  sku: string
  warehouseName: string
  availableQty: number
  materials: CatalogMaterial[]
}

type Props = {
  products: CatalogProduct[]
}

function formatPeso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value)
}

export function ProductCatalogModal({ products }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "ARCHIVED">("ALL")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      const matchesFilter =
        filter === "ALL" ||
        (filter === "ARCHIVED" && p.state === "ARCHIVED") ||
        (filter === "ACTIVE" && p.state !== "ARCHIVED")
      return matchesSearch && matchesFilter
    })
  }, [products, search, filter])

  const activeCount = products.filter((p) => p.state !== "ARCHIVED").length
  const archivedCount = products.filter((p) => p.state === "ARCHIVED").length
  const publishedCount = products.filter((p) => p.isPublished && p.state !== "ARCHIVED").length

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-2.5 text-[13px] font-medium text-[#374151] shadow-sm transition-colors hover:bg-[#f9fafb] hover:border-[#d1d5dc]"
      >
        <Package className="h-4 w-4 text-[#6b7280]" />
        View Product Catalog
        <span className="ml-1 rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[11px] font-semibold text-[#6b7280]">
          {products.length}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/50 px-4 py-8">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#f1f5f9] px-6 py-5">
              <div>
                <h3 className="text-[18px] font-semibold text-[#111827]">Product Catalog</h3>
                <p className="mt-0.5 text-[13px] text-[#6b7280]">
                  {activeCount} active · {publishedCount} published · {archivedCount} archived
                  <span className="ml-2 text-[#9ca3af]">· Click a row to see materials</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e7eb] text-[#6b7280] hover:bg-[#f9fafb] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 border-b border-[#f1f5f9] px-6 py-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#9ca3af]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, category, or SKU…"
                  className="w-full rounded-[10px] border border-[#d1d5dc] bg-white py-2.5 pl-9 pr-4 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                />
              </div>
              <div className="flex gap-1 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] p-1">
                {(["ALL", "ACTIVE", "ARCHIVED"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`rounded-[8px] px-3 py-1.5 text-[12px] font-medium transition-colors ${
                      filter === f
                        ? "bg-white text-[#111827] shadow-sm"
                        : "text-[#6b7280] hover:text-[#111827]"
                    }`}
                  >
                    {f === "ALL" ? `All (${products.length})` : f === "ACTIVE" ? `Active (${activeCount})` : `Archived (${archivedCount})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex items-center justify-center py-16 text-[13px] text-[#9ca3af]">
                  No products match your search.
                </div>
              ) : (
                <table className="min-w-full text-left text-[13px]">
                  <thead className="sticky top-0 z-10 bg-white">
                    <tr className="border-b border-[#f1f5f9] text-[#6b7280]">
                      <th className="w-8 px-3 py-3" />
                      <th className="px-4 py-3 font-medium">Product</th>
                      <th className="px-4 py-3 font-medium">SKU</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Price</th>
                      <th className="px-4 py-3 font-medium">Stock</th>
                      <th className="px-4 py-3 font-medium">Warehouse</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((product) => {
                      const isArchived = product.state === "ARCHIVED"
                      const isExpanded = expandedId === product.id
                      const hasMaterials = product.materials.length > 0

                      return (
                        <React.Fragment key={product.id}>
                          {/* Product row — clickable */}
                          <tr
                            onClick={() => toggleExpand(product.id)}
                            className={`cursor-pointer border-b border-[#f3f4f6] transition-colors hover:bg-[#f9fafb] ${
                              isExpanded ? "bg-[#f8faff]" : ""
                            } ${isArchived ? "opacity-60" : ""}`}
                          >
                            <td className="w-8 px-3 py-3 text-[#9ca3af]">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-[#6366f1]" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {isArchived ? (
                                  <Archive className="h-3.5 w-3.5 shrink-0 text-[#9ca3af]" />
                                ) : (
                                  <Package className="h-3.5 w-3.5 shrink-0 text-[#6366f1]" />
                                )}
                                <span className="font-medium text-[#111827]">{product.name}</span>
                                {hasMaterials && (
                                  <span className="rounded-full bg-[#eff6ff] px-1.5 py-0.5 text-[10px] font-semibold text-[#3b82f6]">
                                    {product.materials.length} mat.
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 font-mono text-[#6b7280]">{product.sku}</td>
                            <td className="px-4 py-3 text-[#374151]">{product.category}</td>
                            <td className="px-4 py-3 font-medium text-[#111827]">{formatPeso(product.price)}</td>
                            <td className="px-4 py-3 text-[#374151]">{product.availableQty}</td>
                            <td className="px-4 py-3 text-[#374151]">{product.warehouseName}</td>
                            <td className="px-4 py-3">
                              {isArchived ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f4f6] px-2.5 py-1 text-[11px] font-semibold text-[#6b7280]">
                                  <Archive className="h-3 w-3" /> Archived
                                </span>
                              ) : product.isPublished ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dcfce7] px-2.5 py-1 text-[11px] font-semibold text-[#166534]">
                                  <Eye className="h-3 w-3" /> Published
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fef9c3] px-2.5 py-1 text-[11px] font-semibold text-[#854d0e]">
                                  <EyeOff className="h-3 w-3" /> Hidden
                                </span>
                              )}
                            </td>
                          </tr>

                          {/* Expanded materials row */}
                          {isExpanded && (
                            <tr key={`${product.id}-materials`} className="border-b border-[#e0e7ff] bg-[#f8faff]">
                              <td />
                              <td colSpan={7} className="px-4 pb-4 pt-2">
                                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6366f1]">
                                  Material recipe
                                </p>
                                {!hasMaterials ? (
                                  <p className="text-[12px] text-[#9ca3af]">
                                    No materials configured for this product.
                                  </p>
                                ) : (
                                  <table className="min-w-full text-[12px]">
                                    <thead>
                                      <tr className="text-[#94a3b8]">
                                        <th className="pb-1.5 pr-6 text-left font-medium">SKU</th>
                                        <th className="pb-1.5 pr-6 text-left font-medium">Material</th>
                                        <th className="pb-1.5 pr-6 text-left font-medium">Qty</th>
                                        <th className="pb-1.5 text-left font-medium">Notes</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {product.materials.map((mat, i) => (
                                        <tr key={i} className="border-t border-[#e0e7ff]">
                                          <td className="py-1.5 pr-6 font-mono text-[#6b7280]">{mat.materialSku}</td>
                                          <td className="py-1.5 pr-6 font-medium text-[#1e293b]">{mat.materialName}</td>
                                          <td className="py-1.5 pr-6 text-[#374151]">
                                            {mat.quantityDisplay ?? (mat.quantityRequired != null ? String(mat.quantityRequired) : "—")}
                                          </td>
                                          <td className="py-1.5 text-[#6b7280]">{mat.notes ?? "—"}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#f1f5f9] px-6 py-4 text-right">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-[12px] bg-[#111827] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#111827]/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
