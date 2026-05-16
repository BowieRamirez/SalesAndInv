import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import { randomUUID } from "crypto"

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
  const name = String(formData.get("name") ?? "").trim()

  if (!name) {
    return buildRedirect(request, "Category name is required.", "error")
  }

  try {
    await prisma.$executeRawUnsafe(
      `INSERT INTO public.storefront_categories (id, name, "createdAt", "updatedAt") VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      randomUUID(),
      name
    )

    revalidatePath("/operations")
    
    return buildRedirect(request, `Category "${name}" added.`, "success")
  } catch (error) {
    return buildRedirect(request, "Could not add category. It may already exist.", "error")
  }
}
