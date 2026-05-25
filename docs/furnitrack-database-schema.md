# FurniTrack — Database Schema

> The structural blueprint of the FurniTrack PostgreSQL database.
> Shows all tables, columns, data types, constraints, indexes, and foreign keys.
> Database: PostgreSQL 17 · Hosted on: Neon (ap-southeast-1)

---

## Enumerations (Custom Types)

```sql
CREATE TYPE "UserRole" AS ENUM (
  'ADMIN_MANAGEMENT', 'SALES', 'INVENTORY',
  'ACCOUNTING', 'OPERATIONS_DESIGN', 'CUSTOM', 'CLIENT'
);

CREATE TYPE "AccountStatus" AS ENUM (
  'ACTIVE', 'BLOCKED', 'EXPIRED', 'PENDING_ACTIVATION'
);

CREATE TYPE "InquiryStatus" AS ENUM (
  'RECEIVED', 'ACCEPTED', 'PENDING_INVENTORY_APPROVAL',
  'PENDING_SALES_QUOTATION', 'GETTING_READY_FOR_BUILDING',
  'WAITING_FOR_PAYMENT', 'PENDING_ACCOUNTING_APPROVAL',
  'READY_FOR_SHIPMENT', 'READY_FOR_SHIPPING', 'COMPLETED'
);

CREATE TYPE "PaymentType" AS ENUM (
  'DOWN_PAYMENT', 'PARTIAL_PAYMENT', 'FULL_PAYMENT'
);

CREATE TYPE "PaymentStatus" AS ENUM (
  'PENDING', 'VERIFIED', 'REJECTED'
);

CREATE TYPE "StockState" AS ENUM (
  'AVAILABLE', 'RESERVED', 'DAMAGED', 'ARCHIVED'
);

CREATE TYPE "StockMovementType" AS ENUM (
  'IN', 'OUT', 'ADJUSTMENT', 'TRANSFER', 'DAMAGE'
);

CREATE TYPE "PurchaseOrderStatus" AS ENUM (
  'DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED',
  'ORDERED', 'GOODS_RECEIVED', 'CANCELLED'
);

CREATE TYPE "ApprovalModule" AS ENUM (
  'PAYMENT', 'CUSTOMER_INQUIRY'
);

CREATE TYPE "ApprovalAction" AS ENUM (
  'SUBMITTED', 'APPROVED', 'REJECTED',
  'RETURNED_FOR_REVISION', 'FINALIZED'
);

CREATE TYPE "AuditAction" AS ENUM (
  'USER_CREATED', 'USER_UPDATED', 'USER_BLOCKED', 'USER_REMOVED',
  'STOCK_ADDED', 'STOCK_REMOVED', 'PAYMENT_ACCEPTED',
  'DELIVERY_SCHEDULED', 'PRODUCT_CREATED', 'PRODUCT_UPDATED',
  'PURCHASE_ORDER_CREATED', 'PURCHASE_ORDER_APPROVED',
  'PURCHASE_ORDER_REJECTED', 'GOODS_RECEIVED'
  -- and more...
);

CREATE TYPE "AuditEntityType" AS ENUM (
  'USER', 'PAYMENT', 'RETURN_REQUEST', 'CHAT',
  'INVENTORY', 'STOCK', 'BUILDING_PROJECT',
  'DELIVERY_SCHEDULE', 'PRODUCT', 'PURCHASE_ORDER'
);
```

---

## Table Definitions

### `users`
```sql
CREATE TABLE public.users (
  id                TEXT          PRIMARY KEY DEFAULT gen_random_uuid(),
  "authUserId"      UUID          UNIQUE,
  name              TEXT          NOT NULL,
  email             TEXT          NOT NULL UNIQUE,
  role              "UserRole"    NOT NULL,
  status            "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
  "accessStartsAt"  TIMESTAMPTZ,
  "accessExpiresAt" TIMESTAMPTZ,
  "lastLoginAt"     TIMESTAMPTZ,
  "emailVerifiedAt" TIMESTAMPTZ,
  phone             TEXT,
  address           TEXT,
  permissions       JSONB,
  "createdAt"       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"       TIMESTAMPTZ   NOT NULL
);

CREATE INDEX ON public.users (role, status);
```

---

### `warehouses`
```sql
CREATE TABLE public.warehouses (
  id           TEXT        PRIMARY KEY DEFAULT gen_random_uuid(),
  code         TEXT        NOT NULL UNIQUE,
  name         TEXT        NOT NULL,
  street       TEXT,
  city         TEXT,
  country      TEXT        NOT NULL DEFAULT 'Philippines',
  "postalCode" TEXT,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"  TIMESTAMPTZ NOT NULL
);
```

---

### `product_stocks`
```sql
CREATE TABLE public.product_stocks (
  id                 TEXT         PRIMARY KEY DEFAULT gen_random_uuid(),
  "warehouseId"      TEXT         NOT NULL REFERENCES public.warehouses(id),
  sku                TEXT         NOT NULL UNIQUE,
  "itemName"         TEXT         NOT NULL,
  description        TEXT,
  "unitOfMeasure"    TEXT         NOT NULL DEFAULT 'pcs',
  "availableQty"     INTEGER      NOT NULL DEFAULT 0,
  "reservedQty"      INTEGER      NOT NULL DEFAULT 0,
  "reorderThreshold" INTEGER      NOT NULL DEFAULT 10,
  state              "StockState" NOT NULL DEFAULT 'AVAILABLE',
  "createdAt"        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updatedAt"        TIMESTAMPTZ  NOT NULL
);

CREATE INDEX ON public.product_stocks ("warehouseId", state);
```

---

### `material_stocks`
```sql
CREATE TABLE public.material_stocks (
  id                 TEXT         PRIMARY KEY DEFAULT gen_random_uuid(),
  "warehouseId"      TEXT         NOT NULL REFERENCES public.warehouses(id),
  sku                TEXT         NOT NULL UNIQUE,
  "itemName"         TEXT         NOT NULL,
  description        TEXT,
  "unitOfMeasure"    TEXT         NOT NULL DEFAULT 'pcs',
  "availableQty"     INTEGER      NOT NULL DEFAULT 0,
  "reservedQty"      INTEGER      NOT NULL DEFAULT 0,
  "reorderThreshold" INTEGER      NOT NULL DEFAULT 10,
  state              "StockState" NOT NULL DEFAULT 'AVAILABLE',
  "createdAt"        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updatedAt"        TIMESTAMPTZ  NOT NULL
);

CREATE INDEX ON public.material_stocks ("warehouseId", state);
```

---

### `products`
```sql
CREATE TABLE public.products (
  id               TEXT        PRIMARY KEY DEFAULT gen_random_uuid(),
  "productStockId" TEXT        NOT NULL UNIQUE REFERENCES public.product_stocks(id),
  slug             TEXT        NOT NULL UNIQUE,
  name             TEXT        NOT NULL,
  category         TEXT        NOT NULL,
  material         TEXT        NOT NULL,
  price            NUMERIC     NOT NULL,
  "originalPrice"  NUMERIC,
  badge            TEXT,
  images           JSONB,
  "colorVariants"  JSONB       NOT NULL DEFAULT '[]',
  "productCode"    TEXT        UNIQUE,
  rating           NUMERIC     NOT NULL DEFAULT 0,
  "reviewCount"    INTEGER     NOT NULL DEFAULT 0,
  "widthCm"        NUMERIC     NOT NULL,
  "depthCm"        NUMERIC     NOT NULL,
  "heightCm"       NUMERIC     NOT NULL,
  "weightKg"       NUMERIC     NOT NULL,
  description      TEXT        NOT NULL,
  "isPublished"    BOOLEAN     NOT NULL DEFAULT TRUE,
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"      TIMESTAMPTZ NOT NULL
);

CREATE INDEX ON public.products (category, "isPublished");
```

---

### `draft_products`
```sql
CREATE TABLE public.draft_products (
  id            TEXT        PRIMARY KEY DEFAULT gen_random_uuid(),
  "createdById" TEXT        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name          TEXT,
  payload       JSONB       NOT NULL,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL,
  "deletedAt"   TIMESTAMPTZ
);

CREATE INDEX ON public.draft_products ("createdById", "deletedAt", "updatedAt");
```

---

### `customer_inquiries`
```sql
CREATE TABLE public.customer_inquiries (
  id                        TEXT            PRIMARY KEY DEFAULT gen_random_uuid(),
  "productId"               TEXT            NOT NULL REFERENCES public.products(id),
  "customerUserId"          TEXT            REFERENCES public.users(id),
  "customerName"            TEXT            NOT NULL,
  "customerEmail"           TEXT            NOT NULL,
  "customerPhone"           TEXT            NOT NULL,
  message                   TEXT            NOT NULL,
  quantity                  INTEGER         NOT NULL DEFAULT 1,
  status                    "InquiryStatus" NOT NULL DEFAULT 'RECEIVED',
  "statusNote"              TEXT,
  "inquiryNumber"           TEXT            UNIQUE,
  "quotedPrice"             NUMERIC,
  "quotedPriceBeforeDiscount" NUMERIC,
  "quotationRevisionCount"  INTEGER         NOT NULL DEFAULT 0,
  "quotationDiscount"       NUMERIC         NOT NULL DEFAULT 0,
  "quotationAccepted"       BOOLEAN,
  "quotationDeclineReason"  TEXT,
  "salesReviewedAt"         TIMESTAMPTZ,
  "inventoryApprovedAt"     TIMESTAMPTZ,
  "quotationSentAt"         TIMESTAMPTZ,
  "quotationRespondedAt"    TIMESTAMPTZ,
  "customerPaidAt"          TIMESTAMPTZ,
  "accountingConfirmedAt"   TIMESTAMPTZ,
  "buildApprovedAt"         TIMESTAMPTZ,
  "shippingScheduledAt"     TIMESTAMPTZ,
  "completedAt"             TIMESTAMPTZ,
  "cancelledAt"             TIMESTAMPTZ,
  "salesReviewedById"       TEXT            REFERENCES public.users(id),
  "inventoryApprovedById"   TEXT            REFERENCES public.users(id),
  "accountingConfirmedById" TEXT            REFERENCES public.users(id),
  "buildApprovedById"       TEXT            REFERENCES public.users(id),
  "completedById"           TEXT            REFERENCES public.users(id),
  "cancelledById"           TEXT            REFERENCES public.users(id),
  "createdAt"               TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  "updatedAt"               TIMESTAMPTZ     NOT NULL
);

CREATE INDEX ON public.customer_inquiries ("customerUserId", status, "createdAt");
CREATE INDEX ON public.customer_inquiries ("productId", status, "createdAt");
```

---

### `quotations`
```sql
CREATE TABLE public.quotations (
  id                          TEXT        PRIMARY KEY DEFAULT gen_random_uuid(),
  "inquiryId"                 TEXT        NOT NULL REFERENCES public.customer_inquiries(id) ON DELETE CASCADE,
  "quotationNumber"           TEXT        UNIQUE,
  "revisionNumber"            INTEGER     NOT NULL DEFAULT 1,
  "sentById"                  TEXT        REFERENCES public.users(id) ON DELETE SET NULL,
  "quotedPrice"               NUMERIC     NOT NULL,
  "quotedPriceBeforeDiscount" NUMERIC,
  "quotationDiscount"         NUMERIC     NOT NULL DEFAULT 0,
  "salesNote"                 TEXT,
  status                      TEXT        NOT NULL DEFAULT 'PENDING',
  "declineReason"             TEXT,
  "sentAt"                    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "respondedAt"               TIMESTAMPTZ,
  "createdAt"                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"                 TIMESTAMPTZ NOT NULL
);

CREATE INDEX ON public.quotations ("inquiryId", "createdAt" DESC);
```

---

### `payment_records`
```sql
CREATE TABLE public.payment_records (
  id                TEXT            PRIMARY KEY DEFAULT gen_random_uuid(),
  "inquiryId"       TEXT            REFERENCES public.customer_inquiries(id) ON DELETE CASCADE,
  "paymentNumber"   TEXT            UNIQUE,
  "recordedById"    TEXT            NOT NULL REFERENCES public.users(id),
  "paymentType"     "PaymentType"   NOT NULL,
  "paymentMethod"   TEXT,
  status            "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  amount            NUMERIC         NOT NULL,
  "remainingBalance" NUMERIC        NOT NULL,
  "paymentDate"     TIMESTAMPTZ     NOT NULL,
  "referenceNumber" TEXT,
  remarks           TEXT,
  "verifiedAt"      TIMESTAMPTZ,
  "verifiedById"    TEXT            REFERENCES public.users(id),
  "createdAt"       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  "updatedAt"       TIMESTAMPTZ     NOT NULL
);

CREATE INDEX ON public.payment_records ("inquiryId", status, "paymentDate");
```

---

### `order_chat_messages`
```sql
CREATE TABLE public.order_chat_messages (
  id               TEXT        PRIMARY KEY,
  inquiry_id       TEXT        NOT NULL REFERENCES public.customer_inquiries(id) ON DELETE CASCADE,
  sender_user_id   TEXT        REFERENCES public.users(id) ON DELETE SET NULL,
  sender_role      TEXT        NOT NULL,
  body             TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON public.order_chat_messages (inquiry_id, created_at);
```

---

### `order_chat_attachments`
```sql
CREATE TABLE public.order_chat_attachments (
  id               TEXT        PRIMARY KEY,
  message_id       TEXT        NOT NULL REFERENCES public.order_chat_messages(id) ON DELETE CASCADE,
  file_name        TEXT        NOT NULL,
  mime_type        TEXT        NOT NULL,
  attachment_type  TEXT        NOT NULL,
  data_url         TEXT        NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON public.order_chat_attachments (message_id);
```

---

### `product_materials`
```sql
CREATE TABLE public.product_materials (
  id                  TEXT        PRIMARY KEY DEFAULT gen_random_uuid(),
  "productId"         TEXT        NOT NULL REFERENCES public.products(id),
  "materialStockId"   TEXT        NOT NULL REFERENCES public.material_stocks(id),
  "quantityRequired"  NUMERIC,
  "quantityDisplay"   TEXT,
  dimension           TEXT,
  notes               TEXT,
  "createdAt"         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON public.product_materials ("materialStockId");
```

---

### `stock_movements`
```sql
CREATE TABLE public.stock_movements (
  id                TEXT                NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  "materialStockId" TEXT                REFERENCES public.material_stocks(id),
  "productStockId"  TEXT                REFERENCES public.product_stocks(id),
  type              "StockMovementType" NOT NULL,
  quantity          INTEGER             NOT NULL,
  "requesterName"   TEXT,
  "projectPurpose"  TEXT,
  "referenceNumber" TEXT,
  "createdAt"       TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);
```

---

### `return_requests`
```sql
CREATE TABLE public.return_requests (
  id                   TEXT        PRIMARY KEY DEFAULT gen_random_uuid(),
  "inquiryId"          TEXT        NOT NULL,
  "customerUserId"     TEXT,
  status               TEXT        NOT NULL,
  reason               TEXT        NOT NULL,
  details              TEXT,
  "imageUrls"          JSONB,
  "salesNote"          TEXT,
  "pickupScheduledAt"  TIMESTAMPTZ,
  "approvedById"       TEXT,
  "approvedAt"         TIMESTAMPTZ,
  "completedById"      TEXT,
  "completedAt"        TIMESTAMPTZ,
  "createdAt"          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"          TIMESTAMPTZ NOT NULL
);

CREATE INDEX ON public.return_requests ("inquiryId");
CREATE INDEX ON public.return_requests ("customerUserId");
```

---

### `suppliers`
```sql
CREATE TABLE public.suppliers (
  id              TEXT        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT        NOT NULL,
  "contactPerson" TEXT,
  email           TEXT,
  phone           TEXT,
  notes           TEXT,
  "isActive"      BOOLEAN     NOT NULL DEFAULT TRUE,
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ NOT NULL
);
```

---

### `supplier_addresses`
```sql
CREATE TABLE public.supplier_addresses (
  id           TEXT        PRIMARY KEY DEFAULT gen_random_uuid(),
  "supplierId" TEXT        NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  label        TEXT,
  address      TEXT        NOT NULL,
  city         TEXT,
  province     TEXT,
  country      TEXT,
  "postalCode" TEXT,
  "isMain"     BOOLEAN     NOT NULL DEFAULT FALSE,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"  TIMESTAMPTZ NOT NULL
);

CREATE INDEX ON public.supplier_addresses ("supplierId");
```

---

### `supplier_products`
```sql
CREATE TABLE public.supplier_products (
  id                TEXT        PRIMARY KEY DEFAULT gen_random_uuid(),
  "supplierId"      TEXT        NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  "materialStockId" TEXT        REFERENCES public.material_stocks(id) ON DELETE SET NULL,
  "materialName"    TEXT        NOT NULL,
  "unitCost"        NUMERIC,
  "unitOfMeasure"   TEXT,
  notes             TEXT,
  "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"       TIMESTAMPTZ NOT NULL
);

CREATE INDEX ON public.supplier_products ("supplierId");
```

---

### `purchase_orders`
```sql
CREATE TABLE public.purchase_orders (
  id                   TEXT                  PRIMARY KEY DEFAULT gen_random_uuid(),
  "poNumber"           TEXT                  NOT NULL UNIQUE,
  "supplierId"         TEXT                  REFERENCES public.suppliers(id),
  "requestedById"      TEXT                  NOT NULL,
  "approvedById"       TEXT,
  status               "PurchaseOrderStatus" NOT NULL DEFAULT 'DRAFT',
  "totalAmount"        NUMERIC               NOT NULL DEFAULT 0,
  remarks              TEXT,
  "expectedDeliveryAt" TIMESTAMPTZ,
  "createdAt"          TIMESTAMPTZ           NOT NULL DEFAULT NOW(),
  "updatedAt"          TIMESTAMPTZ           NOT NULL
);

CREATE INDEX ON public.purchase_orders (status);
```

---

### `purchase_order_items`
```sql
CREATE TABLE public.purchase_order_items (
  id                  TEXT        PRIMARY KEY DEFAULT gen_random_uuid(),
  "purchaseOrderId"   TEXT        NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  "materialStockId"   TEXT        NOT NULL REFERENCES public.material_stocks(id),
  "quantityOrdered"   INTEGER     NOT NULL,
  "quantityReceived"  INTEGER     NOT NULL DEFAULT 0,
  "unitCost"          NUMERIC,
  "lineTotal"         NUMERIC     NOT NULL DEFAULT 0,
  "createdAt"         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON public.purchase_order_items ("purchaseOrderId");
CREATE INDEX ON public.purchase_order_items ("materialStockId");
```

---

### `approval_history`
```sql
CREATE TABLE public.approval_history (
  id           TEXT             PRIMARY KEY DEFAULT gen_random_uuid(),
  module       "ApprovalModule" NOT NULL,
  "recordId"   TEXT             NOT NULL,
  action       "ApprovalAction" NOT NULL,
  "fromStatus" TEXT,
  "toStatus"   TEXT,
  remarks      TEXT,
  "actedById"  TEXT             NOT NULL,
  "actedAt"    TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE INDEX ON public.approval_history (module, "recordId", "actedAt");
```

---

### `audit_logs`
```sql
CREATE TABLE public.audit_logs (
  id                    TEXT              PRIMARY KEY DEFAULT gen_random_uuid(),
  "actorId"             TEXT,
  action                "AuditAction"     NOT NULL,
  "entityType"          "AuditEntityType" NOT NULL,
  "entityId"            TEXT              NOT NULL,
  "companyCodeSnapshot" TEXT,
  metadata              JSONB,
  "createdAt"           TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE INDEX ON public.audit_logs ("entityType", "entityId", "createdAt");
```

---

### `storefront_categories`
```sql
CREATE TABLE public.storefront_categories (
  id          TEXT        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL
);
```

---

### `admin_account_archives`
```sql
CREATE TABLE public.admin_account_archives (
  id               TEXT        PRIMARY KEY DEFAULT gen_random_uuid(),
  "originalUserId" TEXT        NOT NULL UNIQUE,
  name             TEXT        NOT NULL,
  email            TEXT        NOT NULL,
  role             TEXT        NOT NULL,
  "archivedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### `admin_action_archives`
```sql
CREATE TABLE public.admin_action_archives (
  id            TEXT        PRIMARY KEY DEFAULT gen_random_uuid(),
  "archiveId"   TEXT        NOT NULL REFERENCES public.admin_account_archives(id),
  "actionType"  TEXT        NOT NULL,
  description   TEXT        NOT NULL,
  "performedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata      JSONB
);

CREATE INDEX ON public.admin_action_archives ("archiveId", "performedAt");
```

---

## Schema Overview

| Table | Rows represent | Key relationships |
|-------|---------------|-------------------|
| `users` | All system users (admins + customers) | Referenced by almost every table |
| `warehouses` | Physical storage locations | Parent of product_stocks, material_stocks |
| `product_stocks` | Finished product inventory records | 1:1 with products |
| `material_stocks` | Raw material inventory records | Used in BOM, stock movements, supplier products |
| `products` | Storefront catalog items | Parent of customer_inquiries, product_materials |
| `draft_products` | Unsaved product drafts | Belongs to users |
| `customer_inquiries` | Customer orders (full lifecycle) | Central table — connects products, users, payments, chat |
| `quotations` | Formal price quotations per inquiry | Child of customer_inquiries |
| `payment_records` | Individual payment transactions | Child of customer_inquiries |
| `order_chat_messages` | Chat messages per order | Child of customer_inquiries |
| `order_chat_attachments` | File attachments in chat | Child of order_chat_messages |
| `product_materials` | Bill of Materials (BOM) | Junction: products ↔ material_stocks |
| `stock_movements` | Inventory change audit trail | References material_stocks or product_stocks |
| `return_requests` | Post-delivery return requests | References customer_inquiries |
| `suppliers` | Supplier directory | Parent of addresses, products, purchase orders |
| `supplier_addresses` | Supplier branch locations | Child of suppliers |
| `supplier_products` | Materials a supplier provides | Junction: suppliers ↔ material_stocks |
| `purchase_orders` | Restocking orders to suppliers | Parent of purchase_order_items |
| `purchase_order_items` | Line items in a purchase order | Junction: purchase_orders ↔ material_stocks |
| `approval_history` | Workflow stage transition log | References any module record |
| `audit_logs` | System-level action audit trail | References any entity |
| `storefront_categories` | Shop filter categories | Standalone |
| `admin_account_archives` | Deleted admin account records | Parent of admin_action_archives |
| `admin_action_archives` | Actions by deleted admins | Child of admin_account_archives |

---

*Generated from `packages/db/prisma/schema.prisma` — FurniTrack Sales & Inventory System*
*Database: PostgreSQL 17 on Neon (aws-ap-southeast-1)*
