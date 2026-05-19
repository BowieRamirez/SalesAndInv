import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import { setInquiryShippingSchedule, updateInquiryWorkflowStatus } from "@/lib/inquiries"
import { logAudit } from "@furnitrack/db"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/operations", request.url)
  url.searchParams.set("tab", "delivery")
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
    return buildRedirect(request, "Only operations or executive admins can complete shipping.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const inquiryId = String(formData.get("inquiryId") ?? "")
  const shippingScheduledAtRaw = String(formData.get("shippingScheduledAt") ?? "").trim()
  const submitMode = String(formData.get("submitMode") ?? "").trim()
  const statusNote =
    String(formData.get("statusNote") ?? "").trim()
    || "Order shipped successfully and moved to order history."

  try {
    const updatedRows =
      submitMode === "schedule"
        ? await (() => {
            if (!shippingScheduledAtRaw) {
              throw new Error("Set the shipping date and time on the delivery schedule first.")
            }

            const shippingScheduledAt = new Date(shippingScheduledAtRaw)

            if (Number.isNaN(shippingScheduledAt.getTime())) {
              throw new Error("Enter a valid shipping date and time.")
            }

            return setInquiryShippingSchedule({
              inquiryId,
              statusNote,
              shippingScheduledAt,
            })
          })()
        : await updateInquiryWorkflowStatus({
            inquiryId,
            expectedStages: ["READY_FOR_SHIPPING"],
            nextStage: "COMPLETED",
            statusNote,
            actorId: currentUser.id,
            actorRemarks: statusNote,
          })

    revalidatePath("/operations")
    revalidatePath("/sales")
    revalidatePath("/account/status")

    if (updatedRows > 0) {
      await logAudit({
        actorId: currentUser.authUserId,
        action: "DELIVERY_SCHEDULED",
        entityType: "DELIVERY_SCHEDULE",
        entityId: inquiryId,
        metadata: {
          submitMode,
          statusNote,
          shippingScheduledAt: submitMode === "schedule" ? shippingScheduledAtRaw : undefined,
        },
      })
    }

    return buildRedirect(
      request,
      updatedRows > 0
        ? submitMode === "schedule"
          ? "Shipping date and time saved."
          : "Order marked as shipped and completed."
        : "That order is no longer in the shipping queue.",
      updatedRows > 0 ? "success" : "error",
    )
  } catch (error) {
    console.error("Failed to complete shipped order.", error)
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Shipping completion failed. Please try again."
    return buildRedirect(request, message, "error")
  }
}
