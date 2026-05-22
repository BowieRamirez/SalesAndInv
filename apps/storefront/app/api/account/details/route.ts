import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getStorefrontSessionUser } from "@/lib/auth/session"

type AccountRow = {
  id: string
  name: string
  email: string
  phone: string | null
  address: string | null
  emailVerifiedAt: Date | null
  createdAt: Date
}

export async function GET() {
  const sessionUser = await getStorefrontSessionUser()

  if (!sessionUser) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 })
  }

  const rows = await prisma.$queryRaw<AccountRow[]>(Prisma.sql`
    SELECT id, name, email, phone, address, "emailVerifiedAt", "createdAt"
    FROM public.users
    WHERE id = ${sessionUser.id}
    LIMIT 1
  `)

  const user = rows[0]
  if (!user) {
    return NextResponse.json({ message: "User not found." }, { status: 404 })
  }

  return NextResponse.json({ user })
}

export async function PATCH(request: Request) {
  const sessionUser = await getStorefrontSessionUser()

  if (!sessionUser) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 })
  }

  const body = await request.json().catch(() => ({})) as Record<string, unknown>
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 60) : null
  const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 20) : null
  const address = typeof body.address === "string" ? body.address.trim().slice(0, 200) : null

  if (name !== null) {
    await prisma.$executeRaw(Prisma.sql`
      UPDATE public.users
      SET name = ${name},
          "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${sessionUser.id}
    `)
  }

  if (phone !== null || address !== null) {
    await prisma.$executeRaw(Prisma.sql`
      UPDATE public.users
      SET phone = COALESCE(${phone}, phone),
          address = COALESCE(${address}, address),
          "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${sessionUser.id}
    `)
  }

  return NextResponse.json({ ok: true })
}
