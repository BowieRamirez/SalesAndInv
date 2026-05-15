"use client"

import { Fragment, useDeferredValue, useMemo, useState } from "react"
import { ImageDropField } from "./ImageDropField"
import { MaterialSelector } from "./MaterialSelector"

type FinishedProduct = {
  id: string
  stockItemId: string
  name: string
  category: string
  price: number
  badge: string | null
  description: string
  isPublished: boolean
  imageUrl: string
  warehouseName: string
  sku: string
  availableQty: number
  reorderThreshold: number
  materialSummary: string
  recipeCount: number
  recipeDetails: Array<{
    id: string
    itemName: string
    sku: string
    quantityDisplay: string | null
    notes: string | null
  }>
}

type FinishedProductsManagerProps = {
  products: FinishedProduct[]
  rawMaterials: Array<{
    id: string
    sku: string
    itemName: string
    availableQty: number
    unitOfMeasure: string
  }>
  warehouses: Array<{
    id: string
    name: string
    code: string
  }>
  categories: readonly string[]
}

function formatPeso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(value)
}

const PAGE_SIZE = 10

export function FinishedProductsManager({ products, rawMaterials, warehouses, categories }: FinishedProductsManagerProps) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [openProductId, setOpenProductId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const deferredSearch = useDeferredValue(search)

  const filteredProducts = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase()

    if (!query) {
      return products
    }

    return products.filter((product) => {
      const haystack = [
        product.name,
        product.sku,
        product.category,
        product.warehouseName,
        product.materialSummary,
        ...product.recipeDetails.map((material) => `${material.itemName} ${material.sku}`),
      ]
        .join(" ")
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [deferredSearch, products])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pagedProducts = filteredProducts.slice(pageStart, pageStart + PAGE_SIZE)

  return (
    <div className="space-y-4">
      <section className="rounded-[28px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-[22px] font-semibold text-[#111827]">Edit finished products</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="rounded-xl bg-[#111827] px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90"
            >
              Add New Product
            </button>
          </div>
          <div className="w-full max-w-md">
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder="Search by name, SKU, category, warehouse, or material"
              className="w-full rounded-2xl border border-[#dbe4f0] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
            />
          </div>
        </div>
        <p className="mt-3 text-[12px] uppercase tracking-[0.14em] text-[#94a3b8]">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </section>

      {filteredProducts.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[#cbd5e1] bg-white p-10 text-center text-[14px] text-[#64748b]">
          No finished products matched your search.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[28px] border border-[#e5e7eb] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1120px] w-full text-left">
              <thead className="bg-[#f8fafc]">
                <tr className="border-b border-[#e2e8f0] text-[12px] uppercase tracking-[0.16em] text-[#94a3b8]">
                  <th className="px-5 py-4 font-semibold">Product</th>
                  <th className="px-4 py-4 font-semibold">Category</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 font-semibold">Price</th>
                  <th className="px-4 py-4 font-semibold">Stock</th>
                  <th className="px-4 py-4 font-semibold">Recipe</th>
                  <th className="px-5 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {pagedProducts.map((product) => {
                  const isOpen = openProductId === product.id

                  return (
                    <Fragment key={product.id}>
                      <tr className="border-b border-[#eef2f7] align-top">
                        <td className="px-5 py-4">
                          <p className="text-[15px] font-semibold text-[#111827]">{product.name}</p>
                          <p className="mt-1 text-[12px] text-[#64748b]">
                            {product.sku} | {product.warehouseName} | {product.recipeCount} materials
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-full bg-[#eef2ff] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4338ca]">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                              product.isPublished
                                ? "bg-[#dcfce7] text-[#166534]"
                                : "bg-[#e2e8f0] text-[#475569]"
                            }`}
                          >
                            {product.isPublished ? "Published" : "Hidden"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-[13px] font-semibold text-[#111827]">{formatPeso(product.price)}</td>
                        <td className="px-4 py-4 text-[13px] text-[#111827]">
                          {product.availableQty}
                          <p className="mt-1 text-[11px] text-[#94a3b8]">Reorder at {product.reorderThreshold}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="max-w-[260px] truncate text-[13px] text-[#475569]">{product.materialSummary}</p>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setOpenProductId((current) => (current === product.id ? null : product.id))}
                            className="rounded-xl border border-[#dbe4f0] bg-white px-3 py-2 text-[12px] font-medium text-[#334155] transition-colors hover:border-[#94a3b8] hover:bg-[#f8fafc]"
                          >
                            {isOpen ? "Close editor" : "Open editor"}
                          </button>
                        </td>
                      </tr>

                      {isOpen ? (
                        <tr className="border-b border-[#eef2f7] bg-[#fbfdff]">
                          <td colSpan={7} className="px-5 py-5">
                            <form
                              method="post"
                              action="/api/admin/operations/products/update"
                              className="grid gap-4 xl:grid-cols-[1fr_minmax(400px,0.8fr)]"
                            >
                              <input type="hidden" name="productId" value={product.id} />
                              <input type="hidden" name="stockItemId" value={product.stockItemId} />

                              <div className="grid gap-4">
                                <div className="grid gap-3 md:grid-cols-2">
                                  <label className="grid gap-2">
                                    <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Product name</span>
                                    <input
                                      name="name"
                                      defaultValue={product.name}
                                      className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                                    />
                                  </label>
                                  <label className="grid gap-2">
                                    <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Category</span>
                                    <input
                                      name="category"
                                      defaultValue={product.category}
                                      className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                                    />
                                  </label>
                                  <label className="grid gap-2">
                                    <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Price</span>
                                    <input
                                      name="price"
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      defaultValue={product.price}
                                      className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                                    />
                                  </label>
                                  <label className="grid gap-2">
                                    <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Badge</span>
                                    <input
                                      name="badge"
                                      defaultValue={product.badge ?? ""}
                                      placeholder="SALE, HOT, BEST_SELLER"
                                      className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                                    />
                                  </label>
                                  <label className="md:col-span-2 grid gap-2">
                                    <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Product image</span>
                                    <ImageDropField
                                      name="imageUrl"
                                      defaultValue={product.imageUrl}
                                      altPreview={product.name}
                                    />
                                  </label>
                                  <label className="md:col-span-2 grid gap-2">
                                    <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Description</span>
                                    <textarea
                                      name="description"
                                      rows={4}
                                      defaultValue={product.description}
                                      className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                                    />
                                  </label>
                                </div>

                                <label className="inline-flex items-center gap-3 text-[14px] text-[#334155]">
                                  <input
                                    type="checkbox"
                                    name="isPublished"
                                    defaultChecked={product.isPublished}
                                    className="h-4 w-4"
                                  />
                                  Show this product in the customer storefront
                                </label>
                              </div>

                              <div className="grid gap-3 rounded-3xl border border-[#e2e8f0] bg-white p-4">
                                {product.imageUrl ? (
                                  <img src={product.imageUrl} alt={product.name} className="h-36 w-full rounded-2xl object-cover" />
                                ) : (
                                  <div className="flex h-36 items-center justify-center rounded-2xl border border-dashed border-[#dbe4f0] bg-[#f8fafc] text-[13px] text-[#64748b]">
                                    No image URL saved
                                  </div>
                                )}

                                <div>
                                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Recipe</p>
                                  <p className="mt-1 mb-4 text-[13px] leading-6 text-[#475569]">{product.materialSummary}</p>
                                  <MaterialSelector
                                    materials={rawMaterials}
                                    defaultSelectedIds={product.recipeDetails.map((m) => m.id)}
                                    defaultQuantities={Object.fromEntries(
                                      product.recipeDetails.map((m) => [m.id, m.quantityDisplay ?? ""])
                                    )}
                                    defaultNotes={Object.fromEntries(
                                      product.recipeDetails.map((m) => [m.id, m.notes ?? ""])
                                    )}
                                  />
                                </div>

                                <div className="flex items-center justify-between border-t border-[#e2e8f0] pt-4">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      const confirmed = confirm(`Are you sure you want to delete ${product.name}?`)
                                      if (confirmed) {
                                        const form = document.createElement("form")
                                        form.method = "post"
                                        form.action = "/api/admin/operations/products/delete"

                                        const idInput = document.createElement("input")
                                        idInput.type = "hidden"
                                        idInput.name = "productId"
                                        idInput.value = product.id
                                        form.appendChild(idInput)

                                        const stockInput = document.createElement("input")
                                        stockInput.type = "hidden"
                                        stockInput.name = "stockItemId"
                                        stockInput.value = product.stockItemId
                                        form.appendChild(stockInput)

                                        document.body.appendChild(form)
                                        form.submit()
                                      }
                                    }}
                                    className="rounded-xl px-4 py-3 text-[14px] font-medium text-[#b91c1c] transition-colors hover:bg-[#fef2f2]"
                                  >
                                    Delete product
                                  </button>
                                  <button
                                    type="submit"
                                    className="rounded-2xl bg-[#111827] px-4 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#111827]/90"
                                  >
                                    Save product changes
                                  </button>
                                </div>
                              </div>
                            </form>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredProducts.length > 0 && (
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
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/20 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-[#e5e7eb] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-8 py-5">
              <h2 className="text-[20px] font-semibold text-[#111827]">Create finished product</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="grid h-10 w-10 place-items-center rounded-full text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#0f172a]"
              >
                ✕
              </button>
            </div>
            
            <div className="overflow-y-auto p-8">
              {rawMaterials.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#fca5a5] bg-[#fff7f7] p-6 text-[14px] text-[#b91c1c]">
                  No raw materials exist in inventory yet, so finished products cannot be created. Add the needed
                  materials in Inventory first.
                </div>
              ) : null}

              <form method="post" action="/api/admin/operations/products/create" className="space-y-6">
                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="grid gap-4 rounded-3xl border border-[#e2e8f0] bg-[#fbfdff] p-5">
                    <div>
                      <h3 className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">
                        Catalog details
                      </h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Product name</span>
                        <input
                          name="name"
                          required
                          placeholder="Executive desk"
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Storefront category</span>
                        <select
                          name="category"
                          defaultValue={categories[0]}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        >
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Warehouse</span>
                        <select
                          name="warehouseId"
                          defaultValue={warehouses[0]?.id ?? ""}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        >
                          {warehouses.map((warehouse) => (
                            <option key={warehouse.id} value={warehouse.id}>
                              {warehouse.name} ({warehouse.code})
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Price</span>
                        <input
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          placeholder="15000"
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="md:col-span-2 grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Product image</span>
                        <ImageDropField name="imageUrl" />
                      </label>
                      <label className="md:col-span-2 grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Description</span>
                        <textarea
                          name="description"
                          rows={5}
                          required
                          placeholder="Describe the finished product as it should appear in the storefront."
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid gap-4 rounded-3xl border border-[#e2e8f0] bg-[#fbfdff] p-5">
                    <div>
                      <h3 className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">
                        Stock and storefront settings
                      </h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Opening stock</span>
                        <input
                          name="openingQty"
                          type="number"
                          min="0"
                          defaultValue={0}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Reorder threshold</span>
                        <input
                          name="reorderThreshold"
                          type="number"
                          min="0"
                          defaultValue={10}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Width (cm)</span>
                        <input
                          name="widthCm"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={0}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Depth (cm)</span>
                        <input
                          name="depthCm"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={0}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Height (cm)</span>
                        <input
                          name="heightCm"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={0}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Weight (kg)</span>
                        <input
                          name="weightKg"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={0}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Unit of measure</span>
                        <input
                          name="unitOfMeasure"
                          defaultValue="pcs"
                          placeholder="pcs"
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Badge</span>
                        <input
                          name="badge"
                          placeholder="SALE, HOT, BEST_SELLER"
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                    </div>
                    <label className="inline-flex items-center gap-3 rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#334155]">
                      <input type="checkbox" name="isPublished" defaultChecked className="h-4 w-4" />
                      Publish this product to the customer storefront immediately.
                    </label>
                  </div>
                </div>

                <MaterialSelector materials={rawMaterials} />

                <div className="flex items-center justify-between gap-4 rounded-3xl border border-[#e2e8f0] bg-[#fbfdff] px-5 py-4">
                  <button
                    type="submit"
                    disabled={rawMaterials.length === 0}
                    className="rounded-2xl bg-[#111827] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#111827]/90 disabled:cursor-not-allowed disabled:bg-[#cbd5e1]"
                  >
                    Create finished product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
