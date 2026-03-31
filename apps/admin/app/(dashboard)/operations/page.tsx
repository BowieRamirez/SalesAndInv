import { redirect } from "next/navigation"
import { prisma, type Prisma } from "@furnitrack/db"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { FinishedProductsManager } from "@/components/operations/FinishedProductsManager"
import { MaterialSelector } from "@/components/operations/MaterialSelector"
import { ROLE_REDIRECT } from "@/lib/rbac"
import { OPERATIONS_DEFAULT_TAB, OPERATIONS_PRODUCT_CATEGORIES } from "@/lib/operations-products"

type OperationsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

type ProductCardData = {
  id: string
  stockItemId: string
  name: string
  category: string
  price: number
  badge: string | null
  description: string
  isPublished: boolean
  imageUrl: string
  warehouseName: string
  sku: string
  availableQty: number
  reorderThreshold: number
  materialSummary: string
  recipeCount: number
  recipeDetails: Array<{
    id: string
    itemName: string
    sku: string
    quantityDisplay: string | null
    notes: string | null
  }>
}

const OPERATIONS_TABS = new Set(["design", "new-products", "finished-products", "delivery", "company-code"])

function getSearchValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

function resolveTab(tab?: string | string[]) {
  const value = Array.isArray(tab) ? tab[0] : tab

  if (!value) {
    return OPERATIONS_DEFAULT_TAB
  }

  if (value === "design") {
    return OPERATIONS_DEFAULT_TAB
  }

  return OPERATIONS_TABS.has(value) ? value : OPERATIONS_DEFAULT_TAB
}

function asNumber(value: Prisma.Decimal | number | string | null | undefined) {
  if (value == null) {
    return 0
  }

  return Number(value)
}

function asImageUrl(value: Prisma.JsonValue | null) {
  if (!Array.isArray(value)) {
    return ""
  }

  return value.find((entry): entry is string => typeof entry === "string") ?? ""
}

function PlaceholderCard({
  title,
}: {
  title: string
}) {
  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white p-8 shadow-sm">
      <h3 className="text-[16px] font-semibold text-[#111827]">{title}</h3>
    </div>
  )
}

function StatCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-3xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
      <p className="text-[12px] uppercase tracking-[0.16em] text-[#94a3b8]">{label}</p>
      <p className="mt-3 text-[30px] font-semibold text-[#0f172a]">{value}</p>
    </div>
  )
}

async function getOperationsWorkspaceData() {
  const [warehouses, rawMaterials, products, recipes] = await Promise.all([
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
    prisma.$queryRaw<
      Array<{
        id: string
        sku: string
        itemName: string
        availableQty: number
        unitOfMeasure: string
      }>
    >`
      SELECT
        id,
        sku,
        "itemName",
        "availableQty",
        "unitOfMeasure"
      FROM public.stock_items
      WHERE "itemType" = 'RAW_MATERIAL'::"InventoryItemType"
      ORDER BY "itemName" ASC
    `,
    prisma.$queryRaw<
      Array<{
        id: string
        stockItemId: string
        name: string
        category: string
        price: Prisma.Decimal | number | string
        badge: string | null
        description: string
        isPublished: boolean
        images: Prisma.JsonValue | null
        warehouseName: string
        sku: string
        availableQty: number
        reorderThreshold: number
        materialSummary: string
        recipeCount: number
      }>
    >`
      SELECT
        p.id,
        p."stockItemId",
        p.name,
        p.category,
        p.price,
        p.badge,
        p.description,
        p."isPublished",
        p.images,
        w.name AS "warehouseName",
        s.sku,
        s."availableQty",
        s."reorderThreshold",
        p.material AS "materialSummary",
        COALESCE(recipe_counts."recipeCount", 0)::int AS "recipeCount"
      FROM public.products p
      INNER JOIN public.stock_items s
        ON s.id = p."stockItemId"
      INNER JOIN public.warehouses w
        ON w.id = s."warehouseId"
      LEFT JOIN LATERAL (
        SELECT COUNT(*)::int AS "recipeCount"
        FROM public.product_materials pm
        WHERE pm."productId" = p.id
      ) recipe_counts ON TRUE
      ORDER BY p."createdAt" DESC, p.name ASC
    `,
    prisma.$queryRaw<
      Array<{
        productId: string
        id: string
        itemName: string
        sku: string
        quantityDisplay: string | null
        notes: string | null
      }>
    >`
      SELECT
        pm."productId" AS "productId",
        si.id,
        si."itemName",
        si.sku,
        pm."quantityDisplay",
        pm.notes
      FROM public.product_materials pm
      INNER JOIN public.stock_items si
        ON si.id = pm."stockItemId"
      ORDER BY pm."createdAt" ASC
    `,
  ])

  const recipeMap = recipes.reduce<Record<string, ProductCardData["recipeDetails"]>>((accumulator, recipe) => {
    const current = accumulator[recipe.productId] ?? []
    current.push({
      id: recipe.id,
      itemName: recipe.itemName,
      sku: recipe.sku,
      quantityDisplay: recipe.quantityDisplay,
      notes: recipe.notes,
    })
    accumulator[recipe.productId] = current
    return accumulator
  }, {})

  const finishedProducts: ProductCardData[] = products.map((product) => ({
    id: product.id,
    stockItemId: product.stockItemId,
    name: product.name,
    category: product.category,
    price: asNumber(product.price),
    badge: product.badge,
    description: product.description,
    isPublished: product.isPublished,
    imageUrl: asImageUrl(product.images),
    warehouseName: product.warehouseName,
    sku: product.sku,
    availableQty: product.availableQty,
    reorderThreshold: product.reorderThreshold,
    materialSummary: product.materialSummary,
    recipeCount: product.recipeCount,
    recipeDetails: recipeMap[product.id] ?? [],
  }))

  return {
    warehouses,
    rawMaterials,
    finishedProducts,
  }
}

export const dynamic = "force-dynamic"

export default async function OperationsDashboard({ searchParams }: OperationsPageProps) {
  const currentUser = await requireAuthenticatedAppUser()

  if (!["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT"].includes(currentUser.role)) {
    redirect(ROLE_REDIRECT[currentUser.role])
  }

  const resolvedSearchParams = searchParams ? await searchParams : {}
  const activeTab = resolveTab(resolvedSearchParams.tab)
  const message = getSearchValue(resolvedSearchParams.message)
  const tone = getSearchValue(resolvedSearchParams.tone) === "error" ? "error" : "success"
  const { warehouses, rawMaterials, finishedProducts } = await getOperationsWorkspaceData()
  const publishedProducts = finishedProducts.filter((product) => product.isPublished).length

  return (
    <main className="min-h-screen overflow-auto bg-[#fcfcfc] p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-[28px] font-semibold text-[#111827]">Operations Product Workspace</h1>
        </div>

        {message ? (
          <div
            className={`rounded-2xl border px-5 py-4 text-[14px] ${
              tone === "error"
                ? "border-[#fecaca] bg-[#fff1f2] text-[#9f1239]"
                : "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
            }`}
          >
            {message}
          </div>
        ) : null}

        {(activeTab === "new-products" || activeTab === "finished-products") && (
          <div className="grid gap-5 md:grid-cols-3">
            <StatCard
              label="Catalog Products"
              value={finishedProducts.length}
            />
            <StatCard
              label="Published"
              value={publishedProducts}
            />
            <StatCard
              label="Raw Materials"
              value={rawMaterials.length}
            />
          </div>
        )}

        {activeTab === "new-products" && (
          <div className="space-y-6">
            <section className="rounded-[28px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <h2 className="text-[22px] font-semibold text-[#111827]">Create finished product</h2>
                </div>
                <div className="rounded-2xl border border-[#dbe4f0] bg-[#f8fafc] px-4 py-3 text-[13px] text-[#475569]">
                  Neon `products` and `stock_items`
                </div>
              </div>

              {rawMaterials.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-[#fca5a5] bg-[#fff7f7] p-6 text-[14px] text-[#b91c1c]">
                  No raw materials exist in inventory yet, so finished products cannot be created. Add the needed
                  materials in Inventory first.
                </div>
              ) : null}

              <form method="post" action="/api/admin/operations/products/create" className="mt-6 space-y-6">
                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="grid gap-4 rounded-3xl border border-[#e2e8f0] bg-[#fbfdff] p-5">
                    <div>
                      <h3 className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">
                        Catalog details
                      </h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Product name</span>
                        <input
                          name="name"
                          placeholder="Executive desk"
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Storefront category</span>
                        <select
                          name="category"
                          defaultValue={OPERATIONS_PRODUCT_CATEGORIES[0]}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        >
                          {OPERATIONS_PRODUCT_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Warehouse</span>
                        <select
                          name="warehouseId"
                          defaultValue={warehouses[0]?.id ?? ""}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        >
                          {warehouses.map((warehouse) => (
                            <option key={warehouse.id} value={warehouse.id}>
                              {warehouse.name} ({warehouse.code})
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Price</span>
                        <input
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="15000"
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="md:col-span-2 grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Image URL</span>
                        <input
                          name="imageUrl"
                          placeholder="https://example.com/product-image.jpg"
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="md:col-span-2 grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Description</span>
                        <textarea
                          name="description"
                          rows={5}
                          placeholder="Describe the finished product as it should appear in the storefront."
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid gap-4 rounded-3xl border border-[#e2e8f0] bg-[#fbfdff] p-5">
                    <div>
                      <h3 className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">
                        Stock and storefront settings
                      </h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Opening stock</span>
                        <input
                          name="openingQty"
                          type="number"
                          min="0"
                          defaultValue={0}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Reorder threshold</span>
                        <input
                          name="reorderThreshold"
                          type="number"
                          min="0"
                          defaultValue={10}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Width (cm)</span>
                        <input
                          name="widthCm"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={0}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Depth (cm)</span>
                        <input
                          name="depthCm"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={0}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Height (cm)</span>
                        <input
                          name="heightCm"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={0}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Weight (kg)</span>
                        <input
                          name="weightKg"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={0}
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Unit of measure</span>
                        <input
                          name="unitOfMeasure"
                          defaultValue="pcs"
                          placeholder="pcs"
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Badge</span>
                        <input
                          name="badge"
                          placeholder="SALE, HOT, BEST_SELLER"
                          className="w-full rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a]"
                        />
                      </label>
                    </div>
                    <label className="inline-flex items-center gap-3 rounded-2xl border border-[#dbe4f0] bg-white px-4 py-3 text-[14px] text-[#334155]">
                      <input type="checkbox" name="isPublished" defaultChecked className="h-4 w-4" />
                      Publish this product to the customer storefront immediately.
                    </label>
                  </div>
                </div>

                <MaterialSelector materials={rawMaterials} />

                <div className="flex items-center justify-between gap-4 rounded-3xl border border-[#e2e8f0] bg-[#fbfdff] px-5 py-4">
                  <button
                    type="submit"
                    disabled={rawMaterials.length === 0}
                    className="rounded-2xl bg-[#111827] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#111827]/90 disabled:cursor-not-allowed disabled:bg-[#cbd5e1]"
                  >
                    Create finished product
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}

        {activeTab === "finished-products" && (
          <FinishedProductsManager products={finishedProducts} />
        )}

        {activeTab === "delivery" && (
          <PlaceholderCard
            title="Delivery Schedule"
          />
        )}

        {activeTab === "company-code" && (
          <PlaceholderCard
            title="Company Code Checks"
          />
        )}
      </div>
    </main>
  )
}
