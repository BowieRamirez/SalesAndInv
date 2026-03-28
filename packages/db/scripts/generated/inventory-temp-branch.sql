BEGIN;

DO $$ BEGIN
  CREATE TYPE "InventoryItemType" AS ENUM ('FINISHED_PRODUCT', 'RAW_MATERIAL');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.stock_items
ADD COLUMN IF NOT EXISTS "itemType" "InventoryItemType" NOT NULL DEFAULT 'RAW_MATERIAL';

CREATE INDEX IF NOT EXISTS "stock_items_itemType_state_idx"
ON public.stock_items ("itemType", state);

CREATE TABLE IF NOT EXISTS public.products (
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
);

CREATE INDEX IF NOT EXISTS "products_category_isPublished_idx"
ON public.products (category, "isPublished");

CREATE TABLE IF NOT EXISTS public.product_materials (
  id text PRIMARY KEY,
  "productId" text NOT NULL REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE,
  "stockItemId" text NOT NULL REFERENCES public.stock_items(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  "quantityRequired" numeric(10,2),
  "quantityDisplay" text,
  dimension text,
  notes text,
  "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "product_materials_productId_stockItemId_quantityDisplay_key"
ON public.product_materials ("productId", "stockItemId", COALESCE("quantityDisplay", ''));

CREATE INDEX IF NOT EXISTS "product_materials_stockItemId_idx"
ON public.product_materials ("stockItemId");

INSERT INTO public.warehouses (id, code, name, address, "createdAt", "updatedAt")
VALUES ('warehouse_main', 'MAIN', 'Main Warehouse', 'FurniTrack Main Warehouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.users (id, "authUserId", email, name, role, status, "createdAt", "updatedAt")
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
  "updatedAt" = CURRENT_TIMESTAMP;

UPDATE neon_auth."user"
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
END;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_e0_board_18mm_thick_board',
  'warehouse_main',
  'RM-001',
  'E0 BOARD 18MM THICK BOARD',
  'RAW_MATERIAL',
  'Imported raw material from workbook: E0 BOARD 18MM THICK BOARD',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_adjustable_feet_leveler',
  'warehouse_main',
  'RM-002',
  'ADJUSTABLE FEET LEVELER',
  'RAW_MATERIAL',
  'Imported raw material from workbook: ADJUSTABLE FEET LEVELER',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_metal_brackets',
  'warehouse_main',
  'RM-003',
  'METAL BRACKETS',
  'RAW_MATERIAL',
  'Imported raw material from workbook: METAL BRACKETS',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_grommet',
  'warehouse_main',
  'RM-004',
  'GROMMET',
  'RAW_MATERIAL',
  'Imported raw material from workbook: GROMMET',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_cam_lock',
  'warehouse_main',
  'RM-005',
  'CAM LOCK',
  'RAW_MATERIAL',
  'Imported raw material from workbook: CAM LOCK',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_e0_board_25mm_thick_board',
  'warehouse_main',
  'RM-006',
  'E0 BOARD 25MM THICK BOARD',
  'RAW_MATERIAL',
  'Imported raw material from workbook: E0 BOARD 25MM THICK BOARD',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_supply_mobile_pedestal',
  'warehouse_main',
  'RM-007',
  'SUPPLY MOBILE PEDESTAL',
  'RAW_MATERIAL',
  'Imported raw material from workbook: SUPPLY MOBILE PEDESTAL',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_brackets',
  'warehouse_main',
  'RM-008',
  'BRACKETS',
  'RAW_MATERIAL',
  'Imported raw material from workbook: BRACKETS',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_e0_board_25mm_thick',
  'warehouse_main',
  'RM-009',
  'E0 BOARD 25MM THICK',
  'RAW_MATERIAL',
  'Imported raw material from workbook: E0 BOARD 25MM THICK',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_set_metal_legs_supply',
  'warehouse_main',
  'RM-010',
  'SET METAL LEGS SUPPLY',
  'RAW_MATERIAL',
  'Imported raw material from workbook: SET METAL LEGS SUPPLY',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_wire_management',
  'warehouse_main',
  'RM-011',
  'WIRE MANAGEMENT',
  'RAW_MATERIAL',
  'Imported raw material from workbook: WIRE MANAGEMENT',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_board_18mm_thick_board',
  'warehouse_main',
  'RM-012',
  'BOARD 18MM THICK BOARD',
  'RAW_MATERIAL',
  'Imported raw material from workbook: BOARD 18MM THICK BOARD',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_steel_round_metal',
  'warehouse_main',
  'RM-013',
  'STEEL ROUND METAL',
  'RAW_MATERIAL',
  'Imported raw material from workbook: STEEL ROUND METAL',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_e0_board_18mm_thick',
  'warehouse_main',
  'RM-014',
  'E0 BOARD 18MM THICK',
  'RAW_MATERIAL',
  'Imported raw material from workbook: E0 BOARD 18MM THICK',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_metal_bar',
  'warehouse_main',
  'RM-015',
  'METAL BAR',
  'RAW_MATERIAL',
  'Imported raw material from workbook: METAL BAR',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_handle_bar',
  'warehouse_main',
  'RM-016',
  'HANDLE BAR',
  'RAW_MATERIAL',
  'Imported raw material from workbook: HANDLE BAR',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_wire_management_automatic',
  'warehouse_main',
  'RM-017',
  'WIRE MANAGEMENT AUTOMATIC',
  'RAW_MATERIAL',
  'Imported raw material from workbook: WIRE MANAGEMENT AUTOMATIC',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_e0_board_18_mm_thick',
  'warehouse_main',
  'RM-018',
  'E0 BOARD 18 MM THICK',
  'RAW_MATERIAL',
  'Imported raw material from workbook: E0 BOARD 18 MM THICK',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_sets_metal_legs_supply',
  'warehouse_main',
  'RM-019',
  'SETS METAL LEGS SUPPLY',
  'RAW_MATERIAL',
  'Imported raw material from workbook: SETS METAL LEGS SUPPLY',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_partition_clip',
  'warehouse_main',
  'RM-020',
  'PARTITION CLIP',
  'RAW_MATERIAL',
  'Imported raw material from workbook: PARTITION CLIP',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_support_metal_leg',
  'warehouse_main',
  'RM-021',
  'SUPPORT METAL LEG',
  'RAW_MATERIAL',
  'Imported raw material from workbook: SUPPORT METAL LEG',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_fabric_11_yard_tela',
  'warehouse_main',
  'RM-022',
  'FABRIC 11 YARD TELA',
  'RAW_MATERIAL',
  'Imported raw material from workbook: FABRIC 11 YARD TELA',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_bracket',
  'warehouse_main',
  'RM-023',
  'BRACKET',
  'RAW_MATERIAL',
  'Imported raw material from workbook: BRACKET',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_individual_lock',
  'warehouse_main',
  'RM-024',
  'INDIVIDUAL LOCK',
  'RAW_MATERIAL',
  'Imported raw material from workbook: INDIVIDUAL LOCK',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_set_drawer_handle',
  'warehouse_main',
  'RM-025',
  'SET DRAWER HANDLE',
  'RAW_MATERIAL',
  'Imported raw material from workbook: SET DRAWER HANDLE',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_round_metal_leg_supply',
  'warehouse_main',
  'RM-026',
  'ROUND METAL LEG SUPPLY',
  'RAW_MATERIAL',
  'Imported raw material from workbook: ROUND METAL LEG SUPPLY',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_set_legs_supply',
  'warehouse_main',
  'RM-027',
  'SET LEGS SUPPLY',
  'RAW_MATERIAL',
  'Imported raw material from workbook: SET LEGS SUPPLY',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_support_leg',
  'warehouse_main',
  'RM-028',
  'SUPPORT LEG',
  'RAW_MATERIAL',
  'Imported raw material from workbook: SUPPORT LEG',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_metal_bracket',
  'warehouse_main',
  'RM-029',
  'METAL BRACKET',
  'RAW_MATERIAL',
  'Imported raw material from workbook: METAL BRACKET',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_drawer_handle_bar',
  'warehouse_main',
  'RM-030',
  'DRAWER HANDLE BAR',
  'RAW_MATERIAL',
  'Imported raw material from workbook: DRAWER HANDLE BAR',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_sets_drawer_guide_hydraulic',
  'warehouse_main',
  'RM-031',
  'SETS DRAWER GUIDE HYDRAULIC',
  'RAW_MATERIAL',
  'Imported raw material from workbook: SETS DRAWER GUIDE HYDRAULIC',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_rm_pcs_i_set_pvc_caster_wheel',
  'warehouse_main',
  'RM-032',
  'PCS) I SET PVC CASTER WHEEL',
  'RAW_MATERIAL',
  'Imported raw material from workbook: PCS) I SET PVC CASTER WHEEL',
  'pcs',
  0,
  0,
  10,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_fp_executive_table_1',
  'warehouse_main',
  'FP-001',
  'EXECUTIVE TABLE',
  'FINISHED_PRODUCT',
  'EXECUTIVE TABLE finished product',
  'unit',
  0,
  0,
  2,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.products (
  id, "stockItemId", slug, name, category, material, price, "originalPrice", badge, images,
  rating, "reviewCount", "widthCm", "depthCm", "heightCm", "weightKg", description, "isPublished", "createdAt", "updatedAt"
)
VALUES (
  'prod_executive_table_1',
  'stock_fp_executive_table_1',
  'executive-table-1',
  'EXECUTIVE TABLE',
  'Tables',
  'E0 BOARD 18MM THICK BOARD',
  16768.42,
  NULL,
  'Made to Order',
  '[]'::jsonb,
  4.8,
  0,
  150,
  120,
  70,
  37.50,
  'EXECUTIVE TABLE configured from the imported FurniTrack finished-product inventory.',
  true,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_fp_office_table_1',
  'warehouse_main',
  'FP-002',
  'OFFICE TABLE',
  'FINISHED_PRODUCT',
  'OFFICE TABLE finished product',
  'unit',
  0,
  0,
  2,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.products (
  id, "stockItemId", slug, name, category, material, price, "originalPrice", badge, images,
  rating, "reviewCount", "widthCm", "depthCm", "heightCm", "weightKg", description, "isPublished", "createdAt", "updatedAt"
)
VALUES (
  'prod_office_table_1',
  'stock_fp_office_table_1',
  'office-table-1',
  'OFFICE TABLE',
  'Tables',
  'E0 BOARD 25MM THICK BOARD',
  10888.00,
  NULL,
  'Made to Order',
  '[]'::jsonb,
  4.8,
  0,
  120,
  60,
  75,
  36.00,
  'OFFICE TABLE configured from the imported FurniTrack finished-product inventory.',
  true,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_fp_office_table_2',
  'warehouse_main',
  'FP-003',
  'OFFICE TABLE',
  'FINISHED_PRODUCT',
  'OFFICE TABLE finished product',
  'unit',
  0,
  0,
  2,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.products (
  id, "stockItemId", slug, name, category, material, price, "originalPrice", badge, images,
  rating, "reviewCount", "widthCm", "depthCm", "heightCm", "weightKg", description, "isPublished", "createdAt", "updatedAt"
)
VALUES (
  'prod_office_table_2',
  'stock_fp_office_table_2',
  'office-table-2',
  'OFFICE TABLE',
  'Tables',
  'E0 BOARD 25MM THICK',
  12704.00,
  NULL,
  'Made to Order',
  '[]'::jsonb,
  4.8,
  0,
  120,
  60,
  75,
  36.00,
  'OFFICE TABLE configured from the imported FurniTrack finished-product inventory.',
  true,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_fp_conference_table_1',
  'warehouse_main',
  'FP-004',
  'CONFERENCE TABLE',
  'FINISHED_PRODUCT',
  'CONFERENCE TABLE finished product',
  'unit',
  0,
  0,
  2,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.products (
  id, "stockItemId", slug, name, category, material, price, "originalPrice", badge, images,
  rating, "reviewCount", "widthCm", "depthCm", "heightCm", "weightKg", description, "isPublished", "createdAt", "updatedAt"
)
VALUES (
  'prod_conference_table_1',
  'stock_fp_conference_table_1',
  'conference-table-1',
  'CONFERENCE TABLE',
  'Tables',
  'E0 BOARD 25MM THICK',
  41317.50,
  NULL,
  'Made to Order',
  '[]'::jsonb,
  4.8,
  0,
  240,
  120,
  75,
  42.00,
  'CONFERENCE TABLE configured from the imported FurniTrack finished-product inventory.',
  true,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_fp_reception_table_1',
  'warehouse_main',
  'FP-005',
  'RECEPTION TABLE',
  'FINISHED_PRODUCT',
  'RECEPTION TABLE finished product',
  'unit',
  0,
  0,
  2,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.products (
  id, "stockItemId", slug, name, category, material, price, "originalPrice", badge, images,
  rating, "reviewCount", "widthCm", "depthCm", "heightCm", "weightKg", description, "isPublished", "createdAt", "updatedAt"
)
VALUES (
  'prod_reception_table_1',
  'stock_fp_reception_table_1',
  'reception-table-1',
  'RECEPTION TABLE',
  'Tables',
  'BOARD 18MM THICK BOARD',
  32305.00,
  NULL,
  'Made to Order',
  '[]'::jsonb,
  4.8,
  0,
  120,
  60,
  75,
  30.00,
  'RECEPTION TABLE configured from the imported FurniTrack finished-product inventory.',
  true,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_fp_executive_table_2',
  'warehouse_main',
  'FP-006',
  'EXECUTIVE TABLE',
  'FINISHED_PRODUCT',
  'EXECUTIVE TABLE finished product',
  'unit',
  0,
  0,
  2,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.products (
  id, "stockItemId", slug, name, category, material, price, "originalPrice", badge, images,
  rating, "reviewCount", "widthCm", "depthCm", "heightCm", "weightKg", description, "isPublished", "createdAt", "updatedAt"
)
VALUES (
  'prod_executive_table_2',
  'stock_fp_executive_table_2',
  'executive-table-2',
  'EXECUTIVE TABLE',
  'Tables',
  'E0 BOARD 25MM THICK',
  43799.00,
  NULL,
  'Made to Order',
  '[]'::jsonb,
  4.8,
  0,
  150,
  80,
  75,
  37.50,
  'EXECUTIVE TABLE configured from the imported FurniTrack finished-product inventory.',
  true,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_fp_office_partition_1',
  'warehouse_main',
  'FP-007',
  'OFFICE PARTITION',
  'FINISHED_PRODUCT',
  'OFFICE PARTITION finished product',
  'unit',
  0,
  0,
  2,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.products (
  id, "stockItemId", slug, name, category, material, price, "originalPrice", badge, images,
  rating, "reviewCount", "widthCm", "depthCm", "heightCm", "weightKg", description, "isPublished", "createdAt", "updatedAt"
)
VALUES (
  'prod_office_partition_1',
  'stock_fp_office_partition_1',
  'office-partition-1',
  'OFFICE PARTITION',
  'Partitions',
  'E0 BOARD 25MM THICK',
  56773.00,
  NULL,
  'Made to Order',
  '[]'::jsonb,
  4.8,
  0,
  120,
  100,
  75,
  36.00,
  'OFFICE PARTITION configured from the imported FurniTrack finished-product inventory.',
  true,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_fp_office_cubicle_1',
  'warehouse_main',
  'FP-008',
  'OFFICE CUBICLE',
  'FINISHED_PRODUCT',
  'OFFICE CUBICLE finished product',
  'unit',
  0,
  0,
  2,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.products (
  id, "stockItemId", slug, name, category, material, price, "originalPrice", badge, images,
  rating, "reviewCount", "widthCm", "depthCm", "heightCm", "weightKg", description, "isPublished", "createdAt", "updatedAt"
)
VALUES (
  'prod_office_cubicle_1',
  'stock_fp_office_cubicle_1',
  'office-cubicle-1',
  'OFFICE CUBICLE',
  'Workstations',
  'E0 BOARD 25MM THICK BOARD',
  52668.00,
  NULL,
  'Made to Order',
  '[]'::jsonb,
  4.8,
  0,
  120,
  60,
  4,
  36.00,
  'OFFICE CUBICLE configured from the imported FurniTrack finished-product inventory.',
  true,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_fp_round_table_1',
  'warehouse_main',
  'FP-009',
  'ROUND TABLE',
  'FINISHED_PRODUCT',
  'ROUND TABLE finished product',
  'unit',
  0,
  0,
  2,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.products (
  id, "stockItemId", slug, name, category, material, price, "originalPrice", badge, images,
  rating, "reviewCount", "widthCm", "depthCm", "heightCm", "weightKg", description, "isPublished", "createdAt", "updatedAt"
)
VALUES (
  'prod_round_table_1',
  'stock_fp_round_table_1',
  'round-table-1',
  'ROUND TABLE',
  'Tables',
  'E0 BOARD 25MM THICK BOARD',
  10000.00,
  NULL,
  'Made to Order',
  '[]'::jsonb,
  4.8,
  0,
  90,
  90,
  75,
  25.00,
  'ROUND TABLE configured from the imported FurniTrack finished-product inventory.',
  true,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_fp_executive_table_3',
  'warehouse_main',
  'FP-010',
  'EXECUTIVE TABLE',
  'FINISHED_PRODUCT',
  'EXECUTIVE TABLE finished product',
  'unit',
  0,
  0,
  2,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.products (
  id, "stockItemId", slug, name, category, material, price, "originalPrice", badge, images,
  rating, "reviewCount", "widthCm", "depthCm", "heightCm", "weightKg", description, "isPublished", "createdAt", "updatedAt"
)
VALUES (
  'prod_executive_table_3',
  'stock_fp_executive_table_3',
  'executive-table-3',
  'EXECUTIVE TABLE',
  'Tables',
  'E0 BOARD 25MM THICK BOARD',
  22350.00,
  NULL,
  'Made to Order',
  '[]'::jsonb,
  4.8,
  0,
  180,
  120,
  75,
  39.00,
  'EXECUTIVE TABLE configured from the imported FurniTrack finished-product inventory.',
  true,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_fp_office_partition_2',
  'warehouse_main',
  'FP-011',
  'OFFICE PARTITION',
  'FINISHED_PRODUCT',
  'OFFICE PARTITION finished product',
  'unit',
  0,
  0,
  2,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.products (
  id, "stockItemId", slug, name, category, material, price, "originalPrice", badge, images,
  rating, "reviewCount", "widthCm", "depthCm", "heightCm", "weightKg", description, "isPublished", "createdAt", "updatedAt"
)
VALUES (
  'prod_office_partition_2',
  'stock_fp_office_partition_2',
  'office-partition-2',
  'OFFICE PARTITION',
  'Partitions',
  'E0 BOARD 25MM THICK BOARD',
  31850.00,
  NULL,
  'Made to Order',
  '[]'::jsonb,
  4.8,
  0,
  240,
  120,
  75,
  42.00,
  'OFFICE PARTITION configured from the imported FurniTrack finished-product inventory.',
  true,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_fp_office_table_3',
  'warehouse_main',
  'FP-012',
  'OFFICE TABLE',
  'FINISHED_PRODUCT',
  'OFFICE TABLE finished product',
  'unit',
  0,
  0,
  2,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.products (
  id, "stockItemId", slug, name, category, material, price, "originalPrice", badge, images,
  rating, "reviewCount", "widthCm", "depthCm", "heightCm", "weightKg", description, "isPublished", "createdAt", "updatedAt"
)
VALUES (
  'prod_office_table_3',
  'stock_fp_office_table_3',
  'office-table-3',
  'OFFICE TABLE',
  'Tables',
  'E0 BOARD 25MM THICK BOARD',
  12460.35,
  NULL,
  'Made to Order',
  '[]'::jsonb,
  4.8,
  0,
  120,
  60,
  75,
  30.00,
  'OFFICE TABLE configured from the imported FurniTrack finished-product inventory.',
  true,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_fp_mobile_pedestal_1',
  'warehouse_main',
  'FP-013',
  'MOBILE PEDESTAL',
  'FINISHED_PRODUCT',
  'MOBILE PEDESTAL finished product',
  'unit',
  0,
  0,
  2,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.products (
  id, "stockItemId", slug, name, category, material, price, "originalPrice", badge, images,
  rating, "reviewCount", "widthCm", "depthCm", "heightCm", "weightKg", description, "isPublished", "createdAt", "updatedAt"
)
VALUES (
  'prod_mobile_pedestal_1',
  'stock_fp_mobile_pedestal_1',
  'mobile-pedestal-1',
  'MOBILE PEDESTAL',
  'Storage',
  'E0 BOARD 18MM THICK BOARD',
  10920.00,
  NULL,
  'Made to Order',
  '[]'::jsonb,
  4.8,
  0,
  120,
  60,
  75,
  30.00,
  'MOBILE PEDESTAL configured from the imported FurniTrack finished-product inventory.',
  true,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_fp_cabinet_1',
  'warehouse_main',
  'FP-014',
  'CABINET',
  'FINISHED_PRODUCT',
  'CABINET finished product',
  'unit',
  0,
  0,
  2,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.products (
  id, "stockItemId", slug, name, category, material, price, "originalPrice", badge, images,
  rating, "reviewCount", "widthCm", "depthCm", "heightCm", "weightKg", description, "isPublished", "createdAt", "updatedAt"
)
VALUES (
  'prod_cabinet_1',
  'stock_fp_cabinet_1',
  'cabinet-1',
  'CABINET',
  'Storage',
  'E0 BOARD 18MM THICK BOARD',
  82350.00,
  NULL,
  'Made to Order',
  '[]'::jsonb,
  4.8,
  0,
  120,
  120,
  75,
  36.00,
  'CABINET configured from the imported FurniTrack finished-product inventory.',
  true,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.stock_items (
  id, "warehouseId", sku, "itemName", "itemType", description, "unitOfMeasure",
  "availableQty", "reservedQty", "reorderThreshold", state, "createdAt", "updatedAt"
)
VALUES (
  'stock_fp_center_table_1',
  'warehouse_main',
  'FP-015',
  'CENTER TABLE',
  'FINISHED_PRODUCT',
  'CENTER TABLE finished product',
  'unit',
  0,
  0,
  2,
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
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO public.products (
  id, "stockItemId", slug, name, category, material, price, "originalPrice", badge, images,
  rating, "reviewCount", "widthCm", "depthCm", "heightCm", "weightKg", description, "isPublished", "createdAt", "updatedAt"
)
VALUES (
  'prod_center_table_1',
  'stock_fp_center_table_1',
  'center-table-1',
  'CENTER TABLE',
  'Tables',
  'E0 BOARD 25MM THICK BOARD',
  14820.00,
  NULL,
  'Made to Order',
  '[]'::jsonb,
  4.8,
  0,
  100,
  40,
  75,
  35.00,
  'CENTER TABLE configured from the imported FurniTrack finished-product inventory.',
  true,
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
  "updatedAt" = CURRENT_TIMESTAMP;

DELETE FROM public.product_materials;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_executive_table_1_e0_board_18mm_thick_board',
  'prod_executive_table_1',
  'stock_rm_e0_board_18mm_thick_board',
  1,
  '1 E0 BOARD 18MM THICK BOARD',
  '150CM X 120CM X 70HT',
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_executive_table_1_adjustable_feet_leveler',
  'prod_executive_table_1',
  'stock_rm_adjustable_feet_leveler',
  6,
  '6 Adjustable feet leveler',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_executive_table_1_metal_brackets',
  'prod_executive_table_1',
  'stock_rm_metal_brackets',
  NULL,
  'Metal Brackets',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_executive_table_1_grommet',
  'prod_executive_table_1',
  'stock_rm_grommet',
  1,
  '1 GROMMET',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_executive_table_1_cam_lock',
  'prod_executive_table_1',
  'stock_rm_cam_lock',
  6,
  '6 CAM LOCK',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_table_1_e0_board_25mm_thick_board',
  'prod_office_table_1',
  'stock_rm_e0_board_25mm_thick_board',
  1,
  '1 E0 BOARD 25MM THICK BOARD',
  '120 CM X 60CM',
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_table_1_e0_board_18mm_thick_board',
  'prod_office_table_1',
  'stock_rm_e0_board_18mm_thick_board',
  1,
  '1 E0 BOARD 18MM THICK BOARD',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_table_1_supply_mobile_pedestal',
  'prod_office_table_1',
  'stock_rm_supply_mobile_pedestal',
  1,
  '1 SUPPLY MOBILE PEDESTAL',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_table_1_grommet',
  'prod_office_table_1',
  'stock_rm_grommet',
  1,
  '1GROMMET',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_table_1_adjustable_feet_leveler',
  'prod_office_table_1',
  'stock_rm_adjustable_feet_leveler',
  2,
  '2 Adjustable feet leveler',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_table_1_brackets',
  'prod_office_table_1',
  'stock_rm_brackets',
  2,
  '2 BRACKETS',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_table_2_e0_board_25mm_thick',
  'prod_office_table_2',
  'stock_rm_e0_board_25mm_thick',
  1,
  '1 E0 BOARD 25MM THICK',
  '120CM X 60CM',
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_table_2_set_metal_legs_supply',
  'prod_office_table_2',
  'stock_rm_set_metal_legs_supply',
  1,
  '1 SET METAL LEGS SUPPLY',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_table_2_adjustable_feet_leveler',
  'prod_office_table_2',
  'stock_rm_adjustable_feet_leveler',
  2,
  '2 Adjustable feet leveler',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_table_2_grommet',
  'prod_office_table_2',
  'stock_rm_grommet',
  1,
  '1 GROMMET',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_conference_table_1_e0_board_25mm_thick',
  'prod_conference_table_1',
  'stock_rm_e0_board_25mm_thick',
  1,
  '1 E0 BOARD 25MM THICK',
  '240 CM X 120CM',
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_conference_table_1_e0_board_18mm_thick_board',
  'prod_conference_table_1',
  'stock_rm_e0_board_18mm_thick_board',
  2,
  '2 E0 BOARD 18MM THICK BOARD',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_conference_table_1_wire_management',
  'prod_conference_table_1',
  'stock_rm_wire_management',
  1,
  '1 WIRE MANAGEMENT',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_conference_table_1_adjustable_feet_leveler',
  'prod_conference_table_1',
  'stock_rm_adjustable_feet_leveler',
  4,
  '4  Adjustable feet leveler',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_reception_table_1_board_18mm_thick_board',
  'prod_reception_table_1',
  'stock_rm_board_18mm_thick_board',
  3,
  '3 BOARD 18MM THICK BOARD',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_reception_table_1_steel_round_metal',
  'prod_reception_table_1',
  'stock_rm_steel_round_metal',
  1,
  '1 STEEL ROUND METAL',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_reception_table_1_adjustable_feet_leveler',
  'prod_reception_table_1',
  'stock_rm_adjustable_feet_leveler',
  4,
  '4 Adjustable feet leveler',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_reception_table_1_grommet',
  'prod_reception_table_1',
  'stock_rm_grommet',
  2,
  '2 GROMMET',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_reception_table_1_brackets',
  'prod_reception_table_1',
  'stock_rm_brackets',
  4,
  '4 BRACKETS',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_executive_table_2_e0_board_25mm_thick',
  'prod_executive_table_2',
  'stock_rm_e0_board_25mm_thick',
  1,
  '1 E0 BOARD 25MM THICK',
  '150 CM X 80 CM',
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_executive_table_2_e0_board_18mm_thick',
  'prod_executive_table_2',
  'stock_rm_e0_board_18mm_thick',
  3,
  '3 E0 BOARD 18MM THICK',
  '180 X 40',
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_executive_table_2_metal_bar',
  'prod_executive_table_2',
  'stock_rm_metal_bar',
  1,
  '1 METAL BAR',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_executive_table_2_adjustable_feet_leveler',
  'prod_executive_table_2',
  'stock_rm_adjustable_feet_leveler',
  6,
  '6 Adjustable feet leveler',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_executive_table_2_handle_bar',
  'prod_executive_table_2',
  'stock_rm_handle_bar',
  2,
  '2 HANDLE BAR',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_executive_table_2_wire_management_automatic',
  'prod_executive_table_2',
  'stock_rm_wire_management_automatic',
  1,
  '1 WIRE MANAGEMENT AUTOMATIC',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_executive_table_2_brackets',
  'prod_executive_table_2',
  'stock_rm_brackets',
  4,
  '4 BRACKETS',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_partition_1_e0_board_25mm_thick',
  'prod_office_partition_1',
  'stock_rm_e0_board_25mm_thick',
  2,
  '2 E0 BOARD 25MM THICK',
  '120 CM X 100CM',
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_partition_1_e0_board_18_mm_thick',
  'prod_office_partition_1',
  'stock_rm_e0_board_18_mm_thick',
  1,
  '1 E0 BOARD 18 MM THICK',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_partition_1_sets_metal_legs_supply',
  'prod_office_partition_1',
  'stock_rm_sets_metal_legs_supply',
  2,
  '2 SETS METAL LEGS SUPPLY',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_partition_1_partition_clip',
  'prod_office_partition_1',
  'stock_rm_partition_clip',
  8,
  '8 PARTITION CLIP',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_partition_1_brackets',
  'prod_office_partition_1',
  'stock_rm_brackets',
  4,
  '4 BRACKETS',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_partition_1_support_metal_leg',
  'prod_office_partition_1',
  'stock_rm_support_metal_leg',
  1,
  '1 SUPPORT METAL LEG',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_partition_1_grommet',
  'prod_office_partition_1',
  'stock_rm_grommet',
  4,
  '4 GROMMET',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_cubicle_1_e0_board_25mm_thick_board',
  'prod_office_cubicle_1',
  'stock_rm_e0_board_25mm_thick_board',
  1,
  '1 E0 BOARD 25MM THICK BOARD',
  '120CM X 60 4 PAX',
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_cubicle_1_e0_board_18mm_thick',
  'prod_office_cubicle_1',
  'stock_rm_e0_board_18mm_thick',
  4,
  '4 E0 BOARD 18MM THICK',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_cubicle_1_fabric_11_yard_tela',
  'prod_office_cubicle_1',
  'stock_rm_fabric_11_yard_tela',
  NULL,
  'FABRIC 11 YARD TELA',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_cubicle_1_bracket',
  'prod_office_cubicle_1',
  'stock_rm_bracket',
  24,
  '24 BRACKET',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_cubicle_1_adjustable_feet_leveler',
  'prod_office_cubicle_1',
  'stock_rm_adjustable_feet_leveler',
  12,
  '12 Adjustable feet leveler',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_cubicle_1_individual_lock',
  'prod_office_cubicle_1',
  'stock_rm_individual_lock',
  4,
  '4 individual lock',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_cubicle_1_set_drawer_handle',
  'prod_office_cubicle_1',
  'stock_rm_set_drawer_handle',
  4,
  '4 SET DRAWER HANDLE',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_cubicle_1_grommet',
  'prod_office_cubicle_1',
  'stock_rm_grommet',
  4,
  '4 GROMMET',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_round_table_1_e0_board_25mm_thick_board',
  'prod_round_table_1',
  'stock_rm_e0_board_25mm_thick_board',
  1,
  '1 E0 BOARD 25MM THICK BOARD',
  '90 DIAMETER',
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_round_table_1_round_metal_leg_supply',
  'prod_round_table_1',
  'stock_rm_round_metal_leg_supply',
  NULL,
  'ROUND METAL  LEG SUPPLY',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_executive_table_3_e0_board_25mm_thick_board',
  'prod_executive_table_3',
  'stock_rm_e0_board_25mm_thick_board',
  2,
  '2 E0 BOARD 25MM THICK BOARD',
  '180CM X 120CM',
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_executive_table_3_e0_board_18mm_thick',
  'prod_executive_table_3',
  'stock_rm_e0_board_18mm_thick',
  1,
  '1 E0 BOARD 18MM THICK',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_executive_table_3_adjustable_feet_leveler',
  'prod_executive_table_3',
  'stock_rm_adjustable_feet_leveler',
  5,
  '5  Adjustable feet leveler',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_executive_table_3_wire_management_automatic',
  'prod_executive_table_3',
  'stock_rm_wire_management_automatic',
  1,
  '1 WIRE MANAGEMENT AUTOMATIC',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_executive_table_3_cam_lock',
  'prod_executive_table_3',
  'stock_rm_cam_lock',
  6,
  '6 CAM LOCK',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_partition_2_e0_board_25mm_thick_board',
  'prod_office_partition_2',
  'stock_rm_e0_board_25mm_thick_board',
  1,
  '1 E0 BOARD 25MM THICK BOARD',
  '240 X 120CM',
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_partition_2_e0_board_18mm_thick_board',
  'prod_office_partition_2',
  'stock_rm_e0_board_18mm_thick_board',
  1,
  '1 E0 BOARD 18MM THICK BOARD',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_partition_2_set_legs_supply',
  'prod_office_partition_2',
  'stock_rm_set_legs_supply',
  1,
  '1 SET LEGS SUPPLY',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_partition_2_support_leg',
  'prod_office_partition_2',
  'stock_rm_support_leg',
  1,
  '1 SUPPORT LEG',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_partition_2_partition_clip',
  'prod_office_partition_2',
  'stock_rm_partition_clip',
  4,
  '4 PARTITION CLIP',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_partition_2_metal_brackets',
  'prod_office_partition_2',
  'stock_rm_metal_brackets',
  2,
  '2 METAL BRACKETS',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_partition_2_grommet',
  'prod_office_partition_2',
  'stock_rm_grommet',
  4,
  '4 GROMMET',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_table_3_e0_board_25mm_thick_board',
  'prod_office_table_3',
  'stock_rm_e0_board_25mm_thick_board',
  2,
  '2 E0 BOARD 25MM THICK BOARD',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_table_3_e0_board_18mm_thick_board',
  'prod_office_table_3',
  'stock_rm_e0_board_18mm_thick_board',
  1,
  '1 E0 BOARD 18MM THICK BOARD',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_table_3_cam_lock',
  'prod_office_table_3',
  'stock_rm_cam_lock',
  4,
  '4 CAM LOCK',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_table_3_grommet',
  'prod_office_table_3',
  'stock_rm_grommet',
  1,
  '1 GROMMET',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_table_3_adjustable_feet_leveler',
  'prod_office_table_3',
  'stock_rm_adjustable_feet_leveler',
  4,
  '4  Adjustable feet leveler',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_office_table_3_metal_bracket',
  'prod_office_table_3',
  'stock_rm_metal_bracket',
  4,
  '4 METAL BRACKET',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_mobile_pedestal_1_e0_board_18mm_thick_board',
  'prod_mobile_pedestal_1',
  'stock_rm_e0_board_18mm_thick_board',
  1,
  '1 E0 BOARD 18MM THICK BOARD',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_mobile_pedestal_1_drawer_handle_bar',
  'prod_mobile_pedestal_1',
  'stock_rm_drawer_handle_bar',
  3,
  '3 DRAWER HANDLE BAR',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_mobile_pedestal_1_individual_lock',
  'prod_mobile_pedestal_1',
  'stock_rm_individual_lock',
  1,
  '1 INDIVIDUAL LOCK',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_mobile_pedestal_1_sets_drawer_guide_hydraulic',
  'prod_mobile_pedestal_1',
  'stock_rm_sets_drawer_guide_hydraulic',
  3,
  '3 SETS DRAWER GUIDE HYDRAULIC',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_mobile_pedestal_1_pcs_i_set_pvc_caster_wheel',
  'prod_mobile_pedestal_1',
  'stock_rm_pcs_i_set_pvc_caster_wheel',
  4,
  '(4 PCS) I SET PVC CASTER WHEEL',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_cabinet_1_e0_board_18mm_thick_board',
  'prod_cabinet_1',
  'stock_rm_e0_board_18mm_thick_board',
  3,
  '3 E0 BOARD 18MM THICK BOARD',
  '120CM X 120CM',
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_cabinet_1_adjustable_feet_leveler',
  'prod_cabinet_1',
  'stock_rm_adjustable_feet_leveler',
  5,
  '5  Adjustable feet leveler',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_center_table_1_e0_board_25mm_thick_board',
  'prod_center_table_1',
  'stock_rm_e0_board_25mm_thick_board',
  1,
  '1 E0 BOARD 25MM THICK BOARD',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (
  id, "productId", "stockItemId", "quantityRequired", "quantityDisplay", dimension, notes, "createdAt"
)
VALUES (
  'pm_prod_center_table_1_e0_board_18mm_thick_board',
  'prod_center_table_1',
  'stock_rm_e0_board_18mm_thick_board',
  1,
  '1 E0 BOARD 18MM THICK BOARD',
  '100 X 40CM',
  NULL,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

COMMIT;
