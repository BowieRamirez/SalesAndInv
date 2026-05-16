import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import { logAudit, prisma } from "@furnitrack/db"
import { APP_ROLES, type AppRole } from "@/lib/rbac"

const INTERNAL_ROLES = APP_ROLES.filter((role) => role !== "CLIENT")
const INTERNAL_ROLE_SET = new Set<AppRole>(INTERNAL_ROLES)

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/users", request.url)
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

function normalizeInternalRole(value: FormDataEntryValue | null): AppRole | null {
  const role = String(value ?? "").trim().toUpperCase() as AppRole
  return INTERNAL_ROLE_SET.has(role) ? role : null
}

async function updateAuthIdentity(params: {
  authUserId: string
  name: string
  role: AppRole
}) {
  await prisma.$executeRaw`
    UPDATE neon_auth."user"
    SET
      name = ${params.name},
      role = ${params.role},
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE id::text = ${params.authUserId}
  `
}

async function syncManagedUserRecord(params: {
  authUserId: string
  email: string
  name: string
  role: AppRole
  permissions?: Record<string, boolean> | null
}) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ authUserId: params.authUserId }, { email: params.email }],
    },
    select: { id: true },
  })

  if (existingUser) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        authUserId: params.authUserId,
        email: params.email,
        name: params.name,
        role: params.role,
        status: "ACTIVE",
        companyId: null,
        permissions: params.permissions ? params.permissions : undefined,
      },
    })

    return
  }

  await prisma.user.create({
    data: {
      id: params.authUserId,
      authUserId: params.authUserId,
      email: params.email,
      name: params.name,
      role: params.role,
      status: "ACTIVE",
      companyId: null,
      permissions: params.permissions ? params.permissions : undefined,
    },
  })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser || currentUser.role !== "ADMIN_MANAGEMENT") {
    return buildRedirect(request, "You must be signed in as an executive admin to update accounts.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const authUserId = String(formData.get("authUserId") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const name = String(formData.get("name") ?? "").trim()
  const role = normalizeInternalRole(formData.get("role"))

  let permissions: Record<string, boolean> | null = null
  if (role === "SALES" || role === "OPERATIONS_DESIGN" || role === "CUSTOM") {
    permissions = { audit: true }
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("tab_") && value === "on") {
        permissions[key.replace("tab_", "")] = true
      }
    }
  }

  if (!authUserId || !email || !name || !role) {
    return buildRedirect(request, "A valid account, name, and role are required.", "error")
  }

  if (currentUser.authUserId === authUserId && role !== "ADMIN_MANAGEMENT") {
    return buildRedirect(request, "Your own account must keep executive access.", "error")
  }

  if (currentUser.authUserId !== authUserId && role === "ADMIN_MANAGEMENT") {
    return buildRedirect(request, "Only the current executive account can keep the Admin / Management role.", "error")
  }

  try {
    await updateAuthIdentity({
      authUserId,
      name,
      role,
    })

    await syncManagedUserRecord({
      authUserId,
      email,
      name,
      role,
      permissions,
    })

    await logAudit({
      actorId: currentUser.authUserId,
      action: "USER_UPDATED",
      entityType: "USER",
      entityId: authUserId,
      metadata: {
        updatedEmail: email,
        updatedName: name,
        assignedRole: role,
        permissions,
      },
    })

    revalidatePath("/users")
    return buildRedirect(request, `Updated ${email} in Neon DB.`, "success")
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Neon DB could not update that account."

    return buildRedirect(request, message, "error")
  }
}
