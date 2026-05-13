import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import { updateInquiryWorkflowStatus } from "@/lib/inquiries"

type BuildMaterialRow = {
  stockItemId: string
  sku: string
  itemName: string
  availableQty: number
  reservedQty: number
  quantityRequired: number
}

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
        product: true,
      },
    })

    if (!inquiry || inquiry.status !== "GETTING_READY_FOR_BUILDING") {
      throw new Error("Order not found or no longer in the building queue.")
    }

    const buildMaterials = await prisma.$queryRaw<BuildMaterialRow[]>(Prisma.sql`
      SELECT
        pm."stockItemId",
        si.sku,
        si."itemName",
        si."availableQty",
        si."reservedQty",
        CEIL(pm."quantityRequired")::int AS "quantityRequired"
      FROM public.product_materials pm
      INNER JOIN public.stock_items si
        ON si.id = pm."stockItemId"
      WHERE pm."productId" = ${inquiry.productId}
        AND COALESCE(pm."quantityRequired", 0) > 0
      ORDER BY si."itemName" ASC
    `)

    if (buildMaterials.length === 0) {
      throw new Error(`No material requirements are configured for ${inquiry.product.name}.`)
    }

    // Check inventory availability before proceeding
    for (const material of buildMaterials) {
      const required = material.quantityRequired
      if (required <= 0) continue

      if (material.reservedQty < required && material.availableQty < required) {
        throw new Error(
          `Insufficient stock for material ${material.itemName}. Need ${required}, have ${material.availableQty} available and ${material.reservedQty} reserved.`
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
        const existingBuildMovements = await tx.$queryRaw<Array<{ count: number }>>(Prisma.sql`
          SELECT COUNT(*)::int AS count
          FROM public.stock_movements
          WHERE "referenceNumber" = ${inquiryId}
            AND "projectPurpose" = 'Build Order'
            AND type = 'OUT'::"StockMovementType"
        `)

        if ((existingBuildMovements[0]?.count ?? 0) > 0) {
          return
        }

        for (const material of buildMaterials) {
          const required = material.quantityRequired
          if (required <= 0) continue

          const affectedRows =
            material.reservedQty >= required
              ? await tx.$executeRaw(Prisma.sql`
                  UPDATE public.stock_items
                  SET "reservedQty" = "reservedQty" - ${required},
                      "updatedAt" = CURRENT_TIMESTAMP
                  WHERE id = ${material.stockItemId}
                    AND "reservedQty" >= ${required}
                `)
              : await tx.$executeRaw(Prisma.sql`
                  UPDATE public.stock_items
                  SET "availableQty" = "availableQty" - ${required},
                      "updatedAt" = CURRENT_TIMESTAMP
                  WHERE id = ${material.stockItemId}
                    AND "availableQty" >= ${required}
                `)

          if (affectedRows === 0) {
            throw new Error(`Insufficient stock for material ${material.itemName}.`)
          }

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
              ${material.stockItemId},
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
              ${material.stockItemId},
              ${JSON.stringify({
                auditLabel: "RAW_MATERIAL_STOCK_REMOVED",
                sku: material.sku,
                itemName: material.itemName,
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
