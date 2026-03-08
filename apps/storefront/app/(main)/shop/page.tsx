import Image from "next/image"
import Link from "next/link"
import { ChevronRight, SlidersHorizontal } from "lucide-react"
import { MOCK_PRODUCTS } from "@furnitrack/db"
import { Footer } from "../../../components/Footer"
import { ProductCard } from "../../../components/ProductCard"

const CATEGORIES = ["Living Room", "Bedroom", "Dining", "Office", "Storage", "Lighting"]
const MATERIALS = ["Solid Oak", "Solid Wood", "Engineered Wood", "MDF", "Fabric / Solid Wood", "Steel / Solid Wood", "Tempered Glass / Steel", "Metal / Glass", "Mahogany", "Metal"]
const COLORS = [
  { name: "Natural", hex: "#c9a84c" },
  { name: "Dark", hex: "#3d2b1f" },
  { name: "White", hex: "#f8f8f8" },
  { name: "Grey", hex: "#b0afa8" },
  { name: "Navy", hex: "#1e3a5f" },
  { name: "Black", hex: "#1a1a1a" },
]

function getCategoryCounts() {
  return CATEGORIES.map((cat) => ({
    name: cat,
    count: MOCK_PRODUCTS.filter((p) => p.category === cat).length,
  }))
}

export default function ShopPage({
  searchParams,
}: {
  searchParams?: { category?: string; sort?: string }
}) {
  const selectedCategory = searchParams?.category ?? null
  const sort = searchParams?.sort ?? "default"

  let products = selectedCategory
    ? MOCK_PRODUCTS.filter((p) => p.category === selectedCategory)
    : [...MOCK_PRODUCTS]

  if (sort === "price-asc") products = products.sort((a, b) => a.price - b.price)
  else if (sort === "price-desc") products = products.sort((a, b) => b.price - a.price)

  const categoryCounts = getCategoryCounts()

  return (
    <div className="min-h-screen bg-[--color-beige] flex flex-col">

      {/* Hero Banner */}
      <div className="relative h-48 md:h-64 bg-[--color-navy] overflow-hidden">
        <Image
          src="https://placehold.co/1440x256/1a1a2e/c9a84c?text=Simple+is+More"
          alt="Shop Banner"
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-light italic text-white tracking-wide">
            Simple is More
          </h1>
          <p className="text-[--color-gold] mt-2 text-sm tracking-widest uppercase">
            Furniture Collection
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-4">
        <nav className="flex items-center gap-1.5 text-sm text-[--color-muted]">
          <Link href="/" className="hover:text-[--color-charcoal] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[--color-charcoal] font-medium">
            {selectedCategory ?? "Furniture"}
          </span>
        </nav>
      </div>

      {/* Sort bar */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pb-4">
        <div className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm border border-[--color-beige]">
          <p className="text-sm text-[--color-muted]">
            <span className="font-semibold text-[--color-charcoal]">{products.length}</span>{" "}
            results{selectedCategory ? ` for "${selectedCategory}"` : " for furniture"}
          </p>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[--color-muted]" />
            <label htmlFor="sort" className="text-sm text-[--color-muted]">
              Sort by:
            </label>
            <select
              id="sort"
              defaultValue={sort}
              className="text-sm text-[--color-charcoal] bg-transparent border-none outline-none cursor-pointer"
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pb-16 flex gap-8 flex-1">
        {/* Filter Sidebar */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-[--color-beige] p-5 sticky top-6">
            <h2 className="font-semibold text-[--color-charcoal] text-sm uppercase tracking-wider mb-4">
              Filters
            </h2>

            {/* Category */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-[--color-muted] uppercase tracking-wider mb-3">
                Category
              </h3>
              <div className="space-y-2">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!selectedCategory}
                      className="w-3.5 h-3.5 accent-[--color-navy]"
                      readOnly
                    />
                    <span className="text-sm text-[--color-charcoal] group-hover:text-[--color-navy]">
                      All
                    </span>
                  </div>
                  <span className="text-xs text-[--color-muted]">{MOCK_PRODUCTS.length}</span>
                </label>
                {categoryCounts.map(({ name, count }) => (
                  <Link
                    key={name}
                    href={`/shop?category=${encodeURIComponent(name)}`}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategory === name}
                        className="w-3.5 h-3.5 accent-[--color-navy]"
                        readOnly
                      />
                      <span className="text-sm text-[--color-charcoal] group-hover:text-[--color-navy]">
                        {name}
                      </span>
                    </div>
                    <span className="text-xs text-[--color-muted]">{count}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Material */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-[--color-muted] uppercase tracking-wider mb-3">
                Material
              </h3>
              <div className="space-y-2">
                {MATERIALS.slice(0, 6).map((mat) => (
                  <label key={mat} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-3.5 h-3.5 accent-[--color-navy]"
                    />
                    <span className="text-sm text-[--color-charcoal] group-hover:text-[--color-navy]">
                      {mat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-[--color-muted] uppercase tracking-wider mb-3">
                Price Range
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[--color-muted]">
                  <span>₱0</span>
                  <span>₱50,000+</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50000}
                  defaultValue={50000}
                  className="w-full accent-[--color-navy]"
                />
                <p className="text-xs text-[--color-charcoal] text-center">
                  Up to ₱50,000
                </p>
              </div>
            </div>

            {/* Color */}
            <div>
              <h3 className="text-xs font-semibold text-[--color-muted] uppercase tracking-wider mb-3">
                Color
              </h3>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.name}
                    title={color.name}
                    className="w-6 h-6 rounded-full border-2 border-white shadow hover:scale-110 transition-transform ring-1 ring-[--color-beige]"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-2xl font-light text-[--color-muted] mb-2">No products found</p>
              <Link
                href="/shop"
                className="text-sm text-[--color-navy] underline underline-offset-2"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
