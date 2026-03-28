import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getStorefrontProducts } from "@furnitrack/db"
import { Footer } from "../../../components/Footer"
import { ShopBrowser } from "../../../components/ShopBrowser"

type ShopPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function readListParam(value?: string | string[]) {
  const raw = Array.isArray(value) ? value[0] : value

  if (!raw) {
    return []
  }

  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function readStringParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

export const dynamic = "force-dynamic"

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const products = await getStorefrontProducts()

  const initialCategories = readListParam(resolvedSearchParams.category)
  const initialMaterials = readListParam(resolvedSearchParams.material)
  const initialSort = readStringParam(resolvedSearchParams.sort) ?? "default"
  const initialMaxPriceParam = Number(readStringParam(resolvedSearchParams.maxPrice) ?? "90000")
  const initialMaxPrice = Number.isFinite(initialMaxPriceParam) ? initialMaxPriceParam : 90000
  const activeCategoryLabel = initialCategories.length === 1 ? initialCategories[0] : "Furniture"

  return (
    <div className="flex min-h-screen flex-col bg-[--color-beige]">
      <div className="relative h-48 overflow-hidden bg-[--color-navy] md:h-64">
        <Image
          src="https://placehold.co/1440x256/1a1a2e/c9a84c?text=Simple+is+More"
          alt="Shop Banner"
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-light italic tracking-wide text-white md:text-5xl">
            Simple is More
          </h1>
          <p className="mt-2 text-sm uppercase tracking-widest text-[--color-gold]">
            Furniture Collection
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-8">
        <nav className="flex items-center gap-1.5 text-sm text-[--color-muted]">
          <Link href="/" className="transition-colors hover:text-[--color-charcoal]">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-[--color-charcoal]">{activeCategoryLabel}</span>
        </nav>
      </div>

      <ShopBrowser
        products={products}
        initialCategories={initialCategories}
        initialMaterials={initialMaterials}
        initialSort={initialSort}
        initialMaxPrice={initialMaxPrice}
      />

      <Footer />
    </div>
  )
}
