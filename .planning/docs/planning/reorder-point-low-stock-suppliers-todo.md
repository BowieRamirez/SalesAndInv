# Reorder Point, Low Stock Items, and Supplier Ordering TODO

## Goal

Create an inventory reorder feature that helps the Inventory admin identify low-stock raw materials, track reorder points, and save the external business or supplier that the company will order from.

## Main Outcomes

- Show raw materials that are already at or below their reorder point.
- Let admins configure reorder points per raw material.
- Let admins save supplier/business information for each material.
- Let admins create and track reorder requests or purchase intentions.
- Keep stock quantities unchanged until actual restock is received.

## Data Model TODO

### Supplier / Business Table

Create a table for external suppliers or businesses.

Suggested fields:

- `id`
- `businessName`
- `contactPerson`
- `email`
- `phone`
- `address`
- `notes`
- `createdAt`
- `updatedAt`

### Material Supplier Mapping

Create a table to connect raw materials to suppliers.

Suggested fields:

- `id`
- `stockItemId`
- `supplierId`
- `preferredSupplier`
- `estimatedUnitCost`
- `leadTimeDays`
- `minimumOrderQty`
- `createdAt`
- `updatedAt`

### Reorder Request Table

Create a table for reorder records.

Suggested fields:

- `id`
- `stockItemId`
- `supplierId`
- `requestedQty`
- `status`
- `requestedById`
- `approvedById`
- `referenceNumber`
- `expectedDeliveryDate`
- `notes`
- `createdAt`
- `updatedAt`

Suggested statuses:

- `DRAFT`
- `PENDING_APPROVAL`
- `APPROVED`
- `ORDERED`
- `RECEIVED`
- `CANCELLED`

## Inventory Rules

### Low Stock Condition

A raw material is low stock when:

```text
availableQty <= reorderThreshold
```

Optional stricter condition:

```text
availableQty + reservedQty <= reorderThreshold
```

Use the first condition if reorder is based only on usable stock. Use the second condition if reserved stock should still be counted as unavailable for future production.

### Reorder Quantity Suggestion

Suggested reorder quantity can be calculated as:

```text
recommendedQty = reorderThreshold - availableQty
```

Better future formula:

```text
recommendedQty = targetStockLevel - availableQty
```

This requires adding a `targetStockLevel` field to raw materials.

### Important Stock Rule

Creating a reorder request must not increase or decrease stock.

Stock should only increase when the ordered materials are actually received through the existing restock flow or a new receive-order flow.

## UI TODO

### Inventory Low Stock Section

Add or improve a Low Stock Items section in the Inventory admin.

Display:

- SKU
- Item name
- Warehouse
- Unit
- Available quantity
- Reserved quantity
- Reorder threshold
- Preferred supplier
- Recommended reorder quantity
- Reorder action button

### Supplier Management UI

Add a supplier/business management page or tab.

Features:

- Add supplier
- Edit supplier
- Search suppliers
- View linked raw materials
- Mark preferred supplier for a material

### Reorder Modal

When clicking reorder for a low-stock item, show a modal with:

- Raw material details
- Current available quantity
- Reorder threshold
- Recommended quantity
- Supplier dropdown
- Requested quantity input
- Expected delivery date
- Notes
- Submit button

### Reorder Requests Table

Add a table for reorder requests.

Display:

- Date requested
- Material
- Supplier
- Requested quantity
- Status
- Requested by
- Expected delivery
- Actions

## API TODO

### Supplier APIs

Create routes for:

- Create supplier
- Update supplier
- List suppliers
- Link supplier to material
- Set preferred supplier

Possible paths:

```text
/api/admin/inventory/suppliers/create
/api/admin/inventory/suppliers/update
/api/admin/inventory/suppliers/material-link
```

### Reorder APIs

Create routes for:

- Create reorder request
- Approve reorder request
- Mark reorder as ordered
- Mark reorder as received
- Cancel reorder request

Possible paths:

```text
/api/admin/inventory/reorders/create
/api/admin/inventory/reorders/approve
/api/admin/inventory/reorders/receive
/api/admin/inventory/reorders/cancel
```

## Audit Logging TODO

Add audit logs for:

- Supplier created
- Supplier updated
- Supplier linked to material
- Reorder request created
- Reorder request approved
- Reorder request marked ordered
- Reorder request received
- Reorder request cancelled

Suggested audit labels:

- `SUPPLIER_CREATED`
- `SUPPLIER_UPDATED`
- `MATERIAL_SUPPLIER_LINKED`
- `REORDER_REQUEST_CREATED`
- `REORDER_REQUEST_APPROVED`
- `REORDER_REQUEST_ORDERED`
- `REORDER_REQUEST_RECEIVED`
- `REORDER_REQUEST_CANCELLED`

## Receive Order Behavior

When a reorder request is marked as received:

- Increase `stock_items.availableQty` by received quantity.
- Insert stock movement with type `IN`.
- Add audit log.
- Update reorder status to `RECEIVED`.

Do not receive more than the requested quantity unless the system supports partial/over-delivery.

## Access Control TODO

Suggested permissions:

- Inventory admin can create suppliers and reorder requests.
- Admin management can approve or cancel reorder requests.
- Inventory admin can mark approved orders as received.

## Validation Checklist

- Low stock list only shows items where `availableQty <= reorderThreshold`.
- Reorder request creation does not change stock.
- Supplier records can be saved and linked to materials.
- Preferred supplier appears beside low-stock items.
- Receiving a reorder increases stock exactly once.
- Duplicate receive action is blocked.
- Audit logs are created for every supplier and reorder action.
- Typecheck passes.

## Suggested Implementation Order

1. Add Prisma models and migration for suppliers, material suppliers, and reorder requests.
2. Add supplier create/update APIs.
3. Add supplier management UI.
4. Add preferred supplier selection for raw materials.
5. Add low-stock reorder button and reorder request modal.
6. Add reorder requests table.
7. Add receive-order flow that increases stock.
8. Add audit logs and validation.
9. Run typecheck and test full flow.
