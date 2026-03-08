"use client"

import { useState } from "react"
import { MessageCircle, Truck, RotateCcw, ShieldCheck } from "lucide-react"
import type { Product } from "@furnitrack/validators"

interface ProductClientProps {
  product: Product
}

export function ProductClient({ product }: ProductClientProps) {
  const [selectedColor, setSelectedColor] = useState(product.colorVariants[0])
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">(
    "description"
  )

  const savings =
    product.originalPrice ? product.originalPrice - product.price : null

  return (
    <div className="flex flex-col font-['var(--font-inter)']">
      {/* Badge */}
      {product.badge && (
        <div className="bg-[#ffefc6] px-[12px] py-[4px] rounded-[100px] inline-flex items-center justify-center w-max mb-[12px]">
          <span className="text-[#ffb900] text-[10px] font-bold tracking-[0.9px] uppercase">
             {product.badge.replace(/_/g, " ")}
          </span>
        </div>
      )}

      {/* Name */}
      <h1 className="text-[#1a1a2e] text-[36px] font-medium font-['var(--font-playfair)'] leading-[43.2px] mb-[12px]">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-[8px] mb-[24px]">
        <div className="flex items-center gap-[2px]">
          {Array(5).fill(0).map((_, i) => (
            <span key={i} className={`text-[14px] ${i < Math.round(product.rating) ? 'text-[#ffb900]' : 'text-[#e5e7eb]'}`}>
              ★
            </span>
          ))}
        </div>
        <span className="text-[#6a7282] text-[13px] leading-[19.5px]">
          {product.rating} ({product.reviewCount} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-end gap-[12px] mb-[24px]">
        <span className="text-[#1a1a2e] text-[24px] font-medium leading-[28.8px]">${product.price.toLocaleString()}</span>
        {product.originalPrice && (
          <span className="text-[#99a1af] text-[16px] line-through leading-[24px] mb-[2px]">
            ${product.originalPrice.toLocaleString()}
          </span>
        )}
        {savings && (
          <span className="text-[#fb2c36] text-[12px] font-medium leading-[18px] mb-[4px]">
            Save ${savings.toLocaleString()}
          </span>
        )}
      </div>

      {/* Short description */}
      <p className="text-[#6a7282] text-[14px] leading-[22px] mb-[24px]">
        A statement piece for any room. The Luxe Accent Chair combines mid-century design with modern comfort. Upholstered in rich velvet with tapered wooden legs.
      </p>

      {/* Color Picker (Pill Style) */}
      <div className="mb-[32px]">
        <p className="text-[#6a7282] text-[13px] mb-[8px]">
          Color: <span className="text-[#1a1a2e] font-medium">{selectedColor.name}</span>
        </p>
        <div className="flex gap-[8px]">
          {product.colorVariants.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color)}
              className={`px-[16px] py-[6px] rounded-[6px] text-[13px] border ${
                selectedColor.name === color.name 
                  ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' 
                  : 'bg-white text-[#0a0a0a]/50 border-[#e5e7eb] hover:border-[#1a1a2e]/30'
              } font-medium transition-colors`}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <button className="w-full bg-[#c9a96e] hover:bg-[#c9a96e]/90 text-[#1a1a2e] h-[48px] px-[24px] rounded-[4px] flex items-center justify-center gap-[8px] font-medium text-[15px] transition-colors mb-[32px]">
        <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />
        Inquire Now — Message Us
      </button>

      {/* Trust icons */}
      <div className="grid grid-cols-3 gap-[16px] border-t border-b border-[#e5e7eb] py-[24px] mb-[24px]">
        <div className="flex gap-[12px] items-start">
          <Truck className="w-[16px] h-[16px] shrink-0 text-[#6a7282] mt-0.5" strokeWidth={1.5} />
          <p className="text-[12px] text-[#6a7282] leading-[18px]">Free shipping on orders over $500</p>
        </div>
        <div className="flex gap-[12px] items-start">
          <RotateCcw className="w-[16px] h-[16px] shrink-0 text-[#6a7282] mt-0.5" strokeWidth={1.5} />
          <p className="text-[12px] text-[#6a7282] leading-[18px]">30-day hassle-free returns</p>
        </div>
        <div className="flex gap-[12px] items-start">
          <ShieldCheck className="w-[16px] h-[16px] shrink-0 text-[#6a7282] mt-0.5" strokeWidth={1.5} />
          <p className="text-[12px] text-[#6a7282] leading-[18px]">5-year manufacturer warranty</p>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex gap-[24px] border-b border-[#e5e7eb] mb-[16px]">
          {(["description", "specifications", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-[8px] text-[13px] font-medium capitalize border-b-[1.25px] transition-colors ${
                activeTab === tab
                  ? "border-[#1a1a2e] text-[#1a1a2e]"
                  : "border-transparent text-[#99a1af] hover:text-[#1a1a2e]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="text-[13px] text-[#6a7282] leading-[19.5px]">
          {activeTab === "description" && <p>A statement piece for any room. The Luxe Accent Chair combines mid-century design with modern comfort. Upholstered in rich velvet with tapered wooden legs.</p>}
          {activeTab === "specifications" && (
            <table className="w-full text-left text-[13px]">
              <tbody className="divide-y divide-[#e5e7eb]">
                <tr>
                  <td className="py-2 text-[#6a7282] w-1/3">Category</td>
                  <td className="py-2 text-[#1a1a2e] font-medium">{product.category}</td>
                </tr>
                <tr>
                  <td className="py-2 text-[#6a7282]">Material</td>
                  <td className="py-2 text-[#1a1a2e] font-medium">{product.material}</td>
                </tr>
                <tr>
                  <td className="py-2 text-[#6a7282]">Dimensions</td>
                  <td className="py-2 text-[#1a1a2e] font-medium">{product.dimensions.width} x {product.dimensions.depth} x {product.dimensions.height} cm</td>
                </tr>
                <tr>
                  <td className="py-2 text-[#6a7282]">Weight</td>
                  <td className="py-2 text-[#1a1a2e] font-medium">{product.dimensions.weight} kg</td>
                </tr>
              </tbody>
            </table>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {[
                { name: "Maria S.", rating: 5, date: "Jan 2026", text: "Absolutely love this piece. Quality is exceptional and delivery was fast." },
                { name: "Jose R.", rating: 4, date: "Dec 2025", text: "Great product, exactly as described. Would recommend to anyone." },
              ].map((r, i) => (
                <div key={i} className="border-b border-[#e5e7eb] pb-3 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-[#1a1a2e] text-[13px]">{r.name}</span>
                    <span className="text-[11px] text-[#99a1af]">{r.date}</span>
                  </div>
                  <div className="text-[#ffb900] text-[12px] mb-1">{"★".repeat(r.rating)}</div>
                  <p className="text-[12px]">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
