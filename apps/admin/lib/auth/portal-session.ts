import { createHmac, timingSafeEqual } from "node:crypto"

export const ADMIN_PORTAL_SESSION_COOKIE_NAME = "furnitrack.admin.session"

export type PortalSessionUser = {
  id: string
  email?: string
  name?: string
  role?: string | null
}

type PortalSessionPayload = {
  exp: number
  user: PortalSessionUser
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")

  return Buffer.from(padded, "base64")
}

export function verifyPortalSession(token: string | undefined): PortalSessionUser | null {
  const secret = process.env.NEON_AUTH_COOKIE_SECRET

  if (!token || !secret) {
    return null
  }

  const [payload, signature] = token.split(".")

  if (!payload || !signature) {
    return null
  }

  const expectedSignature = createHmac("sha256", secret).update(payload).digest()
  const actualSignature = base64UrlDecode(signature)

  if (
    expectedSignature.length !== actualSignature.length ||
    !timingSafeEqual(expectedSignature, actualSignature)
  ) {
    return null
  }

  const parsed = JSON.parse(base64UrlDecode(payload).toString("utf8")) as PortalSessionPayload

  if (!parsed.user?.id || !parsed.exp || parsed.exp <= Date.now() / 1000) {
    return null
  }

  return parsed.user
}
