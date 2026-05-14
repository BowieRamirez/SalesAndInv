"use client"

import { useMemo, useState } from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { formatInquiryWorkflowStatus, getInquiryWorkflowStyle } from "@furnitrack/validators"
import { formatAccountingPaymentMethod } from "@/lib/accounting-payment-methods"
import type { InquiryPaymentStatus, InquiryWorkflowRow } from "@/lib/inquiries"

const PAGE_SIZE = 10
const FILTER_OPTIONS: Array<{ value: "ALL" | "PENDING" | "APPROVED" | "REJECTED" | InquiryPaymentStatus; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "DOWN_PAYMENT", label: "Down Payment" },
  { value: "PARTIALLY_PAID", label: "Partially Paid" },
  { value: "FULLY_PAID", label: "Fully Paid" },
]

function WorkflowBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${getInquiryWorkflowStyle(status)}`}
    >
      {formatInquiryWorkflowStatus(status)}
    </span>
  )
}

function formatPeso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(value)
}

function formatPaymentStatus(status: InquiryPaymentStatus) {
  return status
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ")
}

function matchesFilter(row: InquiryWorkflowRow, filter: string) {
  if (filter === "ALL") {
    return true
  }

  if (filter === "PENDING" || filter === "APPROVED" || filter === "REJECTED") {
    return row.paymentReviewStatus === filter
  }

  return row.paymentStatus === filter
}

export function ApprovalHistoryTable({ rows }: { rows: InquiryWorkflowRow[] }) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<(typeof FILTER_OPTIONS)[number]["value"]>("ALL")
  const [page, setPage] = useState(1)

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return rows.filter((row) => {
      const matchesQuery =
        !normalizedQuery ||
        [row.productName, row.customerName, row.customerEmail].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        )

      return matchesQuery && matchesFilter(row, filter)
    })
  }, [filter, query, rows])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pagedRows = filteredRows.slice(pageStart, pageStart + PAGE_SIZE)

  return (
    <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col">
          <h2 className="text-[20px] font-semibold text-[#111827]">Accounting approval history</h2>
          <p className="mt-1 text-[13px] text-[#6b7280]">
            Review previously approved payments here.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder="Search product, customer, email"
            className="w-full rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827] md:w-[320px]"
          />
          <select
            value={filter}
            onChange={(event) => {
              setFilter(event.target.value as typeof filter)
              setPage(1)
            }}
            className="w-full rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827] md:w-[210px]"
          >
            {FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
              <th className="py-3 pr-4 font-medium">Date Approved</th>
              <th className="py-3 pr-4 font-medium">Product</th>
              <th className="py-3 pr-4 font-medium">Customer</th>
              <th className="py-3 pr-4 font-medium">Payment Method</th>
              <th className="py-3 pr-4 font-medium">Total</th>
              <th className="py-3 pr-4 font-medium">Down payment required</th>
              <th className="py-3 pr-4 font-medium">Paid</th>
              <th className="py-3 pr-4 font-medium">Remaining balance</th>
              <th className="py-3 pr-4 font-medium">Payment status</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium">Note</th>
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((row) => (
              <tr key={row.id} className="border-b border-[#f3f4f6] last:border-b-0">
                <td className="py-3 pr-4 text-[#111827] whitespace-nowrap">
                  {new Date(row.updatedAt).toLocaleDateString()}
                </td>
                <td className="py-3 pr-4 text-[#111827]">{row.productName}</td>
                <td className="py-3 pr-4 text-[#111827]">
                  {row.customerName}
                  <br />
                  <span className="text-[11px] text-[#6b7280]">{row.customerEmail}</span>
                </td>
                <td className="py-3 pr-4 text-[#111827]">
                  {row.paymentMethod ? formatAccountingPaymentMethod(row.paymentMethod) : "N/A"}
                </td>
                <td className="py-3 pr-4 text-[#111827] whitespace-nowrap">{formatPeso(row.total)}</td>
                <td className="py-3 pr-4 text-[#111827] whitespace-nowrap">{formatPeso(row.downPaymentRequired)}</td>
                <td className="py-3 pr-4 text-[#111827] whitespace-nowrap">{formatPeso(row.paid)}</td>
                <td className="py-3 pr-4 text-[#111827] whitespace-nowrap">{formatPeso(row.remainingBalance)}</td>
                <td className="py-3 pr-4 text-[#111827] whitespace-nowrap">{formatPaymentStatus(row.paymentStatus)}</td>
                <td className="py-3 pr-4">
                  <WorkflowBadge status={row.workflowStatus} />
                </td>
                <td className="py-3 pr-4 text-[#6b7280] max-w-xs truncate" title={row.workflowNote ?? ""}>
                  {row.workflowNote || "No note"}
                </td>
              </tr>
            ))}
            {pagedRows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#6b7280]">
                  No approval records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-5 flex items-center justify-center gap-2">
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
    </section>
  )
}

export function PaymentRecordsTable({ rows }: { rows: InquiryWorkflowRow[] }) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<(typeof FILTER_OPTIONS)[number]["value"]>("ALL")
  const [page, setPage] = useState(1)
  const [selectedReceipt, setSelectedReceipt] = useState<InquiryWorkflowRow | null>(null)

  const handleDownloadPdf = () => {
    if (!selectedReceipt) return

    const doc = new jsPDF()

    // Header
    doc.setFontSize(22)
    doc.setFont("helvetica", "bold")
    doc.text("FurniTrack", 14, 20)
    
    doc.setFontSize(14)
    doc.setFont("helvetica", "normal")
    doc.text("Official Receipt", 14, 30)

    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Order #${selectedReceipt.id.slice(-8).toUpperCase()}`, 14, 38)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 44)

    // Reset color
    doc.setTextColor(0)

    // Customer Info
    autoTable(doc, {
      startY: 55,
      head: [["Customer Information", ""]],
      body: [
        ["Name:", selectedReceipt.customerName],
        ["Email:", selectedReceipt.customerEmail],
        ["Phone:", selectedReceipt.customerPhone || "N/A"],
      ],
      theme: "plain",
      headStyles: { fillColor: [243, 244, 246], textColor: [17, 24, 39], fontStyle: "bold" },
      styles: { cellPadding: 3, fontSize: 10 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 } },
    })

    const formatPdfPeso = (val: number) => {
      return "PHP " + val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    // Order Details
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [["Order Details", ""]],
      body: [
        ["Product:", selectedReceipt.productName],
        ["Total Amount:", formatPdfPeso(selectedReceipt.total)],
        ["Amount Paid:", formatPdfPeso(selectedReceipt.paid)],
        ["Remaining Balance:", formatPdfPeso(selectedReceipt.remainingBalance)],
        ["Payment Status:", formatPaymentStatus(selectedReceipt.paymentStatus)],
        ["Payment Method:", selectedReceipt.paymentMethod ? formatAccountingPaymentMethod(selectedReceipt.paymentMethod) : "N/A"],
        ["Approval Note:", selectedReceipt.workflowNote || "None"],
      ],
      theme: "plain",
      headStyles: { fillColor: [243, 244, 246], textColor: [17, 24, 39], fontStyle: "bold" },
      styles: { cellPadding: 3, fontSize: 10 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 } },
    })

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 30
    doc.setFontSize(10)
    doc.setFont("helvetica", "italic")
    doc.setTextColor(100)
    doc.text("Thank you for your business!", 14, finalY)

    doc.save(`Receipt_${selectedReceipt.id.slice(-8).toUpperCase()}.pdf`)
  }

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return rows.filter((row) => {
      const matchesQuery =
        !normalizedQuery ||
        [row.productName, row.customerName, row.customerEmail].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        )

      return matchesQuery && matchesFilter(row, filter)
    })
  }, [filter, query, rows])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pagedRows = filteredRows.slice(pageStart, pageStart + PAGE_SIZE)

  return (
    <>
      <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col">
            <h2 className="text-[20px] font-semibold text-[#111827]">Payment Records</h2>
            <p className="mt-1 text-[13px] text-[#6b7280]">
              View receipts and payment details of accepted orders.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Search product, customer, email"
              className="w-full rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827] md:w-[320px]"
            />
            <select
              value={filter}
              onChange={(event) => {
                setFilter(event.target.value as typeof filter)
                setPage(1)
              }}
              className="w-full rounded-xl border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827] outline-none transition-colors focus:border-[#111827] md:w-[210px]"
            >
              {FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
                <th className="py-3 pr-4 font-medium">Order ID</th>
                <th className="py-3 pr-4 font-medium">Date Approved</th>
                <th className="py-3 pr-4 font-medium">Product</th>
                <th className="py-3 pr-4 font-medium">Customer</th>
                <th className="py-3 pr-4 font-medium">Payment Method</th>
                <th className="py-3 pr-4 font-medium">Total</th>
                <th className="py-3 pr-4 font-medium">Down payment required</th>
                <th className="py-3 pr-4 font-medium">Paid</th>
                <th className="py-3 pr-4 font-medium">Remaining balance</th>
                <th className="py-3 pr-4 font-medium">Payment status</th>
                <th className="py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((row) => (
                <tr key={row.id} className="border-b border-[#f3f4f6] last:border-b-0">
                  <td className="py-3 pr-4 text-[#111827] whitespace-nowrap font-mono text-[11px]">
                    {row.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="py-3 pr-4 text-[#111827] whitespace-nowrap">
                    {new Date(row.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4 text-[#111827]">{row.productName}</td>
                  <td className="py-3 pr-4 text-[#111827]">
                    {row.customerName}
                  </td>
                  <td className="py-3 pr-4 text-[#111827]">
                    {row.paymentMethod ? formatAccountingPaymentMethod(row.paymentMethod) : "N/A"}
                  </td>
                  <td className="py-3 pr-4 text-[#111827] whitespace-nowrap">{formatPeso(row.total)}</td>
                  <td className="py-3 pr-4 text-[#111827] whitespace-nowrap">{formatPeso(row.downPaymentRequired)}</td>
                  <td className="py-3 pr-4 text-[#111827] whitespace-nowrap">{formatPeso(row.paid)}</td>
                  <td className="py-3 pr-4 text-[#111827] whitespace-nowrap">{formatPeso(row.remainingBalance)}</td>
                  <td className="py-3 pr-4 text-[#111827] whitespace-nowrap">{formatPaymentStatus(row.paymentStatus)}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedReceipt(row)}
                      className="rounded-lg bg-[#111827] px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#111827]/90"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
              {pagedRows.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-[#6b7280]">
                    No payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex items-center justify-center gap-2">
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
      </section>

      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/45 px-4 overflow-y-auto pt-20 pb-10">
          <div className="w-full max-w-md rounded-2xl border border-[#dbe4f0] bg-white p-8 shadow-2xl">
            <div className="mb-6 flex justify-between items-center border-b border-[#e5e7eb] pb-4">
              <div>
                <h3 className="text-[18px] font-bold text-[#111827]">Payment Receipt</h3>
                <p className="text-[12px] text-[#6b7280]">Order #{selectedReceipt.id.slice(-8).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-medium text-[#111827]">{new Date(selectedReceipt.updatedAt).toLocaleDateString()}</p>
                <p className="text-[12px] text-[#6b7280]">FurniTrack Admin</p>
              </div>
            </div>
            
            <div className="space-y-4 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Customer Name</span>
                <span className="font-medium text-[#111827]">{selectedReceipt.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Email</span>
                <span className="font-medium text-[#111827]">{selectedReceipt.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Phone</span>
                <span className="font-medium text-[#111827]">{selectedReceipt.customerPhone}</span>
              </div>
              <div className="border-t border-dashed border-[#e5e7eb] my-3"></div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Product</span>
                <span className="font-medium text-[#111827]">{selectedReceipt.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Payment Method</span>
                <span className="font-medium text-[#111827]">
                  {selectedReceipt.paymentMethod ? formatAccountingPaymentMethod(selectedReceipt.paymentMethod) : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Approval Note</span>
                <span className="font-medium text-[#111827] max-w-[200px] text-right">
                  {selectedReceipt.workflowNote || "None"}
                </span>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="w-full rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-[13px] font-medium text-[#111827] transition-colors hover:bg-[#f8fafc]"
              >
                Download PDF
              </button>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="w-full rounded-xl bg-[#111827] px-4 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
