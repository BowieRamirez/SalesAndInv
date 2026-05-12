import { createHmac, timingSafeEqual } from "node:crypto"

export const PORTAL_SESSION_COOKIE_NAMES = {
  admin: "furnitrack.admin.session",
  storefront: "furnitrack.storefront.session",
} as const

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

function base64UrlEncode(value: Buffer | string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")

  return Buffer.from(padded, "base64")
}

function getSecret() {
  return process.env.NEON_AUTH_COOKIE_SECRET
}

export function signPortalSession(user: PortalSessionUser) {
  const secret = getSecret()

  if (!secret) {
    throw new Error("Missing NEON_AUTH_COOKIE_SECRET")
  }

  const payload = base64UrlEncode(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
      user,
    } satisfies PortalSessionPayload)
  )
  const signature = base64UrlEncode(
    createHmac("sha256", secret).update(payload).digest()
  )

  return `${payload}.${signature}`
}

export function verifyPortalSession(token: string | undefined): PortalSessionUser | null {
  const secret = getSecret()

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
