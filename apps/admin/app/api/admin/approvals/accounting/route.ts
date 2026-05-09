import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import {
  formatAccountingPaymentMethod,
  isAccountingPaymentMethod,
} from "@/lib/accounting-payment-methods"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import type { InquiryPaymentStatus } from "@/lib/inquiries"
import { updateInquiryWorkflowStatus } from "@/lib/inquiries"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/accounting", request.url)
  url.searchParams.set("tab", "approvals")
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser) {
    return buildRedirect(request, "Your session could not be confirmed. Please sign in again.", "error")
  }

  if (!["ACCOUNTING", "ADMIN_MANAGEMENT"].includes(currentUser.role)) {
    return buildRedirect(request, "Only accounting or executive admins can approve this step.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const inquiryId = String(formData.get("inquiryId") ?? "")
  const paymentMethodValue = String(formData.get("paymentMethod") ?? "").trim().toUpperCase()
  const paymentStatusValue = String(formData.get("paymentStatus") ?? "FULLY_PAID").trim().toUpperCase()
  const paidAmountValue = Number(formData.get("paidAmount") ?? 0)

  if (!isAccountingPaymentMethod(paymentMethodValue)) {
    return buildRedirect(request, "Select the customer's payment method before approving payment.", "error")
  }

  const allowedPaymentStatuses = new Set(["DOWN_PAYMENT", "PARTIALLY_PAID", "FULLY_PAID", "REJECTED"])

  if (!allowedPaymentStatuses.has(paymentStatusValue)) {
    return buildRedirect(request, "Select a valid payment status before approving payment.", "error")
  }

  if (
    (paymentStatusValue === "DOWN_PAYMENT" || paymentStatusValue === "PARTIALLY_PAID") &&
    (!Number.isFinite(paidAmountValue) || paidAmountValue <= 0)
  ) {
    return buildRedirect(request, "Enter the amount paid by the customer before approving this payment.", "error")
  }

  if (paymentStatusValue === "REJECTED") {
    const rawStatusNote = String(formData.get("statusNote") ?? "").trim()
    const updatedRows = await updateInquiryWorkflowStatus({
      inquiryId,
      expectedStages: ["PENDING_ACCOUNTING_APPROVAL"],
      nextStage: "PENDING_ACCOUNTING_APPROVAL",
      statusNote: rawStatusNote || "Accounting rejected this payment. Please request a corrected payment from the customer.",
      paymentMethod: paymentMethodValue,
      paymentStatus: "REJECTED",
    })

    revalidatePath("/accounting")
    revalidatePath("/sales")
    revalidatePath("/account/status")

    return buildRedirect(
      request,
      updatedRows > 0 ? "Payment rejected and kept in accounting review." : "That order is no longer waiting on accounting.",
      updatedRows > 0 ? "success" : "error",
    )
  }

  const paymentMethodLabel = formatAccountingPaymentMethod(paymentMethodValue)
  const rawStatusNote = String(formData.get("statusNote") ?? "").trim()
  const statusNote =
    rawStatusNote ||
    `Accounting approved the ${paymentStatusValue.toLowerCase().replaceAll("_", " ")} via ${paymentMethodLabel} and released the order to operations for building.`

  try {
    const updatedRows = await updateInquiryWorkflowStatus({
      inquiryId,
      expectedStages: ["PENDING_ACCOUNTING_APPROVAL"],
      nextStage: "GETTING_READY_FOR_BUILDING",
      statusNote,
      paymentMethod: paymentMethodValue,
      paymentStatus: paymentStatusValue as InquiryPaymentStatus,
      paidAmount: paymentStatusValue === "FULLY_PAID" ? null : paidAmountValue,
    })

    revalidatePath("/accounting")
    revalidatePath("/accounting/follow-ups")
    revalidatePath("/operations")
    revalidatePath("/sales")
    revalidatePath("/account/status")

    return buildRedirect(
      request,
      updatedRows > 0 ? "Payment approved and order released to operations." : "That order is no longer waiting on accounting.",
      updatedRows > 0 ? "success" : "error",
    )
  } catch (error) {
    console.error("Failed to approve accounting payment.", error)
    return buildRedirect(request, "Accounting approval failed. Please try again.", "error")
  }
}
