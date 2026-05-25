# FurniTrack — Data Dictionary

> Describes the structure, meaning, and attributes of every table in the FurniTrack Sales & Inventory System database.

---

## Enumerations

| Enum | Values | Used In |
|------|--------|---------|
| `UserRole` | ADMIN_MANAGEMENT, SALES, INVENTORY, ACCOUNTING, OPERATIONS_DESIGN, CUSTOM, CLIENT | users.role |
| `AccountStatus` | ACTIVE, BLOCKED, EXPIRED, PENDING_ACTIVATION | users.status |
| `InquiryStatus` | RECEIVED, ACCEPTED, PENDING_INVENTORY_APPROVAL, PENDING_SALES_QUOTATION, GETTING_READY_FOR_BUILDING, WAITING_FOR_PAYMENT, PENDING_ACCOUNTING_APPROVAL, READY_FOR_SHIPMENT, READY_FOR_SHIPPING, COMPLETED | customer_inquiries.status |
| `PaymentType` | DOWN_PAYMENT, PARTIAL_PAYMENT, FULL_PAYMENT | payment_records.paymentType |
| `PaymentStatus` | PENDING, VERIFIED, REJECTED | payment_records.status |
| `StockState` | AVAILABLE, RESERVED, DAMAGED, ARCHIVED | product_stocks.state, material_stocks.state |
| `StockMovementType` | IN, OUT, ADJUSTMENT, TRANSFER, DAMAGE | stock_movements.type |
| `PurchaseOrderStatus` | DRAFT, PENDING_APPROVAL, APPROVED, REJECTED, ORDERED, GOODS_RECEIVED, CANCELLED | purchase_orders.status |
| `ApprovalModule` | PAYMENT, CUSTOMER_INQUIRY | approval_history.module |
| `ApprovalAction` | SUBMITTED, APPROVED, REJECTED, RETURNED_FOR_REVISION, FINALIZED | approval_history.action |
| `AuditAction` | USER_CREATED, USER_UPDATED, USER_BLOCKED, USER_REMOVED, STOCK_ADDED, STOCK_REMOVED, PAYMENT_ACCEPTED, DELIVERY_SCHEDULED, PRODUCT_CREATED, PRODUCT_UPDATED, … | audit_logs.action |
| `AuditEntityType` | USER, PAYMENT, RETURN_REQUEST, CHAT, INVENTORY, STOCK, BUILDING_PROJECT, DELIVERY_SCHEDULE, PRODUCT, PURCHASE_ORDER | audit_logs.entityType |

---

## Table: `users`

Stores all system users — both admin staff and customer accounts.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| authUserId | UUID | Yes | — | Foreign key to `neon_auth.user.id` (auth provider) |
| name | String | No | — | Full display name |
| email | String | No | — | Unique email address |
| role | UserRole | No | — | System role controlling access |
| status | AccountStatus | No | ACTIVE | Account lifecycle status |
| accessStartsAt | DateTime | Yes | — | Optional access window start |
| accessExpiresAt | DateTime | Yes | — | Optional access window end |
| lastLoginAt | DateTime | Yes | — | Timestamp of most recent login |
| emailVerifiedAt | DateTime | Yes | — | When email was verified |
| phone | String | Yes | — | Contact phone number |
| address | String | Yes | — | Physical address |
| permissions | JSON | Yes | — | Custom permission flags (for CUSTOM role) |
| createdAt | DateTime | No | now() | Record creation timestamp |
| updatedAt | DateTime | No | auto | Last update timestamp |

**Indexes:** `(role, status)`

---

## Table: `warehouses`

Physical storage locations for both finished products and raw materials.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| code | String | No | — | Unique short code (e.g. MAIN, ACC-WH) |
| name | String | No | — | Full warehouse name |
| street | String | Yes | — | Street address |
| city | String | Yes | — | City |
| country | String | No | Philippines | Country |
| postalCode | String | Yes | — | Postal / ZIP code |
| createdAt | DateTime | No | now() | Record creation timestamp |
| updatedAt | DateTime | No | auto | Last update timestamp |

---

## Table: `product_stocks`

Stock records for finished furniture products. One row per product SKU.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| warehouseId | String | No | — | FK → warehouses.id |
| sku | String | No | — | Unique stock-keeping unit (e.g. FP-001) |
| itemName | String | No | — | Product stock name |
| description | String | Yes | — | Optional description |
| unitOfMeasure | String | No | pcs | Unit (pcs, sets, etc.) |
| availableQty | Int | No | 0 | Current available quantity |
| reservedQty | Int | No | 0 | Quantity reserved for active orders |
| reorderThreshold | Int | No | 10 | Quantity at which low-stock alert triggers |
| state | StockState | No | AVAILABLE | Current stock state |
| createdAt | DateTime | No | now() | Record creation timestamp |
| updatedAt | DateTime | No | auto | Last update timestamp |

**Indexes:** `(warehouseId, state)`

---

## Table: `material_stocks`

Stock records for raw materials used in furniture production.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| warehouseId | String | No | — | FK → warehouses.id |
| sku | String | No | — | Unique material SKU (e.g. RM-005) |
| itemName | String | No | — | Material name (e.g. 18mm Plywood Board) |
| description | String | Yes | — | Optional description |
| unitOfMeasure | String | No | pcs | Unit (sheets, bottles, pairs, etc.) |
| availableQty | Int | No | 0 | Current available quantity |
| reservedQty | Int | No | 0 | Quantity reserved for build orders |
| reorderThreshold | Int | No | 10 | Low-stock alert threshold |
| state | StockState | No | AVAILABLE | Current stock state |
| createdAt | DateTime | No | now() | Record creation timestamp |
| updatedAt | DateTime | No | auto | Last update timestamp |

**Indexes:** `(warehouseId, state)`

---

## Table: `products`

Published furniture products visible on the storefront catalog.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| productStockId | String | No | — | FK → product_stocks.id (1-to-1) |
| slug | String | No | — | URL-friendly unique identifier |
| name | String | No | — | Product display name |
| category | String | No | — | Product category (e.g. Storage, Bedroom) |
| material | String | No | — | Primary material description |
| price | Decimal | No | — | Base selling price (PHP) |
| originalPrice | Decimal | Yes | — | Pre-sale price for discount display |
| badge | String | Yes | — | Promotional badge (BEST_SELLER, SALE, NEW) |
| images | JSON | Yes | — | Array of image URLs |
| colorVariants | JSON | No | [] | Array of {name, hex, sku} color options |
| productCode | String | Yes | — | Optional internal product code |
| rating | Decimal | No | 0 | Average customer rating (0–5) |
| reviewCount | Int | No | 0 | Total number of reviews |
| widthCm | Decimal | No | — | Width in centimeters |
| depthCm | Decimal | No | — | Depth in centimeters |
| heightCm | Decimal | No | — | Height in centimeters |
| weightKg | Decimal | No | — | Weight in kilograms |
| description | String | No | — | Full product description |
| isPublished | Boolean | No | true | Whether visible on storefront |
| createdAt | DateTime | No | now() | Record creation timestamp |
| updatedAt | DateTime | No | auto | Last update timestamp |

**Indexes:** `(category, isPublished)`

---

## Table: `customer_inquiries`

Core order table. Each row is one customer inquiry for one product, progressing through the full sales workflow.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| productId | String | No | — | FK → products.id |
| customerUserId | String | Yes | — | FK → users.id (nullable for guest) |
| customerName | String | No | — | Customer full name |
| customerEmail | String | No | — | Customer email |
| customerPhone | String | No | — | Customer phone number |
| message | String | No | — | Customer's inquiry message |
| quantity | Int | No | 1 | Number of units ordered |
| status | InquiryStatus | No | RECEIVED | Current workflow stage |
| statusNote | String | Yes | — | Internal workflow markers and notes |
| inquiryNumber | String | Yes | — | Human-readable ID (e.g. INQ-2026-00001) |
| quotedPrice | Decimal | Yes | — | Final agreed price set by sales |
| quotedPriceBeforeDiscount | Decimal | Yes | — | Price before discount was applied |
| quotationAccepted | Boolean | Yes | — | Whether customer accepted the quotation |
| salesReviewedAt | DateTime | Yes | — | When sales endorsed to inventory |
| inventoryApprovedAt | DateTime | Yes | — | When inventory approved materials |
| quotationSentAt | DateTime | Yes | — | When quotation was sent to customer |
| quotationRespondedAt | DateTime | Yes | — | When customer responded to quotation |
| customerPaidAt | DateTime | Yes | — | When customer submitted payment |
| accountingConfirmedAt | DateTime | Yes | — | When accounting verified payment |
| buildApprovedAt | DateTime | Yes | — | When operations approved build |
| shippingScheduledAt | DateTime | Yes | — | Scheduled delivery date |
| completedAt | DateTime | Yes | — | When order was marked delivered |
| cancelledAt | DateTime | Yes | — | When order was cancelled |
| salesReviewedById | String | Yes | — | FK → users.id (sales actor) |
| inventoryApprovedById | String | Yes | — | FK → users.id (inventory actor) |
| accountingConfirmedById | String | Yes | — | FK → users.id (accounting actor) |
| buildApprovedById | String | Yes | — | FK → users.id (operations actor) |
| completedById | String | Yes | — | FK → users.id (completing actor) |
| cancelledById | String | Yes | — | FK → users.id (cancelling actor) |
| createdAt | DateTime | No | now() | Record creation timestamp |
| updatedAt | DateTime | No | auto | Last update timestamp |

**Indexes:** `(customerUserId, status, createdAt)`, `(productId, status, createdAt)`

---

## Table: `quotations`

Formal quotation documents sent by sales to the customer for a specific inquiry.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| inquiryId | String | No | — | FK → customer_inquiries.id |
| quotationNumber | String | Yes | — | Unique quotation reference number |
| revisionNumber | Int | No | 1 | Revision count (increments on resend) |
| sentById | String | Yes | — | FK → users.id (sales admin who sent it) |
| quotedPrice | Decimal | No | — | Negotiated price before VAT |
| quotedPriceBeforeDiscount | Decimal | Yes | — | Price before discount |
| quotationDiscount | Decimal | No | 0 | Discount amount in PHP |
| salesNote | String | Yes | — | Optional note from sales to customer |
| status | String | No | PENDING | PENDING / ACCEPTED / DECLINED |
| declineReason | String | Yes | — | Customer's reason for declining |
| sentAt | DateTime | No | now() | When quotation was sent |
| respondedAt | DateTime | Yes | — | When customer responded |
| createdAt | DateTime | No | now() | Record creation timestamp |
| updatedAt | DateTime | No | auto | Last update timestamp |

---

## Table: `payment_records`

Individual payment transactions linked to an inquiry. Supports partial and full payments.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| inquiryId | String | Yes | — | FK → customer_inquiries.id |
| paymentNumber | String | Yes | — | Unique payment reference number |
| recordedById | String | No | — | FK → users.id (accounting admin) |
| paymentType | PaymentType | No | — | DOWN_PAYMENT / PARTIAL_PAYMENT / FULL_PAYMENT |
| paymentMethod | String | Yes | — | Cash, GCash, Bank Transfer, etc. |
| status | PaymentStatus | No | PENDING | PENDING / VERIFIED / REJECTED |
| amount | Decimal | No | — | Amount paid (PHP) |
| remainingBalance | Decimal | No | — | Balance still owed after this payment |
| paymentDate | DateTime | No | — | Date payment was made |
| referenceNumber | String | Yes | — | Bank/GCash reference number |
| remarks | String | Yes | — | Accounting notes |
| verifiedAt | DateTime | Yes | — | When accounting verified the payment |
| verifiedById | String | Yes | — | FK → users.id (verifying accountant) |
| createdAt | DateTime | No | now() | Record creation timestamp |
| updatedAt | DateTime | No | auto | Last update timestamp |

**Indexes:** `(inquiryId, status, paymentDate)`

---

## Table: `order_chat_messages`

Chat messages exchanged between customer and sales team per order.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String | No | — | Primary key (manual UUID) |
| inquiryId | String | No | — | FK → customer_inquiries.id |
| senderUserId | String | Yes | — | FK → users.id (null = system message) |
| senderRole | String | No | — | CLIENT / SALES / SYSTEM |
| body | String | Yes | — | Message text content |
| createdAt | DateTime | No | now() | Message timestamp |

**Indexes:** `(inquiryId, createdAt)`

---

## Table: `order_chat_attachments`

File attachments (e.g. payment proof images) linked to chat messages.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String | No | — | Primary key |
| messageId | String | No | — | FK → order_chat_messages.id |
| fileName | String | No | — | Original file name |
| mimeType | String | No | — | MIME type (e.g. image/jpeg) |
| attachmentType | String | No | — | Category (e.g. PAYMENT_PROOF) |
| dataUrl | String | No | — | Base64 data URL of the file |
| createdAt | DateTime | No | now() | Upload timestamp |

---

## Table: `product_materials`

Bill of Materials (BOM) — links a product to the raw materials required to build it.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| productId | String | No | — | FK → products.id |
| materialStockId | String | No | — | FK → material_stocks.id |
| quantityRequired | Decimal | Yes | — | Quantity of material needed per unit |
| quantityDisplay | String | Yes | — | Human-readable quantity (e.g. "2 sheets") |
| dimension | String | Yes | — | Optional dimension spec |
| notes | String | Yes | — | Additional notes for operations |
| createdAt | DateTime | No | now() | Record creation timestamp |

---

## Table: `stock_movements`

Audit trail of all inventory changes — additions, removals, damages, transfers.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| materialStockId | String | Yes | — | FK → material_stocks.id |
| productStockId | String | Yes | — | FK → product_stocks.id |
| type | StockMovementType | No | — | IN / OUT / ADJUSTMENT / TRANSFER / DAMAGE |
| quantity | Int | No | — | Quantity moved (positive) |
| requesterName | String | Yes | — | Name of person who requested the movement |
| projectPurpose | String | Yes | — | Reason / project reference |
| referenceNumber | String | Yes | — | Linked order or document number |
| createdAt | DateTime | No | now() | Movement timestamp |

---

## Table: `return_requests`

Customer return requests submitted after delivery.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| inquiryId | String | No | — | FK → customer_inquiries.id |
| customerUserId | String | Yes | — | FK → users.id |
| status | String | No | — | SUBMITTED / APPROVED_FOR_PICKUP / PICKED_UP_COMPLETED |
| reason | String | No | — | Customer's stated reason for return |
| details | String | Yes | — | Additional details |
| imageUrls | JSON | Yes | — | Array of image URLs for evidence |
| salesNote | String | Yes | — | Sales team note on the return |
| pickupScheduledAt | DateTime | Yes | — | Scheduled pickup date |
| approvedById | String | Yes | — | FK → users.id (approving sales admin) |
| approvedAt | DateTime | Yes | — | When return was approved |
| completedById | String | Yes | — | FK → users.id (completing admin) |
| completedAt | DateTime | Yes | — | When return was completed |
| createdAt | DateTime | No | now() | Record creation timestamp |
| updatedAt | DateTime | No | auto | Last update timestamp |

---

## Table: `suppliers`

Supplier directory for raw material procurement.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| name | String | No | — | Supplier company name |
| contactPerson | String | Yes | — | Primary contact name |
| email | String | Yes | — | Contact email |
| phone | String | Yes | — | Contact phone |
| notes | String | Yes | — | Internal notes |
| isActive | Boolean | No | true | Whether supplier is currently active |
| createdAt | DateTime | No | now() | Record creation timestamp |
| updatedAt | DateTime | No | auto | Last update timestamp |

---

## Table: `supplier_addresses`

One or more addresses per supplier (supports multiple branches).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| supplierId | String | No | — | FK → suppliers.id |
| label | String | Yes | — | Address label (e.g. Main Office, Warehouse) |
| address | String | No | — | Street address |
| city | String | Yes | — | City |
| province | String | Yes | — | Province |
| country | String | Yes | — | Country |
| postalCode | String | Yes | — | Postal code |
| isMain | Boolean | No | false | Whether this is the primary address |
| createdAt | DateTime | No | now() | Record creation timestamp |
| updatedAt | DateTime | No | auto | Last update timestamp |

---

## Table: `supplier_products`

Materials that a specific supplier can provide, with pricing.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| supplierId | String | No | — | FK → suppliers.id |
| materialStockId | String | Yes | — | FK → material_stocks.id (if linked) |
| materialName | String | No | — | Material name as listed by supplier |
| unitCost | Decimal | Yes | — | Cost per unit from this supplier |
| unitOfMeasure | String | Yes | — | Unit of measure |
| notes | String | Yes | — | Notes on this supplier-material relationship |
| createdAt | DateTime | No | now() | Record creation timestamp |
| updatedAt | DateTime | No | auto | Last update timestamp |

---

## Table: `purchase_orders`

Purchase orders sent to suppliers to restock raw materials.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| poNumber | String | No | — | Unique PO number |
| supplierId | String | Yes | — | FK → suppliers.id |
| requestedById | String | No | — | FK → users.id (operations admin) |
| approvedById | String | Yes | — | FK → users.id (approving admin) |
| status | PurchaseOrderStatus | No | DRAFT | Current PO status |
| totalAmount | Decimal | No | 0 | Total order value (PHP) |
| remarks | String | Yes | — | Notes on the purchase order |
| expectedDeliveryAt | DateTime | Yes | — | Expected delivery date |
| createdAt | DateTime | No | now() | Record creation timestamp |
| updatedAt | DateTime | No | auto | Last update timestamp |

---

## Table: `purchase_order_items`

Line items within a purchase order — one row per material ordered.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| purchaseOrderId | String | No | — | FK → purchase_orders.id |
| materialStockId | String | No | — | FK → material_stocks.id |
| quantityOrdered | Int | No | — | Quantity ordered from supplier |
| quantityReceived | Int | No | 0 | Quantity actually received |
| unitCost | Decimal | Yes | — | Cost per unit at time of order |
| lineTotal | Decimal | No | 0 | quantityOrdered × unitCost |
| createdAt | DateTime | No | now() | Record creation timestamp |

---

## Table: `approval_history`

Immutable audit trail of every workflow stage transition across the system.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| module | ApprovalModule | No | — | PAYMENT or CUSTOMER_INQUIRY |
| recordId | String | No | — | ID of the record being acted on |
| action | ApprovalAction | No | — | SUBMITTED / APPROVED / REJECTED / FINALIZED |
| fromStatus | String | Yes | — | Status before the transition |
| toStatus | String | Yes | — | Status after the transition |
| remarks | String | Yes | — | Actor's note |
| actedById | String | No | — | FK → users.id (actor) |
| actedAt | DateTime | No | now() | Timestamp of the action |

**Indexes:** `(module, recordId, actedAt)`

---

## Table: `audit_logs`

System-level audit log for all significant actions (user management, stock changes, etc.).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| actorId | String | Yes | — | FK → users.id (who performed the action) |
| action | AuditAction | No | — | Type of action performed |
| entityType | AuditEntityType | No | — | Type of entity affected |
| entityId | String | No | — | ID of the affected entity |
| companyCodeSnapshot | String | Yes | — | Company code at time of action |
| metadata | JSON | Yes | — | Additional context data |
| createdAt | DateTime | No | now() | Timestamp of the action |

**Indexes:** `(entityType, entityId, createdAt)`

---

## Table: `admin_account_archives`

Permanent record of deleted admin accounts for compliance and audit purposes.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| originalUserId | String | No | — | Auth user ID of the deleted account |
| name | String | No | — | Name at time of deletion |
| email | String | No | — | Email at time of deletion |
| role | String | No | — | Role at time of deletion |
| archivedAt | DateTime | No | now() | When the account was archived |

---

## Table: `storefront_categories`

Custom filter categories displayed on the storefront shop page.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| name | String | No | — | Unique category name |
| createdAt | DateTime | No | now() | Record creation timestamp |
| updatedAt | DateTime | No | auto | Last update timestamp |

---

## Table: `draft_products`

Temporary product drafts saved by operations admins before publishing.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (cuid) | No | auto | Primary key |
| createdById | String | No | — | FK → users.id (operations admin) |
| name | String | Yes | — | Draft product name |
| payload | JSON | No | — | Full draft form data |
| createdAt | DateTime | No | now() | Record creation timestamp |
| updatedAt | DateTime | No | auto | Last update timestamp |
| deletedAt | DateTime | Yes | — | Soft-delete timestamp |

---

*Generated from `packages/db/prisma/schema.prisma` — FurniTrack Sales & Inventory System*
