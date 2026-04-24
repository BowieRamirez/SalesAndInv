import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { prisma } from "@furnitrack/db"
import { auth } from "@/lib/auth/server"
import { normalizeAppRole, type AppRole } from "@/lib/rbac"

type SessionUser = {
  id?: string
  email?: string
  name?: string
  role?: string | null
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
}

function isInternalRole(role: AppRole) {
  return role !== "CLIENT"
}

function isExpired(accessExpiresAt: Date | null) {
  return Boolean(accessExpiresAt && accessExpiresAt.getTime() <= Date.now())
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

    if (sessionUser?.id) {
      return sessionUser
    }
  } catch (error) {
    console.warn("[admin.auth] Falling back to database session lookup", error)
  }

  return getSessionUserFromTokenCookie()
}

export async function getCurrentAdminPortalUser(): Promise<AuthenticatedAppUser | null> {
  const sessionUser = await getVerifiedSessionUser()

  if (!sessionUser?.id) {
    return null
  }

  const appUser =
    (await prisma.user.findUnique({
      where: { authUserId: sessionUser.id },
      include: {
        company: {
          select: {
            code: true,
          },
        },
      },
    })) ??
    (sessionUser.email
      ? await prisma.user.findUnique({
          where: { email: sessionUser.email },
          include: {
            company: {
              select: {
                code: true,
              },
            },
          },
        })
      : null)

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
    companyCode: appUser.company?.code ?? null,
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
