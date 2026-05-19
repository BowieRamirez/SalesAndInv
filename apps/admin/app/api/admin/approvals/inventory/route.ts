import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import { updateInquiryWorkflowStatus } from "@/lib/inquiries"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/operations", request.url)
  url.searchParams.set("tab", "inv-approvals")
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser) {
    return buildRedirect(request, "Your session could not be confirmed. Please sign in again.", "error")
  }

  if (!["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
    return buildRedirect(request, "Only operations or executive admins can approve this step.", "error")
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
    || "Inventory approved material availability and forwarded the order to accounting for payment."

  try {
    const updatedRows = await updateInquiryWorkflowStatus({
      inquiryId,
      expectedStages: ["PENDING_INVENTORY_APPROVAL"],
      nextStage: "PENDING_ACCOUNTING_APPROVAL",
      statusNote,
      actorId: currentUser.id,
      actorRemarks: statusNote,
    })

    revalidatePath("/operations")
    revalidatePath("/accounting")
    revalidatePath("/sales")
    revalidatePath("/account/status")

    return buildRedirect(
      request,
      updatedRows > 0 ? "Materials approved and order forwarded to accounting." : "That order is no longer waiting on inventory.",
      updatedRows > 0 ? "success" : "error",
    )
  } catch (error) {
    console.error("Failed to approve inventory materials.", error)
    return buildRedirect(request, "Inventory approval failed. Please try again.", "error")
  }
}
