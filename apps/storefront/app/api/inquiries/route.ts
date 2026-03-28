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

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
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
    customerName: normalizeText(body?.customerName),
    customerEmail: normalizeText(body?.customerEmail).toLowerCase(),
    customerPhone: normalizeText(body?.customerPhone),
    message: normalizeText(body?.message),
  }

  if (
    !payload.productId ||
    payload.customerName.length < 2 ||
    payload.customerName.length > 120 ||
    !isValidEmail(payload.customerEmail) ||
    payload.customerEmail.length > 255 ||
    payload.customerPhone.length < 7 ||
    payload.customerPhone.length > 40 ||
    payload.message.length < 5 ||
    payload.message.length > 2000
  ) {
    return NextResponse.json({ message: "Please complete all inquiry fields." }, { status: 400 })
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
