import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, logAudit, prisma } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/customers", request.url)
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser || currentUser.role !== "ADMIN_MANAGEMENT") {
    return buildRedirect(request, "You must be signed in as an executive admin to update customers.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const authUserId = String(formData.get("authUserId") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const status = String(formData.get("status") ?? "").trim().toUpperCase()

  if (!authUserId || !email || !["ACTIVE", "BLOCKED"].includes(status)) {
    return buildRedirect(request, "Select a valid customer and status.", "error")
  }

  try {
    const targetRows = await prisma.$queryRaw<Array<{ name: string | null; email: string; role: string | null }>>(Prisma.sql`
      SELECT name, LOWER(email) AS email, role
      FROM neon_auth."user"
      WHERE id::text = ${authUserId}
      LIMIT 1
    `)
    const target = targetRows[0]

    if (!target) {
      return buildRedirect(request, "That customer account could not be found.", "error")
    }

    const normalizedRole = String(target.role ?? "CLIENT").toUpperCase()
    if (!["CLIENT", "CUSTOMER", ""].includes(normalizedRole)) {
      return buildRedirect(request, "Only customer accounts can be deactivated from this page.", "error")
    }

    const name = target.name?.trim() || email.split("@")[0]

    await prisma.user.upsert({
      where: { email },
      update: {
        authUserId,
        name,
        role: "CLIENT",
        status: status as "ACTIVE" | "BLOCKED",
      },
      create: {
        id: authUserId,
        authUserId,
        email,
        name,
        role: "CLIENT",
        status: status as "ACTIVE" | "BLOCKED",
      },
    })

    if (status === "BLOCKED") {
      await prisma.$executeRaw(Prisma.sql`
        DELETE FROM neon_auth.session
        WHERE "userId"::text = ${authUserId}
      `)
    }

    await logAudit({
      actorId: currentUser.authUserId,
      action: status === "BLOCKED" ? "USER_BLOCKED" : "USER_UPDATED",
      entityType: "USER",
      entityId: authUserId,
      metadata: {
        auditLabel: status === "BLOCKED" ? "CUSTOMER_DEACTIVATED" : "CUSTOMER_REACTIVATED",
        customerEmail: email,
        customerName: name,
        status,
      },
    })

    revalidatePath("/customers")
    return buildRedirect(
      request,
      status === "BLOCKED" ? `Deactivated ${email}.` : `Reactivated ${email}.`,
      "success",
    )
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Neon DB could not update that customer account."

    return buildRedirect(request, message, "error")
  }
}
