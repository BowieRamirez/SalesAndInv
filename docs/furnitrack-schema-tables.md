# FurniTrack — Database Schema Tables

> Each table is presented with its column name, data type, constraints, and description.
> Suitable for inclusion in an academic paper as Appendix — Database Schema.

---

## Table 1: `users`
Stores all system users including admin staff and customer accounts.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| authUserId | UUID | UNIQUE, NULLABLE | Link to authentication provider |
| name | TEXT | NOT NULL | Full display name |
| email | TEXT | NOT NULL, UNIQUE | Email address |
| role | VARCHAR | NOT NULL | System role (ADMIN_MANAGEMENT, SALES, OPERATIONS_DESIGN, ACCOUNTING, CUSTOM, CLIENT) |
| status | VARCHAR | NOT NULL, DEFAULT 'ACTIVE' | Account status (ACTIVE, BLOCKED, EXPIRED, PENDING_ACTIVATION) |
| accessStartsAt | TIMESTAMP | NULLABLE | Optional access window start |
| accessExpiresAt | TIMESTAMP | NULLABLE | Optional access window end |
| lastLoginAt | TIMESTAMP | NULLABLE | Most recent login timestamp |
| emailVerifiedAt | TIMESTAMP | NULLABLE | Email verification timestamp |
| phone | TEXT | NULLABLE | Contact phone number |
| address | TEXT | NULLABLE | Physical address |
| permissions | JSONB | NULLABLE | Custom permission flags for CUSTOM role |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

---

## Table 2: `warehouses`
Physical storage locations for finished products and raw materials.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| code | TEXT | NOT NULL, UNIQUE | Short warehouse code (e.g. MAIN, ACC-WH) |
| name | TEXT | NOT NULL | Full warehouse name |
| street | TEXT | NULLABLE | Street address |
| city | TEXT | NULLABLE | City |
| country | TEXT | NOT NULL, DEFAULT 'Philippines' | Country |
| postalCode | TEXT | NULLABLE | Postal code |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

---

## Table 3: `product_stocks`
Inventory records for finished furniture products.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| warehouseId | TEXT | NOT NULL, FK → warehouses | Warehouse where stock is stored |
| sku | TEXT | NOT NULL, UNIQUE | Stock-keeping unit (e.g. FP-001) |
| itemName | TEXT | NOT NULL | Product stock name |
| description | TEXT | NULLABLE | Optional description |
| unitOfMeasure | TEXT | NOT NULL, DEFAULT 'pcs' | Unit of measure |
| availableQty | INTEGER | NOT NULL, DEFAULT 0 | Current available quantity |
| reservedQty | INTEGER | NOT NULL, DEFAULT 0 | Quantity reserved for active orders |
| reorderThreshold | INTEGER | NOT NULL, DEFAULT 10 | Low-stock alert threshold |
| state | VARCHAR | NOT NULL, DEFAULT 'AVAILABLE' | Stock state (AVAILABLE, RESERVED, DAMAGED, ARCHIVED) |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

---

## Table 4: `material_stocks`
Inventory records for raw materials used in furniture production.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| warehouseId | TEXT | NOT NULL, FK → warehouses | Warehouse where material is stored |
| sku | TEXT | NOT NULL, UNIQUE | Material SKU (e.g. RM-005) |
| itemName | TEXT | NOT NULL | Material name (e.g. 18mm Plywood Board) |
| description | TEXT | NULLABLE | Optional description |
| unitOfMeasure | TEXT | NOT NULL, DEFAULT 'pcs' | Unit (sheets, bottles, pairs, etc.) |
| availableQty | INTEGER | NOT NULL, DEFAULT 0 | Current available quantity |
| reservedQty | INTEGER | NOT NULL, DEFAULT 0 | Quantity reserved for build orders |
| reorderThreshold | INTEGER | NOT NULL, DEFAULT 10 | Low-stock alert threshold |
| state | VARCHAR | NOT NULL, DEFAULT 'AVAILABLE' | Stock state (AVAILABLE, RESERVED, DAMAGED, ARCHIVED) |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

---

## Table 5: `products`
Published furniture products visible on the storefront catalog.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| productStockId | TEXT | NOT NULL, UNIQUE, FK → product_stocks | Linked stock record (1:1) |
| slug | TEXT | NOT NULL, UNIQUE | URL-friendly identifier |
| name | TEXT | NOT NULL | Product display name |
| category | TEXT | NOT NULL | Product category |
| material | TEXT | NOT NULL | Primary material description |
| price | DECIMAL | NOT NULL | Base selling price (PHP) |
| originalPrice | DECIMAL | NULLABLE | Pre-sale price for discount display |
| badge | TEXT | NULLABLE | Promotional badge (BEST_SELLER, SALE, NEW) |
| images | JSONB | NULLABLE | Array of image URLs |
| colorVariants | JSONB | NOT NULL, DEFAULT '[]' | Array of color options {name, hex, sku} |
| productCode | TEXT | UNIQUE, NULLABLE | Internal product code |
| rating | DECIMAL | NOT NULL, DEFAULT 0 | Average customer rating (0–5) |
| reviewCount | INTEGER | NOT NULL, DEFAULT 0 | Total number of reviews |
| widthCm | DECIMAL | NOT NULL | Width in centimeters |
| depthCm | DECIMAL | NOT NULL | Depth in centimeters |
| heightCm | DECIMAL | NOT NULL | Height in centimeters |
| weightKg | DECIMAL | NOT NULL | Weight in kilograms |
| description | TEXT | NOT NULL | Full product description |
| isPublished | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether visible on storefront |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

---

## Table 6: `customer_inquiries`
Core order table tracking the full lifecycle from inquiry to delivery.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| productId | TEXT | NOT NULL, FK → products | Product being inquired about |
| customerUserId | TEXT | NULLABLE, FK → users | Linked customer account |
| customerName | TEXT | NOT NULL | Customer full name |
| customerEmail | TEXT | NOT NULL | Customer email |
| customerPhone | TEXT | NOT NULL | Customer phone number |
| message | TEXT | NOT NULL | Customer inquiry message |
| quantity | INTEGER | NOT NULL, DEFAULT 1 | Number of units ordered |
| status | VARCHAR | NOT NULL, DEFAULT 'RECEIVED' | Current workflow stage |
| statusNote | TEXT | NULLABLE | Internal workflow markers and notes |
| inquiryNumber | TEXT | UNIQUE, NULLABLE | Human-readable ID (e.g. INQ-2026-00001) |
| quotedPrice | DECIMAL | NULLABLE | Final agreed price set by sales |
| quotedPriceBeforeDiscount | DECIMAL | NULLABLE | Price before discount |
| quotationRevisionCount | INTEGER | NOT NULL, DEFAULT 0 | Number of quotation revisions |
| quotationDiscount | DECIMAL | NOT NULL, DEFAULT 0 | Discount amount in PHP |
| quotationAccepted | BOOLEAN | NULLABLE | Whether customer accepted the quotation |
| salesReviewedAt | TIMESTAMP | NULLABLE | When sales endorsed to inventory |
| inventoryApprovedAt | TIMESTAMP | NULLABLE | When inventory approved materials |
| quotationSentAt | TIMESTAMP | NULLABLE | When quotation was sent |
| quotationRespondedAt | TIMESTAMP | NULLABLE | When customer responded |
| customerPaidAt | TIMESTAMP | NULLABLE | When customer submitted payment |
| accountingConfirmedAt | TIMESTAMP | NULLABLE | When accounting verified payment |
| buildApprovedAt | TIMESTAMP | NULLABLE | When operations approved build |
| shippingScheduledAt | TIMESTAMP | NULLABLE | Scheduled delivery date |
| completedAt | TIMESTAMP | NULLABLE | When order was marked delivered |
| cancelledAt | TIMESTAMP | NULLABLE | When order was cancelled |
| salesReviewedById | TEXT | NULLABLE, FK → users | Sales admin who reviewed |
| inventoryApprovedById | TEXT | NULLABLE, FK → users | Inventory admin who approved |
| accountingConfirmedById | TEXT | NULLABLE, FK → users | Accounting admin who confirmed |
| buildApprovedById | TEXT | NULLABLE, FK → users | Operations admin who approved build |
| completedById | TEXT | NULLABLE, FK → users | Admin who completed the order |
| cancelledById | TEXT | NULLABLE, FK → users | Admin who cancelled the order |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

---

## Table 7: `quotations`
Formal quotation documents sent by sales to the customer.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| inquiryId | TEXT | NOT NULL, FK → customer_inquiries | Linked inquiry |
| quotationNumber | TEXT | UNIQUE, NULLABLE | Unique quotation reference number |
| revisionNumber | INTEGER | NOT NULL, DEFAULT 1 | Revision count |
| sentById | TEXT | NULLABLE, FK → users | Sales admin who sent it |
| quotedPrice | DECIMAL | NOT NULL | Negotiated price before VAT |
| quotedPriceBeforeDiscount | DECIMAL | NULLABLE | Price before discount |
| quotationDiscount | DECIMAL | NOT NULL, DEFAULT 0 | Discount amount in PHP |
| salesNote | TEXT | NULLABLE | Optional note from sales |
| status | TEXT | NOT NULL, DEFAULT 'PENDING' | PENDING / ACCEPTED / DECLINED |
| declineReason | TEXT | NULLABLE | Customer's reason for declining |
| sentAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | When quotation was sent |
| respondedAt | TIMESTAMP | NULLABLE | When customer responded |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

---

## Table 8: `payment_records`
Individual payment transactions linked to an inquiry.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| inquiryId | TEXT | NULLABLE, FK → customer_inquiries | Linked inquiry |
| paymentNumber | TEXT | UNIQUE, NULLABLE | Unique payment reference number |
| recordedById | TEXT | NOT NULL, FK → users | Accounting admin who recorded it |
| paymentType | VARCHAR | NOT NULL | DOWN_PAYMENT / PARTIAL_PAYMENT / FULL_PAYMENT |
| paymentMethod | TEXT | NULLABLE | Cash, GCash, Bank Transfer, etc. |
| status | VARCHAR | NOT NULL, DEFAULT 'PENDING' | PENDING / VERIFIED / REJECTED |
| amount | DECIMAL | NOT NULL | Amount paid (PHP) |
| remainingBalance | DECIMAL | NOT NULL | Balance still owed after this payment |
| paymentDate | TIMESTAMP | NOT NULL | Date payment was made |
| referenceNumber | TEXT | NULLABLE | Bank/GCash reference number |
| remarks | TEXT | NULLABLE | Accounting notes |
| verifiedAt | TIMESTAMP | NULLABLE | When accounting verified the payment |
| verifiedById | TEXT | NULLABLE, FK → users | Accounting admin who verified |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

---

## Table 9: `order_chat_messages`
Chat messages between customer and sales team per order.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| inquiry_id | TEXT | NOT NULL, FK → customer_inquiries | Linked inquiry/order |
| sender_user_id | TEXT | NULLABLE, FK → users | Sender (null = system message) |
| sender_role | TEXT | NOT NULL | CLIENT / SALES / SYSTEM |
| body | TEXT | NULLABLE | Message text content |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Message timestamp |

---

## Table 10: `order_chat_attachments`
File attachments linked to chat messages (e.g. payment proof).

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| message_id | TEXT | NOT NULL, FK → order_chat_messages | Linked message |
| file_name | TEXT | NOT NULL | Original file name |
| mime_type | TEXT | NOT NULL | MIME type (e.g. image/jpeg) |
| attachment_type | TEXT | NOT NULL | Category (e.g. PAYMENT_PROOF) |
| data_url | TEXT | NOT NULL | Base64 data URL of the file |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Upload timestamp |

---

## Table 11: `product_materials`
Bill of Materials — links a product to the raw materials needed to build it.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| productId | TEXT | NOT NULL, FK → products | Linked product |
| materialStockId | TEXT | NOT NULL, FK → material_stocks | Required material |
| quantityRequired | DECIMAL | NULLABLE | Quantity of material per unit |
| quantityDisplay | TEXT | NULLABLE | Human-readable quantity (e.g. "2 sheets") |
| dimension | TEXT | NULLABLE | Optional dimension specification |
| notes | TEXT | NULLABLE | Additional notes for operations |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |

---

## Table 12: `stock_movements`
Audit trail of all inventory changes.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| materialStockId | TEXT | NULLABLE, FK → material_stocks | Affected material stock |
| productStockId | TEXT | NULLABLE, FK → product_stocks | Affected product stock |
| type | VARCHAR | NOT NULL | IN / OUT / ADJUSTMENT / TRANSFER / DAMAGE |
| quantity | INTEGER | NOT NULL | Quantity moved |
| requesterName | TEXT | NULLABLE | Person who requested the movement |
| projectPurpose | TEXT | NULLABLE | Reason or project reference |
| referenceNumber | TEXT | NULLABLE | Linked order or document number |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Movement timestamp |

---

## Table 13: `return_requests`
Customer return requests submitted after delivery.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| inquiryId | TEXT | NOT NULL, FK → customer_inquiries | Linked order |
| customerUserId | TEXT | NULLABLE, FK → users | Customer who submitted the return |
| status | TEXT | NOT NULL | SUBMITTED / APPROVED_FOR_PICKUP / PICKED_UP_COMPLETED |
| reason | TEXT | NOT NULL | Customer's stated reason |
| details | TEXT | NULLABLE | Additional details |
| imageUrls | JSONB | NULLABLE | Evidence image URLs |
| salesNote | TEXT | NULLABLE | Sales team note |
| pickupScheduledAt | TIMESTAMP | NULLABLE | Scheduled pickup date |
| approvedById | TEXT | NULLABLE, FK → users | Sales admin who approved |
| approvedAt | TIMESTAMP | NULLABLE | Approval timestamp |
| completedById | TEXT | NULLABLE, FK → users | Admin who completed the return |
| completedAt | TIMESTAMP | NULLABLE | Completion timestamp |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

---

## Table 14: `suppliers`
Supplier directory for raw material procurement.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| name | TEXT | NOT NULL | Supplier company name |
| contactPerson | TEXT | NULLABLE | Primary contact name |
| email | TEXT | NULLABLE | Contact email |
| phone | TEXT | NULLABLE | Contact phone |
| notes | TEXT | NULLABLE | Internal notes |
| isActive | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether supplier is active |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

---

## Table 15: `supplier_addresses`
One or more addresses per supplier.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| supplierId | TEXT | NOT NULL, FK → suppliers | Linked supplier |
| label | TEXT | NULLABLE | Address label (e.g. Main Office) |
| address | TEXT | NOT NULL | Street address |
| city | TEXT | NULLABLE | City |
| province | TEXT | NULLABLE | Province |
| country | TEXT | NULLABLE | Country |
| postalCode | TEXT | NULLABLE | Postal code |
| isMain | BOOLEAN | NOT NULL, DEFAULT FALSE | Whether this is the primary address |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

---

## Table 16: `supplier_products`
Materials that a specific supplier can provide.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| supplierId | TEXT | NOT NULL, FK → suppliers | Linked supplier |
| materialStockId | TEXT | NULLABLE, FK → material_stocks | Linked material (if matched) |
| materialName | TEXT | NOT NULL | Material name as listed by supplier |
| unitCost | DECIMAL | NULLABLE | Cost per unit from this supplier |
| unitOfMeasure | TEXT | NULLABLE | Unit of measure |
| notes | TEXT | NULLABLE | Notes on this supplier-material relationship |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

---

## Table 17: `purchase_orders`
Purchase orders sent to suppliers to restock raw materials.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| poNumber | TEXT | NOT NULL, UNIQUE | Unique PO number |
| supplierId | TEXT | NULLABLE, FK → suppliers | Linked supplier |
| requestedById | TEXT | NOT NULL, FK → users | Operations admin who created it |
| approvedById | TEXT | NULLABLE, FK → users | Admin who approved it |
| status | VARCHAR | NOT NULL, DEFAULT 'DRAFT' | DRAFT / PENDING_APPROVAL / APPROVED / REJECTED / ORDERED / GOODS_RECEIVED / CANCELLED |
| totalAmount | DECIMAL | NOT NULL, DEFAULT 0 | Total order value (PHP) |
| remarks | TEXT | NULLABLE | Notes on the purchase order |
| expectedDeliveryAt | TIMESTAMP | NULLABLE | Expected delivery date |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

---

## Table 18: `purchase_order_items`
Line items within a purchase order.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| purchaseOrderId | TEXT | NOT NULL, FK → purchase_orders | Linked purchase order |
| materialStockId | TEXT | NOT NULL, FK → material_stocks | Material being ordered |
| quantityOrdered | INTEGER | NOT NULL | Quantity ordered from supplier |
| quantityReceived | INTEGER | NOT NULL, DEFAULT 0 | Quantity actually received |
| unitCost | DECIMAL | NULLABLE | Cost per unit at time of order |
| lineTotal | DECIMAL | NOT NULL, DEFAULT 0 | quantityOrdered × unitCost |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |

---

## Table 19: `approval_history`
Immutable audit trail of every workflow stage transition.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| module | VARCHAR | NOT NULL | PAYMENT or CUSTOMER_INQUIRY |
| recordId | TEXT | NOT NULL | ID of the record being acted on |
| action | VARCHAR | NOT NULL | SUBMITTED / APPROVED / REJECTED / RETURNED_FOR_REVISION / FINALIZED |
| fromStatus | TEXT | NULLABLE | Status before the transition |
| toStatus | TEXT | NULLABLE | Status after the transition |
| remarks | TEXT | NULLABLE | Actor's note |
| actedById | TEXT | NOT NULL, FK → users | Admin who performed the action |
| actedAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Timestamp of the action |

---

## Table 20: `audit_logs`
System-level audit log for all significant actions.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| actorId | TEXT | NULLABLE, FK → users | Who performed the action |
| action | TEXT | NOT NULL | Type of action performed |
| entityType | TEXT | NOT NULL | Type of entity affected |
| entityId | TEXT | NOT NULL | ID of the affected entity |
| metadata | JSONB | NULLABLE | Additional context data |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Timestamp of the action |

---

## Table 21: `storefront_categories`
Custom filter categories displayed on the storefront shop page.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| name | TEXT | NOT NULL, UNIQUE | Category name |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

---

## Table 22: `admin_account_archives`
Permanent record of deleted admin accounts.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| originalUserId | TEXT | NOT NULL, UNIQUE | Auth user ID of the deleted account |
| name | TEXT | NOT NULL | Name at time of deletion |
| email | TEXT | NOT NULL | Email at time of deletion |
| role | TEXT | NOT NULL | Role at time of deletion |
| archivedAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | When the account was archived |

---

## Table 23: `admin_action_archives`
Historical actions performed by deleted admin accounts.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| archiveId | TEXT | NOT NULL, FK → admin_account_archives | Linked archived account |
| actionType | TEXT | NOT NULL | Type of action performed |
| description | TEXT | NOT NULL | Description of the action |
| performedAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | When the action was performed |
| metadata | JSONB | NULLABLE | Additional context data |

---

## Table 24: `draft_products`
Temporary product drafts saved before publishing.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique record identifier |
| createdById | TEXT | NOT NULL, FK → users | Operations admin who created it |
| name | TEXT | NULLABLE | Draft product name |
| payload | JSONB | NOT NULL | Full draft form data |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |
| deletedAt | TIMESTAMP | NULLABLE | Soft-delete timestamp |

---

*FurniTrack Sales & Inventory System — Database: PostgreSQL 17 on Neon (aws-ap-southeast-1)*
*Total tables: 24 | Generated from `packages/db/prisma/schema.prisma`*
