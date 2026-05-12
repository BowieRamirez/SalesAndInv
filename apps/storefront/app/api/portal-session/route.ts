import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getCurrentStorefrontUser } from "@/lib/auth/session"
import { PORTAL_SESSION_COOKIE_NAMES, signPortalSession } from "@/lib/auth/portal-session"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    portal?: "admin" | "storefront"
  }
  const portal = body.portal === "admin" ? "admin" : "storefront"
  const user = await getCurrentStorefrontUser({ fresh: true })

  if (!user) {
    return NextResponse.json({ error: "Unable to verify the current session." }, { status: 401 })
  }

  if (portal === "admin" && user.role === "CLIENT") {
    return NextResponse.json({ error: "Client accounts cannot use the staff portal." }, { status: 403 })
  }

  if (portal === "storefront" && user.role !== "CLIENT") {
    return NextResponse.json({ error: "Staff accounts cannot use the customer portal." }, { status: 403 })
  }

  const cookieStore = await cookies()
  cookieStore.set(
    PORTAL_SESSION_COOKIE_NAMES[portal],
    signPortalSession({
      id: user.authUserId ?? user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }),
    getCookieOptions()
  )

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    portal?: "admin" | "storefront"
  }
  const portal = body.portal === "admin" ? "admin" : "storefront"
  const cookieStore = await cookies()

  cookieStore.delete(PORTAL_SESSION_COOKIE_NAMES[portal])

  return NextResponse.json({ ok: true })
}
