"use client"

import { ClipboardList, CreditCard, FileText, Hammer, PackageCheck, ScanSearch, Truck } from "lucide-react"

type StepKey =
  | "RECEIVED"
  | "PENDING_INVENTORY_APPROVAL"
  | "PENDING_SALES_QUOTATION"
  | "PENDING_ACCOUNTING_APPROVAL"
  | "GETTING_READY_FOR_BUILDING"
  | "READY_FOR_SHIPPING"
  | "COMPLETED"

type StepConfig = {
  key: StepKey
  label: string
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
}

const ORDER_STEPS: StepConfig[] = [
  { key: "RECEIVED", label: "Order Placed", Icon: ClipboardList },
  { key: "PENDING_INVENTORY_APPROVAL", label: "Stock Check", Icon: ScanSearch },
  { key: "PENDING_SALES_QUOTATION", label: "Quotation", Icon: FileText },
  { key: "PENDING_ACCOUNTING_APPROVAL", label: "Payment", Icon: CreditCard },
  { key: "GETTING_READY_FOR_BUILDING", label: "Being Built", Icon: Hammer },
  { key: "READY_FOR_SHIPPING", label: "Out for Delivery", Icon: Truck },
  { key: "COMPLETED", label: "Delivered", Icon: PackageCheck },
]

const STEP_ORDER: StepKey[] = [
  "RECEIVED",
  "PENDING_INVENTORY_APPROVAL",
  "PENDING_SALES_QUOTATION",
  "PENDING_ACCOUNTING_APPROVAL",
  "GETTING_READY_FOR_BUILDING",
  "READY_FOR_SHIPPING",
  "COMPLETED",
]

function getStepIndex(workflowStatus: string): number {
  const idx = STEP_ORDER.indexOf(workflowStatus as StepKey)
  return idx === -1 ? 0 : idx
}

export function OrderStepper({ workflowStatus, updatedAtLabel }: { workflowStatus: string; updatedAtLabel: string }) {
  const currentIndex = getStepIndex(workflowStatus)

  return (
    <div className="relative flex w-full items-start justify-between overflow-x-auto py-2">
      {ORDER_STEPS.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex

        return (
          <div key={step.key} className="relative flex min-w-[80px] flex-1 flex-col items-center">
            {index > 0 && (
              <div
                className={`absolute top-[22px] right-[50%] h-[3px] w-full ${
                  isCompleted || isCurrent ? "bg-[#22c55e]" : "bg-[#e5e7eb]"
                }`}
                style={{ left: "-50%", right: "50%" }}
              />
            )}

            <div
              className={`relative z-10 flex h-[44px] w-[44px] items-center justify-center rounded-full border-[2px] transition-all ${
                isCompleted
                  ? "border-[#22c55e] bg-[#22c55e] shadow-[0_0_0_4px_rgba(34,197,94,0.12)]"
                  : isCurrent
                    ? "border-[#22c55e] bg-white shadow-[0_0_0_5px_rgba(34,197,94,0.15)]"
                    : "border-[#d1d5dc] bg-white"
              }`}
            >
              <step.Icon
                className={`h-[18px] w-[18px] ${
                  isCompleted ? "text-white" : isCurrent ? "text-[#16a34a]" : "text-[#cbd5e1]"
                }`}
                strokeWidth={1.75}
              />
            </div>

            <p
              className={`mt-2 text-center text-[10px] font-medium uppercase leading-[14px] tracking-[0.12em] ${
                isCurrent ? "text-[#15803d]" : isCompleted ? "text-[#16a34a]" : "text-[#b0b8c4]"
              }`}
            >
              {step.label}
            </p>

            {isCurrent && <p className="mt-1 text-center text-[10px] tracking-wide text-[#6a7282]">{updatedAtLabel}</p>}
          </div>
        )
      })}
    </div>
  )
}
