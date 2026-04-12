import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { approveReturnRequest, completeReturnRequest } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/sales", request.url)
  url.searchParams.set("tab", "returns")
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
    return buildRedirect(request, "Only sales or executive admins can manage returns.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const returnRequestId = String(formData.get("returnRequestId") ?? "").trim()
  const submitMode = String(formData.get("submitMode") ?? "").trim()
  const salesNote = String(formData.get("salesNote") ?? "").trim() || null

  if (!returnRequestId) {
    return buildRedirect(request, "Return request id is required.", "error")
  }

  try {
    if (submitMode === "approve") {
      const pickupScheduledAtRaw = String(formData.get("pickupScheduledAt") ?? "").trim()

      if (!pickupScheduledAtRaw) {
        return buildRedirect(request, "Set the pickup date and time before approving the return.", "error")
      }

      const pickupScheduledAt = new Date(pickupScheduledAtRaw)

      if (Number.isNaN(pickupScheduledAt.getTime())) {
        return buildRedirect(request, "Enter a valid pickup date and time.", "error")
      }

      const updatedRows = await approveReturnRequest({
        returnRequestId,
        approvedById: currentUser.id,
        salesNote,
        pickupScheduledAt,
      })

      revalidatePath("/sales")
      revalidatePath("/account/status")

      return buildRedirect(
        request,
        updatedRows > 0 ? "Return approved and pickup schedule saved." : "That return is no longer waiting for approval.",
        updatedRows > 0 ? "success" : "error",
      )
    }

    if (submitMode === "complete") {
      const updatedRows = await completeReturnRequest({
        returnRequestId,
        completedById: currentUser.id,
        salesNote,
      })

      revalidatePath("/sales")
      revalidatePath("/account/status")
      revalidatePath("/inventory")

      return buildRedirect(
        request,
        updatedRows > 0
          ? "Return completed and damaged materials were recorded in inventory."
          : "That return is no longer ready to be completed.",
        updatedRows > 0 ? "success" : "error",
      )
    }

    return buildRedirect(request, "Unknown return action.", "error")
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : "Return processing failed."
    return buildRedirect(request, message, "error")
  }
}
