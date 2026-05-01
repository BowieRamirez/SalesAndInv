import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import { updateInquiryWorkflowStatus } from "@/lib/inquiries"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/operations", request.url)
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

  if (!["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT"].includes(currentUser.role)) {
    return buildRedirect(request, "Only operations or executive admins can approve this step.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const inquiryId = String(formData.get("inquiryId") ?? "")
  const statusNote =
    String(formData.get("statusNote") ?? "").trim() ||
    "Operations approved the build stage and sent the order to delivery scheduling."

  try {
    const inquiry = await prisma.customerInquiry.findUnique({
      where: { id: inquiryId },
      include: {
        product: {
          include: {
            materials: {
              include: {
                stockItem: true,
              },
            },
          },
        },
      },
    })

    if (!inquiry || inquiry.status !== "GETTING_READY_FOR_BUILDING") {
      throw new Error("Order not found or no longer in the building queue.")
    }

    // Check inventory availability before proceeding
    for (const pm of inquiry.product.materials) {
      const required = Number(pm.quantityRequired ?? 0)
      if (required <= 0) continue

      if (pm.stockItem.availableQty < required) {
        throw new Error(
          `Insufficient stock for material ${pm.stockItem.itemName}. Need ${required}, have ${pm.stockItem.availableQty}.`
        )
      }
    }

    const updatedRows = await updateInquiryWorkflowStatus({
      inquiryId,
      expectedStages: ["GETTING_READY_FOR_BUILDING"],
      nextStage: "READY_FOR_SHIPPING",
      statusNote,
    })

    if (updatedRows === 0) {
      throw new Error("That order is no longer in the building queue.")
    }

    try {
      await prisma.$transaction(async (tx) => {
        for (const pm of inquiry.product.materials) {
          const required = Number(pm.quantityRequired ?? 0)
          if (required <= 0) continue

          await tx.$executeRaw(Prisma.sql`
            UPDATE public.stock_items
            SET "availableQty" = "availableQty" - ${required},
                "updatedAt" = CURRENT_TIMESTAMP
            WHERE id = ${pm.stockItemId}
          `)

          await tx.$executeRaw(Prisma.sql`
            INSERT INTO public.stock_movements (
              id,
              "stockItemId",
              type,
              quantity,
              "projectPurpose",
              "referenceNumber",
              "createdAt"
            )
            VALUES (
              gen_random_uuid(),
              ${pm.stockItemId},
              'OUT'::"StockMovementType",
              ${required},
              'Build Order',
              ${inquiryId},
              CURRENT_TIMESTAMP
            )
          `)

          await tx.$executeRaw(Prisma.sql`
            INSERT INTO public.audit_logs (
              id,
              "actorId",
              action,
              "entityType",
              "entityId",
              metadata,
              "createdAt"
            )
            VALUES (
              gen_random_uuid(),
              ${currentUser.id},
              'USER_UPDATED'::"AuditAction",
              'USER'::"AuditEntityType",
              ${pm.stockItemId},
              ${JSON.stringify({
                auditLabel: "RAW_MATERIAL_STOCK_REMOVED",
                sku: pm.stockItem.sku,
                itemName: pm.stockItem.itemName,
                quantity: required,
                referenceNumber: inquiryId,
                reason: "Build Order"
              })}::jsonb,
              CURRENT_TIMESTAMP
            )
          `)
        }
      })
    } catch (e) {
      // Rollback status update if inventory deduction fails
      await prisma.$executeRaw(Prisma.sql`
        UPDATE public.customer_inquiries 
        SET status = 'GETTING_READY_FOR_BUILDING'::"InquiryStatus" 
        WHERE id = ${inquiryId}
      `)
      throw new Error("Failed to deduct inventory for the order. Please try again.")
    }

    revalidatePath("/operations")
    revalidatePath("/sales")
    revalidatePath("/account/status")
    revalidatePath("/inventory")

    return buildRedirect(request, "Order approved for building and moved to delivery schedule. Stock was successfully deducted.", "success")
  } catch (error) {
    console.error("Failed to move order to shipping.", error)
    const message = error instanceof Error ? error.message : "Operations approval failed. Please try again."
    return buildRedirect(request, message, "error")
  }
}
