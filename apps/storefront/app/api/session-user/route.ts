import { NextResponse } from "next/server"
import { getCurrentStorefrontUser } from "@/lib/auth/session"

export async function GET() {
  try {
    const user = await getCurrentStorefrontUser()

    return NextResponse.json({ user })
  } catch (error) {
    console.error("[storefront.session-user] Failed to resolve session user", error)

    return NextResponse.json(
      { user: null, error: "Unable to verify the current session." },
      { status: 401 }
    )
  }
}
