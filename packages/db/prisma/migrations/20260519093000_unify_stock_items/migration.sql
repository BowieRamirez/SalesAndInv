DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'InventoryItemType') THEN
    CREATE TYPE "InventoryItemType" AS ENUM ('FINISHED_PRODUCT', 'RAW_MATERIAL');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.stock_items (
  id text PRIMARY KEY,
  "warehouseId" text NOT NULL REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  sku text NOT NULL,
  "itemName" text NOT NULL,
  "itemType" "InventoryItemType" NOT NULL DEFAULT 'RAW_MATERIAL',
  description text,
  "unitOfMeasure" text NOT NULL DEFAULT 'pcs',
  "availableQty" integer NOT NULL DEFAULT 0,
  "reservedQty" integer NOT NULL DEFAULT 0,
  "reorderThreshold" integer NOT NULL DEFAULT 10,
  state "StockState" NOT NULL DEFAULT 'AVAILABLE',
  "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO public.stock_items (
  id,
  "warehouseId",
  sku,
  "itemName",
  "itemType",
  description,
  "unitOfMeasure",
  "availableQty",
  "reservedQty",
  "reorderThreshold",
  state,
  "createdAt",
  "updatedAt"
)
SELECT
  id,
  "warehouseId",
  sku,
  "itemName",
  'FINISHED_PRODUCT'::"InventoryItemType",
  description,
  "unitOfMeasure",
  "availableQty",
  "reservedQty",
  "reorderThreshold",
  state,
  "createdAt",
  "updatedAt"
FROM public.product_stocks
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.stock_items (
  id,
  "warehouseId",
  sku,
  "itemName",
  "itemType",
  description,
  "unitOfMeasure",
  "availableQty",
  "reservedQty",
  "reorderThreshold",
  state,
  "createdAt",
  "updatedAt"
)
SELECT
  id,
  "warehouseId",
  sku,
  "itemName",
  'RAW_MATERIAL'::"InventoryItemType",
  description,
  "unitOfMeasure",
  "availableQty",
  "reservedQty",
  "reorderThreshold",
  state,
  "createdAt",
  "updatedAt"
FROM public.material_stocks
ON CONFLICT (id) DO NOTHING;

CREATE UNIQUE INDEX IF NOT EXISTS stock_items_sku_key
  ON public.stock_items (sku);

CREATE INDEX IF NOT EXISTS stock_items_warehouseId_state_idx
  ON public.stock_items ("warehouseId", state);

CREATE INDEX IF NOT EXISTS stock_items_itemType_state_idx
  ON public.stock_items ("itemType", state);

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS "stockItemId" text;

UPDATE public.products
SET "stockItemId" = "productStockId"
WHERE "stockItemId" IS NULL;

ALTER TABLE public.product_materials
  ADD COLUMN IF NOT EXISTS "stockItemId" text;

UPDATE public.product_materials
SET "stockItemId" = "materialStockId"
WHERE "stockItemId" IS NULL;

ALTER TABLE public.stock_movements
  ADD COLUMN IF NOT EXISTS "stockItemId" text;

UPDATE public.stock_movements
SET "stockItemId" = COALESCE("productStockId", "materialStockId")
WHERE "stockItemId" IS NULL;

ALTER TABLE public.stock_request_line_items
  ADD COLUMN IF NOT EXISTS "stockItemId" text;

UPDATE public.stock_request_line_items
SET "stockItemId" = "materialStockId"
WHERE "stockItemId" IS NULL;

ALTER TABLE public.products
  ALTER COLUMN "stockItemId" SET NOT NULL;

ALTER TABLE public.product_materials
  ALTER COLUMN "stockItemId" SET NOT NULL;

ALTER TABLE public.stock_movements
  ALTER COLUMN "stockItemId" SET NOT NULL;

ALTER TABLE public.stock_request_line_items
  ALTER COLUMN "stockItemId" SET NOT NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'productStockId'
  ) THEN
    ALTER TABLE public.products ALTER COLUMN "productStockId" DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'product_materials'
      AND column_name = 'materialStockId'
  ) THEN
    ALTER TABLE public.product_materials ALTER COLUMN "materialStockId" DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'stock_request_line_items'
      AND column_name = 'materialStockId'
  ) THEN
    ALTER TABLE public.stock_request_line_items ALTER COLUMN "materialStockId" DROP NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'products_stockItemId_key'
      AND conrelid = 'public.products'::regclass
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT "products_stockItemId_key" UNIQUE ("stockItemId");
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'products_stockItemId_fkey'
      AND conrelid = 'public.products'::regclass
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT "products_stockItemId_fkey"
      FOREIGN KEY ("stockItemId") REFERENCES public.stock_items(id)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'product_materials_stockItemId_fkey'
      AND conrelid = 'public.product_materials'::regclass
  ) THEN
    ALTER TABLE public.product_materials
      ADD CONSTRAINT "product_materials_stockItemId_fkey"
      FOREIGN KEY ("stockItemId") REFERENCES public.stock_items(id)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'stock_movements_stockItemId_fkey'
      AND conrelid = 'public.stock_movements'::regclass
  ) THEN
    ALTER TABLE public.stock_movements
      ADD CONSTRAINT "stock_movements_stockItemId_fkey"
      FOREIGN KEY ("stockItemId") REFERENCES public.stock_items(id)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'stock_request_line_items_stockItemId_fkey'
      AND conrelid = 'public.stock_request_line_items'::regclass
  ) THEN
    ALTER TABLE public.stock_request_line_items
      ADD CONSTRAINT "stock_request_line_items_stockItemId_fkey"
      FOREIGN KEY ("stockItemId") REFERENCES public.stock_items(id)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS product_materials_stockItemId_idx
  ON public.product_materials ("stockItemId");
