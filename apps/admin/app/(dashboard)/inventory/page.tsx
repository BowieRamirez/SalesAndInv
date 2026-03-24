"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Building2, Bell, Search, Filter
} from "lucide-react";

function InventoryDashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "locations";

  return (
    <div className="min-h-screen flex bg-[#fcfcfc] text-[#2d2d2d] font-sans">
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
                    <button onClick={() => alert("Filter functionality will be available when database is connected.")} className="p-2 border border-[#e5e7eb] rounded-md hover:bg-slate-50">
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

          {/* Incoming Stocks MVP Content */}
          {activeTab === "stocks" && (
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 lg:p-8 max-w-4xl shadow-sm">
              <h3 className="text-[16px] font-semibold border-b border-[#f3f4f6] pb-4 mb-6">Receive Incoming Stocks</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 md:col-span-2">
                  <label className="text-[13px] font-medium text-charcoal block">Product Name / Description</label>
                  <input type="text" placeholder="Enter product name" className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[13px] focus:outline-none focus:border-black" />
                </div>
                
                <div className="space-y-4">
                  <label className="text-[13px] font-medium text-charcoal block">SKU</label>
                  <input type="text" placeholder="e.g. MAR-IT-60" className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[13px] focus:outline-none focus:border-black" />
                </div>
                
                <div className="space-y-4">
                  <label className="text-[13px] font-medium text-charcoal block">Category</label>
                  <select className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[13px] focus:outline-none focus:border-black bg-white">
                    <option value="">Select Category</option>
                    <option value="marble">Marble</option>
                    <option value="tiles">Tiles</option>
                    <option value="stone">Stone</option>
                    <option value="others">Others</option>
                  </select>
                </div>
                
                <div className="space-y-4">
                  <label className="text-[13px] font-medium text-charcoal block">Supplier / Vendor</label>
                  <input type="text" placeholder="Vendor name" className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[13px] focus:outline-none focus:border-black" />
                </div>

                <div className="space-y-4">
                  <label className="text-[13px] font-medium text-charcoal block">Quantity Received</label>
                  <input type="number" placeholder="0" className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[13px] focus:outline-none focus:border-black" />
                </div>

                <div className="space-y-4 md:col-span-2">
                  <label className="text-[13px] font-medium text-charcoal block">Additional Notes</label>
                  <textarea placeholder="Any observations, damages, or notes..." className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[13px] focus:outline-none focus:border-black min-h-[100px] resize-y"></textarea>
                </div>

                <div className="pt-6 md:col-span-2 flex justify-end space-x-4">
                  <button type="reset" onClick={() => alert("Form cleared.")} className="px-6 py-2.5 text-[13px] font-medium text-charcoal border border-[#e5e7eb] rounded-lg hover:bg-slate-50 transition-colors">
                    Clear Form
                  </button>
                  <button type="button" onClick={() => alert("Incoming stocks recorded successfully! (Static Demo)")} className="px-6 py-2.5 text-[13px] font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                    Add to Inventory
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* All Stocks MVP Content */}
          {activeTab === "all-stocks" && (
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-[#e5e7eb] flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-charcoal">All Inventory Stocks</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                     <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                     <input type="text" placeholder="Search products..." className="pl-9 pr-4 py-1.5 border border-[#e5e7eb] rounded-md text-[12px] focus:outline-none focus:border-black" />
                  </div>
                  <button onClick={() => alert("Filter functionality will be available when database is connected.")} className="p-2 border border-[#e5e7eb] rounded-md hover:bg-slate-50">
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
                      <th className="px-5 py-3 font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e7eb]">
                    {[
                      { name: "Italian Marble 60x60", sku: "MAR-IT-60", cat: "Marble", qty: "120" },
                      { name: "Porcelain Tile Matte White", sku: "POR-MW-60", cat: "Tiles", qty: "200" },
                      { name: "Ceramic Floor Beige", sku: "CER-FB-45", cat: "Tiles", qty: "350" },
                      { name: "Cement Board 4x8", sku: "CMT-BD-48", cat: "Others", qty: "20" },
                      { name: "Natural Stone Travertine", sku: "NST-TR-60", cat: "Stone", qty: "45" },
                      { name: "Grout White 25kg", sku: "GRT-WH-25", cat: "Others", qty: "180" },
                    ].map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="px-5 py-4 font-medium text-charcoal">{item.name}</td>
                        <td className="px-5 py-4 text-muted font-mono text-[12px]">{item.sku}</td>
                        <td className="px-5 py-4 text-muted">{item.cat}</td>
                        <td className="px-5 py-4 text-charcoal font-bold text-right font-mono">{item.qty}</td>
                        <td className="px-5 py-4 text-center">
                           <button onClick={() => alert(`Static Action: Add incoming stock for ${item.name}`)} className="text-[11px] font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors">
                             Add Stock
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Stock Transfers MVP Content */}
          {activeTab === "transfers" && (
            <div className="space-y-6">
              <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm">
                <h3 className="text-[16px] font-semibold border-b border-[#f3f4f6] pb-4 mb-6">Initiate Stock Transfer</h3>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[13px] font-medium text-charcoal block">Source Warehouse</label>
                    <select className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[13px] focus:outline-none focus:border-black bg-white">
                      <option value="">Select source...</option>
                      <option value="main">Main Warehouse</option>
                      <option value="branch-a">Branch A</option>
                      <option value="branch-b">Branch B</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[13px] font-medium text-charcoal block">Destination Warehouse</label>
                    <select className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[13px] focus:outline-none focus:border-black bg-white">
                      <option value="">Select destination...</option>
                      <option value="main">Main Warehouse</option>
                      <option value="branch-a">Branch A</option>
                      <option value="branch-b">Branch B</option>
                    </select>
                  </div>
                  <div className="space-y-4 md:col-span-2">
                    <label className="text-[13px] font-medium text-charcoal block">Product / Item to Transfer</label>
                    <select className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[13px] focus:outline-none focus:border-black bg-white">
                      <option value="">Search or select product...</option>
                      <option value="mar-it-60">Italian Marble 60x60 (MAR-IT-60)</option>
                      <option value="por-mw-60">Porcelain Tile Matte White (POR-MW-60)</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[13px] font-medium text-charcoal block">Quantity</label>
                    <input type="number" placeholder="0" className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[13px] focus:outline-none focus:border-black" />
                  </div>
                  <div className="space-y-4 md:col-span-2">
                    <label className="text-[13px] font-medium text-charcoal block">Transfer Notes</label>
                    <textarea placeholder="Reason for transfer, driver info..." className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[13px] focus:outline-none focus:border-black min-h-[80px] resize-y"></textarea>
                  </div>
                  <div className="pt-2 md:col-span-2 flex justify-end space-x-4">
                    <button type="reset" onClick={() => alert("Transfer form cleared.")} className="px-6 py-2.5 text-[13px] font-medium text-charcoal border border-[#e5e7eb] rounded-lg hover:bg-slate-50 transition-colors">
                      Clear Form
                    </button>
                    <button type="button" onClick={() => alert("Stock transfer initiated successfully! (Static Demo)")} className="px-6 py-2.5 text-[13px] font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                      Initiate Transfer
                    </button>
                  </div>
                </form>
              </div>

              {/* Recent Transfers Table */}
              <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#e5e7eb]">
                  <h3 className="text-[15px] font-bold text-charcoal">Recent Transfers</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px]">
                    <thead className="bg-slate-50 text-[11px] text-muted uppercase font-semibold">
                      <tr>
                        <th className="px-5 py-3 font-medium">Transfer ID</th>
                        <th className="px-5 py-3 font-medium">Item</th>
                        <th className="px-5 py-3 font-medium">Route</th>
                        <th className="px-5 py-3 font-medium text-right">Qty</th>
                        <th className="px-5 py-3 font-medium text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e7eb]">
                      {[
                        { id: "TRF-0012", item: "Italian Marble 60x60", route: "Main → Branch A", qty: "50", status: "In Transit" },
                        { id: "TRF-0011", item: "Porcelain Tile Matte White", route: "Branch B → Main", qty: "100", status: "Completed" },
                      ].map((t, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="px-5 py-4 font-mono text-[12px] text-blue-600">{t.id}</td>
                          <td className="px-5 py-4 font-medium text-charcoal">{t.item}</td>
                          <td className="px-5 py-4 text-muted">{t.route}</td>
                          <td className="px-5 py-4 text-charcoal font-bold text-right font-mono">{t.qty}</td>
                          <td className="px-5 py-4 text-right">
                             <span className={`text-[11px] font-medium px-2 py-1 rounded bg-transparent ${t.status === 'Completed' ? 'text-emerald-600' : 'text-blue-500'}`}>
                               {t.status}
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

          {/* Audit Logs MVP Content */}
          {activeTab === "audit" && (
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-[#e5e7eb] flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-charcoal">Inventory Audit & Activity Logs</h3>
                <div className="flex items-center space-x-3">
                  <button onClick={() => alert("Exporting audit logs to CSV... (Static Demo)")} className="px-4 py-1.5 border border-[#e5e7eb] rounded-md hover:bg-slate-50 text-[12px] font-medium text-charcoal">
                    Export CSV
                  </button>
                  <button onClick={() => alert("Filter functionality will be available when database is connected.")} className="p-2 border border-[#e5e7eb] rounded-md hover:bg-slate-50">
                    <Filter className="w-4 h-4 text-muted" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-slate-50 text-[11px] text-muted uppercase font-semibold">
                    <tr>
                      <th className="px-5 py-3 font-medium">Timestamp</th>
                      <th className="px-5 py-3 font-medium">User</th>
                      <th className="px-5 py-3 font-medium">Action</th>
                      <th className="px-5 py-3 font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e7eb]">
                    {[
                      { time: "Today, 10:42 AM", user: "Marco Santos", action: "Stock Added", details: "Added 120 qty of MAR-IT-60 to Main Warehouse" },
                      { time: "Today, 09:15 AM", user: "Marco Santos", action: "Transfer Initiated", details: "TRF-0012: 50 qty MAR-IT-60 from Main to Branch A" },
                      { time: "Yesterday, 04:30 PM", user: "System", action: "Low Stock Alert", details: "Cement Board 4x8 (CMT-BD-48) dropped below threshold (20 qty)" },
                      { time: "Yesterday, 02:10 PM", user: "Marco Santos", action: "Location Updated", details: "Moved POR-MW-60 from Zone A to Zone C in Main Warehouse" },
                    ].map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="px-5 py-4 text-muted text-[12px]">{log.time}</td>
                        <td className="px-5 py-4 font-medium text-charcoal">{log.user}</td>
                        <td className="px-5 py-4">
                          <span className="text-[12px] font-medium px-2 py-1 bg-slate-100 rounded text-slate-700">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-muted text-[12px]">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab !== "locations" && activeTab !== "stocks" && activeTab !== "all-stocks" && activeTab !== "transfers" && activeTab !== "audit" && (
             <div className="bg-white border border-[#e5e7eb] border-dashed rounded-xl p-12 text-center text-muted">
                Detailed view for {activeTab} tab will go here.
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function InventoryDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcfcfc]"></div>}>
      <InventoryDashboardContent />
    </Suspense>
  );
}
