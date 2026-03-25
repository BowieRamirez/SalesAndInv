"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Bell } from "lucide-react";

function OperationsDashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "design";

  return (
    <div className="min-h-screen flex bg-[#fcfcfc] text-[#2d2d2d] font-sans">
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[64px] bg-white border-b border-[#e5e7eb] px-8 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[14px] font-medium text-charcoal">Welcome, Lia</span>
          </div>
          <div className="flex items-center space-x-5">
            <button className="relative text-muted hover:text-charcoal transition-colors">
              <Bell className="w-[20px] h-[20px]" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center cursor-pointer">
              <span className="text-rose-700 font-bold text-[11px]">LR</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <div className="mb-6">
            <h1 className="text-[24px] font-semibold text-charcoal leading-tight mb-1">Operations / Design</h1>
            <p className="text-[13px] text-muted">Manage design requests, confirm company codes, and control delivery readiness.</p>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-xl p-8 shadow-sm">
            <h3 className="text-[16px] font-semibold mb-3 capitalize">{activeTab.replace("-", " ")}</h3>
            <p className="text-[13px] text-muted leading-6">
              This workspace is reserved for the combined Operations / Design role. It should surface design uploads,
              company-code validation, delivery scheduling, and readiness checks that depend on approvals, stock, and payment state.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OperationsDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcfcfc]"></div>}>
      <OperationsDashboardContent />
    </Suspense>
  );
}
