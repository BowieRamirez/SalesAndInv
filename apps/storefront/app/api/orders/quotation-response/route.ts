import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { Prisma, prisma } from "@furnitrack/db"
import { getStorefrontSessionUser } from "@/lib/auth/session"
import { generateInvoicePdf } from "@/lib/invoice-pdf"

export async function POST(request: Request) {
  const sessionUser = await getStorefrontSessionUser()
  if (!sessionUser) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 })
  }

  const body = await request.json().catch(() => ({})) as {
    inquiryId?: string
    accepted?: boolean
    note?: string
  }

  const { inquiryId, accepted, note } = body

  if (!inquiryId || typeof accepted !== "boolean") {
    return NextResponse.json({ message: "Missing required fields." }, { status: 400 })
  }

  // Verify the inquiry belongs to this customer and is in PENDING_SALES_QUOTATION
  const rows = await prisma.$queryRaw<Array<{
    id: string
    status: string
    inquiryNumber: string | null
    quotedPrice: string | null
    quotedPriceBeforeDiscount: string | null
    quotationDiscount: string | null
    quotationRevisionCount: number
    statusNote: string | null
    productName: string
  }>>(Prisma.sql`
    SELECT
      ci.id,
      ci.status::text AS status,
      ci."inquiryNumber",
      ci."quotedPrice"::text AS "quotedPrice",
      ci."quotedPriceBeforeDiscount"::text AS "quotedPriceBeforeDiscount",
      COALESCE(ci."quotationDiscount", 0)::text AS "quotationDiscount",
      COALESCE(ci."quotationRevisionCount", 0)::int AS "quotationRevisionCount",
      ci."statusNote",
      p.name AS "productName"
    FROM public.customer_inquiries ci
    INNER JOIN public.products p ON p.id = ci."productId"
    WHERE ci.id = ${inquiryId}
      AND ci."customerUserId" = ${sessionUser.id}
    LIMIT 1
  `)

  const inquiry = rows[0]
  if (!inquiry) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 })
  }

  if (inquiry.status !== "PENDING_SALES_QUOTATION") {
    return NextResponse.json({ message: "This order is not awaiting a quotation response." }, { status: 409 })
  }

  const responseNote = note?.trim() || null
  const chatBody = accepted
    ? `✅ Customer accepted the quotation${responseNote ? `: "${responseNote}"` : "."}`
    : `❌ Customer declined the quotation${responseNote ? `: "${responseNote}"` : "."}`

  if (accepted) {
    // Move to PENDING_ACCOUNTING_APPROVAL
    await prisma.$executeRaw(Prisma.sql`
      UPDATE public.customer_inquiries
      SET
        status = 'WAITING_FOR_PAYMENT'::"InquiryStatus",
        "quotationAccepted" = true,
        "quotationRespondedAt" = CURRENT_TIMESTAMP,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${inquiryId}
    `)
    // Mark the latest PENDING quotation as ACCEPTED
    await prisma.$executeRaw(Prisma.sql`
      UPDATE public.quotations
      SET
        status = 'ACCEPTED',
        "respondedAt" = CURRENT_TIMESTAMP,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = (
        SELECT id FROM public.quotations
        WHERE "inquiryId" = ${inquiryId}
          AND status = 'PENDING'
        ORDER BY "sentAt" DESC
        LIMIT 1
      )
    `)
  } else {
    // Stay in PENDING_SALES_QUOTATION — sales will revise the price
    await prisma.$executeRaw(Prisma.sql`
      UPDATE public.customer_inquiries
      SET
        "quotationAccepted" = false,
        "quotationRespondedAt" = CURRENT_TIMESTAMP,
        "quotationDeclineReason" = ${responseNote},
        "quotedPrice" = NULL,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${inquiryId}
    `)
    // Mark the latest PENDING quotation as DECLINED with reason
    await prisma.$executeRaw(Prisma.sql`
      UPDATE public.quotations
      SET
        status = 'DECLINED',
        "declineReason" = ${responseNote},
        "respondedAt" = CURRENT_TIMESTAMP,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = (
        SELECT id FROM public.quotations
        WHERE "inquiryId" = ${inquiryId}
          AND status = 'PENDING'
        ORDER BY "sentAt" DESC
        LIMIT 1
      )
    `)
  }

  // Send customer response chat message
  await prisma.$executeRaw(Prisma.sql`
    INSERT INTO public.order_chat_messages (id, inquiry_id, sender_user_id, sender_role, body)
    VALUES (${randomUUID()}, ${inquiryId}, ${sessionUser.id}, 'CLIENT', ${chatBody})
  `)

  if (accepted) {
    const quotedPrice = Number(inquiry.quotedPrice ?? 0)
    const quotedPriceBeforeDiscount = inquiry.quotedPriceBeforeDiscount != null
      ? Number(inquiry.quotedPriceBeforeDiscount)
      : null
    const quotationDiscount = Number(inquiry.quotationDiscount ?? 0)
    const vatAmount = quotedPrice * 0.12
    const total = quotedPrice + vatAmount

    const formatPeso = (v: number) =>
      new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 2 }).format(v)

    // Generate invoice number
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

    // ── Generate PDF invoice ──────────────────────────────────────────────────
    let pdfDataUrl: string | null = null
    try {
      const pdfBuffer = await generateInvoicePdf({
        invoiceNumber,
        inquiryNumber: inquiry.inquiryNumber,
        issuedAt: new Date(),
        customerName: sessionUser.name,
        customerEmail: sessionUser.email,
        customerPhone: "",
        productName: inquiry.productName,
        quotedPriceBeforeDiscount,
        quotationDiscount,
        quotedPrice,
        revisionCount: inquiry.quotationRevisionCount,
        salesNote: inquiry.statusNote
          ? inquiry.statusNote.replace(/\[\[.*?\]\]/g, "").trim() || null
          : null,
      })
      pdfDataUrl = `data:application/pdf;base64,${pdfBuffer.toString("base64")}`
    } catch (pdfError) {
      console.error("[invoice-pdf] Failed to generate PDF:", pdfError)
      // Non-fatal — we still proceed without the PDF
    }

    // ── Insert invoice chat message with PDF attachment ───────────────────────
    const invoiceMsgId = randomUUID()
    const invoiceBody = [
      `🧾 INVOICE — ${invoiceNumber}`,
      "─────────────────────────────",
      `Product: ${inquiry.productName}`,
      quotedPriceBeforeDiscount != null && quotationDiscount > 0
        ? `Original price: ${formatPeso(quotedPriceBeforeDiscount)}`
        : null,
      quotationDiscount > 0
        ? `Discount: - ${formatPeso(quotationDiscount)}`
        : null,
      `Quoted price: ${formatPeso(quotedPrice)}`,
      `VAT (12%): ${formatPeso(vatAmount)}`,
      "─────────────────────────────",
      `Total: ${formatPeso(total)}`,
      "",
      `Down payment (70%): ${formatPeso(total * 0.7)}`,
      `Remaining balance (30%): ${formatPeso(total * 0.3)}`,
      "",
      "Your invoice PDF is attached below. Please proceed with payment.",
    ].filter((l): l is string => l != null).join("\n")

    await prisma.$executeRaw(Prisma.sql`
      INSERT INTO public.order_chat_messages (id, inquiry_id, sender_user_id, sender_role, body)
      VALUES (${invoiceMsgId}, ${inquiryId}, NULL, 'SALES', ${invoiceBody})
    `)

    // Attach the PDF if generation succeeded
    if (pdfDataUrl) {
      const fileName = `Invoice-${invoiceNumber}.pdf`
      await prisma.$executeRaw(Prisma.sql`
        INSERT INTO public.order_chat_attachments (id, message_id, file_name, mime_type, attachment_type, data_url)
        VALUES (${randomUUID()}, ${invoiceMsgId}, ${fileName}, 'application/pdf', 'RECEIPT', ${pdfDataUrl})
      `)
    }

    // Order summary message
    const orderSummaryMsg = [
      "📋 ORDER SUMMARY",
      "─────────────────────────────",
      `Product: ${inquiry.productName}`,
      `Quoted price: ${formatPeso(quotedPrice)}`,
      `VAT (12%): ${formatPeso(vatAmount)}`,
      "─────────────────────────────",
      `Total: ${formatPeso(total)}`,
      "",
      "A 70% down payment is required to begin production.",
      `Down payment (70%): ${formatPeso(total * 0.7)}`,
      `Remaining balance (30%): ${formatPeso(total * 0.3)}`,
      "",
      "Please proceed with payment to get started.",
    ].join("\n")

    await prisma.$executeRaw(Prisma.sql`
      INSERT INTO public.order_chat_messages (id, inquiry_id, sender_user_id, sender_role, body)
      VALUES (${randomUUID()}, ${inquiryId}, NULL, 'SALES', ${orderSummaryMsg})
    `)
  }

  return NextResponse.json({
    ok: true,
    message: accepted
      ? "Quotation accepted! Your invoice has been sent to the chat."
      : "Quotation declined. Sales will be notified to revise the offer.",
  })
}
