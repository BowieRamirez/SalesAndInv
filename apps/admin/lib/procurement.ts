import { Prisma, prisma } from "@furnitrack/db"

export async function generatePoNumber() {
  const datePart = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replaceAll("-", "")
  const prefix = `PO-${datePart}-`

  const latest = await prisma.$queryRaw<Array<{ poNumber: string }>>(Prisma.sql`
    SELECT "poNumber"
    FROM public.purchase_orders
    WHERE "poNumber" LIKE ${`${prefix}%`}
    ORDER BY "poNumber" DESC
    LIMIT 1
  `)

  const latestSequence = Number(latest[0]?.poNumber.slice(prefix.length) ?? "0")
  const nextSequence = Number.isFinite(latestSequence) ? latestSequence + 1 : 1

  return `${prefix}${String(nextSequence).padStart(4, "0")}`
}

export type SupplierAddressRow = {
  id: string
  supplierId: string
  label: string | null
  address: string
  city: string | null
  province: string | null
  country: string | null
  postalCode: string | null
  isMain: boolean
}

export type SupplierProductRow = {
  id: string
  supplierId: string
  materialStockId: string | null
  materialName: string
  unitCost: number | null
  unitOfMeasure: string | null
  notes: string | null
}

export type SupplierRow = {
  id: string
  name: string
  contactPerson: string | null
  email: string | null
  phone: string | null
  address?: string | null
  notes: string | null
  isActive: boolean
  createdAt: Date
  addresses: SupplierAddressRow[]
  products: SupplierProductRow[]
}

export type PurchaseOrderItemRow = {
  id: string
  materialStockId: string
  itemName: string
  sku: string
  unitOfMeasure: string
  quantityOrdered: number
  quantityReceived: number
  unitCost: number | null
  lineTotal: number
}

export type PurchaseOrderRow = {
  id: string
  poNumber: string
  supplierName: string | null
  requestedByName: string
  status: string
  itemCount: number
  totalAmount: number
  remarks: string | null
  expectedDeliveryAt: Date | null
  createdAt: Date
}

export type PurchaseOrderDetailRow = PurchaseOrderRow & {
  items: PurchaseOrderItemRow[]
}

export async function getSuppliers(): Promise<SupplierRow[]> {
  const [suppliers, addresses, products] = await Promise.all([
    prisma.$queryRaw<Array<Omit<SupplierRow, "addresses" | "products">>>(Prisma.sql`
      SELECT id, name, "contactPerson", email, phone, notes, "isActive", "createdAt"
      FROM public.suppliers
      ORDER BY name ASC
    `),
    prisma.$queryRaw<SupplierAddressRow[]>(Prisma.sql`
      SELECT id, "supplierId", label, address, city, province, country, "postalCode", "isMain"
      FROM public.supplier_addresses
      ORDER BY "isMain" DESC, "createdAt" ASC
    `),
    prisma.$queryRaw<Array<{
      id: string
      supplierId: string
      materialStockId: string | null
      materialName: string
      unitCost: string | null
      unitOfMeasure: string | null
      notes: string | null
    }>>(Prisma.sql`
      SELECT id, "supplierId", "materialStockId", "materialName",
             "unitCost"::text AS "unitCost", "unitOfMeasure", notes
      FROM public.supplier_products
      ORDER BY "materialName" ASC
    `),
  ])

  const addressesBySupplierId = new Map<string, SupplierAddressRow[]>()
  for (const a of addresses) {
    const list = addressesBySupplierId.get(a.supplierId) ?? []
    list.push(a)
    addressesBySupplierId.set(a.supplierId, list)
  }

  const productsBySupplierId = new Map<string, SupplierProductRow[]>()
  for (const p of products) {
    const list = productsBySupplierId.get(p.supplierId) ?? []
    list.push({ ...p, unitCost: p.unitCost != null ? Number(p.unitCost) : null })
    productsBySupplierId.set(p.supplierId, list)
  }

  return suppliers.map((s) => ({
    ...s,
    addresses: addressesBySupplierId.get(s.id) ?? [],
    products: productsBySupplierId.get(s.id) ?? [],
  }))
}
