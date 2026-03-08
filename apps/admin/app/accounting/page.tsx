"use client";

import React, { useState } from "react";
import { 
  Calculator, Receipt, CheckSquare, FileText, 
  Box, LogOut, Bell, UserSquare2
} from "lucide-react";

export default function AccountingDashboard() {
  const [activeTab, setActiveTab] = useState("auto-compute");

  return (
    <div className="min-h-screen flex bg-[#fcfcfc] text-[#2d2d2d] font-sans">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-[#e5e7eb] flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo Area */}
          <div className="h-[64px] px-6 flex items-center border-b border-[#e5e7eb]">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white text-[11px] font-bold tracking-wider">S&I</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold leading-tight text-black block">Sales & Inventory</span>
                <span className="text-[10px] text-muted">Management System</span>
              </div>
            </div>
          </div>

          {/* User Profile Info */}
          <div className="px-6 py-6 border-b border-[#e5e7eb]">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <span className="text-orange-600 font-bold text-[13px]">TR</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-charcoal leading-tight">Twin Reyes</span>
                <span className="text-[11px] text-muted">Accounting & Financial Controls</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 border border-slate-200 rounded-md py-2 px-3 flex items-center space-x-2 text-slate-700">
              <UserSquare2 className="w-4 h-4 shrink-0" />
              <span className="text-[12px] font-medium">Accounting Access</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="px-4 py-6">
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wider px-2 mb-3 block">
              Your Dashboard
            </span>
            <nav className="space-y-1">
              <a href="#" className="flex items-center space-x-3 bg-black text-white px-3 py-2.5 rounded-lg group transition-colors">
                <Calculator className="w-[18px] h-[18px] opacity-90" />
                <span className="text-[13px] font-medium">Accounting & Financial</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Footer Sidebar */}
        <div className="px-6 py-5 border-t border-[#e5e7eb]">
          <a href="http://localhost:3000/sign-in" className="flex items-center space-x-3 text-red-500 hover:opacity-80 transition-opacity w-full">
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

          {/* Tabs */}
          <div className="flex space-x-1 bg-white border border-[#e5e7eb] rounded-lg p-1.5 mb-8 w-fit inline-flex">
            <button 
              onClick={() => setActiveTab("auto-compute")}
              className={`px-5 py-2 text-[13px] font-medium rounded-md transition-all ${activeTab === "auto-compute" ? "bg-black text-white shadow" : "text-muted hover:text-charcoal"}`}>
              <div className="flex items-center space-x-2">
                <Calculator className="w-[14px] h-[14px]" />
                <span>Auto-Compute</span>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab("payments")}
              className={`px-5 py-2 text-[13px] font-medium rounded-md transition-all ${activeTab === "payments" ? "bg-black text-white shadow" : "text-muted hover:text-charcoal"}`}>
              <div className="flex items-center space-x-2">
                <Receipt className="w-[14px] h-[14px]" />
                <span>Payments</span>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab("approvals")}
              className={`px-5 py-2 text-[13px] font-medium rounded-md transition-all ${activeTab === "approvals" ? "bg-black text-white shadow" : "text-muted hover:text-charcoal"}`}>
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-[14px] h-[14px]" />
                <span>Approvals</span>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab("documents")}
              className={`px-5 py-2 text-[13px] font-medium rounded-md transition-all ${activeTab === "documents" ? "bg-black text-white shadow" : "text-muted hover:text-charcoal"}`}>
              <div className="flex items-center space-x-2">
                <FileText className="w-[14px] h-[14px]" />
                <span>Documents</span>
              </div>
            </button>
          </div>

          {/* MVP Content - Auto Compute */}
          {activeTab === "auto-compute" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl">
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
             <div className="bg-white border border-[#e5e7eb] border-dashed rounded-xl p-12 text-center text-muted">
                Detailed view for {activeTab} tab will go here.
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
