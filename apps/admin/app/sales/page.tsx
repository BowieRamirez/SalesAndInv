"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Bell } from "lucide-react";

function SalesDashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "lead";

  return (
    <div className="min-h-screen flex bg-[#fcfcfc] text-[#2d2d2d] font-sans">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-[64px] bg-white border-b border-[#e5e7eb] px-8 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[14px] font-medium text-charcoal">Welcome, Genie</span>
          </div>
          <div className="flex items-center space-x-5">
            <button className="relative text-muted hover:text-charcoal transition-colors">
              <Bell className="w-[20px] h-[20px]" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center cursor-pointer">
              <span className="text-emerald-700 font-bold text-[11px]">GRG</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-8">
          {/* Dashboard Header */}
          <div className="mb-6">
            <h1 className="text-[24px] font-semibold text-charcoal leading-tight mb-1">Sales & Quotation Tracker</h1>
            <p className="text-[13px] text-muted">Manage new leads, generate quotes, and track conversions.</p>
          </div>

          {/* Lead Intake Form MVP Content */}
          {activeTab === "lead" && (
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 lg:p-8 max-w-4xl shadow-sm">
              <h3 className="text-[16px] font-semibold border-b border-[#f3f4f6] pb-4 mb-6">New Client Registration</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 col-span-1 md:col-span-2">
                  <label className="text-[13px] font-medium text-charcoal block">Client / Company Name</label>
                  <input type="text" placeholder="Enter company name" className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[13px] focus:outline-none focus:border-black" />
                </div>
                
                <div className="space-y-4">
                  <label className="text-[13px] font-medium text-charcoal block">Contact Person</label>
                  <input type="text" placeholder="Full name" className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[13px] focus:outline-none focus:border-black" />
                </div>
                
                <div className="space-y-4">
                  <label className="text-[13px] font-medium text-charcoal block">Phone Number</label>
                  <input type="text" placeholder="+63 9XX XXX XXXX" className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[13px] focus:outline-none focus:border-black" />
                </div>

                <div className="space-y-4 col-span-1 md:col-span-2">
                  <label className="text-[13px] font-medium text-charcoal block">Project Location</label>
                  <input type="text" placeholder="Full address" className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[13px] focus:outline-none focus:border-black" />
                </div>

                <div className="pt-6 col-span-1 md:col-span-2 flex justify-end space-x-4">
                  <button type="button" className="px-6 py-2.5 text-[13px] font-medium text-charcoal border border-[#e5e7eb] rounded-lg hover:bg-slate-50 transition-colors">
                    Save as Draft
                  </button>
                  <button type="button" className="px-6 py-2.5 text-[13px] font-medium text-white bg-black rounded-lg hover:bg-black/90 transition-colors">
                    Submit Lead
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab !== "lead" && (
             <div className="bg-white border border-[#e5e7eb] border-dashed rounded-xl p-12 text-center text-muted">
                Detailed view for {activeTab} tab will go here.
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SalesDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcfcfc]"></div>}>
      <SalesDashboardContent />
    </Suspense>
  );
}
