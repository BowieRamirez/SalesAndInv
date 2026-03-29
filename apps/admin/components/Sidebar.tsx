"use client";

import React, { Suspense, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeftRight,
  BarChart3,
  Boxes,
  Box,
  Calculator,
  CheckSquare,
  ClipboardList,
  FileEdit,
  FileText,
  History,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Receipt,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { authClient } from "@/lib/auth/client";
import type { AppRole } from "@/lib/rbac";

type NavConfig = {
  links: Array<{
    name: string
    href: string
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
    tab?: string
  }>
  roleLabel: string
  color: string
  allowedPaths: string[]
  defaultHref: string
}

const navConfigs: Record<AppRole, NavConfig> = {
  ADMIN_MANAGEMENT: {
    links: [
      { name: "Executive Overview", href: "/", icon: LayoutDashboard },
      { name: "User Access", href: "/users", icon: Users },
      { name: "Reports", href: "/analytics", icon: BarChart3 },
    ],
    roleLabel: "Admin / Management",
    color: "bg-[#34384d]",
    allowedPaths: ["/", "/users", "/analytics"],
    defaultHref: "/",
  },
  SALES: {
    links: [
      { name: "Lead Intake", href: "/sales?tab=lead", icon: FileEdit, tab: "lead" },
      { name: "Quotations", href: "/sales?tab=quotes", icon: ClipboardList, tab: "quotes" },
      { name: "Sales Orders", href: "/sales?tab=orders", icon: CheckSquare, tab: "orders" },
      { name: "Workflow Tracker", href: "/sales?tab=tracker", icon: ListTodo, tab: "tracker" },
    ],
    roleLabel: "Sales",
    color: "bg-emerald-500",
    allowedPaths: ["/sales"],
    defaultHref: "/sales?tab=lead",
  },
  INVENTORY: {
    links: [
      { name: "Warehouse Locations", href: "/inventory?tab=locations", icon: Box, tab: "locations" },
      { name: "All Stocks", href: "/inventory?tab=all-stocks", icon: Boxes, tab: "all-stocks" },
      { name: "Stock Requests", href: "/inventory?tab=requests", icon: ArrowLeftRight, tab: "requests" },
      { name: "Audit Logs", href: "/inventory?tab=audit", icon: History, tab: "audit" },
    ],
    roleLabel: "Inventory",
    color: "bg-blue-500",
    allowedPaths: ["/inventory"],
    defaultHref: "/inventory?tab=all-stocks",
  },
  ACCOUNTING: {
    links: [
      { name: "Billing Basis", href: "/accounting?tab=auto-compute", icon: Calculator, tab: "auto-compute" },
      { name: "Payments", href: "/accounting?tab=payments", icon: Receipt, tab: "payments" },
      { name: "Approvals", href: "/accounting?tab=approvals", icon: CheckSquare, tab: "approvals" },
      { name: "Documents", href: "/accounting?tab=documents", icon: FileText, tab: "documents" },
    ],
    roleLabel: "Accounting",
    color: "bg-orange-500",
    allowedPaths: ["/accounting"],
    defaultHref: "/accounting?tab=auto-compute",
  },
  OPERATIONS_DESIGN: {
    links: [
      { name: "Design Queue", href: "/operations?tab=design", icon: FileEdit, tab: "design" },
      { name: "Finished Products", href: "/operations?tab=finished-products", icon: Boxes, tab: "finished-products" },
      { name: "Delivery Schedule", href: "/operations?tab=delivery", icon: Truck, tab: "delivery" },
      { name: "Company Code Checks", href: "/operations?tab=company-code", icon: ShieldCheck, tab: "company-code" },
    ],
    roleLabel: "Operations / Design",
    color: "bg-rose-500",
    allowedPaths: ["/operations"],
    defaultHref: "/operations?tab=design",
  },
  CLIENT: {
    links: [],
    roleLabel: "Client",
    color: "bg-slate-500",
    allowedPaths: ["/"],
    defaultHref: "/",
  },
}

type SidebarUser = {
  name: string
  role: AppRole
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function isPathAllowed(pathname: string, allowedPaths: string[]) {
  return allowedPaths.some((allowedPath) => {
    if (allowedPath === "/") {
      return pathname === "/"
    }

    return pathname === allowedPath || pathname.startsWith(`${allowedPath}/`)
  })
}

function isValidTab(tab: string | null, links: NavConfig["links"]) {
  const tabbedLinks = links.filter((link) => link.tab)

  if (tabbedLinks.length === 0) {
    return true
  }

  if (!tab) {
    return false
  }

  return tabbedLinks.some((link) => link.tab === tab)
}

function SidebarContent({ currentUser }: { currentUser: SidebarUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const config = navConfigs[currentUser.role];
  const { links } = config;

  useEffect(() => {
    const currentTab = searchParams.get("tab")

    if (!isPathAllowed(pathname, config.allowedPaths) || !isValidTab(currentTab, links)) {
      router.replace(config.defaultHref)
    }
  }, [config.allowedPaths, config.defaultHref, links, pathname, router, searchParams])

  return (
    <>
      <aside className="sticky top-0 h-screen overflow-y-auto w-[280px] bg-[#1a1c29] text-white flex flex-col justify-between hidden md:flex shrink-0 border-r border-[#2a2c3d]">
        <div>
          <div className="h-[72px] px-6 flex items-center justify-between text-white cursor-default">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-slate-700 bg-slate-800">
                <Box className="w-5 h-5 text-white" />
              </div>
              <span className="text-[14px] font-bold text-white tracking-widest uppercase">FURNITRACK</span>
            </div>
          </div>

          <div className="px-4 py-8">
            <nav className="space-y-1">
              {links.map((item) => {
                const currentTab = searchParams.get("tab") || links[0]?.tab;
                const isActive = pathname === item.href || (item.tab ? item.tab === currentTab : pathname === item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors duration-200 group ${
                      isActive
                        ? "bg-[#252839] text-white"
                        : "text-[#8b92a5] hover:bg-[#252839]/50 hover:text-white"
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

        <div className="pb-6 px-4">
          <div className="bg-[#212435] rounded-xl p-3 mb-4 flex items-center space-x-3 border border-[#2d3148]">
            <div className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center shrink-0 border border-slate-600 shadow-inner`}>
              <span className="text-white font-bold text-[13px]">{getInitials(currentUser.name)}</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[13px] font-semibold text-white leading-tight truncate">{currentUser.name}</span>
              <span className="text-[11px] text-[#8b92a5] mt-0.5 truncate">{config.roleLabel}</span>
            </div>
          </div>

          <button
            onClick={async () => {
              await authClient.signOut();
              window.location.href = "/sign-in";
            }}
            className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-[#8b92a5] hover:bg-[#252839] hover:text-white border border-transparent transition-colors w-full"
          >
            <LogOut className="w-[16px] h-[16px]" strokeWidth={2} />
            <span className="text-[13px] font-medium tracking-wide">Log out</span>
          </button>
        </div>
      </aside>

      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-12 h-12 bg-[#1a1c29] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#252839] transition-colors border border-[#2a2c3d]">
          <span className="font-bold text-lg leading-none">?</span>
        </button>
      </div>
    </>
  );
}

export function Sidebar({ currentUser }: { currentUser: SidebarUser }) {
  return (
    <Suspense fallback={<div className="w-[280px] bg-[#1a1c29] hidden md:block border-r border-[#2a2c3d]" />}>
      <SidebarContent currentUser={currentUser} />
    </Suspense>
  );
}
