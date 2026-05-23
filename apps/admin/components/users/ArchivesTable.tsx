"use client"
import { useDebounce } from "../inventory/hookTs"
import { useMemo, useState } from "react"
import { Search, Crown, Shield, ShieldCheck, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { type ManagedAccount } from "./UsersTable"

export function ArchivesTable({
  users,
  roleLabels,
}: {
  users: ManagedAccount[]
  roleLabels: Record<string, string>
}) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"" | "ACTIVE" | "DELETED">("")
  const [pageSize] = useState(10)
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search, 500)

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase()
    return users.filter((u) => {
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) {
        return false
      }
      if (statusFilter && u.status.toUpperCase() !== statusFilter) return false
      return true
    })
  }, [users, debouncedSearch, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const paged = filtered.slice(start, start + pageSize)

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
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(value))
  }

  function StatusBadge({ status }: { status: string }) {
    const normalized = status.toUpperCase()
    const styles =
      normalized === "ACTIVE"
        ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
        : normalized === "DELETED" || normalized === "ARCHIVED"
          ? "bg-rose-100 text-rose-700 ring-rose-200"
          : "bg-slate-100 text-slate-700 ring-slate-200"

    const label = normalized === "DELETED" ? "Deleted" : normalized.charAt(0) + normalized.slice(1).toLowerCase()

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${styles}`}>
        {label}
      </span>
    )
  }

  function RoleBadge({ role, label }: { role: string; label: string }) {
    const Icon = role === "ADMIN_MANAGEMENT" ? Crown : role === "CLIENT" ? UserIcon : role === "OPERATIONS_DESIGN" ? ShieldCheck : Shield
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

  return (
    <div className="space-y-4">
      {/* Search & filters — separate container */}
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
              placeholder="Search archived accounts..."
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-[13px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
            />
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-0.5 text-[12px]">
              {([
                { value: "", label: "All" },
                { value: "ACTIVE", label: "Active" },
                { value: "DELETED", label: "Deleted" },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setStatusFilter(opt.value)
                    setPage(1)
                  }}
                  className={`rounded-full px-3 py-1 transition-colors ${
                    statusFilter === opt.value
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] text-slate-600">
              {filtered.length} {filtered.length === 1 ? "account" : "accounts"}
            </span>
          </div>
        </div>
      </section>

      {/* Archives table — its own container */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-slate-200 bg-white">
              <tr className="text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Archived Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-[13px] text-slate-500">
                    No archived accounts found.
                  </td>
                </tr>
              ) : (
                paged.map((account) => (
                  <tr
                    key={account.authUserId}
                    className="border-b border-slate-100 last:border-b-0 align-middle hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-4">
                      <Link href={`/archives/${account.id}`} className="flex items-center gap-3 group">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[12px] font-semibold text-slate-700">
                          {getInitials(account.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-slate-900 underline-offset-2 group-hover:underline">
                            {account.name}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Click to view history</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-[13px] text-slate-600">{account.email}</td>
                    <td className="px-4 py-4 text-[13px] text-slate-600">{formatDate(account.updatedAt)}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={account.status} />
                    </td>
                    <td className="px-4 py-4">
                      <RoleBadge role={account.role} label={roleLabels[account.role] ?? account.role} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
      </section>
    </div>
  )
}
