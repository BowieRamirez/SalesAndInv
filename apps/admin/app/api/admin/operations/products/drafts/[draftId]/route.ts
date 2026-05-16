import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"

type RouteContext = {
  params: Promise<{
    draftId: string
  }>
}

function forbidden(message: string, status = 403) {
  return NextResponse.json({ error: message }, { status })
}

async function requireOperationsUser() {
  const currentUser = await getAuthenticatedAppUser()

  if (!currentUser || !["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
    return null
  }

  return currentUser
}

export async function DELETE(request: Request, context: RouteContext) {
  const currentUser = await requireOperationsUser()

  if (!currentUser) {
    return forbidden("Only operations or executive admins can delete finished product drafts.")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return forbidden("Invalid request origin.", 400)
  }

  const { draftId } = await context.params

  if (!draftId) {
    return NextResponse.json({ error: "Draft id is required." }, { status: 400 })
  }

  await prisma.$executeRaw(Prisma.sql`
    UPDATE public.draft_products
    SET "deletedAt" = CURRENT_TIMESTAMP,
        "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = ${draftId}
      AND "createdById" = ${currentUser.id}
      AND "deletedAt" IS NULL
  `)

  return NextResponse.json({ ok: true })
}
