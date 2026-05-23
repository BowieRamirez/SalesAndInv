import { NextResponse } from "next/server"
import { Prisma, prisma } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"

export async function GET(request: Request) {
  const currentUser = await getAuthenticatedAppUser()
  if (!currentUser) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const inquiryId = searchParams.get("inquiryId")
  if (!inquiryId) return NextResponse.json({ message: "inquiryId required" }, { status: 400 })

  const materials = await prisma.$queryRaw<Array<{
    itemName: string
    sku: string
    quantityDisplay: string | null
    unitOfMeasure: string
  }>>(Prisma.sql`
    SELECT
      ms."itemName",
      ms.sku,
      pm."quantityDisplay",
      ms."unitOfMeasure"
    FROM public.customer_inquiries ci
    INNER JOIN public.products p ON p.id = ci."productId"
    INNER JOIN public.product_materials pm ON pm."productId" = p.id
    INNER JOIN public.material_stocks ms ON ms.id = pm."materialStockId"
    WHERE ci.id = ${inquiryId}
    ORDER BY ms."itemName" ASC
  `)

  return NextResponse.json({ materials })
}
