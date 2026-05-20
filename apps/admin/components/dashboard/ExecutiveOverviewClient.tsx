"use client"

import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Box,
  CircleDollarSign,
  Clock3,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { ExecutiveOverviewData } from "@/lib/dashboard/executive"

type ExecutiveOverviewClientProps = {
  userName: string
  data: ExecutiveOverviewData
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatCompactCurrency(value: number) {
  const absoluteValue = Math.abs(value)

  if (absoluteValue < 1000) {
    return formatCurrency(value)
  }

  const suffixes = [
    { threshold: 1_000_000_000, suffix: "B" },
    { threshold: 1_000_000, suffix: "M" },
    { threshold: 1_000, suffix: "K" },
  ]

  const matchedSuffix = suffixes.find((entry) => absoluteValue >= entry.threshold)

  if (!matchedSuffix) {
    return formatCurrency(value)
  }

  const compactValue = value / matchedSuffix.threshold
  const formattedNumber = Number(compactValue.toFixed(1)).toString()

  return `₱${formattedNumber}${matchedSuffix.suffix}`
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (value) => value.toUpperCase())
}

function asNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value ?? 0)
}

function formatSchedule(dateValue: string | Date) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateValue))
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#d7dde7] bg-[#fbfdff] px-4 py-8 text-center text-[13px] text-[#6b7280]">
      {message}
    </div>
  )
}

export function ExecutiveOverviewClient({ userName, data }: ExecutiveOverviewClientProps) {
  const { snapshot, monthlyPerformance, categoryMix, lowStockItems, pendingOrders, upcomingDeliveries } = data

  return (
    <main className="min-h-screen bg-[#fcfcfc]">
      <header className="flex h-[64px] items-center justify-between border-b border-[#e5e7eb] bg-white px-8">
        <div>
          <span className="text-[14px] font-medium text-[#111827]">Welcome, {userName}</span>
        </div>
        <div className="flex items-center gap-5">
          <button className="relative text-[#6b7280] transition-colors hover:text-[#111827]">
            <Bell className="h-[20px] w-[20px]" />
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#ef4444] ring-2 ring-white"></span>
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
            <span className="text-[11px] font-bold text-indigo-600">
              {userName
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase() ?? "")
                .join("")}
            </span>
          </div>
        </div>
      </header>

      <div className="space-y-6 p-8">
        <section className="flex flex-col gap-4 rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[720px]">
            <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[#94a3b8]">Executive Overview</p>
            <h1 className="mt-3 text-[34px] font-semibold leading-tight text-[#0f172a]">Executive Overview</h1>
          </div>

          <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8fbff] px-5 py-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#94a3b8]">Live Neon Snapshot</p>
            <div className="mt-3 space-y-1 text-[13px] text-[#334155]">
              <p>{snapshot.salesOrders} active customer orders</p>
              <p>{snapshot.publishedProducts} published products in catalog</p>
              <p>{snapshot.activeDeliveries} orders out for delivery</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-[#94a3b8]">Booked Revenue</p>
                <p className="mt-2 text-[26px] font-bold text-[#0f172a]">{formatCompactCurrency(snapshot.bookedRevenue)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
                <CircleDollarSign className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-[#94a3b8]">Active Orders</p>
                <p className="mt-2 text-[26px] font-bold text-[#0f172a]">{snapshot.salesOrders}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
                <ShoppingBag className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-[#94a3b8]">Collection Rate</p>
                <p className="mt-2 text-[26px] font-bold text-[#0f172a]">{snapshot.collectionRate.toFixed(1)}%</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50">
                <Clock3 className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-[#94a3b8]">Inventory Value</p>
                <p className="mt-2 text-[26px] font-bold text-[#0f172a]">{formatCompactCurrency(snapshot.inventoryValue)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                <Package className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm xl:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-[#0f172a]">Revenue and Collection Trend</h2>
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyPerformance} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="overviewRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="overviewCollections" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#eef2f7" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} dy={10} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickFormatter={(value) => formatCompactCurrency(Number(value))}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)" }}
                    formatter={(value) => formatCurrency(asNumber(value))}
                  />
                  <Area type="monotone" dataKey="revenue" name="Booked revenue" stroke="#6366f1" strokeWidth={2.2} fill="url(#overviewRevenue)" />
                  <Area type="monotone" dataKey="collections" name="Verified collections" stroke="#10b981" strokeWidth={2.2} fill="url(#overviewCollections)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-[15px] font-semibold text-[#0f172a]">Published Products by Category</h2>
            </div>

            {categoryMix.length === 0 ? (
              <EmptyPanel message="No published products are in Neon yet." />
            ) : (
              <>
                <div className="flex min-h-[250px] items-center justify-center">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={categoryMix} dataKey="value" nameKey="category" innerRadius={58} outerRadius={82} paddingAngle={2} stroke="none">
                        {categoryMix.map((item) => (
                          <Cell key={item.category} fill={item.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)" }}
                        formatter={(value, _name, entry) => [`${asNumber(value)} products`, String(entry.payload?.category ?? "")]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  {categoryMix.map((item) => (
                    <div key={item.category} className="flex items-center gap-2 rounded-full border border-[#e5e7eb] px-3 py-1.5 text-[11px] text-[#334155]">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="font-medium">{item.category}</span>
                      <span className="text-[#94a3b8]">{item.share}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-4">
          <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2 text-amber-500">
              <AlertTriangle className="h-4 w-4" />
              <h3 className="text-[14px] font-semibold text-[#0f172a]">Low Stock Alerts</h3>
            </div>
            {lowStockItems.length === 0 ? (
              <EmptyPanel message="No low-stock alerts at the moment." />
            ) : (
              <div className="space-y-4">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-[#f1f5f9] pb-3 last:border-b-0 last:pb-0">
                    <div>
                      <p className="text-[12px] font-medium text-[#111827]">{item.itemName}</p>
                      <p className="text-[10px] text-[#94a3b8]">{item.warehouseName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-semibold text-[#dc2626]">{item.availableQty} left</p>
                      <p className="text-[10px] text-[#94a3b8]">Min {item.reorderThreshold}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-500">
                <Clock3 className="h-4 w-4" />
                <h3 className="text-[14px] font-semibold text-[#0f172a]">Open Orders</h3>
              </div>
            </div>
            {pendingOrders.length === 0 ? (
              <EmptyPanel message="No sales orders have been created yet." />
            ) : (
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b border-[#f1f5f9] pb-3 last:border-b-0 last:pb-0">
                    <div>
                      <p className="text-[12px] font-medium text-[#111827]">{order.soNumber}</p>
                      <p className="text-[10px] text-[#94a3b8]">{order.companyName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-semibold text-[#0f172a]">{formatCompactCurrency(order.total)}</p>
                      <p className="text-[10px] text-[#6366f1]">{formatStatus(order.status)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Box className="h-4 w-4 text-emerald-500" />
              <h3 className="text-[14px] font-semibold text-[#0f172a]">Collections Snapshot</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
                <span className="text-[12px] text-[#334155]">Verified collections</span>
                <span className="text-[13px] font-semibold text-[#0f172a]">{formatCurrency(snapshot.verifiedCollections)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
                <span className="text-[12px] text-[#334155]">Collection rate</span>
                <span className="text-[13px] font-semibold text-[#0f172a]">{snapshot.collectionRate.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[#334155]">Booked revenue</span>
                <span className="text-[13px] font-semibold text-[#0f172a]">{formatCurrency(snapshot.bookedRevenue)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-500" />
              <h3 className="text-[14px] font-semibold text-[#0f172a]">Upcoming Deliveries</h3>
            </div>
            {upcomingDeliveries.length === 0 ? (
              <EmptyPanel message="No delivery schedules are in Neon yet." />
            ) : (
              <div className="space-y-4">
                {upcomingDeliveries.map((delivery) => (
                  <div key={delivery.id} className="flex items-start justify-between border-b border-[#f1f5f9] pb-3 last:border-b-0 last:pb-0">
                    <div>
                      <p className="text-[12px] font-medium text-[#111827]">{delivery.soNumber}</p>
                      <p className="text-[10px] text-[#94a3b8]">{delivery.companyName}</p>
                    </div>
                    <div className="text-right">
                      <p className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                        {formatSchedule(delivery.scheduledAt)}
                      </p>
                      <p className="mt-1 text-[10px] text-[#64748b]">{formatStatus(delivery.status)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eef4ff] px-4 py-2 text-[12px] font-medium text-[#3159d8]">
            Live from Neon DB
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </section>
      </div>
    </main>
  )
}
