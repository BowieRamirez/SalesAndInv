"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Bell } from "lucide-react";

function AccountingDashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "auto-compute";

  return (
    <div className="min-h-screen flex bg-[#fcfcfc] text-[#2d2d2d] font-sans">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-[64px] bg-white border-b border-[#e5e7eb] px-8 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[14px] font-medium text-charcoal">Welcome, Twin</span>
          </div>
          <div className="flex items-center space-x-5">
            <button className="relative text-muted hover:text-charcoal transition-colors">
              <Bell className="w-[20px] h-[20px]" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center cursor-pointer">
              <span className="text-orange-600 font-bold text-[11px]">TR</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-8">
          {/* Dashboard Header */}
          <div className="mb-6">
            <h1 className="text-[24px] font-semibold text-charcoal leading-tight mb-1">Accounting & Financial Controls</h1>
            <p className="text-[13px] text-muted">Manage computations, payments, approvals, and document generation.</p>
          </div>

          {/* MVP Content - Auto Compute */}
          {activeTab === "auto-compute" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl mt-4">
              {/* Left Form */}
              <div className="bg-white border border-[#e5e7eb] rounded-xl p-8 shadow-sm">
                <h3 className="text-[14px] font-medium text-charcoal mb-6">VAT, Discount & Profit Calculator</h3>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[12px] font-medium text-charcoal/70">Subtotal (₱)</label>
                    <input type="number" placeholder="Enter amount" className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg text-[13px] focus:outline-none focus:border-black" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[12px] font-medium text-charcoal/70">Discount (%)</label>
                    <input type="number" placeholder="%" defaultValue="0" className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg text-[13px] focus:outline-none focus:border-black" />
                  </div>

                  <div className="flex items-center justify-between pt-4 pb-2 border-b border-[#f3f4f6]">
                    <span className="text-[13px] font-medium text-charcoal">Include 12% VAT</span>
                    <div className="w-10 h-5 bg-black rounded-full relative cursor-pointer">
                      <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Summary */}
              <div className="bg-white border border-[#e5e7eb] rounded-xl p-8 shadow-sm">
                <h3 className="text-[14px] font-medium text-charcoal mb-6">Computation Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-[#f3f4f6]">
                    <span className="text-[12.5px] text-muted">Subtotal</span>
                    <span className="text-[13px] font-medium text-charcoal">₱0.00</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-[#f3f4f6]">
                    <span className="text-[12.5px] text-muted">Discount (0%)</span>
                    <span className="text-[13px] font-medium text-red-500">- ₱0.00</span>
                  </div>
                   <div className="flex justify-between items-center pb-3 border-b border-[#f3f4f6]">
                    <span className="text-[12.5px] text-muted">After Discount</span>
                    <span className="text-[13px] font-medium text-charcoal">₱0.00</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-black">
                    <span className="text-[12.5px] text-muted">VAT (12%)</span>
                    <span className="text-[13px] font-medium text-charcoal">+ ₱0.00</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[14px] font-semibold text-charcoal">Total Amount</span>
                    <span className="text-[18px] font-bold text-black">₱0.00</span>
                  </div>

                  <div className="flex justify-between items-center mt-6 p-3 bg-emerald-50 rounded-lg">
                    <span className="text-[11px] font-medium text-emerald-700">Est. Profit Margin</span>
                     <span className="text-[12px] font-bold text-emerald-600">0.0%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "auto-compute" && (
             <div className="bg-white border border-[#e5e7eb] border-dashed rounded-xl p-12 text-center text-muted mt-4">
                Detailed view for {activeTab} tab will go here.
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AccountingDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcfcfc]"></div>}>
      <AccountingDashboardContent />
    </Suspense>
  );
}
