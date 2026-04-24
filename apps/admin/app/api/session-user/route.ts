import { NextResponse } from "next/server"
import { getCurrentAdminPortalUser } from "@/lib/auth/session"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  try {
    const user = await getCurrentAdminPortalUser()

    return NextResponse.json({ user })
  } catch (error) {
    console.error("[admin.session-user] Failed to resolve session user", error)

    return NextResponse.json(
      { user: null, error: "Unable to verify the current session." },
      { status: 401 }
    )
  }
}
