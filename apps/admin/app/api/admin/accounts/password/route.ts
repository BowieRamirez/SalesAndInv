import { revalidatePath } from "next/cache"
import { randomBytes, scryptSync } from "node:crypto"
import { NextResponse } from "next/server"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import { logAudit, Prisma, prisma } from "@furnitrack/db"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/users", request.url)
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser || currentUser.role !== "ADMIN_MANAGEMENT") {
    return buildRedirect(request, "You must be signed in as an executive admin to change passwords.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const authUserId = String(formData.get("authUserId") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const newPassword = String(formData.get("newPassword") ?? "")

  if (!authUserId || !email || !newPassword) {
    return buildRedirect(request, "A target account and new password are required.", "error")
  }

  if (newPassword.length < 8) {
    return buildRedirect(request, "Use a password with at least 8 characters.", "error")
  }

  try {
    const salt = randomBytes(16).toString("hex")
    const derivedKey = scryptSync(newPassword.normalize("NFKC"), salt, 64, {
      N: 16384,
      r: 16,
      p: 1,
      maxmem: 128 * 16384 * 16 * 2,
    }).toString("hex")

    const passwordHash = `${salt}:${derivedKey}`

    const updatedRows = await prisma.$executeRaw(Prisma.sql`
      UPDATE neon_auth.account
      SET
        password = ${passwordHash},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE "userId"::text = ${authUserId}
        AND "providerId" = 'credential'
    `)

    if (updatedRows === 0) {
      return buildRedirect(request, "No credential login record was found for that account.", "error")
    }

    await logAudit({
      actorId: currentUser.authUserId,
      action: "USER_UPDATED",
      entityType: "USER",
      entityId: authUserId,
      metadata: {
        updatedEmail: email,
        changed: "PASSWORD",
      },
    })

    revalidatePath("/users")
    return buildRedirect(request, `Password updated for ${email}.`, "success")
  } catch (error) {
    const message = error instanceof Error && error.message
      ? error.message
      : "Neon Auth could not update that password."

    return buildRedirect(request, message, "error")
  }
}
