"use client"

import { useState } from "react"
import type { PurchaseOrderDetailRow } from "@/lib/procurement"

function formatPeso(v: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 2 }).format(v)
}

export function PurchaseOrderApprovalCard({ po, onDone }: { po: PurchaseOrderDetailRow; onDone: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [remarks, setRemarks] = useState("")
  const [busy, setBusy] = useState(false)

  async function handleAction(action: "approve" | "reject") {
    if (action === "reject" && !remarks.trim()) { alert("Add a reason for rejection."); return }
    setBusy(true)
    const form = new FormData()
    form.append("poId", po.id)
    form.append("action", action)
    if (remarks) form.append("remarks", remarks)
    const res = await fetch("/api/admin/approvals/purchase-orders", { method: "POST", body: form })
    setBusy(false)
    window.location.href = res.url || "/approvals"
  }

  return (
    <article className="rounded-[24px] border border-[#e2e8f0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b border-[#f1f5f9] p-6">
        <div>
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-700">Pending Approval</span>
          <h3 className="mt-2 text-[18px] font-bold text-[#0f172a]">{po.poNumber}</h3>
          <p className="text-[13px] text-[#64748b]">
            Requested by <span className="font-semibold text-[#334155]">{po.requestedByName}</span>
            {po.supplierName ? ` · Supplier: ${po.supplierName}` : ""}
            {" · "}{new Date(po.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </p>
        </div>
        <button type="button" onClick={() => setExpanded((v) => !v)}
          className="shrink-0 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-2 text-[13px] font-semibold text-[#475569] hover:bg-white">
          {expanded ? "Hide items" : "View items"}
        </button>
      </div>

      {expanded && (
        <div className="border-b border-[#f1f5f9] bg-[#fbfdff] p-6">
          <table className="min-w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] text-[#64748b]">
                <th className="pb-2 pr-4 text-left font-medium">Material</th>
                <th className="pb-2 pr-4 text-left font-medium">SKU</th>
                <th className="pb-2 pr-4 text-left font-medium">Qty</th>
                <th className="pb-2 pr-4 text-left font-medium">Unit cost</th>
                <th className="pb-2 text-left font-medium">Line total</th>
              </tr>
            </thead>
            <tbody>
              {po.items.map((item) => (
                <tr key={item.id} className="border-b border-[#f1f5f9] last:border-b-0">
                  <td className="py-2 pr-4 font-medium text-[#0f172a]">{item.itemName}</td>
                  <td className="py-2 pr-4 font-mono text-[#6b7280]">{item.sku}</td>
                  <td className="py-2 pr-4 text-[#374151]">{item.quantityOrdered} {item.unitOfMeasure}</td>
                  <td className="py-2 pr-4 text-[#374151]">{item.unitCost != null ? formatPeso(item.unitCost) : "—"}</td>
                  <td className="py-2 font-semibold text-[#0f172a]">{formatPeso(item.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 flex justify-end text-[14px] font-bold text-[#0f172a]">
            Total: {formatPeso(po.totalAmount)}
          </div>
          {po.remarks && (
            <div className="mt-3 rounded-xl bg-[#f8fafc] p-3 text-[13px] text-[#475569]">
              <span className="font-semibold">Remarks:</span> {po.remarks}
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {rejecting ? (
          <div className="flex flex-col gap-3">
            <textarea rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)}
              placeholder="Reason for rejection..." required
              className="w-full resize-none rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[13px] outline-none focus:border-[#0f172a]" />
            <div className="flex gap-3">
              <button type="button" onClick={() => handleAction("reject")} disabled={busy || !remarks.trim()}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-red-700 disabled:opacity-50">
                {busy ? "Rejecting…" : "Confirm Rejection"}
              </button>
              <button type="button" onClick={() => setRejecting(false)} className="rounded-xl border border-[#e2e8f0] px-5 py-2.5 text-[13px] font-semibold text-[#475569] hover:bg-[#f8fafc]">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-[#475569]">Remarks (optional)</span>
              <input type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add a note for the operations team..."
                className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-2.5 text-[13px] outline-none focus:border-[#0f172a]" />
            </label>
            <div className="flex gap-3">
              <button type="button" onClick={() => handleAction("approve")} disabled={busy}
                className="rounded-xl bg-[#0f172a] px-6 py-2.5 text-[13px] font-semibold text-white hover:bg-[#1e293b] disabled:opacity-50">
                {busy ? "Approving…" : "Approve PO"}
              </button>
              <button type="button" onClick={() => setRejecting(true)}
                className="rounded-xl border border-red-200 bg-red-50 px-6 py-2.5 text-[13px] font-semibold text-red-700 hover:bg-red-100">
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

export function PurchaseOrderApprovalList({ pos: initialPos }: { pos: PurchaseOrderDetailRow[] }) {
  const [pos, setPos] = useState(initialPos)
  if (pos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#d1d5db] bg-[#f9fafb] px-6 py-12 text-center text-[13px] text-[#6b7280]">
        No pending purchase orders.
      </div>
    )
  }
  return (
    <div className="space-y-4">
      {pos.map((po) => (
        <PurchaseOrderApprovalCard key={po.id} po={po} onDone={() => setPos((p) => p.filter((x) => x.id !== po.id))} />
      ))}
    </div>
  )
}
