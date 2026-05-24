"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Box,
  Calendar,
  CheckSquare,
  Hammer,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type {
  OperationsDashboardData,
  OpsBuildsByCategoryRow,
} from "@/lib/dashboard/operations"

const PIE_COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899"]

type Props = {
  data: OperationsDashboardData
}

export function OperationsDashboard({ data }: Props) {
  const {
    kpi,
    mostBuiltMonth,
    mostBuiltYear,
    buildsByCategory,
    lowStockItems,
    noStockItems,
    damagedMaterials,
    pendingApprovals,
    deliverySchedule,
  } = data

  const [buildPeriod, setBuildPeriod] = useState<"month" | "year">("month")
  const mostBuiltProducts = buildPeriod === "month" ? mostBuiltMonth : mostBuiltYear

  // Attach colors to category rows (they come without color from the server)
  const categoryRows: OpsBuildsByCategoryRow[] = buildsByCategory.map((r, i) => ({
    ...r,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }))

  return (
    <div className="space-y-6">
      {/* ── Summary cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-medium text-slate-500">Low Stock</p>
              <p className="mt-2 text-[26px] font-semibold leading-none text-slate-900">{kpi.lowStockCount}</p>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className="border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-medium text-slate-500">No Stock</p>
              <p className="mt-2 text-[26px] font-semibold leading-none text-rose-600">{kpi.noStockCount}</p>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-700">
              <Box className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className="border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-medium text-slate-500">Damaged Materials</p>
              <p className="mt-2 text-[26px] font-semibold leading-none text-slate-900">{kpi.damagedQty}</p>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-orange-100 text-orange-700">
              <Hammer className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className="border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-medium text-slate-500">Pending Approvals</p>
              <p className="mt-2 text-[26px] font-semibold leading-none text-slate-900">{kpi.pendingApprovalsCount}</p>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-700">
              <CheckSquare className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className="border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-medium text-slate-500">Deliveries</p>
              <p className="mt-2 text-[26px] font-semibold leading-none text-slate-900">{kpi.deliveriesCount}</p>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700">
              <Truck className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className="border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-medium text-slate-500">Active Suppliers</p>
              <p className="mt-2 text-[26px] font-semibold leading-none text-slate-900">{kpi.activeSuppliersCount}</p>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <Users className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>

      {/* ── Charts row ────────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Most Built Products — Bar chart */}
        <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
                <h3 className="text-[14px] font-semibold text-slate-900">Most Built Products</h3>
              </div>
              <p className="mt-0.5 text-[12px] text-slate-500">
                {buildPeriod === "month" ? "Top products built this month." : "Top products built this year."}
              </p>
            </div>
            <div className="inline-flex items-center border border-slate-200 bg-white p-0.5 text-[12px]">
              <button
                type="button"
                onClick={() => setBuildPeriod("month")}
                className={`px-3 py-1 transition-colors ${buildPeriod === "month" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"}`}
              >
                This Month
              </button>
              <button
                type="button"
                onClick={() => setBuildPeriod("year")}
                className={`px-3 py-1 transition-colors ${buildPeriod === "year" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"}`}
              >
                This Year
              </button>
            </div>
          </div>
          <div className="px-5 py-4">
            {mostBuiltProducts.length === 0 ? (
              <div className="flex h-[220px] items-center justify-center text-[13px] text-slate-400">
                No build data for this period yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={mostBuiltProducts} layout="vertical" margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#334155" }} axisLine={false} tickLine={false} width={110} />
                  <Tooltip contentStyle={{ border: "1px solid #e2e8f0", fontSize: 12 }} />
                  <Bar dataKey="builds" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        {/* Builds by Category — Pie chart */}
        <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-[14px] font-semibold text-slate-900">Builds by Category</h3>
            <p className="mt-0.5 text-[12px] text-slate-500">Distribution of builds across product categories.</p>
          </div>
          {categoryRows.length === 0 ? (
            <div className="flex h-[220px] items-center justify-center text-[13px] text-slate-400">
              No category data yet.
            </div>
          ) : (
            <div className="flex items-center justify-center gap-6 px-5 py-4">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={categoryRows}
                    dataKey="value"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    paddingAngle={2}
                  >
                    {categoryRows.map((entry) => (
                      <Cell key={entry.category} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ border: "1px solid #e2e8f0", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {categoryRows.map((entry) => (
                  <div key={entry.category} className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-[12px] text-slate-700">{entry.category}</span>
                    <span className="ml-auto text-[12px] font-semibold text-slate-900">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ── Low Stock + No Stock ─────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-[14px] font-semibold text-slate-900">Low Stock Materials</h3>
            <p className="mt-0.5 text-[12px] text-slate-500">Below reorder threshold — needs restocking.</p>
          </div>
          {lowStockItems.length === 0 ? (
            <div className="px-5 py-8 text-center text-[13px] text-slate-400">All materials are above reorder threshold.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-[13px] font-medium text-slate-900">{item.itemName}</p>
                    <p className="text-[11px] text-slate-500">{item.sku} · {item.warehouse}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-semibold text-amber-600">{item.available} left</p>
                    <p className="text-[11px] text-slate-400">threshold: {item.threshold}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-[14px] font-semibold text-slate-900">Out of Stock</h3>
            <p className="mt-0.5 text-[12px] text-slate-500">Zero available — urgent restock needed.</p>
          </div>
          {noStockItems.length === 0 ? (
            <div className="px-5 py-8 text-center text-[13px] text-slate-400">All materials in stock.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {noStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-[13px] font-medium text-slate-900">{item.itemName}</p>
                    <p className="text-[11px] text-slate-500">{item.sku} · {item.warehouse}</p>
                  </div>
                  <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700">Out of stock</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Damaged Materials Summary ─────────────────────────────────────── */}
      <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <Hammer className="h-4 w-4 text-orange-600" />
            <h3 className="text-[14px] font-semibold text-slate-900">Damaged Materials Summary</h3>
          </div>
          <p className="mt-0.5 text-[12px] text-slate-500">Materials flagged as damaged from returns or transit.</p>
        </div>
        {damagedMaterials.length === 0 ? (
          <div className="px-5 py-8 text-center text-[13px] text-slate-400">No damaged materials recorded.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {damagedMaterials.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-[13px] font-medium text-slate-900">{item.itemName}</p>
                  <p className="text-[11px] text-slate-500">{item.sku} · {item.source}</p>
                </div>
                <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-semibold text-orange-700">
                  {item.qty} {item.qty === 1 ? "unit" : "units"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Approvals + Deliveries ────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-violet-600" />
              <h3 className="text-[14px] font-semibold text-slate-900">Pending Approvals</h3>
            </div>
            <p className="mt-0.5 text-[12px] text-slate-500">Orders waiting for your action.</p>
          </div>
          {pendingApprovals.length === 0 ? (
            <div className="px-5 py-8 text-center text-[13px] text-slate-400">No pending approvals right now.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingApprovals.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-[13px] font-medium text-slate-900">{item.product}</p>
                    <p className="text-[11px] text-slate-500">{item.customer} · {item.type}</p>
                  </div>
                  <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-medium text-violet-700">{item.date}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-sky-600" />
              <h3 className="text-[14px] font-semibold text-slate-900">Delivery Schedule</h3>
            </div>
            <p className="mt-0.5 text-[12px] text-slate-500">Active orders in building or shipping stage.</p>
          </div>
          {deliverySchedule.length === 0 ? (
            <div className="px-5 py-8 text-center text-[13px] text-slate-400">No active deliveries right now.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {deliverySchedule.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-[13px] font-medium text-slate-900">{item.product}</p>
                    <p className="text-[11px] text-slate-500">{item.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] font-medium text-slate-700">{item.scheduledDate}</p>
                    <span
                      className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        item.status === "Ready"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
