"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Bell, TrendingUp, TrendingDown } from "lucide-react";
import { 
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from "recharts";

const financialData = [
  { name: 'Jan', revenue: 750000, expenses: 400000 },
  { name: 'Feb', revenue: 680000, expenses: 420000 },
  { name: 'Mar', revenue: 820000, expenses: 380000 },
  { name: 'Apr', revenue: 850000, expenses: 450000 },
  { name: 'May', revenue: 900000, expenses: 480000 },
  { name: 'Jun', revenue: 830000, expenses: 410000 },
  { name: 'Jul', revenue: 920000, expenses: 500000 },
  { name: 'Aug', revenue: 950000, expenses: 520000 },
  { name: 'Sep', revenue: 880000, expenses: 470000 },
  { name: 'Oct', revenue: 940000, expenses: 490000 },
  { name: 'Nov', revenue: 910000, expenses: 460000 },
  { name: 'Dec', revenue: 1100000, expenses: 550000 },
];

function AnalyticsDashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "cashflow";

  return (
    <div className="min-h-screen flex bg-[#fcfcfc] text-[#2d2d2d] font-sans">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-[64px] bg-white border-b border-[#e5e7eb] px-8 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[14px] font-medium text-charcoal">Welcome, Ana</span>
          </div>
          <div className="flex items-center space-x-5">
            <button className="relative text-muted hover:text-charcoal transition-colors">
              <Bell className="w-[20px] h-[20px]" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center cursor-pointer">
              <span className="text-purple-600 font-bold text-[11px]">AC</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-8">
          {/* Dashboard Header */}
          <div className="mb-6">
            <h1 className="text-[24px] font-semibold text-charcoal leading-tight mb-1">Reporting & Analytics</h1>
            <p className="text-[13px] text-muted">Financial statements, project costing, and business forecasting.</p>
          </div>

          {/* MVP Content - Cash Flow & Financials */}
          {activeTab === "cashflow" && (
             <div className="space-y-6">
               {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Net Profit */}
                <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
                  <div className="flex flex-col mb-4">
                    <span className="text-[12px] font-medium text-muted mb-1">Net Profit</span>
                    <span className="text-[24px] font-bold text-black">₱3,215,800</span>
                  </div>
                  <div className="flex items-center text-[12px]">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                    <span className="text-emerald-500 font-medium">+12.5%</span>
                  </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
                  <div className="flex flex-col mb-4">
                    <span className="text-[12px] font-medium text-muted mb-1">Total Revenue</span>
                    <span className="text-[24px] font-bold text-black">₱8,540,200</span>
                  </div>
                  <div className="flex items-center text-[12px]">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                    <span className="text-emerald-500 font-medium">+8.2%</span>
                  </div>
                </div>

                {/* Total Expenses */}
                <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
                  <div className="flex flex-col mb-4">
                    <span className="text-[12px] font-medium text-muted mb-1">Total Expenses</span>
                    <span className="text-[24px] font-bold text-black">₱5,324,400</span>
                  </div>
                  <div className="flex items-center text-[12px]">
                    <TrendingDown className="w-3.5 h-3.5 text-red-500 mr-1" />
                    <span className="text-red-500 font-medium">+5.4%</span>
                  </div>
                </div>

                {/* Net Margin */}
                <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
                   <div className="flex flex-col mb-4">
                    <span className="text-[12px] font-medium text-muted mb-1">Net Margin</span>
                    <span className="text-[24px] font-bold text-black">37.6%</span>
                  </div>
                  <div className="flex items-center text-[12px]">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                    <span className="text-emerald-500 font-medium">+2.1%</span>
                  </div>
                </div>
              </div>

              {/* Monthly Revenue vs. Expenses Chart */}
              <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm w-full">
                <div className="mb-6">
                  <h3 className="text-[15px] font-bold text-charcoal">Monthly Revenue vs. Expenses</h3>
                  <p className="text-[12px] text-muted">Year-to-date analysis</p>
                </div>
                <div className="h-[350px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={financialData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                      barSize={16}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(value) => `₱${value/1000}k`} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                        labelStyle={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}
                        formatter={(value: number) => `₱${value.toLocaleString()}`}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                      <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

             </div>
          )}

          {activeTab !== "cashflow" && (
             <div className="bg-white border border-[#e5e7eb] border-dashed rounded-xl p-12 text-center text-muted">
                Detailed view for {activeTab} tab will go here.
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AnalyticsDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcfcfc]"></div>}>
      <AnalyticsDashboardContent />
    </Suspense>
  );
}
