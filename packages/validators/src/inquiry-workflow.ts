import { z } from "zod"

export const InquiryWorkflowStatusEnum = z.enum([
  "RECEIVED",
  "PENDING_INVENTORY_APPROVAL",
  "PENDING_ACCOUNTING_APPROVAL",
  "GETTING_READY_FOR_BUILDING",
  "READY_FOR_SHIPPING",
  "COMPLETED",
])

export const LegacyInquiryWorkflowStatusEnum = z.enum([
  "ACCEPTED",
  "WAITING_FOR_PAYMENT",
  "READY_FOR_SHIPMENT",
])

export const AllInquiryWorkflowStatusEnum = z.enum([
  ...InquiryWorkflowStatusEnum.options,
  ...LegacyInquiryWorkflowStatusEnum.options,
])

export type InquiryWorkflowStatus = z.infer<typeof InquiryWorkflowStatusEnum>
export type AnyInquiryWorkflowStatus = z.infer<typeof AllInquiryWorkflowStatusEnum>

export const INQUIRY_WORKFLOW_LABELS: Record<AnyInquiryWorkflowStatus, string> = {
  RECEIVED: "Received by Sales",
  ACCEPTED: "Accepted by Sales",
  PENDING_INVENTORY_APPROVAL: "Pending Inventory Approval",
  WAITING_FOR_PAYMENT: "Waiting for Payment",
  PENDING_ACCOUNTING_APPROVAL: "Pending Accounting Approval",
  GETTING_READY_FOR_BUILDING: "Getting Ready for Building",
  READY_FOR_SHIPMENT: "Ready for Shipment",
  READY_FOR_SHIPPING: "Ready for Shipping",
  COMPLETED: "Completed",
}

export const INQUIRY_WORKFLOW_STYLES: Record<AnyInquiryWorkflowStatus, string> = {
  RECEIVED: "border border-[#d1d5db] text-[#374151]",
  ACCEPTED: "border border-[#d1d5db] text-[#374151]",
  PENDING_INVENTORY_APPROVAL: "border border-[#d1d5db] text-[#374151]",
  WAITING_FOR_PAYMENT: "border border-[#d1d5db] text-[#374151]",
  PENDING_ACCOUNTING_APPROVAL: "border border-[#d1d5db] text-[#374151]",
  GETTING_READY_FOR_BUILDING: "border border-[#d1d5db] text-[#374151]",
  READY_FOR_SHIPMENT: "border border-[#d1d5db] text-[#374151]",
  READY_FOR_SHIPPING: "border border-[#d1d5db] text-[#374151]",
  COMPLETED: "border border-[#d1d5db] text-[#374151]",
}

export const ACTIVE_INQUIRY_WORKFLOW_STATUSES = [
  "RECEIVED",
  "PENDING_INVENTORY_APPROVAL",
  "PENDING_ACCOUNTING_APPROVAL",
  "GETTING_READY_FOR_BUILDING",
  "READY_FOR_SHIPPING",
] as const

export function formatInquiryWorkflowStatus(status: string) {
  return INQUIRY_WORKFLOW_LABELS[status as AnyInquiryWorkflowStatus]
    ?? status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (value) => value.toUpperCase())
}

export function getInquiryWorkflowStyle(status: string) {
  return INQUIRY_WORKFLOW_STYLES[status as AnyInquiryWorkflowStatus] ?? "bg-[#f3f4f6] text-[#374151]"
}

export function isInquiryWorkflowStatus(status: string): status is InquiryWorkflowStatus {
  return InquiryWorkflowStatusEnum.safeParse(status).success
}
