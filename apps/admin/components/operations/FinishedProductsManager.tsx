"use client"

import { Fragment, useDeferredValue, useMemo, useState } from "react"

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
}

function formatPeso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(value)
}

export function FinishedProductsManager({ products }: FinishedProductsManagerProps) {
  const [search, setSearch] = useState("")
  const [openProductId, setOpenProductId] = useState<string | null>(null)
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

  return (
    <div className="space-y-4">
      <section className="rounded-[28px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[22px] font-semibold text-[#111827]">Edit finished products</h2>
          </div>
          <div className="w-full max-w-md">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
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
                {filteredProducts.map((product) => {
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
                              className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]"
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
                                    <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Image URL</span>
                                    <input
                                      name="imageUrl"
                                      defaultValue={product.imageUrl}
                                      placeholder="https://example.com/product-image.jpg"
                                      className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
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
                                  <p className="mt-1 text-[13px] leading-6 text-[#475569]">{product.materialSummary}</p>
                                </div>

                                <div className="space-y-2">
                                  {product.recipeDetails.slice(0, 4).map((material) => (
                                    <div
                                      key={`${product.id}-${material.id}`}
                                      className="rounded-2xl border border-[#e2e8f0] bg-[#fbfdff] px-3 py-2"
                                    >
                                      <p className="text-[12px] font-medium text-[#0f172a]">
                                        {material.itemName} <span className="text-[#94a3b8]">({material.sku})</span>
                                      </p>
                                      <p className="mt-1 text-[11px] text-[#64748b]">
                                        {material.quantityDisplay || "Quantity not specified"}
                                      </p>
                                    </div>
                                  ))}
                                  {product.recipeDetails.length > 4 ? (
                                    <p className="text-[11px] text-[#94a3b8]">+{product.recipeDetails.length - 4} more materials</p>
                                  ) : null}
                                </div>

                                <button
                                  type="submit"
                                  className="rounded-2xl bg-[#111827] px-4 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#111827]/90"
                                >
                                  Save product changes
                                </button>
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
    </div>
  )
}
