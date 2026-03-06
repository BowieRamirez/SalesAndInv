import Link from "next/link"
import Image from "next/image"
import { Badge } from "@furnitrack/ui"
import type { Product } from "@furnitrack/validators"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const badgeVariant =
    product.badge === "BEST_SELLER"
      ? "BEST_SELLER"
      : product.badge === "SALE"
        ? "SALE"
        : product.badge === "HOT"
          ? "HOT"
          : null

  const stockVariant =
    product.stockStatus === "OUT_OF_STOCK"
      ? "OUT_OF_STOCK"
      : product.stockStatus === "LOW_STOCK"
        ? "LOW_STOCK"
        : null

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-[--color-beige] hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-[--color-beige] overflow-hidden">
          <Image
            src={`https://placehold.co/400x300/f5f0e8/2d2d2d?text=${encodeURIComponent(product.name)}`}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {badgeVariant && <Badge variant={badgeVariant} />}
            {stockVariant && <Badge variant={stockVariant} />}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-[--color-muted] mb-1">{product.category}</p>
          <h3 className="font-medium text-[--color-charcoal] text-sm leading-snug mb-2 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[--color-coral] font-bold">
              ₱{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-[--color-muted] text-sm line-through">
                ₱{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {/* Rating */}
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-[--color-gold] text-xs">{"★".repeat(Math.round(product.rating))}</span>
            <span className="text-[--color-muted] text-xs">({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
