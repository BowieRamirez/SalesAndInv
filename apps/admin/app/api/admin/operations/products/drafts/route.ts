import { randomUUID } from "node:crypto"
import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"

type DraftProductRow = {
  id: string
  name: string | null
  payload: unknown
  updatedAt: Date
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

export async function GET() {
  const currentUser = await requireOperationsUser()

  if (!currentUser) {
    return forbidden("Only operations or executive admins can view finished product drafts.")
  }

  const rows = await prisma.$queryRaw<DraftProductRow[]>(Prisma.sql`
    SELECT id, name, payload, "updatedAt"
    FROM public.draft_products
    WHERE "createdById" = ${currentUser.id}
      AND "deletedAt" IS NULL
    ORDER BY "updatedAt" DESC
    LIMIT 8
  `)

  const drafts = rows.map((row) => ({
    ...(typeof row.payload === "object" && row.payload !== null ? row.payload : {}),
    id: row.id,
    savedAt: row.updatedAt.toISOString(),
    name: row.name ?? "",
  }))

  return NextResponse.json({ drafts })
}

export async function POST(request: Request) {
  const currentUser = await requireOperationsUser()

  if (!currentUser) {
    return forbidden("Only operations or executive admins can save finished product drafts.")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return forbidden("Invalid request origin.", 400)
  }

  const body = await request.json().catch(() => null)
  const draft = body && typeof body === "object" && "draft" in body ? body.draft : null

  if (!draft || typeof draft !== "object") {
    return NextResponse.json({ error: "Draft payload is required." }, { status: 400 })
  }

  const draftRecord = draft as Record<string, unknown>
  const draftId = typeof draftRecord.id === "string" && draftRecord.id.trim() ? draftRecord.id.trim() : randomUUID()
  const name = typeof draftRecord.name === "string" && draftRecord.name.trim() ? draftRecord.name.trim() : null
  const savedAt = new Date().toISOString()
  const payload = {
    ...draftRecord,
    id: draftId,
    savedAt,
  }

  const rows = await prisma.$queryRaw<DraftProductRow[]>(Prisma.sql`
    INSERT INTO public.draft_products (
      id,
      "createdById",
      name,
      payload,
      "createdAt",
      "updatedAt",
      "deletedAt"
    )
    VALUES (
      ${draftId},
      ${currentUser.id},
      ${name},
      ${JSON.stringify(payload)}::jsonb,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP,
      NULL
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      payload = EXCLUDED.payload,
      "updatedAt" = CURRENT_TIMESTAMP,
      "deletedAt" = NULL
    WHERE public.draft_products."createdById" = ${currentUser.id}
    RETURNING id, name, payload, "updatedAt"
  `)

  const row = rows[0]

  if (!row) {
    return NextResponse.json({ error: "Draft could not be saved." }, { status: 404 })
  }

  return NextResponse.json({
    draft: {
      ...(typeof row.payload === "object" && row.payload !== null ? row.payload : {}),
      id: row.id,
      savedAt: row.updatedAt.toISOString(),
      name: row.name ?? "",
    },
  })
}
