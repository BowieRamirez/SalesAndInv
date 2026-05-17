import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma, logAudit } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"

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
    return buildRedirect(request, "Only operations or executive admins can archive finished products.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const productId = String(formData.get("productId") ?? "").trim()
  const productStockId = String(formData.get("productStockId") ?? "").trim()

  if (!productId || !productStockId) {
    return buildRedirect(request, "Select a valid product to archive.", "error")
  }

  try {
    const existingProduct = await prisma.$queryRaw<
      Array<{
        id: string
        productStockId: string
        name: string
        category: string
        isPublished: boolean
        state: string
        sku: string
      }>
    >(Prisma.sql`
      SELECT
        p.id,
        p."productStockId",
        p.name,
        p.category,
        p."isPublished",
        s.state::text AS state,
        s.sku
      FROM public.products p
      INNER JOIN public.product_stocks s
        ON s.id = p."productStockId"
      WHERE p.id = ${productId}
      LIMIT 1
    `)

    if (!existingProduct[0] || existingProduct[0].productStockId !== productStockId) {
      return buildRedirect(request, "That finished product could not be found.", "error")
    }

    if (existingProduct[0].state === "ARCHIVED") {
      return buildRedirect(request, "This finished product is already archived and can only be viewed.", "error")
    }

    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw(Prisma.sql`
        UPDATE public.products
        SET
          "isPublished" = false,
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${productId}
      `)

      await tx.$executeRaw(Prisma.sql`
        UPDATE public.product_stocks
        SET
          state = 'ARCHIVED'::"StockState",
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${productStockId}
      `)
    })

    revalidatePath("/operations")
    revalidatePath("/shop")
    revalidatePath("/")

    await logAudit({
      actorId: currentUser.authUserId,
      action: "PRODUCT_UPDATED",
      entityType: "PRODUCT",
      entityId: productId,
      metadata: {
        auditLabel: "ARCHIVED_FROM_STOREFRONT",
        sku: existingProduct[0].sku,
        itemName: existingProduct[0].name,
        name: existingProduct[0].name,
        category: existingProduct[0].category,
        isPublished: false,
      },
    })

    return buildRedirect(request, "Finished product archived and hidden from storefront.", "success")
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Neon DB could not archive that finished product."

    return buildRedirect(request, message, "error")
  }
}
