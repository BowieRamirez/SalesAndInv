import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { MOCK_PRODUCTS } from "@furnitrack/db"
import { Navbar } from "../../../components/Navbar"
import { Footer } from "../../../components/Footer"
import { ProductCard } from "../../../components/ProductCard"
import { ProductClient } from "./ProductClient"

interface ProductPageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }))
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = MOCK_PRODUCTS.find((p) => p.slug === params.slug)
  if (!product) notFound()

  const related = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4)

  return (
    <div className="min-h-screen bg-[--color-beige] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[--color-muted] mb-8">
          <Link href="/" className="hover:text-[--color-charcoal] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-[--color-charcoal] transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-[--color-charcoal] transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[--color-charcoal] font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Product layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-16">
          {/* Image — 60% */}
          <div className="md:col-span-3">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white shadow-sm border border-[--color-beige]">
              <Image
                src={`https://placehold.co/800x600/f5f0e8/2d2d2d?text=${encodeURIComponent(product.name)}`}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Thumbnail strip */}
            <div className="flex gap-3 mt-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 cursor-pointer ${
                    i === 1 ? "border-[--color-navy]" : "border-[--color-beige] hover:border-[--color-muted]"
                  }`}
                >
                  <Image
                    src={`https://placehold.co/160x128/f5f0e8/2d2d2d?text=View+${i}`}
                    alt={`View ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Details — 40% */}
          <div className="md:col-span-2">
            <ProductClient product={product} />
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[--color-charcoal]">
                You May Also Like
              </h2>
              <Link
                href={`/shop?category=${encodeURIComponent(product.category)}`}
                className="text-sm text-[--color-navy] hover:underline"
              >
                View all {product.category} →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
