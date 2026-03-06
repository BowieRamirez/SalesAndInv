import Image from "next/image"
import Link from "next/link"
import { Truck, ShieldCheck, RefreshCw, Headphones, ArrowRight } from "lucide-react"
import { MOCK_PRODUCTS } from "@furnitrack/db"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { ProductCard } from "../components/ProductCard"

const trustItems = [
  { icon: Truck, label: "Free Shipping", sub: "On orders ₱5,000+" },
  { icon: ShieldCheck, label: "5-Year Warranty", sub: "On all furniture" },
  { icon: RefreshCw, label: "60-Day Returns", sub: "Easy & hassle-free" },
  { icon: Headphones, label: "24/7 Support", sub: "Expert assistance" },
]

const heroCards = [
  {
    label: "Living Room",
    tag: "New Collection",
    img: "https://placehold.co/800x600/1a1a2e/ffffff?text=Living+Room",
    href: "/shop?category=Living+Room",
  },
  {
    label: "Bedroom",
    tag: "Trending",
    img: "https://placehold.co/400x300/c9a84c/ffffff?text=Bedroom",
    href: "/shop?category=Bedroom",
  },
  {
    label: "Office",
    tag: "Work Smarter",
    img: "https://placehold.co/400x300/2d2d2d/ffffff?text=Office",
    href: "/shop?category=Office",
  },
  {
    label: "Limited Time",
    tag: "Up to 30% Off",
    img: "https://placehold.co/400x300/e74c3c/ffffff?text=Sale",
    href: "/shop?badge=SALE",
    isSale: true,
  },
]

export default function HomePage() {
  const newArrivals = MOCK_PRODUCTS.slice(0, 4)
  const curatedForYou = MOCK_PRODUCTS.slice(4, 8)
  const trendingNow = MOCK_PRODUCTS.slice(2, 6)

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">

        {/* ===== HERO SECTION ===== */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Main hero card */}
            <div className="relative rounded-2xl overflow-hidden min-h-[360px] lg:min-h-[480px] bg-[--color-navy] flex items-end p-8">
              <Image
                src={heroCards[0].img}
                alt="Living Room Collection"
                fill
                className="object-cover opacity-60"
              />
              <div className="relative z-10">
                <p className="text-[--color-gold] text-sm font-medium mb-2">
                  {heroCards[0].tag}
                </p>
                <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight mb-4">
                  Design Your<br />Perfect Space
                </h1>
                <p className="text-white/70 text-sm mb-6 max-w-xs">
                  Inspiration and curated picks for every room. Explore our collections.
                </p>
                <div className="flex gap-3">
                  <Link
                    href="/shop"
                    className="bg-[--color-gold] text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-[--color-gold]/90 transition-colors"
                  >
                    Shop Now
                  </Link>
                  <Link
                    href="/sign-in"
                    className="border border-white/40 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>

            {/* Right 3-card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {heroCards.slice(1).map((card) => (
                <Link
                  key={card.label}
                  href={card.href}
                  className="relative rounded-xl overflow-hidden min-h-[152px] flex items-end p-5 group"
                >
                  <Image
                    src={card.img}
                    alt={card.label}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="relative z-10">
                    {card.isSale && (
                      <span className="block text-[--color-gold] text-xs font-semibold mb-1">
                        {card.tag}
                      </span>
                    )}
                    <p className="text-white font-semibold text-lg">{card.label}</p>
                    {!card.isSale && (
                      <p className="text-white/70 text-xs">{card.tag}</p>
                    )}
                    {card.isSale && (
                      <span className="inline-block mt-2 bg-[--color-coral] text-white text-xs px-3 py-1 rounded-md">
                        Shop Sale
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TRUST BAR ===== */}
        <section className="bg-[--color-beige] border-y border-[--color-beige]">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trustItems.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-[--color-navy]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[--color-navy]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[--color-charcoal]">{label}</p>
                    <p className="text-xs text-[--color-muted]">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== NEW ARRIVALS ===== */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[--color-charcoal]">New Arrivals</h2>
            <Link href="/shop" className="text-sm text-[--color-navy] hover:text-[--color-gold] flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ===== MID-PAGE CTA ===== */}
        <section className="bg-[--color-navy] mx-6 lg:mx-auto lg:max-w-7xl rounded-2xl overflow-hidden my-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-1 px-10 py-12">
              <p className="text-[--color-gold] text-sm font-medium mb-2 uppercase tracking-wide">
                Curated Spaces
              </p>
              <h2 className="text-white text-3xl font-bold mb-4 leading-snug">
                Effortless style,<br />every room.
              </h2>
              <p className="text-white/60 text-sm mb-6 max-w-xs">
                Get personalized recommendations based on your style and space.
              </p>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 bg-[--color-gold] text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-[--color-gold]/90 transition-colors"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="hidden md:block flex-1 relative min-h-[280px]">
              <Image
                src="https://placehold.co/600x280/c9a84c/ffffff?text=Curated+Spaces"
                alt="Curated spaces"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* ===== CURATED FOR YOU ===== */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[--color-charcoal]">Curated For You</h2>
            <Link href="/shop" className="text-sm text-[--color-navy] hover:text-[--color-gold] flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {curatedForYou.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ===== TRENDING NOW ===== */}
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[--color-charcoal]">Trending Now</h2>
            <Link href="/shop" className="text-sm text-[--color-navy] hover:text-[--color-gold] flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingNow.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ===== BOTTOM CTA ===== */}
        <section className="relative bg-[--color-charcoal] text-white text-center py-20 px-6">
          <Image
            src="https://placehold.co/1440x400/1a1a2e/ffffff?text="
            alt=""
            fill
            className="object-cover opacity-30"
          />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Unlock the Full Experience
            </h2>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              Create an account to save favorites, track orders, and get personalized recommendations.
            </p>
            <Link
              href="/sign-up"
              className="inline-block bg-white text-[--color-navy] px-8 py-3 rounded-md font-semibold hover:bg-[--color-beige] transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
