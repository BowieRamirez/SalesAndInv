# Project Research Summary

**Project:** FurniTrack — Furniture ERP + E-Commerce Platform
**Domain:** Next.js 16 pnpm monorepo — dual-app (e-commerce storefront + ERP admin dashboard), UI mockup milestone
**Researched:** 2026-03-06
**Confidence:** MEDIUM-HIGH (stack versions from planning doc verified via Context7; Tailwind v4 and shadcn/ui v4 compatibility needs verification at project start)

---

## Executive Summary

FurniTrack is a custom internal system replacing a fragmented Google Drive + Excel workflow with a dual-app Next.js monorepo: a public-facing furniture e-commerce storefront and a role-gated ERP admin dashboard serving five internal roles (Management, Sales, Accounting, Inventory, Admin). This milestone is a UI mockup — navigable screens with realistic static data, no backend, no real auth, no database. The goal is a fully demonstrable prototype where all five role workflows can be shown to stakeholders end-to-end using mock data. The recommended architecture is a Turborepo-managed pnpm monorepo with Next.js 16 App Router for both apps and four shared packages: component primitives (`@furnitrack/ui`), Zod validation schemas (`@furnitrack/validators`), centralized mock data and future Prisma integration (`@furnitrack/db`), and shared tooling configs (`@furnitrack/config`).

The most consequential technical decision for this milestone is establishing the mock data architecture correctly from the start. Components must never embed inline fixture data — all mock data lives in `packages/db/src/mock/` and is injected at the page level via props. This single structural decision determines whether the transition from UI mockup to real backend integration in the next milestone is a smooth swap or a full rewrite. The same discipline applies to the role-switching mechanism: a `MockAuthProvider` React context with a `useRole()` hook interface must be in place before any role-specific UI is built, because the hook interface is designed to be replaced by a real Auth.js session call without touching any component code.

The primary risk is the Tailwind v4 + shadcn/ui compatibility question. Tailwind v4 uses a CSS-first config that is architecturally different from v3, and shadcn/ui's CLI was built against v3 assumptions. If the current shadcn CLI does not fully support v4 at project start, the fallback is to pin Tailwind to v3.4.x for this milestone — the visual output is identical for this project's needs. This decision must be made and verified in Phase 1 before any UI component work begins. Aside from this, all other stack choices are well-established patterns with high confidence.

---

## Key Findings

### Recommended Stack

The stack is defined in the project planning doc and verified via Context7. The core runtime is Next.js 16 with React 19, TypeScript 5, and Tailwind CSS v4, managed via pnpm 9 workspaces with Turborepo 2 for build orchestration. For UI components, shadcn/ui (CLI-based, not a versioned npm package) generates component source directly into `packages/ui`, with Lucide for icons and Recharts 2 for all chart screens. Forms use react-hook-form 7 with Zod 3 schemas shared from `packages/validators`. Client state (cart, role switcher, UI toggles) uses Zustand 4, while all data fetching is structured through TanStack React Query 5 even against mock fixtures — this ensures zero component changes when real API routes replace mock query functions in Milestone 2.

**Core technologies:**
- `next ^16.1.x` + `react ^19.x`: App Router with Server Components; two apps in one monorepo is the current Vercel-blessed pattern
- `typescript ^5.x`: Non-negotiable; types must flow across package boundaries in a monorepo
- `tailwindcss ^4.x`: CSS-first config via `@import "tailwindcss"` and `@theme` blocks; no `tailwind.config.js`
- `pnpm ^9.x` + `turbo ^2.x`: Standard for Next.js monorepos; pnpm's symlink isolation prevents phantom dependency bugs
- `shadcn/ui` (latest CLI): Code-generator, not a versioned package; components installed into `packages/ui`
- `recharts ^2.x`: SVG-based, SSR-safe; all reporting screens (cash flow, forecasting, performance) depend on it
- `react-hook-form ^7.x` + `zod ^3.x` + `@hookform/resolvers ^3.x`: Form + validation stack for quotation builder, lead intake, adjustment forms
- `zustand ^4.x`: Mock backend for cart and demo role state; no Provider wrapping required
- `@tanstack/react-query ^5.x`: Structures all data fetching against fixtures today, real API tomorrow

**Critical version note:** Tailwind v4 is incompatible with the v3 `tailwind.config.js` pattern. Verify shadcn/ui CLI v4 support before initializing the project; fall back to Tailwind v3.4.x if unsupported.

See `.planning/research/STACK.md` for full version table, installation commands, and mock data layer patterns.

---

### Expected Features

FurniTrack's feature set is large but well-defined in the PRD. The UI mockup milestone is complete when all screens across both apps are navigable with realistic mock data and every role's workflow can be demonstrated end-to-end. The most important dependency insight: the shared component library (`packages/ui`) must exist before any screen can be built consistently, and the role switcher must exist before any role-specific admin UI can be built or demonstrated.

**Must have (table stakes) — P1:**
- Shared design system: tokens, `packages/ui` component library (Button, Card, DataTable, StatCard, ChartWrapper) — every screen depends on this
- Admin role switcher + navigation shell — prerequisite for demonstrating RBAC to any stakeholder
- Storefront: homepage, product catalog with filters, product detail with stock badge, cart, quotation request form
- Management dashboard: KPI cards, inventory health widget, operational snapshot, mobile-optimized layout (PRD explicit requirement)
- Sales: lead list, lead intake form, quotation builder with inline inventory inquiry panel, follow-up tracker (CRM board), order conversion screen
- Accounting: VAT/discount calculation display, payment tracker, approval portal, document generation UI (Invoice/DR/OR buttons)
- Inventory: stock dashboard with multi-warehouse toggle, stock movement log, inter-branch transfer module, QA log, stock adjustment form
- Reporting: cash flow statement, project costing breakdown, forecasting charts, performance reports (all four use Recharts)

**Should have (differentiators) — P2:**
- Stock state machine visualization (Available / Reserved / In Production / Delivered as color-coded states)
- Quotation-to-order lineage display (parent quotation link on order detail)
- VAT-exempt toggle on document generation (Philippine BIR compliance-ready UI)
- "Stock not reserved at quote stage" visible notice in quotation builder
- Multi-warehouse per-product stock breakdown (expandable row on stock dashboard)
- Damaged goods resale tracking in QA log (repair-to-resale workflow)
- Production status (SOO) timeline on order detail

**Defer (v2+ / backend milestone):**
- Real Auth.js sessions replacing role switcher
- Actual PDF generation (Invoice, DR, OR)
- File upload (payment proofs, product images)
- Real-time stock availability in storefront
- Email/SMS notifications
- Customer-facing account registration
- User management CRUD
- Barcode/QR hardware scanner integration
- Advanced full-text search

**Anti-features for this phase:** Do not build real auth, PDF generation, MSW, Faker-based dynamic mock data, or database connections. These add complexity with zero UI mockup value.

See `.planning/research/FEATURES.md` for full prioritization matrix, feature dependencies, and competitor comparison.

---

### Architecture Approach

The system is a Turborepo pnpm monorepo with two Next.js 16 apps and four shared packages. Both apps use App Router with route groups — `(catalog)/(checkout)/(account)` in storefront and `(auth)/(dashboard)` in admin — for layout isolation without URL segment pollution. The critical architectural boundary is that apps never import from each other; all shared needs go through `packages/*`. The mock data layer is centralized in `packages/db/src/mock/` so both apps share identical fixtures and the Prisma schema is pre-defined for the backend milestone without running migrations.

**Major components:**
1. `apps/storefront` — Public catalog, cart (Zustand), quotation request form; static rendering for product pages; imports only from `packages/*`
2. `apps/admin` — Role-gated ERP dashboard; `(dashboard)/layout.tsx` is the single sidebar shell; role switching via `RoleProvider` React context; imports only from `packages/*`
3. `packages/ui` — shadcn/ui component wrappers, design token exports, StatCard, DataTable, ChartWrapper; domain-agnostic, no role logic; transpiled by consuming apps via `transpilePackages`
4. `packages/validators` — Zod schemas as single source of truth for all data shapes; used by both apps and future API routes; no React imports
5. `packages/db` — Prisma schema (defined, not connected) + mock fixtures; MVP: exports mock only; Phase 2: exports PrismaClient; import paths in apps never change
6. `packages/config` — TypeScript base config, ESLint flat config, Tailwind base CSS; consumed via `extends`, never imported at runtime

**Data flow (MVP):** Server Component imports fixture from `@furnitrack/db/mock` → passes as props to Client Components → Zustand handles mutable UI state (cart, role). No network round-trips.

**Data flow (post-MVP reference):** Client Component → React Query mutation → Next.js Route Handler → Zod validation → PrismaClient → PostgreSQL. The component code changes nothing between milestones.

**Build order (bottom-up):** Monorepo scaffold → shared packages (validators, db/mock, ui) → app scaffolds with shells → admin role pages → storefront pages.

See `.planning/research/ARCHITECTURE.md` for full directory tree, pattern code samples, anti-patterns, and scalability notes.

---

### Critical Pitfalls

Ten pitfalls were identified. These are the top five with the highest impact on project success.

1. **Tailwind v4 + shadcn/ui incompatibility** — shadcn/ui was built against v3's JS config; v4's CSS-first `@theme` setup may cause broken CSS variable references or silent failures. Prevention: verify shadcn CLI v4 support on day one; if unconfirmed, pin Tailwind v3.4.x for this milestone (visual output is identical).

2. **Inline mock data embedded in components** — Defining fixture arrays inside component files makes backend integration a full rewrite of every screen. Prevention: all mock data lives exclusively in `packages/db/src/mock/`; components receive data via props; pages are the only injection point. Never negotiable.

3. **Hardcoded role constants instead of a dynamic role context** — Building layouts with `const CURRENT_ROLE = "SALES"` means role switching never works and stakeholder demos fail. Prevention: `MockAuthProvider` with `useRole()` hook must be the first thing built in the admin app shell; all five roles must be switchable via UI from day one.

4. **Shared `packages/ui` CSS purged from consuming apps** — Tailwind's content scanner doesn't automatically reach files in `packages/ui`; shared components render as unstyled HTML. Prevention: each app's Tailwind config must explicitly include `@source "../../packages/ui/src"` (v4) or equivalent `content` path (v3). Verify with a smoke-test styled component before building any real UI.

5. **Missing loading/error/empty states across all data components** — Mock data always "succeeds" instantly, so teams build only the success state. Prevention: every table, card, and chart must have a skeleton loading state, error card, and empty state built at the same time as the success state, during the same phase; never defer to backend milestone.

**Additional high-risk pitfalls:** RSC / "use client" boundary violations (Recharts and all hook-using components must be explicitly marked); pnpm workspace protocol violations causing phantom dependencies in CI; business logic accidentally embedded in mock utilities (mock data represents outcomes, never computes them).

See `.planning/research/PITFALLS.md` for all 10 pitfalls with warning signs, recovery strategies, and a phase-to-pitfall mapping table.

---

## Implications for Roadmap

Based on the combined research, the architecture's bottom-up dependency graph maps naturally to six phases for the UI mockup milestone. The dependency chain is non-negotiable: shared packages must precede app shells, and app shells must precede role-specific screens.

### Phase 1: Monorepo Foundation and Shared Packages
**Rationale:** Everything else depends on this layer. The TypeScript config, ESLint flat config, Tailwind base config, Zod schemas, mock data fixtures, and shared UI component library must all exist before any screen can be built consistently. This is also the phase where all critical infrastructure pitfalls (Tailwind v4/shadcn compatibility, CSS purging, pnpm workspace protocol, TypeScript path aliases, RSC boundaries) must be caught and resolved. Starting any feature work before these are verified is high-risk.
**Delivers:** `packages/config`, `packages/validators` (Zod schemas for all entities), `packages/db/src/mock` (all fixture files: products, orders, stock, leads, payments, users, KPIs), `packages/ui` (Button, Card, DataTable, StatCard, ChartWrapper, form primitives, design tokens), Turborepo pipeline with passing `typecheck` and `build` across all workspaces.
**Addresses features:** Shared design system (P1), design tokens and typography scale, shared component library.
**Avoids pitfalls:** Tailwind v4+shadcn compatibility (verified here), CSS purging (smoke-tested here), phantom dependencies (frozen lockfile CI check), TypeScript alias misconfiguration (turbo typecheck passes), RSC boundary pattern established.
**Research flag:** Needs verification of shadcn CLI Tailwind v4 support at project start; may require Tailwind v3 fallback decision.

### Phase 2: App Scaffolds and Navigation Shells
**Rationale:** Both apps need their structural shells before any page content can be built into them. The admin `RoleProvider` and role switcher are not optional — they are load-bearing for demonstrating any role-specific UI. The management mobile layout requirement (explicitly called out in PRD for "Karen Alonzo") must be considered in the dashboard layout design, not added as an afterthought.
**Delivers:** `apps/admin` with route group structure, `RoleProvider` React context, `Topbar` with role switcher (all five roles switchable), `Sidebar` driven by `NAV_CONFIG[role]`, login page (UI only), unauthorized page. `apps/storefront` with layout, nav/footer, route groups for catalog/checkout/account.
**Addresses features:** Admin login page, role-based navigation shell, unauthorized page.
**Avoids pitfalls:** Hardcoded role constant anti-pattern; flat route structure anti-pattern (sidebar must live in `(dashboard)/layout.tsx`, not repeated per page).

### Phase 3: Management Dashboard and Storefront Core
**Rationale:** Management dashboard is the simplest admin section (read-only KPI display) and validates that the admin shell, shared layout, StatCard component, and mock data pipeline all work end-to-end before tackling complex interactive sections. Storefront core (homepage, catalog, product detail) has zero dependency on admin pages and can proceed in parallel. These two can be built simultaneously by separate work tracks after Phase 2 scaffolds exist.
**Delivers:** Management: KPI cards, inventory health widget, operational snapshot, notification bell, mobile-optimized condensed layout. Storefront: homepage with featured products, product catalog with filter sidebar, product detail with image gallery + stock badge, storefront nav and footer.
**Addresses features:** Management KPI dashboard (P1), management mobile view (P1), notification bell (table stakes), homepage, product catalog (P1), product detail (P1).
**Avoids pitfalls:** Loading/empty/error states for every data component; mobile management view must be a real responsive breakpoint, not just desktop layout shrunk.
**Research flag:** Standard patterns — no phase-level research needed.

### Phase 4: Sales Workflow (Admin)
**Rationale:** Sales is the most complex admin section due to the quotation builder's interactive line-item table and the CRM follow-up tracker. It also has the highest number of cross-feature dependencies: lead intake enables quotation, quotation enables order conversion, order conversion enables accounting flows. Building sales before accounting and inventory ensures the data shapes are settled (quotation line items, order structure) before those sections are built.
**Delivers:** Lead list, lead intake form (RHF + Zod validation), quotation builder with inline inventory inquiry panel (critical differentiator per PRD), quotation list and detail view, follow-up tracker / CRM board (all stage transitions), sales hand-off checklist, order conversion screen.
**Addresses features:** All Sales table stakes (P1), quotation-to-order lineage (P2), rush order flag (P3), "stock not reserved at quote stage" notice (P2).
**Avoids pitfalls:** Business logic must not leak into mock utilities — VAT amounts and stock states are hardcoded in fixtures, not computed. Quotation builder must support add/edit/remove line items (not static). All components need loading/empty/error states.
**Research flag:** Standard patterns for data table + form interactions; no phase research needed.

### Phase 5: Inventory and Accounting (Admin)
**Rationale:** Both sections depend on the data shapes established in Phase 4 (orders, quotations). Inventory and Accounting can proceed in parallel after Phase 4 is complete. Accounting's approval portal depends on order data; inventory's transfer module and QA log are self-contained. The document generation UI (Invoice/DR/OR) depends on order detail existing first.
**Delivers:** Inventory: stock dashboard with multi-warehouse toggle, stock movement log, inter-branch transfer request + status list, minimum threshold config, QA log with repair-to-resale tracking, barcode scan placeholder, stock adjustment form (role-gated). Accounting: VAT/discount calculation display, payment tracker with proof upload placeholder, approval portal (queue + approve/reject), document generation UI (Invoice/DR/OR buttons with modal preview + VAT-exempt toggle).
**Addresses features:** All Inventory and Accounting table stakes (P1), stock state machine visualization (P2), multi-warehouse per-product breakdown (P2), damaged goods resale tracking (P2), VAT-exempt toggle (P2).
**Avoids pitfalls:** Multi-warehouse toggle must be client-side state, not a route change (preserves filter state). Stock state machine shows outcome states in mock data — no computation logic.
**Research flag:** Standard patterns; no phase research needed.

### Phase 6: Reporting, Storefront Cart/Checkout, and Customer Account
**Rationale:** Reporting is last in admin because it is purely read-only and consumes data from all other domains — it cannot be properly built until all mock data shapes are settled. Storefront cart, checkout, and customer account pages can proceed in parallel since they have no admin dependencies. This phase completes all P1 items and addresses P2 items where time permits.
**Delivers:** Reports: cash flow statement view, project costing breakdown, forecasting charts (multi-tab Recharts), performance reports (three sub-views). Storefront: cart with Zustand state, quotation request form (multi-field, RHF + Zod), customer account order history and submitted quotes. Remaining P2 items: production status timeline, QA log enhancements.
**Addresses features:** All Reporting table stakes (P1), cart (P1), quotation request form (P1), customer account pages (P2).
**Avoids pitfalls:** All Recharts chart components must be wrapped in `"use client"` components; import via `next/dynamic` with `ssr: false` for heavy chart pages (5+ charts). Mock datasets for charts must be kept under 50KB.
**Research flag:** Recharts RSC boundary handling is well-documented; no research needed. Chart data schema should be defined in Phase 1 mock data to avoid late-breaking changes.

---

### Phase Ordering Rationale

- **Bottom-up forced order:** Packages before apps, shells before pages — this is the dependency graph, not a preference. Deviating creates rework.
- **Sales before Accounting/Inventory:** Accounting's approval portal and Inventory's inquiry panel both depend on data shapes from the order/quotation workflow. Settling these shapes early prevents mock data refactoring across multiple sections.
- **Management first among admin sections:** Simplest section, validates the full pipeline (layout shell → mock data → shared component → rendered page) with low debugging surface area.
- **Reporting last:** Only read-only; consumes all other domains' data; benefits from all mock data being finalized.
- **Storefront tracks in parallel:** Storefront has zero dependency on admin pages after Phase 2 scaffolds exist; Phase 3 catalog and Phase 6 cart/checkout can be parallelized with admin work.

---

### Research Flags

**Phases requiring verification before implementation:**
- **Phase 1:** Tailwind v4 + shadcn/ui CLI compatibility must be checked against the official shadcn changelog (`https://ui.shadcn.com/docs/changelog`) on day one. If v4 is not fully supported, a Tailwind v3.4.x fallback decision must be made before any UI component work begins.
- **Phase 1:** React 19 peer dependency compatibility for react-hook-form, Zustand, and Recharts should be verified at install time with actual current package versions.

**Phases with standard, well-documented patterns (skip phase research):**
- **Phase 2:** Next.js App Router route groups and layout nesting are stable, well-documented patterns since Next.js 13.4.
- **Phase 3–5:** TanStack Table for data tables, react-hook-form with Zod resolvers, Zustand store patterns — all high-confidence, no research needed.
- **Phase 6:** Recharts SSR boundary handling (`"use client"` + `next/dynamic ssr: false`) is a documented pattern.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Versions sourced directly from project planning doc and verified via Context7 MCP. One exception: Tailwind v4 + shadcn/ui compatibility is MEDIUM — needs day-one verification. |
| Features | HIGH | Sourced directly from PRD.md and planning doc; no external verification needed for UI scope. Feature set is fully defined and prioritized. |
| Architecture | HIGH | Project planning doc specifies directory structure, package boundaries, and route group patterns. App Router + Turborepo monorepo patterns are stable since Next.js 13.4. |
| Pitfalls | MEDIUM | Next.js RSC rules, pnpm workspace protocol, and Turborepo task config are HIGH confidence. Tailwind v4 specifics and React 19 peer dependency behavior are MEDIUM — training data through Jan 2025, web sources unavailable during research. |

**Overall confidence:** MEDIUM-HIGH. The stack, feature set, and architecture are well-defined with high confidence. The two MEDIUM-confidence areas (Tailwind v4/shadcn compatibility and React 19 peer deps) are both Phase 1 verification items that resolve quickly and have documented fallback paths.

### Gaps to Address

- **Tailwind v4 + shadcn/ui compatibility:** Cannot be confirmed from training data alone. Check `https://ui.shadcn.com/docs/changelog` and `https://tailwindcss.com/docs/upgrade-guide` on day one. Decision gate: if shadcn CLI does not support v4, pin Tailwind to `^3.4.x` for this milestone and migrate in a post-backend hardening phase.
- **React 19 peer dependency warnings:** react-hook-form, Recharts, and Zustand may emit peer dependency warnings against React 19 at install time. Use `pnpm install --legacy-peer-deps` only if needed; verify each library's actual React 19 support before using it in production components.
- **Next.js 16 Turbopack monorepo resolution:** Turbopack in Next.js 16 requires `root: '../../'` in `next.config.ts` for monorepo workspace resolution. Verify this config flag is present in both apps — confirmed in planning doc but easy to miss when copying configs between apps.
- **Prisma schema future-proofing:** `packages/db/prisma/schema.prisma` should be defined in Phase 1 as a reference document even though no DB is connected. This ensures mock data fixture shapes align with what Prisma will generate, preventing type changes at backend integration time.

---

## Sources

### Primary (HIGH confidence)
- `docs/planning/2026-03-06-furnitrack-planning.md` — All version numbers, directory structure, package boundaries, Turborepo config (verified via Context7 MCP, 2026-03-06)
- `docs/PRD.md` — All role requirements, business logic rules, workflows, and screen inventory
- `.planning/PROJECT.md` — Scope boundaries, out-of-scope items, milestone constraints

### Secondary (MEDIUM confidence)
- Training data (knowledge cutoff Jan 2025) — Tailwind v4 CSS-first config approach, shadcn/ui CLI behavior against v4, Recharts SSR compatibility with React 19, RSC boundary rules
- Next.js App Router official documentation (via training data) — Route groups, layout nesting, Server/Client Component boundary rules (HIGH confidence, stable since Next.js 13.4)
- pnpm workspace protocol specification (via training data) — Phantom dependency prevention, frozen lockfile behavior (HIGH confidence, stable spec)

### Tertiary (LOW-MEDIUM confidence, needs validation)
- `https://ui.shadcn.com/docs/changelog` — Verify shadcn/ui v4 Tailwind compatibility status before Phase 1
- `https://tailwindcss.com/docs/upgrade-guide` — Verify v4 `@source` syntax and `@theme` block behavior
- React 19 library compatibility matrix — Verify at install time per library

---

*Research completed: 2026-03-06*
*Ready for roadmap: yes*
