import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
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

  if (!currentUser || !["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT"].includes(currentUser.role)) {
    return buildRedirect(request, "Only operations or executive admins can delete finished products.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const productId = String(formData.get("productId") ?? "").trim()
  const stockItemId = String(formData.get("stockItemId") ?? "").trim()

  if (!productId || !stockItemId) {
    return buildRedirect(request, "Select a valid product to delete.", "error")
  }

  try {
    const existingProduct = await prisma.$queryRaw<Array<{ id: string; stockItemId: string }>>(Prisma.sql`
      SELECT
        id,
        "stockItemId"
      FROM public.products
      WHERE id = ${productId}
      LIMIT 1
    `)

    if (!existingProduct[0] || existingProduct[0].stockItemId !== stockItemId) {
      return buildRedirect(request, "That finished product could not be found.", "error")
    }

    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw(Prisma.sql`
        DELETE FROM public.product_materials
        WHERE "productId" = ${productId}
      `)

      await tx.$executeRaw(Prisma.sql`
        DELETE FROM public.products
        WHERE id = ${productId}
      `)

      await tx.$executeRaw(Prisma.sql`
        DELETE FROM public.stock_items
        WHERE id = ${stockItemId}
      `)
    })

    revalidatePath("/operations")
    revalidatePath("/shop")
    revalidatePath("/")

    return buildRedirect(request, "Finished product deleted successfully.", "success")
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Neon DB could not delete that finished product. It may have existing orders or stock history."

    return buildRedirect(request, message, "error")
  }
}
