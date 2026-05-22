import { NextResponse } from "next/server"
import { getStorefrontSessionUser } from "@/lib/auth/session"
import { auth } from "@/lib/auth/server"

export async function POST(request: Request) {
  const sessionUser = await getStorefrontSessionUser()

  if (!sessionUser) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 })
  }

  const body = await request.json().catch(() => ({})) as {
    currentPassword?: string
    newPassword?: string
  }

  if (!body.currentPassword || !body.newPassword) {
    return NextResponse.json({ message: "Current and new password are required." }, { status: 400 })
  }

  if (body.newPassword.length < 8) {
    return NextResponse.json({ message: "New password must be at least 8 characters." }, { status: 400 })
  }

  const specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/
  if (body.newPassword.length > 15) {
    return NextResponse.json({ message: "Password must be no more than 15 characters." }, { status: 400 })
  }
  if (!specialChar.test(body.newPassword)) {
    return NextResponse.json(
      { message: "Password must include at least one special character (e.g. !@#$%^&*)." },
      { status: 400 }
    )
  }

  const AUTH_BASE = process.env.NEON_AUTH_BASE_URL?.trim().replace(/\/+$/, "")

  if (!AUTH_BASE) {
    return NextResponse.json({ message: "Auth not configured." }, { status: 500 })
  }

  try {
    // Get the active session token to use for the password change request
    const session = await auth.getSession()
    const sessionToken = (session.data as { session?: { token?: string } })?.session?.token

    if (!sessionToken) {
      return NextResponse.json({ message: "Session not found. Please sign in again." }, { status: 401 })
    }

    const res = await fetch(`${AUTH_BASE}/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: AUTH_BASE,
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        currentPassword: body.currentPassword,
        newPassword: body.newPassword,
        revokeOtherSessions: false,
      }),
    })

    const data = await res.json().catch(() => ({})) as { message?: string }

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message ?? "Password change failed. Check your current password." },
        { status: res.status },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[change-password]", error)
    return NextResponse.json({ message: "Failed to change password. Please try again." }, { status: 500 })
  }
}
