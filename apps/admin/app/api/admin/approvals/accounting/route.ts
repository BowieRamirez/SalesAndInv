import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import {
  formatAccountingPaymentMethod,
  isAccountingPaymentMethod,
} from "@/lib/accounting-payment-methods"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import type { InquiryPaymentStatus } from "@/lib/inquiries"
import { updateInquiryWorkflowStatus } from "@/lib/inquiries"

type ReservationMaterialRow = {
  stockItemId: string
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
    })

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
        pm."stockItemId",
        si.sku,
        si."itemName",
        si."availableQty",
        CEIL(pm."quantityRequired")::int AS "quantityRequired"
      FROM public.product_materials pm
      INNER JOIN public.stock_items si
        ON si.id = pm."stockItemId"
      WHERE pm."productId" = ${inquiry.productId}
        AND COALESCE(pm."quantityRequired", 0) > 0
      ORDER BY si."itemName" ASC
    `)

    if (reservationMaterials.length === 0) {
      throw new Error(`No material requirements are configured for ${inquiry.product.name}.`)
    }

    const existingReservations = await prisma.$queryRaw<Array<{ count: number }>>(Prisma.sql`
      SELECT COUNT(*)::int AS count
      FROM public.stock_movements
      WHERE "referenceNumber" = ${inquiryId}
        AND "projectPurpose" = 'Reserved for Build Order'
        AND type = 'ADJUSTMENT'::"StockMovementType"
    `)
    const alreadyReserved = (existingReservations[0]?.count ?? 0) > 0

    if (!alreadyReserved) {
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
    })

    if (updatedRows > 0 && !alreadyReserved) {
      try {
        await prisma.$transaction(async (tx) => {
          for (const material of reservationMaterials) {
            const required = material.quantityRequired
            if (required <= 0) continue

            const affectedRows = await tx.$executeRaw(Prisma.sql`
              UPDATE public.stock_items
              SET "availableQty" = "availableQty" - ${required},
                  "reservedQty" = "reservedQty" + ${required},
                  "updatedAt" = CURRENT_TIMESTAMP
              WHERE id = ${material.stockItemId}
                AND "availableQty" >= ${required}
            `)

            if (affectedRows === 0) {
              throw new Error(`Insufficient stock to reserve ${material.itemName}.`)
            }

            await tx.$executeRaw(Prisma.sql`
              INSERT INTO public.stock_movements (id, "stockItemId", type, quantity, "requesterName", "projectPurpose", "referenceNumber", "createdAt")
              VALUES (
                gen_random_uuid(),
                ${material.stockItemId},
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
                ${material.stockItemId},
                ${JSON.stringify({
                  auditLabel: "RAW_MATERIAL_STOCK_RESERVED",
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
