// Sales orders helper module.
//
// PURPOSE
// -------
// `sales_orders` and `sales_order_line_items` exist for the formal B2B / multi-line
// order workflow described in docs/minimized-role-business-system.md:
//
//     Lead -> Quotation -> SalesOrder -> StockRequest -> DesignRequest
//                                     -> PaymentRecord -> DeliverySchedule
//
// The active customer-facing flow today goes through `customer_inquiries`
// (single-product B2C orders from the storefront). Sales orders remain in the
// schema so that:
//
//   1. Existing dashboard read-side queries keep working
//      (apps/admin/lib/dashboard/executive.ts and operations page).
//   2. When a customer inquiry needs to be promoted to a formal multi-line order
//      with a company, addresses, discount, etc., we have a target structure
//      ready instead of overloading customer_inquiries further.
//
// This file provides:
//   - generateSalesOrderNumber(): atomic SO-YYYY-NNNNN generator backed by
//     public.sales_order_number_seq.
//   - convertInquiryToSalesOrder(): scaffolding for promoting a CustomerInquiry
//     into a formal SalesOrder + line item, with traceability link.
//
// IMPORTANT: convertInquiryToSalesOrder() is not wired into any UI yet. It exists
// so the conversion path is fully implemented and tested when you need it. Calling
// it requires an existing Company row, which the system does not create today.

import { Prisma } from "./generated/prisma"
import { prisma } from "./client"

/**
 * Generates the next human-readable sales order number using the DB sequence.
 * Returns e.g. "SO-2026-00001". Atomic and race-safe.
 */
export async function generateSalesOrderNumber(
  tx: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<string> {
  const rows = await tx.$queryRaw<Array<{ next_val: number }>>(Prisma.sql`
    SELECT nextval('public.sales_order_number_seq')::int AS next_val
  `)
  const nextSeq = rows[0]?.next_val ?? 1
  const yearStr = new Date().getFullYear().toString()
  return `SO-${yearStr}-${String(nextSeq).padStart(5, "0")}`
}

export type ConvertInquiryToSalesOrderParams = {
  inquiryId: string
  companyId: string
  createdById: string
  /**
   * The product to use as the single line item. Falls back to whatever product the
   * inquiry referenced.
   */
  unitPrice?: number
  quantity?: number
  /**
   * Optional billing/contact overrides. Defaults to the inquiry's customer fields.
   */
  clientContactName?: string
  clientContactEmail?: string | null
  clientContactPhone?: string | null
  projectAddress?: string | null
  deliveryAddress?: string | null
  requestedDeliveryAt?: Date | null
  discountAmount?: number
  vatAmount?: number
}

export type ConvertInquiryToSalesOrderResult = {
  salesOrderId: string
  soNumber: string
}

/**
 * Promotes a CustomerInquiry into a formal SalesOrder.
 *
 * This is the bridge between the B2C storefront flow (customer_inquiries) and
 * the B2B formal flow (sales_orders). Useful when an inquiry grows into a
 * larger contract that needs:
 *   - A company link
 *   - Multi-line items
 *   - Discounts and VAT split out
 *   - Distinct billing/delivery addresses
 *   - Quotation conversion semantics
 *
 * Constraints:
 *   - The inquiry must exist.
 *   - The provided company and creator must exist.
 *   - The inquiry's product price is used as the default line unitPrice if
 *     none is provided.
 *
 * The conversion writes:
 *   - One sales_orders row (status = DRAFT, link back via convertedFromInquiryId)
 *   - One sales_order_line_items row (single product from the inquiry)
 *   - One approval_history row (module = CUSTOMER_INQUIRY, action = SUBMITTED)
 *
 * It does not modify the inquiry's status; that decision belongs to the caller.
 */
export async function convertInquiryToSalesOrder(
  params: ConvertInquiryToSalesOrderParams,
): Promise<ConvertInquiryToSalesOrderResult> {
  const {
    inquiryId,
    companyId,
    createdById,
    unitPrice,
    quantity = 1,
    clientContactName,
    clientContactEmail,
    clientContactPhone,
    projectAddress,
    deliveryAddress,
    requestedDeliveryAt = null,
    discountAmount = 0,
    vatAmount = 0,
  } = params

  return prisma.$transaction(async (tx) => {
    // Load the inquiry + product info
    const inquiryRows = await tx.$queryRaw<
      Array<{
        id: string
        productId: string
        productName: string
        productPrice: Prisma.Decimal | number | string
        customerName: string
        customerEmail: string
        customerPhone: string
      }>
    >(Prisma.sql`
      SELECT
        ci.id,
        ci."productId",
        p.name AS "productName",
        p.price AS "productPrice",
        ci."customerName",
        ci."customerEmail",
        ci."customerPhone"
      FROM public.customer_inquiries ci
      INNER JOIN public.products p ON p.id = ci."productId"
      WHERE ci.id = ${inquiryId}
      LIMIT 1
    `)

    const inquiry = inquiryRows[0]
    if (!inquiry) {
      throw new Error(`Inquiry ${inquiryId} not found.`)
    }

    // Load the company (for companyCodeSnapshot)
    const companyRows = await tx.$queryRaw<Array<{ code: string }>>(Prisma.sql`
      SELECT code FROM public.companies WHERE id = ${companyId} LIMIT 1
    `)
    const company = companyRows[0]
    if (!company) {
      throw new Error(`Company ${companyId} not found.`)
    }

    const resolvedUnitPrice =
      unitPrice != null ? unitPrice : Number(inquiry.productPrice ?? 0)
    const lineTotal = resolvedUnitPrice * quantity
    const subtotal = lineTotal
    const total = Math.max(0, subtotal - discountAmount + vatAmount)

    const soNumber = await generateSalesOrderNumber(tx)

    // Insert sales order
    const salesOrderId = (await tx.$queryRaw<Array<{ id: string }>>(Prisma.sql`
      INSERT INTO public.sales_orders (
        id,
        "soNumber",
        "convertedFromInquiryId",
        "companyId",
        "createdById",
        "orderType",
        status,
        "inventoryStatus",
        "designStatus",
        "accountingStatus",
        "deliveryStatus",
        "companyCodeSnapshot",
        "clientContactName",
        "clientContactEmail",
        "clientContactPhone",
        "projectAddress",
        "deliveryAddress",
        "requestedDeliveryAt",
        subtotal,
        "discountAmount",
        "vatAmount",
        total,
        "createdAt",
        "updatedAt"
      )
      VALUES (
        gen_random_uuid()::text,
        ${soNumber},
        ${inquiryId},
        ${companyId},
        ${createdById},
        'CUSTOMIZED'::"OrderType",
        'DRAFT'::"SalesOrderStatus",
        'NOT_REQUIRED'::"InventoryRequestStatus",
        'NOT_REQUIRED'::"DesignRequestStatus",
        'PENDING_REVIEW'::"AccountingStatus",
        'BLOCKED'::"DeliveryStatus",
        ${company.code},
        ${clientContactName ?? inquiry.customerName},
        ${clientContactEmail ?? inquiry.customerEmail},
        ${clientContactPhone ?? inquiry.customerPhone},
        ${projectAddress ?? null},
        ${deliveryAddress ?? null},
        ${requestedDeliveryAt},
        ${subtotal},
        ${discountAmount},
        ${vatAmount},
        ${total},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING id
    `))[0]?.id

    if (!salesOrderId) {
      throw new Error("Failed to create sales order row.")
    }

    // Insert single line item from the inquiry's product
    await tx.$executeRaw(Prisma.sql`
      INSERT INTO public.sales_order_line_items (
        id,
        "salesOrderId",
        "itemCode",
        "productName",
        description,
        quantity,
        "unitPrice",
        "lineTotal"
      )
      VALUES (
        gen_random_uuid()::text,
        ${salesOrderId},
        ${inquiry.productId},
        ${inquiry.productName},
        NULL,
        ${quantity},
        ${resolvedUnitPrice},
        ${lineTotal}
      )
    `)

    // Approval history entry tying the conversion back to the inquiry
    await tx.$executeRaw(Prisma.sql`
      INSERT INTO public.approval_history (
        id,
        module,
        "recordId",
        action,
        "fromStatus",
        "toStatus",
        remarks,
        "actedById",
        "actedAt"
      )
      VALUES (
        gen_random_uuid()::text,
        'CUSTOMER_INQUIRY'::"ApprovalModule",
        ${inquiryId},
        'SUBMITTED'::"ApprovalAction",
        NULL,
        'CONVERTED_TO_SALES_ORDER',
        ${`Inquiry promoted to sales order ${soNumber}`},
        ${createdById},
        CURRENT_TIMESTAMP
      )
    `)

    return { salesOrderId, soNumber }
  })
}
