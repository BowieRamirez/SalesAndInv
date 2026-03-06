# Feature Research

**Domain:** Furniture ERP + E-Commerce — UI Mockup
**Researched:** 2026-03-06
**Confidence:** HIGH (sourced directly from PRD.md and planning doc; no external verification needed for UI scope)

---

## Scope Clarification

This research covers the **UI mockup milestone only** — Next.js screens, flows, and components with static/mock data. No backend, no real auth, no API calls. Every feature is evaluated on whether it should be:

- **Built as a navigable screen with realistic mock data** (table stakes / differentiators)
- **Stubbed as a placeholder button/state only** (acknowledged but deferred)
- **Not built at all in this milestone** (anti-feature for UI phase)

---

## Feature Landscape

### Table Stakes — Storefront

Features that must exist for the public storefront to feel like a real furniture e-commerce site.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Homepage with featured products and promotions | Every e-commerce site has a landing page; establishes brand | LOW | Hero banner, featured collections grid, CTA cards — all static |
| Product catalog (`/products`) with category/material/price filters | Customers cannot shop without browsable catalog | MEDIUM | Filter sidebar + product grid; mock product data; no real query |
| Product detail page (`/products/[slug]`) | Customers expect full specs, images, finish options before deciding | MEDIUM | Image gallery, dimension table, finish picker, stock badge; all static |
| Stock availability badge on product detail | Customers need to know if in stock before inquiring | LOW | "In Stock / Low Stock / Out of Stock" badge driven by mock data |
| Cart (`/cart`) | Users assume they can collect items before requesting a quote | MEDIUM | Item list, quantity controls, subtotal; Zustand client state |
| Quotation request form (`/checkout` or `/request-quote`) | Furniture B2B is quote-based, not instant checkout; this is the conversion point | HIGH | Multi-field form: client name, company, email, business type, budget, target date, cart summary |
| Customer account — order history (`/account/orders`) | Repeat B2B customers need visibility into past orders | MEDIUM | Order list with status badges; mock data |
| Customer account — submitted quotes (`/account/quotes`) | Customers need to track quote status after submission | MEDIUM | Quote list with status (Pending / In Review / Confirmed); mock data |

### Table Stakes — Admin: Shared Shell

Features that must exist for the admin system to function as a cohesive navigable app.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Admin login page | Entry point for all internal users | LOW | Email + password form; UI only, no real auth; role selector for demo navigation |
| Role-based navigation shell | Without role-gated nav, the system has no structure | MEDIUM | Sidebar with role-aware menu items; active role shown; links to all role sections |
| Unauthorized page | RBAC must visually enforce access boundaries in the mockup | LOW | Simple "You don't have access" screen with back navigation |
| Notification bell / alert feed | Every role receives alerts (low stock, approvals, movements) | MEDIUM | Dropdown with mock notifications; unread count badge |

### Table Stakes — Admin: Management Dashboard

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| KPI cards (daily/monthly sales, revenue, profit margin) | Management primary view; defines the dashboard's value | LOW | 4–6 stat cards with trend indicators; all mock numbers |
| Inventory health widget (stock turnover, low-stock alerts count) | Named explicitly in PRD as a management requirement | LOW | Summary card or mini-table linking to inventory detail |
| Operational snapshot (pending orders, outstanding receivables, supplier lead times) | Provides management the operational heartbeat | MEDIUM | 3-column summary with counts and status tags |
| Mobile-optimized condensed view | PRD explicitly calls out a mobile view for management | HIGH | Separate responsive layout: sales summary card, high-value alert list, profit snapshot — must be a real responsive breakpoint, not just "it shrinks" |

### Table Stakes — Admin: Sales Interface

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Lead list view | Sales team's home screen; all leads in one place | LOW | Filterable/sortable table of leads with status column |
| Lead intake form (new lead creation) | The starting point of every sale | MEDIUM | Name, company, email, business type, budget, target date; form validation states |
| Quotation builder | Core sales tool; builds the actual quote per lead | HIGH | Line item table with product selector, qty, dimensions, finishes, unit price, computed total; add/remove rows |
| Inventory inquiry panel within quotation builder | Sales cannot quote without knowing availability | MEDIUM | Sidebar or modal showing real-time stock per product; mock data toggle between available/low/out |
| Quotation list view | Sales needs to see all open quotes | LOW | Table with quote number, client, date, status, value |
| Quotation detail / view screen | Sales reviews a specific quote before converting | MEDIUM | Read-only summary of line items, totals, VAT, status history |
| Follow-up tracker / CRM board | PRD explicitly requires CRM-style status management | HIGH | Kanban or list view of leads by stage (New → Quoted → Negotiating → Confirmed → Closed); status drag or dropdown |
| Sales hand-off checklist (P.O., payment confirmation, SOO, delivery date) | PRD calls this out as enforced — system must not allow hand-off without these fields | MEDIUM | Form section or checklist UI that goes from "incomplete" to "complete" state; visual enforcement |
| Order conversion screen | Converts a confirmed quotation into an order | MEDIUM | Pre-filled from quotation; adds P.O. number, SO number, delivery date, rush flag |

### Table Stakes — Admin: Accounting Interface

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| VAT/discount calculation display on order | Financial accuracy is core; accountants need to see computation | MEDIUM | Computed breakdown: subtotal, VAT (inclusive/exclusive toggle), discounts, profit margin; all driven by mock data |
| Payment tracker | Log payments (Down Payment / Partial / Full) per order | MEDIUM | Payment list per order; status badges; proof upload placeholder |
| Approval portal (price overrides, discounts, cancellations) | PRD explicitly requires management sign-off for these actions | HIGH | Pending approvals queue; approve/reject action buttons; status history |
| Document generation UI (Invoice, Delivery Receipt, Official Receipt) | Core accounting output; physical documents are a legal requirement | MEDIUM | "Generate Invoice" / "Generate DR" / "Generate OR" buttons with preview placeholder and VAT-exempt toggle; actual PDF is out of scope |

### Table Stakes — Admin: Inventory Interface

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Stock dashboard — all items across warehouses | Central view replacing Google Drive sheets | MEDIUM | Table with product, SKU, warehouse, qty available, qty reserved, qty in production, min threshold |
| Multi-warehouse toggle / filter | Business has multiple branches; filtering is essential | LOW | Warehouse filter dropdown or tab switcher above stock table |
| Stock movement log | PRD calls audit logs "non-negotiable" | MEDIUM | Append-only table of all movements with type (IN/OUT/TRANSFER/ADJUSTMENT/DAMAGED), quantity, who, when, reference |
| Inter-branch transfer request form | Transfers between warehouses require a documented workflow | MEDIUM | Form: from warehouse, to warehouse, item, qty, reason; status (Pending/Approved/In Transit/Completed) |
| Transfer status list | Visibility into pending/active transfers | LOW | List view of transfer requests with status badges |
| Minimum threshold configuration per item | Prerequisite for low-stock alerts | LOW | Inline editable threshold field on stock dashboard; or separate settings screen |
| Quality assurance log | Damaged items must be tracked, not discarded | MEDIUM | Table of damaged items with condition, repair status, resale flag |
| Barcode/QR scan placeholder UI | Hardware integration is out of scope but UI affordance must exist | LOW | "Scan Item" button that opens a camera/input placeholder; shows mock scan result |
| Stock adjustment form (Inventory Head only) | Inventory Head is the only authorized adjuster per PRD | MEDIUM | Adjustment form with qty delta, reason, approval flag; role-gated button |

### Table Stakes — Admin: Reporting Interface

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Cash flow statement view | Primary financial report; named first in PRD | HIGH | Date-range filter, inflows/outflows breakdown table, net summary; mock data |
| Project costing breakdown | Per-project cost analysis (materials, labor, overhead) | HIGH | Project selector, cost category breakdown, total vs. budget comparison; Recharts bar chart |
| Forecasting charts (sales, inventory, material consumption) | Visual forward-looking data; explicitly in PRD | HIGH | Multi-tab chart view using Recharts; line charts for trends; mock projected data |
| Performance reports (inventory, production, supplier) | Operational metrics dashboards; explicitly in PRD | HIGH | Three sub-views with summary stats, tables, and charts; mock data |

### Table Stakes — Shared Design System

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Shared component library (`packages/ui`) | Both apps must look consistent; this is a monorepo | HIGH | Button, Input, Select, Card, Table, Badge, Modal, Tabs, Sidebar, Notification — all using shadcn/ui primitives and shared Tailwind tokens |
| Color tokens and typography scale | Design consistency across all screens | MEDIUM | CSS variables in Tailwind v4 config: brand colors, semantic colors (success/warning/error), font sizes |
| Responsive layouts (desktop primary) | Required per PROJECT.md | MEDIUM | Desktop-first grid layouts that don't break at tablet; management mobile view is special-cased |

---

### Differentiators

Features that go beyond generic ERP mockups and reflect FurniTrack's specific business context.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Stock state machine visualization | Most ERPs show a number; FurniTrack shows stock state (Available / Reserved / In Production / Delivered) — reflects real business logic | MEDIUM | Color-coded status column in stock dashboard; tooltip explaining each state |
| Quotation-to-order lineage display | Showing the parent quotation on an order (and vice versa) makes the sales flow traceable in the UI | LOW | "Derived from Quotation #Q-0042" link on order detail screen |
| Rush order flag with visual callout | Rush orders need special handling (SOO, target date, lead time priority) | LOW | Red/orange badge on orders; prominent in sales hand-off checklist |
| VAT-exempt toggle on document generation | Philippine business requirement (OR with VAT-exempt option); differentiates from generic invoicing | LOW | Toggle on OR generation screen: VAT / VAT-Exempt; changes displayed fields |
| Stock not reserved at quote stage — visible status | The no-reservation-at-quote rule is a specific business rule that generic ERPs get wrong; making it visible in the UI is a differentiator | LOW | "Stock not reserved" notice in quotation builder; "Reserved" badge only appears post-confirmation |
| Role personas as demo switcher | Since auth is simulated, a clean role-switching UI makes the mockup demonstrable to all stakeholders | LOW | Persistent role switcher in admin header; shows current role; switches sidebar and accessible routes |
| Multi-warehouse stock breakdown per product | Generic ERPs show one stock number; FurniTrack shows per-warehouse breakdown | MEDIUM | Expandable row or modal on stock dashboard showing qty per warehouse |
| Damaged goods resale tracking (QA log) | Most systems just write off damaged goods; FurniTrack tracks repair → resale to minimize loss | MEDIUM | QA log with "Repair Status" and "Available for Resale" flag; links back to original stock movement |
| Production status (SOO) on order timeline | Showing where in production an order is (Pending SOO / In Production / Partially Complete / Done) | MEDIUM | Timeline component on order detail; current status highlighted; driven by mock SOO data |

---

### Anti-Features (for UI Mockup Phase)

Features that seem necessary but are either out of scope for a UI mockup or create disproportionate effort for no mockup value.

| Feature | Why Requested | Why It's Anti-Feature for This Phase | What to Do Instead |
|---------|---------------|--------------------------------------|-------------------|
| Real authentication with session tokens | "It needs to work securely" | Auth.js sessions require a real backend; sessions can't be mocked meaningfully | Build a role selector UI that simulates switching — a dropdown in the header that changes the active role and nav |
| Actual PDF generation (Invoice, DR, OR) | "We need the documents" | PDF rendering (React PDF, Puppeteer) adds heavy dependencies and has no UI mockup value | Render a styled HTML preview of the document in a modal; add a "Download PDF" button that shows a toast "PDF generation requires backend" |
| Real-time stock availability (live API) | "Stock should update as users browse" | No backend exists; real-time polling/websockets are meaningless against static data | Show mock stock states (In Stock / Low Stock / Out of Stock) via hardcoded flags per product; mention in UI label that this reflects live data in production |
| Barcode/QR hardware scanner integration | "We need scanning for inventory" | Hardware APIs (getUserMedia, BarcodeDetector) are backend/device concerns; building them in UI mockup wastes time | Add a "Scan Item" button that opens a mock scan result panel with a hardcoded item; placeholder copy says "Connect scanner in production" |
| File upload (payment proof, product images) | "Sales needs to attach proof" | File upload requires storage backend (S3/local); can't be tested meaningfully without it | Render an upload zone with a placeholder "No file chosen" state; show a mock uploaded file in the payment tracker |
| Email/SMS notification sending | "Staff should get alerts" | Transactional email (Resend, SendGrid) is a backend concern | Show in-app notification bell with mock alerts; add a placeholder "Email sent to [user]" confirmation state after form submissions |
| Pagination with real DB queries | "The tables will have thousands of rows" | Pagination logic needs a backend count + offset query to be meaningful | Use static mock data with 10–15 rows per table and include a pagination UI component (prev/next, page numbers) as decorative — note "backed by API in production" |
| Prisma migrations / DB setup | "We should set up the database now" | DB is explicitly out of scope for MVP milestone | Define the schema in `packages/db/prisma/schema.prisma` as reference, but do not run migrations or connect a real DB |
| Advanced search (full-text, fuzzy) | "Users should be able to search anything" | Full-text search needs a DB or search index; impossible to mock meaningfully beyond client-side filter | Add a search input component; filter visible mock data client-side; label component as "Powered by full-text search in production" |
| User management CRUD (create/edit staff accounts) | "Admin needs to manage users" | Adds an entire settings module that isn't called out in any PRD workflow | Show a Users list screen as a placeholder with mock data; defer create/edit to backend milestone |
| Customer-facing account registration/signup | "Customers need accounts" | Auth for storefront customers requires backend; no value in mocking registration that doesn't persist | Show the `/account` section as a logged-in state with mock customer data; add a login/register form as UI-only (no submission behavior) |

---

## Feature Dependencies

```
[Admin Login UI + Role Switcher]
    └──enables──> [All admin role sections]
                      ├──requires──> [Role-based navigation shell]
                      └──requires──> [Shared component library (packages/ui)]

[Product Catalog]
    └──requires──> [Shared design system tokens]
    └──enables──> [Product Detail Page]
                      └──enables──> [Cart]
                                        └──enables──> [Quotation Request Form]

[Lead Intake Form]
    └──enables──> [Quotation Builder]
                      ├──requires──> [Inventory Inquiry Panel]
                      └──enables──> [Order Conversion Screen]
                                        ├──enables──> [Payment Tracker]
                                        ├──enables──> [Document Generation UI]
                                        └──enables──> [Stock State Transitions in UI]

[Stock Dashboard]
    └──requires──> [Multi-warehouse toggle]
    └──enables──> [Stock Movement Log]
    └──enables──> [Transfer Module]
    └──enables──> [QA Log]
    └──enables──> [Inventory Inquiry Panel in Quotation Builder]

[Management KPI Cards]
    └──enhances──> [Operational Snapshot Widget]
    └──enhances──> [Inventory Health Widget]

[Forecasting Charts]
    └──requires──> [Recharts installed and configured]
[Cash Flow View]
    └──requires──> [Recharts installed and configured]
[Performance Reports]
    └──requires──> [Recharts installed and configured]

[Approval Portal]
    └──requires──> [Role switcher showing MANAGEMENT role]
    └──enhances──> [Payment Tracker]
    └──enhances──> [Quotation/Order override actions]
```

### Dependency Notes

- **Shared component library must be built first:** Every screen in both apps consumes `packages/ui` components. Until Button, Input, Table, Card, and Sidebar exist, no screen can be built consistently.
- **Role switcher unlocks admin sections:** Without the simulated role switcher, the mockup cannot demonstrate RBAC to stakeholders.
- **Inventory inquiry panel depends on stock dashboard data shape:** The mock data structure used in the stock dashboard must be consistent with what the quotation builder queries — define the mock data schema early.
- **Recharts must be installed before any reporting screen:** All four reporting screens depend on it; install and verify rendering before building the reports section.
- **Document generation UI depends on order existing:** Invoice/DR/OR screens are accessed from order detail — order detail must exist first.

---

## MVP Definition

### UI Mockup Launch (this milestone)

The mockup is complete when all screens are navigable with realistic mock data and every role's workflow can be demonstrated end-to-end.

- [ ] Shared design system (tokens, component library) — all other screens depend on this
- [ ] Admin role switcher + navigation shell — prerequisite for demonstrating RBAC
- [ ] Storefront: homepage, catalog, product detail, cart, quotation request form
- [ ] Management dashboard: KPI cards, inventory health, operational snapshot, mobile view
- [ ] Sales: lead list, lead intake, quotation builder with inventory inquiry, follow-up tracker, order conversion
- [ ] Accounting: VAT calculation display, payment tracker, approval portal, document generation UI
- [ ] Inventory: stock dashboard, multi-warehouse toggle, movement log, transfer module, QA log, adjustment form
- [ ] Reporting: cash flow, project costing, forecasting charts, performance reports
- [ ] Customer account pages (orders, quotes) — static mock data
- [ ] Unauthorized page + login page

### Add After Backend Milestone (v1.x)

- [ ] Real Auth.js sessions replacing role switcher
- [ ] Live stock availability in storefront (connected to DB)
- [ ] Actual PDF generation
- [ ] File upload (payment proofs, product images)
- [ ] Real-time notifications (websockets or polling)
- [ ] Email alerts
- [ ] Pagination backed by DB queries

### Defer to v2+

- [ ] Customer-facing account registration + authentication
- [ ] User management CRUD for admin
- [ ] Barcode/QR hardware scanner integration (beyond placeholder)
- [ ] Advanced full-text search
- [ ] Supplier portal
- [ ] Mobile app (native)

---

## Feature Prioritization Matrix

Scoped to the UI mockup milestone. "Implementation cost" = design + component complexity within Next.js + static data.

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Shared component library (packages/ui) | HIGH | HIGH | P1 |
| Admin role switcher + nav shell | HIGH | MEDIUM | P1 |
| Storefront catalog + product detail | HIGH | MEDIUM | P1 |
| Quotation request form (storefront) | HIGH | MEDIUM | P1 |
| Sales: quotation builder | HIGH | HIGH | P1 |
| Sales: follow-up tracker / CRM board | HIGH | HIGH | P1 |
| Management KPI dashboard | HIGH | LOW | P1 |
| Inventory stock dashboard | HIGH | MEDIUM | P1 |
| Accounting: payment tracker | HIGH | MEDIUM | P1 |
| Accounting: approval portal | HIGH | HIGH | P1 |
| Document generation UI | MEDIUM | MEDIUM | P1 |
| Reporting: forecasting charts | HIGH | HIGH | P1 |
| Reporting: cash flow view | HIGH | HIGH | P1 |
| Cart (storefront) | MEDIUM | MEDIUM | P1 |
| Mobile management view | MEDIUM | HIGH | P1 |
| QA log (inventory) | MEDIUM | MEDIUM | P2 |
| Transfer module (inventory) | MEDIUM | MEDIUM | P2 |
| Reporting: performance reports | MEDIUM | HIGH | P2 |
| Project costing breakdown | MEDIUM | HIGH | P2 |
| Customer account pages | LOW | MEDIUM | P2 |
| Barcode scan placeholder | LOW | LOW | P3 |
| Stock state machine visualization | MEDIUM | LOW | P2 |
| Rush order flag display | LOW | LOW | P3 |

**Priority key:**
- P1: Must have for UI mockup to be demonstrable
- P2: Should have; adds completeness without blocking demo
- P3: Nice to have; add only if time permits

---

## Competitor Feature Analysis

This is an internal custom system (not a market product), so the comparison is against generic ERP/furniture POS alternatives the business was using or might use.

| Feature | Google Drive + Excel (current) | Generic POS / ERP (e.g. Odoo, Quickbooks) | FurniTrack Approach |
|---------|--------------------------------|-------------------------------------------|---------------------|
| Stock reservation rules | Manual, error-prone, no enforcement | Usually reserve on cart/order without quote-stage distinction | Explicit quote/confirm/PO state machine — enforced visually in UI |
| Multi-warehouse tracking | Separate spreadsheets per branch | Available but complex setup | Native toggle built into stock dashboard |
| Quotation builder with live stock check | Not possible (spreadsheet) | Available but not furniture-specific (no dimensions/finishes) | Inline inventory inquiry panel inside quotation builder |
| Damaged goods tracking | Ad-hoc notes | Typically write-off only | Dedicated QA log with repair-to-resale workflow |
| Role-based access | File sharing permissions (coarse) | Available but generic | Five roles with granular page-level access enforced at nav level |
| VAT-exempt document generation | Manual document editing | Standard VAT; VAT-exempt often manual override | Toggle per document; Philippine BIR compliance-ready UI |
| Management mobile view | Not possible | Responsive but not tailored | Dedicated mobile layout with only executive-relevant data |

---

## Sources

- `docs/PRD.md` — Primary source; all role requirements, business logic rules, and workflows
- `docs/planning/2026-03-06-furnitrack-planning.md` — Technical planning doc; screen inventory, DB schema, API routes
- `.planning/PROJECT.md` — Scope boundaries, out-of-scope items, tech stack constraints
- Domain analysis: furniture B2B ERP patterns (quote-based sales, multi-warehouse inventory, production tracking) drawn from PRD business logic — HIGH confidence, no external verification required for UI scope

---
*Feature research for: FurniTrack — Furniture ERP + E-Commerce UI Mockup*
*Researched: 2026-03-06*
