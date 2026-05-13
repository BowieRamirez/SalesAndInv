import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import { reserveInquiryMaterialsForBuild } from "@/lib/inventory/reservations"
import { updateInquiryPaymentFollowUp } from "@/lib/inquiries"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/accounting/follow-ups", request.url)
  url.searchParams.set("tab", "follow-ups")
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
    return buildRedirect(request, "Only accounting or executive admins can update payment follow-ups.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const inquiryId = String(formData.get("inquiryId") ?? "")
  const paidAmount = Number(formData.get("paidAmount") ?? 0)
  const statusNote = String(formData.get("statusNote") ?? "").trim()

  if (!Number.isFinite(paidAmount) || paidAmount <= 0) {
    return buildRedirect(request, "Enter the total amount collected from the customer.", "error")
  }

  try {
    const updatedRows = await updateInquiryPaymentFollowUp({
      inquiryId,
      paidAmount,
      statusNote: statusNote || "Accounting updated the customer payment follow-up.",
    })

    if (updatedRows > 0) {
      await reserveInquiryMaterialsForBuild({
        inquiryId,
        actorId: currentUser.id,
        actorName: currentUser.name,
        paymentStatus: "FOLLOW_UP_UPDATED",
      })
    }

    revalidatePath("/accounting")
    revalidatePath("/accounting/follow-ups")
    revalidatePath("/inventory")
    revalidatePath("/operations")
    revalidatePath("/account/status")

    return buildRedirect(
      request,
      updatedRows > 0 ? "Payment follow-up updated." : "That order is no longer pending payment follow-up.",
      updatedRows > 0 ? "success" : "error",
    )
  } catch (error) {
    console.error("Failed to update payment follow-up.", error)
    const message = error instanceof Error ? error.message : "Payment follow-up update failed. Please try again."
    return buildRedirect(request, message, "error")
  }
}
