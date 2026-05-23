"use client"

import { useState } from "react"
import { Plus, Phone, Mail, MapPin, User, Package, ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import type { SupplierRow } from "@/lib/procurement"

type MaterialOption = { id: string; sku: string; itemName: string; unitOfMeasure: string }

type Props = {
  suppliers: SupplierRow[]
  materials: MaterialOption[]
}

function formatPeso(v: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 2 }).format(v)
}

export function SuppliersManager({ suppliers, materials }: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const [editSupplier, setEditSupplier] = useState<SupplierRow | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [addingAddressFor, setAddingAddressFor] = useState<string | null>(null)
  const [addingProductFor, setAddingProductFor] = useState<string | null>(null)

  const active = suppliers.filter((s) => s.isActive)
  const inactive = suppliers.filter((s) => !s.isActive)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-semibold text-[#111827]">Suppliers</h3>
          <p className="mt-0.5 text-[13px] text-[#6b7280]">
            Contact directory for raw material suppliers. {active.length} active{inactive.length > 0 ? `, ${inactive.length} inactive` : ""}.
          </p>
        </div>
        <button type="button" onClick={() => { setEditSupplier(null); setShowAdd(true) }}
          className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#374151]">
          <Plus className="h-4 w-4" />Add supplier
        </button>
      </div>

      {suppliers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#d1d5db] bg-[#f9fafb] px-6 py-16 text-center text-[13px] text-[#6b7280]">
          No suppliers yet. Add one to keep track of who to contact for materials.
        </div>
      ) : (
        <div className="space-y-3">
          {suppliers.map((s) => {
            const isExpanded = expandedId === s.id
            const mainAddress = s.addresses.find((a) => a.isMain) ?? s.addresses[0]

            return (
              <div key={s.id} className={`rounded-2xl border ${s.isActive ? "border-[#e5e7eb] bg-white shadow-sm" : "border-[#f3f4f6] bg-[#f9fafb] opacity-60"}`}>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 p-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#111827]">{s.name}</p>
                      {!s.isActive && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">Inactive</span>}
                      {s.addresses.length > 0 && (
                        <span className="rounded-full bg-[#eff6ff] px-2 py-0.5 text-[10px] font-medium text-[#3b82f6]">
                          {s.addresses.length} address{s.addresses.length > 1 ? "es" : ""}
                        </span>
                      )}
                      {s.products.length > 0 && (
                        <span className="rounded-full bg-[#f0fdf4] px-2 py-0.5 text-[10px] font-medium text-[#16a34a]">
                          {s.products.length} material{s.products.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      {s.contactPerson && (
                        <span className="flex items-center gap-1 text-[12px] text-[#6b7280]"><User className="h-3.5 w-3.5" />{s.contactPerson}</span>
                      )}
                      {s.phone && (
                        <span className="flex items-center gap-1 text-[12px] text-[#6b7280]"><Phone className="h-3.5 w-3.5" />{s.phone}</span>
                      )}
                      {s.email && (
                        <span className="flex items-center gap-1 text-[12px] text-[#6b7280]"><Mail className="h-3.5 w-3.5" />{s.email}</span>
                      )}
                      {mainAddress && (
                        <span className="flex items-center gap-1 text-[12px] text-[#6b7280]"><MapPin className="h-3.5 w-3.5" />{mainAddress.address}{mainAddress.city ? `, ${mainAddress.city}` : ""}</span>
                      )}
                    </div>
                  </div>
                  <button type="button" onClick={() => setExpandedId(isExpanded ? null : s.id)}
                    className="shrink-0 rounded-lg border border-[#e5e7eb] p-1.5 text-[#6b7280] hover:bg-[#f9fafb]">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-[#f3f4f6] px-5 pb-5 pt-4 space-y-5">

                    {/* Addresses */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-[12px] font-semibold uppercase tracking-wide text-[#94a3b8]">Addresses</p>
                        <button type="button" onClick={() => setAddingAddressFor(s.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#f3f4f6] px-2.5 py-1 text-[11px] font-medium text-[#374151] hover:bg-[#e5e7eb]">
                          <Plus className="h-3 w-3" />Add
                        </button>
                      </div>
                      {s.addresses.length === 0 ? (
                        <p className="text-[12px] text-[#9ca3af]">No addresses yet.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {s.addresses.map((a) => (
                            <div key={a.id} className="flex items-start justify-between gap-2 rounded-lg border border-[#f3f4f6] bg-[#f9fafb] px-3 py-2">
                              <div>
                                {a.label && <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">{a.label}{a.isMain ? " · Main" : ""}</p>}
                                <p className="text-[13px] text-[#374151]">{a.address}{a.city ? `, ${a.city}` : ""}{a.province ? `, ${a.province}` : ""}</p>
                              </div>
                              <form method="post" action="/api/admin/procurement/suppliers">
                                <input type="hidden" name="action" value="delete-address" />
                                <input type="hidden" name="addressId" value={a.id} />
                                <button type="submit" className="rounded p-1 text-[#9ca3af] hover:bg-rose-50 hover:text-rose-500"><Trash2 className="h-3.5 w-3.5" /></button>
                              </form>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Materials supplied */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-[12px] font-semibold uppercase tracking-wide text-[#94a3b8]">Materials supplied</p>
                        <button type="button" onClick={() => setAddingProductFor(s.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#f3f4f6] px-2.5 py-1 text-[11px] font-medium text-[#374151] hover:bg-[#e5e7eb]">
                          <Plus className="h-3 w-3" />Add
                        </button>
                      </div>
                      {s.products.length === 0 ? (
                        <p className="text-[12px] text-[#9ca3af]">No materials listed yet.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {s.products.map((p) => (
                            <div key={p.id} className="flex items-center justify-between gap-2 rounded-lg border border-[#f3f4f6] bg-[#f9fafb] px-3 py-2">
                              <div className="flex items-center gap-3">
                                <Package className="h-4 w-4 shrink-0 text-[#94a3b8]" />
                                <div>
                                  <p className="text-[13px] font-medium text-[#374151]">{p.materialName}</p>
                                  <p className="text-[11px] text-[#9ca3af]">
                                    {p.unitCost != null ? formatPeso(p.unitCost) : "No price set"}
                                    {p.unitOfMeasure ? ` / ${p.unitOfMeasure}` : ""}
                                    {p.notes ? ` · ${p.notes}` : ""}
                                  </p>
                                </div>
                              </div>
                              <form method="post" action="/api/admin/procurement/suppliers">
                                <input type="hidden" name="action" value="delete-product" />
                                <input type="hidden" name="productId" value={p.id} />
                                <button type="submit" className="rounded p-1 text-[#9ca3af] hover:bg-rose-50 hover:text-rose-500"><Trash2 className="h-3.5 w-3.5" /></button>
                              </form>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 border-t border-[#f3f4f6] pt-3">
                      <button type="button" onClick={() => { setEditSupplier(s); setShowAdd(true) }}
                        className="rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-[12px] font-medium text-[#374151] hover:bg-[#f9fafb]">Edit</button>
                      <form method="post" action="/api/admin/procurement/suppliers">
                        <input type="hidden" name="action" value="toggle" />
                        <input type="hidden" name="supplierId" value={s.id} />
                        <input type="hidden" name="name" value={s.name} />
                        <button type="submit" className="rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-[12px] font-medium text-[#374151] hover:bg-[#f9fafb]">
                          {s.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit supplier modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-[#111827]">{editSupplier ? "Edit Supplier" : "Add Supplier"}</h3>
              <button type="button" onClick={() => { setShowAdd(false); setEditSupplier(null) }} className="rounded-full border border-[#e5e7eb] p-1.5 text-[#9ca3af] hover:bg-[#f9fafb]">✕</button>
            </div>
            <form method="post" action="/api/admin/procurement/suppliers" className="space-y-3">
              <input type="hidden" name="action" value={editSupplier ? "update" : "create"} />
              {editSupplier && <input type="hidden" name="supplierId" value={editSupplier.id} />}
              {[
                { name: "name", label: "Supplier name *", required: true, placeholder: "e.g. ABC Hardware Supply", defaultValue: editSupplier?.name },
                { name: "contactPerson", label: "Contact person", placeholder: "e.g. Juan dela Cruz", defaultValue: editSupplier?.contactPerson ?? "" },
                { name: "phone", label: "Phone / Viber", placeholder: "e.g. 09XX XXX XXXX", defaultValue: editSupplier?.phone ?? "" },
                { name: "email", label: "Email", placeholder: "supplier@example.com", defaultValue: editSupplier?.email ?? "" },
                { name: "notes", label: "Notes", placeholder: "e.g. Best for bulk board orders", defaultValue: editSupplier?.notes ?? "" },
              ].map((f) => (
                <label key={f.name} className="block">
                  <span className="mb-1 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">{f.label}</span>
                  <input name={f.name} required={f.required} placeholder={f.placeholder} defaultValue={f.defaultValue ?? ""}
                    className="w-full rounded-xl border border-[#d1d5dc] bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[#111827]" />
                </label>
              ))}
              <div className="flex justify-end gap-2 border-t border-[#e5e7eb] pt-4">
                <button type="button" onClick={() => { setShowAdd(false); setEditSupplier(null) }}
                  className="rounded-xl border border-[#d1d5dc] px-4 py-2.5 text-[13px] font-medium text-[#374151] hover:bg-[#f9fafb]">Cancel</button>
                <button type="submit" className="rounded-xl bg-[#111827] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#374151]">
                  {editSupplier ? "Save changes" : "Add supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add address modal */}
      {addingAddressFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-[#111827]">Add Address</h3>
              <button type="button" onClick={() => setAddingAddressFor(null)} className="rounded-full border border-[#e5e7eb] p-1.5 text-[#9ca3af] hover:bg-[#f9fafb]">✕</button>
            </div>
            <form method="post" action="/api/admin/procurement/suppliers" className="space-y-3">
              <input type="hidden" name="action" value="add-address" />
              <input type="hidden" name="supplierId" value={addingAddressFor} />
              {[
                { name: "label", label: "Label", placeholder: "e.g. Main, Warehouse, Branch" },
                { name: "address", label: "Street address *", required: true, placeholder: "e.g. 001B Carlos cor Dizon St" },
                { name: "city", label: "City", placeholder: "e.g. Novaliches" },
                { name: "province", label: "Province / Region", placeholder: "e.g. Metro Manila" },
              ].map((f) => (
                <label key={f.name} className="block">
                  <span className="mb-1 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">{f.label}</span>
                  <input name={f.name} required={f.required} placeholder={f.placeholder}
                    className="w-full rounded-xl border border-[#d1d5dc] bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[#111827]" />
                </label>
              ))}
              <label className="flex items-center gap-2 text-[13px] text-[#374151]">
                <input type="checkbox" name="isMain" className="h-4 w-4 rounded border-gray-300" />
                Set as main address
              </label>
              <div className="flex justify-end gap-2 border-t border-[#e5e7eb] pt-4">
                <button type="button" onClick={() => setAddingAddressFor(null)}
                  className="rounded-xl border border-[#d1d5dc] px-4 py-2.5 text-[13px] font-medium text-[#374151] hover:bg-[#f9fafb]">Cancel</button>
                <button type="submit" className="rounded-xl bg-[#111827] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#374151]">Add address</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add material modal */}
      {addingProductFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-[#111827]">Add Material</h3>
              <button type="button" onClick={() => setAddingProductFor(null)} className="rounded-full border border-[#e5e7eb] p-1.5 text-[#9ca3af] hover:bg-[#f9fafb]">✕</button>
            </div>
            <form method="post" action="/api/admin/procurement/suppliers" className="space-y-3">
              <input type="hidden" name="action" value="add-product" />
              <input type="hidden" name="supplierId" value={addingProductFor} />
              <label className="block">
                <span className="mb-1 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Link to inventory material (optional)</span>
                <select name="materialStockId" className="w-full rounded-xl border border-[#d1d5dc] bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[#111827]">
                  <option value="">— Not linked —</option>
                  {materials.map((m) => <option key={m.id} value={m.id}>{m.itemName} ({m.sku})</option>)}
                </select>
              </label>
              {[
                { name: "materialName", label: "Material name *", required: true, placeholder: "e.g. 18mm Board" },
                { name: "unitCost", label: "Unit cost (₱)", placeholder: "e.g. 250.00" },
                { name: "unitOfMeasure", label: "Unit of measure", placeholder: "e.g. pcs, sheet, kg" },
                { name: "notes", label: "Notes", placeholder: "e.g. Available in bulk" },
              ].map((f) => (
                <label key={f.name} className="block">
                  <span className="mb-1 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">{f.label}</span>
                  <input name={f.name} required={f.required} placeholder={f.placeholder}
                    className="w-full rounded-xl border border-[#d1d5dc] bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[#111827]" />
                </label>
              ))}
              <div className="flex justify-end gap-2 border-t border-[#e5e7eb] pt-4">
                <button type="button" onClick={() => setAddingProductFor(null)}
                  className="rounded-xl border border-[#d1d5dc] px-4 py-2.5 text-[13px] font-medium text-[#374151] hover:bg-[#f9fafb]">Cancel</button>
                <button type="submit" className="rounded-xl bg-[#111827] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#374151]">Add material</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
