import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import { canSalesAccessInquiry, createOrderChatMessage, type OrderChatAttachmentInput } from "@/lib/order-chat"

const MAX_BODY_LENGTH = 3000
const MAX_ATTACHMENTS = 3
const MAX_DATA_URL_LENGTH = 2_500_000

function buildRedirect(request: Request, inquiryId: string, message: string, tone: "success" | "error") {
  const url = new URL(`/sales/orders/${inquiryId}`, request.url)
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

function parseAttachments(value: FormDataEntryValue | null): OrderChatAttachmentInput[] {
  if (typeof value !== "string" || !value) {
    return []
  }

  const parsed = JSON.parse(value) as OrderChatAttachmentInput[]

  if (!Array.isArray(parsed)) {
    return []
  }

  return parsed.slice(0, MAX_ATTACHMENTS).filter((attachment) => {
    return (
      typeof attachment.fileName === "string" &&
      typeof attachment.mimeType === "string" &&
      typeof attachment.dataUrl === "string" &&
      attachment.dataUrl.startsWith("data:") &&
      attachment.dataUrl.length <= MAX_DATA_URL_LENGTH &&
      ["IMAGE", "DOCUMENT", "QUOTATION", "RECEIPT"].includes(attachment.attachmentType)
    )
  })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()
  const formData = await request.formData()
  const inquiryId = String(formData.get("inquiryId") ?? "")

  if (!currentUser) {
    return buildRedirect(request, inquiryId, "Your session could not be confirmed. Please sign in again.", "error")
  }

  if (!["SALES", "ADMIN_MANAGEMENT"].includes(currentUser.role)) {
    return buildRedirect(request, inquiryId, "Only sales admins can send order chat messages.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, inquiryId, "Invalid request origin.", "error")
  }

  const body = String(formData.get("body") ?? "").trim().slice(0, MAX_BODY_LENGTH)
  const attachments = parseAttachments(formData.get("attachmentsJson"))

  if (!body && attachments.length === 0) {
    return buildRedirect(request, inquiryId, "Type a message or attach a file before sending.", "error")
  }

  if (!(await canSalesAccessInquiry(inquiryId))) {
    return buildRedirect(request, inquiryId, "That order chat could not be found.", "error")
  }

  await createOrderChatMessage({
    inquiryId,
    senderUserId: currentUser.id,
    senderRole: "SALES",
    body: body || null,
    attachments,
  })

  revalidatePath("/sales")
  revalidatePath(`/sales/orders/${inquiryId}`)
  revalidatePath("/account/status")

  return buildRedirect(request, inquiryId, "Message sent to the customer.", "success")
}
