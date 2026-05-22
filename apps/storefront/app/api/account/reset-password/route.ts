import { timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
// Use Better Auth's own password hashing so the stored hash is exactly compatible
// with how Better Auth verifies passwords on sign-in
import { hashPassword } from "better-auth/crypto"

const OTP_IDENTIFIER_PREFIX = "password-reset:"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as {
    email?: string
    otp?: string
    newPassword?: string
  }

  const email = body.email?.trim().toLowerCase()
  const otp = body.otp?.trim()
  const newPassword = body.newPassword

  if (!email || !otp || !newPassword) {
    return NextResponse.json(
      { message: "Email, reset code, and new password are required." },
      { status: 400 },
    )
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { message: "Password must be at least 8 characters." },
      { status: 400 },
    )
  }

  const specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/
  if (newPassword.length > 15) {
    return NextResponse.json(
      { message: "Password must be no more than 15 characters." },
      { status: 400 },
    )
  }
  if (!specialChar.test(newPassword)) {
    return NextResponse.json(
      { message: "Password must include at least one special character (e.g. !@#$%^&*)." },
      { status: 400 },
    )
  }

  const identifier = `${OTP_IDENTIFIER_PREFIX}${email}`

  // Validate OTP
  const rows = await prisma.$queryRaw<Array<{ id: string; value: string; expiresAt: Date }>>(Prisma.sql`
    SELECT id, value, "expiresAt"
    FROM neon_auth.verification
    WHERE identifier = ${identifier}
    LIMIT 1
  `)

  const record = rows[0]

  if (!record) {
    return NextResponse.json(
      { message: "Invalid or expired reset code. Please request a new one." },
      { status: 400 },
    )
  }

  if (new Date(record.expiresAt) < new Date()) {
    await prisma.$executeRaw(Prisma.sql`DELETE FROM neon_auth.verification WHERE id = ${record.id}`)
    return NextResponse.json(
      { message: "This reset code has expired. Please request a new one." },
      { status: 400 },
    )
  }

  const expected = Buffer.from(record.value)
  const actual = Buffer.from(otp)
  const otpMatch = expected.length === actual.length && timingSafeEqual(expected, actual)

  if (!otpMatch) {
    return NextResponse.json(
      { message: "Incorrect reset code. Check your email and try again." },
      { status: 400 },
    )
  }

  // OTP valid — find the Neon Auth user
  const neonUsers = await prisma.$queryRaw<Array<{ id: string }>>(Prisma.sql`
    SELECT id::text AS id
    FROM neon_auth."user"
    WHERE LOWER(email) = ${email}
    LIMIT 1
  `)

  const neonUser = neonUsers[0]
  if (!neonUser) {
    return NextResponse.json({ message: "Account not found." }, { status: 404 })
  }

  // Hash using Better Auth's own function — guaranteed compatible
  const newHash = await hashPassword(newPassword)

  try {
    await prisma.$transaction([
      prisma.$executeRaw(Prisma.sql`
        UPDATE neon_auth.account
        SET password = ${newHash},
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "userId" = ${neonUser.id}::uuid
          AND "providerId" = 'credential'
      `),
      prisma.$executeRaw(Prisma.sql`
        DELETE FROM neon_auth.verification WHERE identifier = ${identifier}
      `),
    ])
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("[reset-password] DB update failed:", msg)
    return NextResponse.json({ message: `Reset failed: ${msg}` }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
