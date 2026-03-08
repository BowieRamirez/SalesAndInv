"use client";

import React, { useState } from "react";
import { 
  Box, LogOut, Bell, UserSquare2,
  FileEdit, Search, ListTodo, ClipboardList
} from "lucide-react";

export default function SalesDashboard() {
  const [activeTab, setActiveTab] = useState("lead");

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
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <span className="text-emerald-700 font-bold text-[13px]">GRG</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-charcoal leading-tight">Genie Rose Gonzales</span>
                <span className="text-[11px] text-muted">Sales & Quotation</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 border border-slate-200 rounded-md py-2 px-3 flex items-center space-x-2 text-slate-700">
              <UserSquare2 className="w-4 h-4 shrink-0" />
              <span className="text-[12px] font-medium">Sales Access</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="px-4 py-6">
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wider px-2 mb-3 block">
              Your Dashboard
            </span>
            <nav className="space-y-1">
              <a href="#" className="flex items-center space-x-3 bg-black text-white px-3 py-2.5 rounded-lg group transition-colors">
                <FileEdit className="w-[18px] h-[18px] opacity-90" />
                <span className="text-[13px] font-medium">Sales & Quotation</span>
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

          {/* Tabs */}
          <div className="flex space-x-1 bg-white border border-[#e5e7eb] rounded-lg p-1.5 mb-8 w-fit inline-flex">
            <button 
              onClick={() => setActiveTab("lead")}
              className={`px-5 py-2 text-[13px] font-medium rounded-md transition-all ${activeTab === "lead" ? "bg-black text-white shadow" : "text-muted hover:text-charcoal"}`}>
              <div className="flex items-center space-x-2">
                <FileEdit className="w-[14px] h-[14px]" />
                <span>Lead Intake</span>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab("quotes")}
              className={`px-5 py-2 text-[13px] font-medium rounded-md transition-all ${activeTab === "quotes" ? "bg-black text-white shadow" : "text-muted hover:text-charcoal"}`}>
              <div className="flex items-center space-x-2">
                <ClipboardList className="w-[14px] h-[14px]" />
                <span>Quotations</span>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab("inventory")}
              className={`px-5 py-2 text-[13px] font-medium rounded-md transition-all ${activeTab === "inventory" ? "bg-black text-white shadow" : "text-muted hover:text-charcoal"}`}>
              <div className="flex items-center space-x-2">
                <Search className="w-[14px] h-[14px]" />
                <span>Inventory Check</span>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab("crm")}
              className={`px-5 py-2 text-[13px] font-medium rounded-md transition-all ${activeTab === "crm" ? "bg-black text-white shadow" : "text-muted hover:text-charcoal"}`}>
              <div className="flex items-center space-x-2">
                <ListTodo className="w-[14px] h-[14px]" />
                <span>CRM Tracker</span>
              </div>
            </button>
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
