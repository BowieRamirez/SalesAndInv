import { NextResponse } from "next/server"
import { getCurrentStorefrontUser } from "@/lib/auth/session"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function getMissingServerEnv() {
  return ["DATABASE_URL", "NEON_AUTH_BASE_URL", "NEON_AUTH_COOKIE_SECRET"].filter(
    (name) => !process.env[name]?.trim()
  )
}

export async function GET() {
  try {
    const missingEnv = getMissingServerEnv()

    if (missingEnv.length > 0) {
      return NextResponse.json(
        {
          user: null,
          error: `Missing server environment variable${missingEnv.length === 1 ? "" : "s"}: ${missingEnv.join(", ")}`,
        },
        { status: 500 }
      )
    }

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
