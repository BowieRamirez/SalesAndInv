"use client"

import { useState } from "react"

type EditRequestPayload = {
  name?: string
  category?: string
  description?: string
  imageUrls?: string[]
  warehouseId?: string
  badge?: string | null
  price?: number
  isPublished?: boolean
  colorVariants?: Array<{ name: string; hex: string; sku: string }>
}

type CurrentProductData = {
  name: string
  category: string
  description: string
  imageUrl: string
  badge: string | null
  price: number
  isPublished: boolean
  warehouseName: string
  colorVariants: Array<{ name: string; hex: string; sku: string }>
}

export type ProductEditRequest = {
  id: string
  productId: string
  productName: string
  requestedByName: string
  requestedById: string
  status: string
  payload: EditRequestPayload
  current: CurrentProductData
  remarks: string | null
  createdAt: string
}

function formatPeso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(value)
}

function ChangeRow({
  label,
  before,
  after,
  changed,
}: {
  label: string
  before: React.ReactNode
  after: React.ReactNode
  changed: boolean
}) {
  return (
    <div className={`flex flex-col gap-1 rounded-xl p-3 ${changed ? "bg-amber-50 border border-amber-200" : "bg-[#f8fafc]"}`}>
      <dt className="text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">{label}</dt>
      {changed ? (
        <div className="flex flex-col gap-1">
          <dd className="flex items-center gap-1.5 text-[13px] text-[#94a3b8] line-through">{before}</dd>
          <dd className="flex items-center gap-1.5 text-[13px] font-semibold text-[#0f172a]">
            <span className="text-amber-600">→</span> {after}
          </dd>
        </div>
      ) : (
        <dd className="text-[13px] text-[#475569]">{after}</dd>
      )}
    </div>
  )
}

function RequestCard({ request, onDone }: { request: ProductEditRequest; onDone: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [remarks, setRemarks] = useState("")
  const [busy, setBusy] = useState(false)

  const payload = request.payload

  async function handleApprove() {
    setBusy(true)
    const form = new FormData()
    form.append("editRequestId", request.id)
    form.append("action", "approve")
    if (remarks) form.append("remarks", remarks)

    const res = await fetch("/api/admin/approvals/products", { method: "POST", body: form })
    setBusy(false)
    if (res.redirected || res.ok) {
      onDone()
    }
    // Let the page redirect handle the message
    window.location.href = res.url || "/approvals"
  }

  async function handleReject() {
    if (!remarks.trim()) {
      alert("Please add a reason for rejection.")
      return
    }
    setBusy(true)
    const form = new FormData()
    form.append("editRequestId", request.id)
    form.append("action", "reject")
    form.append("remarks", remarks)

    const res = await fetch("/api/admin/approvals/products", { method: "POST", body: form })
    setBusy(false)
    window.location.href = res.url || "/approvals"
  }

  return (
    <article className="rounded-[24px] border border-[#e2e8f0] bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 p-6 border-b border-[#f1f5f9]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-700">
              Pending Approval
            </span>
          </div>
          <h3 className="mt-1 text-[18px] font-bold text-[#0f172a]">{request.productName}</h3>
          <p className="text-[13px] text-[#64748b]">
            Edit requested by <span className="font-semibold text-[#334155]">{request.requestedByName}</span>
            {" · "}
            {new Date(request.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-2 text-[13px] font-semibold text-[#475569] transition-all hover:border-[#cbd5e1] hover:bg-white"
        >
          {expanded ? "Hide details" : "View changes"}
        </button>
      </div>

      {/* Proposed changes — before vs after */}
      {expanded && (
        <div className="p-6 bg-[#fbfdff] border-b border-[#f1f5f9]">
          <div className="mb-4 flex items-center gap-3">
            <h4 className="text-[13px] font-bold uppercase tracking-wide text-[#64748b]">
              Proposed changes
            </h4>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">
              Highlighted = changed
            </span>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <ChangeRow
              label="Name"
              before={request.current.name}
              after={payload.name ?? request.current.name}
              changed={!!payload.name && payload.name !== request.current.name}
            />
            <ChangeRow
              label="Category"
              before={request.current.category}
              after={payload.category ?? request.current.category}
              changed={!!payload.category && payload.category !== request.current.category}
            />
            <ChangeRow
              label="Price"
              before={formatPeso(request.current.price)}
              after={payload.price != null ? formatPeso(payload.price) : formatPeso(request.current.price)}
              changed={payload.price != null && payload.price !== request.current.price}
            />
            <ChangeRow
              label="Badge"
              before={request.current.badge ?? "— (none)"}
              after={payload.badge !== undefined ? (payload.badge ?? "— (none)") : (request.current.badge ?? "— (none)")}
              changed={payload.badge !== undefined && payload.badge !== request.current.badge}
            />
            <ChangeRow
              label="Storefront visibility"
              before={
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${request.current.isPublished ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                  {request.current.isPublished ? "Published" : "Hidden"}
                </span>
              }
              after={
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${(payload.isPublished ?? request.current.isPublished) ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                  {(payload.isPublished ?? request.current.isPublished) ? "Published" : "Hidden"}
                </span>
              }
              changed={payload.isPublished !== undefined && payload.isPublished !== request.current.isPublished}
            />
          </dl>

          {/* Color variants diff */}
          {payload.colorVariants !== undefined && (() => {
            const before = request.current.colorVariants ?? []
            const after = payload.colorVariants ?? []
            const beforeKey = JSON.stringify(before.map((v) => `${v.name}|${v.hex.toLowerCase()}|${v.sku.toLowerCase()}`).sort())
            const afterKey = JSON.stringify(after.map((v) => `${v.name}|${v.hex.toLowerCase()}|${v.sku.toLowerCase()}`).sort())
            const changed = beforeKey !== afterKey
            const renderRow = (variants: typeof before, tone: "before" | "after" | "neutral") => (
              variants.length === 0 ? (
                <p className="text-[12px] italic text-[#94a3b8]">No color variants.</p>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {variants.map((v, i) => (
                    <li
                      key={`${tone}-${i}`}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12px] ${
                        tone === "before"
                          ? "border-[#e2e8f0] bg-white text-[#94a3b8] line-through"
                          : tone === "after"
                            ? "border-amber-200 bg-amber-50 text-[#0f172a]"
                            : "border-[#e2e8f0] bg-white text-[#475569]"
                      }`}
                    >
                      <span
                        className="inline-block h-3 w-3 rounded-full border border-[#e2e8f0]"
                        style={{ backgroundColor: v.hex }}
                        aria-hidden
                      />
                      <span className="font-medium">{v.name}</span>
                      <span className="font-mono text-[10px] text-[#64748b]">{v.sku}</span>
                    </li>
                  ))}
                </ul>
              )
            )

            return (
              <div className="mt-4">
                <dt className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">Color variants</dt>
                {changed ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">Before</p>
                      {renderRow(before, "before")}
                    </div>
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-amber-600">After (proposed)</p>
                      {renderRow(after, "after")}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-[#f8fafc] p-4">
                    {renderRow(after, "neutral")}
                    <p className="mt-2 text-[10px] font-bold text-[#94a3b8]">(unchanged)</p>
                  </div>
                )}
              </div>
            )
          })()}

          {/* Description diff */}
          {payload.description !== undefined && (            <div className="mt-4">
              <dt className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">Description</dt>
              {payload.description !== request.current.description ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">Before</p>
                    <p className="text-[12px] leading-[20px] text-[#94a3b8] line-through whitespace-pre-wrap">{request.current.description}</p>
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-amber-600">After (proposed)</p>
                    <p className="text-[12px] leading-[20px] text-[#0f172a] whitespace-pre-wrap">{payload.description}</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-[#f8fafc] p-4 text-[12px] leading-[20px] text-[#475569] whitespace-pre-wrap">
                  {payload.description}
                  <span className="ml-2 text-[10px] font-bold text-[#94a3b8]">(unchanged)</span>
                </div>
              )}
            </div>
          )}

          {/* Image */}
          {payload.imageUrls && payload.imageUrls.length > 0 && (
            <div className="mt-4">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">
                Product image
              </p>
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">Before</p>
                  <div className="h-24 w-24 overflow-hidden rounded-xl border border-[#e2e8f0] bg-[#f1f5f9]">
                    {request.current.imageUrl ? (
                      <img src={request.current.imageUrl} alt="Before" className="h-full w-full object-cover opacity-60" />
                    ) : (
                      <div className="grid h-full place-items-center text-[10px] text-[#94a3b8]">No image</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center self-center text-[#94a3b8]">→</div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-amber-600">After</p>
                  <div className="h-24 w-24 overflow-hidden rounded-xl border border-amber-200 bg-amber-50">
                    <img src={payload.imageUrls[0]} alt="After" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action area */}
      <div className="p-6">
        {rejecting ? (
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-[#475569]">
                Reason for rejection <span className="text-red-500">*</span>
              </span>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Explain why this edit is being rejected..."
                className="w-full resize-none rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[13px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
              />
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReject}
                disabled={busy || !remarks.trim()}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50"
              >
                {busy ? "Rejecting..." : "Confirm Rejection"}
              </button>
              <button
                type="button"
                onClick={() => setRejecting(false)}
                className="rounded-xl border border-[#e2e8f0] px-5 py-2.5 text-[13px] font-semibold text-[#475569] transition-all hover:bg-[#f8fafc]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-[#475569]">Remarks (optional)</span>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add a note for the operations team..."
                className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-2.5 text-[13px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
              />
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleApprove}
                disabled={busy}
                className="rounded-xl bg-[#0f172a] px-6 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-[#1e293b] hover:shadow-md active:scale-95 disabled:opacity-50"
              >
                {busy ? "Approving..." : "Approve Edit"}
              </button>
              <button
                type="button"
                onClick={() => setRejecting(true)}
                className="rounded-xl border border-red-200 bg-red-50 px-6 py-2.5 text-[13px] font-semibold text-red-700 transition-all hover:bg-red-100 active:scale-95"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

export function ProductEditRequestsTable({
  requests: initialRequests,
}: {
  requests: ProductEditRequest[]
}) {
  const [requests, setRequests] = useState(initialRequests)

  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#d1d5db] bg-[#f9fafb] px-6 py-12 text-center text-[13px] text-[#6b7280]">
        No pending product edit requests.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <RequestCard
          key={req.id}
          request={req}
          onDone={() => setRequests((r) => r.filter((x) => x.id !== req.id))}
        />
      ))}
    </div>
  )
}
