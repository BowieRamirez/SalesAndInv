import { redirect } from "next/navigation"
import { Prisma, prisma } from "@furnitrack/db"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { getInquiryWorkflowRows } from "@/lib/inquiries"
import { ROLE_REDIRECT } from "@/lib/rbac"
import { formatInquiryWorkflowStatus } from "@furnitrack/validators"
import { ApprovalsTable } from "@/components/ApprovalsTable"
import { ProductEditRequestsTable, type ProductEditRequest } from "@/components/approvals/ProductEditRequestsTable"

export const dynamic = "force-dynamic"

type EditRequestRow = {
  id: string
  productId: string
  productName: string
  requestedByName: string
  requestedById: string
  status: string
  payload: unknown
  remarks: string | null
  createdAt: Date
  // Current product snapshot for diff view
  currentName: string
  currentCategory: string
  currentDescription: string
  currentImages: unknown
  currentBadge: string | null
  currentPrice: number
  currentIsPublished: boolean
  currentWarehouseName: string
}

async function getPendingProductEditRequests(): Promise<ProductEditRequest[]> {
  const rows = await prisma.$queryRaw<EditRequestRow[]>(Prisma.sql`
    SELECT
      per.id,
      per."productId",
      p.name AS "productName",
      u.name AS "requestedByName",
      per."requestedById",
      per.status,
      per.payload,
      per.remarks,
      per."createdAt",
      p.name AS "currentName",
      p.category AS "currentCategory",
      p.description AS "currentDescription",
      p.images AS "currentImages",
      p.badge AS "currentBadge",
      p.price::double precision AS "currentPrice",
      p."isPublished" AS "currentIsPublished",
      w.name AS "currentWarehouseName"
    FROM public.product_edit_requests per
    INNER JOIN public.products p ON p.id = per."productId"
    INNER JOIN public.users u ON u.id = per."requestedById"
    INNER JOIN public.product_stocks ps ON ps.id = p."productStockId"
    INNER JOIN public.warehouses w ON w.id = ps."warehouseId"
    WHERE per.status = 'PENDING'
    ORDER BY per."createdAt" ASC
  `)

  return rows.map((row) => {
    const images = Array.isArray(row.currentImages)
      ? row.currentImages.filter((x): x is string => typeof x === "string")
      : []

    return {
      id: row.id,
      productId: row.productId,
      productName: row.productName,
      requestedByName: row.requestedByName,
      requestedById: row.requestedById,
      status: row.status,
      payload: (typeof row.payload === "object" && row.payload !== null ? row.payload : {}) as ProductEditRequest["payload"],
      current: {
        name: row.currentName,
        category: row.currentCategory,
        description: row.currentDescription,
        imageUrl: images[0] ?? "",
        badge: row.currentBadge,
        price: Number(row.currentPrice),
        isPublished: row.currentIsPublished,
        warehouseName: row.currentWarehouseName,
      },
      remarks: row.remarks,
      createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
    }
  })
}

export default async function AdminApprovalsPage() {
  const currentUser = await requireAuthenticatedAppUser()

  if (currentUser.role !== "ADMIN_MANAGEMENT") {
    redirect(ROLE_REDIRECT[currentUser.role])
  }

  const [inquiries, productEditRequests] = await Promise.all([
    getInquiryWorkflowRows(),
    getPendingProductEditRequests(),
  ])

  const stages = [
    "RECEIVED",
    "PENDING_INVENTORY_APPROVAL",
    "PENDING_ACCOUNTING_APPROVAL",
    "GETTING_READY_FOR_BUILDING",
    "READY_FOR_SHIPPING",
    "COMPLETED",
  ] as const

  return (
    <main className="min-h-screen bg-[#fcfcfc] p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-[28px] font-semibold text-[#111827]">Approval Oversight</h1>
          <p className="mt-2 max-w-[760px] text-[14px] leading-[22px] text-[#6b7280]">
            Management can monitor every customer order approval stage here across sales, inventory, accounting,
            operations, shipping, and completion. Product edits from operations also require your approval below.
          </p>
        </div>

        {/* Product Edit Requests */}
        <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-[20px] font-semibold text-[#111827]">Pending product edits</h2>
              <p className="mt-1 text-[13px] text-[#6b7280]">
                Operations admin submitted these product changes for your review. Review the proposed edits and approve or reject them.
              </p>
            </div>
            {productEditRequests.length > 0 && (
              <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-full bg-amber-500 px-2 text-[12px] font-bold text-white">
                {productEditRequests.length}
              </span>
            )}
          </div>
          <ProductEditRequestsTable requests={productEditRequests} />
        </section>

        {/* Order workflow stats */}
        <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-6">
          {stages.map((status) => (
            <div key={status} className="flex min-h-[100px] flex-col justify-between rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">{formatInquiryWorkflowStatus(status)}</p>
              <p className="mt-3 text-[28px] font-semibold text-[#111827]">
                {inquiries.filter((inquiry) => inquiry.workflowStatus === status).length}
              </p>
            </div>
          ))}
        </div>

        <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-[20px] font-semibold text-[#111827]">All approval-stage orders</h2>
          </div>
          <ApprovalsTable inquiries={inquiries} />
        </section>
      </div>
    </main>
  )
}
