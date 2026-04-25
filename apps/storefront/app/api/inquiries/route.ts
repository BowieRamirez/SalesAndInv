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

  await prisma.$executeRaw(Prisma.sql`
    INSERT INTO public.customer_inquiries (
      id,
      "productId",
      "customerUserId",
      "customerName",
      "customerEmail",
      "customerPhone",
      message,
      status,
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
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    )
  `)

  return NextResponse.json({
    ok: true,
    inquiryId,
    productName: product.name,
  })
}
