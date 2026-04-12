import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import {
  formatAccountingPaymentMethod,
  isAccountingPaymentMethod,
} from "@/lib/accounting-payment-methods"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
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

  if (!isAccountingPaymentMethod(paymentMethodValue)) {
    return buildRedirect(request, "Select the customer's payment method before approving payment.", "error")
  }

  const paymentMethodLabel = formatAccountingPaymentMethod(paymentMethodValue)
  const rawStatusNote = String(formData.get("statusNote") ?? "").trim()
  const statusNote =
    rawStatusNote || `Accounting approved the payment via ${paymentMethodLabel} and released the order to operations for building.`

  try {
    const updatedRows = await updateInquiryWorkflowStatus({
      inquiryId,
      expectedStages: ["PENDING_ACCOUNTING_APPROVAL"],
      nextStage: "GETTING_READY_FOR_BUILDING",
      statusNote,
      paymentMethod: paymentMethodValue,
    })

    revalidatePath("/accounting")
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
