import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma, logAudit } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import { parseDecimal, splitLines } from "@/lib/operations-products"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/operations", request.url)
  url.searchParams.set("tab", "finished-products")
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser || !["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
    return buildRedirect(request, "Only operations or executive admins can request product edits.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin
  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const productId = String(formData.get("productId") ?? "").trim()
  const productStockId = String(formData.get("productStockId") ?? "").trim()
  const name = String(formData.get("name") ?? "").trim()
  const category = String(formData.get("category") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const imageUrl = String(formData.get("imageUrl") ?? "").trim()
  const warehouseId = String(formData.get("warehouseId") ?? "").trim()
  const badge = String(formData.get("badge") ?? "").trim() || null
  const price = parseDecimal(formData.get("price"))
  const isPublished = String(formData.get("isPublished") ?? "").trim() === "on"

  if (!productId || !productStockId || !name || !category || !description) {
    return buildRedirect(request, "Provide the product name, category, and description.", "error")
  }

  if (!Number.isFinite(price) || price < 0) {
    return buildRedirect(request, "Price must be zero or higher.", "error")
  }

  try {
    // Verify the product exists
    const existing = await prisma.$queryRaw<Array<{ id: string; name: string }>>(Prisma.sql`
      SELECT p.id, p.name
      FROM public.products p
      WHERE p.id = ${productId}
      LIMIT 1
    `)

    if (!existing[0]) {
      return buildRedirect(request, "Product not found.", "error")
    }

    // Cancel any existing pending request for this product from this user
    await prisma.$executeRaw(Prisma.sql`
      UPDATE public.product_edit_requests
      SET status = 'CANCELLED', "updatedAt" = CURRENT_TIMESTAMP
      WHERE "productId" = ${productId}
        AND "requestedById" = ${currentUser.id}
        AND status = 'PENDING'
    `)

    const imageUrls = splitLines(imageUrl)

    const payload = {
      productId,
      productStockId,
      name,
      category,
      description,
      imageUrls,
      warehouseId,
      badge,
      price,
      isPublished,
    }

    await prisma.$executeRaw(Prisma.sql`
      INSERT INTO public.product_edit_requests (
        id,
        "productId",
        "requestedById",
        status,
        payload,
        "createdAt",
        "updatedAt"
      )
      VALUES (
        gen_random_uuid()::text,
        ${productId},
        ${currentUser.id},
        'PENDING',
        ${JSON.stringify(payload)}::jsonb,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
    `)

    revalidatePath("/operations")
    revalidatePath("/approvals")

    await logAudit({
      actorId: currentUser.authUserId,
      action: "PRODUCT_UPDATED",
      entityType: "PRODUCT",
      entityId: productId,
      metadata: {
        auditLabel: "PRODUCT_EDIT_REQUESTED",
        name,
        category,
        price,
        submittedBy: currentUser.name,
      },
    })

    return buildRedirect(
      request,
      `Edit request for "${name}" submitted. Waiting for executive admin approval.`,
      "success",
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not submit the edit request."
    return buildRedirect(request, message, "error")
  }
}
