-- FurniTrack Database Schema
-- Paste this into dbdiagram.io → Import → From PostgreSQL
-- or use at https://dbdiagram.io

CREATE TYPE "UserRole" AS ENUM ('ADMIN_MANAGEMENT','SALES','INVENTORY','ACCOUNTING','OPERATIONS_DESIGN','CUSTOM','CLIENT');
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE','BLOCKED','EXPIRED','PENDING_ACTIVATION');
CREATE TYPE "InquiryStatus" AS ENUM ('RECEIVED','ACCEPTED','PENDING_INVENTORY_APPROVAL','PENDING_SALES_QUOTATION','GETTING_READY_FOR_BUILDING','WAITING_FOR_PAYMENT','PENDING_ACCOUNTING_APPROVAL','READY_FOR_SHIPMENT','READY_FOR_SHIPPING','COMPLETED');
CREATE TYPE "PaymentType" AS ENUM ('DOWN_PAYMENT','PARTIAL_PAYMENT','FULL_PAYMENT');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING','VERIFIED','REJECTED');
CREATE TYPE "StockState" AS ENUM ('AVAILABLE','RESERVED','DAMAGED','ARCHIVED');
CREATE TYPE "StockMovementType" AS ENUM ('IN','OUT','ADJUSTMENT','TRANSFER','DAMAGE');
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('DRAFT','PENDING_APPROVAL','APPROVED','REJECTED','ORDERED','GOODS_RECEIVED','CANCELLED');
CREATE TYPE "ApprovalModule" AS ENUM ('PAYMENT','CUSTOMER_INQUIRY');
CREATE TYPE "ApprovalAction" AS ENUM ('SUBMITTED','APPROVED','REJECTED','RETURNED_FOR_REVISION','FINALIZED');

CREATE TABLE "users" (
  "id" TEXT PRIMARY KEY,
  "authUserId" UUID UNIQUE,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "role" "UserRole" NOT NULL,
  "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
  "accessStartsAt" TIMESTAMPTZ,
  "accessExpiresAt" TIMESTAMPTZ,
  "lastLoginAt" TIMESTAMPTZ,
  "emailVerifiedAt" TIMESTAMPTZ,
  "phone" TEXT,
  "address" TEXT,
  "permissions" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE TABLE "warehouses" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "street" TEXT,
  "city" TEXT,
  "country" TEXT NOT NULL DEFAULT 'Philippines',
  "postalCode" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE TABLE "product_stocks" (
  "id" TEXT PRIMARY KEY,
  "warehouseId" TEXT NOT NULL,
  "sku" TEXT NOT NULL UNIQUE,
  "itemName" TEXT NOT NULL,
  "description" TEXT,
  "unitOfMeasure" TEXT NOT NULL DEFAULT 'pcs',
  "availableQty" INTEGER NOT NULL DEFAULT 0,
  "reservedQty" INTEGER NOT NULL DEFAULT 0,
  "reorderThreshold" INTEGER NOT NULL DEFAULT 10,
  "state" "StockState" NOT NULL DEFAULT 'AVAILABLE',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL,
  FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id")
);

CREATE TABLE "material_stocks" (
  "id" TEXT PRIMARY KEY,
  "warehouseId" TEXT NOT NULL,
  "sku" TEXT NOT NULL UNIQUE,
  "itemName" TEXT NOT NULL,
  "description" TEXT,
  "unitOfMeasure" TEXT NOT NULL DEFAULT 'pcs',
  "availableQty" INTEGER NOT NULL DEFAULT 0,
  "reservedQty" INTEGER NOT NULL DEFAULT 0,
  "reorderThreshold" INTEGER NOT NULL DEFAULT 10,
  "state" "StockState" NOT NULL DEFAULT 'AVAILABLE',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL,
  FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id")
);

CREATE TABLE "products" (
  "id" TEXT PRIMARY KEY,
  "productStockId" TEXT NOT NULL UNIQUE,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "material" TEXT NOT NULL,
  "price" NUMERIC NOT NULL,
  "originalPrice" NUMERIC,
  "badge" TEXT,
  "images" JSONB,
  "colorVariants" JSONB NOT NULL DEFAULT '[]',
  "productCode" TEXT UNIQUE,
  "rating" NUMERIC NOT NULL DEFAULT 0,
  "reviewCount" INTEGER NOT NULL DEFAULT 0,
  "widthCm" NUMERIC NOT NULL,
  "depthCm" NUMERIC NOT NULL,
  "heightCm" NUMERIC NOT NULL,
  "weightKg" NUMERIC NOT NULL,
  "description" TEXT NOT NULL,
  "isPublished" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL,
  FOREIGN KEY ("productStockId") REFERENCES "product_stocks"("id")
);

CREATE TABLE "customer_inquiries" (
  "id" TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL,
  "customerUserId" TEXT,
  "customerName" TEXT NOT NULL,
  "customerEmail" TEXT NOT NULL,
  "customerPhone" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "status" "InquiryStatus" NOT NULL DEFAULT 'RECEIVED',
  "statusNote" TEXT,
  "inquiryNumber" TEXT UNIQUE,
  "quotedPrice" NUMERIC,
  "quotedPriceBeforeDiscount" NUMERIC,
  "quotationRevisionCount" INTEGER NOT NULL DEFAULT 0,
  "quotationDiscount" NUMERIC NOT NULL DEFAULT 0,
  "quotationAccepted" BOOLEAN,
  "salesReviewedAt" TIMESTAMPTZ,
  "inventoryApprovedAt" TIMESTAMPTZ,
  "quotationSentAt" TIMESTAMPTZ,
  "quotationRespondedAt" TIMESTAMPTZ,
  "customerPaidAt" TIMESTAMPTZ,
  "accountingConfirmedAt" TIMESTAMPTZ,
  "buildApprovedAt" TIMESTAMPTZ,
  "shippingScheduledAt" TIMESTAMPTZ,
  "completedAt" TIMESTAMPTZ,
  "cancelledAt" TIMESTAMPTZ,
  "salesReviewedById" TEXT,
  "inventoryApprovedById" TEXT,
  "accountingConfirmedById" TEXT,
  "buildApprovedById" TEXT,
  "completedById" TEXT,
  "cancelledById" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL,
  FOREIGN KEY ("productId") REFERENCES "products"("id"),
  FOREIGN KEY ("customerUserId") REFERENCES "users"("id"),
  FOREIGN KEY ("salesReviewedById") REFERENCES "users"("id"),
  FOREIGN KEY ("inventoryApprovedById") REFERENCES "users"("id"),
  FOREIGN KEY ("accountingConfirmedById") REFERENCES "users"("id"),
  FOREIGN KEY ("buildApprovedById") REFERENCES "users"("id"),
  FOREIGN KEY ("completedById") REFERENCES "users"("id"),
  FOREIGN KEY ("cancelledById") REFERENCES "users"("id")
);

CREATE TABLE "quotations" (
  "id" TEXT PRIMARY KEY,
  "inquiryId" TEXT NOT NULL,
  "quotationNumber" TEXT UNIQUE,
  "revisionNumber" INTEGER NOT NULL DEFAULT 1,
  "sentById" TEXT,
  "quotedPrice" NUMERIC NOT NULL,
  "quotedPriceBeforeDiscount" NUMERIC,
  "quotationDiscount" NUMERIC NOT NULL DEFAULT 0,
  "salesNote" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "declineReason" TEXT,
  "sentAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "respondedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL,
  FOREIGN KEY ("inquiryId") REFERENCES "customer_inquiries"("id") ON DELETE CASCADE,
  FOREIGN KEY ("sentById") REFERENCES "users"("id") ON DELETE SET NULL
);

CREATE TABLE "payment_records" (
  "id" TEXT PRIMARY KEY,
  "inquiryId" TEXT,
  "paymentNumber" TEXT UNIQUE,
  "recordedById" TEXT NOT NULL,
  "paymentType" "PaymentType" NOT NULL,
  "paymentMethod" TEXT,
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "amount" NUMERIC NOT NULL,
  "remainingBalance" NUMERIC NOT NULL,
  "paymentDate" TIMESTAMPTZ NOT NULL,
  "referenceNumber" TEXT,
  "remarks" TEXT,
  "verifiedAt" TIMESTAMPTZ,
  "verifiedById" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL,
  FOREIGN KEY ("inquiryId") REFERENCES "customer_inquiries"("id") ON DELETE CASCADE,
  FOREIGN KEY ("recordedById") REFERENCES "users"("id"),
  FOREIGN KEY ("verifiedById") REFERENCES "users"("id")
);

CREATE TABLE "order_chat_messages" (
  "id" TEXT PRIMARY KEY,
  "inquiry_id" TEXT NOT NULL,
  "sender_user_id" TEXT,
  "sender_role" TEXT NOT NULL,
  "body" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("inquiry_id") REFERENCES "customer_inquiries"("id") ON DELETE CASCADE,
  FOREIGN KEY ("sender_user_id") REFERENCES "users"("id") ON DELETE SET NULL
);

CREATE TABLE "order_chat_attachments" (
  "id" TEXT PRIMARY KEY,
  "message_id" TEXT NOT NULL,
  "file_name" TEXT NOT NULL,
  "mime_type" TEXT NOT NULL,
  "attachment_type" TEXT NOT NULL,
  "data_url" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("message_id") REFERENCES "order_chat_messages"("id") ON DELETE CASCADE
);

CREATE TABLE "product_materials" (
  "id" TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL,
  "materialStockId" TEXT NOT NULL,
  "quantityRequired" NUMERIC,
  "quantityDisplay" TEXT,
  "dimension" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("productId") REFERENCES "products"("id"),
  FOREIGN KEY ("materialStockId") REFERENCES "material_stocks"("id")
);

CREATE TABLE "stock_movements" (
  "id" TEXT PRIMARY KEY,
  "materialStockId" TEXT,
  "productStockId" TEXT,
  "type" "StockMovementType" NOT NULL,
  "quantity" INTEGER NOT NULL,
  "requesterName" TEXT,
  "projectPurpose" TEXT,
  "referenceNumber" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("materialStockId") REFERENCES "material_stocks"("id"),
  FOREIGN KEY ("productStockId") REFERENCES "product_stocks"("id")
);

CREATE TABLE "return_requests" (
  "id" TEXT PRIMARY KEY,
  "inquiryId" TEXT NOT NULL,
  "customerUserId" TEXT,
  "status" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "details" TEXT,
  "imageUrls" JSONB,
  "salesNote" TEXT,
  "pickupScheduledAt" TIMESTAMPTZ,
  "approvedById" TEXT,
  "approvedAt" TIMESTAMPTZ,
  "completedById" TEXT,
  "completedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE TABLE "suppliers" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "contactPerson" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "notes" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE TABLE "supplier_addresses" (
  "id" TEXT PRIMARY KEY,
  "supplierId" TEXT NOT NULL,
  "label" TEXT,
  "address" TEXT NOT NULL,
  "city" TEXT,
  "province" TEXT,
  "country" TEXT,
  "postalCode" TEXT,
  "isMain" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL,
  FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE
);

CREATE TABLE "supplier_products" (
  "id" TEXT PRIMARY KEY,
  "supplierId" TEXT NOT NULL,
  "materialStockId" TEXT,
  "materialName" TEXT NOT NULL,
  "unitCost" NUMERIC,
  "unitOfMeasure" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL,
  FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE,
  FOREIGN KEY ("materialStockId") REFERENCES "material_stocks"("id") ON DELETE SET NULL
);

CREATE TABLE "purchase_orders" (
  "id" TEXT PRIMARY KEY,
  "poNumber" TEXT NOT NULL UNIQUE,
  "supplierId" TEXT,
  "requestedById" TEXT NOT NULL,
  "approvedById" TEXT,
  "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'DRAFT',
  "totalAmount" NUMERIC NOT NULL DEFAULT 0,
  "remarks" TEXT,
  "expectedDeliveryAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL,
  FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id")
);

CREATE TABLE "purchase_order_items" (
  "id" TEXT PRIMARY KEY,
  "purchaseOrderId" TEXT NOT NULL,
  "materialStockId" TEXT NOT NULL,
  "quantityOrdered" INTEGER NOT NULL,
  "quantityReceived" INTEGER NOT NULL DEFAULT 0,
  "unitCost" NUMERIC,
  "lineTotal" NUMERIC NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE CASCADE,
  FOREIGN KEY ("materialStockId") REFERENCES "material_stocks"("id")
);

CREATE TABLE "approval_history" (
  "id" TEXT PRIMARY KEY,
  "module" "ApprovalModule" NOT NULL,
  "recordId" TEXT NOT NULL,
  "action" "ApprovalAction" NOT NULL,
  "fromStatus" TEXT,
  "toStatus" TEXT,
  "remarks" TEXT,
  "actedById" TEXT NOT NULL,
  "actedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "audit_logs" (
  "id" TEXT PRIMARY KEY,
  "actorId" TEXT,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "storefront_categories" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE TABLE "admin_account_archives" (
  "id" TEXT PRIMARY KEY,
  "originalUserId" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "archivedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "admin_action_archives" (
  "id" TEXT PRIMARY KEY,
  "archiveId" TEXT NOT NULL,
  "actionType" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "performedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "metadata" JSONB,
  FOREIGN KEY ("archiveId") REFERENCES "admin_account_archives"("id")
);

CREATE TABLE "draft_products" (
  "id" TEXT PRIMARY KEY,
  "createdById" TEXT NOT NULL,
  "name" TEXT,
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL,
  "deletedAt" TIMESTAMPTZ,
  FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE
);
