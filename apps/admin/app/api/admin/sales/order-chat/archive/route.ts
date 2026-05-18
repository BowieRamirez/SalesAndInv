import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma, logAudit } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 })
  }

  if (!["SALES", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
    return NextResponse.json({ error: "Only sales admins can archive order chats." }, { status: 403 })
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin
  if (requestOrigin && requestOrigin !== appOrigin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const inquiryId = typeof body?.inquiryId === "string" ? body.inquiryId.trim() : ""
  const action: "archive" | "delete" | "restore" = ["delete", "restore"].includes(body?.action)
    ? body.action
    : "archive"

  if (!inquiryId) {
    return NextResponse.json({ error: "inquiryId is required." }, { status: 400 })
  }

  // Verify the inquiry exists and pull metadata for audit
  const rows = await prisma.$queryRaw<
    Array<{ id: string; customerName: string; productName: string; status: string }>
  >(Prisma.sql`
    SELECT
      ci.id,
      ci."customerName",
      p.name AS "productName",
      ci.status::text AS status
    FROM public.customer_inquiries ci
    INNER JOIN public.products p ON p.id = ci."productId"
    WHERE ci.id = ${inquiryId}
    LIMIT 1
  `)

  const inquiry = rows[0]

  if (!inquiry) {
    return NextResponse.json({ error: "Order chat not found." }, { status: 404 })
  }

  if (action === "delete") {
    // Hard delete — cascade removes messages and attachments (FK ON DELETE CASCADE)
    await prisma.$executeRaw(Prisma.sql`
      DELETE FROM public.customer_inquiries WHERE id = ${inquiryId}
    `)

    await logAudit({
      actorId: currentUser.authUserId,
      action: "CHAT_MESSAGE_SENT",
      entityType: "CHAT",
      entityId: inquiryId,
      metadata: {
        auditLabel: "CHAT_DELETED",
        inquiryId,
        customerName: inquiry.customerName,
        productName: inquiry.productName,
        previousStatus: inquiry.status,
        deletedBy: currentUser.name,
      },
    })
  } else if (action === "restore") {
    await prisma.$executeRaw(Prisma.sql`
      UPDATE public.customer_inquiries
      SET
        "statusNote" = TRIM(REPLACE(REPLACE("statusNote", ' [[archived]]', ''), '[[archived]]', '')),
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${inquiryId}
    `)

    await logAudit({
      actorId: currentUser.authUserId,
      action: "CHAT_MESSAGE_SENT",
      entityType: "CHAT",
      entityId: inquiryId,
      metadata: {
        auditLabel: "CHAT_RESTORED",
        inquiryId,
        customerName: inquiry.customerName,
        productName: inquiry.productName,
        restoredBy: currentUser.name,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Order chat for "${inquiry.productName}" restored.`,
    })
  } else {
    // Archive — mark the inquiry status note so it's treated as archived
    await prisma.$executeRaw(Prisma.sql`
      UPDATE public.customer_inquiries
      SET
        "statusNote" = COALESCE("statusNote", '') || ' [[archived]]',
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${inquiryId}
        AND ("statusNote" IS NULL OR "statusNote" NOT LIKE '%[[archived]]%')
    `)

    await logAudit({
      actorId: currentUser.authUserId,
      action: "CHAT_MESSAGE_SENT",
      entityType: "CHAT",
      entityId: inquiryId,
      metadata: {
        auditLabel: "CHAT_ARCHIVED",
        inquiryId,
        customerName: inquiry.customerName,
        productName: inquiry.productName,
        previousStatus: inquiry.status,
        archivedBy: currentUser.name,
      },
    })
  }

  revalidatePath("/sales")

  return NextResponse.json({
    success: true,
    message: action === "delete"
      ? `Order chat for "${inquiry.productName}" deleted.`
      : `Order chat for "${inquiry.productName}" archived.`,
  })
}
