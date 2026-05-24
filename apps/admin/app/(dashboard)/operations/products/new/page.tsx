import { redirect } from "next/navigation"
import { prisma } from "@furnitrack/db"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { OPERATIONS_PRODUCT_CATEGORIES } from "@/lib/operations-products"
import { FinishedProductCreateForm } from "@/components/operations/FinishedProductCreateForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewFinishedProductPage() {
  const currentUser = await requireAuthenticatedAppUser()

  if (currentUser.role !== "ADMIN_MANAGEMENT" && currentUser.role !== "OPERATIONS_DESIGN") {
    redirect("/")
  }

  const [warehouses, rawMaterialRows] = await Promise.all([
    prisma.warehouse.findMany({
      select: {
        id: true,
        name: true,
        code: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.materialStock.findMany({
      select: {
        id: true,
        sku: true,
        itemName: true,
        availableQty: true,
        unitOfMeasure: true,
      },
      orderBy: {
        itemName: "asc",
      },
    }),
  ])

  const rawMaterials = rawMaterialRows.map((row) => ({
    ...row,
    availableQty: Number(row.availableQty),
  }))

  return (
    <main className="mx-auto max-w-[1400px] p-6 lg:p-8 space-y-8">
      <div>
        <Link
          href="/operations?tab=finished-products"
          className="inline-flex items-center gap-2 text-[13px] font-medium text-[#64748b] hover:text-[#0f172a] mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to operations
        </Link>
        <h1 className="text-[32px] font-bold tracking-tight text-[#0f172a]">Create new product</h1>
        <p className="mt-2 text-[15px] text-[#64748b] max-w-2xl leading-relaxed">
          Add a new finished product to your catalog and configure its stock settings. This will automatically sync with your storefront catalog.
        </p>
      </div>

      <FinishedProductCreateForm
        rawMaterials={rawMaterials}
        warehouses={warehouses}
        categories={OPERATIONS_PRODUCT_CATEGORIES}
      />
    </main>
  )
}
