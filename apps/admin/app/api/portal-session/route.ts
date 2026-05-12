import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ADMIN_PORTAL_SESSION_COOKIE_NAME } from "@/lib/auth/portal-session"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function DELETE() {
  const cookieStore = await cookies()

  cookieStore.delete(ADMIN_PORTAL_SESSION_COOKIE_NAME)

  return NextResponse.json({ ok: true })
}
