import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma, logAudit } from "@furnitrack/db"
import {
  formatAccountingPaymentMethod,
  isAccountingPaymentMethod,
} from "@/lib/accounting-payment-methods"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import type { InquiryPaymentStatus } from "@/lib/inquiries"
import { updateInquiryWorkflowStatus } from "@/lib/inquiries"

type ReservationMaterialRow = {
  materialStockId: string
  sku: string
  itemName: string
  availableQty: number
  quantityRequired: number
}

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/accounting", request.url)
  url.searchParams.set("tab", "approvals")
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser) {
    return buildRedirect(request, "Your session could not be confirmed. Please sign in again.", "error")
  }

  if (!["ACCOUNTING", "ADMIN_MANAGEMENT"].includes(currentUser.role)) {
    return buildRedirect(request, "Only accounting or executive admins can approve this step.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const inquiryId = String(formData.get("inquiryId") ?? "")
  const paymentMethodValue = String(formData.get("paymentMethod") ?? "").trim().toUpperCase()
  const paymentStatusValue = String(formData.get("paymentStatus") ?? "FULLY_PAID").trim().toUpperCase()
  const paidAmountValue = Number(formData.get("paidAmount") ?? 0)

  if (!isAccountingPaymentMethod(paymentMethodValue)) {
    return buildRedirect(request, "Select the customer's payment method before approving payment.", "error")
  }

  const allowedPaymentStatuses = new Set(["DOWN_PAYMENT", "PARTIALLY_PAID", "FULLY_PAID", "REJECTED"])

  if (!allowedPaymentStatuses.has(paymentStatusValue)) {
    return buildRedirect(request, "Select a valid payment status before approving payment.", "error")
  }

  if (
    (paymentStatusValue === "DOWN_PAYMENT" || paymentStatusValue === "PARTIALLY_PAID") &&
    (!Number.isFinite(paidAmountValue) || paidAmountValue <= 0)
  ) {
    return buildRedirect(request, "Enter the amount paid by the customer before approving this payment.", "error")
  }

  if (paymentStatusValue === "REJECTED") {
    const rawStatusNote = String(formData.get("statusNote") ?? "").trim()
    const updatedRows = await updateInquiryWorkflowStatus({
      inquiryId,
      expectedStages: ["PENDING_ACCOUNTING_APPROVAL"],
      nextStage: "PENDING_ACCOUNTING_APPROVAL",
      statusNote: rawStatusNote || "Accounting rejected this payment. Please request a corrected payment from the customer.",
      paymentMethod: paymentMethodValue,
      paymentStatus: "REJECTED",
      actorId: currentUser.id,
      actorRemarks: rawStatusNote || "Accounting rejected this payment.",
    })

    // Mark any pending payment_records for this inquiry as REJECTED
    await prisma.$executeRaw(Prisma.sql`
      UPDATE public.payment_records
      SET status = 'REJECTED'::"PaymentStatus",
          "verifiedAt" = CURRENT_TIMESTAMP,
          "verifiedById" = ${currentUser.id},
          "updatedAt" = CURRENT_TIMESTAMP
      WHERE "inquiryId" = ${inquiryId}
        AND status = 'PENDING'::"PaymentStatus"
    `)

    revalidatePath("/accounting")
    revalidatePath("/sales")
    revalidatePath("/account/status")

    return buildRedirect(
      request,
      updatedRows > 0 ? "Payment rejected and kept in accounting review." : "That order is no longer waiting on accounting.",
      updatedRows > 0 ? "success" : "error",
    )
  }

  const paymentMethodLabel = formatAccountingPaymentMethod(paymentMethodValue)
  const rawStatusNote = String(formData.get("statusNote") ?? "").trim()
  const statusNote =
    rawStatusNote ||
    `Accounting approved the ${paymentStatusValue.toLowerCase().replaceAll("_", " ")} via ${paymentMethodLabel} and released the order to operations for building.`

  try {
    const inquiry = await prisma.customerInquiry.findUnique({
      where: { id: inquiryId },
      include: { product: true },
    })

    if (!inquiry || inquiry.status !== "WAITING_FOR_PAYMENT") {
      throw new Error("That order is no longer waiting on accounting.")
    }

    const reservationMaterials = await prisma.$queryRaw<ReservationMaterialRow[]>(Prisma.sql`
      SELECT
        pm."materialStockId",
        si.sku,
        si."itemName",
        si."availableQty",
        CEIL(pm."quantityRequired")::int AS "quantityRequired"
      FROM public.product_materials pm
      INNER JOIN public.material_stocks si
        ON si.id = pm."materialStockId"
      WHERE pm."productId" = ${inquiry.productId}
        AND COALESCE(pm."quantityRequired", 0) > 0
      ORDER BY si."itemName" ASC
    `)

    // If no materials have quantities configured, skip stock reservation and proceed.
    // Materials that exist but have no quantityRequired are tracked by name only —
    // reservation will happen once quantities are set on the product.
    const hasQuantifiedMaterials = reservationMaterials.length > 0

    const existingReservations = await prisma.$queryRaw<Array<{ count: number }>>(Prisma.sql`
      SELECT COUNT(*)::int AS count
      FROM public.stock_movements
      WHERE "referenceNumber" = ${inquiryId}
        AND "projectPurpose" = 'Reserved for Build Order'
        AND type = 'ADJUSTMENT'::"StockMovementType"
    `)
    const alreadyReserved = (existingReservations[0]?.count ?? 0) > 0

    if (!alreadyReserved && hasQuantifiedMaterials) {
      for (const material of reservationMaterials) {
        if (material.availableQty < material.quantityRequired) {
          throw new Error(
            `Insufficient stock to reserve ${material.itemName}. Need ${material.quantityRequired}, have ${material.availableQty}.`
          )
        }
      }
    }

    const updatedRows = await updateInquiryWorkflowStatus({
      inquiryId,
      expectedStages: ["PENDING_ACCOUNTING_APPROVAL"],
      nextStage: "GETTING_READY_FOR_BUILDING",
      statusNote,
      paymentMethod: paymentMethodValue,
      paymentStatus: paymentStatusValue as InquiryPaymentStatus,
      paidAmount: paymentStatusValue === "FULLY_PAID" ? null : paidAmountValue,
      actorId: currentUser.id,
      actorRemarks: statusNote,
    })

    // Verify any pending payment_records for this inquiry — accounting just confirmed them
    // Recalculate remainingBalance using the VAT-inclusive quoted price
    if (updatedRows > 0) {
      const quotedPriceRows = await prisma.$queryRaw<Array<{ quotedPrice: string | null; productPrice: string }>>(Prisma.sql`
        SELECT ci."quotedPrice"::text AS "quotedPrice", p.price::text AS "productPrice"
        FROM public.customer_inquiries ci
        INNER JOIN public.products p ON p.id = ci."productId"
        WHERE ci.id = ${inquiryId} LIMIT 1
      `)
      const basePrice = quotedPriceRows[0]?.quotedPrice != null
        ? Number(quotedPriceRows[0].quotedPrice)
        : Number(quotedPriceRows[0]?.productPrice ?? 0)
      const totalWithVat = basePrice * 1.12

      await prisma.$executeRaw(Prisma.sql`
        UPDATE public.payment_records
        SET status = 'VERIFIED'::"PaymentStatus",
            "verifiedAt" = CURRENT_TIMESTAMP,
            "verifiedById" = ${currentUser.id},
            "paymentMethod" = COALESCE("paymentMethod", ${paymentMethodValue}),
            "remainingBalance" = GREATEST(0, ${totalWithVat}::numeric - amount),
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "inquiryId" = ${inquiryId}
          AND status = 'PENDING'::"PaymentStatus"
      `)
    }

    if (updatedRows > 0 && !alreadyReserved && hasQuantifiedMaterials) {
      try {
        await prisma.$transaction(async (tx) => {
          for (const material of reservationMaterials) {
            const required = material.quantityRequired
            if (required <= 0) continue

            const affectedRows = await tx.$executeRaw(Prisma.sql`
              UPDATE public.material_stocks
              SET "availableQty" = "availableQty" - ${required},
                  "reservedQty" = "reservedQty" + ${required},
                  "updatedAt" = CURRENT_TIMESTAMP
              WHERE id = ${material.materialStockId}
                AND "availableQty" >= ${required}
            `)

            if (affectedRows === 0) {
              throw new Error(`Insufficient stock to reserve ${material.itemName}.`)
            }

            await tx.$executeRaw(Prisma.sql`
              INSERT INTO public.stock_movements (id, "materialStockId", "stockItemId", type, quantity, "requesterName", "projectPurpose", "referenceNumber", "createdAt")
              VALUES (
                gen_random_uuid(),
                ${material.materialStockId},
                ${material.materialStockId},
                'ADJUSTMENT'::"StockMovementType",
                ${required},
                ${currentUser.name},
                'Reserved for Build Order',
                ${inquiryId},
                CURRENT_TIMESTAMP
              )
            `)

            await tx.$executeRaw(Prisma.sql`
              INSERT INTO public.audit_logs (id, "actorId", action, "entityType", "entityId", metadata, "createdAt")
              VALUES (
                gen_random_uuid(),
                ${currentUser.id},
                'USER_UPDATED'::"AuditAction",
                'USER'::"AuditEntityType",
                ${material.materialStockId},
                ${JSON.stringify({
                  auditLabel: "Stock reserved for order",
                  sku: material.sku,
                  itemName: material.itemName,
                  quantity: required,
                  referenceNumber: inquiryId,
                  reason: "Accounting payment approved",
                  paymentStatus: paymentStatusValue,
                })}::jsonb,
                CURRENT_TIMESTAMP
              )
            `)
          }
        })
      } catch (reservationError) {
        await prisma.$executeRaw(Prisma.sql`
          UPDATE public.customer_inquiries
          SET status = 'WAITING_FOR_PAYMENT'::"InquiryStatus",
              "statusNote" = ${inquiry.statusNote},
              "updatedAt" = CURRENT_TIMESTAMP
          WHERE id = ${inquiryId}
        `)
        throw reservationError
      }
    }

    if (updatedRows > 0) {
      await logAudit({
        actorId: currentUser.authUserId,
        action: "PAYMENT_ACCEPTED",
        entityType: "PAYMENT",
        entityId: inquiryId,
        metadata: {
          paymentMethod: paymentMethodLabel,
          paymentStatus: paymentStatusValue,
          paidAmount: paidAmountValue,
        },
      })
    }

    revalidatePath("/accounting")
    revalidatePath("/accounting/follow-ups")
    revalidatePath("/operations")
    revalidatePath("/inventory")
    revalidatePath("/sales")
    revalidatePath("/account/status")

    return buildRedirect(
      request,
      updatedRows > 0 ? "Payment approved and order released to operations." : "That order is no longer waiting on accounting.",
      updatedRows > 0 ? "success" : "error",
    )
  } catch (error) {
    console.error("Failed to approve accounting payment.", error)
    const message = error instanceof Error ? error.message : "Accounting approval failed. Please try again."
    return buildRedirect(request, message, "error")
  }
}
