"use client"

import { useState } from "react"
import { formatInquiryWorkflowStatus, getInquiryWorkflowStyle } from "@furnitrack/validators"

type MaterialRow = {
  materialStockId: string
  sku: string
  itemName: string
  availableQty: number
  quantityRequired: number
}

type InventoryApprovalCardProps = {
  inquiry: {
    id: string
    productName: string
    productId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    message: string
    workflowStatus: string
    workflowNote: string | null
    createdAt: Date
    updatedAt: Date
  }
  materials: MaterialRow[]
}

function StockBadge({ available, required }: { available: number; required: number }) {
  const sufficient = available >= required
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
        sufficient ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${sufficient ? "bg-green-500" : "bg-red-500"}`} />
      {sufficient ? "Sufficient" : "Insufficient"}
    </span>
  )
}

export function InventoryApprovalCard({ inquiry, materials }: InventoryApprovalCardProps) {
  const [showMaterials, setShowMaterials] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const hasMaterials = materials.length > 0
  const quantifiedMaterials = materials.filter((m) => m.quantityRequired > 0)
  const insufficientCount = quantifiedMaterials.filter((m) => m.availableQty < m.quantityRequired).length
  const allSufficient = insufficientCount === 0 && hasMaterials

  return (
    <article className="rounded-xl border border-[#eef2f7] bg-[#fbfcfd] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Material approval request</p>
          <h3 className="mt-1 text-[20px] font-semibold text-[#111827]">{inquiry.productName}</h3>
          <p className="mt-2 text-[13px] text-[#6b7280]">
            {inquiry.customerName} · {inquiry.customerEmail} · {inquiry.customerPhone}
          </p>
          <p className="mt-3 max-w-[720px] text-[14px] leading-[22px] text-[#1f2937]">{inquiry.message}</p>
          {inquiry.workflowNote && (
            <p className="mt-3 rounded-xl bg-white px-4 py-3 text-[13px] text-[#4b5563]">
              Latest note: {inquiry.workflowNote}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start gap-3 text-[12px] text-[#6b7280] lg:items-end">
          <span
            className={`inline-flex rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] ${getInquiryWorkflowStyle(inquiry.workflowStatus)}`}
          >
            {formatInquiryWorkflowStatus(inquiry.workflowStatus)}
          </span>
          <div className="text-right">
            <p>Created {new Date(inquiry.createdAt).toLocaleDateString()}</p>
            <p className="mt-1">Updated {new Date(inquiry.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* View Materials toggle */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowMaterials((v) => !v)}
          className="flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-[13px] font-medium text-[#374151] transition-all hover:border-[#374151] hover:bg-[#f9fafb]"
        >
          <svg className="h-4 w-4 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {showMaterials ? "Hide materials" : "View materials"}
          {hasMaterials && (
            <span
              className={`ml-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                allSufficient
                  ? "bg-green-100 text-green-700"
                  : insufficientCount > 0
                  ? "bg-red-100 text-red-700"
                  : "bg-[#f1f5f9] text-[#64748b]"
              }`}
            >
              {materials.length} items
              {insufficientCount > 0 && ` · ${insufficientCount} insufficient`}
            </span>
          )}
        </button>
      </div>

      {/* Materials table */}
      {showMaterials && (
        <div className="mt-4 overflow-hidden rounded-xl border border-[#e2e8f0] bg-white">
          {!hasMaterials ? (
            <div className="px-5 py-6 text-center text-[13px] text-[#6b7280]">
              No materials are configured for this product.
            </div>
          ) : (
            <>
              {insufficientCount > 0 && (
                <div className="flex items-center gap-3 border-b border-[#fde8e8] bg-[#fff5f5] px-5 py-3">
                  <svg className="h-4 w-4 shrink-0 text-[#e11d48]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <p className="text-[13px] font-medium text-[#9f1239]">
                    {insufficientCount} material{insufficientCount > 1 ? "s are" : " is"} below the required quantity for this order.
                  </p>
                </div>
              )}
              <table className="min-w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#f1f5f9] text-[#6b7280]">
                    <th className="px-5 py-3 font-semibold">SKU</th>
                    <th className="py-3 pr-4 font-semibold">Material</th>
                    <th className="py-3 pr-4 font-semibold text-right">Required</th>
                    <th className="py-3 pr-4 font-semibold text-right">Available</th>
                    <th className="py-3 pr-5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((material) => (
                    <tr
                      key={material.materialStockId}
                      className={`border-b border-[#f1f5f9] last:border-0 ${
                        material.availableQty < material.quantityRequired ? "bg-[#fff8f8]" : ""
                      }`}
                    >
                      <td className="px-5 py-3 font-mono text-[#374151]">{material.sku}</td>
                      <td className="py-3 pr-4 font-medium text-[#111827]">{material.itemName}</td>
                      <td className="py-3 pr-4 text-right text-[#374151]">
                        {material.quantityRequired > 0 ? material.quantityRequired : <span className="text-[#9ca3af]">—</span>}
                      </td>
                      <td
                        className={`py-3 pr-4 text-right font-semibold ${
                          material.quantityRequired > 0 && material.availableQty < material.quantityRequired
                            ? "text-[#e11d48]"
                            : "text-[#16a34a]"
                        }`}
                      >
                        {material.availableQty}
                      </td>
                      <td className="py-3 pr-5">
                        {material.quantityRequired > 0
                          ? <StockBadge available={material.availableQty} required={material.quantityRequired} />
                          : <span className="text-[11px] text-[#9ca3af]">Qty not set</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {/* Approve + Reject forms */}
      <div className="mt-5 space-y-3">
        {/* Approve form */}
        {!showReject && (
          <form
            method="post"
            action="/api/admin/approvals/inventory"
            className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]"
          >
            <input type="hidden" name="inquiryId" value={inquiry.id} />
            <label className="block">
              <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                Inventory approval note
              </span>
              <input
                name="statusNote"
                defaultValue={inquiry.workflowNote ?? ""}
                placeholder="Confirm stock readiness for accounting"
                className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
              />
            </label>
            <div className="flex items-end gap-3">
              <button
                type="submit"
                className="rounded-[12px] bg-[#111827] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90"
              >
                Approve materials
              </button>
              <button
                type="button"
                onClick={() => setShowReject(true)}
                className="rounded-[12px] border border-[#fecaca] bg-[#fff1f2] px-5 py-3 text-[13px] font-medium text-[#9f1239] transition-colors hover:bg-[#ffe4e6]"
              >
                Reject order
              </button>
            </div>
          </form>
        )}

        {/* Reject form */}
        {showReject && (
          <form
            method="post"
            action="/api/admin/approvals/inventory/reject"
            className="rounded-xl border border-[#fecaca] bg-[#fff8f8] p-5"
          >
            <input type="hidden" name="inquiryId" value={inquiry.id} />
            <div className="mb-3 flex items-center gap-2">
              <svg className="h-5 w-5 shrink-0 text-[#e11d48]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-[14px] font-semibold text-[#9f1239]">Reject this order</h4>
            </div>
            <p className="mb-4 text-[13px] text-[#b91c1c]">
              This will return the order to sales with your rejection note. The customer will see the update on their status page.
            </p>
            <label className="mb-4 block">
              <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#9f1239]">
                Reason for rejection <span className="text-red-500">*</span>
              </span>
              <textarea
                name="rejectReason"
                rows={3}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Insufficient stock for Cabinet hinges (need 20, have 8). Order cannot proceed until materials are restocked."
                className="w-full resize-none rounded-[12px] border border-[#fecaca] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48]"
              />
            </label>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={!rejectReason.trim()}
                className="rounded-[12px] bg-[#e11d48] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#be123c] disabled:opacity-50"
              >
                Confirm rejection
              </button>
              <button
                type="button"
                onClick={() => { setShowReject(false); setRejectReason("") }}
                className="rounded-[12px] border border-[#e2e8f0] bg-white px-5 py-2.5 text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </article>
  )
}
