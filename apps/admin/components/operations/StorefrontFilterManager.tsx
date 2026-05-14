"use client"

import { useState, useMemo } from "react"

type Category = {
  id: string
  name: string
}

type Product = {
  id: string
  name: string
  category: string
  imageUrl: string
}

type StorefrontFilterManagerProps = {
  categories: Category[]
  products: Product[]
}

export function StorefrontFilterManager({ categories, products }: StorefrontFilterManagerProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(categories[0]?.id ?? null)
  const [search, setSearch] = useState("")

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === activeCategoryId),
    [categories, activeCategoryId]
  )

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return products.filter((product) => {
      if (!query) return true
      return product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query)
    })
  }, [products, search])

  // Initially checked products are those whose category string matches the active category's name.
  // We use this local state to manage checks before submitting.
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])

  // Reset selected products when active category changes
  useMemo(() => {
    if (activeCategory) {
      setSelectedProductIds(
        products.filter((p) => p.category === activeCategory.name).map((p) => p.id)
      )
    } else {
      setSelectedProductIds([])
    }
  }, [activeCategory, products])

  function toggleProduct(productId: string, checked: boolean) {
    setSelectedProductIds((current) => {
      if (checked) return [...current, productId]
      return current.filter((id) => id !== productId)
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="space-y-4">
          <section className="rounded-[28px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-[16px] font-semibold text-[#111827]">Add new category</h2>
            <form method="post" action="/api/admin/operations/filters/categories/create" className="flex gap-2">
              <input
                name="name"
                placeholder="e.g. Office Chairs"
                required
                className="w-full rounded-xl border border-[#dbe4f0] bg-[#f8fafc] px-4 py-2.5 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#111827] px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#111827]/90"
              >
                Add
              </button>
            </form>
          </section>

          <section className="rounded-[28px] border border-[#e5e7eb] bg-white shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#e5e7eb] bg-[#f8fafc]">
              <h2 className="text-[16px] font-semibold text-[#111827]">Storefront categories</h2>
            </div>
            <div className="flex flex-col">
              {categories.length === 0 ? (
                <div className="p-5 text-[13px] text-[#64748b]">No categories exist.</div>
              ) : (
                categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategoryId(category.id)}
                    className={`flex items-center justify-between border-b border-[#f1f5f9] px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-[#f8fafc] ${
                      activeCategoryId === category.id ? "bg-[#f8fafc] font-semibold text-[#111827]" : "text-[#475569]"
                    }`}
                  >
                    <span className="text-[14px]">{category.name}</span>
                    <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[12px] font-medium text-[#64748b]">
                      {products.filter((p) => p.category === category.name).length} items
                    </span>
                  </button>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="rounded-[28px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
          {!activeCategory ? (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-[#64748b]">
              <p className="text-[14px]">Select a category to pick which products belong to it.</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#e5e7eb] pb-6">
                <div>
                  <h2 className="text-[22px] font-semibold text-[#111827]">{activeCategory.name}</h2>
                  <p className="mt-1 text-[13px] text-[#64748b]">Assign products to this category for the storefront filter.</p>
                </div>
                <form method="post" action="/api/admin/operations/filters/categories/delete" onSubmit={(e) => {
                  if (!confirm(`Are you sure you want to delete the category "${activeCategory.name}"? Products inside will become uncategorized.`)) {
                    e.preventDefault()
                  }
                }}>
                  <input type="hidden" name="categoryId" value={activeCategory.id} />
                  <input type="hidden" name="categoryName" value={activeCategory.name} />
                  <button
                    type="submit"
                    className="rounded-xl border border-[#fee2e2] bg-[#fef2f2] px-4 py-2.5 text-[13px] font-medium text-[#b91c1c] transition-colors hover:bg-[#fee2e2]"
                  >
                    Delete category
                  </button>
                </form>
              </div>

              <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <input
                  type="text"
                  placeholder="Search products to assign..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full max-w-sm rounded-xl border border-[#dbe4f0] bg-[#f8fafc] px-4 py-2.5 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                />
                <p className="text-[13px] font-medium text-[#475569]">
                  Selected {selectedProductIds.length} of {products.length} total products
                </p>
              </div>

              <form method="post" action="/api/admin/operations/filters/assignments/update" className="flex-1 flex flex-col min-h-0">
                <input type="hidden" name="categoryName" value={activeCategory.name} />
                
                {/* We need to send the full list of checked product IDs. If none checked, we still submit an empty array (which formData treats uniquely, so we send a dummy to avoid missing keys). */}
                <input type="hidden" name="productIds" value="" />
                {selectedProductIds.map((id) => (
                  <input key={id} type="hidden" name="productIds" value={id} />
                ))}

                <div className="flex-1 overflow-y-auto pr-2 min-h-[400px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {visibleProducts.map((product) => {
                      const isChecked = selectedProductIds.includes(product.id)
                      const isOtherCategory = product.category !== activeCategory.name && product.category !== "Uncategorized" && product.category !== ""

                      return (
                        <label
                          key={product.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
                            isChecked
                              ? "border-[#111827] bg-[#f8fafc]"
                              : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => toggleProduct(product.id, e.target.checked)}
                            className="mt-1 h-4 w-4 accent-[#111827]"
                          />
                          <div className="flex-1">
                            <p className="text-[14px] font-medium text-[#0f172a]">{product.name}</p>
                            <p className="mt-1 text-[12px] text-[#64748b]">
                              {isChecked 
                                ? "Will be in this category" 
                                : isOtherCategory 
                                  ? `Currently in: ${product.category}` 
                                  : "Uncategorized"}
                            </p>
                          </div>
                        </label>
                      )
                    })}
                    {visibleProducts.length === 0 && (
                      <div className="col-span-full py-8 text-center text-[14px] text-[#64748b]">
                        No products match your search.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#e5e7eb] flex justify-end">
                  <button
                    type="submit"
                    className="rounded-2xl bg-[#111827] px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#111827]/90"
                  >
                    Save category assignments
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
