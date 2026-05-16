import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/operations", request.url)
  url.searchParams.set("tab", "storefront-filters")
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser || !["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
    return buildRedirect(request, "Unauthorized", "error")
  }

  const formData = await request.formData()
  const categoryId = String(formData.get("categoryId") ?? "").trim()
  const categoryName = String(formData.get("categoryName") ?? "").trim()

  if (!categoryId || !categoryName) {
    return buildRedirect(request, "Category ID and name are required.", "error")
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Uncategorize all products in this category
      await tx.$executeRawUnsafe(
        `UPDATE public.products SET category = 'Uncategorized' WHERE category = $1`,
        categoryName
      )
      
      // Delete the category
      await tx.$executeRawUnsafe(
        `DELETE FROM public.storefront_categories WHERE id = $1`,
        categoryId
      )
    })

    revalidatePath("/operations")
    
    return buildRedirect(request, `Category deleted. Products were marked as Uncategorized.`, "success")
  } catch (error) {
    return buildRedirect(request, "Could not delete category.", "error")
  }
}
