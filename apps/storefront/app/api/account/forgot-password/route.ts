import { randomInt } from "node:crypto"
import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { sendPasswordResetOtp } from "@/lib/email"

const OTP_EXPIRY_MINUTES = 15
// Identifier prefix to distinguish our OTP entries from other verification entries
const OTP_IDENTIFIER_PREFIX = "password-reset:"

function generateOtp(): string {
  // 6-digit OTP, zero-padded
  return String(randomInt(100000, 999999))
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { email?: string }
  const email = body.email?.trim().toLowerCase()

  if (!email) {
    return NextResponse.json({ message: "Email is required." }, { status: 400 })
  }

  // Check the user exists in our system
  const users = await prisma.$queryRaw<Array<{ id: string; name: string; email: string }>>(Prisma.sql`
    SELECT id, name, email
    FROM public.users
    WHERE LOWER(email) = ${email}
      AND role = 'CLIENT'::"UserRole"
    LIMIT 1
  `)

  // Return success regardless of whether the email exists — prevents user enumeration
  const user = users[0]
  if (!user) {
    return NextResponse.json({ ok: true })
  }

  const otp = generateOtp()
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)
  const identifier = `${OTP_IDENTIFIER_PREFIX}${email}`

  // Upsert the OTP into neon_auth.verification (delete old, insert new)
  await prisma.$transaction([
    prisma.$executeRaw(Prisma.sql`
      DELETE FROM neon_auth.verification
      WHERE identifier = ${identifier}
    `),
    prisma.$executeRaw(Prisma.sql`
      INSERT INTO neon_auth.verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        ${identifier},
        ${otp},
        ${expiresAt},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
    `),
  ])

  // Send the OTP email
  try {
    await sendPasswordResetOtp({ to: user.email, name: user.name, otp })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[forgot-password] Failed to send OTP email:", message)
    return NextResponse.json(
      { message: `Email send failed: ${message}` },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true })
}
