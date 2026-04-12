"use client"

import { useState } from "react"
import { type ReturnRequestRow } from "@furnitrack/db"
import { formatShortDate } from "@/lib/format"

type CompletedOrder = {
  id: string
  productName: string
  workflowNote: string | null
  updatedAt: Date
}

function formatReturnStatus(status: ReturnRequestRow["status"]) {
  switch (status) {
    case "SUBMITTED":
      return "Return submitted"
    case "APPROVED_FOR_PICKUP":
      return "Pickup scheduled"
    case "PICKED_UP_COMPLETED":
      return "Return completed"
    case "REJECTED":
      return "Return rejected"
    default:
      return status
  }
}

function getStatusStyle(status: ReturnRequestRow["status"]) {
  switch (status) {
    case "SUBMITTED":
      return "bg-[#fff7ed] text-[#c2410c]"
    case "APPROVED_FOR_PICKUP":
      return "bg-[#eff6ff] text-[#1d4ed8]"
    case "PICKED_UP_COMPLETED":
      return "bg-[#ecfdf3] text-[#166534]"
    case "REJECTED":
      return "bg-[#fff1f2] text-[#be123c]"
    default:
      return "bg-[#f3f4f6] text-[#374151]"
  }
}

export function CompletedOrderReturnCard({
  inquiry,
  existingReturn,
}: {
  inquiry: CompletedOrder
  existingReturn?: ReturnRequestRow
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <article className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Completed order</p>
            <h2 className="mt-2 text-[24px] font-medium text-[#1a1a2e]">{inquiry.productName}</h2>
            <p className="mt-2 text-[13px] text-[#6a7282]">Completed on {formatShortDate(inquiry.updatedAt)}.</p>
          </div>

          {existingReturn ? (
            <span
              className={`inline-flex rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] ${getStatusStyle(existingReturn.status)}`}
            >
              {formatReturnStatus(existingReturn.status)}
            </span>
          ) : null}
        </div>

        <div className="mt-5 rounded-[18px] bg-[#f9fafb] p-4">
          <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Final update</p>
          <p className="mt-3 text-[14px] leading-[22px] text-[#1a1a2e]">
            {inquiry.workflowNote ?? "This order was shipped and completed successfully."}
          </p>
        </div>

        {existingReturn ? (
          <div className="mt-4 rounded-[18px] bg-[#fffaf0] p-4">
            <p className="text-[12px] uppercase tracking-[0.18em] text-[#c2410c]">Return details</p>
            <p className="mt-3 text-[14px] leading-[22px] text-[#7c2d12]">{existingReturn.reason}</p>
            {existingReturn.details ? (
              <p className="mt-2 text-[14px] leading-[22px] text-[#7c2d12]">{existingReturn.details}</p>
            ) : null}
            {existingReturn.pickupScheduledAt ? (
              <p className="mt-2 text-[13px] text-[#92400e]">
                Pickup schedule: {new Date(existingReturn.pickupScheduledAt).toLocaleString()}
              </p>
            ) : null}
            {existingReturn.salesNote ? (
              <p className="mt-2 text-[13px] text-[#92400e]">Sales note: {existingReturn.salesNote}</p>
            ) : null}
            {existingReturn.imageUrls.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {existingReturn.imageUrls.map((imageUrl, index) => (
                  <img
                    key={`${existingReturn.id}-${index}`}
                    src={imageUrl}
                    alt={`Returned furniture evidence ${index + 1}`}
                    className="h-40 w-full rounded-[16px] object-cover"
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[18px] bg-[#f8fafc] px-4 py-4">
            <div>
              <p className="text-[13px] font-medium text-[#1a1a2e]">Need to return this item?</p>
              <p className="mt-1 text-[13px] text-[#6a7282]">
                Submit the reason, describe the issue, and upload pictures if the furniture arrived damaged.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="rounded-[12px] bg-[#1a1a2e] px-4 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#1a1a2e]/90"
            >
              Request return
            </button>
          </div>
        )}
      </article>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a2e]/55 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#99a1af]">Return request</p>
                <h3 className="mt-2 text-[26px] font-medium text-[#1a1a2e]">{inquiry.productName}</h3>
                <p className="mt-2 text-[14px] text-[#6a7282]">
                  Tell the team why you want to return this completed item and attach pictures if it was damaged.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-[#d1d5dc] px-3 py-2 text-[12px] font-medium text-[#4b5563] transition-colors hover:bg-[#f9fafb]"
              >
                Close
              </button>
            </div>

            <form method="post" action="/api/returns" encType="multipart/form-data" className="mt-6 space-y-4">
              <input type="hidden" name="inquiryId" value={inquiry.id} />

              <label className="grid gap-2">
                <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Return reason</span>
                <select
                  name="reason"
                  defaultValue="Damaged item"
                  className="w-full rounded-[14px] border border-[#d1d5dc] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                >
                  <option>Damaged item</option>
                  <option>Wrong item delivered</option>
                  <option>Quality issue</option>
                  <option>Other concern</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Return details</span>
                <textarea
                  name="details"
                  rows={5}
                  placeholder="Describe the problem with the furniture and what happened."
                  className="w-full rounded-[14px] border border-[#d1d5dc] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                  Damage pictures
                </span>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  className="w-full rounded-[14px] border border-[#d1d5dc] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-colors file:mr-4 file:rounded-[10px] file:border-0 file:bg-[#f3f4f6] file:px-3 file:py-2 file:text-[13px] file:font-medium"
                />
              </label>

              <div className="flex flex-col-reverse gap-3 border-t border-[#e5e7eb] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-[14px] border border-[#d1d5dc] px-5 py-3 text-[14px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-[14px] bg-[#1a1a2e] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#1a1a2e]/90"
                >
                  Submit return request
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
