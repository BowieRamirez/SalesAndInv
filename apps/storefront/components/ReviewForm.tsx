"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type ReviewFormProps = {
  inquiryId: string
  productName: string
  productSlug: string
  alreadyReviewed?: boolean
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-[28px] leading-none transition-transform hover:scale-110 active:scale-95"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          <span className={hovered >= star || value >= star ? "text-[#ffb900]" : "text-[#e5e7eb]"}>
            ★
          </span>
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-[13px] text-[#6a7282]">
          {["", "Poor", "Fair", "Good", "Very good", "Excellent"][value]}
        </span>
      )}
    </div>
  )
}

export function ReviewForm({ inquiryId, productName, productSlug, alreadyReviewed }: ReviewFormProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(alreadyReviewed ?? false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) { setError("Please select a star rating."); return }
    setBusy(true)
    setError(null)

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId, rating, comment: comment || null }),
      })

      const data = await res.json() as { ok?: boolean; message?: string; productSlug?: string; alreadyReviewed?: boolean }

      if (!res.ok) {
        if (data.alreadyReviewed) {
          setDone(true)
          setIsOpen(false)
          return
        }
        throw new Error(data.message ?? "Could not submit review.")
      }

      setDone(true)
      setIsOpen(false)
      // Stay on the account status page — just show the confirmation
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[18px] bg-[#f0fdf4] px-4 py-4 border border-[#bbf7d0]">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-[13px] font-medium text-[#166534]">Review submitted</p>
        </div>
        <a
          href={`/shop/${productSlug}`}
          className="rounded-[12px] border border-[#bbf7d0] bg-white px-4 py-2.5 text-[13px] font-medium text-[#166534] transition-colors hover:bg-[#f0fdf4]"
        >
          View product reviews →
        </a>
      </div>
    )
  }

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[18px] bg-[#f8fafc] px-4 py-4">
        <div>
          <p className="text-[13px] font-medium text-[#1a1a2e]">How was your experience?</p>
          <p className="mt-1 text-[13px] text-[#6a7282]">
            Leave a star rating and comment to help other customers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-[12px] bg-[#1a1a2e] px-4 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#1a1a2e]/90"
        >
          Write a review
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a2e]/55 px-4 py-8">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-7 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Write a review</p>
                <h3 className="mt-1 text-[22px] font-semibold text-[#1a1a2e]">{productName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-[#d1d5dc] px-3 py-2 text-[12px] font-medium text-[#4b5563] hover:bg-[#f9fafb]"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                  Your rating <span className="text-red-500">*</span>
                </p>
                <StarRating value={rating} onChange={setRating} />
              </div>

              <label className="block">
                <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                  Comment (optional)
                </span>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  maxLength={1000}
                  className="w-full resize-none rounded-[14px] border border-[#d1d5dc] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-colors focus:border-[#1a1a2e]"
                />
                <p className="mt-1 text-right text-[11px] text-[#99a1af]">{comment.length}/1000</p>
              </label>

              {error && (
                <p className="rounded-[12px] border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-[13px] text-[#9f1239]">
                  {error}
                </p>
              )}

              <div className="flex gap-3 border-t border-[#e5e7eb] pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-[14px] border border-[#d1d5dc] px-5 py-3 text-[14px] font-medium text-[#374151] hover:bg-[#f9fafb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy || rating === 0}
                  className="flex-1 rounded-[14px] bg-[#1a1a2e] px-5 py-3 text-[14px] font-medium text-white hover:bg-[#1a1a2e]/90 disabled:opacity-50"
                >
                  {busy ? "Submitting..." : "Submit review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
