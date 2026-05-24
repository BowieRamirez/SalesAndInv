import Link from "next/link"
import Image from "next/image"
import type { Product } from "@furnitrack/validators"
import { InquiryButton } from "./InquiryButton"
import { formatPeso } from "@/lib/format"

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

  const stockText =
    product.availableQty > 0
      ? `${product.availableQty} item${product.availableQty === 1 ? "" : "s"} left`
      : "Made to order"
  
  return (
    <div className="bg-white border-[#f3f4f6] border-[1.25px] border-solid overflow-clip flex flex-col h-full hover:shadow-md transition-shadow">
      <Link href={`/shop/${product.slug}`} className="block relative h-[200px] shrink-0 w-full overflow-hidden group">
        <Image
          src={product.images[0] ?? `https://placehold.co/400x300/f5f0e8/2d2d2d?text=${encodeURIComponent(product.name)}`}
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
      
      <div className="flex flex-col gap-[12px] p-[18px] flex-1">
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
          <div className="flex flex-col gap-[2px]">
            <span className="font-[family-name:var(--font-inter)] font-normal text-[#99a1af] text-[10px] uppercase tracking-[0.4px] leading-[15px]">
              Starts at
            </span>
            <div className="flex items-center gap-[8px]">
              <span className="font-[family-name:var(--font-inter)] font-normal text-[#fb2c36] text-[14px] leading-[21px]">
                {formatPeso(product.price)}
              </span>
              {product.originalPrice && (
                <span className="font-[family-name:var(--font-inter)] font-normal text-[#d1d5dc] text-[12px] leading-[18px] line-through decoration-solid">
                  {formatPeso(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
          <span className="font-[family-name:var(--font-inter)] font-normal text-[#99a1af] text-[11px] leading-[16.5px]">
            {stockText}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <InquiryButton
            productId={product.id}
            productName={product.name}
            className="font-[family-name:var(--font-inter)] inline-flex items-center gap-[8px] rounded-[8px] bg-[#1a1a2e] px-[12px] py-[10px] text-[12px] font-medium text-white transition-colors hover:bg-[#1a1a2e]/90"
          />
          <Link
            href={`/shop/${product.slug}`}
            className="font-[family-name:var(--font-inter)] inline-flex items-center justify-center rounded-[8px] border border-[#d1d5dc] px-[12px] py-[10px] text-[12px] font-medium text-[#1a1a2e] transition-colors hover:bg-[#f9fafb]"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  )
}
