import { randomUUID } from "node:crypto"
import { Prisma, prisma } from "@furnitrack/db"

export type OrderChatAttachmentInput = {
  fileName: string
  mimeType: string
  attachmentType: "IMAGE" | "DOCUMENT" | "QUOTATION" | "RECEIPT"
  dataUrl: string
}

export type OrderChatMessage = {
  id: string
  inquiryId: string
  senderUserId: string | null
  senderRole: "CLIENT" | "SALES"
  body: string | null
  createdAt: Date
  senderName: string | null
  attachments: Array<{
    id: string
    fileName: string
    mimeType: string
    attachmentType: "IMAGE" | "DOCUMENT" | "QUOTATION" | "RECEIPT"
    dataUrl: string
  }>
}

type MessageRow = {
  id: string
  inquiryId: string
  senderUserId: string | null
  senderRole: "CLIENT" | "SALES"
  body: string | null
  createdAt: Date
  senderName: string | null
}

type AttachmentRow = {
  id: string
  messageId: string
  fileName: string
  mimeType: string
  attachmentType: "IMAGE" | "DOCUMENT" | "QUOTATION" | "RECEIPT"
  dataUrl: string
}

export async function getOrderChatMessages(inquiryId: string): Promise<OrderChatMessage[]> {
  const messages = await prisma.$queryRaw<MessageRow[]>(Prisma.sql`
    SELECT
      m.id,
      m.inquiry_id AS "inquiryId",
      m.sender_user_id AS "senderUserId",
      m.sender_role AS "senderRole",
      m.body,
      m.created_at AS "createdAt",
      u.name AS "senderName"
    FROM public.order_chat_messages m
    LEFT JOIN public.users u ON u.id = m.sender_user_id
    WHERE m.inquiry_id = ${inquiryId}
    ORDER BY m.created_at ASC
  `)

  if (messages.length === 0) {
    return []
  }

  const attachments = await prisma.$queryRaw<AttachmentRow[]>(Prisma.sql`
    SELECT
      a.id,
      a.message_id AS "messageId",
      a.file_name AS "fileName",
      a.mime_type AS "mimeType",
      a.attachment_type AS "attachmentType",
      a.data_url AS "dataUrl"
    FROM public.order_chat_attachments a
    WHERE a.message_id IN (${Prisma.join(messages.map((message) => message.id))})
    ORDER BY a.created_at ASC
  `)

  return messages.map((message) => ({
    ...message,
    attachments: attachments
      .filter((attachment) => attachment.messageId === message.id)
      .map(({ messageId: _messageId, ...attachment }) => attachment),
  }))
}

export async function createOrderChatMessage(params: {
  inquiryId: string
  senderUserId: string
  senderRole: "CLIENT" | "SALES"
  body: string | null
  attachments: OrderChatAttachmentInput[]
}) {
  const messageId = randomUUID()

  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw(Prisma.sql`
      INSERT INTO public.order_chat_messages (id, inquiry_id, sender_user_id, sender_role, body)
      VALUES (${messageId}, ${params.inquiryId}, ${params.senderUserId}, ${params.senderRole}, ${params.body})
    `)

    for (const attachment of params.attachments) {
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO public.order_chat_attachments (id, message_id, file_name, mime_type, attachment_type, data_url)
        VALUES (${randomUUID()}, ${messageId}, ${attachment.fileName}, ${attachment.mimeType}, ${attachment.attachmentType}, ${attachment.dataUrl})
      `)
    }
  })

  return messageId
}

export async function canSalesAccessInquiry(inquiryId: string) {
  const rows = await prisma.$queryRaw<Array<{ id: string }>>(Prisma.sql`
    SELECT id FROM public.customer_inquiries WHERE id = ${inquiryId} LIMIT 1
  `)

  return rows.length > 0
}

export async function getUnreadChatInquiryIds() {
  const rows = await prisma.$queryRaw<Array<{ inquiry_id: string }>>(Prisma.sql`
    SELECT DISTINCT inquiry_id
    FROM (
      SELECT inquiry_id, sender_role,
        ROW_NUMBER() OVER(PARTITION BY inquiry_id ORDER BY created_at DESC) as rn
      FROM public.order_chat_messages
    ) AS latest
    WHERE rn = 1 AND sender_role = 'CLIENT'
  `)
  return new Set(rows.map((row) => row.inquiry_id))
}
