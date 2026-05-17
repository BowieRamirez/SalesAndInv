import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, logAudit, prisma } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import { APP_ROLES } from "@/lib/rbac"

const INTERNAL_ROLES = APP_ROLES.filter((role) => role !== "CLIENT")

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/users", request.url)
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser || currentUser.role !== "ADMIN_MANAGEMENT") {
    return buildRedirect(request, "You must be signed in as an executive admin to update accounts.", "error")
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
    return buildRedirect(request, "Select a valid account and status.", "error")
  }

  if (currentUser.authUserId === authUserId) {
    return buildRedirect(request, "You cannot deactivate your own account.", "error")
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
      return buildRedirect(request, "That account could not be found.", "error")
    }

    const normalizedRole = String(target.role ?? "CLIENT").toUpperCase()
    if (!INTERNAL_ROLES.includes(normalizedRole as any)) {
      return buildRedirect(request, "Only internal accounts can be deactivated from this page.", "error")
    }

    if (normalizedRole === "ADMIN_MANAGEMENT") {
      return buildRedirect(request, "The executive admin account cannot be deactivated.", "error")
    }

    const name = target.name?.trim() || email.split("@")[0]

    await prisma.user.update({
      where: { email },
      data: {
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
        auditLabel: status === "BLOCKED" ? "ADMIN_DEACTIVATED" : "ADMIN_REACTIVATED",
        updatedEmail: email,
        updatedName: name,
        status,
      },
    })

    revalidatePath("/users")
    return buildRedirect(
      request,
      status === "BLOCKED" ? `Deactivated ${email}.` : `Reactivated ${email}.`,
      "success",
    )
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Neon DB could not update that account."

    return buildRedirect(request, message, "error")
  }
}
