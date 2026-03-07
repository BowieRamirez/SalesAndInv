import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { MOCK_PRODUCTS } from "@furnitrack/db"
import { Footer } from "../../../components/Footer"
import { ProductCard } from "../../../components/ProductCard"
import { ProductClient } from "./ProductClient"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === resolvedParams.slug)
  if (!product) notFound()

  const related = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4)

  return (
    <div className="min-h-screen bg-white flex flex-col font-['var(--font-inter)']">
      <main className="flex-1 max-w-[1336px] mx-auto w-full px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-[6px] text-[13px] text-[#6a7282] mb-[32px]">
          <Link href="/" className="hover:text-[#1a1a2e] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-[12px] h-[12px]" />
          <Link href="/shop" className="hover:text-[#1a1a2e] transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-[12px] h-[12px]" />
          <Link
            href={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-[#1a1a2e] transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-[12px] h-[12px]" />
          <span className="text-[#1a1a2e] font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Product layout */}
        <div className="flex flex-col md:flex-row gap-[40px] lg:gap-[92px] mb-[128px]">
          {/* Image — Left */}
          <div className="flex-1">
            <div className="relative w-full aspect-square rounded-[12px] overflow-hidden bg-[#f9fafb] border border-[#e5e7eb]">
              <Image
                src={`https://placehold.co/800x800/f5f0e8/2d2d2d?text=${encodeURIComponent(product.name)}`}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Details — Right */}
          <div className="flex-1 flex flex-col justify-center">
            <ProductClient product={product} />
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mb-[64px]">
            <h2 className="text-[32px] font-medium font-['var(--font-playfair)'] text-[#1a1a2e] leading-[38.4px] mb-[40px]">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[24px]">
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
