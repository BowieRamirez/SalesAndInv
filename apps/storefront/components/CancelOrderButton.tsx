"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type CancelOrderButtonProps = {
  inquiryId: string
  productName: string
}

export function CancelOrderButton({ inquiryId, productName }: CancelOrderButtonProps) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCancel() {
    setBusy(true)
    setError(null)

    try {
      const res = await fetch("/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId }),
      })

      const data = await res.json() as { ok?: boolean; message?: string }

      if (!res.ok || !data.ok) {
        throw new Error(data.message ?? "Could not cancel the order. Please try again.")
      }

      setShowConfirm(false)
      // Redirect with success message
      router.push(`/account/status?message=${encodeURIComponent(data.message ?? "Order cancelled.")}&tone=success`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
      setBusy(false)
    }
  }

  return (
    <>
      {/* Cancel trigger button */}
      <button
        type="button"
        onClick={() => { setError(null); setShowConfirm(true) }}
        className="inline-flex items-center gap-1.5 rounded-[12px] border border-[#fecaca] bg-[#fff1f2] px-4 py-2.5 text-[13px] font-medium text-[#9f1239] transition-colors hover:bg-[#ffe4e6]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Cancel order
      </button>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a2e]/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] border border-[#e5e7eb] bg-white p-8 shadow-2xl">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#fff1f2]">
              <svg className="h-6 w-6 text-[#e11d48]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>

            <h3 className="text-center font-[family-name:var(--font-inter)] text-[20px] font-semibold text-[#1a1a2e]">
              Cancel this order?
            </h3>
            <p className="mt-2 text-center text-[14px] leading-[22px] text-[#6a7282]">
              You are about to cancel your order for{" "}
              <span className="font-semibold text-[#1a1a2e]">{productName}</span>.
              This cannot be undone.
            </p>
            <p className="mt-2 text-center text-[13px] text-[#6a7282]">
              You can cancel as long as your payment has not been confirmed by accounting. Once confirmed, cancellation is no longer possible.
            </p>

            {error && (
              <div className="mt-4 rounded-[12px] border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-[13px] text-[#9f1239]">
                {error}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => { setShowConfirm(false); setError(null) }}
                disabled={busy}
                className="flex-1 rounded-[12px] border border-[#e5e7eb] bg-white py-3 text-[14px] font-medium text-[#6a7282] transition-colors hover:bg-[#f9fafb] disabled:opacity-50"
              >
                Keep order
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={busy}
                className="flex-1 rounded-[12px] bg-[#e11d48] py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#be123c] active:scale-95 disabled:opacity-50"
              >
                {busy ? "Cancelling..." : "Yes, cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
