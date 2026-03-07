import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles, Star, Flame } from "lucide-react"
import { MOCK_PRODUCTS } from "@furnitrack/db"
import { Footer } from "../components/Footer"
import { ProductCard } from "../components/ProductCard"

export default function HomePage() {
  const newArrivals = MOCK_PRODUCTS.slice(0, 4)
  const curatedForYou = MOCK_PRODUCTS.slice(4, 8)

  return (
    <div className="bg-white min-h-screen font-['var(--font-inter)'] relative">
      <main className="flex flex-col items-center">
        
        {/* ===== HERO SECTION ===== */}
        <section className="w-full max-w-[1336px] mx-auto px-6 pt-[24px]">
          <div className="grid lg:grid-cols-[662px_minmax(0,1fr)] gap-[12px] lg:auto-rows-[412px]">
            {/* Left Main Hero */}
            <div className="relative h-[412px] w-full overflow-hidden">
              <Image 
                src="https://placehold.co/800x600/1a1a2e/ffffff?text=Design+Your+Perfect+Space" 
                alt="Living Room Collection" 
                fill 
                className="object-cover pointer-events-none" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
              <div className="absolute inset-0 flex flex-col justify-between p-[32px]">
                <div className="bg-white/15 px-[12px] py-[6px] w-max">
                  <span className="font-normal text-[10px] text-white tracking-[2px] uppercase leading-[15px]">
                    New Collection 2026
                  </span>
                </div>
                <div className="w-full max-w-[598px]">
                  <h1 className="text-white text-[40px] leading-[44px] mb-[12px]">
                    <span className="font-[family-name:var(--font-playfair)] font-medium block">Design Your</span>
                    <span className="font-[family-name:var(--font-playfair)] font-medium italic block">Perfect Space</span>
                  </h1>
                  <p className="font-normal text-[13px] text-white/60 leading-[19.5px] max-w-[355px] mb-[20px]">
                    Handcrafted furniture for every room. Explore our curated collections.
                  </p>
                  <div className="flex items-center gap-[10px]">
                    <Link href="/shop" className="bg-white text-[#1a1a2e] px-[20px] py-[11px] font-normal text-[13px] leading-[19.5px] flex items-center gap-[10px]">
                      Shop Now <ArrowRight className="w-[14px] h-[14px]" />
                    </Link>
                    <button className="border-[1.25px] border-white/30 text-white px-[21px] py-[11px] font-medium text-[13px] leading-[19.5px]">
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Grid */}
            <div className="grid grid-cols-2 grid-rows-2 gap-[12px] h-[412px]">
              {/* Bedroom */}
              <Link href="/shop?category=Bedroom" className="relative group overflow-hidden block h-full w-full">
                <Image src="https://placehold.co/400x300/a39276/ffffff?text=Bedroom" fill className="object-cover" alt="Bedroom" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute left-[20px] bottom-[20px] flex flex-col">
                  <span className="font-normal text-[10px] text-white/60 tracking-[1.5px] uppercase leading-[15px]">Collection</span>
                  <h3 className="font-medium text-[16px] text-white leading-[24px]">Bedroom</h3>
                  <span className="font-normal text-[11px] text-white/50 leading-[16.5px] flex items-center gap-1 mt-1 group-hover:text-white transition-colors">
                    Explore <ArrowRight className="w-[12px] h-[12px]" />
                  </span>
                </div>
              </Link>
              {/* Dining */}
              <Link href="/shop?category=Dining" className="relative group overflow-hidden block h-full w-full">
                <Image src="https://placehold.co/400x300/6b705c/ffffff?text=Dining" fill className="object-cover" alt="Dining" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute left-[20px] bottom-[20px] flex flex-col">
                  <span className="font-normal text-[10px] text-white/60 tracking-[1.5px] uppercase leading-[15px]">Collection</span>
                  <h3 className="font-medium text-[16px] text-white leading-[24px]">Dining</h3>
                  <span className="font-normal text-[11px] text-white/50 leading-[16.5px] flex items-center gap-1 mt-1 group-hover:text-white transition-colors">
                    Explore <ArrowRight className="w-[12px] h-[12px]" />
                  </span>
                </div>
              </Link>
              {/* Office */}
              <Link href="/shop?category=Office" className="relative group overflow-hidden block h-full w-full">
                <Image src="https://placehold.co/400x300/4a4e69/ffffff?text=Office" fill className="object-cover" alt="Office" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute left-[20px] bottom-[20px] flex flex-col">
                  <span className="font-normal text-[10px] text-white/60 tracking-[1.5px] uppercase leading-[15px]">Collection</span>
                  <h3 className="font-medium text-[16px] text-white leading-[24px]">Office</h3>
                  <span className="font-normal text-[11px] text-white/50 leading-[16.5px] flex items-center gap-1 mt-1 group-hover:text-white transition-colors">
                    Explore <ArrowRight className="w-[12px] h-[12px]" />
                  </span>
                </div>
              </Link>
              {/* Sale CTA */}
              <div className="bg-[#1a1a2e] relative overflow-hidden flex flex-col items-center justify-center p-6 text-center h-full">
                <Flame className="w-[28px] h-[28px] text-[#fb2c36] mb-3" />
                <span className="font-normal text-[10px] text-white/50 tracking-[2px] uppercase leading-[15px]">Limited Time</span>
                <h3 className="font-medium text-[22px] text-white leading-[33px]">Up to 30% Off</h3>
                <p className="font-normal text-[11px] text-white/40 leading-[16.5px] mb-4">On select pieces</p>
                <Link href="/shop?badge=SALE" className="bg-white/10 border-[1.25px] border-white/20 text-white font-normal text-[11px] px-[16px] py-[8px] flex items-center gap-2 hover:bg-white/20 transition-colors">
                  Shop Sale <ArrowRight className="w-[12px] h-[12px]" />
                </Link>
              </div>
            </div>
          </div>
        </section>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={{...product, badge: 'HOT'}} /> 
            ))}
          </div>
        </section>

        {/* ===== MID-PAGE CTA ===== */}
        <section className="w-full max-w-[1336px] mx-auto px-6 py-[40px]">
          <div className="flex flex-col lg:flex-row h-auto lg:h-[300px]">
             {/* Left Text Block */}
             <div className="bg-[#f5f0eb] w-full lg:w-[527px] shrink-0 p-[40px] flex flex-col justify-center">
                <span className="font-normal text-[10px] text-[#99a1af] uppercase tracking-[2px] leading-[15px] mb-4">The MAISON Edit</span>
                <h2 className="text-[#1a1a2e] text-[28px] leading-[33.6px] mb-6">
                  <span className="font-[family-name:var(--font-playfair)] font-medium block">Curated spaces,</span>
                  <span className="font-[family-name:var(--font-playfair)] font-medium italic block">effortless style</span>
                </h2>
                <p className="font-normal text-[13px] text-[#6a7282] leading-[19.5px] max-w-[367px] mb-[20px]">
                  Sign in to unlock personalized recommendations, advanced filters, and save your favorites to a wishlist.
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
               <Image src="https://placehold.co/800x400/9e9282/ffffff?text=Maison+Edit" className="object-cover" fill alt="Maison Edit" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
              {curatedForYou.map((product) => (
                <ProductCard key={product.id} product={{...product, badge: 'BEST_SELLER'}} />
              ))}
            </div>
          </section>
        </div>

      </main>
      <Footer />
    </div>
  )
}
