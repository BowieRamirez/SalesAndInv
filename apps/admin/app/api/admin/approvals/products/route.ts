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

type ColorVariant = { name: string; hex: string; sku: string }

function diffColorVariants(before: ColorVariant[], after: ColorVariant[]) {
  const beforeBySku = new Map(before.map((v) => [v.sku.toLowerCase(), v]))
  const afterBySku = new Map(after.map((v) => [v.sku.toLowerCase(), v]))

  const added: ColorVariant[] = []
  const removed: ColorVariant[] = []
  const changed: Array<{ before: ColorVariant; after: ColorVariant }> = []

  for (const [sku, afterVariant] of afterBySku) {
    const beforeVariant = beforeBySku.get(sku)
    if (!beforeVariant) {
      added.push(afterVariant)
    } else if (
      beforeVariant.name !== afterVariant.name ||
      beforeVariant.hex.toLowerCase() !== afterVariant.hex.toLowerCase()
    ) {
      changed.push({ before: beforeVariant, after: afterVariant })
    }
  }

  for (const [sku, beforeVariant] of beforeBySku) {
    if (!afterBySku.has(sku)) {
      removed.push(beforeVariant)
    }
  }

  return { added, removed, changed }
}

function asColorVariants(value: unknown): ColorVariant[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((v) => {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const o = v as Record<string, unknown>
      const n = typeof o.name === "string" ? o.name : null
      const h = typeof o.hex === "string" ? o.hex : null
      const s = typeof o.sku === "string" ? o.sku : null
      if (n && h && s) return [{ name: n, hex: h, sku: s }]
    }
    return []
  })
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

      // Log entry for the executive admin (in their audit log)
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
          requestedBy: editRequest.requestedByName,
        },
      })

      // Mirror entry for the operations admin (in their audit log) so they see their request was rejected
      await logAudit({
        actorId: editRequest.requestedById,
        action: "PRODUCT_UPDATED",
        entityType: "PRODUCT",
        entityId: editRequest.productId,
        metadata: {
          auditLabel: "MY_PRODUCT_EDIT_REJECTED",
          name: editRequest.productName,
          remarks,
          reviewedBy: currentUser.name,
          requestedBy: editRequest.requestedByName,
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
    const colorVariantsRaw = Array.isArray(payload.colorVariants) ? payload.colorVariants : []
    const colorVariants = colorVariantsRaw.flatMap((v) => {
      if (v && typeof v === "object") {
        const o = v as Record<string, unknown>
        const n = typeof o.name === "string" ? o.name : null
        const h = typeof o.hex === "string" ? o.hex : null
        const s = typeof o.sku === "string" ? o.sku : null
        if (n && h && s) return [{ name: n, hex: h, sku: s }]
      }
      return []
    })

    // Load the current product state BEFORE applying the edit so we can compute a clean diff
    const beforeProductRows = await prisma.$queryRaw<
      Array<{ name: string; category: string; price: number; isPublished: boolean; colorVariants: unknown }>
    >(Prisma.sql`
      SELECT
        p.name,
        p.category,
        p.price::double precision AS price,
        p."isPublished",
        p."colorVariants"
      FROM public.products p
      WHERE p.id = ${editRequest.productId}
      LIMIT 1
    `)
    const beforeProduct = beforeProductRows[0]
    const beforeColorVariants = asColorVariants(beforeProduct?.colorVariants ?? [])
    const colorVariantsDiff = diffColorVariants(beforeColorVariants, colorVariants)
    const colorVariantsChanged =
      colorVariantsDiff.added.length > 0 ||
      colorVariantsDiff.removed.length > 0 ||
      colorVariantsDiff.changed.length > 0

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
          "colorVariants" = ${JSON.stringify(colorVariants)}::jsonb,
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

    // Build a structured metadata block describing what changed. Both admins see this.
    const sharedMetadata: Record<string, unknown> = {
      name,
      category,
      price,
      isPublished,
      approvedBy: currentUser.name,
      requestedBy: editRequest.requestedByName,
    }

    if (colorVariantsChanged) {
      sharedMetadata.colorVariantsBefore = beforeColorVariants
      sharedMetadata.colorVariantsAfter = colorVariants
      sharedMetadata.colorVariantsAdded = colorVariantsDiff.added
      sharedMetadata.colorVariantsRemoved = colorVariantsDiff.removed
      sharedMetadata.colorVariantsChanged = colorVariantsDiff.changed
      // Human-readable summary for the audit row's "details" column
      const summaryParts: string[] = []
      if (colorVariantsDiff.added.length > 0) {
        summaryParts.push(`+${colorVariantsDiff.added.length} added (${colorVariantsDiff.added.map((v) => v.name).join(", ")})`)
      }
      if (colorVariantsDiff.removed.length > 0) {
        summaryParts.push(`-${colorVariantsDiff.removed.length} removed (${colorVariantsDiff.removed.map((v) => v.name).join(", ")})`)
      }
      if (colorVariantsDiff.changed.length > 0) {
        summaryParts.push(`${colorVariantsDiff.changed.length} updated (${colorVariantsDiff.changed.map((c) => c.after.name).join(", ")})`)
      }
      sharedMetadata.colorVariantsSummary = summaryParts.join(" · ")
    }

    // Log entry attributed to the executive admin who approved.
    // This shows up in the executive admin's audit log feed.
    await logAudit({
      actorId: currentUser.authUserId,
      action: "PRODUCT_UPDATED",
      entityType: "PRODUCT",
      entityId: editRequest.productId,
      metadata: {
        ...sharedMetadata,
        auditLabel: colorVariantsChanged ? "PRODUCT_COLOR_VARIANTS_APPROVED" : "PRODUCT_EDIT_APPROVED",
      },
    })

    // Mirror entry attributed to the operations admin who originally requested the edit.
    // This shows up in the operations admin's audit log feed so they can see their request was approved.
    await logAudit({
      actorId: editRequest.requestedById,
      action: "PRODUCT_UPDATED",
      entityType: "PRODUCT",
      entityId: editRequest.productId,
      metadata: {
        ...sharedMetadata,
        auditLabel: colorVariantsChanged
          ? "MY_COLOR_VARIANTS_EDIT_APPROVED"
          : "MY_PRODUCT_EDIT_APPROVED",
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
