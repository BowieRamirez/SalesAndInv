import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import { canSalesAccessInquiry, createOrderChatMessage, getOrderChatMessages, type OrderChatAttachmentInput } from "@/lib/order-chat"
import { logAudit, prisma } from "@furnitrack/db"

const MAX_BODY_LENGTH = 3000
const MAX_ATTACHMENTS = 3
const MAX_DATA_URL_LENGTH = 2_500_000

function buildRedirect(request: Request, inquiryId: string, message: string, tone: "success" | "error") {
  const url = new URL(`/sales/orders/${inquiryId}`, request.url)
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

function wantsJson(request: Request) {
  return request.headers.get("x-requested-with") === "fetch"
}

function buildResponse(request: Request, inquiryId: string, message: string, tone: "success" | "error", status = 200) {
  if (wantsJson(request)) {
    return NextResponse.json({ message, tone }, { status })
  }

  return buildRedirect(request, inquiryId, message, tone)
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
      ["IMAGE", "DOCUMENT", "RECEIPT"].includes(attachment.attachmentType)
    )
  })
}

export async function GET(request: Request) {
  const currentUser = await getAuthenticatedAppUser()
  const url = new URL(request.url)
  const inquiryId = url.searchParams.get("inquiryId") ?? ""

  if (!currentUser) {
    return NextResponse.json({ message: "Your session could not be confirmed. Please sign in again." }, { status: 401 })
  }

  if (!["SALES", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
    return NextResponse.json({ message: "Only sales admins can view order chat messages." }, { status: 403 })
  }

  if (!(await canSalesAccessInquiry(inquiryId))) {
    return NextResponse.json({ message: "That order chat could not be found." }, { status: 404 })
  }

  const messages = await getOrderChatMessages(inquiryId)

  return NextResponse.json({ messages })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()
  const formData = await request.formData()
  const inquiryId = String(formData.get("inquiryId") ?? "")

  if (!currentUser) {
    return buildResponse(request, inquiryId, "Your session could not be confirmed. Please sign in again.", "error", 401)
  }

  if (!["SALES", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
    return buildResponse(request, inquiryId, "Only sales admins can send order chat messages.", "error", 403)
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildResponse(request, inquiryId, "Invalid request origin.", "error", 403)
  }

  const body = String(formData.get("body") ?? "").trim().slice(0, MAX_BODY_LENGTH)
  const attachments = parseAttachments(formData.get("attachmentsJson"))

  if (!body && attachments.length === 0) {
    return buildResponse(request, inquiryId, "Type a message or attach a file before sending.", "error", 400)
  }

  if (!(await canSalesAccessInquiry(inquiryId))) {
    return buildResponse(request, inquiryId, "That order chat could not be found.", "error", 404)
  }

  const inquiryRecord = await prisma.customerInquiry.findUnique({
    where: { id: inquiryId },
    select: { statusNote: true },
  })

  if (inquiryRecord?.statusNote?.includes("[[completed]]")) {
    return buildResponse(request, inquiryId, "This order is completed and the chat is closed.", "error", 403)
  }

  const messageId = await createOrderChatMessage({
    inquiryId,
    senderUserId: currentUser.id,
    senderRole: "SALES",
    body: body || null,
    attachments,
  })

  revalidatePath("/sales")
  revalidatePath(`/sales/orders/${inquiryId}`)
  revalidatePath("/account/status")

  await logAudit({
    actorId: currentUser.authUserId,
    action: "CHAT_MESSAGE_SENT",
    entityType: "CHAT",
    entityId: messageId,
    metadata: {
      inquiryId,
      hasAttachments: attachments.length > 0,
      bodyLength: body.length,
    },
  })

  if (wantsJson(request)) {
    return NextResponse.json({
      message: "Message sent to the customer.",
      tone: "success",
      chatMessage: {
        id: messageId,
        inquiryId,
        senderUserId: currentUser.id,
        senderRole: "SALES",
        senderName: currentUser.name,
        body: body || null,
        createdAt: new Date().toISOString(),
        attachments: attachments.map((attachment, index) => ({
          id: `${messageId}-${index}`,
          ...attachment,
        })),
      },
    })
  }

  return buildRedirect(request, inquiryId, "Message sent to the customer.", "success")
}
