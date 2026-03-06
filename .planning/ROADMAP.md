# Roadmap: FurniTrack

## Overview

FurniTrack's UI mockup milestone delivers a fully navigable dual-app system — a public furniture storefront and a role-gated ERP admin dashboard — built on a pnpm monorepo with all five internal roles demonstrable end-to-end using realistic static data. The six phases follow the non-negotiable bottom-up dependency graph: shared packages before app shells, shells before role-specific screens, and sales data shapes before accounting and inventory screens that depend on them. The milestone is complete when every screen in both apps is visually complete, all role workflows are demonstrable, and the codebase is structured to swap mock data for real API calls without touching any component code.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Monorepo Foundation** - Bootstrap pnpm monorepo, shared packages (config, validators, db/mock, ui), verify Tailwind v4 + shadcn compatibility
- [ ] **Phase 2: App Shells** - Scaffold both Next.js apps, admin role-switching shell, storefront layout and navigation structure
- [ ] **Phase 3: Management Dashboard and Storefront Catalog** - Management KPI dashboard with mobile view, storefront homepage and product catalog with filtering
- [ ] **Phase 4: Sales Workflow** - Complete Sales interface: lead intake, quotation builder with inventory inquiry, CRM tracker, order conversion
- [ ] **Phase 5: Inventory and Accounting** - Complete Inventory interface with multi-warehouse stock management, complete Accounting interface with approval portal and document generation
- [ ] **Phase 6: Reporting, Storefront Checkout, and Customer Account** - Recharts reporting views, storefront cart and quotation request, customer account pages

## Phase Details

### Phase 1: Monorepo Foundation
**Goal**: The shared infrastructure layer exists and is verified — all four packages build cleanly, the design system is established, all mock data fixtures are in place, and the critical Tailwind v4 + shadcn/ui compatibility question is resolved before any screen work begins.
**Depends on**: Nothing (first phase)
**Requirements**: FOUN-01, FOUN-02, FOUN-03, FOUN-04, FOUN-05, FOUN-06, FOUN-07, FOUN-08, FOUN-09
**Success Criteria** (what must be TRUE):
  1. Running `pnpm turbo typecheck build` from the repo root completes without errors across all workspaces
  2. A developer can import a Button from `@furnitrack/ui`, a Zod schema from `@furnitrack/validators`, and a mock product fixture from `@furnitrack/db/mock` in any app — and TypeScript resolves all types correctly
  3. A smoke-test component using shared Tailwind design tokens renders with correct brand colors and spacing in both apps (confirming CSS purging is not stripping shared package styles)
  4. The Tailwind v4 + shadcn/ui compatibility decision is documented in PROJECT.md (either confirmed working or pinned to v3.4.x with rationale)
  5. All mock fixture files cover every domain entity (products, orders, quotations, leads, stock, payments, users, KPIs, warehouses) with enough realistic records for every downstream screen
**Plans**: 4 plans

Plans:
- [ ] 01-01-PLAN.md — Bootstrap monorepo root and packages/config (workspace, turbo pipeline, TypeScript configs, brand tokens)
- [ ] 01-02-PLAN.md — Zod validators (8 entity schemas) and mock fixture data (all 8 entities, typed)
- [ ] 01-03-PLAN.md — packages/ui: shadcn/ui init + Button/Badge/Card/Input wrappers
- [ ] 01-04-PLAN.md — Prisma reference schema, both Next.js apps scaffolded, smoke-test pages, full build verification

### Phase 2: App Shells
**Goal**: Both apps have navigable structural shells — the admin app has a working role switcher and sidebar that updates for all five roles, and the storefront has its layout, navigation, and routing structure in place — so all subsequent screen work has a home to land in.
**Depends on**: Phase 1
**Requirements**: SHEL-01, SHEL-02, SHEL-03, SHEL-04, SHEL-05, SHEL-06, RESP-02
**Success Criteria** (what must be TRUE):
  1. Clicking through all five roles in the admin header role switcher updates the sidebar navigation items immediately with no page reload, and no hardcoded role constants appear anywhere in the codebase
  2. Navigating to a route inaccessible by the current active role shows the unauthorized page with back navigation
  3. The admin notification bell opens a dropdown showing mock alerts with an unread count badge
  4. Both apps render their layout shells (admin sidebar + topbar, storefront nav + footer) at 1280px+ desktop viewport, and the admin sidebar collapses gracefully at smaller viewports
**Plans**: TBD

### Phase 3: Management Dashboard and Storefront Catalog
**Goal**: The management role has a fully demonstrable read-only dashboard including a distinct mobile-optimized view, and the storefront delivers the complete product discovery experience from homepage through product detail — validating the full data pipeline (mock fixture → server component → shared UI component → rendered page) end-to-end in both apps.
**Depends on**: Phase 2
**Requirements**: MGMT-01, MGMT-02, MGMT-03, MGMT-04, STOR-01, STOR-02, STOR-03, STOR-08, RESP-01, RESP-03
**Success Criteria** (what must be TRUE):
  1. Switching to the Management role shows a dashboard with KPI stat cards, inventory health widget, and operational snapshot — all displaying mock numbers with trend indicators and low-stock links
  2. Resizing the management dashboard to a mobile breakpoint renders a distinct condensed layout (sales summary card, high-value alert list, profit snapshot) — not a shrunk desktop view
  3. A storefront visitor can browse the homepage, navigate to the product catalog, filter by category/material/price, and open a product detail page showing the image gallery, dimensions, finish options, and a stock availability badge — all using client-side filtering on mock data
  4. All data-displaying components on these screens have visible loading skeleton, empty state, and error state variants (not just the success state)
**Plans**: TBD

### Phase 4: Sales Workflow
**Goal**: The Sales role can run its entire workflow end-to-end — capturing a lead, building a quotation with live mock stock inquiry, tracking follow-ups through the CRM board, and converting a confirmed quotation to an order — establishing the order and quotation data shapes that Accounting and Inventory screens depend on.
**Depends on**: Phase 3
**Requirements**: SALE-01, SALE-02, SALE-03, SALE-04, SALE-05, SALE-06, SALE-07, SALE-08, SALE-09, SALE-10, SALE-11
**Success Criteria** (what must be TRUE):
  1. A sales user can submit the lead intake form with validation, see the new lead appear in the filterable lead list, and move it through all CRM stages (New → Quoted → Negotiating → Confirmed → Closed) via the follow-up tracker board
  2. The quotation builder allows adding, editing, and removing line items, shows a "Stock not reserved at quote stage" notice, and the inline inventory inquiry panel displays mock stock availability (Available / Low / Out) for each selected product
  3. A quotation detail screen shows a read-only summary with VAT breakdown, status history, and a link to any derived order; an order detail screen links back to its originating quotation
  4. The order conversion screen pre-fills from the quotation with P.O. number, SO number, delivery date, and rush order flag; the sales hand-off checklist enforces required field completion before the hand-off state is reachable
**Plans**: TBD

### Phase 5: Inventory and Accounting
**Goal**: The Inventory role can manage multi-warehouse stock with full visibility into movements, transfers, and QA state, and the Accounting role can track payments, run approvals, and generate document previews — both sections consuming the order/quotation data shapes established in Phase 4.
**Depends on**: Phase 4
**Requirements**: INVT-01, INVT-02, INVT-03, INVT-04, INVT-05, INVT-06, INVT-07, INVT-08, INVT-09, INVT-10, INVT-11, ACCT-01, ACCT-02, ACCT-03, ACCT-04
**Success Criteria** (what must be TRUE):
  1. The inventory stock dashboard shows all items across warehouses with color-coded stock state badges (Available / Reserved / In Production / Delivered); the multi-warehouse toggle filters by branch using client-side state with no route change; each product row expands to show per-warehouse stock breakdown
  2. An inventory user can submit a transfer request, see it in the transfer status list, view the stock movement log with all movement types (IN/OUT/TRANSFER/ADJUSTMENT/DAMAGED), and the stock adjustment form is visible only to the Inventory Head role
  3. The QA log shows damaged items with repair status and resale flag; the barcode scan placeholder button opens a mock scan panel with hardcoded item data and a note about production hardware integration
  4. The accounting approval portal shows a pending approvals queue with approve/reject actions and status history; the document generation UI opens a styled HTML preview modal for Invoice/DR/OR with a VAT-exempt toggle (no actual PDF is generated)
  5. The payment tracker shows payment log entries per order (Down Payment / Partial / Full) with status badges and a proof upload placeholder; the VAT/discount calculation display shows subtotal, VAT inclusive/exclusive toggle, and profit margin on order detail
**Plans**: TBD

### Phase 6: Reporting, Storefront Checkout, and Customer Account
**Goal**: The Reporting interface delivers all four data visualization screens using Recharts, and the storefront completes the full customer journey from cart through quotation request submission and into the account pages — making the entire system demonstrable end-to-end for all stakeholders.
**Depends on**: Phase 5
**Requirements**: REPT-01, REPT-02, REPT-03, REPT-04, STOR-04, STOR-05, STOR-06, STOR-07
**Success Criteria** (what must be TRUE):
  1. All four reporting views render Recharts charts with mock data — cash flow statement with date-range filter and inflow/outflow breakdown, project costing breakdown with budget comparison, forecasting multi-tab line charts, and performance reports with three sub-views (inventory, production, supplier)
  2. A storefront customer can add products to the cart, see line items with quantity controls and subtotal (Zustand-persisted), navigate to the quotation request form, fill out the multi-field form with validation, and see a success confirmation state on submission
  3. Customer account pages display mock order history with status badges and submitted quotes with review status (Pending / In Review / Confirmed)
  4. All Recharts chart components are correctly wrapped in client components (no SSR errors); chart mock datasets are all under 50KB
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Monorepo Foundation | 0/4 | In progress | - |
| 2. App Shells | 0/TBD | Not started | - |
| 3. Management Dashboard and Storefront Catalog | 0/TBD | Not started | - |
| 4. Sales Workflow | 0/TBD | Not started | - |
| 5. Inventory and Accounting | 0/TBD | Not started | - |
| 6. Reporting, Storefront Checkout, and Customer Account | 0/TBD | Not started | - |
