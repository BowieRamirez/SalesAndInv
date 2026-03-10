"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { 
  LayoutDashboard, LogOut, Box,
  Calculator, Receipt, CheckSquare, FileText,
  Building2, ArrowLeftRight, History,
  FileEdit, ClipboardList, Search, ListTodo,
  BarChart, PieChart, LineChart
} from "lucide-react";

const navConfigs: Record<string, any> = {
  '/accounting': {
    links: [
      { name: 'Auto-Compute', href: '/accounting?tab=auto-compute', icon: Calculator, tab: 'auto-compute' },
      { name: 'Payments', href: '/accounting?tab=payments', icon: Receipt, tab: 'payments' },
      { name: 'Approvals', href: '/accounting?tab=approvals', icon: CheckSquare, tab: 'approvals' },
      { name: 'Documents', href: '/accounting?tab=documents', icon: FileText, tab: 'documents' }
    ],
    profile: { name: 'Twin Reyes', initials: 'TR', role: 'Accounting & Financial Controls', color: 'bg-orange-500' }
  },
  '/inventory': {
    links: [
      { name: 'Warehouse Locations', href: '/inventory?tab=locations', icon: Building2, tab: 'locations' },
      { name: 'Stock Transfers', href: '/inventory?tab=transfers', icon: ArrowLeftRight, tab: 'transfers' },
      { name: 'Audit Logs', href: '/inventory?tab=audit', icon: History, tab: 'audit' }
    ],
    profile: { name: 'Marco Santos', initials: 'MS', role: 'Inventory & Warehouse', color: 'bg-blue-500' }
  },
  '/sales': {
    links: [
      { name: 'Lead Intake', href: '/sales?tab=lead', icon: FileEdit, tab: 'lead' },
      { name: 'Quotations', href: '/sales?tab=quotes', icon: ClipboardList, tab: 'quotes' },
      { name: 'Inventory Check', href: '/sales?tab=inventory', icon: Search, tab: 'inventory' },
      { name: 'CRM Tracker', href: '/sales?tab=crm', icon: ListTodo, tab: 'crm' }
    ],
    profile: { name: 'Genie Rose Gonzales', initials: 'GRG', role: 'Sales & Quotation', color: 'bg-emerald-500' }
  },
  '/analytics': {
    links: [
      { name: 'Cash Flow & Financials', href: '/analytics?tab=cashflow', icon: BarChart, tab: 'cashflow' },
      { name: 'Project Costing', href: '/analytics?tab=costing', icon: PieChart, tab: 'costing' },
      { name: 'Forecasting', href: '/analytics?tab=forecasting', icon: LineChart, tab: 'forecasting' }
    ],
    profile: { name: 'Ana Cruz', initials: 'AC', role: 'Reporting & Analytics', color: 'bg-purple-500' }
  },
  '/': {
    links: [
      { name: 'Executive Overview', href: '/', icon: LayoutDashboard }
    ],
    profile: { name: 'Karen Alonzo', initials: 'KA', role: 'Executive / Owner', color: 'bg-[#34384d]' }
  }
};

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const config = navConfigs[pathname] || navConfigs['/'];
  const { links, profile } = config;

  return (
    <>
      <aside className="w-[280px] bg-[#1a1c29] text-white flex flex-col justify-between hidden md:flex shrink-0 border-r border-[#2a2c3d]">
        <div>
          {/* Logo Area */}
          <Link href="/" className="h-[72px] px-6 flex items-center justify-between border-b-0 border-transparent hover:opacity-90">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-slate-700 bg-slate-800">
                <Box className="w-5 h-5 text-white" />
              </div>
              <span className="text-[14px] font-bold text-white tracking-widest uppercase">FURNITRACK</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="px-4 py-8">
            <nav className="space-y-1">
              {links.map((item: any) => {
                let isActive = false;
                if (pathname === '/') {
                  isActive = pathname === item.href;
                } else {
                  const currentTab = searchParams.get("tab") || links[0].tab;
                  isActive = item.tab === currentTab || pathname === item.href && !item.tab;
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors duration-200 group ${
                      isActive 
                        ? 'bg-[#252839] text-white' 
                        : 'text-[#8b92a5] hover:bg-[#252839]/50 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-[18px] h-[18px]" strokeWidth={2} />
                    <span className="text-[13px] font-medium tracking-wide">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pb-6 px-4">
          {/* Profile Card */}
          <div className="bg-[#212435] rounded-xl p-3 mb-4 flex items-center space-x-3 border border-[#2d3148]">
            <div className={`w-10 h-10 rounded-full ${profile.color.includes('bg-[#') ? profile.color : profile.color} flex items-center justify-center shrink-0 border border-slate-600 shadow-inner`}>
              <span className="text-white font-bold text-[13px]">{profile.initials}</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[13px] font-semibold text-white leading-tight truncate">{profile.name}</span>
              <span className="text-[11px] text-[#8b92a5] mt-0.5 truncate">{profile.role}</span>
            </div>
          </div>

          {/* Logout Button */}
          <Link 
            href="http://localhost:3000/sign-in" 
            className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-[#8b92a5] hover:bg-[#252839] hover:text-white border border-transparent transition-colors w-full"
          >
            <LogOut className="w-[16px] h-[16px]" strokeWidth={2} />
            <span className="text-[13px] font-medium tracking-wide">Log out</span>
          </Link>
        </div>
      </aside>
      
      {/* Floating Help Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-12 h-12 bg-[#1a1c29] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#252839] transition-colors border border-[#2a2c3d]">
          <span className="font-bold text-lg leading-none">?</span>
        </button>
      </div>
    </>
  );
}

export function Sidebar() {
  return (
    <Suspense fallback={<div className="w-[280px] bg-[#1a1c29] hidden md:block border-r border-[#2a2c3d]" />}>
      <SidebarContent />
    </Suspense>
  );
}
