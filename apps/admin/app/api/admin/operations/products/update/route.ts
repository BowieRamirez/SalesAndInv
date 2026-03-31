import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import { generateUniqueProductSlug, parseDecimal, splitLines } from "@/lib/operations-products"

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
    return buildRedirect(request, "Only operations or executive admins can update finished products.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const productId = String(formData.get("productId") ?? "").trim()
  const stockItemId = String(formData.get("stockItemId") ?? "").trim()
  const name = String(formData.get("name") ?? "").trim()
  const category = String(formData.get("category") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const imageUrl = String(formData.get("imageUrl") ?? "").trim()
  const badge = String(formData.get("badge") ?? "").trim() || null
  const price = parseDecimal(formData.get("price"))
  const isPublished = String(formData.get("isPublished") ?? "").trim() === "on"

  if (!productId || !stockItemId || !name || !category || !description) {
    return buildRedirect(request, "Select a valid product and provide its name, category, and description.", "error")
  }

  if (!Number.isFinite(price) || price < 0) {
    return buildRedirect(request, "Price must be zero or higher.", "error")
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

    const slug = await generateUniqueProductSlug(name, productId)
    const imageUrls = splitLines(imageUrl)

    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw(Prisma.sql`
        UPDATE public.stock_items
        SET
          "itemName" = ${name},
          description = ${description},
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${stockItemId}
      `)

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
        WHERE id = ${productId}
      `)
    })

    revalidatePath("/operations")
    revalidatePath("/shop")
    revalidatePath("/")

    return buildRedirect(request, `Updated ${name} in Neon DB.`, "success")
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Neon DB could not update that finished product."

    return buildRedirect(request, message, "error")
  }
}
