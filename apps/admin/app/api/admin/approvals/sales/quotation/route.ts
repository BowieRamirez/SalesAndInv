import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { Prisma, prisma, logAudit } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/sales", request.url)
  url.searchParams.set("tab", "approvals")
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

const VAT_RATE = 0.12

function formatPeso(v: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 2 }).format(v)
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser) {
    return buildRedirect(request, "Your session could not be confirmed. Please sign in again.", "error")
  }

  if (!["SALES", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
    return buildRedirect(request, "Only sales or executive admins can send quotations.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin
  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const inquiryId = String(formData.get("inquiryId") ?? "")
  const quotedPriceRaw = String(formData.get("quotedPrice") ?? "")
  const discountRaw = String(formData.get("discountAmount") ?? "0")
  const salesNote = String(formData.get("salesNote") ?? "").trim()

  const quotedPriceBeforeDiscount = Number(quotedPriceRaw)
  const discountAmount = Math.max(0, Number(discountRaw) || 0)
  const finalPrice = Math.max(0, quotedPriceBeforeDiscount - discountAmount)

  if (!Number.isFinite(quotedPriceBeforeDiscount) || quotedPriceBeforeDiscount <= 0) {
    return buildRedirect(request, "Please enter a valid quoted price.", "error")
  }
  if (finalPrice <= 0) {
    return buildRedirect(request, "Discount cannot exceed the quoted price.", "error")
  }

  try {
    // Fetch product info for the quotation chat message
    const rows = await prisma.$queryRaw<Array<{
      productName: string
      basePrice: string
      customerName: string
    }>>(Prisma.sql`
      SELECT p.name AS "productName", p.price::text AS "basePrice", ci."customerName"
      FROM public.customer_inquiries ci
      INNER JOIN public.products p ON p.id = ci."productId"
      WHERE ci.id = ${inquiryId}
      LIMIT 1
    `)

    if (!rows[0]) {
      return buildRedirect(request, "Order not found.", "error")
    }

    const { productName, customerName } = rows[0]
    const vatAmount = finalPrice * VAT_RATE
    const totalWithVat = finalPrice + vatAmount
    const downPayment = totalWithVat * 0.7
    const balance = totalWithVat * 0.3

    // Check if this is a revision (customer previously declined)
    const revisionRows = await prisma.$queryRaw<Array<{
      quotationAccepted: boolean | null
      revisionCount: number
      declineReason: string | null
    }>>(Prisma.sql`
      SELECT "quotationAccepted", "quotationRevisionCount" AS "revisionCount", "quotationDeclineReason" AS "declineReason"
      FROM public.customer_inquiries WHERE id = ${inquiryId} LIMIT 1
    `)
    const isRevision = revisionRows[0]?.quotationAccepted === false
    const revisionCount = (revisionRows[0]?.revisionCount ?? 0) + (isRevision ? 1 : 0)

    // Build the quotation chat message
    const revisionLabel = isRevision ? ` (Revision #${revisionCount})` : ""
    const discountLine = discountAmount > 0 ? `Discount: - ${formatPeso(discountAmount)}` : null
    const quotationMsg = [
      `📋 SALES QUOTATION${revisionLabel}`,
      "─────────────────────────────",
      `Product: ${productName}`,
      `Quoted price: ${formatPeso(quotedPriceBeforeDiscount)}`,
      discountLine,
      discountAmount > 0 ? `Price after discount: ${formatPeso(finalPrice)}` : null,
      `VAT (12%): ${formatPeso(vatAmount)}`,
      "─────────────────────────────",
      `Total (VAT inclusive): ${formatPeso(totalWithVat)}`,
      "",
      `Down payment (70%): ${formatPeso(downPayment)}`,
      `Remaining balance (30%): ${formatPeso(balance)}`,
      "",
      salesNote ? `Sales note: ${salesNote}` : null,
      "",
      "Please review this quotation and respond with Accept or Decline in your order status page.",
    ].filter((line): line is string => line != null).join("\n").trim()

    // Update quotedPrice (final after discount), quotedPriceBeforeDiscount, quotationDiscount
    // clear decline state, increment revision count
    await prisma.$executeRaw(Prisma.sql`
      UPDATE public.customer_inquiries
      SET
        "quotedPrice" = ${finalPrice}::numeric,
        "quotedPriceBeforeDiscount" = ${quotedPriceBeforeDiscount}::numeric,
        "quotationDiscount" = ${discountAmount}::numeric,
        "quotationAccepted" = NULL,
        "quotationRespondedAt" = NULL,
        "quotationDeclineReason" = NULL,
        "quotationRevisionCount" = ${revisionCount},
        "quotationSentAt" = CURRENT_TIMESTAMP,
        "statusNote" = ${salesNote || "Sales quotation sent. Awaiting customer response."},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${inquiryId}
        AND status = 'PENDING_SALES_QUOTATION'::"InquiryStatus"
    `)

    const updatedRows = 1 // we already verified the row exists above

    // ── Save quotation record to quotations table ─────────────────────────────
    const quotationNumber = `QUO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    await prisma.$executeRaw(Prisma.sql`
      INSERT INTO public.quotations (
        id,
        "inquiryId",
        "quotationNumber",
        "revisionNumber",
        "sentById",
        "quotedPrice",
        "quotedPriceBeforeDiscount",
        "quotationDiscount",
        "salesNote",
        "status",
        "sentAt",
        "createdAt",
        "updatedAt"
      ) VALUES (
        ${randomUUID()},
        ${inquiryId},
        ${quotationNumber},
        ${revisionCount},
        ${currentUser.id},
        ${finalPrice}::numeric,
        ${quotedPriceBeforeDiscount > 0 ? quotedPriceBeforeDiscount : null}::numeric,
        ${discountAmount}::numeric,
        ${salesNote || null},
        'PENDING',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
    `)

    // Send the quotation as a chat message
    await prisma.$executeRaw(Prisma.sql`
      INSERT INTO public.order_chat_messages (id, inquiry_id, sender_user_id, sender_role, body)
      VALUES (${randomUUID()}, ${inquiryId}, ${currentUser.id}, 'SALES', ${quotationMsg})
    `)

    await logAudit({
      actorId: currentUser.authUserId,
      action: "PAYMENT_UPDATED",
      entityType: "PAYMENT",
      entityId: inquiryId,
      metadata: {
        auditLabel: "Quotation Sent",
        customerName,
        quotedPrice: finalPrice.toString(),
        discount: discountAmount > 0 ? discountAmount.toString() : undefined,
      },
    })

    revalidatePath("/sales")
    revalidatePath("/account/status")

    return buildRedirect(request, `Quotation of ${formatPeso(totalWithVat)} sent to ${customerName}.`, "success")
  } catch (error) {
    console.error("Failed to send quotation.", error)
    return buildRedirect(request, "Failed to send quotation. Please try again.", "error")
  }
}
