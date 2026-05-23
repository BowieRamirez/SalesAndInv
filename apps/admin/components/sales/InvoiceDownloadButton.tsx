"use client"

import { useState } from "react"
import { FileDown, Loader2 } from "lucide-react"

type Props = {
  inquiryId: string
  productName: string
}

export function InvoiceDownloadButton({ inquiryId, productName }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")

  async function handleDownload() {
    setStatus("loading")
    try {
      const res = await fetch(`/api/admin/sales/invoice?inquiryId=${encodeURIComponent(inquiryId)}`)
      if (!res.ok) {
        setStatus("error")
        setTimeout(() => setStatus("idle"), 3000)
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      // Get filename from Content-Disposition header if available
      const disposition = res.headers.get("Content-Disposition")
      const match = disposition?.match(/filename="([^"]+)"/)
      a.download = match?.[1] ?? `Invoice-${productName.replace(/\s+/g, "-")}.pdf`
      a.href = url
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setStatus("idle")
    } catch {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={status === "loading"}
      className="inline-flex items-center gap-2 rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-2.5 text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#f8fafc] hover:border-[#111827] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {status === "loading" ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-[#6b7280]" />
          Generating PDF…
        </>
      ) : status === "error" ? (
        <>
          <FileDown className="h-4 w-4 text-[#dc2626]" />
          Failed — try again
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4 text-[#374151]" />
          Download invoice PDF
        </>
      )}
    </button>
  )
}
