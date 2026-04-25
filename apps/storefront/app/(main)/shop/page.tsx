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
  const initialQuery = readStringParam(resolvedSearchParams.q)?.trim() ?? ""
  const initialMaxPriceParam = Number(readStringParam(resolvedSearchParams.maxPrice) ?? "90000")
  const initialMaxPrice = Number.isFinite(initialMaxPriceParam) ? initialMaxPriceParam : 90000
  const activeCategoryLabel =
    initialCategories.length === 1 ? initialCategories[0] : "Office Furniture"

  return (
    <div className="flex min-h-screen flex-col bg-[--color-beige]">
      <div className="relative h-48 overflow-hidden bg-[--color-navy] md:h-64">
        <Image
          src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1800&auto=format&fit=crop&q=80"
          alt="Office tables, workstations, and storage furniture"
          fill
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-[#1a1a2e]/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <p className="mb-3 text-[10px] font-semibold uppercase leading-none tracking-[2px] text-[--color-gold]">
            What we sell
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-medium leading-tight text-white md:text-5xl">
            Office Furniture
          </h1>
          <p className="mt-3 max-w-xl text-xs font-medium uppercase leading-5 tracking-[2px] text-white/75">
            Tables, Pedestals, Cabinets, Storage
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1536px] px-4 py-4 md:px-8">
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
        initialQuery={initialQuery}
        initialMaxPrice={initialMaxPrice}
      />

      <Footer />
    </div>
  )
}
