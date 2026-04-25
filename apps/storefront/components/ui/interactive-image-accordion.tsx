"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

type AccordionItem = {
  id: number
  title: string
  description: string
  imageUrl: string
  href: string
}

const accordionItems: AccordionItem[] = [
  {
    id: 1,
    title: "Office Tables",
    description: "Work-ready desks and team tables for daily operations.",
    imageUrl:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop",
    href: "/shop?category=Tables",
  },
  {
    id: 2,
    title: "Pedestals",
    description: "Compact drawer storage that keeps supplies close at hand.",
    imageUrl:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1200&auto=format&fit=crop",
    href: "/shop?category=Storage",
  },
  {
    id: 3,
    title: "Cabinets",
    description: "Cabinet storage for files, tools, samples, and office stock.",
    imageUrl:
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=1200&auto=format&fit=crop",
    href: "/shop?category=Storage",
  },
  {
    id: 4,
    title: "Workspace Sets",
    description: "Coordinated office pieces for clean, practical work areas.",
    imageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
    href: "/shop",
  },
  {
    id: 5,
    title: "Ready Inventory",
    description: "Live FurniTrack listings with current availability and pricing.",
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    href: "/shop",
  },
]

type AccordionPanelProps = {
  item: AccordionItem
  isActive: boolean
  onActivate: () => void
}

function AccordionPanel({ item, isActive, onActivate }: AccordionPanelProps) {
  return (
    <Link
      href={item.href}
      className={cn(
        "group relative h-[360px] min-w-[64px] overflow-hidden rounded-lg outline-none transition-all duration-700 ease-in-out focus-visible:ring-2 focus-visible:ring-[--color-gold] focus-visible:ring-offset-2 md:h-[430px]",
        isActive
          ? "w-[280px] flex-[1_0_280px] sm:w-[360px] sm:flex-[1_0_360px]"
          : "w-[64px] flex-[0_0_64px]"
      )}
      onFocus={onActivate}
      onMouseEnter={onActivate}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(event) => {
          event.currentTarget.onerror = null
          event.currentTarget.src =
            "https://placehold.co/400x450/f5f0e8/2d2d2d?text=FurniTrack"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 p-5 text-white transition-all duration-300",
          isActive ? "opacity-100" : "translate-y-6 opacity-0"
        )}
      >
        <p className="mb-2 text-[10px] font-medium uppercase leading-none tracking-[2px] text-white/60">
          FurniTrack Collection
        </p>
        <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-medium leading-tight">
          {item.title}
        </h3>
        <p className="mt-3 max-w-[260px] text-sm leading-5 text-white/70">
          {item.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white">
          Browse <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>

      <span
        className={cn(
          "absolute left-1/2 bottom-20 whitespace-nowrap text-sm font-semibold uppercase tracking-[1px] text-white transition-all duration-300",
          isActive
            ? "translate-x-8 rotate-90 opacity-0"
            : "-translate-x-1/2 rotate-90 opacity-100"
        )}
      >
        {item.title}
      </span>
    </Link>
  )
}

export function LandingAccordionItem() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="mx-auto w-full max-w-[1536px] px-4 pb-6 md:px-8">
      <div className="grid gap-8 rounded-lg border border-white/10 bg-[#1a1a2e] p-5 shadow-sm lg:grid-cols-[minmax(260px,0.55fr)_minmax(0,1fr)] lg:p-8">
        <div className="flex flex-col justify-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-medium leading-tight text-white md:text-5xl">
            Practical office furniture, ready for real work.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/65">
            FurniTrack helps teams find office tables, pedestals, cabinets, and
            storage pieces from a live catalog with clear stock, pricing, and
            inquiry support.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-lg bg-[#c9a84c] px-5 py-3 text-sm font-medium text-[#1a1a2e] transition-colors hover:bg-[#c9a84c]/90"
            >
              Shop collection <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center rounded-lg border border-white/15 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex flex-row items-center gap-3 overflow-x-auto pb-2">
            {accordionItems.map((item, index) => (
              <AccordionPanel
                key={item.id}
                item={item}
                isActive={index === activeIndex}
                onActivate={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
