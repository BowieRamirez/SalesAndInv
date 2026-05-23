"use client"

import { useState } from "react"
import { Plus, Trash2, Truck, ShoppingCart } from "lucide-react"
import type { SupplierRow, PurchaseOrderRow } from "@/lib/procurement"

type MaterialOption = {
  id: string
  sku: string
  itemName: string
  unitOfMeasure: string
  availableQty: number
}

type Props = {
  suppliers: SupplierRow[]
  purchaseOrders: PurchaseOrderRow[]
  materials: MaterialOption[]
}

function formatPeso(v: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 2 }).format(v)
}

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  PENDING_APPROVAL: "bg-amber-100 text-amber-700",
  APPROVED: "bg-blue-100 text-blue-700",
  REJECTED: "bg-rose-100 text-rose-700",
  ORDERED: "bg-indigo-100 text-indigo-700",
  GOODS_RECEIVED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-gray-100 text-gray-500",
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  PENDING_APPROVAL: "Pending Approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  ORDERED: "Ordered",
  GOODS_RECEIVED: "Received",
  CANCELLED: "Cancelled",
}

type LineItem = { key: number; materialId: string; quantity: string; unitCost: string }
let keyCounter = 0

export function ProcurementManager({ suppliers, purchaseOrders, materials }: Props) {
  const [activeSection, setActiveSection] = useState<"orders" | "suppliers">("orders")
  const [showCreatePO, setShowCreatePO] = useState(false)
  const [showCreateSupplier, setShowCreateSupplier] = useState(false)
  const [lineItems, setLineItems] = useState<LineItem[]>([{ key: ++keyCounter, materialId: "", quantity: "1", unitCost: "" }])

  const activeSuppliers = suppliers.filter((s) => s.isActive)

  function addLineItem() {
    setLineItems((prev) => [...prev, { key: ++keyCounter, materialId: "", quantity: "1", unitCost: "" }])
  }
  function removeLineItem(key: number) {
    setLineItems((prev) => prev.length > 1 ? prev.filter((i) => i.key !== key) : prev)
  }
  function updateLineItem(key: number, field: keyof Omit<LineItem, "key">, value: string) {
    setLineItems((prev) => prev.map((i) => i.key === key ? { ...i, [field]: value } : i))
  }

  const computedTotal = lineItems.reduce((sum, item) => {
    const qty = parseInt(item.quantity) || 0
    const cost = parseFloat(item.unitCost) || 0
    return sum + qty * cost
  }, 0)

  return (
    <div className="space-y-6">
      {/* Section tabs */}
      <div className="flex gap-2">
        <button type="button" onClick={() => setActiveSection("orders")}
          className={`rounded-xl px-4 py-2 text-[13px] font-medium transition-colors ${activeSection === "orders" ? "bg-[#111827] text-white" : "border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]"}`}>
          <ShoppingCart className="mr-1.5 inline h-4 w-4" />Purchase Orders
        </button>
        <button type="button" onClick={() => setActiveSection("suppliers")}
          className={`rounded-xl px-4 py-2 text-[13px] font-medium transition-colors ${activeSection === "suppliers" ? "bg-[#111827] text-white" : "border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]"}`}>
          <Truck className="mr-1.5 inline h-4 w-4" />Suppliers
        </button>
      </div>

      {/* ── PURCHASE ORDERS ── */}
      {activeSection === "orders" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-semibold text-[#111827]">Purchase Orders</h3>
              <p className="mt-0.5 text-[13px] text-[#6b7280]">Create and track material orders from suppliers.</p>
            </div>
            <button type="button" onClick={() => setShowCreatePO(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#374151]">
              <Plus className="h-4 w-4" />New PO
            </button>
          </div>

          {purchaseOrders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#d1d5db] bg-[#f9fafb] px-6 py-12 text-center text-[13px] text-[#6b7280]">
              No purchase orders yet. Create one to start ordering materials from suppliers.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
              <table className="min-w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#f3f4f6] bg-[#f9fafb]">
                    <th className="px-4 py-3 font-semibold text-[#374151]">PO Number</th>
                    <th className="px-4 py-3 font-semibold text-[#374151]">Supplier</th>
                    <th className="px-4 py-3 font-semibold text-[#374151]">Status</th>
                    <th className="px-4 py-3 font-semibold text-[#374151]">Items</th>
                    <th className="px-4 py-3 font-semibold text-[#374151]">Total</th>
                    <th className="px-4 py-3 font-semibold text-[#374151]">Requested by</th>
                    <th className="px-4 py-3 font-semibold text-[#374151]">Date</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrders.map((po) => (
                    <tr key={po.id} className="border-b border-[#f3f4f6] last:border-b-0 hover:bg-[#fafafa]">
                      <td className="px-4 py-3 font-mono text-[12px] font-semibold text-[#111827]">{po.poNumber}</td>
                      <td className="px-4 py-3 text-[#374151]">{po.supplierName ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${STATUS_STYLES[po.status] ?? "bg-slate-100 text-slate-600"}`}>
                          {STATUS_LABELS[po.status] ?? po.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#6b7280]">{po.itemCount}</td>
                      <td className="px-4 py-3 font-medium text-[#111827]">{formatPeso(po.totalAmount)}</td>
                      <td className="px-4 py-3 text-[#6b7280]">{po.requestedByName}</td>
                      <td className="px-4 py-3 text-[#9ca3af]">{new Date(po.createdAt).toLocaleDateString("en-PH")}</td>
                      <td className="px-4 py-3">
                        <POActions po={po} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── SUPPLIERS ── */}
      {activeSection === "suppliers" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-[#111827]">Suppliers</h3>
            <button type="button" onClick={() => setShowCreateSupplier(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#374151]">
              <Plus className="h-4 w-4" />Add supplier
            </button>
          </div>
          {suppliers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#d1d5db] bg-[#f9fafb] px-6 py-12 text-center text-[13px] text-[#6b7280]">
              No suppliers yet. Add one to start creating purchase orders.
            </div>
          ) : (
            <div className="space-y-2">
              {suppliers.map((s) => (
                <div key={s.id} className={`rounded-xl border p-4 ${s.isActive ? "border-[#e5e7eb] bg-white" : "border-[#f3f4f6] bg-[#f9fafb] opacity-60"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#111827]">{s.name}
                        {!s.isActive && <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">Inactive</span>}
                      </p>
                      {s.contactPerson && <p className="mt-0.5 text-[12px] text-[#6b7280]">Contact: {s.contactPerson}</p>}
                      <div className="mt-1 flex flex-wrap gap-3 text-[12px] text-[#9ca3af]">
                        {s.phone && <span>📞 {s.phone}</span>}
                        {s.email && <span>✉ {s.email}</span>}
                        {s.address && <span>📍 {s.address}</span>}
                      </div>
                    </div>
                    <form method="post" action="/api/admin/procurement/suppliers">
                      <input type="hidden" name="action" value="toggle" />
                      <input type="hidden" name="supplierId" value={s.id} />
                      <button type="submit" className="rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-[12px] text-[#374151] hover:bg-[#f9fafb]">
                        {s.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── CREATE PO MODAL ── */}
      {showCreatePO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-[#111827]">New Purchase Order</h3>
              <button type="button" onClick={() => setShowCreatePO(false)} className="text-[#9ca3af] hover:text-[#374151]">✕</button>
            </div>
            <form method="post" action="/api/admin/procurement/purchase-orders" className="space-y-4">
              <input type="hidden" name="action" value="create" />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Supplier (optional)</span>
                  <select name="supplierId" className="w-full rounded-xl border border-[#d1d5dc] bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[#111827]">
                    <option value="">— No supplier selected —</option>
                    {activeSuppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Expected delivery</span>
                  <input type="date" name="expectedDeliveryAt" className="w-full rounded-xl border border-[#d1d5dc] bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[#111827]" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Remarks</span>
                  <input name="remarks" placeholder="Optional notes" className="w-full rounded-xl border border-[#d1d5dc] bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[#111827]" />
                </label>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#111827]">Materials to order</span>
                  <button type="button" onClick={addLineItem} className="inline-flex items-center gap-1 rounded-lg bg-[#f3f4f6] px-3 py-1.5 text-[12px] font-medium text-[#374151] hover:bg-[#e5e7eb]">
                    <Plus className="h-3.5 w-3.5" />Add material
                  </button>
                </div>
                <div className="space-y-2">
                  {lineItems.map((item, idx) => (
                    <div key={item.key} className="grid gap-2 rounded-xl border border-[#eef2f7] bg-[#f9fafb] p-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
                      <div>
                        <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-[#94a3b8]">Material {idx + 1}</span>
                        <select name="materialId" value={item.materialId} onChange={(e) => updateLineItem(item.key, "materialId", e.target.value)} required className="w-full rounded-lg border border-[#d1d5dc] bg-white px-2.5 py-2 text-[12px] outline-none focus:border-[#111827]">
                          <option value="">Select material</option>
                          {materials.map((m) => <option key={m.id} value={m.id}>{m.itemName} ({m.sku}) — {m.availableQty} {m.unitOfMeasure}</option>)}
                        </select>
                      </div>
                      <div>
                        <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-[#94a3b8]">Qty</span>
                        <input type="number" name="quantity" min="1" value={item.quantity} onChange={(e) => updateLineItem(item.key, "quantity", e.target.value)} required className="w-full rounded-lg border border-[#d1d5dc] bg-white px-2.5 py-2 text-[12px] outline-none focus:border-[#111827]" />
                      </div>
                      <div>
                        <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-[#94a3b8]">Unit cost (₱)</span>
                        <input type="number" name="unitCost" min="0" step="0.01" value={item.unitCost} onChange={(e) => updateLineItem(item.key, "unitCost", e.target.value)} placeholder="0.00" className="w-full rounded-lg border border-[#d1d5dc] bg-white px-2.5 py-2 text-[12px] outline-none focus:border-[#111827]" />
                      </div>
                      <div className="flex items-end">
                        {lineItems.length > 1 && <button type="button" onClick={() => removeLineItem(item.key)} className="rounded-lg p-1.5 text-[#9ca3af] hover:bg-rose-50 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-end text-[13px] font-semibold text-[#111827]">
                  Estimated total: {formatPeso(computedTotal)}
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-[#e5e7eb] pt-4">
                <button type="button" onClick={() => setShowCreatePO(false)} className="rounded-xl border border-[#d1d5dc] px-4 py-2.5 text-[13px] font-medium text-[#374151] hover:bg-[#f9fafb]">Cancel</button>
                <button type="submit" className="rounded-xl bg-[#111827] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#374151]">Save as draft</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD SUPPLIER MODAL ── */}
      {showCreateSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-[#111827]">Add Supplier</h3>
              <button type="button" onClick={() => setShowCreateSupplier(false)} className="text-[#9ca3af] hover:text-[#374151]">✕</button>
            </div>
            <form method="post" action="/api/admin/procurement/suppliers" className="space-y-3">
              <input type="hidden" name="action" value="create" />
              {[
                { name: "name", label: "Supplier name *", required: true, placeholder: "e.g. ABC Hardware Supply" },
                { name: "contactPerson", label: "Contact person", placeholder: "e.g. Juan dela Cruz" },
                { name: "phone", label: "Phone", placeholder: "e.g. 09XX XXX XXXX" },
                { name: "email", label: "Email", placeholder: "supplier@example.com" },
                { name: "address", label: "Address", placeholder: "Street, City" },
              ].map((f) => (
                <label key={f.name} className="block">
                  <span className="mb-1 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">{f.label}</span>
                  <input name={f.name} required={f.required} placeholder={f.placeholder} className="w-full rounded-xl border border-[#d1d5dc] bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[#111827]" />
                </label>
              ))}
              <div className="flex justify-end gap-2 border-t border-[#e5e7eb] pt-4">
                <button type="button" onClick={() => setShowCreateSupplier(false)} className="rounded-xl border border-[#d1d5dc] px-4 py-2.5 text-[13px] font-medium text-[#374151] hover:bg-[#f9fafb]">Cancel</button>
                <button type="submit" className="rounded-xl bg-[#111827] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#374151]">Add supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ── PO action buttons (submit, mark ordered, cancel) ──────────────────────────
function POActions({ po }: { po: PurchaseOrderRow }) {
  if (po.status === "DRAFT") {
    return (
      <div className="flex gap-1.5">
        <form method="post" action="/api/admin/procurement/purchase-orders">
          <input type="hidden" name="action" value="submit" />
          <input type="hidden" name="poId" value={po.id} />
          <button type="submit" className="rounded-lg bg-amber-500 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-amber-600">Submit</button>
        </form>
        <form method="post" action="/api/admin/procurement/purchase-orders">
          <input type="hidden" name="action" value="cancel" />
          <input type="hidden" name="poId" value={po.id} />
          <button type="submit" className="rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-[11px] font-medium text-[#374151] hover:bg-[#f9fafb]">Cancel</button>
        </form>
      </div>
    )
  }
  if (po.status === "PENDING_APPROVAL") {
    return (
      <form method="post" action="/api/admin/procurement/purchase-orders">
        <input type="hidden" name="action" value="cancel" />
        <input type="hidden" name="poId" value={po.id} />
        <button type="submit" className="rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-[11px] font-medium text-[#374151] hover:bg-[#f9fafb]">Cancel</button>
      </form>
    )
  }
  if (po.status === "APPROVED") {
    return (
      <form method="post" action="/api/admin/procurement/purchase-orders">
        <input type="hidden" name="action" value="mark-ordered" />
        <input type="hidden" name="poId" value={po.id} />
        <button type="submit" className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-700">Mark as Ordered</button>
      </form>
    )
  }
  if (po.status === "ORDERED") {
    return (
      <a href={`/operations?tab=suppliers&receive=${po.id}`} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-700">
        Receive Goods
      </a>
    )
  }
  return null
}
