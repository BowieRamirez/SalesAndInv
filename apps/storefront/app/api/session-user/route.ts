import { NextResponse } from "next/server"
import { getCurrentStorefrontUser } from "@/lib/auth/session"

export async function GET() {
  const user = await getCurrentStorefrontUser()

  return NextResponse.json({ user })
}
