# FurniTrack Minimized Role Business System

## 1. Proposed system architecture

### Apps and layers
- `apps/admin`: internal portal for Admin / Management, Sales, Inventory, Accounting, and Operations / Design.
- `apps/storefront`: public and client-facing portal.
- `packages/db`: Prisma schema and shared database client.
- `packages/validators`: shared request and domain validation.
- Backend service layer:
  - auth/session middleware
  - RBAC policy layer
  - company-code scope enforcement layer
  - module services for quotations, orders, stock, accounting, design, delivery
  - audit and approval logging

### Core design principles
- Use only 6 roles:
  - `ADMIN_MANAGEMENT`
  - `SALES`
  - `INVENTORY`
  - `ACCOUNTING`
  - `OPERATIONS_DESIGN`
  - `CLIENT`
- Keep workflow status-driven instead of creating many micro-roles.
- Enforce company access at the backend using `companyId` plus `companyCodeSnapshot`.
- Store approval history and audit logs as first-class records.
- Allow future sub-roles through permission keys instead of new top-level roles.

## 2. Database schema / table design

### Recommended entity list
- `companies`
- `users`
- `leads`
- `quotations`
- `quotation_line_items`
- `sales_orders`
- `sales_order_line_items`
- `warehouses`
- `stock_items`
- `stock_movements`
- `stock_requests`
- `stock_request_line_items`
- `design_requests`
- `design_assets`
- `payment_records`
- `delivery_schedules`
- `approval_history`
- `audit_logs`

### Key relationships
- One `company` can have many `users`, `leads`, `quotations`, `sales_orders`, and `delivery_schedules`.
- One `lead` can create many `quotations`.
- One `quotation` can have many `quotation_line_items` and at most one `sales_order`.
- One `sales_order` can have many `sales_order_line_items`, `stock_requests`, `design_requests`, `payment_records`, and `delivery_schedules`.
- One `stock_request` can have many `stock_request_line_items`.
- One `design_request` can have many `design_assets`.
- One `warehouse` can have many `stock_items`.
- One `stock_item` can have many `stock_movements`.

### Required status enums
- Account:
  - `ACTIVE`, `BLOCKED`, `EXPIRED`, `PENDING_ACTIVATION`
- Company:
  - `ACTIVE`, `INACTIVE`, `BLOCKED`
- Quotation:
  - `DRAFT`, `FOR_INTERNAL_REVIEW`, `INTERNALLY_APPROVED`, `SENT_TO_CLIENT`, `CLIENT_APPROVED`, `CLIENT_REJECTED`, `EXPIRED`, `CONVERTED_TO_SALES_ORDER`, `CANCELLED`
- Sales order:
  - `DRAFT`, `PENDING_FULFILLMENT`, `PROCESSING`, `READY_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`
- Inventory request:
  - `NOT_REQUIRED`, `PENDING`, `APPROVED`, `PARTIALLY_APPROVED`, `OUT_OF_STOCK`, `REJECTED`
- Accounting:
  - `PENDING_REVIEW`, `WAITING_FOR_DOWN_PAYMENT`, `PARTIALLY_PAID`, `FULLY_PAID`, `FINANCIALLY_CLEARED`, `ON_HOLD`
- Payment:
  - `PENDING`, `VERIFIED`, `REJECTED`
- Design:
  - `NOT_REQUIRED`, `PENDING`, `IN_PROGRESS`, `REVISION_REQUESTED`, `SUBMITTED`, `APPROVED`, `CANCELLED`
- Delivery:
  - `BLOCKED`, `SCHEDULED`, `READY`, `IN_TRANSIT`, `DELIVERED`, `CANCELLED`
- Delivery readiness:
  - `BLOCKED_BY_APPROVALS`, `BLOCKED_BY_PAYMENT`, `BLOCKED_BY_STOCK`, `BLOCKED_BY_DESIGN`, `READY`

### Important schema notes
- `companies.code` is the main company code and must be unique.
- Every client user must point to a `companyId`.
- Every quotation, sales order, and delivery schedule stores both:
  - `companyId`
  - `companyCodeSnapshot`
- `companyCodeSnapshot` preserves the code used when the transaction was created or confirmed.
- `stock_items.reorderThreshold` defaults to `10`.
- `approval_history` is polymorphic through `module + recordId` to keep logging simple across modules.
- `audit_logs` stores critical action history and optional JSON metadata.

## 3. Role-permission matrix

| Module / Action | Admin / Management | Sales | Inventory | Accounting | Operations / Design | Client |
| --- | --- | --- | --- | --- | --- | --- |
| Manage users and roles | Full | No | No | No | No | No |
| Manage client accounts and company codes | Full | View only when needed | No | View only | Confirm on transaction | Own company only |
| Create/edit quotations | Read | Full | Read | Read | Read | View own only |
| Internal quotation approval | Read | Full | No | No | No | No |
| Client quotation approval | Monitor | No | No | No | No | Allowed if enabled |
| Convert quotation to sales order | Read | Full | No | No | No | No |
| View stock availability | Read | Yes | Full | Read | Read | No |
| Approve stock requests | Read | Submit only | Full | No | No | No |
| Record stock movements | Read | No | Full | No | No | No |
| Record and verify payments | Read | Submit to accounting | No | Full | Read readiness only | View own only |
| Manage design requests/files | Read | Submit/view | No | Read | Full | View own only |
| Schedule delivery | Read | View | No | Readiness visibility | Full | View own only |
| Reports and dashboards | Full | Own module | Own module | Own module | Own module | Own records only |
| Audit logs | Full | Limited | Limited | Limited | Limited | No |

### Suggested sub-permissions for later scaling
- Sales:
  - `sales.quote_encode`
  - `sales.quote_review`
  - `sales.quote_approve`
- Admin / Management:
  - `admin.user_manage`
  - `admin.company_manage`
  - `management.reporting_view`
- Operations / Design:
  - `operations.delivery_schedule`
  - `design.asset_upload`

## 4. Workflow / state transition design

### High-level workflow
1. Admin / Management creates staff and client accounts.
2. Admin / Management creates a company record and assigns a unique company code.
3. Sales captures inquiry as a lead.
4. Sales creates quotation and line items.
5. Sales performs internal review and approval.
6. Quotation is sent to client if client approval is part of the flow.
7. Sales converts approved quotation into a sales order.
8. Sales submits stock request.
9. Inventory approves, partially approves, or marks out of stock.
10. If customized, Sales submits design request.
11. Operations / Design uploads drawings, layouts, PDF or image files.
12. Accounting records down payment, partial payments, or full payment.
13. Payment rules determine whether the order is financially cleared.
14. Operations / Design confirms the company code on the transaction.
15. Delivery is scheduled only when readiness rules pass.
16. Client portal exposes only matching-company records.

### Sample state transitions

#### Quotation
- `DRAFT` -> `FOR_INTERNAL_REVIEW`
- `FOR_INTERNAL_REVIEW` -> `INTERNALLY_APPROVED`
- `FOR_INTERNAL_REVIEW` -> `DRAFT` when returned for edits
- `INTERNALLY_APPROVED` -> `SENT_TO_CLIENT`
- `SENT_TO_CLIENT` -> `CLIENT_APPROVED`
- `SENT_TO_CLIENT` -> `CLIENT_REJECTED`
- `CLIENT_APPROVED` -> `CONVERTED_TO_SALES_ORDER`

#### Sales order
- `DRAFT` -> `PENDING_FULFILLMENT`
- `PENDING_FULFILLMENT` -> `PROCESSING`
- `PROCESSING` -> `READY_FOR_DELIVERY`
- `READY_FOR_DELIVERY` -> `DELIVERED`
- Any active state -> `CANCELLED`

#### Inventory request
- `PENDING` -> `APPROVED`
- `PENDING` -> `PARTIALLY_APPROVED`
- `PENDING` -> `OUT_OF_STOCK`
- `PENDING` -> `REJECTED`

#### Design request
- `PENDING` -> `IN_PROGRESS`
- `IN_PROGRESS` -> `SUBMITTED`
- `SUBMITTED` -> `REVISION_REQUESTED`
- `SUBMITTED` -> `APPROVED`

#### Delivery readiness rules
- Customized order can become `READY` only if:
  - quotation internal approval is approved
  - quotation client approval is approved if required
  - sales order exists
  - required stock request is approved or partially approved based on policy
  - design is approved
  - down payment is verified
- Supply order can become `READY` only if:
  - quotation internal approval is approved
  - quotation client approval is approved if required
  - stock is available
  - down payment is verified

## 5. API / module breakdown

### Auth and access
- `POST /api/auth/sign-in`
- `POST /api/auth/sign-out`
- `GET /api/me`

### User and company management
- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id`
- `POST /api/users/:id/block`
- `POST /api/users/:id/unblock`
- `GET /api/companies`
- `POST /api/companies`
- `PATCH /api/companies/:id`
- `POST /api/companies/:id/assign-code`

### Quotations
- `GET /api/quotations`
- `POST /api/quotations`
- `GET /api/quotations/:id`
- `PATCH /api/quotations/:id`
- `POST /api/quotations/:id/submit`
- `POST /api/quotations/:id/internal-approve`
- `POST /api/quotations/:id/internal-reject`
- `POST /api/quotations/:id/client-approve`
- `POST /api/quotations/:id/client-reject`
- `POST /api/quotations/:id/convert-to-order`

### Sales orders
- `GET /api/sales-orders`
- `POST /api/sales-orders`
- `GET /api/sales-orders/:id`
- `PATCH /api/sales-orders/:id`
- `POST /api/sales-orders/:id/route-to-inventory`
- `POST /api/sales-orders/:id/route-to-accounting`
- `POST /api/sales-orders/:id/route-to-operations`

### Inventory
- `GET /api/stock-items`
- `POST /api/stock-items`
- `PATCH /api/stock-items/:id`
- `POST /api/stock-items/:id/movements`
- `GET /api/stock-requests`
- `POST /api/stock-requests`
- `POST /api/stock-requests/:id/approve`
- `POST /api/stock-requests/:id/out-of-stock`
- `POST /api/stock-requests/:id/reject`

### Accounting
- `GET /api/payments`
- `POST /api/payments`
- `PATCH /api/payments/:id`
- `POST /api/payments/:id/verify`
- `POST /api/payments/:id/reject`
- `GET /api/sales-orders/:id/payment-status`

### Design and operations
- `GET /api/design-requests`
- `POST /api/design-requests`
- `PATCH /api/design-requests/:id`
- `POST /api/design-requests/:id/assets`
- `POST /api/design-requests/:id/submit`
- `POST /api/design-requests/:id/approve`
- `GET /api/delivery-schedules`
- `POST /api/delivery-schedules`
- `PATCH /api/delivery-schedules/:id`
- `POST /api/delivery-schedules/:id/confirm-company-code`
- `POST /api/delivery-schedules/:id/mark-ready`

### Reports and audit
- `GET /api/dashboard/management`
- `GET /api/dashboard/sales`
- `GET /api/dashboard/inventory`
- `GET /api/dashboard/accounting`
- `GET /api/dashboard/operations`
- `GET /api/audit-logs`
- `GET /api/approval-history`

### Client portal
- `GET /api/client/quotations`
- `GET /api/client/sales-orders`
- `GET /api/client/payments`
- `GET /api/client/deliveries`
- `POST /api/client/quotations/:id/approve`
- `POST /api/client/sales-orders/:id/approve`

## 6. Security and authorization rules

### Role enforcement
- Every request must resolve:
  - authenticated user
  - role
  - account status
  - expiration window
- Block access when:
  - status is `BLOCKED`
  - status is `EXPIRED`
  - current time is past `accessExpiresAt`

### Company code enforcement
- Client queries must always include a backend condition equivalent to:
  - `WHERE transaction.companyId = session.user.companyId`
  - and `transaction.companyCodeSnapshot = session.user.company.code`
- Never rely on frontend filtering for client isolation.
- Operations / Design must confirm company code before scheduling or exposing delivery data.
- Admin / Management may override or correct company codes, but every change must create an audit log.

### Audit requirements
- Log these actions in `audit_logs`:
  - user creation, update, block, removal
  - client creation
  - company code assignment or change
  - quotation approval or rejection
  - stock request approval or rejection
  - payment update or verification
  - delivery schedule creation or change

### Validation rules
- Company code must be unique and non-empty.
- Client users must belong to exactly one company.
- Quotations must have at least one line item.
- Sales order conversion requires internally approved quotation.
- Customized order delivery requires approved design.
- Supply order does not require design.
- Down payment must be verified before release to delivery for both supply and customized orders.
- Full payment notice must always be shown in client portal before delivery proceeds.

## 7. Suggested UI pages per role

### Admin / Management
- Dashboard overview
- User management
- Client companies and company code assignment
- Audit logs
- Approval tracker
- Cross-module reports

### Sales
- Lead intake
- Quotation list and editor
- Quotation approval queue
- Sales order list
- Stock visibility panel
- Design status tracker

### Inventory
- Item master list
- Stock in / stock out
- Stock request queue
- Low-stock alerts
- Stock deduction printable form
- Movement history

### Accounting
- Billing basis from quotation
- Payment entry
- Verification queue
- Balance monitoring
- Transaction history

### Operations / Design
- Design request inbox
- Asset upload and revisions
- Delivery calendar
- Readiness checklist
- Company code confirmation page

### Client
- My quotations
- My sales orders / SOO
- Payment status
- Delivery schedule
- Approval actions
- Payment warning banner

## 8. Implementation notes and risks

### Practical notes
- Keep the 6 roles fixed for now and drive granularity through permission keys.
- Prefer service-level guards over scattered page-level checks.
- Use transaction-level snapshots for company codes so historical records remain consistent.
- Add reusable policy helpers:
  - `requireRole()`
  - `requirePermission()`
  - `requireActiveAccount()`
  - `scopeToCompany()`

### Risks in minimized setup
- Combining Admin and Management increases privilege concentration.
  - Mitigation: keep some actions permission-gated and fully audited.
- Combining Operations and Design can overload one queue.
  - Mitigation: use separate task tabs and future sub-permissions.
- Letting Sales perform internal approval may reduce segregation of duties.
  - Mitigation: record reviewer and approver separately in approval history.
- Company-code mistakes are high impact for client privacy.
  - Mitigation: enforce backend filters, confirmation steps, and audit logs.

## Neon database note

- The repo is now aligned around the new minimized role design in code and documentation.
- Actual Neon tables and live query state still need to be compared against this design before running migrations.
- Recommended next step in Neon:
  - inspect current auth metadata values
  - compare existing tables to the new Prisma reference schema
  - create a staged migration plan for enum changes and new tables
