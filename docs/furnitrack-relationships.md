# FurniTrack — Table Relationships

> Describes how every table in the FurniTrack database connects to other tables, the type of relationship, and what it means in business terms.

---

## Relationship Types Used

| Symbol | Meaning |
|--------|---------|
| **1 : 1** | One record in Table A relates to exactly one record in Table B |
| **1 : M** | One record in Table A relates to many records in Table B |
| **M : M** | Many records in Table A relate to many records in Table B (via a junction table) |

---

## 1. Users → Customer Inquiries
**Type:** 1 : M (one user, many inquiries)

| From | Foreign Key | To |
|------|------------|-----|
| `users.id` | `customer_inquiries.customerUserId` | `customer_inquiries` |
| `users.id` | `customer_inquiries.salesReviewedById` | `customer_inquiries` |
| `users.id` | `customer_inquiries.inventoryApprovedById` | `customer_inquiries` |
| `users.id` | `customer_inquiries.accountingConfirmedById` | `customer_inquiries` |
| `users.id` | `customer_inquiries.buildApprovedById` | `customer_inquiries` |
| `users.id` | `customer_inquiries.completedById` | `customer_inquiries` |
| `users.id` | `customer_inquiries.cancelledById` | `customer_inquiries` |

**Business meaning:** A customer can submit multiple inquiries. Each workflow stage (sales review, inventory approval, accounting confirmation, build approval, completion, cancellation) records which admin user performed the action.

---

## 2. Products → Customer Inquiries
**Type:** 1 : M (one product, many inquiries)

| From | Foreign Key | To |
|------|------------|-----|
| `products.id` | `customer_inquiries.productId` | `customer_inquiries` |

**Business meaning:** A single product can be inquired about by many different customers. Each inquiry is for exactly one product.

---

## 3. Products → Product Stocks
**Type:** 1 : 1 (one product, one stock record)

| From | Foreign Key | To |
|------|------------|-----|
| `product_stocks.id` | `products.productStockId` | `products` |

**Business meaning:** Every published product has exactly one stock record that tracks its SKU, available quantity, and warehouse location.

---

## 4. Warehouses → Product Stocks / Material Stocks
**Type:** 1 : M (one warehouse, many stock items)

| From | Foreign Key | To |
|------|------------|-----|
| `warehouses.id` | `product_stocks.warehouseId` | `product_stocks` |
| `warehouses.id` | `material_stocks.warehouseId` | `material_stocks` |

**Business meaning:** A warehouse stores many finished products and raw materials. Each stock item belongs to exactly one warehouse.

---

## 5. Products ↔ Material Stocks (Bill of Materials)
**Type:** M : M via `product_materials`

| From | Junction Table | To |
|------|---------------|-----|
| `products.id` | `product_materials.productId` | `product_materials` |
| `material_stocks.id` | `product_materials.materialStockId` | `product_materials` |

**Business meaning:** One product requires many raw materials to build (BOM). One raw material can be used across many different products. The `product_materials` table stores the quantity required per material per product.

---

## 6. Customer Inquiries → Quotations
**Type:** 1 : M (one inquiry, many quotation revisions)

| From | Foreign Key | To |
|------|------------|-----|
| `customer_inquiries.id` | `quotations.inquiryId` | `quotations` |

**Business meaning:** Sales may send multiple revised quotations for a single inquiry (if the customer declines). Each revision is stored as a separate quotation record with an incrementing `revisionNumber`.

---

## 7. Users → Quotations
**Type:** 1 : M (one sales admin, many quotations sent)

| From | Foreign Key | To |
|------|------------|-----|
| `users.id` | `quotations.sentById` | `quotations` |

**Business meaning:** Tracks which sales admin sent each quotation for accountability.

---

## 8. Customer Inquiries → Payment Records
**Type:** 1 : M (one inquiry, many payment records)

| From | Foreign Key | To |
|------|------------|-----|
| `customer_inquiries.id` | `payment_records.inquiryId` | `payment_records` |

**Business meaning:** An order may have multiple payment records — a down payment first, then a balance payment. Each is a separate record with its own verification status.

---

## 9. Users → Payment Records
**Type:** 1 : M (one user, many payments recorded or verified)

| From | Foreign Key | To |
|------|------------|-----|
| `users.id` | `payment_records.recordedById` | `payment_records` |
| `users.id` | `payment_records.verifiedById` | `payment_records` |

**Business meaning:** The accounting admin who records a payment and the one who verifies it are both tracked separately.

---

## 10. Customer Inquiries → Order Chat Messages
**Type:** 1 : M (one inquiry, many chat messages)

| From | Foreign Key | To |
|------|------------|-----|
| `customer_inquiries.id` | `order_chat_messages.inquiryId` | `order_chat_messages` |

**Business meaning:** Every order has its own chat thread. Messages accumulate over the life of the order between the customer and the sales team.

---

## 11. Users → Order Chat Messages
**Type:** 1 : M (one user, many messages sent)

| From | Foreign Key | To |
|------|------------|-----|
| `users.id` | `order_chat_messages.senderUserId` | `order_chat_messages` |

**Business meaning:** Tracks who sent each message. `senderUserId` is nullable — null means the message was sent by the system automatically.

---

## 12. Order Chat Messages → Order Chat Attachments
**Type:** 1 : M (one message, many attachments)

| From | Foreign Key | To |
|------|------------|-----|
| `order_chat_messages.id` | `order_chat_attachments.messageId` | `order_chat_attachments` |

**Business meaning:** A single chat message can include multiple file attachments (e.g. multiple payment proof screenshots).

---

## 13. Material Stocks → Stock Movements
**Type:** 1 : M (one material, many movement events)

| From | Foreign Key | To |
|------|------------|-----|
| `material_stocks.id` | `stock_movements.materialStockId` | `stock_movements` |
| `product_stocks.id` | `stock_movements.productStockId` | `stock_movements` |

**Business meaning:** Every time stock is added, removed, damaged, or transferred, a movement record is created. This provides a full audit trail of inventory changes.

---

## 14. Suppliers → Supplier Addresses
**Type:** 1 : M (one supplier, many addresses)

| From | Foreign Key | To |
|------|------------|-----|
| `suppliers.id` | `supplier_addresses.supplierId` | `supplier_addresses` |

**Business meaning:** A supplier may have multiple branch locations or warehouses. One is flagged as the main address (`isMain = true`).

---

## 15. Suppliers ↔ Material Stocks (Supplier Products)
**Type:** M : M via `supplier_products`

| From | Junction Table | To |
|------|---------------|-----|
| `suppliers.id` | `supplier_products.supplierId` | `supplier_products` |
| `material_stocks.id` | `supplier_products.materialStockId` | `supplier_products` |

**Business meaning:** One supplier can supply many materials. One material can be sourced from multiple suppliers. The `supplier_products` table stores the unit cost per supplier-material combination.

---

## 16. Suppliers → Purchase Orders
**Type:** 1 : M (one supplier, many purchase orders)

| From | Foreign Key | To |
|------|------------|-----|
| `suppliers.id` | `purchase_orders.supplierId` | `purchase_orders` |

**Business meaning:** Purchase orders are sent to a specific supplier to restock raw materials.

---

## 17. Purchase Orders → Purchase Order Items
**Type:** 1 : M (one PO, many line items)

| From | Foreign Key | To |
|------|------------|-----|
| `purchase_orders.id` | `purchase_order_items.purchaseOrderId` | `purchase_order_items` |
| `material_stocks.id` | `purchase_order_items.materialStockId` | `purchase_order_items` |

**Business meaning:** A single purchase order can include multiple materials. Each line item records the quantity ordered, quantity received, and unit cost.

---

## 18. Admin Account Archives → Admin Action Archives
**Type:** 1 : M (one archived account, many action records)

| From | Foreign Key | To |
|------|------------|-----|
| `admin_account_archives.id` | `admin_action_archives.archiveId` | `admin_action_archives` |

**Business meaning:** When an admin account is deleted, all their historical actions are preserved under their archive record for compliance purposes.

---

## 19. Customer Inquiries → Return Requests
**Type:** 1 : 1 (one inquiry, one return request)

| From | Foreign Key | To |
|------|------------|-----|
| `customer_inquiries.id` | `return_requests.inquiryId` | `return_requests` |

**Business meaning:** A completed order can have at most one return request submitted by the customer.

---

## Summary Table

| Relationship | Type | Tables Involved |
|-------------|------|----------------|
| Customer submits inquiries | 1 : M | users → customer_inquiries |
| Inquiry is for a product | M : 1 | customer_inquiries → products |
| Product has one stock record | 1 : 1 | products ↔ product_stocks |
| Warehouse holds stock | 1 : M | warehouses → product_stocks / material_stocks |
| Product requires materials (BOM) | M : M | products ↔ material_stocks via product_materials |
| Inquiry has quotation revisions | 1 : M | customer_inquiries → quotations |
| Inquiry has payment records | 1 : M | customer_inquiries → payment_records |
| Inquiry has chat thread | 1 : M | customer_inquiries → order_chat_messages |
| Message has attachments | 1 : M | order_chat_messages → order_chat_attachments |
| Stock has movement history | 1 : M | material_stocks / product_stocks → stock_movements |
| Supplier has addresses | 1 : M | suppliers → supplier_addresses |
| Supplier supplies materials | M : M | suppliers ↔ material_stocks via supplier_products |
| Supplier receives purchase orders | 1 : M | suppliers → purchase_orders |
| Purchase order has line items | 1 : M | purchase_orders → purchase_order_items |
| Completed order has return request | 1 : 1 | customer_inquiries → return_requests |
| Archived admin has action history | 1 : M | admin_account_archives → admin_action_archives |
| Admin users act on workflow stages | 1 : M | users → customer_inquiries (multiple FK columns) |
| Admin records / verifies payments | 1 : M | users → payment_records |
| Admin sends quotations | 1 : M | users → quotations |

---

*Generated from `packages/db/prisma/schema.prisma` — FurniTrack Sales & Inventory System*
