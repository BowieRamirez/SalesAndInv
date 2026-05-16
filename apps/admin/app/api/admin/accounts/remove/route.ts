import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/users", request.url)
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

function getActionErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = String((error as { message?: unknown }).message ?? "").trim()

    if (message) {
      return message
    }
  }

  return fallback
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser || currentUser.role !== "ADMIN_MANAGEMENT") {
    return buildRedirect(request, "You must be signed in as an executive admin to remove accounts.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const authUserId = String(formData.get("authUserId") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()

  if (!authUserId || !email) {
    return buildRedirect(request, "The selected account could not be removed.", "error")
  }

  if (currentUser.authUserId === authUserId) {
    return buildRedirect(request, "You cannot remove the account you are currently using.", "error")
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Fetch user details to archive
      const targetAppUser = await tx.user.findFirst({
        where: { OR: [{ authUserId }, { email }] },
      })
      const targetNeonUser = await tx.$queryRaw<any[]>(Prisma.sql`SELECT * FROM neon_auth."user" WHERE id::text = ${authUserId}`)
      
      const name = targetAppUser?.name || targetNeonUser[0]?.name || email.split('@')[0]
      const role = targetAppUser?.role || targetNeonUser[0]?.role || "UNKNOWN"

      // 2. Save to archive
      try {
        await tx.adminAccountArchive.upsert({
          where: { originalUserId: authUserId },
          update: { role, name, email },
          create: {
            originalUserId: authUserId,
            name,
            email,
            role,
          }
        })
      } catch (e) {
        // Ignore if schema isn't fully ready
      }

      await tx.user.deleteMany({
        where: {
          OR: [{ authUserId }, { email }],
        },
      })

      await tx.$executeRaw(Prisma.sql`
        DELETE FROM neon_auth.invitation
        WHERE "inviterId"::text = ${authUserId}
      `)

      await tx.$executeRaw(Prisma.sql`
        DELETE FROM neon_auth.member
        WHERE "userId"::text = ${authUserId}
      `)

      await tx.$executeRaw(Prisma.sql`
        DELETE FROM neon_auth.session
        WHERE "userId"::text = ${authUserId}
      `)

      await tx.$executeRaw(Prisma.sql`
        DELETE FROM neon_auth.account
        WHERE "userId"::text = ${authUserId}
      `)

      const deletedUsers = await tx.$executeRaw(Prisma.sql`
        DELETE FROM neon_auth."user"
        WHERE id::text = ${authUserId}
      `)

      if (deletedUsers === 0) {
        throw new Error("No Neon Auth user record was found for that account.")
      }
    })

    revalidatePath("/users")
    return buildRedirect(request, `Removed ${email} from Neon DB.`, "success")
  } catch (error) {
    return buildRedirect(
      request,
      getActionErrorMessage(error, "Neon DB could not remove that account."),
      "error",
    )
  }
}
