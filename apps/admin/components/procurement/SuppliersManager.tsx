"use client"

import { useMemo, useRef, useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import type { SupplierRow } from "@/lib/procurement"
import { useDebounce } from "../inventory/hookTs"

type MaterialOption = { id: string; sku: string; itemName: string; unitOfMeasure: string }

type Props = {
  suppliers: SupplierRow[]
  materials: MaterialOption[]
}

function formatPeso(v: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 2 }).format(v)
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

const AVATAR_TONES = [
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-sky-100 text-sky-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
] as const

function avatarTone(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }
  return AVATAR_TONES[Math.abs(hash) % AVATAR_TONES.length]
}

const INPUT_CLS = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"

type MaterialDraft = {
  key: number
  materialStockId: string
  materialName: string
  unitOfMeasure: string
  unitCost: string
  notes: string
}

function emptyDraft(key: number): MaterialDraft {
  return { key, materialStockId: "", materialName: "", unitOfMeasure: "", unitCost: "", notes: "" }
}

function AddMaterialsForm({
  supplierId,
  materials,
  onClose,
}: {
  supplierId: string
  materials: MaterialOption[]
  onClose: () => void
}) {
  const [rows, setRows] = useState<MaterialDraft[]>([emptyDraft(0)])
  const nextKey = useRef(1)

  function addRow() {
    const key = nextKey.current
    nextKey.current += 1
    setRows((prev) => [...prev, emptyDraft(key)])
  }

  function removeRow(key: number) {
    setRows((prev) => prev.filter((r) => r.key !== key))
  }

  function updateRow(key: number, patch: Partial<MaterialDraft>) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)))
  }

  function handleLinkChange(key: number, stockId: string) {
    const linked = materials.find((m) => m.id === stockId)
    updateRow(key, {
      materialStockId: stockId,
      materialName: linked ? linked.itemName : "",
      unitOfMeasure: linked ? linked.unitOfMeasure : "",
    })
  }

  return (
    <form method="post" action="/api/admin/procurement/suppliers" className="flex flex-col">
      <input type="hidden" name="action" value="add-product" />
      <input type="hidden" name="supplierId" value={supplierId} />

      <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          {rows.map((row, idx) => (
            <div
              key={row.key}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[12px] font-semibold text-slate-500">Material {idx + 1}</p>
                {rows.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeRow(row.key)}
                    className="rounded p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
                    aria-label="Remove row"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>

              {/* Hidden indexed fields for the API */}
              <input type="hidden" name={`materialStockId[${idx}]`} value={row.materialStockId} />
              <input type="hidden" name={`materialName[${idx}]`} value={row.materialName} />
              <input type="hidden" name={`unitOfMeasure[${idx}]`} value={row.unitOfMeasure} />
              <input type="hidden" name={`unitCost[${idx}]`} value={row.unitCost} />
              <input type="hidden" name={`notes[${idx}]`} value={row.notes} />

              <div className="space-y-3">
                {/* Link to inventory */}
                <label className="block">
                  <span className="mb-1 block text-[12px] font-medium text-slate-700">
                    Link to inventory material
                    <span className="ml-1 text-slate-400">(autofills name & unit)</span>
                  </span>
                  <select
                    value={row.materialStockId}
                    onChange={(e) => handleLinkChange(row.key, e.target.value)}
                    className={INPUT_CLS}
                  >
                    <option value="">— Not linked —</option>
                    {materials.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.itemName} ({m.sku})
                      </option>
                    ))}
                  </select>
                </label>

                {/* Name */}
                <label className="block">
                  <span className="mb-1 block text-[12px] font-medium text-slate-700">Material name *</span>
                  <input
                    value={row.materialName}
                    onChange={(e) => updateRow(row.key, { materialName: e.target.value })}
                    placeholder="e.g. 18mm Board"
                    required
                    className={INPUT_CLS}
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-3">
                  {/* Unit of measure */}
                  <label className="block">
                    <span className="mb-1 block text-[12px] font-medium text-slate-700">Unit</span>
                    <input
                      value={row.unitOfMeasure}
                      onChange={(e) => updateRow(row.key, { unitOfMeasure: e.target.value })}
                      placeholder="e.g. pcs, kg"
                      className={INPUT_CLS}
                    />
                  </label>

                  {/* Unit cost */}
                  <label className="block">
                    <span className="mb-1 block text-[12px] font-medium text-slate-700">Unit cost (₱)</span>
                    <input
                      value={row.unitCost}
                      onChange={(e) => updateRow(row.key, { unitCost: e.target.value })}
                      placeholder="e.g. 250.00"
                      className={INPUT_CLS}
                    />
                  </label>

                  {/* Notes */}
                  <label className="block">
                    <span className="mb-1 block text-[12px] font-medium text-slate-700">Notes</span>
                    <input
                      value={row.notes}
                      onChange={(e) => updateRow(row.key, { notes: e.target.value })}
                      placeholder="e.g. Bulk only"
                      className={INPUT_CLS}
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addRow}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white py-2.5 text-[13px] font-medium text-slate-600 transition-colors hover:border-slate-400 hover:bg-slate-50"
        >
          <Plus className="h-4 w-4" />
          Add another material
        </button>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-slate-800"
        >
          {rows.length === 1 ? "Add material" : `Add ${rows.length} materials`}
        </button>
      </div>
    </form>
  )
}

export function SuppliersManager({ suppliers, materials }: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const [editSupplier, setEditSupplier] = useState<SupplierRow | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [addingAddressFor, setAddingAddressFor] = useState<string | null>(null)
  const [addingProductFor, setAddingProductFor] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"" | "active" | "inactive">("")
  const debouncedSearch = useDebounce(search, 400)

  const active = suppliers.filter((s) => s.isActive)
  const inactive = suppliers.filter((s) => !s.isActive)

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase()
    return suppliers.filter((s) => {
      if (statusFilter === "active" && !s.isActive) return false
      if (statusFilter === "inactive" && s.isActive) return false
      if (!q) return true
      const haystack = [
        s.name,
        s.contactPerson ?? "",
        s.email ?? "",
        s.phone ?? "",
        s.notes ?? "",
        ...s.addresses.flatMap((a) => [a.label ?? "", a.address, a.city ?? "", a.province ?? "", a.country ?? "", a.postalCode ?? ""]),
        ...s.products.map((p) => p.materialName),
      ].join(" ").toLowerCase()
      return haystack.includes(q)
    })
  }, [suppliers, debouncedSearch, statusFilter])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-900">Suppliers</h2>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Contact directory for raw material suppliers. {active.length} active{inactive.length > 0 ? `, ${inactive.length} inactive` : ""}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setEditSupplier(null); setShowAdd(true) }}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Add supplier
        </button>
      </div>

      {/* Search & filters — separate container */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 px-5 py-4">
          <div className="relative min-w-[260px] flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search supplier, contact, address, material"
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-[13px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
            />
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-0.5 text-[12px]">
              {([
                { value: "", label: "All" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatusFilter(opt.value)}
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
              {filtered.length} {filtered.length === 1 ? "supplier" : "suppliers"}
            </span>
          </div>
        </div>
      </section>

      {/* Supplier cards */}
      {suppliers.length === 0 ? (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="px-6 py-16 text-center text-[13px] text-slate-500">
            No suppliers yet. Add one to keep track of who to contact for materials.
          </div>
        </section>
      ) : filtered.length === 0 ? (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="px-6 py-16 text-center text-[13px] text-slate-500">
            No suppliers match the current filters.
          </div>
        </section>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => {
            const isExpanded = expandedId === s.id
            const mainAddress = s.addresses.find((a) => a.isMain) ?? s.addresses[0]
            const tone = avatarTone(s.name)

            return (
              <section
                key={s.id}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow ${
                  isExpanded ? "border-slate-300 shadow-md" : "border-slate-200 hover:border-slate-300"
                } ${!s.isActive ? "opacity-70" : ""}`}
              >
                {/* Header row */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50/60"
                >
                  <span className={`mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-full text-[13px] font-semibold ${tone}`}>
                    {getInitials(s.name)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[15px] font-semibold text-slate-900">{s.name}</p>
                      {!s.isActive ? (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          Inactive
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                          Active
                        </span>
                      )}
                      {s.addresses.length > 0 ? (
                        <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
                          {s.addresses.length} address{s.addresses.length > 1 ? "es" : ""}
                        </span>
                      ) : null}
                      {s.products.length > 0 ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                          {s.products.length} material{s.products.length > 1 ? "s" : ""}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-slate-500">
                      {s.contactPerson ? (
                        <span className="inline-flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          {s.contactPerson}
                        </span>
                      ) : null}
                      {s.phone ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          {s.phone}
                        </span>
                      ) : null}
                      {s.email ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          {s.email}
                        </span>
                      ) : null}
                      {mainAddress ? (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {[mainAddress.address, mainAddress.city].filter(Boolean).join(", ")}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <span className="ml-2 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors group-hover:border-slate-300">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                </button>

                {/* Expanded body */}
                <AnimatePresence initial={false}>
                  {isExpanded ? (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="overflow-hidden border-t border-slate-100 bg-slate-50/40"
                    >
                      <div className="grid gap-4 p-5 lg:grid-cols-2">
                        {/* Addresses */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <div>
                              <h4 className="text-[13px] font-semibold text-slate-900">Addresses</h4>
                              <p className="text-[11px] text-slate-500">Locations and shipping points.</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setAddingAddressFor(s.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                            >
                              <Plus className="h-3 w-3" />
                              Add
                            </button>
                          </div>
                          {s.addresses.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-3 py-4 text-center text-[12px] text-slate-400">
                              No addresses yet.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {s.addresses.map((a) => (
                                <div
                                  key={a.id}
                                  className="flex items-start justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5"
                                >
                                  <div className="min-w-0">
                                    {a.label ? (
                                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        {a.label}
                                        {a.isMain ? " · Main" : ""}
                                      </p>
                                    ) : a.isMain ? (
                                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Main</p>
                                    ) : null}
                                    <p className="text-[13px] text-slate-700">
                                      {[a.address, a.city, a.province].filter(Boolean).join(", ")}
                                    </p>
                                    {a.country || a.postalCode ? (
                                      <p className="mt-0.5 text-[11px] text-slate-500">
                                        {[a.country, a.postalCode].filter(Boolean).join(" · ")}
                                      </p>
                                    ) : null}
                                  </div>
                                  <form method="post" action="/api/admin/procurement/suppliers">
                                    <input type="hidden" name="action" value="delete-address" />
                                    <input type="hidden" name="addressId" value={a.id} />
                                    <button
                                      type="submit"
                                      className="rounded p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
                                      aria-label="Delete address"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </form>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Materials */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <div>
                              <h4 className="text-[13px] font-semibold text-slate-900">Materials supplied</h4>
                              <p className="text-[11px] text-slate-500">Items this supplier offers and pricing.</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setAddingProductFor(s.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                            >
                              <Plus className="h-3 w-3" />
                              Add
                            </button>
                          </div>
                          {s.products.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-3 py-4 text-center text-[12px] text-slate-400">
                              No materials listed yet.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {s.products.map((p) => (
                                <div
                                  key={p.id}
                                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5"
                                >
                                  <div className="flex min-w-0 items-center gap-3">
                                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
                                      <Package className="h-4 w-4" />
                                    </span>
                                    <div className="min-w-0">
                                      <p className="truncate text-[13px] font-medium text-slate-900">{p.materialName}</p>
                                      <p className="truncate text-[11px] text-slate-500">
                                        {p.unitCost != null ? formatPeso(p.unitCost) : "No price set"}
                                        {p.unitOfMeasure ? ` / ${p.unitOfMeasure}` : ""}
                                        {p.notes ? ` · ${p.notes}` : ""}
                                      </p>
                                    </div>
                                  </div>
                                  <form method="post" action="/api/admin/procurement/suppliers">
                                    <input type="hidden" name="action" value="delete-product" />
                                    <input type="hidden" name="productId" value={p.id} />
                                    <button
                                      type="submit"
                                      className="rounded p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
                                      aria-label="Delete material"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </form>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer actions */}
                      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 bg-white px-5 py-3">
                        <button
                          type="button"
                          onClick={() => { setEditSupplier(s); setShowAdd(true) }}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <form method="post" action="/api/admin/procurement/suppliers">
                          <input type="hidden" name="action" value="toggle" />
                          <input type="hidden" name="supplierId" value={s.id} />
                          <input type="hidden" name="name" value={s.name} />
                          <button
                            type="submit"
                            className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                              s.isActive
                                ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {s.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </section>
            )
          })}
        </div>
      )}

      {/* Add/Edit supplier modal */}
      <AnimatePresence>
        {showAdd ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/45 px-4 py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAdd(false)
                setEditSupplier(null)
              }
            }}
          >
            <motion.div
              className="my-auto w-full max-w-[640px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
              initial={{ y: 16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <div className="sticky top-0 z-10 flex items-start justify-between rounded-t-2xl border-b border-slate-100 bg-white px-6 py-4">
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900">{editSupplier ? "Edit supplier" : "Add supplier"}</h3>
                  <p className="mt-1 text-[12px] text-slate-500">
                    {editSupplier ? "Update contact details for this supplier." : "Add a new supplier and an optional main address."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowAdd(false); setEditSupplier(null) }}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form method="post" action="/api/admin/procurement/suppliers" className="space-y-5 p-6">
                <input type="hidden" name="action" value={editSupplier ? "update" : "create"} />
                {editSupplier ? <input type="hidden" name="supplierId" value={editSupplier.id} /> : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-[12px] font-medium text-slate-700">Supplier name *</span>
                    <input
                      name="name"
                      required
                      placeholder="e.g. ABC Hardware Supply"
                      defaultValue={editSupplier?.name ?? ""}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[12px] font-medium text-slate-700">Contact person</span>
                    <input
                      name="contactPerson"
                      placeholder="e.g. Juan dela Cruz"
                      defaultValue={editSupplier?.contactPerson ?? ""}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[12px] font-medium text-slate-700">Phone / Viber</span>
                    <input
                      name="phone"
                      placeholder="e.g. 09XX XXX XXXX"
                      defaultValue={editSupplier?.phone ?? ""}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-[12px] font-medium text-slate-700">Email</span>
                    <input
                      name="email"
                      type="email"
                      placeholder="supplier@example.com"
                      defaultValue={editSupplier?.email ?? ""}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-[12px] font-medium text-slate-700">Notes</span>
                    <input
                      name="notes"
                      placeholder="e.g. Best for bulk board orders"
                      defaultValue={editSupplier?.notes ?? ""}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                    />
                  </label>
                </div>

                {!editSupplier ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-slate-500">
                      Main address (optional)
                    </p>
                    <div className="space-y-3">
                      <label className="block">
                        <span className="mb-1 block text-[12px] font-medium text-slate-700">Street</span>
                        <input
                          name="address"
                          placeholder="e.g. 001B Carlos cor Dizon St"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                        />
                      </label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-1 block text-[12px] font-medium text-slate-700">City</span>
                          <input
                            name="city"
                            placeholder="e.g. Novaliches"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-[12px] font-medium text-slate-700">Province / Region</span>
                          <input
                            name="province"
                            placeholder="e.g. Metro Manila"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-[12px] font-medium text-slate-700">Country</span>
                          <input
                            name="country"
                            placeholder="e.g. Philippines"
                            defaultValue="Philippines"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-[12px] font-medium text-slate-700">Postal code</span>
                          <input
                            name="postalCode"
                            placeholder="e.g. 1116"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                          />
                        </label>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Leave the street blank to skip. You can add more addresses later from the supplier card.
                      </p>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => { setShowAdd(false); setEditSupplier(null) }}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-slate-900 px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-slate-800"
                  >
                    {editSupplier ? "Save changes" : "Add supplier"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Add address modal */}
      <AnimatePresence>
        {addingAddressFor ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/45 px-4 py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setAddingAddressFor(null)
            }}
          >
            <motion.div
              className="my-auto w-full max-w-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
              initial={{ y: 16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start justify-between border-b border-slate-100 bg-white px-6 py-4">
                <h3 className="text-[15px] font-semibold text-slate-900">Add address</h3>
                <button
                  type="button"
                  onClick={() => setAddingAddressFor(null)}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form method="post" action="/api/admin/procurement/suppliers" className="space-y-3 p-6">
                <input type="hidden" name="action" value="add-address" />
                <input type="hidden" name="supplierId" value={addingAddressFor} />

                <label className="block">
                  <span className="mb-1 block text-[12px] font-medium text-slate-700">Label</span>
                  <input
                    name="label"
                    placeholder="e.g. Main, Warehouse, Branch"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[12px] font-medium text-slate-700">Street address *</span>
                  <input
                    name="address"
                    required
                    placeholder="e.g. 001B Carlos cor Dizon St"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-[12px] font-medium text-slate-700">City</span>
                    <input
                      name="city"
                      placeholder="e.g. Novaliches"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[12px] font-medium text-slate-700">Province / Region</span>
                    <input
                      name="province"
                      placeholder="e.g. Metro Manila"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[12px] font-medium text-slate-700">Country</span>
                    <input
                      name="country"
                      placeholder="e.g. Philippines"
                      defaultValue="Philippines"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[12px] font-medium text-slate-700">Postal code</span>
                    <input
                      name="postalCode"
                      placeholder="e.g. 1116"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                    />
                  </label>
                </div>
                <label className="flex items-center gap-2 text-[13px] text-slate-700">
                  <input type="checkbox" name="isMain" className="h-4 w-4 rounded border-slate-300" />
                  Set as main address
                </label>
                <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setAddingAddressFor(null)}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-slate-900 px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-slate-800"
                  >
                    Add address
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Add material modal */}
      <AnimatePresence>
        {addingProductFor ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/45 px-4 py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setAddingProductFor(null)
            }}
          >
            <motion.div
              className="my-auto w-full max-w-[680px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
              initial={{ y: 16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start justify-between border-b border-slate-100 bg-white px-6 py-4">
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900">Add materials</h3>
                  <p className="mt-1 text-[12px] text-slate-500">
                    Add one or more materials. Pick from inventory to autofill name and unit.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAddingProductFor(null)}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <AddMaterialsForm
                supplierId={addingProductFor}
                materials={materials}
                onClose={() => setAddingProductFor(null)}
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
