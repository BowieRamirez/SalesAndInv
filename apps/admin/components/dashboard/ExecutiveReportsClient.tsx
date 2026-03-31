"use client"

import { Bell, CircleDollarSign, ClipboardList, Package, ShieldAlert } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { ExecutiveReportsData } from "@/lib/dashboard/executive"

type ExecutiveReportsClientProps = {
  userName: string
  data: ExecutiveReportsData
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

function formatLabel(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function asNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value ?? 0)
}

function EmptyTable({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#d7dde7] bg-[#fbfdff] px-4 py-8 text-center text-[13px] text-[#6b7280]">
      {message}
    </div>
  )
}

export function ExecutiveReportsClient({ userName, data }: ExecutiveReportsClientProps) {
  const { snapshot, monthlyPerformance, orderStatuses, paymentStatuses, categoryMix, lowStockItems } = data

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
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
            <span className="text-[11px] font-bold text-slate-700">
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
        <section className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[#94a3b8]">Management Reports</p>
          <h1 className="mt-3 text-[32px] font-semibold leading-tight text-[#0f172a]">Management Reports</h1>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
            <p className="text-[12px] font-medium text-[#94a3b8]">Booked Revenue</p>
            <p className="mt-2 text-[26px] font-bold text-[#0f172a]">{formatCompactCurrency(snapshot.bookedRevenue)}</p>
          </div>

          <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
            <p className="text-[12px] font-medium text-[#94a3b8]">Verified Collections</p>
            <p className="mt-2 text-[26px] font-bold text-[#0f172a]">{formatCompactCurrency(snapshot.verifiedCollections)}</p>
          </div>

          <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
            <p className="text-[12px] font-medium text-[#94a3b8]">Outstanding Receivables</p>
            <p className="mt-2 text-[26px] font-bold text-[#0f172a]">{formatCompactCurrency(snapshot.outstandingReceivables)}</p>
          </div>

          <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
            <p className="text-[12px] font-medium text-[#94a3b8]">Open Orders</p>
            <p className="mt-2 text-[26px] font-bold text-[#0f172a]">{snapshot.openOrders}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-[15px] font-semibold text-[#0f172a]">Monthly Revenue vs Collections</h2>
            </div>
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyPerformance} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={18}>
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
                  <Bar dataKey="revenue" name="Booked revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="collections" name="Verified collections" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-indigo-500" />
              <h2 className="text-[15px] font-semibold text-[#0f172a]">Catalog Mix</h2>
            </div>
            {categoryMix.length === 0 ? (
              <EmptyTable message="Published products will appear here once the catalog is populated." />
            ) : (
              <>
                <div className="flex min-h-[240px] items-center justify-center">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={categoryMix} dataKey="value" nameKey="category" innerRadius={56} outerRadius={78} paddingAngle={2} stroke="none">
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
                <div className="mt-3 space-y-3">
                  {categoryMix.map((item) => (
                    <div key={item.category} className="flex items-center justify-between text-[12px]">
                      <div className="flex items-center gap-2 text-[#334155]">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span className="font-medium">{item.category}</span>
                      </div>
                      <span className="text-[#94a3b8]">{item.share}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-emerald-500" />
              <h3 className="text-[15px] font-semibold text-[#0f172a]">Sales Order Statuses</h3>
            </div>
            {orderStatuses.length === 0 ? (
              <EmptyTable message="No sales orders are available yet." />
            ) : (
              <div className="space-y-3">
                {orderStatuses.map((status) => (
                  <div key={status.label} className="flex items-center justify-between border-b border-[#f1f5f9] pb-3 last:border-b-0 last:pb-0">
                    <span className="text-[13px] text-[#334155]">{formatLabel(status.label)}</span>
                    <span className="text-[13px] font-semibold text-[#0f172a]">{status.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <CircleDollarSign className="h-4 w-4 text-blue-500" />
              <h3 className="text-[15px] font-semibold text-[#0f172a]">Payment Statuses</h3>
            </div>
            {paymentStatuses.length === 0 ? (
              <EmptyTable message="No payment records are available yet." />
            ) : (
              <div className="space-y-3">
                {paymentStatuses.map((status) => (
                  <div key={status.label} className="flex items-center justify-between border-b border-[#f1f5f9] pb-3 last:border-b-0 last:pb-0">
                    <span className="text-[13px] text-[#334155]">{formatLabel(status.label)}</span>
                    <span className="text-[13px] font-semibold text-[#0f172a]">{status.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              <h3 className="text-[15px] font-semibold text-[#0f172a]">Current Low Stock Exposure</h3>
            </div>
            {lowStockItems.length === 0 ? (
              <EmptyTable message="No low-stock items are currently flagged." />
            ) : (
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-start justify-between border-b border-[#f1f5f9] pb-3 last:border-b-0 last:pb-0">
                    <div>
                      <p className="text-[12px] font-medium text-[#111827]">{item.itemName}</p>
                      <p className="text-[10px] text-[#94a3b8]">{item.warehouseName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-semibold text-[#dc2626]">{item.availableQty}</p>
                      <p className="text-[10px] text-[#94a3b8]">Min {item.reorderThreshold}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
