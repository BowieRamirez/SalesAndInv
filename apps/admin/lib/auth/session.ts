import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { createHmac, timingSafeEqual } from "node:crypto"
import { prisma } from "@furnitrack/db"
import { auth } from "@/lib/auth/server"
import { normalizeAppRole, type AppRole } from "@/lib/rbac"
import { ADMIN_PORTAL_SESSION_COOKIE_NAME, verifyPortalSession } from "@/lib/auth/portal-session"

type SessionUser = {
  id?: string
  email?: string
  name?: string
  role?: string | null
}

type CachedSessionPayload = {
  exp?: number
  session?: {
    token?: string | null
    userId?: string | null
  } | null
  user?: SessionUser | null
}

type AppUserRow = {
  id: string
  authUserId: string | null
  email: string
  name: string
  role: AppRole
  status: string
  companyId: string | null
  companyCode: string | null
  accessExpiresAt: Date | null
}

export type AuthenticatedAppUser = {
  id: string
  authUserId: string | null
  email: string
  name: string
  role: AppRole
  status: string
  companyId: string | null
  companyCode: string | null
  permissions: Record<string, boolean> | null
}

function isInternalRole(role: AppRole) {
  return role !== "CLIENT"
}

function isExpired(accessExpiresAt: Date | null) {
  return Boolean(accessExpiresAt && accessExpiresAt.getTime() <= Date.now())
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")

  return Buffer.from(padded, "base64")
}

function parseCookieHeader(cookieHeader: string | null) {
  const parsed = new Map<string, string>()

  if (!cookieHeader) {
    return parsed
  }

  for (const cookie of cookieHeader.split(";")) {
    const separatorIndex = cookie.indexOf("=")

    if (separatorIndex === -1) {
      continue
    }

    const name = cookie.slice(0, separatorIndex).trim()
    const rawValue = cookie.slice(separatorIndex + 1).trim()

    if (!name) {
      continue
    }

    try {
      parsed.set(name, decodeURIComponent(rawValue))
    } catch {
      parsed.set(name, rawValue)
    }
  }

  return parsed
}

async function getNeonAuthCookies() {
  const headerStore = await headers()

  return parseCookieHeader(headerStore.get("cookie"))
}

function verifySignedSessionPayload(
  token: string | undefined
): CachedSessionPayload | null {
  const secret = process.env.NEON_AUTH_COOKIE_SECRET

  if (!token || !secret) {
    return null
  }

  const [encodedHeader, encodedPayload, encodedSignature] = token.split(".")

  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    return null
  }

  const expectedSignature = createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest()
  const actualSignature = base64UrlDecode(encodedSignature)

  if (
    expectedSignature.length !== actualSignature.length ||
    !timingSafeEqual(expectedSignature, actualSignature)
  ) {
    return null
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload).toString("utf8")) as
    | CachedSessionPayload
    | null

  if (!payload?.user?.id || !payload.exp || payload.exp <= Date.now() / 1000) {
    return null
  }

  return payload
}

async function getSessionUserFromTokenCookie(): Promise<SessionUser | null> {
  const cookieMap = await getNeonAuthCookies()
  const signedToken = cookieMap.get("__Secure-neon-auth.session_token")
  const [token] = signedToken?.split(".") ?? []

  if (!token) {
    return null
  }

  const rows = await prisma.$queryRaw<SessionUser[]>`
    SELECT
      u.id::text AS id,
      u.email,
      u.name,
      u.role::text AS role
    FROM neon_auth.session s
    INNER JOIN neon_auth."user" u ON u.id = s."userId"
    WHERE s.token = ${token}
      AND s."expiresAt" > CURRENT_TIMESTAMP
    LIMIT 1
  `

  return rows[0] ?? null
}

async function getSessionUserFromSignedCache(): Promise<SessionUser | null> {
  const cookieMap = await getNeonAuthCookies()
  const payload = verifySignedSessionPayload(
    cookieMap.get("__Secure-neon-auth.local.session_data")
  )

  return payload?.user ?? null
}

async function getVerifiedSessionUser({ fresh = false }: { fresh?: boolean } = {}): Promise<SessionUser | null> {
  if (!fresh) {
    const cookieMap = await getNeonAuthCookies()

    return verifyPortalSession(cookieMap.get(ADMIN_PORTAL_SESSION_COOKIE_NAME))
  }

  try {
    const { data } = await auth.getSession()
    const sessionUser = data?.user as SessionUser | undefined

    if (sessionUser?.id) {
      return sessionUser
    }
  } catch (error) {
    console.warn("[admin.auth] Falling back to database session lookup", error)
  }

  try {
    const sessionUser = await getSessionUserFromTokenCookie()

    if (sessionUser?.id) {
      return sessionUser
    }
  } catch (error) {
    console.warn("[admin.auth] Falling back to signed session cache", error)
  }

  return getSessionUserFromSignedCache()
}

async function findAppUserForSession(
  sessionUser: SessionUser
): Promise<AppUserRow | null> {
  if (!sessionUser.id) {
    return null
  }

  const rows = await prisma.$queryRaw<AppUserRow[]>`
    SELECT
      u.id,
      u."authUserId"::text AS "authUserId",
      u.email,
      u.name,
      u.role::text AS role,
      u.status::text AS status,
      u."companyId" AS "companyId",
      c.code AS "companyCode",
      u."accessExpiresAt" AS "accessExpiresAt",
      u.permissions
    FROM public.users u
    LEFT JOIN public.companies c ON c.id = u."companyId"
    WHERE u."authUserId" = ${sessionUser.id}::uuid
      OR (
        ${sessionUser.email ?? null}::text IS NOT NULL
        AND LOWER(u.email) = LOWER(${sessionUser.email ?? null}::text)
      )
    LIMIT 1
  `

  return rows[0] ?? null
}

export async function getCurrentAdminPortalUser({ fresh = false }: { fresh?: boolean } = {}): Promise<AuthenticatedAppUser | null> {
  const sessionUser = await getVerifiedSessionUser({ fresh })

  if (!sessionUser?.id) {
    return null
  }

  const appUser = await findAppUserForSession(sessionUser)

  if (!appUser) {
    if (!sessionUser.email || !sessionUser.name) {
      return null
    }

    return {
      id: sessionUser.id,
      authUserId: sessionUser.id,
      email: sessionUser.email,
      name: sessionUser.name,
      role: normalizeAppRole(sessionUser.role),
      status: "ACTIVE",
      companyId: null,
      companyCode: null,
      permissions: null,
    }
  }

  const normalizedRole = normalizeAppRole(appUser.role)
  const effectiveStatus = isExpired(appUser.accessExpiresAt) ? "EXPIRED" : appUser.status

  if (effectiveStatus !== "ACTIVE") {
    return null
  }

  return {
    id: appUser.id,
    authUserId: appUser.authUserId,
    email: appUser.email,
    name: appUser.name,
    role: normalizedRole,
    status: effectiveStatus,
    companyId: appUser.companyId,
    companyCode: appUser.companyCode,
    permissions: (appUser as any).permissions ? (typeof (appUser as any).permissions === 'string' ? JSON.parse((appUser as any).permissions) : (appUser as any).permissions) : null,
  }
}

export async function getAuthenticatedAppUser(): Promise<AuthenticatedAppUser | null> {
  const appUser = await getCurrentAdminPortalUser()

  if (!appUser || !isInternalRole(appUser.role)) {
    return null
  }

  return appUser
}

export async function requireAuthenticatedAppUser() {
  const appUser = await getAuthenticatedAppUser()

  if (!appUser) {
    redirect("/sign-in")
  }

  return appUser
}
