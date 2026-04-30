"use client"

import { Fragment, useMemo, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  MoreHorizontal,
  Search,
  Shield,
  ShieldCheck,
  User as UserIcon,
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
  lastLoginAt: string | null
  createdAt: string | null
  updatedAt: string | null
  company?: string | null
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
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-700">
      <Icon className="h-3.5 w-3.5 text-slate-500" />
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
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)

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
    const q = search.trim().toLowerCase()
    return users.filter((u) => {
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) {
        return false
      }
      if (statusFilter && u.status.toUpperCase() !== statusFilter) return false
      if (roleFilter && u.role !== roleFilter) return false
      return true
    })
  }, [users, search, statusFilter, roleFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const paged = filtered.slice(start, start + pageSize)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-4">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Filter users..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-[13px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 outline-none focus:border-slate-400"
        >
          <option value="">All statuses</option>
          {allStatuses.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>

        {variant === "internal" && allRoles.length > 1 ? (
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value)
              setPage(1)
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 outline-none focus:border-slate-400"
          >
            <option value="">All roles</option>
            {allRoles.map((r) => (
              <option key={r} value={r}>
                {roleLabels[r] ?? r}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr className="text-[11px] uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              {variant === "customer" ? <th className="px-4 py-3 font-medium">Company</th> : null}
              <th className="px-4 py-3 font-medium">Registered Date</th>
              <th className="px-4 py-3 font-medium">Last Login</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium" />
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
                const isExecutive = account.role === "ADMIN_MANAGEMENT"
                const editableRoles = isCurrentUser ? internalRoleOptions : staffRoleOptions
                const expandColSpan = variant === "customer" ? 8 : 7

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
                    <td className="px-4 py-4">
                      <RoleBadge role={account.role} label={roleLabels[account.role] ?? account.role} />
                    </td>
                    <td className="px-4 py-4">
                      {variant === "internal" ? (
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : account.authUserId)}
                          aria-label="Manage user"
                          className={`rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 ${
                            isExpanded ? "bg-slate-100 text-slate-900" : ""
                          }`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      ) : null}
                    </td>
                  </motion.tr>
                  <AnimatePresence initial={false}>
                    {variant === "internal" && isExpanded ? (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan={expandColSpan} className="border-b border-slate-100 bg-slate-50/80 px-5 py-5">
                          <motion.div
                            initial={{ y: -8, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -8, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_220px]"
                          >
                            {/* Edit details */}
                            <form
                              method="post"
                              action="/api/admin/accounts/update"
                              className="rounded-xl border border-slate-200 bg-white p-4"
                            >
                              <input type="hidden" name="authUserId" value={account.authUserId} />
                              <input type="hidden" name="email" value={account.email} />
                              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Edit details
                              </p>
                              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_140px]">
                                <input
                                  name="name"
                                  defaultValue={account.name}
                                  disabled={isExecutive}
                                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
                                />
                                {isExecutive ? (
                                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-500">
                                    {roleLabels[account.role] ?? account.role}
                                  </div>
                                ) : (
                                  <select
                                    name="role"
                                    defaultValue={account.role}
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none focus:border-slate-400"
                                  >
                                    {editableRoles.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                )}
                                <button
                                  type="submit"
                                  disabled={isExecutive}
                                  className="rounded-lg bg-slate-900 px-3 py-2 text-[13px] font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                                >
                                  {isExecutive ? "Locked" : "Save"}
                                </button>
                              </div>
                              <p className="mt-2 text-[11px] text-slate-500">
                                {isExecutive
                                  ? "This protected executive account cannot be edited here."
                                  : "Admin / Management is reserved for the executive account."}
                              </p>
                            </form>

                            {/* Password */}
                            <form
                              method="post"
                              action="/api/admin/accounts/password"
                              className="rounded-xl border border-slate-200 bg-white p-4"
                            >
                              <input type="hidden" name="authUserId" value={account.authUserId} />
                              <input type="hidden" name="email" value={account.email} />
                              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Password
                              </p>
                              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_140px]">
                                <PasswordField
                                  name="newPassword"
                                  placeholder="New password"
                                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none focus:border-slate-400"
                                />
                                <button
                                  type="submit"
                                  className="rounded-lg bg-blue-600 px-3 py-2 text-[13px] font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                  Update
                                </button>
                              </div>
                            </form>

                            {/* Remove */}
                            <form
                              method="post"
                              action="/api/admin/accounts/remove"
                              className="rounded-xl border border-rose-200 bg-rose-50/60 p-4"
                            >
                              <input type="hidden" name="authUserId" value={account.authUserId} />
                              <input type="hidden" name="email" value={account.email} />
                              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-rose-600">
                                Remove
                              </p>
                              <button
                                type="submit"
                                disabled={isCurrentUser}
                                className="w-full rounded-lg bg-rose-600 px-3 py-2 text-[13px] font-medium text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
                              >
                                {isCurrentUser ? "Current account" : "Remove account"}
                              </button>
                              <p className="mt-2 text-[11px] text-amber-700">
                                {isCurrentUser
                                  ? "You cannot remove the active session."
                                  : "Deletes the Neon login and app record."}
                              </p>
                            </form>
                          </motion.div>
                        </td>
                      </motion.tr>
                    ) : null}
                  </AnimatePresence>
                  </Fragment>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-3">
        <p className="text-[12px] text-slate-500">
          {filtered.length} {filtered.length === 1 ? "user" : "users"}
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[12px] text-slate-500">
            <span>Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setPage(1)
              }}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[12px] text-slate-700 outline-none focus:border-slate-400"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <span className="text-[12px] text-slate-500">
            Page {safePage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
