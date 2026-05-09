"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import {
  BarChart3,
  Boxes,
  Box,
  Calculator,
  CheckSquare,
  ChevronLeft,
  FileEdit,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Truck,
  Users,
  X,
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
      { name: "Approvals", href: "/approvals", icon: CheckSquare },
      { name: "Admin Access", href: "/users", icon: Users },
      { name: "Customers", href: "/customers", icon: Users },
      { name: "Reports", href: "/analytics", icon: BarChart3 },
    ],
    roleLabel: "Admin / Management",
    color: "bg-[#34384d]",
    allowedPaths: ["/", "/approvals", "/users", "/customers", "/analytics"],
    defaultHref: "/",
  },
  SALES: {
    links: [
      { name: "Dashboard", href: "/sales?tab=lead", icon: FileEdit, tab: "lead" },
      { name: "Approvals", href: "/sales?tab=approvals", icon: CheckSquare, tab: "approvals" },
      { name: "Returns", href: "/sales?tab=returns", icon: History, tab: "returns" },
      { name: "Sales Orders", href: "/sales?tab=orders", icon: CheckSquare, tab: "orders" },
      { name: "Order Chats", href: "/sales?tab=chats", icon: Calculator, tab: "chats" },
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
      { name: "Damaged Materials", href: "/inventory?tab=damaged-materials", icon: History, tab: "damaged-materials" },
      { name: "Approvals", href: "/inventory?tab=approvals", icon: CheckSquare, tab: "approvals" },
      { name: "Audit Logs", href: "/inventory?tab=audit", icon: History, tab: "audit" },
    ],
    roleLabel: "Inventory",
    color: "bg-blue-500",
    allowedPaths: ["/inventory"],
    defaultHref: "/inventory?tab=all-stocks",
  },
  ACCOUNTING: {
    links: [
      { name: "Approvals", href: "/accounting?tab=approvals", icon: CheckSquare, tab: "approvals" },
      { name: "Approval History", href: "/accounting?tab=history", icon: History, tab: "history" },
      { name: "Payment Follow-ups", href: "/accounting/follow-ups?tab=follow-ups", icon: Calculator, tab: "follow-ups" },
      { name: "Documents", href: "/accounting?tab=documents", icon: FileText, tab: "documents" },
    ],
    roleLabel: "Accounting",
    color: "bg-orange-500",
    allowedPaths: ["/accounting"],
    defaultHref: "/accounting?tab=approvals",
  },
  OPERATIONS_DESIGN: {
    links: [
      { name: "New Products", href: "/operations?tab=new-products", icon: FileEdit, tab: "new-products" },
      { name: "Finished Products", href: "/operations?tab=finished-products", icon: Boxes, tab: "finished-products" },
      { name: "Approvals", href: "/operations?tab=approvals", icon: CheckSquare, tab: "approvals" },
      { name: "Delivery Schedule", href: "/operations?tab=delivery", icon: Truck, tab: "delivery" },
      { name: "Company Code Checks", href: "/operations?tab=company-code", icon: ShieldCheck, tab: "company-code" },
    ],
    roleLabel: "Operations / Design",
    color: "bg-rose-500",
    allowedPaths: ["/operations"],
    defaultHref: "/operations?tab=new-products",
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

function needsTabValidation(pathname: string, allowedPaths: string[]) {
  return allowedPaths.some((allowedPath) => pathname === allowedPath)
}

const itemVariants = {
  hidden: { x: -40, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: 0.15 + i * 0.07,
      type: "spring" as const,
      stiffness: 250,
      damping: 25,
    },
  }),
};

const drawerVariants = {
  closed: {
    x: "-100%",
    transition: { type: "spring" as const, stiffness: 200, damping: 30, mass: 0.8 },
  },
  open: {
    x: 0,
    transition: { type: "spring" as const, stiffness: 200, damping: 30, mass: 0.8 },
  },
};

const overlayVariants = {
  closed: { opacity: 0, transition: { duration: 0.3 } },
  open: { opacity: 1, transition: { duration: 0.4 } },
};

type NavBodyProps = {
  config: NavConfig;
  links: NavConfig["links"];
  currentUser: SidebarUser;
  pathname: string;
  currentTab: string | null;
  onLinkClick?: () => void;
  showCloseHint?: boolean;
};

function NavBody({ config, links, currentUser, pathname, currentTab, onLinkClick, showCloseHint }: NavBodyProps) {
  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 220 }}
          className="h-[72px] px-6 flex items-center justify-between text-white cursor-default"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-slate-700 bg-slate-800">
              <Box className="w-5 h-5 text-white" />
            </div>
            <span className="text-[14px] font-bold text-white tracking-widest uppercase">FURNITRACK</span>
          </div>
        </motion.div>

        <div className="px-4 py-6">
          <nav className="space-y-1">
            {links.map((item, i) => {
              const isActive = pathname === item.href || (item.tab ? item.tab === currentTab : pathname === item.href);

              return (
                <motion.div
                  key={item.name}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    href={item.href}
                    onClick={onLinkClick}
                    className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors duration-200 group ${
                      isActive
                        ? "bg-[#252839] text-white"
                        : "text-[#8b92a5] hover:bg-[#252839]/50 hover:text-white"
                    }`}
                  >
                    <motion.span
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-1.5 rounded-md ${
                        isActive ? "bg-blue-500/20 text-blue-300" : "bg-[#252839] text-current"
                      } group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300`}
                    >
                      <item.icon className="w-[16px] h-[16px]" strokeWidth={2} />
                    </motion.span>
                    <span className="text-[13px] font-medium tracking-wide">{item.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="pb-6 px-4"
      >
        <div className="bg-[#212435] rounded-xl p-3 mb-4 flex items-center space-x-3 border border-[#2d3148]">
          <div className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center shrink-0 border border-slate-600 shadow-inner`}>
            <span className="text-white font-bold text-[13px]">{getInitials(currentUser.name)}</span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[13px] font-semibold text-white leading-tight truncate">{currentUser.name}</span>
            <span className="text-[11px] text-[#8b92a5] mt-0.5 truncate">{config.roleLabel}</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={async () => {
            await authClient.signOut();
            window.location.href = "/sign-in";
          }}
          className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-[#8b92a5] hover:bg-[#252839] hover:text-white border border-transparent transition-colors w-full"
        >
          <LogOut className="w-[16px] h-[16px]" strokeWidth={2} />
          <span className="text-[13px] font-medium tracking-wide">Log out</span>
        </motion.button>

        {showCloseHint && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-[11px] text-[#8b92a5] mt-3 px-1"
          >
            💡 Drag left to close
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

function SidebarContent({ currentUser }: { currentUser: SidebarUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);

  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(dragX, [-200, 0], [0, 1]);

  const config = navConfigs[currentUser.role];
  const { links } = config;
  const currentTab = searchParams.get("tab") || links[0]?.tab || null;

  useEffect(() => {
    const tab = searchParams.get("tab")

    if (!isPathAllowed(pathname, config.allowedPaths) || (needsTabValidation(pathname, config.allowedPaths) && !isValidTab(tab, links))) {
      router.replace(config.defaultHref)
    }
  }, [config.allowedPaths, config.defaultHref, links, pathname, router, searchParams])

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -100) {
      setIsMobileOpen(false);
    }
    dragX.set(0);
  };

  return (
    <>
      {/* Desktop sidebar — collapsible on md+ (collapses to a 56px rail) */}
      <motion.aside
        initial={false}
        animate={{ width: isDesktopOpen ? 280 : 56 }}
        transition={{ type: "spring", stiffness: 200, damping: 30, mass: 0.8 }}
        className="sticky top-0 h-screen bg-[#1a1c29] text-white hidden md:block shrink-0 border-r border-[#2a2c3d] overflow-hidden"
      >
        {/* Collapsed rail content */}
        <AnimatePresence>
          {!isDesktopOpen && (
            <motion.div
              key="rail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col items-center pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDesktopOpen(true)}
                aria-label="Expand sidebar"
                className="p-2 rounded-lg text-white hover:bg-[#252839] transition-colors"
              >
                <Menu size={22} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded sidebar content */}
        <motion.div
          initial={false}
          animate={{ opacity: isDesktopOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-[280px] h-full overflow-y-auto relative pointer-events-auto"
          style={{ pointerEvents: isDesktopOpen ? "auto" : "none" }}
        >
          {/* Collapse button (inside sidebar) */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: -8 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDesktopOpen(false)}
            aria-label="Collapse sidebar"
            className="absolute top-4 right-3 z-10 p-1.5 rounded-md text-[#8b92a5] hover:text-white hover:bg-[#252839] transition-colors"
          >
            <ChevronLeft size={18} />
          </motion.button>

          <NavBody
            config={config}
            links={links}
            currentUser={currentUser}
            pathname={pathname}
            currentTab={currentTab}
          />
        </motion.div>
      </motion.aside>

      {/* Mobile hamburger button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open menu"
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-lg bg-[#1a1c29] text-white shadow-lg border border-[#2a2c3d]"
      >
        <Menu size={22} />
      </motion.button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            key="overlay"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.nav
            key="drawer"
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            drag="x"
            dragConstraints={{ left: -320, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ x: dragX }}
            className="md:hidden fixed top-0 left-0 h-full w-[280px] z-50 bg-[#1a1c29] text-white shadow-2xl border-r border-[#2a2c3d]"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 p-2 rounded-full bg-[#252839] text-white hover:bg-[#2d3148] transition-colors z-10"
            >
              <X size={20} />
            </motion.button>

            <motion.div
              style={{ opacity: dragOpacity }}
              className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none"
            >
              <ChevronLeft size={28} className="text-[#3a3f55]" />
            </motion.div>

            <NavBody
              config={config}
              links={links}
              currentUser={currentUser}
              pathname={pathname}
              currentTab={currentTab}
              onLinkClick={() => setIsMobileOpen(false)}
              showCloseHint
            />
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Floating help button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-30"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 bg-[#1a1c29] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#252839] transition-colors border border-[#2a2c3d]"
        >
          <span className="font-bold text-lg leading-none">?</span>
        </motion.button>
      </motion.div>
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
