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
  ChevronRight,
  FileEdit,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  SlidersHorizontal,
  Truck,
  Users,
  Archive,
  X,
} from "lucide-react";
import type { AppRole } from "@/lib/rbac";

const HIDE_SCROLLBAR_CLASS = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"

type NavConfig = {
  links: NavLink[]
  groups?: NavGroup[]
  roleLabel: string
  color: string
  allowedPaths: string[]
  defaultHref: string
}

type NavLink = {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  tab?: string
}

type NavGroup = {
  label: string
  links: NavLink[]
}

const navConfigs: Record<AppRole, NavConfig> = {
  ADMIN_MANAGEMENT: {
    links: [
      { name: "Executive Overview", href: "/", icon: LayoutDashboard },
      { name: "Approvals", href: "/approvals", icon: CheckSquare },
      { name: "Admin Access", href: "/users", icon: Users },
      { name: "Customers", href: "/customers", icon: Users },
      { name: "Reports", href: "/analytics", icon: BarChart3 },
      { name: "Audit Logs", href: "/audit", icon: History },
      { name: "Archives", href: "/archives", icon: History },
    ],
    roleLabel: "Admin / Management",
    color: "bg-[#34384d]",
    allowedPaths: ["/", "/approvals", "/users", "/customers", "/analytics", "/audit", "/archives"],
    defaultHref: "/",
  },
  SALES: {
    links: [
      { name: "Dashboard", href: "/sales?tab=lead", icon: FileEdit, tab: "lead" },
      { name: "Approvals", href: "/sales?tab=approvals", icon: CheckSquare, tab: "approvals" },
      { name: "Returns", href: "/sales?tab=returns", icon: History, tab: "returns" },
      { name: "Sales Orders", href: "/sales?tab=orders", icon: CheckSquare, tab: "orders" },
      { name: "Order Chats", href: "/sales?tab=chats", icon: Calculator, tab: "chats" },
      { name: "Audit Logs", href: "/sales?tab=audit", icon: History, tab: "audit" },
    ],
    roleLabel: "Sales",
    color: "bg-emerald-500",
    allowedPaths: ["/sales"],
    defaultHref: "/sales?tab=lead",
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
    links: [],
    groups: [
      {
        label: "Product",
        links: [
          { name: "Product List", href: "/operations?tab=finished-products", icon: Boxes, tab: "finished-products" },
          { name: "Archived Products", href: "/operations?tab=archived-products", icon: Archive, tab: "archived-products" },
          { name: "Storefront", href: "/operations?tab=storefront-filters", icon: SlidersHorizontal, tab: "storefront-filters" },
        ],
      },
      {
        label: "Stocks and Warehouse",
        links: [
          { name: "Warehouse Locations", href: "/operations?tab=locations", icon: Box, tab: "locations" },
          { name: "All Stocks", href: "/operations?tab=all-stocks", icon: Boxes, tab: "all-stocks" },
          { name: "Reserved Materials", href: "/operations?tab=reserved", icon: CheckSquare, tab: "reserved" },
          { name: "Damaged Materials", href: "/operations?tab=damaged-materials", icon: History, tab: "damaged-materials" },
        ],
      },
      {
        label: "Approvals and Delivery",
        links: [
          { name: "Inventory Approvals", href: "/operations?tab=inv-approvals", icon: CheckSquare, tab: "inv-approvals" },
          { name: "Approvals", href: "/operations?tab=approvals", icon: CheckSquare, tab: "approvals" },
          { name: "Delivery Schedule", href: "/operations?tab=delivery", icon: Truck, tab: "delivery" },
        ],
      },
      {
        label: "System",
        links: [
          { name: "Audit Logs", href: "/operations?tab=audit", icon: History, tab: "audit" },
        ],
      },
    ],
    roleLabel: "Operations / Design",
    color: "bg-rose-500",
    allowedPaths: ["/operations"],
    defaultHref: "/operations?tab=finished-products",
  },
  CUSTOM: {
    links: [],
    groups: [],
    roleLabel: "Custom Admin",
    color: "bg-purple-500",
    allowedPaths: ["/sales", "/operations"],
    defaultHref: "/",
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
  permissions?: Record<string, boolean> | null
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

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.08,
      type: "spring" as const,
      stiffness: 220,
      damping: 24,
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
  links: NavLink[];
  groups?: NavGroup[];
  currentUser: SidebarUser;
  pathname: string;
  currentTab: string | null;
  onLinkClick?: () => void;
  showCloseHint?: boolean;
  unreadChatsCount?: number;
};

function NavItem({
  item,
  index,
  pathname,
  currentTab,
  onLinkClick,
  unreadChatsCount,
}: {
  item: NavLink
  index: number
  pathname: string
  currentTab: string | null
  onLinkClick?: () => void
  unreadChatsCount?: number
}) {
  const isActive = pathname === item.href || (item.tab ? item.tab === currentTab : pathname === item.href)
  const isChatTab = item.tab === "chats"
  const showBadge = isChatTab && (unreadChatsCount ?? 0) > 0

  return (
    <motion.div
      key={item.name}
      custom={index}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <Link
        href={item.href}
        onClick={onLinkClick}
        className={`relative flex items-center space-x-4 overflow-hidden px-4 py-3 rounded-lg transition-colors duration-200 group ${
          isActive
            ? "bg-[#252839] text-white"
            : "text-[#8b92a5] hover:bg-[#252839]/50 hover:text-white"
        }`}
      >
        {isActive ? (
          <motion.span
            layoutId="sidebar-active-pill"
            className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-400"
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          />
        ) : null}
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 bg-white/0"
          whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
          transition={{ duration: 0.18 }}
        />
        <motion.span
          whileHover={{ scale: 1.15, rotate: 8 }}
          whileTap={{ scale: 0.95 }}
          className={`p-1.5 rounded-md ${
            isActive ? "bg-blue-500/20 text-blue-300" : "bg-[#252839] text-current"
          } group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300`}
        >
          <item.icon className="w-[16px] h-[16px]" strokeWidth={2} />
        </motion.span>
        <span className="text-[13px] font-medium tracking-wide flex-1">{item.name}</span>
        {showBadge ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
            {unreadChatsCount! > 99 ? "99+" : unreadChatsCount}
          </span>
        ) : null}
      </Link>
    </motion.div>
  )
}

function NavSection({
  group,
  groupIndex,
  indexOffset,
  pathname,
  currentTab,
  isOpen,
  onToggle,
  onLinkClick,
  unreadChatsCount,
}: {
  group: NavGroup
  groupIndex: number
  indexOffset: number
  pathname: string
  currentTab: string | null
  isOpen: boolean
  onToggle: () => void
  onLinkClick?: () => void
  unreadChatsCount?: number
}) {
  return (
    <motion.div
      custom={groupIndex}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="space-y-1"
    >
      <motion.button
        type="button"
        onClick={onToggle}
        className="group flex w-full items-center justify-between rounded-lg px-4 pb-2 pt-4 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-[#667086] transition-colors hover:text-[#aeb8d2] first:pt-0"
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.18 }}
        aria-expanded={isOpen}
      >
        <span>{group.label}</span>
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 24 }}
          className="rounded-md p-0.5 text-[#7d879d] group-hover:text-[#cbd5e1]"
        >
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.4} />
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="accordion-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="overflow-hidden"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-1 border-l border-[#303449] pl-3"
            >
              {group.links.map((item, index) => (
                <NavItem
                  key={item.name}
                  item={item}
                  index={indexOffset + index}
                  pathname={pathname}
                  currentTab={currentTab}
                  onLinkClick={onLinkClick}
                  unreadChatsCount={unreadChatsCount}
                />
              ))}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}

function NavBody({ config, links, groups, currentUser, pathname, currentTab, onLinkClick, showCloseHint, unreadChatsCount }: NavBodyProps) {
  const navGroups = groups?.length ? groups : [{ label: "", links }]
  const activeGroupLabel = groups?.find((group) => group.links.some((link) => link.tab === currentTab))?.label
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const defaultLabel = activeGroupLabel ?? navGroups[0]?.label ?? ""
    return defaultLabel ? { [defaultLabel]: true } : {}
  })

  useEffect(() => {
    if (!activeGroupLabel) {
      return
    }

    setOpenGroups((prev) => ({ ...prev, [activeGroupLabel]: true }))
  }, [activeGroupLabel])

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
            {navGroups.map((group, groupIndex) => (
              groups?.length ? (
                <NavSection
                  key={group.label}
                  group={group}
                  groupIndex={groupIndex}
                  indexOffset={navGroups.slice(0, groupIndex).reduce((total, current) => total + current.links.length, 0)}
                  pathname={pathname}
                  currentTab={currentTab}
                  isOpen={!!openGroups[group.label]}
                  onToggle={() => setOpenGroups((prev) => ({ ...prev, [group.label]: !prev[group.label] }))}
                  onLinkClick={onLinkClick}
                  unreadChatsCount={unreadChatsCount}
                />
              ) : (
                group.links.map((item, index) => (
                  <NavItem
                    key={item.name}
                    item={item}
                    index={index}
                    pathname={pathname}
                    currentTab={currentTab}
                    onLinkClick={onLinkClick}
                    unreadChatsCount={unreadChatsCount}
                  />
                ))
              )
            ))}
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
            await fetch("/api/portal-session", {
              method: "DELETE",
            }).catch(() => undefined);
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

function SidebarContent({ currentUser, unreadChatsCount }: { currentUser: SidebarUser, unreadChatsCount?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);

  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(dragX, [-200, 0], [0, 1]);

  const baseConfig = navConfigs[currentUser.role];

  const config = React.useMemo(() => {
    if (!currentUser.permissions) return baseConfig;

    const p = currentUser.permissions;
    const cloned = { ...baseConfig, links: [...baseConfig.links], groups: baseConfig.groups ? [...baseConfig.groups] : undefined };
    const hasTabAccess = (link: NavLink) => {
      if (!link.tab) return true;
      return p[link.tab] === true || (p[link.tab] == null && currentUser.role !== "CUSTOM");
    };

    if (currentUser.role === "SALES" || currentUser.role === "CUSTOM") {
      const salesConfig = navConfigs["SALES"];
      const salesLinks = salesConfig.links?.filter(l => {
        if (!p) return true;
        if (l.tab === "approvals" && p.sales_approvals != null) return p.sales_approvals === true;
        return hasTabAccess(l);
      }) ?? [];
      
      if (currentUser.role === "SALES") {
        cloned.links = salesLinks;
        if (cloned.links.length > 0) cloned.defaultHref = cloned.links[0].href;
      } else {
        if (!cloned.groups) cloned.groups = [];
        if (salesLinks.length > 0) {
          cloned.groups.push({
            label: "Sales",
            links: salesLinks.map(l => ({ ...l, href: `/sales?tab=${l.tab}` }))
          });
        }
      }
    }

    if (currentUser.role === "OPERATIONS_DESIGN" || currentUser.role === "CUSTOM") {
      const opsConfig = navConfigs["OPERATIONS_DESIGN"];
      const opsGroups = opsConfig.groups?.map(g => ({ ...g, links: [...g.links] })).filter(g => {
        g.links = g.links.filter(l => {
          if (!p) return true;
          if (l.tab === "audit") return true; // Audit logs always accessible
          if (l.tab === "approvals" && p.ops_approvals != null) return p.ops_approvals === true;
          return hasTabAccess(l);
        });
        return g.links.length > 0;
      }) ?? [];

      if (currentUser.role === "OPERATIONS_DESIGN") {
        cloned.groups = opsGroups;
        const allLinks = cloned.groups.flatMap(g => g.links);
        if (allLinks.length > 0) cloned.defaultHref = allLinks[0].href;
      } else {
        if (!cloned.groups) cloned.groups = [];
        if (opsGroups.length > 0) {
          cloned.groups.push(...opsGroups);
        }
      }
    }
    
    if (currentUser.role === "CUSTOM") {
      cloned.links = []; // Use groups instead
      const allLinks = cloned.groups?.flatMap(g => g.links) ?? [];
      if (allLinks.length > 0) cloned.defaultHref = allLinks[0].href;
    }

    return cloned;
  }, [baseConfig, currentUser.permissions, currentUser.role]);

  const links = config.groups?.flatMap((group) => group.links) ?? config.links;
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
          className={`w-[280px] h-full overflow-y-auto relative pointer-events-auto ${HIDE_SCROLLBAR_CLASS}`}
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
            groups={config.groups}
            currentUser={currentUser}
            pathname={pathname}
            currentTab={currentTab}
            unreadChatsCount={unreadChatsCount}
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
            className={`md:hidden fixed top-0 left-0 h-full w-[280px] z-50 overflow-y-auto bg-[#1a1c29] text-white shadow-2xl border-r border-[#2a2c3d] ${HIDE_SCROLLBAR_CLASS}`}
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
              groups={config.groups}
              currentUser={currentUser}
              pathname={pathname}
              currentTab={currentTab}
              onLinkClick={() => setIsMobileOpen(false)}
              showCloseHint
              unreadChatsCount={unreadChatsCount}
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

export function Sidebar({ currentUser, unreadChatsCount }: { currentUser: SidebarUser, unreadChatsCount?: number }) {
  return (
    <Suspense fallback={<div className="w-[280px] bg-[#1a1c29] hidden md:block border-r border-[#2a2c3d]" />}>
      <SidebarContent currentUser={currentUser} unreadChatsCount={unreadChatsCount} />
    </Suspense>
  );
}

