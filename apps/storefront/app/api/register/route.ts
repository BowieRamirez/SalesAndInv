import { NextResponse } from "next/server"
import { prisma } from "@furnitrack/db"

type RegisterPayload = {
  name?: string
  email?: string
  password?: string
}

type AuthIdentity = {
  authUserId: string
  email: string
  name: string | null
}

const AUTH_REQUEST_TIMEOUT_MS = 15000

function getNeonAuthBaseUrl() {
  return process.env.NEON_AUTH_BASE_URL?.trim().replace(/\/+$/, "")
}

async function fetchWithTimeout(input: string, init: RequestInit) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), AUTH_REQUEST_TIMEOUT_MS)

  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

async function findAuthIdentityByEmail(email: string) {
  const rows = await prisma.$queryRaw<AuthIdentity[]>`
    SELECT
      id::text AS "authUserId",
      LOWER(email) AS email,
      name
    FROM neon_auth."user"
    WHERE LOWER(email) = LOWER(${email})
    LIMIT 1
  `

  return rows[0] ?? null
}

async function updateAuthIdentity(params: { authUserId: string; name: string }) {
  await prisma.$executeRaw`
    UPDATE neon_auth."user"
    SET
      name = ${params.name},
      role = 'CLIENT',
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE id::text = ${params.authUserId}
  `
}

async function syncClientUserRecord(params: {
  authUserId: string
  email: string
  name: string
}) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ authUserId: params.authUserId }, { email: params.email }],
    },
    select: { id: true },
  })

  if (existingUser) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        authUserId: params.authUserId,
        email: params.email,
        name: params.name,
        role: "CLIENT",
        status: "ACTIVE",
      },
    })

    return
  }

  await prisma.user.create({
    data: {
      id: params.authUserId,
      authUserId: params.authUserId,
      email: params.email,
      name: params.name,
      role: "CLIENT",
      status: "ACTIVE",
    },
  })
}

export async function POST(request: Request) {
  const payload = (await request.json()) as RegisterPayload
  const name = payload.name?.trim()
  const email = payload.email?.trim().toLowerCase()
  const password = payload.password

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "Name, email, and password are required." },
      { status: 400 }
    )
  }

  if (name.length > 30) {
    return NextResponse.json(
      { message: "Full name must be 30 characters or less." },
      { status: 400 }
    )
  }

  if (email.length > 50) {
    return NextResponse.json(
      { message: "Email must be 50 characters or less." },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { message: "Use a password with at least 8 characters." },
      { status: 400 }
    )
  }

  const specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/
  if (password.length > 15) {
    return NextResponse.json(
      { message: "Password must be no more than 15 characters." },
      { status: 400 }
    )
  }
  if (!specialChar.test(password)) {
    return NextResponse.json(
      { message: "Password must include at least one special character (e.g. !@#$%^&*)." },
      { status: 400 }
    )
  }

  const existingIdentity = await findAuthIdentityByEmail(email)

  if (existingIdentity) {
    return NextResponse.json(
      { message: "Email already exists. Please sign in instead." },
      { status: 409 }
    )
  }

  const authUrl = getNeonAuthBaseUrl()

  if (!authUrl) {
    return NextResponse.json(
      { message: "Neon Auth is not configured for the storefront." },
      { status: 500 }
    )
  }

  let signUpResponse: Response

  try {
    signUpResponse = await fetchWithTimeout(`${authUrl}/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: authUrl,
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
      cache: "no-store",
    })
  } catch {
    return NextResponse.json(
      {
        message:
          "Neon Auth did not respond. Check NEON_AUTH_BASE_URL and try again.",
      },
      { status: 504 }
    )
  }

  const rawBody = await signUpResponse.text()
  let signUpResult: Record<string, unknown> = {}

  try {
    signUpResult = rawBody ? JSON.parse(rawBody) : {}
  } catch {
    signUpResult = { message: rawBody }
  }

  if (!signUpResponse.ok) {
    return NextResponse.json(
      {
        message:
          (signUpResult.message as string) ?? "Unable to create account.",
      },
      { status: signUpResponse.status }
    )
  }

  const authIdentity = await findAuthIdentityByEmail(email)

  if (!authIdentity) {
    return NextResponse.json(
      {
        message:
          "The account was created, but Neon did not return the new user id.",
      },
      { status: 502 }
    )
  }

  await updateAuthIdentity({ authUserId: authIdentity.authUserId, name })
  await syncClientUserRecord({
    authUserId: authIdentity.authUserId,
    email,
    name,
  })

  // Send email verification — fire and forget, don't block registration
  try {
    const verifyResponse = await fetchWithTimeout(
      `${authUrl}/send-verification-email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: authUrl },
        body: JSON.stringify({ email }),
        cache: "no-store",
      },
    )
    if (!verifyResponse.ok) {
      console.warn("[register] Failed to send verification email", await verifyResponse.text())
    }
  } catch (err) {
    console.warn("[register] Could not send verification email", err)
  }

  return NextResponse.json({ ok: true })
}
