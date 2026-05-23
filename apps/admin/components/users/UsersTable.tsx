"use client"
import { useDebounce } from "../inventory/hookTs"
import { Fragment, useMemo, useState } from "react"
import {
  AlertTriangle,
  ArrowRight,
  Crown,
  Search,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  User as UserIcon,
  X,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { PasswordField } from "./PasswordField"

export type ManagedAccount = {
  id: string
  authUserId: string
  email: string
  name: string
  role: string
  status: string
  emailVerifiedAt?: string | null
  lastLoginAt: string | null
  createdAt: string | null
  updatedAt: string | null
  company?: string | null
  permissions?: Record<string, boolean> | null
}

export type RoleOption = {
  value: string
  label: string
}

type UsersTableProps = {
  users: ManagedAccount[]
  currentAuthUserId: string
  variant?: "internal" | "customer"
  staffRoleOptions?: RoleOption[]
  internalRoleOptions?: RoleOption[]
  roleLabels: Record<string, string>
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function formatDate(value: string | null) {
  if (!value) return "Never"
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase()
  const styles =
    normalized === "ACTIVE"
      ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
      : normalized === "BLOCKED"
        ? "bg-rose-100 text-rose-700 ring-rose-200"
      : normalized === "INVITED"
        ? "bg-blue-100 text-blue-700 ring-blue-200"
        : normalized === "SUSPENDED"
          ? "bg-rose-100 text-rose-700 ring-rose-200"
          : normalized === "EXPIRED"
            ? "bg-amber-100 text-amber-700 ring-amber-200"
            : "bg-slate-100 text-slate-700 ring-slate-200"

  const label = normalized.charAt(0) + normalized.slice(1).toLowerCase()

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${styles}`}>
      {label}
    </span>
  )
}

function RoleBadge({ role, label }: { role: string; label: string }) {
  const Icon =
    role === "ADMIN_MANAGEMENT" ? Crown : role === "CLIENT" ? UserIcon : role === "OPERATIONS_DESIGN" ? ShieldCheck : Shield
  const tone =
    role === "CLIENT"
      ? "bg-blue-50 text-blue-700 ring-blue-100"
      : role === "ADMIN_MANAGEMENT"
        ? "bg-violet-50 text-violet-700 ring-violet-100"
        : "bg-slate-50 text-slate-700 ring-slate-200"
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${tone}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  )
}

export function UsersTable({
  users,
  currentAuthUserId,
  variant = "internal",
  staffRoleOptions = [],
  internalRoleOptions = [],
  roleLabels,
}: UsersTableProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [roleFilter, setRoleFilter] = useState<string>("")
  const [accountTypeFilter, setAccountTypeFilter] = useState<"" | "internal" | "client">("")
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false)
  const debouncedSearch = useDebounce(search, 500)
  const [pageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [pendingRemoval, setPendingRemoval] = useState<ManagedAccount | null>(null)

  const allStatuses = useMemo(() => {
    const set = new Set<string>()
    users.forEach((u) => set.add(u.status.toUpperCase()))
    return Array.from(set).sort()
  }, [users])

  const allRoles = useMemo(() => {
    const set = new Set<string>()
    users.forEach((u) => set.add(u.role))
    return Array.from(set).sort()
  }, [users])

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase()
    return users.filter((u) => {
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) {
        return false
      }
      if (statusFilter && u.status.toUpperCase() !== statusFilter) return false
      if (roleFilter && u.role !== roleFilter) return false
      if (accountTypeFilter === "internal" && u.role === "CLIENT") return false
      if (accountTypeFilter === "client" && u.role !== "CLIENT") return false
      return true
    })
  }, [users, debouncedSearch, statusFilter, roleFilter, accountTypeFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const paged = filtered.slice(start, start + pageSize)

  const expandedAccount = useMemo(() => expandedId ? users.find(u => u.authUserId === expandedId) || null : null, [users, expandedId])
  const expandedIsCurrentUser = expandedAccount?.authUserId === currentAuthUserId
  const expandedIsExecutive = expandedAccount?.role === "ADMIN_MANAGEMENT"
  const expandedIsClient = expandedAccount?.role === "CLIENT"
  const expandedBaselineAccounts = ['admin@sims.com', 'sales@sims.com', 'operations@sims.com', 'accounting@sims.com']
  const expandedIsBaseline = expandedAccount ? expandedBaselineAccounts.includes(expandedAccount.email) : false
  const expandedIsCustomizable = expandedAccount ? !expandedIsBaseline && (expandedAccount.role === "SALES" || expandedAccount.role === "OPERATIONS_DESIGN" || expandedAccount.role === "CUSTOM") : false
  const expandedEditableRoles = expandedIsCurrentUser ? internalRoleOptions : staffRoleOptions

  return (
    <div className="space-y-4">
      {/* Search & Filters — separate container */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 px-5 py-4">
          <div className="relative min-w-[260px] flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder={variant === "customer" ? "Search customer, email" : "Search user, email"}
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-[13px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
            />
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            {/* Account type pill (internal-variant only) */}
            {variant === "internal" ? (
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-0.5 text-[12px]">
                {([
                  { value: "", label: "All" },
                  { value: "internal", label: "Internal" },
                  { value: "client", label: "Clients" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setAccountTypeFilter(opt.value)
                      setPage(1)
                    }}
                    className={`rounded-full px-3 py-1 transition-colors ${
                      accountTypeFilter === opt.value
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            ) : null}

            {/* Active filter pills */}
            {statusFilter ? (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("")
                  setPage(1)
                }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] text-slate-700 transition-colors hover:border-slate-300"
              >
                {statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()}
                <X className="h-3.5 w-3.5 text-slate-400" />
              </button>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] text-slate-700">
                All status
                <span className="text-slate-300">·</span>
                <span className="text-slate-400">{filtered.length}</span>
              </span>
            )}

            {variant === "internal" && roleFilter ? (
              <button
                type="button"
                onClick={() => {
                  setRoleFilter("")
                  setPage(1)
                }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] text-slate-700 transition-colors hover:border-slate-300"
              >
                {roleLabels[roleFilter] ?? roleFilter}
                <X className="h-3.5 w-3.5 text-slate-400" />
              </button>
            ) : null}

            {/* More filters toggle */}
            <button
              type="button"
              onClick={() => setMoreFiltersOpen((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${
                moreFiltersOpen
                  ? "border-slate-300 bg-slate-50 text-slate-900"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
              aria-expanded={moreFiltersOpen}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              More filters
            </button>
          </div>
        </div>

        {/* Expanded filter row */}
        {moreFiltersOpen ? (
          <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-slate-50/40 px-5 py-3">
            <div className="flex items-center gap-2">
              <label className="text-[12px] font-medium text-slate-500">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPage(1)
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-700 outline-none focus:border-slate-400"
              >
                <option value="">All statuses</option>
                {allStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            {variant === "internal" && allRoles.length > 1 ? (
              <div className="flex items-center gap-2">
                <label className="text-[12px] font-medium text-slate-500">Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value)
                    setPage(1)
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-700 outline-none focus:border-slate-400"
                >
                  <option value="">All roles</option>
                  {allRoles.map((r) => (
                    <option key={r} value={r}>
                      {roleLabels[r] ?? r}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {(statusFilter || roleFilter) ? (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("")
                  setRoleFilter("")
                  setPage(1)
                }}
                className="ml-auto rounded-lg px-3 py-1.5 text-[12px] font-medium text-slate-500 transition-colors hover:text-slate-900"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : null}
      </section>

      {/* Users table — its own container */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="border-b border-slate-200 bg-white">
            <tr className="text-[11px] uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3 font-medium">User Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              {variant === "customer" ? <th className="px-4 py-3 font-medium">Company</th> : null}
              <th className="px-4 py-3 font-medium">Date Created</th>
              <th className="px-4 py-3 font-medium">Last Login</th>
              <th className="px-4 py-3 font-medium">Status</th>
              {variant === "customer" ? <th className="px-4 py-3 font-medium">Verified</th> : null}
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={variant === "customer" ? 8 : 7} className="px-5 py-16 text-center text-[13px] text-slate-500">
                  No users match the current filters.
                </td>
              </tr>
            ) : (
              paged.map((account) => {
                const isCurrentUser = account.authUserId === currentAuthUserId
                const isExpanded = expandedId === account.authUserId

                return (
                  <Fragment key={account.authUserId}>
                  <motion.tr
                    initial={false}
                    className="border-b border-slate-100 last:border-b-0 align-middle hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[12px] font-semibold text-slate-700">
                          {getInitials(account.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[13px] font-medium text-slate-900 underline-offset-2 hover:underline">{account.name}</p>
                            {isCurrentUser ? (
                              <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-blue-700">
                                You
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[13px] text-slate-600">{account.email}</td>
                    {variant === "customer" ? (
                      <td className="px-4 py-4 text-[13px] text-slate-600">{account.company ?? "—"}</td>
                    ) : null}
                    <td className="px-4 py-4 text-[13px] text-slate-600">{formatDate(account.createdAt)}</td>
                    <td className="px-4 py-4 text-[13px] text-slate-600">{formatDate(account.lastLoginAt)}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={account.status} />
                    </td>
                    {variant === "customer" ? (
                      <td className="px-4 py-4">
                        {account.emailVerifiedAt ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                            Unverified
                          </span>
                        )}
                      </td>
                    ) : null}
                    <td className="px-4 py-4">
                      <RoleBadge role={account.role} label={roleLabels[account.role] ?? account.role} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      {variant === "internal" ? (
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : account.authUserId)}
                          aria-label="Manage user"
                          className="inline-flex items-center gap-1 text-[13px] font-medium text-violet-600 transition-colors hover:text-violet-700"
                        >
                          View
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <form method="post" action="/api/admin/customers/status" className="inline-flex justify-end">
                          <input type="hidden" name="authUserId" value={account.authUserId} />
                          <input type="hidden" name="email" value={account.email} />
                          <input
                            type="hidden"
                            name="status"
                            value={account.status.toUpperCase() === "BLOCKED" ? "ACTIVE" : "BLOCKED"}
                          />
                          <button
                            type="submit"
                            className={`inline-flex items-center gap-1 text-[13px] font-medium transition-colors ${
                              account.status.toUpperCase() === "BLOCKED"
                                ? "text-emerald-600 hover:text-emerald-700"
                                : "text-violet-600 hover:text-violet-700"
                            }`}
                          >
                            {account.status.toUpperCase() === "BLOCKED" ? "Reactivate" : "Deactivate"}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </form>
                      )}
                    </td>
                  </motion.tr>
                  </Fragment>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination — slim, mirrors the reference */}
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
        <p className="text-[13px] text-slate-500">
          Page {safePage} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-[13px] font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-white disabled:text-slate-300"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-[13px] font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-white disabled:text-slate-300"
          >
            Next
          </button>
        </div>
      </div>

      <AnimatePresence>
        {variant === "internal" && expandedAccount ? (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 overflow-y-auto pt-10 pb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              className="my-auto w-full max-w-[800px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
              initial={{ y: 16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[13px] font-semibold text-slate-700">
                    {getInitials(expandedAccount.name)}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-slate-900">{expandedAccount.name}</h3>
                    <p className="text-[13px] text-slate-500">{expandedAccount.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setExpandedId(null)}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid divide-y divide-slate-100 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] sm:divide-x sm:divide-y-0">
                {/* Left Column: Edit Details (internal-only — clients can't be edited here) */}
                {expandedIsClient ? (
                  <div className="p-6">
                    <div className="mb-5">
                      <h4 className="text-[14px] font-semibold text-slate-900">Client account</h4>
                      <p className="text-[12px] text-slate-500">
                        Customer-facing account. Use the security and status controls on the right to manage access.
                      </p>
                    </div>
                    <dl className="grid grid-cols-1 gap-3 text-[13px]">
                      <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-2">
                        <dt className="text-slate-500">Email</dt>
                        <dd className="text-slate-900">{expandedAccount.email}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-2">
                        <dt className="text-slate-500">Joined</dt>
                        <dd className="text-slate-900">{formatDate(expandedAccount.createdAt)}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-2">
                        <dt className="text-slate-500">Last login</dt>
                        <dd className="text-slate-900">{formatDate(expandedAccount.lastLoginAt)}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-2">
                        <dt className="text-slate-500">Status</dt>
                        <dd><StatusBadge status={expandedAccount.status} /></dd>
                      </div>
                    </dl>
                  </div>
                ) : (
                <form
                  method="post"
                  action="/api/admin/accounts/update"
                  className="p-6"
                >
                  <input type="hidden" name="authUserId" value={expandedAccount.authUserId} />
                  <input type="hidden" name="email" value={expandedAccount.email} />
                  <div className="mb-5">
                    <h4 className="text-[14px] font-semibold text-slate-900">Edit Details</h4>
                    <p className="text-[12px] text-slate-500">Update account information and roles.</p>
                  </div>
                  
                  <div className="mb-5 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-medium text-slate-700">Full Name</label>
                      <input
                        name="name"
                        defaultValue={expandedAccount.name}
                        disabled={expandedIsExecutive}
                        placeholder="Full name"
                        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-medium text-slate-700">Role</label>
                      {expandedIsExecutive ? (
                        <div className="flex h-9 items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-[13px] text-slate-500">
                          {roleLabels[expandedAccount.role] ?? expandedAccount.role}
                        </div>
                      ) : (
                        <select
                          name="role"
                          defaultValue={expandedAccount.role}
                          className="h-9 rounded-md border border-slate-300 bg-white px-3 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                        >
                          {expandedEditableRoles.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={expandedIsExecutive}
                    className="w-full rounded-md bg-slate-900 px-3 py-2 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
                  >
                    {expandedIsExecutive ? "Locked" : "Save Changes"}
                  </button>

                  {expandedIsCustomizable && (
                    <div className="mt-8 pt-6 border-t border-slate-100">
                      <h5 className="mb-4 text-[12px] font-semibold uppercase tracking-wider text-slate-500">
                        Custom Admin Permissions
                      </h5>
                      
                      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 text-[13px] text-slate-700">
                        {/* Sales Permissions */}
                        {(expandedAccount.role === "SALES" || expandedAccount.role === "CUSTOM") ? (
                          <div>
                            <p className="mb-3 text-[11px] font-bold text-slate-400">SALES PAGES</p>
                            <div className="flex flex-col gap-3">
                              <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" name="tab_lead" defaultChecked={expandedAccount.permissions?.lead ?? true} className="rounded border-slate-300 w-4 h-4 text-slate-900 focus:ring-slate-900" />
                                <span className="select-none text-slate-600">Dashboard (Lead)</span>
                              </label>
                              <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" name="tab_sales_approvals" defaultChecked={expandedAccount.permissions?.sales_approvals ?? true} className="rounded border-slate-300 w-4 h-4 text-slate-900 focus:ring-slate-900" />
                                <span className="select-none text-slate-600">Approvals</span>
                              </label>
                              <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" name="tab_returns" defaultChecked={expandedAccount.permissions?.returns ?? true} className="rounded border-slate-300 w-4 h-4 text-slate-900 focus:ring-slate-900" />
                                <span className="select-none text-slate-600">Returns</span>
                              </label>
                              <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" name="tab_orders" defaultChecked={expandedAccount.permissions?.orders ?? true} className="rounded border-slate-300 w-4 h-4 text-slate-900 focus:ring-slate-900" />
                                <span className="select-none text-slate-600">Sales Orders</span>
                              </label>
                              <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" name="tab_chats" defaultChecked={expandedAccount.permissions?.chats ?? true} className="rounded border-slate-300 w-4 h-4 text-slate-900 focus:ring-slate-900" />
                                <span className="select-none text-slate-600">Order Chats</span>
                              </label>
                            </div>
                          </div>
                        ) : null}

                        {(expandedAccount.role === "OPERATIONS_DESIGN" || expandedAccount.role === "CUSTOM") ? (
                          <>
                            {/* Operations - Products & Warehouse */}
                            <div>
                              <p className="mb-3 text-[11px] font-bold text-slate-400">PRODUCTS & WAREHOUSE</p>
                              <div className="flex flex-col gap-3">
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                  <input type="checkbox" name="tab_finished-products" defaultChecked={expandedAccount.permissions?.['finished-products'] ?? true} className="rounded border-slate-300 w-4 h-4 text-slate-900 focus:ring-slate-900" />
                                  <span className="select-none text-slate-600">Finished Products</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                  <input type="checkbox" name="tab_locations" defaultChecked={expandedAccount.permissions?.locations ?? true} className="rounded border-slate-300 w-4 h-4 text-slate-900 focus:ring-slate-900" />
                                  <span className="select-none text-slate-600">Warehouse Locations</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                  <input type="checkbox" name="tab_all-stocks" defaultChecked={expandedAccount.permissions?.['all-stocks'] ?? true} className="rounded border-slate-300 w-4 h-4 text-slate-900 focus:ring-slate-900" />
                                  <span className="select-none text-slate-600">All Stocks</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                  <input type="checkbox" name="tab_reserved" defaultChecked={expandedAccount.permissions?.reserved ?? true} className="rounded border-slate-300 w-4 h-4 text-slate-900 focus:ring-slate-900" />
                                  <span className="select-none text-slate-600">Reserved Materials</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                  <input type="checkbox" name="tab_damaged-materials" defaultChecked={expandedAccount.permissions?.['damaged-materials'] ?? true} className="rounded border-slate-300 w-4 h-4 text-slate-900 focus:ring-slate-900" />
                                  <span className="select-none text-slate-600">Damaged Materials</span>
                                </label>
                              </div>
                            </div>

                            {/* Operations - Approvals & Delivery */}
                            <div className="sm:col-span-2 mt-2">
                              <p className="mb-3 text-[11px] font-bold text-slate-400">APPROVALS & DELIVERY</p>
                              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8">
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                  <input type="checkbox" name="tab_inv-approvals" defaultChecked={expandedAccount.permissions?.['inv-approvals'] ?? true} className="rounded border-slate-300 w-4 h-4 text-slate-900 focus:ring-slate-900" />
                                  <span className="select-none text-slate-600">Inventory Approvals</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                  <input type="checkbox" name="tab_ops_approvals" defaultChecked={expandedAccount.permissions?.ops_approvals ?? true} className="rounded border-slate-300 w-4 h-4 text-slate-900 focus:ring-slate-900" />
                                  <span className="select-none text-slate-600">Approvals</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                  <input type="checkbox" name="tab_delivery" defaultChecked={expandedAccount.permissions?.delivery ?? true} className="rounded border-slate-300 w-4 h-4 text-slate-900 focus:ring-slate-900" />
                                  <span className="select-none text-slate-600">Delivery Schedule</span>
                                </label>
                                <label className="flex items-center gap-2.5 text-slate-400 cursor-not-allowed" title="Always included">
                                  <input type="checkbox" disabled checked className="rounded border-slate-300 w-4 h-4 text-slate-400" />
                                  <span className="select-none">Audit Logs (Always Included)</span>
                                </label>
                              </div>
                            </div>
                          </>
                        ) : null}
                      </div>
                      <p className="mt-5 text-[12px] text-slate-500">Uncheck to restrict access. Leave checked to grant access.</p>
                    </div>
                  )}

                  <p className="mt-6 text-[12px] text-slate-500">
                    {expandedIsExecutive
                      ? "This protected executive account cannot be edited here."
                      : "Admin / Management is reserved for the executive account."}
                  </p>
                </form>
                )}

                {/* Right Column: Security & Removal */}
                <div className="flex flex-col bg-slate-50/50">
                  <form
                    method="post"
                    action="/api/admin/accounts/password"
                    className="flex-1 p-6"
                  >
                    <input type="hidden" name="authUserId" value={expandedAccount.authUserId} />
                    <input type="hidden" name="email" value={expandedAccount.email} />
                    <div className="mb-5">
                      <h4 className="text-[14px] font-semibold text-slate-900">Security</h4>
                      <p className="mt-1 text-[12px] text-slate-500">Reset user's password.</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <PasswordField
                        name="newPassword"
                        placeholder="New password"
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                      />
                      <button
                        type="submit"
                        className="w-full rounded-md bg-[#111827] px-3 py-2 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-[#111827]/90 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>

                  <form
                    method="post"
                    action={expandedIsClient ? "/api/admin/customers/status" : "/api/admin/accounts/status"}
                    className="border-t border-slate-100 bg-slate-50/50 p-6"
                  >
                    <input type="hidden" name="authUserId" value={expandedAccount.authUserId} />
                    <input type="hidden" name="email" value={expandedAccount.email} />
                    <input type="hidden" name="status" value={expandedAccount.status.toUpperCase() === "BLOCKED" ? "ACTIVE" : "BLOCKED"} />
                    <div className="mb-5">
                      <h4 className="text-[14px] font-semibold text-slate-900">Account Status</h4>
                      <p className="mt-1 text-[12px] text-slate-500">
                        {expandedAccount.status.toUpperCase() === "BLOCKED" 
                          ? "This account is currently deactivated and cannot log in." 
                          : "Deactivate this account to prevent login without deleting data."}
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={expandedIsCurrentUser || expandedIsExecutive}
                      className={`w-full rounded-md px-3 py-2 text-[13px] font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 ${
                        expandedAccount.status.toUpperCase() === "BLOCKED"
                          ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                          : "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500"
                      }`}
                    >
                      {expandedIsCurrentUser || expandedIsExecutive 
                        ? "Locked" 
                        : expandedAccount.status.toUpperCase() === "BLOCKED" 
                          ? "Reactivate Account" 
                          : "Deactivate Account"}
                    </button>
                  </form>

                  <form
                    method="post"
                    action="/api/admin/accounts/remove"
                    onSubmit={(event) => {
                      event.preventDefault()
                      setExpandedId(null)
                      setPendingRemoval(expandedAccount)
                    }}
                    className="border-t border-rose-100 bg-rose-50/50 p-6"
                  >
                    <input type="hidden" name="authUserId" value={expandedAccount.authUserId} />
                    <input type="hidden" name="email" value={expandedAccount.email} />
                    <div className="mb-5 flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-rose-100 p-1.5 text-rose-700">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-[14px] font-semibold text-rose-900">Danger Zone</h4>
                        <p className="mt-1 text-[12px] text-rose-700/80">Permanent account removal.</p>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={expandedIsCurrentUser}
                      className="w-full rounded-md bg-rose-600 px-3 py-2 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-rose-300"
                    >
                      {expandedIsCurrentUser ? "Current Account" : "Remove Account"}
                    </button>
                    <p className="mt-3 text-[12px] text-rose-700/80">
                      {expandedIsCurrentUser
                        ? "You cannot remove the active session."
                        : "Deletes the Neon login and app record."}
                    </p>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {pendingRemoval ? (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="account-removal-title"
              className="w-full max-w-[440px] rounded-2xl border border-rose-200 bg-white p-5 shadow-2xl"
              initial={{ y: 16, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 16, scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-700">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 id="account-removal-title" className="text-[16px] font-semibold text-slate-950">
                      Remove account?
                    </h2>
                    <p className="mt-1 text-[13px] leading-5 text-slate-600">
                      Removing this account deletes the Neon login and app record. This action cannot be undone.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPendingRemoval(null)}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-[13px] font-medium text-slate-900">{pendingRemoval.name}</p>
                <p className="mt-0.5 text-[12px] text-slate-500">{pendingRemoval.email}</p>
              </div>

              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setPendingRemoval(null)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <form method="post" action="/api/admin/accounts/remove">
                  <input type="hidden" name="authUserId" value={pendingRemoval.authUserId} />
                  <input type="hidden" name="email" value={pendingRemoval.email} />
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-rose-600 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-rose-700 sm:w-auto"
                  >
                    Remove account
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
    </div>
  )
}
