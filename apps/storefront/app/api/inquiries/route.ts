import { randomUUID } from "node:crypto"
import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getStorefrontSessionUser } from "@/lib/auth/session"

type InquiryPayload = {
  productId?: unknown
  customerName?: unknown
  customerEmail?: unknown
  customerPhone?: unknown
  message?: unknown
}

const MAX_NAME_LENGTH = 50
const MAX_EMAIL_LENGTH = 50
const MAX_PHONE_LENGTH = 15

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function normalizeName(value: unknown) {
  return normalizeText(value)
    .replace(/[^A-Za-z\s'-]/g, "")
    .replace(/\s{2,}/g, " ")
    .slice(0, MAX_NAME_LENGTH)
    .trim()
}

function normalizePhone(value: unknown) {
  return normalizeText(value).replace(/\D/g, "").slice(0, MAX_PHONE_LENGTH)
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidName(value: string) {
  return /^[A-Za-z\s'-]{2,50}$/.test(value)
}

function isValidPhone(value: string) {
  return /^\d{7,15}$/.test(value)
}

export async function POST(request: Request) {
  const sessionUser = await getStorefrontSessionUser()

  if (!sessionUser) {
    return NextResponse.json(
      { message: "Please sign in with your customer account before sending an inquiry." },
      { status: 401 },
    )
  }

  const body = (await request.json().catch(() => null)) as InquiryPayload | null
  const payload = {
    productId: normalizeText(body?.productId),
    customerName: normalizeName(body?.customerName),
    customerEmail: normalizeText(body?.customerEmail).toLowerCase().slice(0, MAX_EMAIL_LENGTH),
    customerPhone: normalizePhone(body?.customerPhone),
    message: normalizeText(body?.message),
  }

  if (
    !payload.productId ||
    !isValidName(payload.customerName) ||
    !isValidEmail(payload.customerEmail) ||
    payload.customerEmail.length > MAX_EMAIL_LENGTH ||
    !isValidPhone(payload.customerPhone) ||
    payload.message.length < 5 ||
    payload.message.length > 2000
  ) {
    return NextResponse.json(
      { message: "Please enter a valid name, email, phone number, and inquiry message." },
      { status: 400 }
    )
  }

  const products = await prisma.$queryRaw<{ id: string; name: string }[]>(Prisma.sql`
    SELECT id, name
    FROM public.products
    WHERE id = ${payload.productId}
      AND "isPublished" = true
    LIMIT 1
  `)

  const product = products[0]

  if (!product) {
    return NextResponse.json({ message: "That product is no longer available for inquiry." }, { status: 404 })
  }

  const inquiryId = randomUUID()
  const messageId = randomUUID()

  // Generate a human-readable inquiry number using the DB sequence (atomic, no race conditions)
  const yearStr = new Date().getFullYear().toString()

  let inquiryNumber: string | null = null
  await prisma.$transaction(async (tx) => {
    const seqRows = await tx.$queryRaw<Array<{ next_val: number }>>(Prisma.sql`
      SELECT nextval('public.inquiry_number_seq')::int AS next_val
    `)
    const nextSeq = seqRows[0]?.next_val ?? 1
    inquiryNumber = `INQ-${yearStr}-${String(nextSeq).padStart(5, "0")}`

    await tx.$executeRaw(Prisma.sql`
      INSERT INTO public.customer_inquiries (
        id,
        "productId",
        "customerUserId",
        "customerName",
        "customerEmail",
        "customerPhone",
        message,
        status,
        "inquiryNumber",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${inquiryId},
        ${product.id},
        ${sessionUser.id},
        ${payload.customerName},
        ${payload.customerEmail.toLowerCase()},
        ${payload.customerPhone},
        ${payload.message},
        'RECEIVED'::"InquiryStatus",
        ${inquiryNumber},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
    `)

    await tx.$executeRaw(Prisma.sql`
      INSERT INTO public.order_chat_messages (id, inquiry_id, sender_user_id, sender_role, body)
      VALUES (${messageId}, ${inquiryId}, ${sessionUser.id}, 'CLIENT', ${payload.message})
    `)

    // Approval history entry: order created (SUBMITTED action)
    await tx.$executeRaw(Prisma.sql`
      INSERT INTO public.approval_history (id, module, "recordId", action, "fromStatus", "toStatus", remarks, "actedById", "actedAt")
      VALUES (
        ${randomUUID()},
        'CUSTOMER_INQUIRY'::"ApprovalModule",
        ${inquiryId},
        'SUBMITTED'::"ApprovalAction",
        NULL,
        'RECEIVED',
        ${`Inquiry ${inquiryNumber} created by customer`},
        ${sessionUser.id},
        CURRENT_TIMESTAMP
      )
    `)
  })

  return NextResponse.json({
    ok: true,
    inquiryId,
    inquiryNumber,
    productName: product.name,
  })
}
