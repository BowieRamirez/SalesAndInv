"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

type InquiryCardData = {
  id: string
  productName: string
  customerName: string
  total: number
}

const PAGE_SIZE = 12

function formatPeso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(value)
}

export function OrderChatsList({
  inquiries,
  unreadChats,
}: {
  inquiries: InquiryCardData[]
  unreadChats: Set<string>
}) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  const filteredInquiries = useMemo(() => {
    if (!search.trim()) return inquiries
    const lowerSearch = search.toLowerCase()
    return inquiries.filter(
      (inquiry) =>
        inquiry.productName.toLowerCase().includes(lowerSearch) ||
        inquiry.customerName.toLowerCase().includes(lowerSearch) ||
        inquiry.id.toLowerCase().includes(lowerSearch)
    )
  }, [inquiries, search])

  const totalPages = Math.max(1, Math.ceil(filteredInquiries.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pagedInquiries = filteredInquiries.slice(pageStart, pageStart + PAGE_SIZE)

  return (
    <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[20px] font-semibold text-[#111827]">Order Chats</h2>
          <p className="mt-2 max-w-[760px] text-[14px] leading-[22px] text-[#6b7280]">
            Open a specific order to chat with the customer, receive images, and send quotation or receipt documents.
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
              setPage(1) // Reset to first page on search
            }}
            className="w-full rounded-[14px] border border-[#d1d5dc] bg-white py-2.5 pl-10 pr-4 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827] focus:ring-1 focus:ring-[#111827]"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pagedInquiries.map((inquiry) => {
          const isUnread = unreadChats.has(inquiry.id)
          return (
            <Link
              key={inquiry.id}
              href={`/sales/orders/${inquiry.id}?tab=chats`}
              className="relative rounded-2xl border border-[#eef2f7] bg-[#fbfcfd] p-5 transition-colors hover:border-[#111827]"
            >
              {isUnread ? (
                <span className="absolute right-4 top-4 flex h-3 w-3 rounded-full bg-rose-500 shadow-sm" title="Unread messages" />
              ) : null}
              <p className="text-[12px] uppercase tracking-[0.16em] text-[#94a3b8]">Order chat</p>
              <h3 className="mt-2 text-[17px] font-semibold text-[#111827]">{inquiry.productName}</h3>
              <p className="mt-2 text-[13px] text-[#6b7280]">{inquiry.customerName}</p>
              <p className="mt-3 text-[13px] font-medium text-[#111827]">{formatPeso(inquiry.total)}</p>
            </Link>
          )
        })}
        {pagedInquiries.length === 0 && (
          <div className="col-span-full py-8 text-center text-[13px] text-[#6b7280]">
            No chats found matching your search.
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
            aria-label="First page"
          >
            &lt;&lt;
          </button>
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={currentPage <= 1}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            aria-label="Previous page"
          >
            &lt;
          </button>
          <div className="min-w-[112px] rounded-md border border-[#111827] bg-white px-4 py-2 text-center text-[13px] font-semibold text-[#6b7280] shadow-sm">
            <span className="rounded-md bg-[#020617] px-2 py-1 text-white">{currentPage}</span> of {totalPages}
          </div>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={currentPage >= totalPages}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            aria-label="Next page"
          >
            &gt;
          </button>
          <button
            type="button"
            onClick={() => setPage(totalPages)}
            disabled={currentPage >= totalPages}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            aria-label="Last page"
          >
            &gt;&gt;
          </button>
        </div>
      )}
    </section>
  )
}
