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

  if (!currentUser || !["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT"].includes(currentUser.role)) {
    return buildRedirect(request, "Unauthorized", "error")
  }

  const formData = await request.formData()
  const categoryName = String(formData.get("categoryName") ?? "").trim()
  
  // productIds can be multiple
  const productIds = formData.getAll("productIds").map((id) => String(id).trim()).filter(Boolean)

  if (!categoryName) {
    return buildRedirect(request, "Category name is required.", "error")
  }

  try {
    await prisma.$transaction(async (tx) => {
      // First, any product currently in this category that was UNCHECKED should become Uncategorized
      // To do this, we just set all products in this category to Uncategorized first
      await tx.$executeRawUnsafe(
        `UPDATE public.products SET category = 'Uncategorized' WHERE category = $1`,
        categoryName
      )

      // Then, for all checked products, we set their category to this one.
      if (productIds.length > 0) {
        // Prisma doesn't support array parameters in executeRawUnsafe easily for IN clause, 
        // so we can loop or use Prisma.sql with executeRaw
        const idList = Prisma.join(productIds.map(id => Prisma.sql`${id}`))
        await tx.$executeRaw(Prisma.sql`
          UPDATE public.products SET category = ${categoryName} WHERE id IN (${idList})
        `)
      }
    })

    revalidatePath("/operations")
    
    return buildRedirect(request, `Products assigned to "${categoryName}".`, "success")
  } catch (error) {
    return buildRedirect(request, "Could not save category assignments.", "error")
  }
}
