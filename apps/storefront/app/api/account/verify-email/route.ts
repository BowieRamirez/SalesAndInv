import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getStorefrontSessionUser } from "@/lib/auth/session"

export async function POST(request: Request) {
  const sessionUser = await getStorefrontSessionUser()

  if (!sessionUser) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 })
  }

  // This route is now only used to sync emailVerifiedAt into our own DB
  // after the client-side SDK has already verified the OTP with Neon Auth.
  // The body may contain { syncOnly: true } — we just stamp the timestamp.
  await request.json().catch(() => ({}))

  await Promise.all([
    prisma.$executeRaw(Prisma.sql`
      UPDATE public.users
      SET "emailVerifiedAt" = COALESCE("emailVerifiedAt", CURRENT_TIMESTAMP),
          "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${sessionUser.id}
    `),
    prisma.$executeRaw(Prisma.sql`
      UPDATE neon_auth."user"
      SET "emailVerified" = true,
          "updatedAt" = CURRENT_TIMESTAMP
      WHERE id::text = ${sessionUser.authUserId ?? sessionUser.id}
    `),
  ])

  return NextResponse.json({ ok: true })
}
