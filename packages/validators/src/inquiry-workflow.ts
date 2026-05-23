import { z } from "zod"

export const InquiryWorkflowStatusEnum = z.enum([
  "RECEIVED",
  "PENDING_INVENTORY_APPROVAL",
  "PENDING_SALES_QUOTATION",
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
  PENDING_SALES_QUOTATION: "Pending Sales Quotation",
  WAITING_FOR_PAYMENT: "Waiting for Payment",
  PENDING_ACCOUNTING_APPROVAL: "Pending Accounting Approval",
  GETTING_READY_FOR_BUILDING: "Getting Ready for Building",
  READY_FOR_SHIPMENT: "Ready for Shipment",
  READY_FOR_SHIPPING: "Ready for Shipping",
  COMPLETED: "Completed",
}

export const INQUIRY_WORKFLOW_STYLES: Record<AnyInquiryWorkflowStatus, string> = {
  RECEIVED: "bg-[#fef9c3] text-[#854d0e]",
  ACCEPTED: "bg-[#f3f4f6] text-[#374151]",
  PENDING_INVENTORY_APPROVAL: "bg-[#dbeafe] text-[#1d4ed8]",
  PENDING_SALES_QUOTATION: "bg-[#fce7f3] text-[#9d174d]",
  WAITING_FOR_PAYMENT: "bg-[#fef3c7] text-[#92400e]",
  PENDING_ACCOUNTING_APPROVAL: "bg-[#fef3c7] text-[#92400e]",
  GETTING_READY_FOR_BUILDING: "bg-[#f3e8ff] text-[#7e22ce]",
  READY_FOR_SHIPMENT: "bg-[#dcfce7] text-[#166534]",
  READY_FOR_SHIPPING: "bg-[#dcfce7] text-[#166534]",
  COMPLETED: "bg-[#f0fdf4] text-[#047857]",
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
