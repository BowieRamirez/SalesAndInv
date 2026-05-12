import { NextResponse, type NextRequest } from "next/server"

const ADMIN_PORTAL_SESSION_COOKIE_NAME = "furnitrack.admin.session"

export default function middleware(request: NextRequest) {
  if (request.cookies.has(ADMIN_PORTAL_SESSION_COOKIE_NAME)) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL("/sign-in", request.url))
}

export const config = {
  matcher: [
    "/((?!sign-in|api/auth|api/admin|api/portal-session|_next/static|_next/image|favicon.ico).*)",
  ],
}
