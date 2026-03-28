import { NextResponse } from "next/server";
import { Prisma } from "@furnitrack/db";
import { prisma } from "@furnitrack/db";

type RegisterPayload = {
  name?: string
  email?: string
  password?: string
}

export async function POST(request: Request) {
  const payload = (await request.json()) as RegisterPayload
  const name = payload.name?.trim()
  const email = payload.email?.trim().toLowerCase()
  const password = payload.password

  if (!name || !email || !password) {
    return NextResponse.json({ message: "Name, email, and password are required." }, { status: 400 })
  }

  const authUrl = process.env.NEON_AUTH_BASE_URL

  if (!authUrl) {
    return NextResponse.json({ message: "Neon Auth is not configured for the storefront." }, { status: 500 })
  }

  const signUpResponse = await fetch(`${authUrl}/sign-up/email`, {
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
  })

  const rawBody = await signUpResponse.text()
  let signUpResult: Record<string, unknown> = {}

  try {
    signUpResult = rawBody ? JSON.parse(rawBody) : {}
  } catch {
    signUpResult = { message: rawBody }
  }

  if (!signUpResponse.ok) {
    return NextResponse.json(
      { message: (signUpResult.message as string) ?? "Unable to create account." },
      { status: signUpResponse.status },
    )
  }

  const authUsers = await prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
    SELECT id::text AS id
    FROM neon_auth."user"
    WHERE email = ${email}
    LIMIT 1
  `)

  const authUserId = authUsers[0]?.id

  await prisma.$executeRaw`
    UPDATE neon_auth."user"
    SET role = 'CLIENT'
    WHERE email = ${email}
  `

  if (authUserId) {
    await prisma.user.upsert({
      where: { email },
      update: {
        authUserId,
        name,
        role: "CLIENT",
        status: "ACTIVE",
      },
      create: {
        id: authUserId,
        authUserId,
        email,
        name,
        role: "CLIENT",
        status: "ACTIVE",
      },
    })
  }

  return NextResponse.json({ ok: true })
}
