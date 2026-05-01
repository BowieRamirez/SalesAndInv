"use client"

import { useState } from "react"
import { RotateCcw, ShieldCheck, Truck } from "lucide-react"
import type { Product } from "@furnitrack/validators"
import { InquiryButton } from "../../../../components/InquiryButton"
import { formatPeso } from "@/lib/format"

interface ProductClientProps {
  product: Product
}

export function ProductClient({ product }: ProductClientProps) {
  const [selectedColor, setSelectedColor] = useState(
    product.colorVariants[0] ?? { name: "Standard", hex: "#c9a96e" },
  )
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">(
    "description",
  )

  const savings = product.originalPrice ? product.originalPrice - product.price : null

  return (
    <div className="flex flex-col font-[family-name:var(--font-inter)]">
      {product.badge && (
        <div className="mb-[12px] inline-flex w-max items-center justify-center rounded-[100px] bg-[#ffefc6] px-[12px] py-[4px]">
          <span className="text-[10px] font-bold uppercase tracking-[0.9px] text-[#ffb900]">
            {product.badge.replace(/_/g, " ")}
          </span>
        </div>
      )}

      <h1 className="mb-[12px] font-[family-name:var(--font-inter)] text-[36px] font-semibold leading-[43.2px] text-[#1a1a2e]">
        {product.name}
      </h1>

      <div className="mb-[24px] flex items-center gap-[8px]">
        <div className="flex items-center gap-[2px]">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <span
                key={index}
                className={`text-[14px] ${
                  index < Math.round(product.rating) ? "text-[#ffb900]" : "text-[#e5e7eb]"
                }`}
              >
                ★
              </span>
            ))}
        </div>
        <span className="text-[13px] leading-[19.5px] text-[#6a7282]">
          {product.rating} ({product.reviewCount} reviews)
        </span>
      </div>

      <div className="mb-[24px] flex items-end gap-[12px]">
        <span className="text-[24px] font-medium leading-[28.8px] text-[#1a1a2e]">
          {formatPeso(product.price)}
        </span>
        {product.originalPrice && (
          <span className="mb-[2px] text-[16px] leading-[24px] text-[#99a1af] line-through">
            {formatPeso(product.originalPrice)}
          </span>
        )}
        {savings && (
          <span className="mb-[4px] text-[12px] font-medium leading-[18px] text-[#fb2c36]">
            Save {formatPeso(savings)}
          </span>
        )}
      </div>

      <p className="mb-[24px] text-[14px] leading-[22px] text-[#6a7282]">{product.description}</p>

      <div className="mb-[32px]">
        <p className="mb-[8px] text-[13px] text-[#6a7282]">
          Color: <span className="font-medium text-[#1a1a2e]">{selectedColor.name}</span>
        </p>
        <div className="flex gap-[8px]">
          {(product.colorVariants.length > 0 ? product.colorVariants : [selectedColor]).map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color)}
              className={`rounded-[6px] border px-[16px] py-[6px] text-[13px] font-medium transition-colors ${
                selectedColor.name === color.name
                  ? "border-[#1a1a2e] bg-[#1a1a2e] text-white"
                  : "border-[#e5e7eb] bg-white text-[#0a0a0a]/50 hover:border-[#1a1a2e]/30"
              }`}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>

      <InquiryButton
        productId={product.id}
        productName={product.name}
        fullWidth
        className="mb-[32px] flex h-[48px] items-center justify-center gap-[8px] rounded-[4px] bg-[#c9a96e] px-[24px] text-[15px] font-medium text-[#1a1a2e] transition-colors hover:bg-[#c9a96e]/90"
      />

      <div className="mb-[24px] grid grid-cols-3 gap-[16px] border-y border-[#e5e7eb] py-[24px]">
        <div className="flex items-start gap-[12px]">
          <Truck className="mt-0.5 h-[16px] w-[16px] shrink-0 text-[#6a7282]" strokeWidth={1.5} />
          <p className="text-[12px] leading-[18px] text-[#6a7282]">Free shipping on orders over $500</p>
        </div>
        <div className="flex items-start gap-[12px]">
          <RotateCcw className="mt-0.5 h-[16px] w-[16px] shrink-0 text-[#6a7282]" strokeWidth={1.5} />
          <p className="text-[12px] leading-[18px] text-[#6a7282]">30-day hassle-free returns</p>
        </div>
        <div className="flex items-start gap-[12px]">
          <ShieldCheck className="mt-0.5 h-[16px] w-[16px] shrink-0 text-[#6a7282]" strokeWidth={1.5} />
          <p className="text-[12px] leading-[18px] text-[#6a7282]">5-year manufacturer warranty</p>
        </div>
      </div>

      <div>
        <div className="mb-[16px] flex gap-[24px] border-b border-[#e5e7eb]">
          {(["description", "specifications", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-[1.25px] pb-[8px] text-[13px] font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-[#1a1a2e] text-[#1a1a2e]"
                  : "border-transparent text-[#99a1af] hover:text-[#1a1a2e]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="text-[13px] leading-[19.5px] text-[#6a7282]">
          {activeTab === "description" && <p>{product.description}</p>}
          {activeTab === "specifications" && (
            <table className="w-full text-left text-[13px]">
              <tbody className="divide-y divide-[#e5e7eb]">
                <tr>
                  <td className="w-1/3 py-2 text-[#6a7282]">Category</td>
                  <td className="py-2 font-medium text-[#1a1a2e]">{product.category}</td>
                </tr>
                <tr>
                  <td className="py-2 text-[#6a7282]">Material</td>
                  <td className="py-2 font-medium text-[#1a1a2e]">{product.material}</td>
                </tr>
                <tr>
                  <td className="py-2 text-[#6a7282]">Dimensions</td>
                  <td className="py-2 font-medium text-[#1a1a2e]">
                    {product.dimensions.width} x {product.dimensions.depth} x {product.dimensions.height} cm
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-[#6a7282]">Weight</td>
                  <td className="py-2 font-medium text-[#1a1a2e]">{product.dimensions.weight} kg</td>
                </tr>
              </tbody>
            </table>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {[
                {
                  name: "Maria S.",
                  rating: 5,
                  date: "Jan 2026",
                  text: "Absolutely love this piece. Quality is exceptional and delivery was fast.",
                },
                {
                  name: "Jose R.",
                  rating: 4,
                  date: "Dec 2025",
                  text: "Great product, exactly as described. Would recommend to anyone.",
                },
              ].map((review, index) => (
                <div key={index} className="border-b border-[#e5e7eb] pb-3 last:border-0">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[13px] font-medium text-[#1a1a2e]">{review.name}</span>
                    <span className="text-[11px] text-[#99a1af]">{review.date}</span>
                  </div>
                  <div className="mb-1 text-[12px] text-[#ffb900]">{"★".repeat(review.rating)}</div>
                  <p className="text-[12px]">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
