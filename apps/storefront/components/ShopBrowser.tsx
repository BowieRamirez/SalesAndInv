"use client"

import { useDeferredValue, useEffect, useMemo, useState, useTransition } from "react"
import { SlidersHorizontal } from "lucide-react"
import type { Product } from "@furnitrack/validators"
import { ProductCard } from "./ProductCard"
import { formatPeso } from "@/lib/format"

type Facet = {
  name: string
  count: number
}

type ShopBrowserProps = {
  products: Product[]
  initialCategories: string[]
  initialMaterials: string[]
  initialSort: string
  initialMaxPrice: number
}

const MAX_PRICE = 90000

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value]
}

function sortProducts(products: Product[], sort: string) {
  if (sort === "price-asc") {
    return [...products].sort((left, right) => left.price - right.price)
  }

  if (sort === "price-desc") {
    return [...products].sort((left, right) => right.price - left.price)
  }

  return products
}

function getCategoryCounts(products: Product[]): Facet[] {
  return [...new Set(products.map((product) => product.category))]
    .sort((left, right) => left.localeCompare(right))
    .map((category) => ({
      name: category,
      count: products.filter((product) => product.category === category).length,
    }))
}

function getMaterialCounts(products: Product[]): Facet[] {
  return [...new Set(products.map((product) => product.material))]
    .sort((left, right) => left.localeCompare(right))
    .map((material) => ({
      name: material,
      count: products.filter((product) => product.material === material).length,
    }))
}

export function ShopBrowser({
  products,
  initialCategories,
  initialMaterials,
  initialSort,
  initialMaxPrice,
}: ShopBrowserProps) {
  const [selectedCategories, setSelectedCategories] = useState(initialCategories)
  const [selectedMaterials, setSelectedMaterials] = useState(initialMaterials)
  const [sort, setSort] = useState(initialSort)
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice)
  const deferredMaxPrice = useDeferredValue(maxPrice)
  const [, startTransition] = useTransition()

  const categoryCounts = useMemo(() => getCategoryCounts(products), [products])
  const materialCounts = useMemo(() => getMaterialCounts(products), [products])

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category)
      const matchesMaterial =
        selectedMaterials.length === 0 || selectedMaterials.includes(product.material)
      const matchesPrice = product.price <= deferredMaxPrice

      return matchesCategory && matchesMaterial && matchesPrice
    })

    return sortProducts(filtered, sort)
  }, [deferredMaxPrice, products, selectedCategories, selectedMaterials, sort])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams()

      if (selectedCategories.length > 0) {
        params.set("category", selectedCategories.join(","))
      }

      if (selectedMaterials.length > 0) {
        params.set("material", selectedMaterials.join(","))
      }

      if (sort !== "default") {
        params.set("sort", sort)
      }

      if (maxPrice < MAX_PRICE) {
        params.set("maxPrice", String(maxPrice))
      }

      const query = params.toString()
      const nextUrl = query ? `/shop?${query}` : "/shop"

      startTransition(() => {
        window.history.replaceState(null, "", nextUrl)
      })
    }, 120)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [maxPrice, selectedCategories, selectedMaterials, sort])

  const activeCategoryLabel = selectedCategories.length === 1 ? selectedCategories[0] : null

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pb-4 md:px-8">
        <div className="flex items-center justify-between rounded-lg border border-[--color-beige] bg-white px-4 py-3 shadow-sm">
          <p className="text-sm text-[--color-muted]">
            <span className="font-semibold text-[--color-charcoal]">{filteredProducts.length}</span>{" "}
            results{activeCategoryLabel ? ` for "${activeCategoryLabel}"` : " for furniture"}
          </p>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[--color-muted]" />
            <label htmlFor="sort" className="text-sm text-[--color-muted]">
              Sort by:
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="cursor-pointer border-none bg-transparent text-sm text-[--color-charcoal] outline-none"
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 pb-16 md:px-8">
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-6 rounded-lg border border-[--color-beige] bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[--color-charcoal]">
              Filters
            </h2>

            <div className="mb-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[--color-muted]">
                Category
              </h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategories([])}
                  className="flex w-full items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.length === 0}
                      readOnly
                      className="h-3.5 w-3.5 accent-[--color-navy]"
                    />
                    <span className="text-sm text-[--color-charcoal]">All</span>
                  </div>
                  <span className="text-xs text-[--color-muted]">{products.length}</span>
                </button>

                {categoryCounts.map(({ name, count }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedCategories((current) => toggleValue(current, name))}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(name)}
                        readOnly
                        className="h-3.5 w-3.5 accent-[--color-navy]"
                      />
                      <span className="text-sm text-[--color-charcoal]">{name}</span>
                    </div>
                    <span className="text-xs text-[--color-muted]">{count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[--color-muted]">
                Material
              </h3>
              <div className="space-y-2">
                {materialCounts.map(({ name, count }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedMaterials((current) => toggleValue(current, name))}
                    className="flex w-full items-start justify-between gap-3 text-left"
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(name)}
                        readOnly
                        className="mt-1 h-3.5 w-3.5 accent-[--color-navy]"
                      />
                      <span className="text-sm text-[--color-charcoal]">{name}</span>
                    </div>
                    <span className="text-xs text-[--color-muted]">{count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[--color-muted]">
                Price Range
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[--color-muted]">
                  <span>{formatPeso(0)}</span>
                  <span>{formatPeso(MAX_PRICE)}+</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={MAX_PRICE}
                  step={1000}
                  value={Math.min(maxPrice, MAX_PRICE)}
                  onChange={(event) => setMaxPrice(Number(event.target.value))}
                  className="w-full accent-[--color-navy]"
                />
                <p className="text-center text-xs text-[--color-charcoal]">
                  Up to {formatPeso(Math.min(maxPrice, MAX_PRICE))}
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="mb-2 text-2xl font-light text-[--color-muted]">No products found</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategories([])
                  setSelectedMaterials([])
                  setSort("default")
                  setMaxPrice(MAX_PRICE)
                }}
                className="text-sm text-[--color-navy] underline underline-offset-2"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
