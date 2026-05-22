import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getStorefrontSessionUser } from "@/lib/auth/session"

const AUTH_BASE = process.env.NEON_AUTH_BASE_URL?.trim().replace(/\/+$/, "")

export async function POST(request: Request) {
  const sessionUser = await getStorefrontSessionUser()

  if (!sessionUser) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 })
  }

  if (!AUTH_BASE) {
    return NextResponse.json({ message: "Auth not configured." }, { status: 500 })
  }

  const body = await request.json().catch(() => ({})) as { code?: string }

  if (!body.code?.trim()) {
    return NextResponse.json({ message: "Verification code is required." }, { status: 400 })
  }

  // Call Neon Auth verify-email server-side (we have the env var here)
  const verifyRes = await fetch(`${AUTH_BASE}/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: AUTH_BASE },
    body: JSON.stringify({ code: body.code.trim() }),
  })

  if (!verifyRes.ok) {
    const data = await verifyRes.json().catch(() => ({})) as { message?: string }
    return NextResponse.json(
      { message: data.message ?? "Invalid or expired verification code." },
      { status: verifyRes.status },
    )
  }

  // The code was valid — stamp emailVerifiedAt in our users table
  // and also mark neon_auth.user.emailVerified = true
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
