# Architecture Research

**Domain:** Next.js 16 pnpm monorepo — dual-app (storefront + admin) with shared packages
**Researched:** 2026-03-06
**Confidence:** HIGH (sourced from project planning doc + established Next.js/Turborepo patterns)

---

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MONOREPO ROOT                                │
│                    (Turborepo + pnpm workspaces)                    │
├──────────────────────────┬──────────────────────────────────────────┤
│   apps/storefront        │   apps/admin                            │
│   (Next.js 16, :3000)    │   (Next.js 16, :3001)                   │
│                          │                                          │
│  ┌──────────────────┐    │  ┌────────────────────────────────────┐  │
│  │ (catalog)/       │    │  │ (auth)/                            │  │
│  │ (checkout)/      │    │  │ (dashboard)/                       │  │
│  │ (account)/       │    │  │   management/  sales/              │  │
│  └──────────────────┘    │  │   inventory/   accounting/         │  │
│                          │  │   reports/                         │  │
│  [No real auth]          │  └────────────────────────────────────┘  │
│  [Mock data only]        │                                          │
│                          │  [Role-switcher (demo)]                  │
│                          │  [Mock data only]                        │
├──────────────────────────┴──────────────────────────────────────────┤
│                         SHARED PACKAGES                             │
│  ┌──────────────┐  ┌─────────────┐  ┌────────┐  ┌───────────────┐  │
│  │ packages/ui  │  │ packages/   │  │ pkgs/  │  │ packages/     │  │
│  │ (shadcn/ui + │  │ validators  │  │ db/    │  │ config        │  │
│  │  primitives) │  │ (Zod        │  │(schema │  │ (TS/ESLint/   │  │
│  │              │  │  schemas)   │  │ only,  │  │  Tailwind)    │  │
│  │              │  │             │  │ no DB) │  │               │  │
│  └──────────────┘  └─────────────┘  └────────┘  └───────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│                        MOCK DATA LAYER                              │
│  packages/db/src/mock/          ← Centralized mock fixtures         │
│  ├── products.ts                                                    │
│  ├── orders.ts                                                      │
│  ├── stock.ts                                                       │
│  ├── users.ts   (5 demo role accounts)                              │
│  └── index.ts   (barrel export)                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Boundary Rule |
|-----------|----------------|---------------|
| `apps/storefront` | Public-facing catalog, cart, quotation request | Never imports from `apps/admin`. Only imports from `packages/*` |
| `apps/admin` | Role-gated internal dashboard for all 5 roles | Never imports from `apps/storefront`. Only imports from `packages/*` |
| `packages/ui` | Shared React component primitives (shadcn/ui wrappers, design tokens) | No app-specific logic. Pure presentational components only |
| `packages/validators` | Shared Zod schemas for all entity types | No React imports. Used by both apps and (later) API routes |
| `packages/db` | Prisma schema definition + mock data fixtures for MVP phase | Mock data lives here so both apps share the same fixture set |
| `packages/config` | Shared TS, ESLint, and Tailwind base configs | Consumed by `extends` in each app/package — never imported at runtime |

---

## Recommended Project Structure

### Full Monorepo Tree

```
furnitrack/
├── apps/
│   ├── storefront/
│   │   ├── app/
│   │   │   ├── layout.tsx              ← Root layout (global font, Tailwind)
│   │   │   ├── page.tsx                ← Homepage
│   │   │   ├── (catalog)/
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx        ← Product listing
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx    ← Product detail
│   │   │   │   └── layout.tsx          ← Catalog layout (nav/footer)
│   │   │   ├── (checkout)/
│   │   │   │   ├── cart/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── checkout/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   └── (account)/
│   │   │       ├── account/
│   │   │       │   ├── orders/
│   │   │       │   │   └── page.tsx
│   │   │       │   └── quotes/
│   │   │       │       └── page.tsx
│   │   │       └── layout.tsx
│   │   ├── components/
│   │   │   ├── product-card.tsx
│   │   │   ├── cart-drawer.tsx
│   │   │   └── quote-request-form.tsx
│   │   ├── lib/
│   │   │   └── mock-data.ts            ← Re-exports from @furnitrack/db/mock
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── admin/
│       ├── app/
│       │   ├── layout.tsx              ← Root layout (no sidebar — bare shell)
│       │   ├── (auth)/
│       │   │   ├── login/
│       │   │   │   └── page.tsx
│       │   │   └── layout.tsx          ← Centered card layout (no sidebar)
│       │   ├── (dashboard)/
│       │   │   ├── layout.tsx          ← Sidebar + topbar shell
│       │   │   ├── management/
│       │   │   │   ├── page.tsx        ← KPI overview
│       │   │   │   └── layout.tsx      ← Optional mobile-first override
│       │   │   ├── sales/
│       │   │   │   ├── page.tsx        ← Lead list
│       │   │   │   ├── leads/
│       │   │   │   │   └── [id]/page.tsx
│       │   │   │   ├── quotations/
│       │   │   │   │   ├── page.tsx
│       │   │   │   │   ├── new/page.tsx
│       │   │   │   │   └── [id]/page.tsx
│       │   │   │   └── orders/
│       │   │   │       └── page.tsx
│       │   │   ├── inventory/
│       │   │   │   ├── page.tsx        ← Stock dashboard
│       │   │   │   ├── warehouses/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── transfers/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── audit-log/
│       │   │   │       └── page.tsx
│       │   │   ├── accounting/
│       │   │   │   ├── page.tsx        ← Payment tracker
│       │   │   │   ├── approvals/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── documents/
│       │   │   │       └── page.tsx
│       │   │   └── reports/
│       │   │       ├── page.tsx        ← Report index
│       │   │       ├── cash-flow/
│       │   │       │   └── page.tsx
│       │   │       ├── forecasting/
│       │   │       │   └── page.tsx
│       │   │       └── performance/
│       │   │           └── page.tsx
│       │   └── unauthorized/
│       │       └── page.tsx
│       ├── components/
│       │   ├── layout/
│       │   │   ├── sidebar.tsx         ← Role-aware nav links
│       │   │   ├── topbar.tsx          ← Role switcher lives here (mockup only)
│       │   │   └── role-gate.tsx       ← Client component for conditional rendering
│       │   ├── management/
│       │   ├── sales/
│       │   ├── inventory/
│       │   ├── accounting/
│       │   └── reports/
│       ├── lib/
│       │   ├── mock-data.ts            ← Re-exports from @furnitrack/db/mock
│       │   └── role-context.tsx        ← React context + hook for demo role state
│       ├── middleware.ts               ← Will enforce real RBAC post-mockup; stub for now
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       └── package.json
│
├── packages/
│   ├── ui/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── data-table.tsx
│   │   │   │   ├── stat-card.tsx       ← KPI/metric display primitive
│   │   │   │   ├── form/
│   │   │   │   └── chart-wrapper.tsx   ← Recharts thin wrapper
│   │   │   ├── tokens/
│   │   │   │   └── colors.ts           ← Design token exports
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── validators/
│   │   ├── src/
│   │   │   ├── product.ts
│   │   │   ├── order.ts
│   │   │   ├── inventory.ts
│   │   │   ├── lead.ts
│   │   │   ├── payment.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── db/
│   │   ├── prisma/
│   │   │   └── schema.prisma           ← Schema defined but NOT connected in MVP
│   │   ├── src/
│   │   │   ├── mock/                   ← All mock data fixtures (MVP phase only)
│   │   │   │   ├── products.ts
│   │   │   │   ├── orders.ts
│   │   │   │   ├── stock.ts
│   │   │   │   ├── leads.ts
│   │   │   │   ├── payments.ts
│   │   │   │   ├── users.ts            ← 5 demo accounts (one per role)
│   │   │   │   └── index.ts
│   │   │   └── index.ts                ← In MVP: re-exports mock only. Later: PrismaClient
│   │   └── package.json
│   │
│   └── config/
│       ├── typescript/
│       │   └── base.json
│       ├── eslint/
│       │   └── base.mjs
│       └── tailwind/
│           └── base.ts                 ← Shared Tailwind v4 tokens and presets
│
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

### Structure Rationale

- **Route groups `(catalog)`, `(checkout)`, `(account)` in storefront:** Groups related pages under a shared layout without adding segments to the URL. `/products` stays `/products`, not `/catalog/products`.
- **Route group `(auth)` in admin:** Isolates the login page under a centered, no-sidebar layout. The `(dashboard)` group wraps all authenticated pages under the sidebar shell.
- **Role subdirectories under `(dashboard)`:** Each role (`management/`, `sales/`, etc.) is a separate directory. This maps directly to the RBAC route-guard patterns in middleware and makes "which pages belong to which role" immediately legible from directory structure.
- **`packages/db/src/mock/`:** Centralizing mock data in the `db` package means both apps import from one source of truth (`@furnitrack/db/mock`). When real Prisma integration arrives in the next milestone, the mock exports are replaced without changing import paths in apps.
- **App-local `components/` per role:** Admin role-specific components (e.g. `components/inventory/`) stay inside `apps/admin`, not in `packages/ui`. Shared primitives (Button, Card, DataTable) go in `packages/ui`. This keeps the shared package domain-agnostic.

---

## Architectural Patterns

### Pattern 1: Nested Layout Shells (App Router)

**What:** Each route group in `apps/admin/(dashboard)/` has a `layout.tsx` that wraps its children. The `(dashboard)/layout.tsx` renders the sidebar + topbar shell. Individual role subdirectories can optionally override with a nested layout (e.g. management gets a mobile-optimized layout).

**When to use:** Whenever two or more pages share chrome (nav, header, sidebar) that a sibling group does not.

**Trade-offs:** Layout nesting is powerful but errors compound — a misplaced `layout.tsx` can apply chrome to pages that shouldn't have it. Keep the layout tree shallow (max 2 levels deep for MVP).

```typescript
// apps/admin/app/(dashboard)/layout.tsx
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
```

---

### Pattern 2: Role Context for Demo Role-Switching (MVP Only)

**What:** A React Context stored in a client component provides the "active demo role" across the admin app. A role-switcher dropdown in the Topbar updates this context. The Sidebar reads the active role to render only the permitted nav links. This replaces real Auth.js sessions for the mockup phase.

**When to use:** Mockup phase only. This pattern is explicitly removed when real auth is wired in the next milestone.

**Trade-offs:** Simple to implement, zero auth complexity. The downside is it provides no real security — but that is the correct trade-off for a UI mockup. Do not let this pattern survive into the backend milestone.

```typescript
// apps/admin/lib/role-context.tsx
"use client"
import { createContext, useContext, useState } from "react"

type Role = "MANAGEMENT" | "SALES" | "ACCOUNTING" | "INVENTORY" | "ADMIN"

const RoleContext = createContext<{
  role: Role
  setRole: (r: Role) => void
}>({ role: "MANAGEMENT", setRole: () => {} })

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("MANAGEMENT")
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export const useRole = () => useContext(RoleContext)
```

```typescript
// apps/admin/components/layout/sidebar.tsx
"use client"
import { useRole } from "@/lib/role-context"

const NAV_BY_ROLE: Record<string, { href: string; label: string }[]> = {
  MANAGEMENT: [
    { href: "/management", label: "Dashboard" },
    { href: "/reports", label: "Reports" },
  ],
  SALES: [
    { href: "/sales", label: "Leads & Quotes" },
    { href: "/sales/orders", label: "Orders" },
  ],
  INVENTORY: [
    { href: "/inventory", label: "Stock Dashboard" },
    { href: "/inventory/transfers", label: "Transfers" },
    { href: "/inventory/audit-log", label: "Audit Log" },
  ],
  ACCOUNTING: [
    { href: "/accounting", label: "Payments" },
    { href: "/accounting/approvals", label: "Approvals" },
    { href: "/accounting/documents", label: "Documents" },
  ],
  ADMIN: [
    // All links from all roles
  ],
}

export function Sidebar() {
  const { role } = useRole()
  const links = NAV_BY_ROLE[role] ?? []
  // render links...
}
```

---

### Pattern 3: Centralized Mock Data in `packages/db/src/mock/`

**What:** All fixture data is defined as typed TypeScript objects in `packages/db/src/mock/`. Each fixture file (products, orders, stock, users, etc.) exports typed arrays that match the Prisma schema types. Both apps import from `@furnitrack/db/mock`. The `packages/db/src/index.ts` barrel re-exports mock during MVP, and will be swapped for real PrismaClient in the next milestone.

**When to use:** Any screen that needs to display realistic data. Every page in the mockup imports from this layer — never hardcodes data inline in components.

**Trade-offs:** One source of truth for fixtures means any screen change (e.g. adding a new product field) requires only one edit. The cost is that both apps are coupled to the `db` package shape — which is also the production schema, so this is appropriate coupling.

```typescript
// packages/db/src/mock/users.ts
import type { User } from "../types"

export const DEMO_USERS: User[] = [
  {
    id: "user-mgmt-1",
    name: "Karen Alonzo",
    email: "karen@furnitrack.test",
    role: "MANAGEMENT",
    branchId: "branch-main",
  },
  {
    id: "user-sales-1",
    name: "Genie Rose Gonzales",
    email: "genie@furnitrack.test",
    role: "SALES",
    branchId: "branch-main",
  },
  {
    id: "user-acct-1",
    name: "Accounting User",
    email: "accounting@furnitrack.test",
    role: "ACCOUNTING",
    branchId: "branch-main",
  },
  {
    id: "user-inv-1",
    name: "Inventory Head",
    email: "inventory@furnitrack.test",
    role: "INVENTORY",
    branchId: "branch-main",
  },
  {
    id: "user-admin-1",
    name: "Admin",
    email: "admin@furnitrack.test",
    role: "ADMIN",
    branchId: "branch-main",
  },
]
```

```typescript
// packages/db/src/index.ts  (MVP phase)
export * from "./mock"
export type * from "./types"
// NOTE: PrismaClient intentionally NOT exported here during MVP.
// Replace this file contents in the next milestone.
```

---

### Pattern 4: `packages/ui` — shadcn/ui Wrapper Layer

**What:** shadcn/ui components are installed into `packages/ui/src/components/` (not directly into each app). Both apps import `@furnitrack/ui`. This gives one place to customize component variants, add design tokens, and ensure visual consistency.

**When to use:** Any reusable, domain-agnostic component: Button, Card, Badge, DataTable, Dialog, Form fields, StatCard, ChartWrapper.

**Trade-offs:** Requires `transpilePackages: ['@furnitrack/ui']` in each app's `next.config.ts` since the package ships JSX. This is already specified in the planning doc. The risk is over-abstracting — only move a component to `packages/ui` if it genuinely appears in both apps or across multiple pages. Role-specific UI (e.g. the QuotationBuilder form) stays in the app.

---

## Data Flow

### Mockup Phase Data Flow (MVP)

```
Page Component (Server Component)
    ↓ import
@furnitrack/db/mock (static TypeScript objects)
    ↓ pass as props
Client Components (charts, tables, forms)
    ↓ user interaction
Local React state / Zustand (cart, UI state)
    ← No network round-trips in mockup phase
```

### Post-MVP Data Flow (Next Milestone Reference)

```
User Action
    ↓
Client Component → React Query mutation
    ↓
Next.js Route Handler (app/api/...)
    ↓
@furnitrack/validators (Zod parse)
    ↓
@furnitrack/db (PrismaClient)
    ↓
PostgreSQL
    ↑ typed response
React Query cache invalidation → re-render
```

### Role-Switching Flow (Mockup)

```
User clicks role in Topbar dropdown
    ↓
RoleContext.setRole(newRole)
    ↓
Sidebar re-renders with new NAV_BY_ROLE[role] links
    ↓
User navigates to a role-gated route
    ↓ (no real middleware check in mockup)
Page renders with mock data for that role's view
```

---

## Suggested Build Order

The dependency graph determines what must exist before something else can be built. Build bottom-up: shared packages first, then apps.

### Layer 0 — Monorepo Scaffold (before any app code)

1. `pnpm-workspace.yaml` + root `package.json` with Turborepo
2. `turbo.json` with task pipeline (`build`, `dev`, `lint`, `typecheck`)
3. `packages/config` — TS base config, ESLint flat config, Tailwind base config
4. Verify: `turbo run typecheck` from root completes without error

**Why first:** Every other package extends from `packages/config`. Nothing else can be correctly typed or linted until this exists.

### Layer 1 — Shared Packages (parallel, no interdependency)

5. `packages/validators` — Zod schemas for Product, Order, Lead, Inventory, Payment
6. `packages/db` — Prisma schema (not connected) + mock data fixtures for all entities
7. `packages/ui` — Install shadcn/ui, build StatCard, DataTable, ChartWrapper, form primitives

**Why second:** Both apps depend on all three. Mock data must exist before any page can render realistic content. Validators must exist before forms can be validated.

### Layer 2 — App Scaffolds (parallel)

8. `apps/admin` scaffold — route group structure, RoleProvider, sidebar shell, topbar with role switcher
9. `apps/storefront` scaffold — layout, (catalog)/(checkout)/(account) route groups, nav/footer

**Why third:** The structural shells must exist before individual page screens can be built into them.

### Layer 3 — Admin Role Pages (sequential by dependency)

10. **Management dashboard** — KPI cards, inventory health tiles (uses StatCard from `packages/ui`, stock mock data)
11. **Sales pages** — leads list, quotation builder, order list (uses Lead + Order mock data)
12. **Inventory pages** — stock dashboard, warehouse toggle, transfer module, audit log (uses Stock mock data)
13. **Accounting pages** — payment tracker, approvals, document buttons (uses Payment + Order mock data)
14. **Reports pages** — cash flow, forecasting charts, performance (uses Recharts + all mock data)

**Why this order:** Management dashboard is the simplest (read-only KPI display) and validates the shared layout shell works. Sales comes next because it has the most complex interaction flows (quotation builder). Inventory and Accounting can proceed in parallel after Sales. Reports last because they consume data from all other domains and are purely read-only.

### Layer 4 — Storefront Pages

15. Product catalog + product detail page
16. Cart + checkout flow (no payment, quotation request form)
17. Account order history + quotes list

**Why parallel with Layer 3:** Storefront has zero dependency on admin pages. Both can be built simultaneously by different work tracks after the scaffolds exist.

---

## Anti-Patterns

### Anti-Pattern 1: Cross-App Imports

**What people do:** Import a component from `apps/admin/components/` into `apps/storefront/` (or vice versa) because it looks useful.

**Why it's wrong:** Apps are independent deployables. Cross-app imports create hidden coupling that breaks Turborepo's build graph and makes independent deployment impossible.

**Do this instead:** If a component is genuinely needed in both apps, move it to `packages/ui`. If it only belongs in one app, keep it there.

---

### Anti-Pattern 2: Hardcoding Mock Data Inline in Page Components

**What people do:** Define a `const products = [{ id: 1, name: "Sofa"... }]` directly inside a page component file for speed during prototyping.

**Why it's wrong:** When 15 pages each have their own inline fixtures, updating a product's shape (e.g. adding `variantId`) requires touching 15 files. It also makes the transition to real data in the next milestone significantly harder.

**Do this instead:** All fixtures live in `packages/db/src/mock/`. Pages import `import { MOCK_PRODUCTS } from "@furnitrack/db/mock"`. One source, one edit point.

---

### Anti-Pattern 3: Putting Role Logic in `packages/ui`

**What people do:** Add role-checking logic (`if (role === 'ADMIN')`) inside a shared UI component to conditionally render things.

**Why it's wrong:** `packages/ui` is a domain-agnostic presentational layer. Injecting role awareness makes it impossible to reuse components without also threading role context into every consumer.

**Do this instead:** Role-aware rendering belongs in `apps/admin/components/layout/role-gate.tsx` or in the page component itself. Pass only display data to `packages/ui` components.

---

### Anti-Pattern 4: Skipping the `(dashboard)` Route Group Layout

**What people do:** Build a flat route structure (`app/management/page.tsx`, `app/sales/page.tsx`) and render the sidebar directly inside each page to avoid learning route groups.

**Why it's wrong:** Each page re-instantiates the sidebar. This causes sidebar remounts on navigation (breaking animation state, triggering flashes) and duplicates ~30 lines of chrome markup across every page.

**Do this instead:** Use `app/(dashboard)/layout.tsx` as the single sidebar shell. All role pages are children. The layout renders once and persists across navigations within the group.

---

### Anti-Pattern 5: RoleContext Surviving into the Backend Milestone

**What people do:** Leave the demo `RoleContext` role-switcher in place when starting backend integration because "it's already working."

**Why it's wrong:** The mockup role switcher bypasses all middleware security. Leaving it in place means the app has the appearance of auth but none of the enforcement. Real users could manually switch to any role.

**Do this instead:** When beginning the backend milestone, the RoleProvider and role-switcher Topbar dropdown are the first things removed. They are replaced by Auth.js sessions + the `middleware.ts` RBAC guards defined in the planning doc.

---

## Integration Points

### Internal Package Boundaries

| Boundary | Communication | Rule |
|----------|---------------|------|
| `apps/*` → `packages/ui` | Direct import via workspace alias (`@furnitrack/ui`) | Presentational only — no business logic in `packages/ui` |
| `apps/*` → `packages/validators` | Direct import (`@furnitrack/validators`) | Used in form `resolver=` and (later) API route handlers |
| `apps/*` → `packages/db` | Direct import (`@furnitrack/db/mock` in MVP) | MVP: mock data only. Post-MVP: PrismaClient singleton |
| `apps/*` → `packages/config` | `extends` in tsconfig.json and eslint.config.mjs | Never a runtime import — config only |
| `packages/ui` → `packages/validators` | Not permitted | UI layer must not know about data schemas |
| `packages/db` → `packages/validators` | Permitted (schema types can inform Zod shapes) | Zod schemas should mirror Prisma model shapes |

### App-to-App Boundary

| Apps | Communication | Rule |
|------|---------------|------|
| `storefront` ↔ `admin` | Zero direct imports | Any shared need must go through `packages/*`. Never import across app boundaries. |

### Tailwind v4 Cross-Package Token Sharing

Both apps extend from `packages/config/tailwind/base.ts` which defines the shared color tokens, typography scale, and spacing. This ensures the storefront (public brand colors) and admin (neutral dashboard palette) stay visually coherent while allowing each app to extend with its own overrides via `tailwind.config.ts`.

---

## Scalability Considerations (Post-MVP Reference)

| Scale | Architecture Note |
|-------|-------------------|
| MVP (mockup, 0 real users) | Static mock data, no DB, no auth sessions — intentional |
| Phase 2 (backend, internal team ~10 users) | PrismaClient singleton in `packages/db`, Auth.js JWT sessions, Neon PostgreSQL |
| Phase 3 (storefront launch, ~1K users) | React Query caching on product catalog, ISR for product detail pages, CDN for images |
| Phase 4 (growth, ~10K users) | Connection pooling via PgBouncer or Neon's built-in pooling, Redis for session cache if Auth.js JWT proves insufficient |

The monorepo structure does not need to change at any of these scales. The packages layer absorbs DB/auth changes; apps only update their import targets.

---

## Sources

- Project planning document: `docs/planning/2026-03-06-furnitrack-planning.md` (HIGH confidence — project-specific design decisions)
- PROJECT.md: `.planning/PROJECT.md` (HIGH confidence — confirmed requirements and constraints)
- Next.js App Router route groups: Established pattern from Next.js 13+ documentation (HIGH confidence — training data, stable API)
- Turborepo `transpilePackages` pattern: Required for JSX packages in Next.js monorepos (HIGH confidence — training data, confirmed in planning doc)
- shadcn/ui monorepo installation pattern: Documented in shadcn/ui official docs (MEDIUM confidence — training data, verify exact CLI flags at install time)
- Web search unavailable during this research session — all findings derived from project planning documents and training knowledge

---

*Architecture research for: FurniTrack — Next.js 16 pnpm monorepo, UI mockup phase*
*Researched: 2026-03-06*
