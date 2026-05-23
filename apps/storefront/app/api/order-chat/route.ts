import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { getStorefrontSessionUser } from "@/lib/auth/session"
import { canCustomerAccessInquiry, createOrderChatMessage, getOrderChatMessages, type OrderChatAttachmentInput } from "@/lib/order-chat"
import { prisma } from "@furnitrack/db"

const MAX_BODY_LENGTH = 3000
const MAX_ATTACHMENTS = 3
const MAX_DATA_URL_LENGTH = 2_500_000

function buildRedirect(request: Request, inquiryId: string, message: string, tone: "success" | "error") {
  const url = new URL("/account/status", request.url)
  url.searchParams.set("order", inquiryId)
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
  const sessionUser = await getStorefrontSessionUser()
  const url = new URL(request.url)
  const inquiryId = url.searchParams.get("inquiryId") ?? ""

  if (!sessionUser) {
    return NextResponse.json({ message: "Please sign in before viewing order messages." }, { status: 401 })
  }

  if (sessionUser.role !== "CLIENT") {
    return NextResponse.json({ message: "Only customer accounts can view storefront order messages." }, { status: 403 })
  }

  if (!(await canCustomerAccessInquiry(inquiryId, sessionUser.id))) {
    return NextResponse.json({ message: "That order chat could not be found." }, { status: 404 })
  }

  const messages = await getOrderChatMessages(inquiryId)

  return NextResponse.json({ messages })
}

export async function POST(request: Request) {
  const sessionUser = await getStorefrontSessionUser()
  const formData = await request.formData()
  const inquiryId = String(formData.get("inquiryId") ?? "")

  if (!sessionUser) {
    return buildResponse(request, inquiryId, "Please sign in before sending an order message.", "error", 401)
  }

  if (sessionUser.role !== "CLIENT") {
    return buildResponse(request, inquiryId, "Only customer accounts can send storefront order messages.", "error", 403)
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildResponse(request, inquiryId, "Invalid request origin.", "error", 403)
  }

  const body = String(formData.get("body") ?? "").trim().slice(0, MAX_BODY_LENGTH)
  const attachments = parseAttachments(formData.get("attachmentsJson"))

  if (!body && attachments.length === 0) {
    return buildResponse(request, inquiryId, "Type a message or attach an image before sending.", "error", 400)
  }

  if (!(await canCustomerAccessInquiry(inquiryId, sessionUser.id))) {
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
    senderUserId: sessionUser.id,
    senderRole: "CLIENT",
    body: body || null,
    attachments,
  })

  revalidatePath("/account/status")
  revalidatePath("/sales")
  revalidatePath(`/sales/orders/${inquiryId}`)

  if (wantsJson(request)) {
    return NextResponse.json({
      message: "Message sent to sales.",
      tone: "success",
      chatMessage: {
        id: messageId,
        inquiryId,
        senderUserId: sessionUser.id,
        senderRole: "CLIENT",
        senderName: sessionUser.name,
        body: body || null,
        createdAt: new Date().toISOString(),
        attachments: attachments.map((attachment, index) => ({
          id: `${messageId}-${index}`,
          ...attachment,
        })),
      },
    })
  }

  return buildRedirect(request, inquiryId, "Message sent to sales.", "success")
}
