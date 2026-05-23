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

const PIE_COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899"]

export function OperationsDashboard() {
  // ── Static placeholder data ──────────────────────────────────────────────
  const lowStockItems = [
    { id: "1", itemName: "18mm Plywood Board", sku: "MAT-0012", warehouse: "Main Warehouse", available: 3, threshold: 10 },
    { id: "2", itemName: "Wood Glue (1L)", sku: "MAT-0034", warehouse: "Main Warehouse", available: 5, threshold: 15 },
    { id: "3", itemName: "Drawer Slides 18\"", sku: "MAT-0056", warehouse: "Accessories WH", available: 2, threshold: 8 },
    { id: "4", itemName: "Hinges (Soft-close)", sku: "MAT-0078", warehouse: "Accessories WH", available: 4, threshold: 12 },
  ]

  const noStockItems = [
    { id: "5", itemName: "Melamine Edge Band (White)", sku: "MAT-0091", warehouse: "Main Warehouse" },
    { id: "6", itemName: "Cabinet Handles (Matte Black)", sku: "MAT-0103", warehouse: "Accessories WH" },
  ]

  const mostUsedMaterials = [
    { id: "1", itemName: "18mm Plywood Board", sku: "MAT-0012", usageCount: 47, unit: "sheets" },
    { id: "2", itemName: "Wood Screws (Box)", sku: "MAT-0023", usageCount: 38, unit: "boxes" },
    { id: "3", itemName: "Wood Glue (1L)", sku: "MAT-0034", usageCount: 29, unit: "bottles" },
    { id: "4", itemName: "Sandpaper 120-grit", sku: "MAT-0045", usageCount: 24, unit: "packs" },
    { id: "5", itemName: "Drawer Slides 18\"", sku: "MAT-0056", usageCount: 19, unit: "pairs" },
  ]

  const pendingApprovals = [
    { id: "1", type: "Build Approval", customer: "Maria Santos", product: "Custom Kitchen Cabinet", date: "May 22, 2026" },
    { id: "2", type: "Inventory Approval", customer: "Juan Reyes", product: "Office Desk Set", date: "May 23, 2026" },
    { id: "3", type: "Build Approval", customer: "Ana Cruz", product: "Bedroom Wardrobe", date: "May 24, 2026" },
  ]

  const deliverySchedule = [
    { id: "1", customer: "Maria Santos", product: "Custom Kitchen Cabinet", scheduledDate: "May 26, 2026", status: "Ready" },
    { id: "2", customer: "Pedro Lim", product: "Dining Table (6-seater)", scheduledDate: "May 27, 2026", status: "Building" },
    { id: "3", customer: "Sofia Garcia", product: "TV Console", scheduledDate: "May 28, 2026", status: "Ready" },
    { id: "4", customer: "Carlos Tan", product: "Shoe Rack (Large)", scheduledDate: "May 30, 2026", status: "Building" },
  ]

  const damagedMaterials = [
    { id: "1", itemName: "18mm Plywood Board", sku: "MAT-0012", qty: 3, source: "Customer return" },
    { id: "2", itemName: "Drawer Slides 18\"", sku: "MAT-0056", qty: 1, source: "Customer return" },
    { id: "3", itemName: "Hinges (Soft-close)", sku: "MAT-0078", qty: 2, source: "Damaged in transit" },
  ]

  const mostBuiltProductsMonth = [
    { name: "Kitchen Cabinet", builds: 12 },
    { name: "Office Desk", builds: 9 },
    { name: "Wardrobe", builds: 7 },
    { name: "TV Console", builds: 6 },
    { name: "Shoe Rack", builds: 5 },
    { name: "Dining Table", builds: 4 },
  ]

  const mostBuiltProductsYear = [
    { name: "Kitchen Cabinet", builds: 87 },
    { name: "Office Desk", builds: 64 },
    { name: "Wardrobe", builds: 52 },
    { name: "Dining Table", builds: 41 },
    { name: "TV Console", builds: 38 },
    { name: "Shoe Rack", builds: 29 },
  ]

  const [buildPeriod, setBuildPeriod] = useState<"month" | "year">("month")
  const mostBuiltProducts = buildPeriod === "month" ? mostBuiltProductsMonth : mostBuiltProductsYear

  const buildsByCategory = [
    { category: "Storage", value: 28, color: PIE_COLORS[0] },
    { category: "Tables", value: 18, color: PIE_COLORS[1] },
    { category: "Seating", value: 8, color: PIE_COLORS[2] },
    { category: "Bedroom", value: 12, color: PIE_COLORS[3] },
    { category: "Other", value: 5, color: PIE_COLORS[4] },
  ]

  const activeSuppliers = 6
  const totalDamagedQty = damagedMaterials.reduce((t, d) => t + d.qty, 0)

  return (
    <div className="space-y-6">
      {/* ── Summary cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className=" border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-medium text-slate-500">Low Stock</p>
              <p className="mt-2 text-[26px] font-semibold leading-none text-slate-900">{lowStockItems.length}</p>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className=" border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-medium text-slate-500">No Stock</p>
              <p className="mt-2 text-[26px] font-semibold leading-none text-rose-600">{noStockItems.length}</p>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-700">
              <Box className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className=" border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-medium text-slate-500">Damaged Materials</p>
              <p className="mt-2 text-[26px] font-semibold leading-none text-slate-900">{totalDamagedQty}</p>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-orange-100 text-orange-700">
              <Hammer className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className=" border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-medium text-slate-500">Pending Approvals</p>
              <p className="mt-2 text-[26px] font-semibold leading-none text-slate-900">{pendingApprovals.length}</p>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-700">
              <CheckSquare className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className=" border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-medium text-slate-500">Deliveries</p>
              <p className="mt-2 text-[26px] font-semibold leading-none text-slate-900">{deliverySchedule.length}</p>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700">
              <Truck className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className=" border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-medium text-slate-500">Active Suppliers</p>
              <p className="mt-2 text-[26px] font-semibold leading-none text-slate-900">{activeSuppliers}</p>
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
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mostBuiltProducts} layout="vertical" margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#334155" }} axisLine={false} tickLine={false} width={110} />
                <Tooltip contentStyle={{ border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="builds" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Builds by Category — Pie chart */}
        <section className="overflow-hidden  border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-[14px] font-semibold text-slate-900">Builds by Category</h3>
            <p className="mt-0.5 text-[12px] text-slate-500">Distribution of builds across product categories.</p>
          </div>
          <div className="flex items-center justify-center gap-6 px-5 py-4">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={buildsByCategory} dataKey="value" nameKey="category" cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={2}>
                  {buildsByCategory.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ border: "1px solid #e2e8f0", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {buildsByCategory.map((entry) => (
                <div key={entry.category} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-[12px] text-slate-700">{entry.category}</span>
                  <span className="ml-auto text-[12px] font-semibold text-slate-900">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── Low Stock + No Stock ─────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="overflow-hidden  border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-[14px] font-semibold text-slate-900">Low Stock Materials</h3>
            <p className="mt-0.5 text-[12px] text-slate-500">Below reorder threshold — needs restocking.</p>
          </div>
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
        </section>

        <section className="overflow-hidden  border border-slate-200 bg-white shadow-sm">
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
      <section className="overflow-hidden  border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <Hammer className="h-4 w-4 text-orange-600" />
            <h3 className="text-[14px] font-semibold text-slate-900">Damaged Materials Summary</h3>
          </div>
          <p className="mt-0.5 text-[12px] text-slate-500">Materials flagged as damaged from returns or transit.</p>
        </div>
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
      </section>

      {/* ── Most Used Materials ────────────────────────────────────────────── */}
      <section className="overflow-hidden  border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <h3 className="text-[14px] font-semibold text-slate-900">Most Used Materials</h3>
          </div>
          <p className="mt-0.5 text-[12px] text-slate-500">Top materials by usage across all orders this month.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-slate-200 bg-white">
              <tr className="text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Material</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium text-right">Usage</th>
              </tr>
            </thead>
            <tbody>
              {mostUsedMaterials.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60">
                  <td className="px-5 py-3 text-[13px] font-semibold text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3 text-[13px] font-medium text-slate-900">{item.itemName}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-slate-500">{item.sku}</td>
                  <td className="px-4 py-3 text-right text-[13px] font-semibold text-slate-900">
                    {item.usageCount} <span className="font-normal text-slate-500">{item.unit}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Approvals + Deliveries ────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="overflow-hidden  border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-violet-600" />
              <h3 className="text-[14px] font-semibold text-slate-900">Pending Approvals</h3>
            </div>
            <p className="mt-0.5 text-[12px] text-slate-500">Orders waiting for your action.</p>
          </div>
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
        </section>

        <section className="overflow-hidden  border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-sky-600" />
              <h3 className="text-[14px] font-semibold text-slate-900">Delivery Schedule</h3>
            </div>
            <p className="mt-0.5 text-[12px] text-slate-500">Upcoming shipments this week.</p>
          </div>
          <div className="divide-y divide-slate-100">
            {deliverySchedule.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-[13px] font-medium text-slate-900">{item.product}</p>
                  <p className="text-[11px] text-slate-500">{item.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-medium text-slate-700">{item.scheduledDate}</p>
                  <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    item.status === "Ready" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  }`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
