import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import { updateInquiryWorkflowStatus } from "@/lib/inquiries"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/sales", request.url)
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

  if (!["SALES", "ADMIN_MANAGEMENT"].includes(currentUser.role)) {
    return buildRedirect(request, "Only sales or executive admins can approve this step.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const inquiryId = String(formData.get("inquiryId") ?? "")
  const statusNote =
    String(formData.get("statusNote") ?? "").trim()
    || "Sales endorsed this order to inventory for material stock confirmation."

  try {
    const updatedRows = await updateInquiryWorkflowStatus({
      inquiryId,
      expectedStages: ["RECEIVED"],
      nextStage: "PENDING_INVENTORY_APPROVAL",
      statusNote,
    })

    revalidatePath("/sales")
    revalidatePath("/inventory")
    revalidatePath("/account/status")

    return buildRedirect(
      request,
      updatedRows > 0 ? "Order forwarded to inventory for material approval." : "That order could not be forwarded anymore.",
      updatedRows > 0 ? "success" : "error",
    )
  } catch (error) {
    console.error("Failed to send inquiry to inventory approval.", error)
    return buildRedirect(request, "Sales approval failed. Please try again.", "error")
  }
}
