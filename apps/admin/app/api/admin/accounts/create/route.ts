import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { getAuthenticatedAppUser } from "@/lib/auth/session"
import { logAudit, prisma } from "@furnitrack/db"
import { APP_ROLES, type AppRole } from "@/lib/rbac"

const INTERNAL_ROLES = APP_ROLES.filter((role) => role !== "CLIENT")
const STAFF_ROLE_SET = new Set<AppRole>(
  INTERNAL_ROLES.filter((role) => role !== "ADMIN_MANAGEMENT")
)
const AUTH_REQUEST_TIMEOUT_MS = 15000

function buildRedirect(
  request: Request,
  message: string,
  tone: "success" | "error"
) {
  const url = new URL("/users", request.url)
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

function normalizeStaffRole(value: FormDataEntryValue | null): AppRole | null {
  const role = String(value ?? "")
    .trim()
    .toUpperCase() as AppRole
  return STAFF_ROLE_SET.has(role) ? role : null
}

function getNeonAuthBaseUrl() {
  return process.env.NEON_AUTH_BASE_URL?.trim().replace(/\/+$/, "")
}

async function fetchWithTimeout(input: string, init: RequestInit) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), AUTH_REQUEST_TIMEOUT_MS)

  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

async function findAuthIdentityByEmail(email: string) {
  const rows = await prisma.$queryRaw<
    Array<{ authUserId: string; email: string; name: string | null }>
  >`
    SELECT
      id::text AS "authUserId",
      LOWER(email) AS email,
      name
    FROM neon_auth."user"
    WHERE LOWER(email) = LOWER(${email})
    LIMIT 1
  `

  return rows[0] ?? null
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
      permissions: params.permissions ? params.permissions : undefined,
    },
  })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser || currentUser.role !== "ADMIN_MANAGEMENT") {
    return buildRedirect(
      request,
      "You must be signed in as an executive admin to add accounts.",
      "error"
    )
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()
  const password = String(formData.get("password") ?? "")
  const role = normalizeStaffRole(formData.get("role"))

  let permissions: Record<string, boolean> | null = null
  if (role === "CUSTOM") {
    permissions = { audit: true }
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("tab_") && value === "on") {
        permissions[key.replace("tab_", "")] = true
      }
    }
  }

  if (!name || !email || !password || !role) {
    return buildRedirect(
      request,
      "Name, email, password, and a non-executive role are required.",
      "error"
    )
  }

  if (password.length < 8) {
    return buildRedirect(
      request,
      "Use a password with at least 8 characters.",
      "error"
    )
  }

  const existingIdentity = await findAuthIdentityByEmail(email)

  if (existingIdentity) {
    return buildRedirect(request, "That email already has an account.", "error")
  }

  const authUrl = getNeonAuthBaseUrl()

  if (!authUrl) {
    return buildRedirect(
      request,
      "Neon Auth is not configured for this admin app.",
      "error"
    )
  }

  try {
    const signUpResponse = await fetchWithTimeout(`${authUrl}/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: authUrl,
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
      cache: "no-store",
    })

    const rawBody = await signUpResponse.text()
    let signUpResult: Record<string, unknown> = {}

    try {
      signUpResult = rawBody ? JSON.parse(rawBody) : {}
    } catch {
      signUpResult = { message: rawBody }
    }

    if (!signUpResponse.ok) {
      return buildRedirect(
        request,
        (signUpResult.message as string) ??
          "Neon Auth could not create the account.",
        "error"
      )
    }

    const authIdentity = await findAuthIdentityByEmail(email)

    if (!authIdentity) {
      return buildRedirect(
        request,
        "The account was created, but Neon did not return the new user id.",
        "error"
      )
    }

    await updateAuthIdentity({
      authUserId: authIdentity.authUserId,
      name,
      role,
    })

    await syncManagedUserRecord({
      authUserId: authIdentity.authUserId,
      email,
      name,
      role,
      permissions,
    })

    await logAudit({
      actorId: currentUser.authUserId,
      action: "USER_CREATED",
      entityType: "USER",
      entityId: authIdentity.authUserId,
      metadata: {
        createdEmail: email,
        createdName: name,
        assignedRole: role,
        permissions,
      },
    })

    revalidatePath("/users")
    return buildRedirect(
      request,
      `Created ${email} and synced it to Neon DB.`,
      "success"
    )
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "Neon Auth did not respond. Check NEON_AUTH_BASE_URL and try again."
        : error instanceof Error && error.message
          ? error.message
          : "Neon Auth could not create the account."

    return buildRedirect(request, message, "error")
  }
}
