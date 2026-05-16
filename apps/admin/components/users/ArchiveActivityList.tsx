"use client"

import { useState } from "react"
import { Activity } from "lucide-react"

export type ArchiveEvent = {
  id: string
  type: string
  action: string
  entityType: string
  date: Date
  metadata: any
}

export function ArchiveActivityList({ events }: { events: ArchiveEvent[] }) {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const totalPages = Math.max(1, Math.ceil(events.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const pagedEvents = events.slice(start, start + pageSize)

  return (
    <div className="flex flex-col">
      <div className="divide-y divide-slate-100 min-h-[400px]">
        {pagedEvents.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-[14px]">
            No recorded actions found for this account.
          </div>
        ) : (
          pagedEvents.map((event) => (
            <div key={event.id} className="p-5 hover:bg-slate-50/50 transition-colors flex items-start gap-4">
              <div className="mt-1 bg-blue-100 text-blue-600 p-2 rounded-full shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium text-slate-900 capitalize">
                  {event.action.replace(/_/g, ' ').toLowerCase()} <span className="text-slate-500 font-normal capitalize">({event.entityType.replace(/_/g, ' ').toLowerCase()})</span>
                </p>
                {(() => {
                  let meta = event.metadata as any;
                  if (meta && typeof meta === 'object' && Array.isArray(meta.values) && Array.isArray(meta.strings)) {
                    try {
                      meta = JSON.parse(meta.values[0]);
                    } catch (e) {}
                  }

                  if (!meta || typeof meta !== 'object' || Object.keys(meta).length === 0) return null;

                  return (
                    <div className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                      {Object.entries(meta as Record<string, any>).map(([k, v]) => {
                        if (v === null || v === undefined || v === '') return null;
                        return (
                          <div key={k} className="flex flex-col">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                              {k.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            <span className="text-[13px] font-medium text-slate-800 mt-0.5 break-words">
                              {typeof v === 'boolean' 
                                ? (v ? 'Yes' : 'No') 
                                : typeof v === 'object' 
                                  ? JSON.stringify(v) 
                                  : String(v).replace(/_/g, " ")}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  );
                })()}
                <p className="text-[12px] text-slate-400 mt-2">
                  {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(event.date))}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {events.length > 0 && (
        <div className="mt-5 flex items-center justify-center gap-2 border-t border-slate-100 px-5 py-5 bg-white">
          <button
            type="button"
            onClick={() => setPage(1)}
            disabled={safePage <= 1}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            aria-label="First page"
          >
            &lt;&lt;
          </button>
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={safePage <= 1}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            aria-label="Previous page"
          >
            &lt;
          </button>
          <div className="min-w-[112px] rounded-md border border-[#111827] bg-white px-4 py-2 text-center text-[13px] font-semibold text-[#6b7280] shadow-sm">
            <span className="rounded-md bg-[#020617] px-2 py-1 text-white">{safePage}</span> of {totalPages}
          </div>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={safePage >= totalPages}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            aria-label="Next page"
          >
            &gt;
          </button>
          <button
            type="button"
            onClick={() => setPage(totalPages)}
            disabled={safePage >= totalPages}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e7eb] disabled:bg-white disabled:text-[#cbd5e1]"
            aria-label="Last page"
          >
            &gt;&gt;
          </button>
        </div>
      )}
    </div>
  )
}
