"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
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
    <div className="flex flex-col gap-6">
      {/* Badge */}
      {product.badge && (
        <span className="self-start text-xs font-bold tracking-widest uppercase bg-[--color-coral] text-white px-3 py-1 rounded-full">
          {product.badge === "BEST_SELLER"
            ? "Best Seller"
            : product.badge === "HOT"
            ? "Hot"
            : "Sale"}
        </span>
      )}

      {/* Name */}
      <h1 className="text-2xl md:text-3xl font-semibold text-[--color-charcoal] leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <span className="text-[--color-gold] text-base">
          {"★".repeat(Math.round(product.rating))}
          {"☆".repeat(5 - Math.round(product.rating))}
        </span>
        <span className="text-sm text-[--color-muted]">
          {product.rating} ({product.reviewCount} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-[--color-charcoal]">
          ₱{product.price.toLocaleString()}
        </span>
        {product.originalPrice && (
          <span className="text-lg text-[--color-muted] line-through">
            ₱{product.originalPrice.toLocaleString()}
          </span>
        )}
        {savings && (
          <span className="text-sm font-semibold text-[--color-coral]">
            Save ₱{savings.toLocaleString()}
          </span>
        )}
      </div>

      {/* Short description */}
      <p className="text-[--color-muted] text-sm leading-relaxed border-t border-[--color-beige] pt-4">
        {product.description}
      </p>

      {/* Color Picker */}
      <div>
        <p className="text-sm font-medium text-[--color-charcoal] mb-2">
          Color:{" "}
          <span className="font-normal text-[--color-muted]">{selectedColor.name}</span>
        </p>
        <div className="flex gap-2">
          {product.colorVariants.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color)}
              title={color.name}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                selectedColor.name === color.name
                  ? "border-[--color-navy] scale-110 shadow-md"
                  : "border-white ring-1 ring-[--color-beige] hover:scale-105"
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>

      {/* CTA */}
      <button className="flex items-center justify-center gap-2 w-full bg-[--color-gold] hover:bg-[#b8963e] text-white font-semibold py-4 rounded-lg transition-colors text-sm tracking-wide mt-2">
        <MessageCircle className="w-4 h-4" />
        Inquire Now — Message Us
      </button>

      {/* Trust icons */}
      <div className="grid grid-cols-3 gap-2 border-t border-[--color-beige] pt-4">
        {[
          { icon: "🚚", label: "Free Shipping", sub: "On orders ₱5,000+" },
          { icon: "↩️", label: "30-Day Returns", sub: "Hassle-free" },
          { icon: "🛡️", label: "5-Year Warranty", sub: "All furniture" },
        ].map(({ icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center text-center gap-1">
            <span className="text-xl">{icon}</span>
            <span className="text-xs font-medium text-[--color-charcoal]">{label}</span>
            <span className="text-xs text-[--color-muted]">{sub}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-t border-[--color-beige] pt-4">
        <div className="flex gap-0 border-b border-[--color-beige]">
          {(["description", "specifications", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? "border-[--color-navy] text-[--color-navy]"
                  : "border-transparent text-[--color-muted] hover:text-[--color-charcoal]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="py-4 text-sm text-[--color-muted] leading-relaxed">
          {activeTab === "description" && <p>{product.description}</p>}
          {activeTab === "specifications" && (
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-[--color-beige]">
                <tr>
                  <td className="py-2 font-medium text-[--color-charcoal] w-1/3">Category</td>
                  <td className="py-2">{product.category}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-[--color-charcoal]">Material</td>
                  <td className="py-2">{product.material}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-[--color-charcoal]">Width</td>
                  <td className="py-2">{product.dimensions.width} cm</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-[--color-charcoal]">Depth</td>
                  <td className="py-2">{product.dimensions.depth} cm</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-[--color-charcoal]">Height</td>
                  <td className="py-2">{product.dimensions.height} cm</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-[--color-charcoal]">Weight</td>
                  <td className="py-2">{product.dimensions.weight} kg</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-[--color-charcoal]">Stock Status</td>
                  <td className="py-2">{product.stockStatus.replace(/_/g, " ")}</td>
                </tr>
              </tbody>
            </table>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {[
                { name: "Maria S.", rating: 5, date: "Jan 2026", text: "Absolutely love this piece. Quality is exceptional and delivery was fast." },
                { name: "Jose R.", rating: 4, date: "Dec 2025", text: "Great product, exactly as described. Would recommend to anyone." },
                { name: "Anna L.", rating: 5, date: "Nov 2025", text: "Stunning design and very sturdy. Worth every peso." },
              ].map((r, i) => (
                <div key={i} className="border-b border-[--color-beige] pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-[--color-charcoal] text-sm">{r.name}</span>
                    <span className="text-xs text-[--color-muted]">{r.date}</span>
                  </div>
                  <div className="text-[--color-gold] text-xs mb-1">{"★".repeat(r.rating)}</div>
                  <p>{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
