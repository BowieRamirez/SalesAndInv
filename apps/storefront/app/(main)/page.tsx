import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles, Star } from "lucide-react"
import { getStorefrontProducts } from "@furnitrack/db"
import { Footer } from "../../components/Footer"
import { ProductCard } from "../../components/ProductCard"
import { LandingAccordionItem } from "../../components/ui/interactive-image-accordion"

export default async function HomePage() {
  const products = await getStorefrontProducts()
  const newArrivals = products.slice(0, 4)
  const curatedForYou = products.slice(4, 8)

  return (
    <div className="bg-white min-h-screen font-['var(--font-inter)'] relative flex flex-col items-center">
        <div className="w-full pt-[24px]">
          <LandingAccordionItem />
        </div>

        {/* ===== TRUST BAR ===== */}
        <section className="w-full max-w-[1336px] mx-auto px-6 py-[40px]">
          <div className="flex flex-wrap lg:flex-nowrap justify-between items-center gap-[12px] w-full">
            <span className="flex items-center gap-[6px]">
              <span className="text-[14px]">🚚</span>
              <span className="font-normal text-[12px] text-[#99a1af] leading-[18px]">Free shipping on $500+</span>
            </span>
            <span className="flex items-center gap-[6px]">
              <span className="text-[14px]">🛡️</span>
              <span className="font-normal text-[12px] text-[#99a1af] leading-[18px]">5-year warranty</span>
            </span>
            <span className="flex items-center gap-[6px]">
              <span className="text-[14px]">↩️</span>
              <span className="font-normal text-[12px] text-[#99a1af] leading-[18px]">30-day easy returns</span>
            </span>
            <span className="flex items-center gap-[6px]">
              <span className="text-[14px]">💬</span>
              <span className="font-normal text-[12px] text-[#99a1af] leading-[18px]">24/7 expert support</span>
            </span>
          </div>
        </section>

        {/* ===== NEW ARRIVALS ===== */}
        <section className="w-full max-w-[1336px] mx-auto px-6 pb-[40px] flex flex-col gap-[28px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[12px]">
              <div className="w-[36px] h-[36px] bg-[#ecfdf5] flex items-center justify-center shrink-0">
                <Sparkles className="w-[18px] h-[18px] text-[#00bc7d]" />
              </div>
              <div className="flex flex-col">
                <h2 className="font-[family-name:var(--font-playfair)] font-medium text-[18px] text-[#1a1a2e] leading-[27px]">New Arrivals</h2>
                <p className="font-normal text-[11px] text-[#99a1af] leading-[16.5px]">Fresh additions to our collection</p>
              </div>
            </div>
            <Link href="/shop" className="font-normal text-[13px] text-[#1a1a2e] flex items-center gap-2 group hover:text-black/60 transition-colors">
              View All <ArrowRight className="w-[16px] h-[16px] group-hover:translate-x-1" />
            </Link>
          </div>
          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={{ ...product, badge: "HOT" }} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-[#d1d5dc] bg-[#f9fafb] px-6 py-10 text-center text-[13px] text-[#6a7282]">
              No live catalog products are available in Neon yet.
            </div>
          )}
        </section>

        {/* ===== MID-PAGE CTA ===== */}
        <section className="w-full max-w-[1336px] mx-auto px-6 py-[40px]">
          <div className="flex flex-col lg:flex-row h-auto lg:h-[300px]">
             {/* Left Text Block */}
             <div className="bg-[#f5f0eb] w-full lg:w-[527px] shrink-0 p-[40px] flex flex-col justify-center">
                <span className="font-normal text-[10px] text-[#99a1af] uppercase tracking-[2px] leading-[15px] mb-4">The Office Edit</span>
                <h2 className="text-[#1a1a2e] text-[28px] leading-[33.6px] mb-6">
                  <span className="font-[family-name:var(--font-playfair)] font-medium block">Work-ready tables,</span>
                  <span className="font-[family-name:var(--font-playfair)] font-medium italic block">storage that fits</span>
                </h2>
                <p className="font-normal text-[13px] text-[#6a7282] leading-[19.5px] max-w-[367px] mb-[20px]">
                  Find office tables, pedestals, cabinets, and compact storage made for productive workspaces.
                </p>
                <div className="flex items-center gap-3">
                  <Link href="/sign-in" className="bg-[#1a1a2e] text-white px-[20px] py-[11px] font-medium text-[13px] leading-[19.5px] flex items-center gap-2 w-max transition-colors hover:bg-[#1a1a2e]/90">
                    Sign In <ArrowRight className="w-[14px] h-[14px]" />
                  </Link>
                  <Link href="/shop" className="border-[1.25px] border-[#1a1a2e]/20 text-[#1a1a2e] px-[25px] py-[11px] font-normal text-[13px] leading-[19.5px] transition-colors hover:bg-black/5">
                    Browse
                  </Link>
                </div>
             </div>
             {/* Right Image Block */}
             <div className="w-full lg:flex-1 relative h-[300px] lg:h-auto overflow-hidden lg:ml-[12px] mt-4 lg:mt-0">
               <Image src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1000&auto=format&fit=crop&q=80" className="object-cover" fill alt="Office tables and workspace storage" />
             </div>
          </div>
        </section>

        {/* ===== CURATED FOR YOU ===== */}
        <div className="w-full bg-[#f9fafb]/60 mt-10">
          <section className="w-full max-w-[1336px] mx-auto px-6 py-[40px] flex flex-col gap-[28px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[12px]">
                <div className="w-[36px] h-[36px] bg-[#fffbeb] flex items-center justify-center shrink-0">
                  <Star className="w-[18px] h-[18px] text-[#ffb900]" fill="currentColor" />
                </div>
                <div className="flex flex-col">
                  <h2 className="font-[family-name:var(--font-playfair)] font-medium text-[18px] text-[#1a1a2e] leading-[27px]">Curated For You</h2>
                  <p className="font-normal text-[11px] text-[#99a1af] leading-[16.5px]">Top-rated pieces our customers love</p>
                </div>
              </div>
              <Link href="/shop" className="font-normal text-[13px] text-[#1a1a2e] flex items-center gap-2 group hover:text-black/60 transition-colors">
                View All <ArrowRight className="w-[16px] h-[16px] group-hover:translate-x-1" />
              </Link>
            </div>
            {curatedForYou.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                {curatedForYou.map((product) => (
                  <ProductCard key={product.id} product={{ ...product, badge: "BEST_SELLER" }} />
                ))}
              </div>
            ) : null}
          </section>
        </div>

      <Footer />
    </div>
  )
}
