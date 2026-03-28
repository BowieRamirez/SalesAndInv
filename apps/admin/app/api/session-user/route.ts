import { NextResponse } from "next/server"
import { getCurrentAdminPortalUser } from "@/lib/auth/session"

export async function GET() {
  const user = await getCurrentAdminPortalUser()

  return NextResponse.json({ user })
}
