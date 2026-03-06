# Requirements: FurniTrack

**Defined:** 2026-03-06
**Core Value:** A fully demonstrable UI mockup where all five internal roles (Management, Sales, Accounting, Inventory, Admin) and the public storefront can be shown to stakeholders end-to-end with realistic static data — replacing fragmented Google Drive/Excel workflows with a cohesive, navigable system.

---

## v1 Requirements

Requirements for the UI mockup milestone. All screens navigable with static/mock data — no real backend, no real auth, no database.

### Foundation

- [x] **FOUN-01**: Monorepo is bootstrapped with pnpm workspaces, Turborepo, and all four shared packages (`packages/config`, `packages/validators`, `packages/ui`, `packages/db`)
- [x] **FOUN-02**: `packages/config` exports shared TypeScript base config, ESLint flat config, and Tailwind base CSS; all apps extend from it
- [x] **FOUN-03**: `packages/validators` exports Zod schemas for all domain entities (Product, Order, Quotation, Lead, StockItem, Payment, User, KPI)
- [x] **FOUN-04**: `packages/db/src/mock/` contains all typed fixture files (products, orders, stock, leads, payments, users, KPIs, warehouses); both apps import from `@furnitrack/db/mock`
- [ ] **FOUN-05**: `packages/ui` exports shared component library: Button, Input, Select, Card, Badge, DataTable, StatCard, ChartWrapper, Modal, Tabs, Sidebar, Notification, and form primitives — all built on shadcn/ui and shared Tailwind design tokens
- [ ] **FOUN-06**: Design tokens (brand colors, semantic colors, font sizes, spacing) are defined as CSS variables in shared Tailwind config and consumed by both apps
- [ ] **FOUN-07**: Turborepo pipeline runs `typecheck` and `build` successfully across all workspaces
- [ ] **FOUN-08**: Tailwind v4 + shadcn/ui compatibility is verified; fallback decision to Tailwind v3.4.x is made and documented if incompatible
- [ ] **FOUN-09**: `packages/db/prisma/schema.prisma` defines the full DB schema as a reference document (not connected; no migrations run); mock fixture shapes align with Prisma-generated types

### Admin Shell

- [ ] **SHEL-01**: Admin login page renders email/password form (UI only — no real authentication; no session created)
- [ ] **SHEL-02**: Admin has a role-based navigation shell with a sidebar driven by the current active role (`MANAGEMENT`, `SALES`, `ACCOUNTING`, `INVENTORY`, `ADMIN`)
- [ ] **SHEL-03**: A persistent role switcher in the admin header allows switching between all five roles; switching updates the sidebar and accessible routes immediately
- [ ] **SHEL-04**: `MockAuthProvider` React context with `useRole()` hook is the single source of active role state across all admin components; no hardcoded role constants anywhere
- [ ] **SHEL-05**: Unauthorized page renders "You don't have access" with back navigation; links that are inaccessible to the current role redirect here
- [ ] **SHEL-06**: Notification bell in admin header renders a dropdown with mock alerts and unread count badge

### Storefront — Core

- [ ] **STOR-01**: Storefront homepage renders hero banner, featured products grid, and CTA cards with static content
- [ ] **STOR-02**: Product catalog page (`/products`) renders a filterable/sortable product grid with filter sidebar (category, material, price range); filtering operates on mock data client-side
- [ ] **STOR-03**: Product detail page (`/products/[slug]`) renders image gallery, dimension table, finish options picker, and stock availability badge (In Stock / Low Stock / Out of Stock) from mock data
- [ ] **STOR-04**: Cart page (`/cart`) renders line items with quantity controls and subtotal; cart state persists in Zustand store
- [ ] **STOR-05**: Quotation request form (`/request-quote`) renders multi-field form (client name, company, email, business type, budget, target date) with cart summary; form is validated with react-hook-form + Zod; submission shows success state (no API call)
- [ ] **STOR-06**: Customer account — orders page (`/account/orders`) renders order list with status badges using mock data
- [ ] **STOR-07**: Customer account — submitted quotes page (`/account/quotes`) renders quote list with status (Pending / In Review / Confirmed) using mock data
- [ ] **STOR-08**: Storefront navigation and footer render on all storefront pages; layout is responsive (desktop primary)

### Management Dashboard

- [ ] **MGMT-01**: Management dashboard renders 4–6 KPI stat cards (daily/monthly sales, revenue, profit margin, active orders) with trend indicators; all mock numbers
- [ ] **MGMT-02**: Inventory health widget renders stock turnover summary and low-stock alert count linking to inventory detail
- [ ] **MGMT-03**: Operational snapshot renders pending orders, outstanding receivables, and supplier lead time summaries in a 3-column layout
- [ ] **MGMT-04**: Management dashboard has a distinct mobile-optimized condensed layout (separate responsive breakpoint, not just a shrunk desktop view) showing: sales summary card, high-value alert list, and profit snapshot — as explicitly required in PRD

### Sales Interface

- [ ] **SALE-01**: Lead list view renders a filterable/sortable table of all leads with status column
- [ ] **SALE-02**: Lead intake form renders fields for name, company, email, business type, budget, and target date with form validation; submission adds lead to mock list
- [ ] **SALE-03**: Quotation builder renders a line-item table with product selector, quantity, dimensions, finishes, unit price, and computed total; rows can be added and removed
- [ ] **SALE-04**: Inventory inquiry panel within the quotation builder shows real-time mock stock availability per selected product (Available / Low / Out); stock state can be toggled in demo
- [ ] **SALE-05**: "Stock not reserved at quote stage" notice is visible in the quotation builder; "Reserved" badge only appears after order confirmation
- [ ] **SALE-06**: Quotation list view renders a table with quote number, client, date, status, and value
- [ ] **SALE-07**: Quotation detail/view screen renders a read-only summary of line items, totals, VAT breakdown, and status history
- [ ] **SALE-08**: Follow-up tracker / CRM board renders leads by stage (New → Quoted → Negotiating → Confirmed → Closed) with status transitions via dropdown or drag
- [ ] **SALE-09**: Sales hand-off checklist renders as a form section with required fields (P.O., payment confirmation, SOO, delivery date); visually enforces completeness before hand-off state
- [ ] **SALE-10**: Order conversion screen renders pre-filled from quotation with P.O. number, SO number, delivery date, and rush order flag fields
- [ ] **SALE-11**: Quotation-to-order lineage displays "Derived from Quotation #[ID]" link on order detail and vice versa

### Accounting Interface

- [ ] **ACCT-01**: VAT/discount calculation display renders computed breakdown (subtotal, VAT inclusive/exclusive toggle, discounts, profit margin) on order detail; all driven by mock data
- [ ] **ACCT-02**: Payment tracker renders payment log per order (Down Payment / Partial / Full) with status badges and proof upload placeholder
- [ ] **ACCT-03**: Approval portal renders a pending approvals queue (price overrides, discounts, cancellations) with approve/reject action buttons and status history
- [ ] **ACCT-04**: Document generation UI renders "Generate Invoice", "Generate DR", and "Generate OR" buttons; clicking opens a styled HTML preview modal with VAT-exempt toggle; actual PDF output is not generated

### Inventory Interface

- [ ] **INVT-01**: Stock dashboard renders a table of all items across warehouses (product, SKU, warehouse, qty available, qty reserved, qty in production, min threshold)
- [ ] **INVT-02**: Multi-warehouse filter toggle allows switching the stock dashboard view by branch/warehouse using client-side state (no route change)
- [ ] **INVT-03**: Stock movement log renders an append-only table of all movements (type: IN/OUT/TRANSFER/ADJUSTMENT/DAMAGED, quantity, actor, timestamp, reference)
- [ ] **INVT-04**: Inter-branch transfer request form renders fields (from warehouse, to warehouse, item, quantity, reason) with status (Pending / Approved / In Transit / Completed)
- [ ] **INVT-05**: Transfer status list renders all transfer requests with status badges
- [ ] **INVT-06**: Minimum threshold configuration renders as an inline editable field on the stock dashboard
- [ ] **INVT-07**: QA log renders damaged items table (condition, repair status, resale flag) with damaged goods repair-to-resale workflow
- [ ] **INVT-08**: Barcode/QR scan placeholder renders a "Scan Item" button opening a mock scan result panel with hardcoded item; placeholder copy notes hardware integration in production
- [ ] **INVT-09**: Stock adjustment form (Inventory Head role only) renders quantity delta, reason, and approval flag fields; button is role-gated (hidden/disabled for non-Inventory-Head roles)
- [ ] **INVT-10**: Stock state machine visualization shows color-coded states (Available / Reserved / In Production / Delivered) in stock dashboard status column
- [ ] **INVT-11**: Multi-warehouse per-product stock breakdown renders as an expandable row or modal on the stock dashboard

### Reporting Interface

- [ ] **REPT-01**: Cash flow statement view renders date-range filter, inflows/outflows breakdown table, and net summary using Recharts and mock data
- [ ] **REPT-02**: Project costing breakdown renders project selector, cost category breakdown, and total vs. budget comparison using Recharts bar charts
- [ ] **REPT-03**: Forecasting charts view renders multi-tab Recharts line charts for sales, inventory, and material consumption trends using mock projected data
- [ ] **REPT-04**: Performance reports view renders three sub-views (inventory, production, supplier) with summary stats, data tables, and Recharts charts using mock data

### Responsive Design

- [ ] **RESP-01**: All storefront pages render without breaking at tablet viewport (desktop-primary, tablet-friendly)
- [ ] **RESP-02**: All admin pages render without breaking at desktop (1280px+); sidebar collapses gracefully on smaller viewports
- [ ] **RESP-03**: Management mobile view renders a distinct condensed layout at mobile breakpoints (PRD explicit requirement)

---

## v2 Requirements

Deferred to backend milestone. Not in current roadmap.

### Authentication (Backend Milestone)

- **AUTH-01**: User can log in with real email/password credentials (Auth.js v5 Credentials provider)
- **AUTH-02**: Authenticated session persists across browser refresh with real JWT/session token
- **AUTH-03**: Role-based access is enforced server-side via Auth.js RBAC middleware (not just client-side RoleProvider)
- **AUTH-04**: Customer-facing storefront account registration and login (separate from admin auth)
- **AUTH-05**: User management CRUD — admin can create, edit, and deactivate staff accounts

### Live Data (Backend Milestone)

- **DATA-01**: Stock availability in storefront reflects live database queries (not static mock flags)
- **DATA-02**: Cart and quotation requests persist to database (not Zustand in-memory state)
- **DATA-03**: All admin CRUD operations write to PostgreSQL via Prisma
- **DATA-04**: Pagination backed by real DB count + offset queries (not decorative component)
- **DATA-05**: Advanced full-text search powered by DB full-text index or search service

### Documents (Backend Milestone)

- **DOCS-01**: Invoice, Delivery Receipt, and Official Receipt generate actual PDF files (React PDF or Puppeteer)
- **DOCS-02**: File upload for payment proofs and product images (S3 or local storage)

### Notifications (Backend Milestone)

- **NOTF-01**: In-app notification bell reflects real events (low stock, approvals, transfers) from database triggers
- **NOTF-02**: Email/SMS alerts sent via transactional email service (Resend/SendGrid)

### Hardware (v2+)

- **HARD-01**: Barcode/QR scanner integration for inventory scanning using BarcodeDetector API
- **HARD-02**: Mobile PWA for inventory scanning with camera access

---

## Out of Scope

Explicitly excluded from the UI mockup milestone. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Real database / Prisma migrations | No backend in MVP milestone; Prisma schema is reference-only |
| Auth.js real sessions | UI shell only; role switching simulated via RoleProvider context |
| Actual PDF generation | Requires PDF rendering library and storage; out of scope for UI mockup |
| File upload (payment proofs, product images) | Requires storage backend (S3/local); placeholder UI only |
| Email/SMS notification sending | Transactional email is a backend concern; in-app bell with mock alerts only |
| Real-time stock availability | WebSockets/polling meaningless against static data; mock stock flags only |
| Barcode/QR hardware scanner integration | Hardware API beyond placeholder button; deferred to backend + hardware milestone |
| Prisma migrations / DB setup | DB is explicitly out of scope for MVP; schema pre-defined as reference only |
| Advanced full-text search | Requires DB or search index; client-side filter on mock data only |
| User management CRUD | Not a core PRD workflow; placeholder list view, no create/edit |
| Customer storefront account registration | Auth backend required; account section shows logged-in state with mock data |
| Real-time chat or messaging | Not in PRD scope at all |
| Supplier portal | Not in PRD scope for MVP |
| Mobile native app | Web-first; PWA deferred to post-backend milestone |
| Payment processing integration | Not in PRD scope; payment tracker is record-keeping only |

---

## Traceability

Which phases cover which requirements. Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUN-01 | Phase 1 | Complete |
| FOUN-02 | Phase 1 | Complete |
| FOUN-03 | Phase 1 | Complete |
| FOUN-04 | Phase 1 | Complete |
| FOUN-05 | Phase 1 | Pending |
| FOUN-06 | Phase 1 | Pending |
| FOUN-07 | Phase 1 | Pending |
| FOUN-08 | Phase 1 | Pending |
| FOUN-09 | Phase 1 | Pending |
| SHEL-01 | Phase 2 | Pending |
| SHEL-02 | Phase 2 | Pending |
| SHEL-03 | Phase 2 | Pending |
| SHEL-04 | Phase 2 | Pending |
| SHEL-05 | Phase 2 | Pending |
| SHEL-06 | Phase 2 | Pending |
| STOR-01 | Phase 3 | Pending |
| STOR-02 | Phase 3 | Pending |
| STOR-03 | Phase 3 | Pending |
| STOR-04 | Phase 6 | Pending |
| STOR-05 | Phase 6 | Pending |
| STOR-06 | Phase 6 | Pending |
| STOR-07 | Phase 6 | Pending |
| STOR-08 | Phase 3 | Pending |
| MGMT-01 | Phase 3 | Pending |
| MGMT-02 | Phase 3 | Pending |
| MGMT-03 | Phase 3 | Pending |
| MGMT-04 | Phase 3 | Pending |
| SALE-01 | Phase 4 | Pending |
| SALE-02 | Phase 4 | Pending |
| SALE-03 | Phase 4 | Pending |
| SALE-04 | Phase 4 | Pending |
| SALE-05 | Phase 4 | Pending |
| SALE-06 | Phase 4 | Pending |
| SALE-07 | Phase 4 | Pending |
| SALE-08 | Phase 4 | Pending |
| SALE-09 | Phase 4 | Pending |
| SALE-10 | Phase 4 | Pending |
| SALE-11 | Phase 4 | Pending |
| ACCT-01 | Phase 5 | Pending |
| ACCT-02 | Phase 5 | Pending |
| ACCT-03 | Phase 5 | Pending |
| ACCT-04 | Phase 5 | Pending |
| INVT-01 | Phase 5 | Pending |
| INVT-02 | Phase 5 | Pending |
| INVT-03 | Phase 5 | Pending |
| INVT-04 | Phase 5 | Pending |
| INVT-05 | Phase 5 | Pending |
| INVT-06 | Phase 5 | Pending |
| INVT-07 | Phase 5 | Pending |
| INVT-08 | Phase 5 | Pending |
| INVT-09 | Phase 5 | Pending |
| INVT-10 | Phase 5 | Pending |
| INVT-11 | Phase 5 | Pending |
| REPT-01 | Phase 6 | Pending |
| REPT-02 | Phase 6 | Pending |
| REPT-03 | Phase 6 | Pending |
| REPT-04 | Phase 6 | Pending |
| RESP-01 | Phase 3 | Pending |
| RESP-02 | Phase 2 | Pending |
| RESP-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 60 total
- Mapped to phases: 60
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-06*
*Last updated: 2026-03-06 after initial definition*
