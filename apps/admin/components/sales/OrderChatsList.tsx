"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

type InquiryCardData = {
  id: string
  productName: string
  customerName: string
  total: number
  createdAt: string
}

const PAGE_SIZE = 12

function formatPeso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Confirmation dialog component
function ConfirmDialog({
  type,
  productName,
  customerName,
  onConfirm,
  onCancel,
  busy,
}: {
  type: "archive" | "delete"
  productName: string
  customerName: string
  onConfirm: () => void
  onCancel: () => void
  busy: boolean
}) {
  const isDelete = type === "delete"
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[20px] border border-[#e2e8f0] bg-white p-7 shadow-2xl">
        <div className={`mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full ${isDelete ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>
          {isDelete ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          )}
        </div>
        <h3 className="text-center text-[18px] font-bold text-[#0f172a]">
          {isDelete ? "Delete chat?" : "Archive chat?"}
        </h3>
        <p className="mt-2 text-center text-[13px] leading-[20px] text-[#64748b]">
          {isDelete
            ? <>This will permanently delete the chat for <span className="font-semibold text-[#0f172a]">{productName}</span> with <span className="font-semibold text-[#0f172a]">{customerName}</span>. This action cannot be undone.</>
            : <>This will archive the chat for <span className="font-semibold text-[#0f172a]">{productName}</span> with <span className="font-semibold text-[#0f172a]">{customerName}</span>. It will be recorded in audit logs.</>
          }
        </p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="flex-1 rounded-xl border border-[#e2e8f0] py-2.5 text-[13px] font-semibold text-[#475569] transition-all hover:bg-[#f8fafc] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`flex-1 rounded-xl py-2.5 text-[13px] font-semibold text-white transition-all active:scale-95 disabled:opacity-50 ${isDelete ? "bg-red-600 hover:bg-red-700" : "bg-amber-500 hover:bg-amber-600"}`}
          >
            {busy ? "Processing..." : isDelete ? "Yes, delete" : "Yes, archive"}
          </button>
        </div>
      </div>
    </div>
  )
}

export function OrderChatsList({
  inquiries,
  archivedInquiries = [],
  unreadChats,
}: {
  inquiries: InquiryCardData[]
  archivedInquiries?: InquiryCardData[]
  unreadChats: Set<string>
}) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [showArchived, setShowArchived] = useState(false)
  const [confirm, setConfirm] = useState<{ inquiryId: string; productName: string; customerName: string; type: "archive" | "delete" } | null>(null)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null)
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set())
  const [restoredIds, setRestoredIds] = useState<Set<string>>(new Set())

  // Active view: filter out locally removed, add back locally restored for archived view
  const activeInquiries = useMemo(
    () => inquiries.filter((i) => !removedIds.has(i.id)),
    [inquiries, removedIds],
  )

  const visibleArchived = useMemo(
    () => [
      ...archivedInquiries.filter((i) => !removedIds.has(i.id) && !restoredIds.has(i.id)),
    ],
    [archivedInquiries, removedIds, restoredIds],
  )

  const sourceList = showArchived ? visibleArchived : activeInquiries

  const filteredInquiries = useMemo(() => {
    let result = sourceList

    if (search.trim()) {
      const lowerSearch = search.toLowerCase()
      result = result.filter(
        (inquiry) =>
          inquiry.productName.toLowerCase().includes(lowerSearch) ||
          inquiry.customerName.toLowerCase().includes(lowerSearch) ||
          inquiry.id.toLowerCase().includes(lowerSearch),
      )
    }

    if (dateFrom) {
      const from = new Date(dateFrom)
      from.setHours(0, 0, 0, 0)
      result = result.filter((inquiry) => new Date(inquiry.createdAt) >= from)
    }

    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
      result = result.filter((inquiry) => new Date(inquiry.createdAt) <= to)
    }

    return result
  }, [sourceList, search, dateFrom, dateTo])

  const totalPages = Math.max(1, Math.ceil(filteredInquiries.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pagedInquiries = filteredInquiries.slice(pageStart, pageStart + PAGE_SIZE)

  function showToast(message: string, tone: "success" | "error") {
    setToast({ message, tone })
    setTimeout(() => setToast(null), 4000)
  }

  async function handleConfirm() {
    if (!confirm) return
    setBusy(true)

    try {
      const res = await fetch("/api/admin/sales/order-chat/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId: confirm.inquiryId, action: confirm.type }),
      })

      const data = await res.json() as { success?: boolean; message?: string; error?: string }

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Something went wrong.")
      }

      if (confirm.type === "delete") {
        setRemovedIds((prev) => new Set([...prev, confirm.inquiryId]))
      } else {
        // Archive: move from active to archived view locally
        setRemovedIds((prev) => new Set([...prev, confirm.inquiryId]))
      }
      showToast(data.message ?? "Done.", "success")
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Action failed.", "error")
    } finally {
      setBusy(false)
      setConfirm(null)
    }
  }

  async function handleRestore(inquiryId: string, productName: string) {
    setBusy(true)
    try {
      const res = await fetch("/api/admin/sales/order-chat/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId, action: "restore" }),
      })

      const data = await res.json() as { success?: boolean; message?: string; error?: string }

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Something went wrong.")
      }

      setRestoredIds((prev) => new Set([...prev, inquiryId]))
      showToast(`"${productName}" restored to active chats.`, "success")
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Restore failed.", "error")
    } finally {
      setBusy(false)
    }
  }

  function clearDateFilter() {
    setDateFrom("")
    setDateTo("")
    setPage(1)
  }

  const hasDateFilter = dateFrom || dateTo

  return (
    <>
      {/* Confirmation dialog */}
      {confirm && (
        <ConfirmDialog
          type={confirm.type}
          productName={confirm.productName}
          customerName={confirm.customerName}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
          busy={busy}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-lg text-[13px] font-medium text-white transition-all ${toast.tone === "success" ? "bg-[#16a34a]" : "bg-red-600"}`}>
          {toast.tone === "success" ? (
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          )}
          {toast.message}
        </div>
      )}

      <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-[20px] font-semibold text-[#111827]">Order Chats</h2>
                {visibleArchived.length > 0 && (
                  <button
                    type="button"
                    onClick={() => { setShowArchived((v) => !v); setPage(1); setSearch(""); setDateFrom(""); setDateTo("") }}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold transition-all ${
                      showArchived
                        ? "bg-amber-500 text-white"
                        : "border border-[#e2e8f0] bg-[#f8fafc] text-[#64748b] hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                    }`}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    {showArchived ? "← Back to active" : `Archived (${visibleArchived.length})`}
                  </button>
                )}
              </div>
              <p className="mt-2 max-w-[760px] text-[14px] leading-[22px] text-[#6b7280]">
                {showArchived
                  ? "Viewing archived chats. These are hidden from the active list."
                  : "Open a specific order to chat with the customer, receive images, and send quotation or receipt documents."}
              </p>
            </div>
            <div className="relative w-full md:w-[320px]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-[18px] w-[18px] text-[#9ca3af]" />
              </div>
              <input
                type="text"
                placeholder="Search chats by name or ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="w-full rounded-[14px] border border-[#d1d5dc] bg-white py-2.5 pl-10 pr-4 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827] focus:ring-1 focus:ring-[#111827]"
              />
            </div>
          </div>

          {/* Date filter row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[13px] font-medium text-[#475569]">Filter by date:</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[12px] text-[#94a3b8]">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
                className="rounded-xl border border-[#d1d5dc] bg-white px-3 py-2 text-[13px] text-[#111827] outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827]"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[12px] text-[#94a3b8]">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
                className="rounded-xl border border-[#d1d5dc] bg-white px-3 py-2 text-[13px] text-[#111827] outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827]"
              />
            </div>
            {hasDateFilter && (
              <button
                type="button"
                onClick={clearDateFilter}
                className="flex items-center gap-1 rounded-xl border border-[#e2e8f0] px-3 py-2 text-[12px] font-medium text-[#64748b] transition-all hover:bg-[#f1f5f9]"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                Clear
              </button>
            )}
            {hasDateFilter && (
              <span className="text-[12px] text-[#64748b]">
                Showing {filteredInquiries.length} of {sourceList.length} chats
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pagedInquiries.map((inquiry) => {
            const isUnread = unreadChats.has(inquiry.id)
            return (
              <div key={inquiry.id} className="group relative rounded-2xl border border-[#eef2f7] bg-[#fbfcfd] transition-colors hover:border-[#cbd5e1]">
                {/* Archive & Delete buttons — visible on hover */}
                <div className="absolute right-3 top-3 flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  {showArchived ? (
                    // Archived view: show Restore + Delete
                    <>
                      <button
                        type="button"
                        title="Restore chat"
                        onClick={(e) => {
                          e.preventDefault()
                          handleRestore(inquiry.id, inquiry.productName)
                        }}
                        disabled={busy}
                        className="flex items-center gap-1 rounded-lg border border-[#e2e8f0] bg-white px-2 py-1 text-[11px] font-semibold text-[#64748b] transition-all hover:border-green-300 hover:bg-green-50 hover:text-green-700 disabled:opacity-40"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Restore
                      </button>
                      <button
                        type="button"
                        title="Delete chat"
                        onClick={(e) => {
                          e.preventDefault()
                          setConfirm({ inquiryId: inquiry.id, productName: inquiry.productName, customerName: inquiry.customerName, type: "delete" })
                        }}
                        className="grid h-7 w-7 place-items-center rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    // Active view: show Archive + Delete
                    <>
                      <button
                        type="button"
                        title="Archive chat"
                        onClick={(e) => {
                          e.preventDefault()
                          setConfirm({ inquiryId: inquiry.id, productName: inquiry.productName, customerName: inquiry.customerName, type: "archive" })
                        }}
                        className="grid h-7 w-7 place-items-center rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] transition-all hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        title="Delete chat"
                        onClick={(e) => {
                          e.preventDefault()
                          setConfirm({ inquiryId: inquiry.id, productName: inquiry.productName, customerName: inquiry.customerName, type: "delete" })
                        }}
                        className="grid h-7 w-7 place-items-center rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>

                {isUnread && (
                  <span className="absolute left-4 top-4 flex h-2.5 w-2.5 rounded-full bg-rose-500 shadow-sm" title="Unread messages" />
                )}

                <Link href={`/sales/orders/${inquiry.id}?tab=chats`} className="block p-5">
                  <p className="text-[12px] uppercase tracking-[0.16em] text-[#94a3b8]">Order chat</p>
                  <h3 className="mt-2 text-[17px] font-semibold text-[#111827]">{inquiry.productName}</h3>
                  <p className="mt-2 text-[13px] text-[#6b7280]">{inquiry.customerName}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-[13px] font-medium text-[#111827]">{formatPeso(inquiry.total)}</p>
                    <p className="text-[11px] text-[#94a3b8]">{formatDate(inquiry.createdAt)}</p>
                  </div>
                </Link>
              </div>
            )
          })}
          {pagedInquiries.length === 0 && (
            <div className="col-span-full py-8 text-center text-[13px] text-[#6b7280]">
              {hasDateFilter
                ? "No chats found for the selected date range."
                : "No chats found matching your search."}
            </div>
          )}
        </div>

        {filteredInquiries.length > 0 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage(1)}
              disabled={currentPage <= 1}
              className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            >
              &lt;&lt;
            </button>
            <button
              type="button"
              onClick={() => setPage((v) => Math.max(1, v - 1))}
              disabled={currentPage <= 1}
              className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            >
              &lt;
            </button>
            <div className="min-w-[112px] rounded-md border border-[#111827] bg-white px-4 py-2 text-center text-[13px] font-semibold text-[#6b7280] shadow-sm">
              <span className="rounded-md bg-[#020617] px-2 py-1 text-white">{currentPage}</span> of {totalPages}
            </div>
            <button
              type="button"
              onClick={() => setPage((v) => Math.min(totalPages, v + 1))}
              disabled={currentPage >= totalPages}
              className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            >
              &gt;
            </button>
            <button
              type="button"
              onClick={() => setPage(totalPages)}
              disabled={currentPage >= totalPages}
              className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            >
              &gt;&gt;
            </button>
          </div>
        )}
      </section>
    </>
  )
}
