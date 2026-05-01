"use client"

import { useMemo, useState } from "react"
import type { ReturnRequestRow } from "@furnitrack/db"

const PAGE_SIZE = 10

function formatReturnStatus(status: ReturnRequestRow["status"]) {
  return status.replaceAll("_", " ")
}

function ReturnStatusBadge({ status }: { status: ReturnRequestRow["status"] }) {
  const classes =
    status === "SUBMITTED"
      ? "bg-[#fff7ed] text-[#c2410c]"
      : status === "APPROVED_FOR_PICKUP"
        ? "bg-[#eff6ff] text-[#1d4ed8]"
        : status === "PICKED_UP_COMPLETED"
          ? "bg-[#ecfdf3] text-[#166534]"
          : "bg-[#fff1f2] text-[#be123c]"

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${classes}`}>
      {formatReturnStatus(status)}
    </span>
  )
}

function toDateTimeLocalValue(value: Date | null) {
  if (!value) {
    return ""
  }

  const local = new Date(value.getTime() - value.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 16)
}

export function CustomerReturnsTable({ requests }: { requests: ReturnRequestRow[] }) {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [selectedRequest, setSelectedRequest] = useState<ReturnRequestRow | null>(null)

  const filteredRequests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return requests

    return requests.filter((request) =>
      [request.productName, request.customerName, request.customerEmail, request.reason].some((value) =>
        value?.toLowerCase().includes(normalizedQuery),
      ),
    )
  }, [query, requests])

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pagedRequests = filteredRequests.slice(pageStart, pageStart + PAGE_SIZE)

  const isSubmitted = selectedRequest?.status === "SUBMITTED"
  const isApproved = selectedRequest?.status === "APPROVED_FOR_PICKUP"

  return (
    <>
      <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col">
            <h2 className="text-[20px] font-semibold text-[#111827]">Customer returns</h2>
            <p className="mt-1 text-[13px] text-[#6b7280]">
              Review completed-order return requests, approve returns, schedule pickup, and close them.
            </p>
          </div>
          <div className="w-full md:w-[320px]">
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Search product, customer, reason"
              className="w-full rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
                <th className="py-3 pr-4 font-medium">Submitted</th>
                <th className="py-3 pr-4 font-medium">Product</th>
                <th className="py-3 pr-4 font-medium">Customer</th>
                <th className="py-3 pr-4 font-medium">Reason</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {pagedRequests.map((request) => (
                <tr key={request.id} className="border-b border-[#f3f4f6] last:border-b-0">
                  <td className="py-3 pr-4 text-[#111827] whitespace-nowrap">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4 text-[#111827]">{request.productName}</td>
                  <td className="py-3 pr-4 text-[#111827]">
                    {request.customerName}
                  </td>
                  <td className="py-3 pr-4 text-[#111827]">{request.reason}</td>
                  <td className="py-3 pr-4">
                    <ReturnStatusBadge status={request.status} />
                  </td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(request)}
                      className="rounded-lg bg-[#111827] px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#111827]/90"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {pagedRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#6b7280]">
                    No customer return requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={currentPage <= 1}
            className="rounded-lg border border-[#d1d5db] px-4 py-2 text-[13px] text-[#111827] transition-colors hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:text-[#cbd5e1]"
          >
            Previous
          </button>
          <span className="text-[13px] text-[#6b7280]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={currentPage >= totalPages}
            className="rounded-lg border border-[#d1d5db] px-4 py-2 text-[13px] text-[#111827] transition-colors hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:text-[#cbd5e1]"
          >
            Next
          </button>
        </div>
      </section>

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/45 px-4 overflow-y-auto pt-20 pb-10">
          <div className="w-full max-w-2xl rounded-2xl border border-[#dbe4f0] bg-white p-8 shadow-2xl">
            <div className="mb-6 flex justify-between items-start border-b border-[#e5e7eb] pb-4">
              <div>
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Customer return request</p>
                <h3 className="mt-1 text-[22px] font-semibold text-[#111827]">{selectedRequest.productName}</h3>
                <p className="mt-1 text-[13px] text-[#6b7280]">
                  {selectedRequest.customerName} - {selectedRequest.customerEmail} - {selectedRequest.customerPhone}
                </p>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <ReturnStatusBadge status={selectedRequest.status} />
                <p className="text-[12px] text-[#6b7280]">Updated {new Date(selectedRequest.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-[16px] bg-[#f8fafc] px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#94a3b8]">Reason</p>
                <p className="mt-2 text-[14px] font-medium text-[#111827]">{selectedRequest.reason}</p>
              </div>
              <div className="rounded-[16px] bg-[#f8fafc] px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#94a3b8]">Submitted</p>
                <p className="mt-2 text-[14px] font-medium text-[#111827]">
                  {new Date(selectedRequest.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {selectedRequest.details ? (
              <div className="mt-4 rounded-[16px] bg-[#fffaf0] px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#c2410c]">Customer details</p>
                <p className="mt-2 text-[14px] leading-[22px] text-[#7c2d12]">{selectedRequest.details}</p>
              </div>
            ) : null}

            {selectedRequest.imageUrls.length > 0 ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {selectedRequest.imageUrls.map((imageUrl, index) => (
                  <img
                    key={`${selectedRequest.id}-${index}`}
                    src={imageUrl}
                    alt={`Return evidence ${index + 1}`}
                    className="h-40 w-full rounded-[16px] object-cover"
                  />
                ))}
              </div>
            ) : null}

            {selectedRequest.pickupScheduledAt ? (
              <p className="mt-4 text-[13px] text-[#1d4ed8] font-medium">
                Pickup schedule: {new Date(selectedRequest.pickupScheduledAt).toLocaleString()}
              </p>
            ) : null}

            {selectedRequest.salesNote ? (
              <p className="mt-2 text-[13px] text-[#4b5563]">Sales note: {selectedRequest.salesNote}</p>
            ) : null}

            {isSubmitted ? (
              <form method="post" action="/api/admin/returns" className="mt-6 border-t border-[#e5e7eb] pt-6 grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
                <input type="hidden" name="returnRequestId" value={selectedRequest.id} />
                <input type="hidden" name="submitMode" value="approve" />
                <label className="block">
                  <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                    Pickup date and time
                  </span>
                  <input
                    type="datetime-local"
                    name="pickupScheduledAt"
                    defaultValue={toDateTimeLocalValue(selectedRequest.pickupScheduledAt)}
                    required
                    className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                    Sales return note
                  </span>
                  <input
                    name="salesNote"
                    defaultValue={selectedRequest.salesNote ?? ""}
                    placeholder="Tell customer when pickup will happen."
                    className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                  />
                </label>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="rounded-[12px] bg-[#111827] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90 h-[46px]"
                  >
                    Approve return
                  </button>
                </div>
              </form>
            ) : null}

            {isApproved ? (
              <form method="post" action="/api/admin/returns" className="mt-6 border-t border-[#e5e7eb] pt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
                <input type="hidden" name="returnRequestId" value={selectedRequest.id} />
                <input type="hidden" name="submitMode" value="complete" />
                <label className="block">
                  <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                    Completion note
                  </span>
                  <input
                    name="salesNote"
                    defaultValue={selectedRequest.salesNote ?? ""}
                    placeholder="Confirm that the returned item was picked up and closed."
                    className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                  />
                </label>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="rounded-[12px] bg-[#166534] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#166534]/90 h-[46px]"
                  >
                    Mark completed
                  </button>
                </div>
              </form>
            ) : null}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="rounded-xl border border-[#d1d5db] px-5 py-2.5 text-[13px] font-medium text-[#111827] transition-colors hover:bg-[#f8fafc]"
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
