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

export async function getCurrentStorefrontUser(): Promise<StorefrontSessionUser | null> {
  const { data } = await auth.getSession()
  const sessionUser = data?.user as SessionUser | undefined

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
