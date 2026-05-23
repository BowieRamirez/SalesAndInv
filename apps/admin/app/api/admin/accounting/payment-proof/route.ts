import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"

export async function GET(request: Request) {
  const currentUser = await getAuthenticatedAppUser()
  if (!currentUser) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  if (!["ACCOUNTING", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const inquiryId = searchParams.get("inquiryId")
  if (!inquiryId) return NextResponse.json({ message: "inquiryId required" }, { status: 400 })

  // Get the most recent RECEIPT attachment from chat messages for this inquiry
  // This is the proof of payment the customer uploaded
  const rows = await prisma.$queryRaw<Array<{
    id: string
    fileName: string
    mimeType: string
    dataUrl: string
    createdAt: Date
    senderName: string | null
  }>>(Prisma.sql`
    SELECT
      a.id,
      a.file_name AS "fileName",
      a.mime_type AS "mimeType",
      a.data_url AS "dataUrl",
      a.created_at AS "createdAt",
      u.name AS "senderName"
    FROM public.order_chat_attachments a
    INNER JOIN public.order_chat_messages m ON m.id = a.message_id
    LEFT JOIN public.users u ON u.id = m.sender_user_id
    WHERE m.inquiry_id = ${inquiryId}
      AND a.attachment_type = 'RECEIPT'
      AND a.mime_type LIKE 'image/%'
    ORDER BY a.created_at DESC
    LIMIT 5
  `)

  return NextResponse.json({ proofs: rows })
}
