import { cookies } from "next/headers"
import { prisma } from "@furnitrack/db"
import { auth } from "@/lib/auth/server"

type SessionUser = {
  id?: string
  email?: string
  name?: string
  role?: string | null
}

type AppRole =
  | "ADMIN_MANAGEMENT"
  | "SALES"
  | "INVENTORY"
  | "ACCOUNTING"
  | "OPERATIONS_DESIGN"
  | "CLIENT"

function normalizeAppRole(role?: string | null): AppRole {
  const normalized = role?.trim().toUpperCase()

  if (
    normalized === "ADMIN_MANAGEMENT" ||
    normalized === "SALES" ||
    normalized === "INVENTORY" ||
    normalized === "ACCOUNTING" ||
    normalized === "OPERATIONS_DESIGN" ||
    normalized === "CLIENT"
  ) {
    return normalized
  }

  if (normalized === "ADMIN" || normalized === "ANALYTICS") {
    return "ADMIN_MANAGEMENT"
  }

  return "CLIENT"
}

export type StorefrontSessionUser = {
  id: string
  authUserId: string | null
  email: string
  name: string
  role: AppRole
  status: string
}

async function getSessionUserFromTokenCookie(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const signedToken = cookieStore.get("__Secure-neon-auth.session_token")?.value

  if (!signedToken) {
    return null
  }

  const [token] = signedToken.split(".")

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

async function getVerifiedSessionUser(): Promise<SessionUser | null> {
  try {
    const { data } = await auth.getSession()
    const sessionUser = data?.user as SessionUser | undefined

    if (sessionUser?.id && sessionUser.email) {
      return sessionUser
    }
  } catch (error) {
    console.warn(
      "[storefront.auth] Falling back to database session lookup",
      error
    )
  }

  return getSessionUserFromTokenCookie()
}

export async function getCurrentStorefrontUser(): Promise<StorefrontSessionUser | null> {
  const sessionUser = await getVerifiedSessionUser()

  if (!sessionUser?.id || !sessionUser.email) {
    return null
  }

  const appUser =
    (await prisma.user.findUnique({
      where: { authUserId: sessionUser.id },
      select: {
        id: true,
        authUserId: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    })) ??
    (await prisma.user.findUnique({
      where: { email: sessionUser.email },
      select: {
        id: true,
        authUserId: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    }))

  if (!appUser || appUser.role !== "CLIENT" || appUser.status !== "ACTIVE") {
    if (!appUser) {
      if (!sessionUser.name) {
        return null
      }

      return {
        id: sessionUser.id,
        authUserId: sessionUser.id,
        email: sessionUser.email,
        name: sessionUser.name,
        role: normalizeAppRole(sessionUser.role),
        status: "ACTIVE",
      }
    }

    return {
      id: appUser.id,
      authUserId: appUser.authUserId,
      email: appUser.email,
      name: appUser.name,
      role: normalizeAppRole(appUser.role),
      status: appUser.status,
    }
  }

  return {
    id: appUser.id,
    authUserId: appUser.authUserId,
    email: appUser.email,
    name: appUser.name,
    role: normalizeAppRole(appUser.role),
    status: appUser.status,
  }
}

export async function getStorefrontSessionUser(): Promise<StorefrontSessionUser | null> {
  const user = await getCurrentStorefrontUser()

  if (!user || user.role !== "CLIENT" || user.status !== "ACTIVE") {
    return null
  }

  return user
}
