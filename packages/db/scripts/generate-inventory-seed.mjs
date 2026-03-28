import fs from "node:fs"
import path from "node:path"

const sourcePath =
  process.argv[2] ??
  "C:/Users/bowie ramirez/Downloads/sales_inventory_structured.json"
const format = process.argv.includes("--sql") ? "sql" : "json"

const raw = fs.readFileSync(sourcePath, "utf8")
const workbook = JSON.parse(raw)

const priceBook = {
  executive_table: [16768.42, 43799.0, 22350.0],
  office_table: [10888.0, 12704.0, 12460.35],
  conference_table: [41317.5],
  reception_table: [32305.0],
  office_partition: [56773.0, 31850.0],
  office_cubicle: [52668.0],
  round_table: [10000.0],
  mobile_pedestal: [10920.0],
  cabinet: [82350.0],
  center_table: [14820.0],
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_")
}

function normalizeName(value) {
  return value.trim().replace(/\s+/g, " ").toUpperCase()
}

function escapeSql(value) {
  return value.replace(/'/g, "''")
}

function toNullableSql(value) {
  return value == null ? "NULL" : `'${escapeSql(String(value))}'`
}

function toNumericSql(value) {
  return value == null || Number.isNaN(Number(value)) ? "NULL" : String(Number(value))
}

function parseDimensions(value) {
  if (!value) {
    return { widthCm: 120, depthCm: 60, heightCm: 75, weightKg: 30 }
  }

  const normalized = value.toUpperCase().replace(/,/g, ".")

  if (normalized.includes("DIAMETER")) {
    const match = normalized.match(/(\d+(?:\.\d+)?)/)
    const diameter = match ? Number(match[1]) : 90
    return { widthCm: diameter, depthCm: diameter, heightCm: 75, weightKg: 25 }
  }

  const numbers = [...normalized.matchAll(/(\d+(?:\.\d+)?)/g)].map((entry) => Number(entry[1]))
  return {
    widthCm: numbers[0] ?? 120,
    depthCm: numbers[1] ?? 60,
    heightCm: numbers[2] ?? 75,
    weightKg: 30 + Math.max(0, (numbers[0] ?? 120) / 20),
  }
}

function categoryFor(name) {
  if (name.includes("TABLE")) return "Tables"
  if (name.includes("PARTITION")) return "Partitions"
  if (name.includes("CUBICLE")) return "Workstations"
  if (name.includes("CABINET")) return "Storage"
  if (name.includes("PEDESTAL")) return "Storage"
  return "Furniture"
}

const warehouse = {
  id: "warehouse_main",
  code: "MAIN",
  name: "Main Warehouse",
  address: "FurniTrack Main Warehouse",
}

const materialMap = new Map()
const productCounts = new Map()
const priceCounts = new Map()
const products = []

for (const product of workbook.products) {
  const normalizedName = normalizeName(product.product_name)
  const baseKey = slugify(normalizedName)
  const currentProductCount = (productCounts.get(baseKey) ?? 0) + 1
  productCounts.set(baseKey, currentProductCount)

  const currentPriceCount = priceCounts.get(baseKey) ?? 0
  const prices = priceBook[baseKey] ?? [0]
  const price = prices[currentPriceCount] ?? prices.at(-1) ?? 0
  priceCounts.set(baseKey, currentPriceCount + 1)

  const dimensionText = product.materials.find((entry) => entry.dimension)?.dimension ?? null
  const dimensions = parseDimensions(dimensionText)
  const primaryMaterial =
    normalizeName(product.materials[0]?.parsed_material_name ?? product.materials[0]?.raw_material_original ?? "Mixed Materials")

  const productKey = `${baseKey}_${currentProductCount}`
  const stockItemId = `stock_fp_${productKey}`
  const productId = `prod_${productKey}`
  const productSlug = productKey.replace(/_/g, "-")
  const sku = `FP-${String(products.length + 1).padStart(3, "0")}`

  const productMaterials = []

  for (const material of product.materials) {
    const materialName = normalizeName(material.parsed_material_name ?? material.raw_material_original ?? "UNKNOWN MATERIAL")
    const materialKey = slugify(materialName)

    if (!materialMap.has(materialKey)) {
      const materialIndex = materialMap.size + 1
      materialMap.set(materialKey, {
        id: `stock_rm_${materialKey}`,
        sku: `RM-${String(materialIndex).padStart(3, "0")}`,
        itemName: materialName,
        itemType: "RAW_MATERIAL",
        description: `Imported raw material from workbook: ${materialName}`,
        unitOfMeasure: "pcs",
        availableQty: 0,
        reservedQty: 0,
        reorderThreshold: 10,
      })
    }

    productMaterials.push({
      id: `pm_${productId}_${materialKey}`,
      stockItemId: materialMap.get(materialKey).id,
      quantityRequired: material.parsed_quantity ?? null,
      quantityDisplay: material.raw_material_original ?? null,
      dimension: material.dimension ?? null,
      notes: null,
    })
  }

  products.push({
    stockItem: {
      id: stockItemId,
      sku,
      itemName: normalizedName.replace(/_/g, " "),
      itemType: "FINISHED_PRODUCT",
      description: `${normalizedName.replace(/_/g, " ")} finished product`,
      unitOfMeasure: "unit",
      availableQty: 0,
      reservedQty: 0,
      reorderThreshold: 2,
    },
    catalog: {
      id: productId,
      stockItemId,
      slug: productSlug,
      name: normalizedName.replace(/_/g, " "),
      category: categoryFor(normalizedName),
      material: primaryMaterial,
      price,
      originalPrice: null,
      badge: "Made to Order",
      images: [],
      rating: 4.8,
      reviewCount: 0,
      widthCm: dimensions.widthCm,
      depthCm: dimensions.depthCm,
      heightCm: dimensions.heightCm,
      weightKg: dimensions.weightKg,
      description: `${normalizedName.replace(/_/g, " ")} configured from the imported FurniTrack finished-product inventory.`,
      isPublished: true,
    },
    materials: productMaterials,
  })
}

const materialRows = [...materialMap.values()]

const statements = [
  `DO $$ BEGIN
  CREATE TYPE "InventoryItemType" AS ENUM ('FINISHED_PRODUCT', 'RAW_MATERIAL');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;`,
  `ALTER TABLE public.stock_items
ADD COLUMN IF NOT EXISTS "itemType" "InventoryItemType" NOT NULL DEFAULT 'RAW_MATERIAL';`,
  `CREATE INDEX IF NOT EXISTS "stock_items_itemType_state_idx"
ON public.stock_items ("itemType", state);`,
  `CREATE TABLE IF NOT EXISTS public.products (
  id text PRIMARY KEY,
  "stockItemId" text NOT NULL UNIQUE REFERENCES public.stock_items(id) ON UPDATE CASCADE ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL,
  material text NOT NULL,
  price numeric(12,2) NOT NULL,
  "originalPrice" numeric(12,2),
  badge text,
  images jsonb,
  rating numeric(3,2) NOT NULL DEFAULT 0,
  "reviewCount" integer NOT NULL DEFAULT 0,
  "widthCm" numeric(10,2) NOT NULL,
  "depthCm" numeric(10,2) NOT NULL,
  "heightCm" numeric(10,2) NOT NULL,
  "weightKg" numeric(10,2) NOT NULL,
  description text NOT NULL,
  "isPublished" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);`,
  `CREATE INDEX IF NOT EXISTS "products_category_isPublished_idx"
ON public.products (category, "isPublished");`,
  `CREATE TABLE IF NOT EXISTS public.product_materials (
  id text PRIMARY KEY,
  "productId" text NOT NULL REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE,
  "stockItemId" text NOT NULL REFERENCES public.stock_items(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  "quantityRequired" numeric(10,2),
  "quantityDisplay" text,
  dimension text,
  notes text,
  "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "product_materials_productId_stockItemId_quantityDisplay_key"
ON public.product_materials ("productId", "stockItemId", COALESCE("quantityDisplay", ''));`,
  `CREATE INDEX IF NOT EXISTS "product_materials_stockItemId_idx"
ON public.product_materials ("stockItemId");`,
  `INSERT INTO public.warehouses (id, code, name, address, "createdAt", "updatedAt")
VALUES ('${warehouse.id}', '${warehouse.code}', '${warehouse.name}', '${warehouse.address}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  "updatedAt" = CURRENT_TIMESTAMP;`,
  `INSERT INTO public.users (id, "authUserId", email, name, role, status, "createdAt", "updatedAt")
SELECT
  u.id::text AS id,
  u.id AS "authUserId",
  u.email,
  COALESCE(NULLIF(u.name, ''), split_part(u.email, '@', 1)) AS name,
  CASE
    WHEN u.role IN ('ADMIN', 'ANALYTICS') THEN 'ADMIN_MANAGEMENT'::"UserRole"
    WHEN u.role = 'SALES' THEN 'SALES'::"UserRole"
    WHEN u.role = 'INVENTORY' THEN 'INVENTORY'::"UserRole"
    WHEN u.role = 'ACCOUNTING' THEN 'ACCOUNTING'::"UserRole"
    WHEN u.role = 'OPERATIONS_DESIGN' THEN 'OPERATIONS_DESIGN'::"UserRole"
    ELSE 'CLIENT'::"UserRole"
  END,
  'ACTIVE'::"AccountStatus",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM neon_auth."user" u
ON CONFLICT (email) DO UPDATE SET
  "authUserId" = EXCLUDED."authUserId",
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  "updatedAt" = CURRENT_TIMESTAMP;`,
  `UPDATE neon_auth."user"
SET role = CASE
  WHEN role IN ('ADMIN', 'ANALYTICS') THEN 'ADMIN_MANAGEMENT'
  WHEN role = 'SALES' THEN 'SALES'
  WHEN role = 'INVENTORY' THEN 'INVENTORY'
  WHEN role = 'ACCOUNTING' THEN 'ACCOUNTING'
  WHEN role = 'OPERATIONS_DESIGN' THEN 'OPERATIONS_DESIGN'
  ELSE 'CLIENT'
END
WHERE role IS DISTINCT FROM CASE
  WHEN role IN ('ADMIN', 'ANALYTICS') THEN 'ADMIN_MANAGEMENT'
  WHEN role = 'SALES' THEN 'SALES'
  WHEN role = 'INVENTORY' THEN 'INVENTORY'
  WHEN role = 'ACCOUNTING' THEN 'ACCOUNTING'
  WHEN role = 'OPERATIONS_DESIGN' THEN 'OPERATIONS_DESIGN'
  ELSE 'CLIENT'
END;`,
]

for (const material of materialRows) {
  statements.push(`INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  '${material.id}',
  '${warehouse.id}',
  '${material.sku}',
  '${escapeSql(material.itemName)}',
  '${material.itemType}',
  '${escapeSql(material.description)}',
  '${material.unitOfMeasure}',
  ${material.availableQty},
  ${material.reservedQty},
  ${material.reorderThreshold},
  'AVAILABLE',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
  "warehouseId" = EXCLUDED."warehouseId",
  sku = EXCLUDED.sku,
  "itemName" = EXCLUDED."itemName",
  "itemType" = EXCLUDED."itemType",
  description = EXCLUDED.description,
  "unitOfMeasure" = EXCLUDED."unitOfMeasure",
  "reorderThreshold" = EXCLUDED."reorderThreshold",
  "updatedAt" = CURRENT_TIMESTAMP;`)
}

for (const product of products) {
  statements.push(`INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  '${product.stockItem.id}',
  '${warehouse.id}',
  '${product.stockItem.sku}',
  '${escapeSql(product.stockItem.itemName)}',
  '${product.stockItem.itemType}',
  '${escapeSql(product.stockItem.description)}',
  '${product.stockItem.unitOfMeasure}',
  ${product.stockItem.availableQty},
  ${product.stockItem.reservedQty},
  ${product.stockItem.reorderThreshold},
  'AVAILABLE',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
  "warehouseId" = EXCLUDED."warehouseId",
  sku = EXCLUDED.sku,
  "itemName" = EXCLUDED."itemName",
  "itemType" = EXCLUDED."itemType",
  description = EXCLUDED.description,
  "unitOfMeasure" = EXCLUDED."unitOfMeasure",
  "reorderThreshold" = EXCLUDED."reorderThreshold",
  "updatedAt" = CURRENT_TIMESTAMP;`)

  statements.push(`INSERT INTO public.products (
  id, "stockItemId", slug, name, category, material, price, "originalPrice", badge, images,
  rating, "reviewCount", "widthCm", "depthCm", "heightCm", "weightKg", description, "isPublished", "createdAt", "updatedAt"
)
VALUES (
  '${product.catalog.id}',
  '${product.catalog.stockItemId}',
  '${product.catalog.slug}',
  '${escapeSql(product.catalog.name)}',
  '${escapeSql(product.catalog.category)}',
  '${escapeSql(product.catalog.material)}',
  ${product.catalog.price.toFixed(2)},
  NULL,
  '${escapeSql(product.catalog.badge)}',
  '[]'::jsonb,
  ${product.catalog.rating},
  ${product.catalog.reviewCount},
  ${product.catalog.widthCm},
  ${product.catalog.depthCm},
  ${product.catalog.heightCm},
  ${product.catalog.weightKg.toFixed(2)},
  '${escapeSql(product.catalog.description)}',
  ${product.catalog.isPublished ? "true" : "false"},
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
  "stockItemId" = EXCLUDED."stockItemId",
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  material = EXCLUDED.material,
  price = EXCLUDED.price,
  badge = EXCLUDED.badge,
  images = EXCLUDED.images,
  rating = EXCLUDED.rating,
  "reviewCount" = EXCLUDED."reviewCount",
  "widthCm" = EXCLUDED."widthCm",
  "depthCm" = EXCLUDED."depthCm",
  "heightCm" = EXCLUDED."heightCm",
  "weightKg" = EXCLUDED."weightKg",
  description = EXCLUDED.description,
  "isPublished" = EXCLUDED."isPublished",
  "updatedAt" = CURRENT_TIMESTAMP;`)
}

statements.push("DELETE FROM public.product_materials;")

for (const product of products) {
  for (const material of product.materials) {
    statements.push(`INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  '${material.id}',
  '${product.catalog.id}',
  '${material.stockItemId}',
  ${toNumericSql(material.quantityRequired)},
  ${toNullableSql(material.quantityDisplay)},
  ${toNullableSql(material.dimension)},
  ${toNullableSql(material.notes)},
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;`)
  }
}

const output = {
  sourcePath: path.resolve(sourcePath),
  warehouse,
  counts: {
    finishedProducts: products.length,
    rawMaterials: materialRows.length,
    productMaterials: products.reduce((total, product) => total + product.materials.length, 0),
  },
  statements,
}

if (format === "sql") {
  console.log(["BEGIN;", ...statements, "COMMIT;"].join("\n\n"))
} else {
  console.log(JSON.stringify(output, null, 2))
}
