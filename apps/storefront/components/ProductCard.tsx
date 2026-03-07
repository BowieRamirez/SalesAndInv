import Link from "next/link"
import Image from "next/image"
import type { Product } from "@furnitrack/validators"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  // Map our badges to Figma colors
  let badgeLabel = null
  let badgeStyle = ""

  if (product.badge === "BEST_SELLER") {
    badgeLabel = "Best Seller"
    badgeStyle = "bg-[#ffb900] text-[#1a1a2e]"
  } else if (product.badge === "SALE") {
    badgeLabel = "Sale"
    badgeStyle = "bg-[#fb2c36] text-white"
  } else if (product.badge === "HOT" || product.badge === "NEW") {
    badgeLabel = "New"
    badgeStyle = "bg-[#00bc7d] text-white"
  }

  // Stock mock
  const stockText = product.stockStatus === "OUT_OF_STOCK" ? "Out of stock" : "9 items left"
  
  // Format price exactly as design (remove decimal for clean presentation if needed, or use full)
  const formatPrice = (p: number) => `$${p.toLocaleString()}`

  return (
    <div className="bg-white border-[#f3f4f6] border-[1.25px] border-solid overflow-clip flex flex-col h-full hover:shadow-md transition-shadow">
      <Link href={`/shop/${product.slug}`} className="block relative h-[180px] shrink-0 w-full overflow-hidden group">
        <Image
          src={`https://placehold.co/400x300/f5f0e8/2d2d2d?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
        />
        {badgeLabel && (
          <div className={`absolute top-[12px] left-[12px] px-2.5 py-1 ${badgeStyle}`}>
            <span className="font-[family-name:var(--font-inter)] font-normal text-[10px] uppercase tracking-[0.25px] leading-[15px]">
              {badgeLabel}
            </span>
          </div>
        )}
      </Link>
      
      <div className="flex flex-col gap-[10px] p-[16px] flex-1">
        <div className="flex items-center justify-between">
          <p className="font-[family-name:var(--font-inter)] font-normal text-[#99a1af] text-[11px] uppercase tracking-[0.55px] leading-[16.5px]">
            {product.category || "Living Room"}
          </p>
          <p className="font-[family-name:var(--font-inter)] font-normal text-[#99a1af] text-[11px] uppercase tracking-[0.55px] leading-[16.5px]">
            MAISON
          </p>
        </div>
        
        <h3 className="font-[family-name:var(--font-inter)] font-medium text-[#1a1a2e] text-[13px] leading-[19.5px] line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-[8px]">
            <span className="font-[family-name:var(--font-inter)] font-normal text-[#fb2c36] text-[14px] leading-[21px]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-[family-name:var(--font-inter)] font-normal text-[#d1d5dc] text-[12px] leading-[18px] line-through decoration-solid">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <span className="font-[family-name:var(--font-inter)] font-normal text-[#99a1af] text-[11px] leading-[16.5px]">
            {stockText}
          </span>
        </div>
      </div>
    </div>
  )
}
