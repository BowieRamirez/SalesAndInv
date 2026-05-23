import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer"

const VAT_RATE = 0.12

function formatPeso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 52,
    backgroundColor: "#ffffff",
    color: "#111827",
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  companyName: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    letterSpacing: 0.5,
  },
  companyTagline: {
    fontSize: 8,
    color: "#6b7280",
    marginTop: 3,
    letterSpacing: 0.3,
  },
  invoiceLabel: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    textAlign: "right",
  },
  invoiceNumber: {
    fontSize: 9,
    color: "#6b7280",
    textAlign: "right",
    marginTop: 4,
  },
  invoiceDate: {
    fontSize: 9,
    color: "#6b7280",
    textAlign: "right",
    marginTop: 2,
  },
  // Meta row
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
    gap: 16,
  },
  metaBlock: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  metaValue: {
    fontSize: 10,
    color: "#111827",
    lineHeight: 1.5,
  },
  metaValueBold: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  // Table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 0,
  },
  tableHeaderText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  colDescription: { flex: 3 },
  colQty: { flex: 1, textAlign: "center" },
  colUnit: { flex: 1.5, textAlign: "right" },
  colAmount: { flex: 1.5, textAlign: "right" },
  tableCell: {
    fontSize: 10,
    color: "#374151",
  },
  tableCellBold: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  // Totals
  totalsSection: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  totalsBox: {
    width: 260,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalsLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
  totalsValue: {
    fontSize: 10,
    color: "#374151",
  },
  totalsDivider: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginVertical: 6,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 10,
    borderRadius: 4,
    marginTop: 2,
  },
  grandTotalLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  grandTotalValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  // Payment terms
  paymentBox: {
    marginTop: 24,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 14,
  },
  paymentTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  paymentLabel: {
    fontSize: 9,
    color: "#6b7280",
  },
  paymentValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 32,
    left: 52,
    right: 52,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "#9ca3af",
  },
  // Status badge
  statusBadge: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  statusText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#166534",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  discountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  discountLabel: {
    fontSize: 10,
    color: "#16a34a",
  },
  discountValue: {
    fontSize: 10,
    color: "#16a34a",
  },
})

export type InvoiceData = {
  invoiceNumber: string
  inquiryNumber: string | null
  issuedAt: Date
  customerName: string
  customerEmail: string
  customerPhone: string
  productName: string
  quotedPriceBeforeDiscount: number | null
  quotationDiscount: number
  quotedPrice: number   // final price after discount
  revisionCount: number
  salesNote: string | null
}

function InvoiceDocument({ data }: { data: InvoiceData }) {
  const hasDiscount = data.quotationDiscount > 0 && data.quotedPriceBeforeDiscount != null
  const discountPct = hasDiscount
    ? ((data.quotationDiscount / data.quotedPriceBeforeDiscount!) * 100).toFixed(1)
    : null

  const vatAmount = data.quotedPrice * VAT_RATE
  const totalWithVat = data.quotedPrice + vatAmount
  const downPayment = totalWithVat * 0.7
  const balance = totalWithVat * 0.3

  return (
    <Document title={`Invoice ${data.invoiceNumber}`} author="FurniTrack" subject="Sales Invoice">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>FurniTrack</Text>
            <Text style={styles.companyTagline}>Queens Arts and Trends Corp.</Text>
            <Text style={styles.companyTagline}>001B Carlos cor Dizon St, San Bartolome, Novaliches, QC</Text>
            <Text style={styles.companyTagline}>Tel: 0906 015 5922  |  www.queensartsandtrends.com</Text>
          </View>
          <View>
            <Text style={styles.invoiceLabel}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{data.invoiceNumber}</Text>
            <Text style={styles.invoiceDate}>Date: {formatDate(data.issuedAt)}</Text>
            {data.inquiryNumber && (
              <Text style={styles.invoiceDate}>Order: {data.inquiryNumber}</Text>
            )}
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Quotation Accepted</Text>
            </View>
          </View>
        </View>

        {/* Bill To */}
        <View style={styles.metaRow}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Bill To</Text>
            <Text style={styles.metaValueBold}>{data.customerName}</Text>
            <Text style={styles.metaValue}>{data.customerEmail}</Text>
            <Text style={styles.metaValue}>{data.customerPhone}</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Payment Terms</Text>
            <Text style={styles.metaValue}>70% down payment upon order confirmation</Text>
            <Text style={styles.metaValue}>30% balance before delivery</Text>
          </View>
          {data.revisionCount > 0 && (
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Quotation</Text>
              <Text style={styles.metaValue}>Revision #{data.revisionCount}</Text>
            </View>
          )}
        </View>

        {/* Table header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.colDescription]}>Description</Text>
          <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
          <Text style={[styles.tableHeaderText, styles.colUnit]}>Unit Price</Text>
          <Text style={[styles.tableHeaderText, styles.colAmount]}>Amount</Text>
        </View>

        {/* Table row */}
        <View style={styles.tableRow}>
          <View style={styles.colDescription}>
            <Text style={styles.tableCellBold}>{data.productName}</Text>
            {data.salesNote ? (
              <Text style={[styles.tableCell, { color: "#6b7280", marginTop: 3 }]}>{data.salesNote}</Text>
            ) : null}
          </View>
          <Text style={[styles.tableCell, styles.colQty]}>1</Text>
          <Text style={[styles.tableCell, styles.colUnit]}>
            {hasDiscount ? formatPeso(data.quotedPriceBeforeDiscount!) : formatPeso(data.quotedPrice)}
          </Text>
          <Text style={[styles.tableCell, styles.colAmount]}>
            {hasDiscount ? formatPeso(data.quotedPriceBeforeDiscount!) : formatPeso(data.quotedPrice)}
          </Text>
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            {hasDiscount && (
              <>
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>Subtotal</Text>
                  <Text style={styles.totalsValue}>{formatPeso(data.quotedPriceBeforeDiscount!)}</Text>
                </View>
                <View style={styles.discountRow}>
                  <Text style={styles.discountLabel}>Discount ({discountPct}%)</Text>
                  <Text style={styles.discountValue}>- {formatPeso(data.quotationDiscount)}</Text>
                </View>
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>Price after discount</Text>
                  <Text style={styles.totalsValue}>{formatPeso(data.quotedPrice)}</Text>
                </View>
              </>
            )}
            {!hasDiscount && (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Subtotal</Text>
                <Text style={styles.totalsValue}>{formatPeso(data.quotedPrice)}</Text>
              </View>
            )}
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>VAT (12%)</Text>
              <Text style={styles.totalsValue}>{formatPeso(vatAmount)}</Text>
            </View>
            <View style={styles.totalsDivider} />
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total (VAT Inclusive)</Text>
              <Text style={styles.grandTotalValue}>{formatPeso(totalWithVat)}</Text>
            </View>
          </View>
        </View>

        {/* Payment schedule */}
        <View style={styles.paymentBox}>
          <Text style={styles.paymentTitle}>Payment Schedule</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Down payment (70%) — due upon order confirmation</Text>
            <Text style={styles.paymentValue}>{formatPeso(downPayment)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Remaining balance (30%) — due before delivery</Text>
            <Text style={styles.paymentValue}>{formatPeso(balance)}</Text>
          </View>
          <View style={[styles.paymentRow, { marginTop: 6, borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingTop: 6 }]}>
            <Text style={[styles.paymentLabel, { fontFamily: "Helvetica-Bold", color: "#374151" }]}>Total</Text>
            <Text style={[styles.paymentValue, { fontSize: 10 }]}>{formatPeso(totalWithVat)}</Text>
          </View>
          <Text style={[styles.paymentLabel, { marginTop: 8, fontSize: 8 }]}>
            Payment methods: Cash, GCash, Bank Transfer, Cheque (payable to Queens Arts and Trends Corp.)
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>FurniTrack — Queens Arts and Trends Corp.</Text>
          <Text style={styles.footerText}>{data.invoiceNumber} · {formatDate(data.issuedAt)}</Text>
        </View>
      </Page>
    </Document>
  )
}

export async function generateInvoicePdf(data: InvoiceData): Promise<Buffer> {
  const buffer = await renderToBuffer(<InvoiceDocument data={data} />)
  return Buffer.from(buffer)
}
