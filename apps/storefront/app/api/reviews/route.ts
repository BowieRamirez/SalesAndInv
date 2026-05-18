import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getStorefrontSessionUser } from "@/lib/auth/session"

export async function POST(request: Request) {
  const sessionUser = await getStorefrontSessionUser()

  if (!sessionUser) {
    return NextResponse.json({ message: "Please sign in before leaving a review." }, { status: 401 })
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin
  if (requestOrigin && requestOrigin !== appOrigin) {
    return NextResponse.json({ message: "Invalid request origin." }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const inquiryId = typeof body?.inquiryId === "string" ? body.inquiryId.trim() : ""
  const rating = typeof body?.rating === "number" ? Math.round(body.rating) : 0
  const comment = typeof body?.comment === "string" ? body.comment.trim().slice(0, 1000) : null

  if (!inquiryId) {
    return NextResponse.json({ message: "Order ID is required." }, { status: 400 })
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ message: "Rating must be between 1 and 5 stars." }, { status: 400 })
  }

  // Verify the inquiry is completed and belongs to this customer
  const rows = await prisma.$queryRaw<
    Array<{ id: string; productId: string; productSlug: string; status: string; statusNote: string | null; customerUserId: string | null; customerName: string }>
  >(Prisma.sql`
    SELECT
      ci.id,
      ci."productId",
      p.slug AS "productSlug",
      ci.status::text AS status,
      ci."statusNote",
      ci."customerUserId",
      ci."customerName"
    FROM public.customer_inquiries ci
    INNER JOIN public.products p ON p.id = ci."productId"
    WHERE ci.id = ${inquiryId}
    LIMIT 1
  `)

  const inquiry = rows[0]

  if (!inquiry) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 })
  }

  if (inquiry.customerUserId !== sessionUser.id) {
    return NextResponse.json({ message: "You can only review your own orders." }, { status: 403 })
  }

  if (!inquiry.statusNote?.includes("[[completed]]")) {
    return NextResponse.json({ message: "You can only review completed orders." }, { status: 400 })
  }

  // Check if already reviewed
  const existing = await prisma.$queryRaw<Array<{ id: string }>>(Prisma.sql`
    SELECT id FROM public.product_reviews WHERE "inquiryId" = ${inquiryId} LIMIT 1
  `)

  if (existing.length > 0) {
    return NextResponse.json({ message: "You have already reviewed this order.", alreadyReviewed: true }, { status: 409 })
  }

  // Insert the review
  await prisma.$executeRaw(Prisma.sql`
    INSERT INTO public.product_reviews (id, "productId", "inquiryId", "customerUserId", "customerName", rating, comment, "createdAt")
    VALUES (
      gen_random_uuid()::text,
      ${inquiry.productId},
      ${inquiryId},
      ${sessionUser.id},
      ${inquiry.customerName},
      ${rating},
      ${comment},
      CURRENT_TIMESTAMP
    )
  `)

  // Update product rating and reviewCount aggregate
  await prisma.$executeRaw(Prisma.sql`
    UPDATE public.products
    SET
      rating = (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM public.product_reviews
        WHERE "productId" = ${inquiry.productId}
      ),
      "reviewCount" = (
        SELECT COUNT(*) FROM public.product_reviews WHERE "productId" = ${inquiry.productId}
      ),
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = ${inquiry.productId}
  `)

  revalidatePath("/account/status")
  revalidatePath(`/shop/${inquiry.productSlug}`)

  return NextResponse.json({
    ok: true,
    productSlug: inquiry.productSlug,
    message: "Review submitted successfully.",
  })
}
