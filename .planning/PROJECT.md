# FurniTrack

## What This Is

FurniTrack is an integrated e-commerce and business management platform for a furniture company. It consists of a public-facing storefront for customers and a role-based admin dashboard for internal teams (Management, Sales, Accounting, Inventory). The MVP milestone is a complete UI/design mockup of the entire system — all screens, flows, and roles — built with real Next.js components but with no live backend. Backend integration is the next milestone.

## Core Value

The complete system works as one integrated unit — storefront, inventory, sales, accounting, and reporting all reflect the same real-time data with zero manual fallback to spreadsheets.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Public storefront with product catalog, product detail, cart, and quotation request flow
- [ ] Admin login with role-based access (Management, Sales, Accounting, Inventory, Admin)
- [ ] Management dashboard: KPI cards, inventory health, operational snapshot, mobile view
- [ ] Sales interface: lead intake, quotation builder, inventory inquiry, follow-up tracker
- [ ] Accounting interface: payment tracker, VAT calculator, approval portal, document generator
- [ ] Inventory interface: stock dashboard, multi-warehouse toggle, transfer module, audit logs, QA log
- [ ] Reporting interface: cash flow, project costing, forecasting charts, performance reports
- [ ] Shared design system: components, typography, color tokens, spacing used consistently across apps
- [ ] Responsive layouts for all screens (desktop primary, mobile-optimized for management view)

### Out of Scope (MVP milestone)

- Real database or API calls — mock/static data only for MVP
- Authentication with real sessions — UI shell only, navigation between roles simulated
- Payment processing — UI screens only
- File uploads (payment proofs, product images) — placeholder UI
- Barcode/QR scanning hardware integration — placeholder UI
- PDF generation — button UI only, no actual PDF output
- Email notifications — no sending, UI alerts only

## Context

- **Replaces:** Manual Google Drive and Excel workflows used by the furniture business for inventory, sales, and accounting
- **Multi-branch:** Business operates across multiple branch locations with separate warehouses
- **Roles defined in PRD:** Each role has distinct screens and permissions — Management (Karen Alonzo), Sales (Genie Rose Gonzales), Accounting, Inventory Head
- **Planning doc:** Full technical spec at `docs/planning/2026-03-06-furnitrack-planning.md`
- **Business PRD:** Full business requirements at `docs/PRD.md`
- **Milestone structure:** This milestone = UI mockup. Next milestone = backend + real data.

## Constraints

- **Tech Stack:** Next.js 16, React 19, pnpm monorepo, Turborepo, TypeScript, Tailwind CSS v4, shadcn/ui — per planning doc
- **Data:** All data is hardcoded mock/static for MVP — no Prisma, no PostgreSQL yet
- **Auth:** Role switching via UI (e.g. a role selector or demo navigation) — no real Auth.js sessions yet
- **Scope:** UI/design mockup only — every screen and flow must be visually complete and navigable

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 2-App monorepo (storefront + admin) | Clean separation of concerns, both independently deployable | — Pending |
| MVP = UI mockup first | Validate design and flows before investing in backend | — Pending |
| Next.js 16 + React 19 | Latest stable, App Router, Turbopack, Server Components | — Pending |
| pnpm + Turborepo | Fast installs, build caching, parallel task execution | — Pending |
| Tailwind CSS v4 + shadcn/ui | Utility-first with accessible primitives, shared design tokens | — Pending |
| Static/mock data for MVP | No backend complexity, focus on UX completeness | — Pending |

---
*Last updated: 2026-03-06 after initialization*
