import { NextResponse } from "next/server"
import { getStorefrontSessionUser } from "@/lib/auth/session"

const AUTH_BASE = process.env.NEON_AUTH_BASE_URL?.trim().replace(/\/+$/, "")

export async function POST() {
  const sessionUser = await getStorefrontSessionUser()

  if (!sessionUser) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 })
  }
  if (!AUTH_BASE) {
    return NextResponse.json({ message: "Auth not configured." }, { status: 500 })
  }

  const res = await fetch(`${AUTH_BASE}/send-verification-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: AUTH_BASE },
    body: JSON.stringify({ email: sessionUser.email }),
  })

  const data = await res.json().catch(() => ({})) as { message?: string }

  if (!res.ok) {
    return NextResponse.json(
      { message: data.message ?? "Failed to send verification email." },
      { status: res.status },
    )
  }

  return NextResponse.json({ ok: true })
}
