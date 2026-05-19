"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Package, CheckCircle } from "lucide-react"

type Props = {
  activeCount: number
  completedCount: number
  defaultTab: string
}

export function StatusTabs({ activeCount, completedCount, defaultTab }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const current = searchParams.get("tab") ?? defaultTab

  function switchTab(tab: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tab)
    router.push(`${pathname}?${params.toString()}`)
  }

  const tabs = [
    {
      key: "active",
      label: "Active Orders",
      count: activeCount,
      icon: Package,
    },
    {
      key: "history",
      label: "Order History",
      count: completedCount,
      icon: CheckCircle,
    },
  ]

  return (
    <div className="flex gap-1 rounded-[16px] border border-[#e5e7eb] bg-white p-1.5 shadow-sm">
      {tabs.map(({ key, label, count, icon: Icon }) => {
        const isActive = current === key || (key === "active" && current !== "history")
        return (
          <button
            key={key}
            type="button"
            onClick={() => switchTab(key)}
            className={`flex flex-1 items-center justify-center gap-2.5 rounded-[12px] px-4 py-2.5 text-[13px] font-medium transition-all ${
              isActive
                ? "bg-[#1a1a2e] text-white shadow-sm"
                : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#1a1a2e]"
            }`}
          >
            <Icon className="h-[15px] w-[15px] shrink-0" strokeWidth={1.75} />
            <span>{label}</span>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-[#f3f4f6] text-[#6b7280]"
              }`}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
