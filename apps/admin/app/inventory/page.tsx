"use client";

import React, { useState } from "react";
import { 
  Building2, ArrowLeftRight, History, 
  Box, LogOut, Bell, UserSquare2, Search, Filter
} from "lucide-react";

export default function InventoryDashboard() {
  const [activeTab, setActiveTab] = useState("locations");

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
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-blue-600 font-bold text-[13px]">MS</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-charcoal leading-tight">Marco Santos</span>
                <span className="text-[11px] text-muted">Inventory & Warehouse</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 border border-slate-200 rounded-md py-2 px-3 flex items-center space-x-2 text-slate-700">
              <UserSquare2 className="w-4 h-4 shrink-0" />
              <span className="text-[12px] font-medium">Warehouse Access</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="px-4 py-6">
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wider px-2 mb-3 block">
              Your Dashboard
            </span>
            <nav className="space-y-1">
              <a href="#" className="flex items-center space-x-3 bg-black text-white px-3 py-2.5 rounded-lg group transition-colors">
                <Building2 className="w-[18px] h-[18px] opacity-90" />
                <span className="text-[13px] font-medium">Inventory & Warehouse</span>
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
            <span className="text-[14px] font-medium text-charcoal">Welcome, Marco</span>
          </div>
          <div className="flex items-center space-x-5">
            <button className="relative text-muted hover:text-charcoal transition-colors">
              <Bell className="w-[20px] h-[20px]" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer">
              <span className="text-blue-600 font-bold text-[11px]">MS</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-8">
          {/* Dashboard Header */}
          <div className="mb-6">
            <h1 className="text-[24px] font-semibold text-charcoal leading-tight mb-1">Inventory & Warehouse Management</h1>
            <p className="text-[13px] text-muted">Multi-warehouse views, stock transfers, and audit tracking.</p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-white border border-[#e5e7eb] rounded-lg p-1.5 mb-8 w-fit inline-flex">
            <button 
              onClick={() => setActiveTab("locations")}
              className={`px-5 py-2 text-[13px] font-medium rounded-md transition-all ${activeTab === "locations" ? "bg-black text-white shadow" : "text-muted hover:text-charcoal"}`}>
              <div className="flex items-center space-x-2">
                <Building2 className="w-[14px] h-[14px]" />
                <span>Warehouse Locations</span>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab("transfers")}
              className={`px-5 py-2 text-[13px] font-medium rounded-md transition-all ${activeTab === "transfers" ? "bg-black text-white shadow" : "text-muted hover:text-charcoal"}`}>
              <div className="flex items-center space-x-2">
                <ArrowLeftRight className="w-[14px] h-[14px]" />
                <span>Stock Transfers</span>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab("audit")}
              className={`px-5 py-2 text-[13px] font-medium rounded-md transition-all ${activeTab === "audit" ? "bg-black text-white shadow" : "text-muted hover:text-charcoal"}`}>
              <div className="flex items-center space-x-2">
                <History className="w-[14px] h-[14px]" />
                <span>Audit Logs</span>
              </div>
            </button>
          </div>

          {/* MVP Content - Locations */}
          {activeTab === "locations" && (
            <div className="space-y-6">
              {/* Warehouse KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Warehouse */}
                <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-[14px] font-bold text-charcoal flex items-center">
                        <Building2 className="w-4 h-4 mr-2 text-blue-500" />
                        Main Warehouse
                      </h3>
                      <p className="text-[11px] text-muted ml-6">Quezon City</p>
                    </div>
                    <span className="text-[10px] text-muted bg-slate-100 px-2 py-1 rounded">WH-MAIN</span>
                  </div>
                  <div className="flex justify-between items-end mb-4">
                     <div>
                       <span className="text-[11px] text-muted block mb-1">Items</span>
                       <span className="text-[18px] font-bold font-mono">1,240</span>
                     </div>
                     <div className="text-right">
                       <span className="text-[11px] text-muted block mb-1">Value</span>
                       <span className="text-[16px] font-bold text-emerald-600">₱4.8M</span>
                     </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1 text-[11px]">
                      <span className="text-muted">Capacity</span>
                      <span className="font-medium text-orange-500">85%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-orange-500 h-full rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Branch A */}
                <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-[14px] font-bold text-charcoal flex items-center">
                        <Building2 className="w-4 h-4 mr-2 text-blue-500" />
                        Branch A
                      </h3>
                      <p className="text-[11px] text-muted ml-6">Makati</p>
                    </div>
                    <span className="text-[10px] text-muted bg-slate-100 px-2 py-1 rounded">WH-BR-A</span>
                  </div>
                  <div className="flex justify-between items-end mb-4">
                     <div>
                       <span className="text-[11px] text-muted block mb-1">Items</span>
                       <span className="text-[18px] font-bold font-mono">680</span>
                     </div>
                     <div className="text-right">
                       <span className="text-[11px] text-muted block mb-1">Value</span>
                       <span className="text-[16px] font-bold text-emerald-600">₱2.1M</span>
                     </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1 text-[11px]">
                      <span className="text-muted">Capacity</span>
                      <span className="font-medium text-blue-500">72%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Branch B */}
                <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-[14px] font-bold text-charcoal flex items-center">
                        <Building2 className="w-4 h-4 mr-2 text-blue-500" />
                        Branch B
                      </h3>
                      <p className="text-[11px] text-muted ml-6">Pasig</p>
                    </div>
                    <span className="text-[10px] text-muted bg-slate-100 px-2 py-1 rounded">WH-BR-B</span>
                  </div>
                  <div className="flex justify-between items-end mb-4">
                     <div>
                       <span className="text-[11px] text-muted block mb-1">Items</span>
                       <span className="text-[18px] font-bold font-mono">450</span>
                     </div>
                     <div className="text-right">
                       <span className="text-[11px] text-muted block mb-1">Value</span>
                       <span className="text-[16px] font-bold text-emerald-600">₱1.6M</span>
                     </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1 text-[11px]">
                      <span className="text-muted">Capacity</span>
                      <span className="font-medium text-blue-500">54%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '54%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#e5e7eb] flex items-center justify-between">
                  <h3 className="text-[15px] font-bold text-charcoal">Main Warehouse Inventory</h3>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                       <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                       <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 border border-[#e5e7eb] rounded-md text-[12px] focus:outline-none focus:border-black" />
                    </div>
                    <button className="p-2 border border-[#e5e7eb] rounded-md hover:bg-slate-50">
                      <Filter className="w-4 h-4 text-muted" />
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px]">
                    <thead className="bg-slate-50 text-[11px] text-muted uppercase font-semibold">
                      <tr>
                        <th className="px-5 py-3 font-medium">Product</th>
                        <th className="px-5 py-3 font-medium">SKU</th>
                        <th className="px-5 py-3 font-medium">Category</th>
                        <th className="px-5 py-3 font-medium text-right">Quantity</th>
                        <th className="px-5 py-3 font-medium text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e7eb]">
                      {[
                        { name: "Italian Marble 60x60", sku: "MAR-IT-60", cat: "Marble", qty: "120", status: "In Stock" },
                        { name: "Porcelain Tile Matte White", sku: "POR-MW-60", cat: "Tiles", qty: "200", status: "In Stock" },
                        { name: "Ceramic Floor Beige", sku: "CER-FB-45", cat: "Tiles", qty: "350", status: "In Stock" },
                        { name: "Cement Board 4x8", sku: "CMT-BD-48", cat: "Others", qty: "20", status: "Low Stock" },
                        { name: "Natural Stone Travertine", sku: "NST-TR-60", cat: "Stone", qty: "45", status: "In Stock" },
                        { name: "Grout White 25kg", sku: "GRT-WH-25", cat: "Others", qty: "180", status: "In Stock" },
                      ].map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="px-5 py-4 font-medium text-charcoal">{item.name}</td>
                          <td className="px-5 py-4 text-muted font-mono text-[12px]">{item.sku}</td>
                          <td className="px-5 py-4 text-muted">{item.cat}</td>
                          <td className="px-5 py-4 text-charcoal font-bold text-right font-mono">{item.qty}</td>
                          <td className="px-5 py-4 text-right">
                             <span className={`text-[11px] font-medium px-2 py-1 rounded bg-transparent ${item.status === 'In Stock' ? 'text-emerald-600' : 'text-orange-500'}`}>
                               {item.status}
                             </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "locations" && (
             <div className="bg-white border border-[#e5e7eb] border-dashed rounded-xl p-12 text-center text-muted">
                Detailed view for {activeTab} tab will go here.
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
