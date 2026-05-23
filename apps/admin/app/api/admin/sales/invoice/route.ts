import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
// jsPDF is a CommonJS module — import via require to avoid ESM issues in Next.js API routes
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { jsPDF } = require("jspdf")
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("jspdf-autotable")

const VAT_RATE = 0.12

function peso(v: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v)
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })
}

export async function GET(request: Request) {
  const currentUser = await getAuthenticatedAppUser()
  if (!currentUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
  if (!["SALES", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const inquiryId = searchParams.get("inquiryId")
  if (!inquiryId) {
    return NextResponse.json({ message: "inquiryId is required" }, { status: 400 })
  }

  // Fetch inquiry + product + customer data
  const rows = await prisma.$queryRaw<Array<{
    inquiryNumber: string | null
    customerName: string
    customerEmail: string
    customerPhone: string
    productName: string
    quotedPrice: string | null
    quotedPriceBeforeDiscount: string | null
    quotationDiscount: string | null
    quotationRevisionCount: number
    statusNote: string | null
  }>>(Prisma.sql`
    SELECT
      ci."inquiryNumber",
      ci."customerName",
      ci."customerEmail",
      ci."customerPhone",
      p.name AS "productName",
      ci."quotedPrice"::text AS "quotedPrice",
      ci."quotedPriceBeforeDiscount"::text AS "quotedPriceBeforeDiscount",
      COALESCE(ci."quotationDiscount", 0)::text AS "quotationDiscount",
      COALESCE(ci."quotationRevisionCount", 0)::int AS "quotationRevisionCount",
      ci."statusNote"
    FROM public.customer_inquiries ci
    INNER JOIN public.products p ON p.id = ci."productId"
    WHERE ci.id = ${inquiryId}
    LIMIT 1
  `)

  const row = rows[0]
  if (!row) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 })
  }

  // Fetch materials
  const materials = await prisma.$queryRaw<Array<{
    itemName: string
    sku: string
    quantityDisplay: string | null
    unitOfMeasure: string
  }>>(Prisma.sql`
    SELECT
      ms."itemName",
      ms.sku,
      pm."quantityDisplay",
      ms."unitOfMeasure"
    FROM public.customer_inquiries ci
    INNER JOIN public.products p ON p.id = ci."productId"
    INNER JOIN public.product_materials pm ON pm."productId" = p.id
    INNER JOIN public.material_stocks ms ON ms.id = pm."materialStockId"
    WHERE ci.id = ${inquiryId}
    ORDER BY ms."itemName" ASC
  `)

  // Pricing
  const quotedPrice = Number(row.quotedPrice ?? 0)
  const priceBeforeDiscount = row.quotedPriceBeforeDiscount != null ? Number(row.quotedPriceBeforeDiscount) : null
  const discountAmount = Number(row.quotationDiscount ?? 0)
  const hasDiscount = discountAmount > 0 && priceBeforeDiscount != null
  const discountPct = hasDiscount ? ((discountAmount / priceBeforeDiscount!) * 100).toFixed(1) : null
  const vatAmount = quotedPrice * VAT_RATE
  const totalWithVat = quotedPrice + vatAmount
  const downPayment = totalWithVat * 0.7
  const balance = totalWithVat * 0.3

  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
  const issuedAt = new Date()

  // ── Build PDF with jsPDF ──────────────────────────────────────────────────
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 18

  // Header background strip
  doc.setFillColor(26, 26, 46)
  doc.rect(0, 0, pageW, 28, "F")

  // Company name
  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.setTextColor(255, 255, 255)
  doc.text("FurniTrack", margin, 12)

  // Tagline
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(180, 180, 200)
  doc.text("Queens Arts and Trends Corp.", margin, 18)
  doc.text("001B Carlos cor Dizon St, San Bartolome, Novaliches, QC  |  0906 015 5922", margin, 23)

  // INVOICE label (right)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(20)
  doc.setTextColor(255, 255, 255)
  doc.text("INVOICE", pageW - margin, 14, { align: "right" })

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(180, 180, 200)
  doc.text(invoiceNumber, pageW - margin, 20, { align: "right" })
  doc.text(`Date: ${formatDate(issuedAt)}`, pageW - margin, 25, { align: "right" })

  // Reset text color
  doc.setTextColor(17, 24, 39)

  // Bill To + Invoice meta
  let y = 38
  doc.setFont("helvetica", "bold")
  doc.setFontSize(7)
  doc.setTextColor(148, 163, 184)
  doc.text("BILL TO", margin, y)
  doc.text("INVOICE DETAILS", pageW / 2 + 4, y)

  y += 5
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.setTextColor(17, 24, 39)
  doc.text(row.customerName, margin, y)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(75, 85, 99)
  doc.text(row.customerEmail, margin, y + 5)
  doc.text(row.customerPhone, margin, y + 10)

  // Right column meta
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(75, 85, 99)
  if (row.inquiryNumber) {
    doc.text(`Order No: ${row.inquiryNumber}`, pageW / 2 + 4, y)
    doc.text(`Invoice No: ${invoiceNumber}`, pageW / 2 + 4, y + 5)
    doc.text(`Issued: ${formatDate(issuedAt)}`, pageW / 2 + 4, y + 10)
  } else {
    doc.text(`Invoice No: ${invoiceNumber}`, pageW / 2 + 4, y)
    doc.text(`Issued: ${formatDate(issuedAt)}`, pageW / 2 + 4, y + 5)
  }
  if (row.quotationRevisionCount > 0) {
    doc.text(`Quotation Revision: #${row.quotationRevisionCount}`, pageW / 2 + 4, y + 15)
  }

  // Quotation accepted badge
  doc.setFillColor(240, 253, 244)
  doc.setDrawColor(134, 239, 172)
  doc.roundedRect(pageW - margin - 42, y - 2, 42, 8, 2, 2, "FD")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(7)
  doc.setTextColor(22, 101, 52)
  doc.text("QUOTATION ACCEPTED", pageW - margin - 21, y + 3.5, { align: "center" })

  y += 22

  // Divider
  doc.setDrawColor(229, 231, 235)
  doc.line(margin, y, pageW - margin, y)
  y += 6

  // Items table
  const tableBody: (string | number)[][] = []

  // Product row
  tableBody.push([
    row.productName + "\n(Finished product)",
    "—",
    "1",
    "pcs",
    peso(hasDiscount ? priceBeforeDiscount! : quotedPrice),
    peso(hasDiscount ? priceBeforeDiscount! : quotedPrice),
  ])

  // Material rows
  for (const mat of materials) {
    tableBody.push([
      mat.itemName,
      mat.sku,
      mat.quantityDisplay ?? "—",
      mat.unitOfMeasure,
      "—",
      "—",
    ])
  }

  ;(doc as any).autoTable({
    startY: y,
    head: [["Item / Material", "SKU", "Qty / Spec", "Unit", "Unit Price", "Amount"]],
    body: tableBody,
    margin: { left: margin, right: margin },
    styles: { fontSize: 8.5, cellPadding: 3, textColor: [55, 65, 81] },
    headStyles: {
      fillColor: [248, 250, 252],
      textColor: [100, 116, 139],
      fontStyle: "bold",
      fontSize: 7.5,
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 28 },
      2: { cellWidth: 30 },
      3: { cellWidth: 18 },
      4: { cellWidth: 28, halign: "right" },
      5: { cellWidth: 28, halign: "right" },
    },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    didParseCell: (data: any) => {
      if (data.row.index === 0) {
        data.cell.styles.fontStyle = "bold"
        data.cell.styles.fillColor = [248, 250, 252]
      }
    },
  })

  y = (doc as any).lastAutoTable.finalY + 8

  // Totals box (right-aligned)
  const totalsX = pageW - margin - 72
  const totalsW = 72

  doc.setFillColor(248, 250, 252)
  doc.setDrawColor(229, 231, 235)

  const totalsLines: { label: string; value: string; bold?: boolean; green?: boolean }[] = []
  if (hasDiscount) {
    totalsLines.push({ label: "Original price", value: peso(priceBeforeDiscount!) })
    totalsLines.push({ label: `Discount (${discountPct}%)`, value: `- ${peso(discountAmount)}`, green: true })
    totalsLines.push({ label: "Price after discount", value: peso(quotedPrice) })
  } else {
    totalsLines.push({ label: "Quoted price", value: peso(quotedPrice) })
  }
  totalsLines.push({ label: "VAT (12%)", value: peso(vatAmount) })
  totalsLines.push({ label: "Total (VAT inclusive)", value: peso(totalWithVat), bold: true })

  const lineH = 6
  const boxH = totalsLines.length * lineH + 6
  doc.roundedRect(totalsX, y, totalsW, boxH, 2, 2, "FD")

  let ty = y + 5
  for (const line of totalsLines) {
    if (line.bold) {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(9.5)
      doc.setTextColor(17, 24, 39)
      doc.line(totalsX + 3, ty - 3, totalsX + totalsW - 3, ty - 3)
    } else if (line.green) {
      doc.setFont("helvetica", "normal")
      doc.setFontSize(8.5)
      doc.setTextColor(22, 163, 74)
    } else {
      doc.setFont("helvetica", "normal")
      doc.setFontSize(8.5)
      doc.setTextColor(75, 85, 99)
    }
    doc.text(line.label, totalsX + 4, ty)
    doc.text(line.value, totalsX + totalsW - 3, ty, { align: "right" })
    ty += lineH
  }

  y += boxH + 10

  // Payment schedule box
  doc.setFillColor(248, 250, 252)
  doc.setDrawColor(229, 231, 235)
  doc.roundedRect(margin, y, pageW - margin * 2, 32, 2, 2, "FD")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(7.5)
  doc.setTextColor(100, 116, 139)
  doc.text("PAYMENT SCHEDULE", margin + 4, y + 6)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(75, 85, 99)
  doc.text("Down payment (70%) — due upon order confirmation:", margin + 4, y + 13)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(17, 24, 39)
  doc.text(peso(downPayment), pageW - margin - 4, y + 13, { align: "right" })

  doc.setFont("helvetica", "normal")
  doc.setTextColor(75, 85, 99)
  doc.text("Remaining balance (30%) — due before delivery:", margin + 4, y + 20)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(17, 24, 39)
  doc.text(peso(balance), pageW - margin - 4, y + 20, { align: "right" })

  doc.setFont("helvetica", "normal")
  doc.setFontSize(7.5)
  doc.setTextColor(148, 163, 184)
  doc.text("Payment methods: Cash, GCash, Bank Transfer, Cheque (payable to Queens Arts and Trends Corp.)", margin + 4, y + 27)

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 10
  doc.setDrawColor(229, 231, 235)
  doc.line(margin, footerY - 4, pageW - margin, footerY - 4)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7.5)
  doc.setTextColor(156, 163, 175)
  doc.text("FurniTrack — Queens Arts and Trends Corp.", margin, footerY)
  doc.text(`${invoiceNumber}  ·  ${formatDate(issuedAt)}`, pageW - margin, footerY, { align: "right" })

  // Output as buffer
  const pdfBuffer = Buffer.from(doc.output("arraybuffer") as ArrayBuffer)
  const fileName = `Invoice-${invoiceNumber}.pdf`

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": String(pdfBuffer.length),
    },
  })
}
