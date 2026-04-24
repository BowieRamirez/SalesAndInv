import { auth } from "@/lib/auth/server"

const handler = auth.handler()
type GetRouteContext = Parameters<typeof handler.GET>[1]
type PostRouteContext = Parameters<typeof handler.POST>[1]

function normalizeOrigin(value: string | undefined) {
  const origin = value?.trim().replace(/\/+$/, "")

  if (!origin) {
    return null
  }

  return origin.startsWith("http") ? origin : `https://${origin}`
}

function getTrustedAuthOrigin() {
  return (
    normalizeOrigin(process.env.NEON_AUTH_TRUSTED_ORIGIN) ??
    normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL)
  )
}

function withTrustedAuthOrigin(request: Request) {
  const trustedOrigin = getTrustedAuthOrigin()

  if (!trustedOrigin) {
    return request
  }

  const headers = new Headers(request.headers)
  headers.set("origin", trustedOrigin)
  headers.set("referer", `${trustedOrigin}/`)

  return new Request(request, { headers })
}

export function GET(request: Request, context: GetRouteContext) {
  return handler.GET(withTrustedAuthOrigin(request), context)
}

export function POST(request: Request, context: PostRouteContext) {
  return handler.POST(withTrustedAuthOrigin(request), context)
}
