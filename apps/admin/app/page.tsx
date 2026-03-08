"use client";

import React from "react";
import { 
  Box, LogOut, Bell, LayoutDashboard, UserSquare2, RefreshCcw,
  DollarSign, ShoppingBag, ArrowUpRight, ArrowDownRight, Package,
  AlertTriangle, Clock, MapPin
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts";

const performanceData = [
  { name: 'Jan', revenue: 200000, profit: 50000 },
  { name: 'Feb', revenue: 180000, profit: 45000 },
  { name: 'Mar', revenue: 250000, profit: 70000 },
  { name: 'Apr', revenue: 280000, profit: 80000 },
  { name: 'May', revenue: 300000, profit: 85000 },
  { name: 'Jun', revenue: 270000, profit: 75000 },
  { name: 'Jul', revenue: 320000, profit: 90000 },
  { name: 'Aug', revenue: 340000, profit: 95000 },
  { name: 'Sep', revenue: 310000, profit: 88000 },
  { name: 'Oct', revenue: 350000, profit: 100000 },
  { name: 'Nov', revenue: 320000, profit: 92000 },
  { name: 'Dec', revenue: 400000, profit: 110000 },
];

const categoryData = [
  { name: 'Tiles', value: 35, color: '#6366f1' },      // Indigo
  { name: 'Granite', value: 25, color: '#10b981' },    // Emerald
  { name: 'Marble', value: 20, color: '#f59e0b' },     // Amber
  { name: 'Fixtures', value: 12, color: '#3b82f6' },   // Blue
  { name: 'Others', value: 8, color: '#8b5cf6' },      // Violet
];

export default function ExecutiveDashboard() {
  return (
    <div className="min-h-screen flex bg-[#fcfcfc] text-[#2d2d2d] font-sans">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-[#e5e7eb] flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo Area */}
          <div className="h-[64px] px-6 flex items-center border-b border-[#e5e7eb]">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white text-[11px] font-bold tracking-wider">S&I</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold leading-tight text-navy block">Sales & Inventory</span>
                <span className="text-[10px] text-muted">Management System</span>
              </div>
            </div>
          </div>

          {/* User Profile Info */}
          <div className="px-6 py-6 border-b border-[#e5e7eb]">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <span className="text-indigo-600 font-bold text-[13px]">KA</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-charcoal leading-tight">Karen Alonzo</span>
                <span className="text-[11px] text-muted">Executive & Management</span>
              </div>
            </div>
            <div className="w-full bg-indigo-50 border border-indigo-100 rounded-md py-2 px-3 flex items-center space-x-2 text-indigo-600">
              <UserSquare2 className="w-4 h-4 shrink-0" />
              <span className="text-[12px] font-medium text-indigo-700">Executive Access</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="px-4 py-6">
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wider px-2 mb-3 block">
              Your Dashboard
            </span>
            <nav className="space-y-1">
              <a href="#" className="flex items-center space-x-3 bg-navy text-white px-3 py-2.5 rounded-lg group transition-colors">
                <LayoutDashboard className="w-[18px] h-[18px] opacity-90" />
                <span className="text-[13px] font-medium">Executive Dashboard</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Footer Sidebar */}
        <div className="px-6 py-5 border-t border-[#e5e7eb]">
          <a href="http://localhost:3000/sign-in" className="flex items-center space-x-3 text-coral hover:opacity-80 transition-opacity w-full">
            <LogOut className="w-[18px] h-[18px]" />
            <span className="text-[13px] font-medium">Sign Out</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-[64px] bg-white border-b border-[#e5e7eb] px-8 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[14px] font-medium text-charcoal">Welcome, Karen</span>
          </div>
          <div className="flex items-center space-x-5">
            <button className="relative text-muted hover:text-charcoal transition-colors">
              <Bell className="w-[20px] h-[20px]" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-coral rounded-full ring-2 ring-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center cursor-pointer">
              <span className="text-indigo-600 font-bold text-[11px]">KA</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-8">
          {/* Dashboard Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h1 className="text-[24px] font-semibold text-navy leading-tight mb-1">Executive Dashboard</h1>
              <p className="text-[13px] text-muted">Welcome back, Karen. Here's your business overview.</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-white border border-[#e5e7eb] rounded-lg p-1">
                <button className="px-4 py-1.5 text-[12px] font-medium text-charcoal hover:bg-slate-50 rounded-md transition-colors">Daily</button>
                <button className="px-4 py-1.5 text-[12px] font-medium bg-navy text-white rounded-md shadow-sm">Monthly</button>
              </div>
              <button className="p-2 bg-white border border-[#e5e7eb] rounded-lg text-muted hover:text-charcoal hover:bg-slate-50 transition-colors">
                <RefreshCcw className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {/* Revenue */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col">
                  <span className="text-[12px] font-medium text-muted mb-1">Total Revenue</span>
                  <span className="text-[24px] font-bold text-navy">₱780,000</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <div className="flex items-center text-[12px]">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                <span className="text-emerald-500 font-medium">+12.5%</span>
                <span className="text-muted ml-1.5">vs last month</span>
              </div>
            </div>

            {/* Sales */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col">
                  <span className="text-[12px] font-medium text-muted mb-1">Total Sales</span>
                  <span className="text-[24px] font-bold text-navy">324</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
              <div className="flex items-center text-[12px]">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                <span className="text-emerald-500 font-medium">+8.2%</span>
                <span className="text-muted ml-1.5">vs last month</span>
              </div>
            </div>

            {/* Profit Margin */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col">
                  <span className="text-[12px] font-medium text-muted mb-1">Profit Margin</span>
                  <span className="text-[24px] font-bold text-navy">33.3%</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              <div className="flex items-center text-[12px]">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                <span className="text-emerald-500 font-medium">+2.1%</span>
                <span className="text-muted ml-1.5">vs last month</span>
              </div>
            </div>

            {/* Inventory Value */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col">
                  <span className="text-[12px] font-medium text-muted mb-1">Inventory Value</span>
                  <span className="text-[24px] font-bold text-navy">₱2.4M</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <div className="flex items-center text-[12px]">
                <ArrowDownRight className="w-3.5 h-3.5 text-coral mr-1" />
                <span className="text-coral font-medium">-3.4%</span>
                <span className="text-muted ml-1.5">vs last month</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            {/* Main Chart */}
            <div className="lg:col-span-2 bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[14px] font-medium text-navy">Revenue & Profit Trend</h3>
                <span className="text-[11px] text-muted">Last 12 months</span>
              </div>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(value) => `₱${value/1000}k`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                      labelStyle={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm flex flex-col">
              <div className="mb-2">
                <h3 className="text-[14px] font-medium text-navy">Sales by Category</h3>
              </div>
              <div className="flex-1 flex flex-col justify-center items-center relative min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 500, color: '#1a1a2e' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
                {categoryData.map((item, i) => (
                  <div key={i} className="flex items-center text-[10px]">
                    <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: item.color }}></span>
                    <span className="text-charcoal font-medium mr-1">{item.name}</span>
                    <span className="text-muted">({item.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom 4 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Low Stock Alerts */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-2 text-amber-500">
                  <AlertTriangle className="w-[16px] h-[16px]" />
                  <h3 className="text-[14px] font-medium text-navy">Low Stock Alerts</h3>
                </div>
                <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">5 items</span>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Italian Marble 60x60", loc: "Main", left: 12, min: 50 },
                  { name: "Granite Black Galaxy", loc: "Branch A", left: 8, min: 30 },
                  { name: "Porcelain Tile White", loc: "Main", left: 15, min: 40 },
                  { name: "Mosaic Tile Blue", loc: "Branch B", left: 5, min: 25 },
                  { name: "Cement Board 4x8", loc: "Main", left: 20, min: 60 }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center pb-3 border-b border-[#f3f4f6] last:border-0 last:pb-0">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-medium text-charcoal truncate max-w-[120px]">{item.name}</span>
                      <span className="text-[10px] text-muted">{item.loc}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[12px] font-bold text-coral">{item.left} left</span>
                      <span className="text-[10px] text-muted">Min: {item.min}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Orders */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
               <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-2 text-indigo-500">
                  <Clock className="w-[16px] h-[16px]" />
                  <h3 className="text-[14px] font-medium text-navy">Pending Orders</h3>
                </div>
                <a href="#" className="text-[11px] font-medium text-indigo-500 hover:text-indigo-600">View all ↗</a>
              </div>
              <div className="space-y-4">
                {[
                  { id: "ORD-2024-0091", cust: "ADC Construction", val: "245,000", status: "Processing", color: "text-blue-600", bg: "bg-blue-50" },
                  { id: "ORD-2024-0090", cust: "Vista Homes Inc.", val: "189,000", status: "Awaiting Payment", color: "text-amber-600", bg: "bg-amber-50" },
                  { id: "ORD-2024-0089", cust: "Golden Builders", val: "320,000", status: "Ready for Delivery", color: "text-emerald-600", bg: "bg-emerald-50" },
                  { id: "ORD-2024-0088", cust: "Perez Dev Corp", val: "156,000", status: "Processing", color: "text-blue-600", bg: "bg-blue-50" }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center pb-3 border-b border-[#f3f4f6] last:border-0 last:pb-0">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-medium text-charcoal">{item.id}</span>
                      <span className="text-[10px] text-muted truncate max-w-[100px]">{item.cust}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[12px] font-bold text-navy mb-0.5">₱{item.val}</span>
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${item.bg} ${item.color}`}>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Receivables */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
              <div className="flex items-center mb-5">
                <Box className="w-[16px] h-[16px] text-emerald-500 mr-2" />
                <h3 className="text-[14px] font-medium text-navy">Receivables</h3>
              </div>
              <div className="flex flex-col space-y-5">
                <div className="flex justify-between items-center pb-3 border-b border-[#f3f4f6]">
                  <span className="text-[12.5px] font-medium text-charcoal">Total Outstanding</span>
                  <span className="text-[13px] font-bold text-navy">₱1,245,000</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[#f3f4f6]">
                  <span className="text-[12.5px] font-medium text-charcoal">Due This Week</span>
                  <span className="text-[13px] font-bold text-coral">₱385,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[12.5px] font-medium text-charcoal">Overdue</span>
                  <span className="text-[13px] font-bold text-coral">₱120,000</span>
                </div>
              </div>
            </div>

            {/* Upcoming Deliveries */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
               <div className="flex items-center mb-5 hover:opacity-80 transition-opacity cursor-pointer">
                <MapPin className="w-[16px] h-[16px] text-blue-500 mr-2" />
                <h3 className="text-[14px] font-medium text-navy">Upcoming Deliveries</h3>
              </div>
              <div className="space-y-4">
                {[
                  { id: "DEL-441", dest: "Quezon City - 24 items", time: "Today, 2:00 PM" },
                  { id: "DEL-442", dest: "Makati - 16 items", time: "Today, 4:30 PM" },
                  { id: "DEL-443", dest: "Pasig - 32 items", time: "Tomorrow, 9:00 AM" }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-start pb-3 border-b border-[#f3f4f6] last:border-0 last:pb-0">
                    <div className="flex flex-col">
                      <span className="text-[12.5px] font-medium text-charcoal">{item.id}</span>
                      <span className="text-[10.5px] text-muted truncate max-w-[110px]">{item.dest}</span>
                    </div>
                    <div className="text-[10px] font-medium text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
