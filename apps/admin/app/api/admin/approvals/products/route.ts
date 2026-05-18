import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma, logAudit } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import { generateUniqueProductSlug } from "@/lib/operations-products"

type EditRequestRow = {
  id: string
  productId: string
  productName: string
  requestedByName: string
  requestedById: string
  status: string
  payload: unknown
  remarks: string | null
  createdAt: Date
}

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/approvals", request.url)
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

export async function GET() {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser || currentUser.role !== "ADMIN_MANAGEMENT") {
    return NextResponse.json({ error: "Only executive admins can view product edit requests." }, { status: 403 })
  }

  const rows = await prisma.$queryRaw<EditRequestRow[]>(Prisma.sql`
    SELECT
      per.id,
      per."productId",
      p.name AS "productName",
      u.name AS "requestedByName",
      per."requestedById",
      per.status,
      per.payload,
      per.remarks,
      per."createdAt"
    FROM public.product_edit_requests per
    INNER JOIN public.products p ON p.id = per."productId"
    INNER JOIN public.users u ON u.id = per."requestedById"
    WHERE per.status = 'PENDING'
    ORDER BY per."createdAt" ASC
  `)

  return NextResponse.json({ requests: rows })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser || currentUser.role !== "ADMIN_MANAGEMENT") {
    return buildRedirect(request, "Only executive admins can approve or reject product edits.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin
  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const editRequestId = String(formData.get("editRequestId") ?? "").trim()
  const action = String(formData.get("action") ?? "").trim() // "approve" | "reject"
  const remarks = String(formData.get("remarks") ?? "").trim() || null

  if (!editRequestId || !["approve", "reject"].includes(action)) {
    return buildRedirect(request, "Invalid request.", "error")
  }

  try {
    // Load the edit request
    const rows = await prisma.$queryRaw<EditRequestRow[]>(Prisma.sql`
      SELECT
        per.id,
        per."productId",
        p.name AS "productName",
        u.name AS "requestedByName",
        per."requestedById",
        per.status,
        per.payload,
        per.remarks,
        per."createdAt"
      FROM public.product_edit_requests per
      INNER JOIN public.products p ON p.id = per."productId"
      INNER JOIN public.users u ON u.id = per."requestedById"
      WHERE per.id = ${editRequestId}
        AND per.status = 'PENDING'
      LIMIT 1
    `)

    const editRequest = rows[0]

    if (!editRequest) {
      return buildRedirect(request, "Edit request not found or already processed.", "error")
    }

    if (action === "reject") {
      await prisma.$executeRaw(Prisma.sql`
        UPDATE public.product_edit_requests
        SET
          status = 'REJECTED',
          "reviewedById" = ${currentUser.id},
          remarks = ${remarks},
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${editRequestId}
      `)

      revalidatePath("/approvals")
      revalidatePath("/operations")

      await logAudit({
        actorId: currentUser.authUserId,
        action: "PRODUCT_UPDATED",
        entityType: "PRODUCT",
        entityId: editRequest.productId,
        metadata: {
          auditLabel: "PRODUCT_EDIT_REJECTED",
          name: editRequest.productName,
          remarks,
          reviewedBy: currentUser.name,
        },
      })

      return buildRedirect(request, `Edit request for "${editRequest.productName}" rejected.`, "success")
    }

    // APPROVE — apply the changes to the product
    const payload = editRequest.payload as Record<string, unknown>
    const name = String(payload.name ?? "").trim()
    const category = String(payload.category ?? "").trim()
    const description = String(payload.description ?? "").trim()
    const imageUrls = Array.isArray(payload.imageUrls) ? payload.imageUrls : []
    const badge = payload.badge ? String(payload.badge) : null
    const price = Number(payload.price ?? 0)
    const isPublished = Boolean(payload.isPublished)
    const productStockId = String(payload.productStockId ?? "")
    const warehouseId = String(payload.warehouseId ?? "")

    if (!name || !category || !description || !Number.isFinite(price)) {
      return buildRedirect(request, "Edit request payload is invalid.", "error")
    }

    const slug = await generateUniqueProductSlug(name, editRequest.productId)

    await prisma.$transaction(async (tx) => {
      // Update product
      await tx.$executeRaw(Prisma.sql`
        UPDATE public.products
        SET
          slug = ${slug},
          name = ${name},
          category = ${category},
          price = ${new Prisma.Decimal(price)},
          badge = ${badge},
          images = ${JSON.stringify(imageUrls)}::jsonb,
          description = ${description},
          "isPublished" = ${isPublished},
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${editRequest.productId}
      `)

      // Update product stock name
      await tx.$executeRaw(Prisma.sql`
        UPDATE public.product_stocks
        SET
          "itemName" = ${name},
          "warehouseId" = ${warehouseId},
          description = ${description},
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${productStockId}
      `)

      // Mark request as approved
      await tx.$executeRaw(Prisma.sql`
        UPDATE public.product_edit_requests
        SET
          status = 'APPROVED',
          "reviewedById" = ${currentUser.id},
          remarks = ${remarks},
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${editRequestId}
      `)
    })

    revalidatePath("/approvals")
    revalidatePath("/operations")
    revalidatePath("/shop")
    revalidatePath("/")

    await logAudit({
      actorId: currentUser.authUserId,
      action: "PRODUCT_UPDATED",
      entityType: "PRODUCT",
      entityId: editRequest.productId,
      metadata: {
        auditLabel: "PRODUCT_EDIT_APPROVED",
        name,
        category,
        price,
        isPublished,
        approvedBy: currentUser.name,
        requestedBy: editRequest.requestedByName,
      },
    })

    return buildRedirect(
      request,
      `Edit for "${name}" approved and applied to the storefront.`,
      "success",
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not process the edit request."
    return buildRedirect(request, message, "error")
  }
}
