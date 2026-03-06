# Stack Research

**Domain:** Next.js pnpm monorepo — E-commerce storefront + ERP-style admin dashboard (UI mockup milestone)
**Researched:** 2026-03-06
**Confidence:** HIGH — versions sourced from planning doc verified via Context7 MCP on 2026-03-06; web search unavailable at research time, flagged where training data supplements.

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `next` | `^16.1.x` | App framework for both `apps/storefront` and `apps/admin` | App Router is the current standard. Turbopack replaces Webpack for dev speed. Server Components let you fetch mock data on the server without client waterfalls. Two Next.js apps in one monorepo is the current Vercel-blessed pattern. |
| `react` | `^19.x` | UI runtime | React 19 is stable as of early 2025. Concurrent features (useTransition, Suspense boundaries) are load-bearing for the dashboard's async skeleton patterns even with mock data. |
| `react-dom` | `^19.x` | DOM rendering | Required peer dependency of React 19. Always pin to the same major as `react`. |
| `typescript` | `^5.x` | Type safety across all packages | TypeScript 5.x is required for `satisfies`, const type parameters, and decorator metadata — all of which shadcn/ui and Zod 3 leverage. Non-negotiable in a monorepo where types must flow across package boundaries. |
| `tailwindcss` | `^4.x` | Utility-first CSS | Tailwind v4 uses a CSS-first config (`@import "tailwindcss"`) rather than `tailwind.config.js`. This changes how the shared config package works — see Monorepo Package Patterns below. Design tokens are defined in CSS custom properties, which lets `packages/config/tailwind/` export a base CSS file rather than a JS config object. |
| `pnpm` | `^9.x` | Package manager | pnpm workspaces are the standard for Next.js monorepos. Symlink-based `node_modules` means packages like `@furnitrack/ui` resolve correctly in both apps without hoisting conflicts. npm and yarn workspaces both have known issues with Turborepo's cache invalidation at this scale. |
| `turbo` | `^2.x` | Build orchestration | Turbo 2.x introduced a stable remote caching API and simplified `turbo.json` task syntax. `"dependsOn": ["^build"]` ensures `packages/ui` builds before `apps/admin` consumes it. Essential for a 2-app + 4-package monorepo to avoid stale build artifacts. |

---

### UI Component Layer

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `shadcn/ui` | `latest` (CLI-based, not a versioned npm package) | Accessible component primitives | shadcn/ui is not a dependency — it is a code generator. Running `npx shadcn@latest add button` copies component source into your repo. This means: (a) no version lock-in, (b) full control to extend for brand tokens, (c) components are already written against Tailwind v4 in the latest CLI. For this milestone, install components into `packages/ui/src/components/` and re-export them. |
| `lucide-react` | `^0.4x` | Icon library | shadcn/ui uses Lucide as its default icon set. All admin dashboard icons (alerts, warehouses, invoices, charts) are available. Lucide is tree-shakeable — only imported icons are bundled. |
| `recharts` | `^2.x` | Chart components for reporting screens | Used in: Management KPI trends, Forecasting charts, Cash Flow Statement, Performance Reports. Recharts is built on SVG + React, no canvas, which means it renders correctly in SSR/RSC contexts. For the UI mockup, feed it hardcoded mock datasets. The `^2.x` branch is stable and has full TypeScript types. |

---

### Forms and Validation (Shared Logic)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `react-hook-form` | `^7.x` | Form state management | Used in: Quotation Builder, Lead Intake, Payment Tracker, Stock Adjustment, Checkout. RHF is uncontrolled by default — no re-render on each keystroke — which is critical for the Quotation Builder with 10+ line items. |
| `zod` | `^3.x` | Schema validation | Defined in `packages/validators/` and shared between both apps. For the UI mockup, Zod schemas serve as the canonical shape of mock data objects. When backend is added in Milestone 2, the same schemas validate API inputs — no duplication. |
| `@hookform/resolvers` | `^3.x` | Zod ↔ RHF bridge | Connects a Zod schema to an RHF `useForm` call in one line: `resolver: zodResolver(mySchema)`. Required to get field-level validation errors from Zod into RHF's error state. |

---

### State Management

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `zustand` | `^4.x` | Client-side state (cart, role switcher, UI state) | For the UI mockup, Zustand is the mock backend. The cart store, the active role store (for simulating role switching), and the notification count all live here. Zustand stores are plain functions — no Provider wrapping required, which avoids React tree pollution in a monorepo where both apps might share store logic via `packages/`. |
| `@tanstack/react-query` | `^5.x` | Server state / async data | Even with mock data, use React Query to structure all data fetching. Define query functions that return mock fixtures. When real API routes exist in Milestone 2, swap the query function implementation — the component code changes nothing. This avoids a rewrite of every data-fetching component between milestones. |

---

### Mock Data Strategy

This milestone has no backend. The following three-layer approach is the correct pattern:

**Layer 1: Fixture files (primary source of truth for mock data)**

Location: `packages/mock-data/src/` (new shared package, see Monorepo Package Patterns)

Structure:
```
packages/mock-data/src/
  products.ts        ← 20-30 furniture items with variants, prices, stock counts
  customers.ts       ← 15-20 customer/lead records
  orders.ts          ← 10-15 orders in various statuses
  quotations.ts      ← 8-10 quotations
  stock.ts           ← Per-warehouse stock levels for 3 branches
  payments.ts        ← Payment records tied to orders
  users.ts           ← Role-specific user accounts (one per role)
  kpi.ts             ← Hardcoded KPI numbers for Management dashboard
  reports.ts         ← Hardcoded chart data for Reporting screens
```

These are typed against the Zod schemas in `packages/validators/`. Every mock object satisfies its validator schema. This is the enforcement mechanism — if you add a required field to a Zod schema, TypeScript will error in the fixture file immediately.

**Layer 2: React Query query functions wrapping fixtures**

```typescript
// apps/admin/lib/queries/stock.ts
import { getStockByWarehouse } from "@furnitrack/mock-data"

export const stockQueries = {
  byWarehouse: (warehouseId: string) => queryOptions({
    queryKey: ["stock", warehouseId],
    queryFn: () => Promise.resolve(getStockByWarehouse(warehouseId)),
  })
}
```

Components call `useQuery(stockQueries.byWarehouse(id))` — identical to how they will call the real API in Milestone 2.

**Layer 3: Zustand for mutable UI state**

The Role Switcher (demo navigation between admin roles) is a Zustand store:

```typescript
// packages/mock-data/src/stores/role-store.ts
type Role = "MANAGEMENT" | "SALES" | "ACCOUNTING" | "INVENTORY" | "ADMIN"
const useRoleStore = create<{ role: Role; setRole: (r: Role) => void }>(set => ({
  role: "MANAGEMENT",
  setRole: role => set({ role }),
}))
```

**Do NOT use:**
- `@faker-js/faker` for this milestone. Faker generates random data on each render — charts change every refresh, IDs don't match across tables, and the storefront shows different products depending on when you load. Furniture ERP screens require *relational consistency*: a stock movement must reference a real warehouse ID, a quotation line item must reference a real product SKU. Hardcoded fixtures provide this. Faker is appropriate for seeding test databases in Milestone 2, not for a UI mockup.
- MSW (Mock Service Worker) for this milestone. MSW is excellent for API mocking but adds a service worker registration step, a `msw/browser` vs `msw/node` split, and handler maintenance overhead. The React Query + fixture approach achieves the same result with less setup. MSW becomes appropriate in Milestone 2 when you want to test real fetch calls without a live database.

---

### Developer Tooling

| Tool | Version | Purpose | Notes |
|------|---------|---------|-------|
| `eslint` | `^9.x` | Linting | ESLint 9 uses flat config (`eslint.config.js`). The `packages/config/eslint/` package exports a base flat config object that both apps extend. Flat config is NOT backward-compatible with `.eslintrc` — don't mix formats. |
| `eslint-config-next` | `^16.x` | Next.js ESLint rules | Pin this to match the `next` version. Includes rules for App Router (no `<a>` instead of `<Link>`, no `useRouter` in Server Components, etc.). |
| `prettier` | `^3.x` | Code formatting | Configure once in root `prettier.config.js`. Tailwind v4 users should add `prettier-plugin-tailwindcss` — it sorts utility classes automatically, which prevents merge conflicts in component files. |
| `husky` | `^9.x` | Git hooks | Run `lint-staged` on pre-commit. Prevents broken or unformatted code from entering the repo. |
| `lint-staged` | `^15.x` | Pre-commit linting | Run ESLint + Prettier only on staged files, not the whole codebase. Critical in a monorepo where a full lint run can take 30+ seconds. |

---

## Monorepo Package Patterns

The 2-app monorepo requires these shared packages. Each is a separate `package.json` with its own build step (or no build step for pure-TS packages that use `transpilePackages` in Next.js).

### `packages/ui` — Shared Component Library

**Pattern:** No build step. Both `apps/` use `transpilePackages: ['@furnitrack/ui']` in `next.config.ts` so Next.js compiles it directly.

```
packages/ui/
  src/
    components/
      Button.tsx       ← shadcn/ui Button, re-exported
      DataTable.tsx    ← shadcn/ui Table + TanStack Table, re-exported
      StatsCard.tsx    ← KPI card for Management dashboard
      RoleBadge.tsx    ← Pill showing current role
      ...
    index.ts           ← barrel export of all components
  package.json
    { "name": "@furnitrack/ui", "exports": { ".": "./src/index.ts" } }
```

**What goes in `packages/ui`:** Components used by more than one app. The storefront and admin both use `Button`, `Badge`, `Input`. Role-specific components (e.g. `QuotationBuilder`) stay in `apps/admin/components/`.

**What does NOT go in `packages/ui`:** App-specific layout shells, page-level components, anything with `useRouter` from `next/navigation` (it would couple the package to Next.js in a way that breaks if the package is ever consumed outside Next.js).

### `packages/validators` — Shared Zod Schemas

**Pattern:** No build step. Consumed via `transpilePackages`.

```
packages/validators/src/
  product.ts     ← ProductSchema, ProductVariantSchema
  order.ts       ← OrderSchema, QuotationSchema, LineItemSchema
  inventory.ts   ← StockItemSchema, StockMovementSchema, TransferSchema
  user.ts        ← UserSchema, RoleEnum
  index.ts       ← re-exports all schemas
```

These schemas are the single source of truth for data shapes in Milestone 1. In Milestone 2 they become the Zod validators for API route handlers and the Prisma type guards.

### `packages/mock-data` — Fixture Data (UI Mockup Milestone Only)

**Pattern:** No build step. Consumed only by apps during the UI mockup milestone. Removed or replaced in Milestone 2 when real API calls are wired in.

**Critical constraint:** Every fixture must satisfy its corresponding `packages/validators` schema. Enforce at the TypeScript level:

```typescript
import { ProductSchema } from "@furnitrack/validators"
import type { z } from "zod"

export const products: z.infer<typeof ProductSchema>[] = [
  { id: "prod-001", sku: "CHR-OAK-001", name: "Ariston Oak Dining Chair", ... },
  ...
]
```

### `packages/config` — Shared Tool Configurations

```
packages/config/
  typescript/
    base.json          ← tsconfig base (strict: true, paths, etc.)
    nextjs.json        ← extends base, adds Next.js-specific settings
  eslint/
    base.js            ← flat config base for all packages
    nextjs.js          ← extends base with eslint-config-next
  tailwind/
    base.css           ← @import "tailwindcss"; + CSS custom property tokens
                          (Tailwind v4 has NO tailwind.config.js)
```

**Tailwind v4 monorepo note (MEDIUM confidence — training data, web search unavailable):** Tailwind v4 moves all config into CSS. The shared `base.css` in `packages/config/tailwind/` defines the design token custom properties (colors, spacing scale, font families). Each app's global CSS file does `@import "../../packages/config/tailwind/base.css"`. There is no `content` array to configure — Tailwind v4 auto-detects files via the PostCSS plugin. Verify this against official Tailwind v4 docs before implementing.

---

## Installation

```bash
# Root (monorepo tooling)
pnpm add -D turbo -w
pnpm add -D typescript -w

# apps/storefront and apps/admin (run in each app)
pnpm add next@^16.1 react@^19 react-dom@^19
pnpm add tailwindcss@^4
pnpm add lucide-react@^0.4 recharts@^2
pnpm add react-hook-form@^7 zod@^3 @hookform/resolvers@^3
pnpm add zustand@^4 @tanstack/react-query@^5

# Dev tooling (workspace root)
pnpm add -D eslint@^9 eslint-config-next@^16 prettier@^3 -w
pnpm add -D husky@^9 lint-staged@^15 -w
pnpm add -D prettier-plugin-tailwindcss -w

# shadcn/ui (run in each app directory — not installable from workspace root)
cd apps/admin && npx shadcn@latest init
cd apps/storefront && npx shadcn@latest init
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| `zustand ^4` for role switcher | React Context + useState | Context is fine for a single-level role switch. Zustand is preferred because it avoids Provider nesting and the same store can be shared across the `packages/` boundary without re-wiring context at each app root. |
| Hardcoded fixtures in `packages/mock-data` | `@faker-js/faker` | Use Faker in Milestone 2 for database seeding scripts (`prisma/seed.ts`). Not for UI rendering — see Mock Data Strategy above. |
| `@tanstack/react-query ^5` even for mock data | Direct `useState` + `useEffect` in components | Direct data fetching works for a mockup but creates a rewrite obligation in Milestone 2. React Query with fixture-backed query functions is the same amount of code and survives the milestone transition unchanged. |
| `recharts ^2` | `chart.js` / `react-chartjs-2` | Chart.js uses canvas, which requires `document` to be available — problematic in SSR. Recharts is SVG + React, renders on the server, no canvas issues. |
| pnpm workspaces | npm/yarn workspaces | npm/yarn workspaces have known cache invalidation issues with Turborepo. pnpm's strict symlink isolation also prevents phantom dependency bugs where `apps/admin` accidentally imports a package it didn't declare. |
| shadcn/ui (code-gen approach) | Radix UI primitives directly | Use Radix directly if the design team has a fully custom component system and doesn't want any shadcn/ui styling opinions. For this project, the planning doc specifies shadcn/ui — the default styling is appropriate for an internal ERP dashboard. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `@faker-js/faker` in UI components | Generates random data on each render. Charts change every refresh. Relational IDs (product → stock → movement) break across table views. ERP screens require deterministic, consistent data. | Typed fixture files in `packages/mock-data` |
| MSW (Mock Service Worker) for this milestone | Adds service worker boilerplate, a `public/mockServiceWorker.js` file, and dual `browser`/`node` handler exports — all complexity with no benefit when React Query can return fixtures directly. | React Query `queryFn` returning `Promise.resolve(fixture)` |
| `tailwind.config.js` (v3 pattern) | Tailwind v4 does not use a JS config file. Creating one will silently be ignored or conflict with the PostCSS plugin. | CSS custom properties in `packages/config/tailwind/base.css` |
| `pages/` directory in any app | Both apps use App Router (`app/`). Mixing Pages Router into an App Router project creates routing conflicts and disables some Server Component features. | `app/` directory only |
| Prisma, `@prisma/client`, PostgreSQL | These are Milestone 2 dependencies. Installing them in the UI mockup milestone creates environment setup friction (requires a running Postgres instance) with zero benefit. | Mock data fixtures |
| `next-auth` / `@auth/prisma-adapter` | Same as above — Milestone 2 only. For the UI mockup, role switching is a Zustand store, not a real session. | Zustand `useRoleStore` for role simulation |
| Global CSS overrides fighting Tailwind | Tailwind v4 generates CSS custom properties for all tokens. Writing manual `color: red` overrides outside the Tailwind token system creates a maintenance split that makes the design system inconsistent. | Use `[--color-primary:...]` CSS variable overrides inside the Tailwind layer |

---

## Stack Patterns by Variant

**For the storefront app (`apps/storefront`):**
- Use static rendering (`generateStaticParams`) for product detail pages — the content is mock data, no dynamic server needs
- The cart is entirely client-side Zustand — no server component involvement
- Quotation request form is the only form — one RHF + Zod form, posts to a mock handler that updates Zustand

**For the admin app (`apps/admin`):**
- Role switching: A persistent `<RoleSwitcher />` in the admin layout toolbar reads from `useRoleStore`. It conditionally renders or hides nav items and page content based on the active role. No real auth — no login page needed for this milestone.
- Data tables: All inventory, sales, and payment screens are data tables. Use `@tanstack/react-table` (included in shadcn/ui's DataTable recipe) for sorting, filtering, and pagination against the in-memory fixture arrays.
- Charts: All Recharts charts receive their data as props from React Query — components are fully dumb about the data source.

**For shared packages:**
- TypeScript path aliases: Each package's `tsconfig.json` extends `packages/config/typescript/base.json`. Each app's `tsconfig.json` adds `paths` aliases for its own `@/` prefix pointing to `./src/`.
- No circular dependencies: `packages/ui` can import from `packages/validators` (to type component props). `packages/validators` cannot import from `packages/ui`. Apps can import from any package. Packages cannot import from apps.

---

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `next ^16.1.x` | `react ^19.x` | Next.js 16 requires React 19. Do not use React 18 — the App Router's Server Component streaming depends on React 19 concurrent features. |
| `tailwindcss ^4.x` | `shadcn/ui latest CLI` | shadcn/ui's CLI updated to generate Tailwind v4-compatible components in its latest release. Running `npx shadcn@latest init` will detect v4 and configure appropriately. Do NOT use `shadcn-ui` (the old package name) — it targets Tailwind v3. |
| `@tanstack/react-query ^5.x` | `next ^16.x` | TanStack Query v5 ships a `ReactQueryStreamedHydration` utility for Next.js App Router. Not needed for this milestone (no SSR data fetching), but compatibility is confirmed. |
| `react-hook-form ^7.x` | `react ^19.x` | RHF 7.x supports React 19. The `useFormState` hook from React 19 conflicts with RHF's own state — use RHF's state exclusively, do not mix with React 19 form actions in the same form. |
| `recharts ^2.x` | `react ^19.x` | Recharts 2.x is compatible with React 19. Note: Recharts 3.x is in progress but not stable as of early 2026 — stay on `^2.x`. (MEDIUM confidence — training data) |
| `eslint ^9.x` | `eslint-config-next ^16.x` | ESLint 9 uses flat config. `eslint-config-next` v16 supports flat config. Do not install `@eslint/eslintrc` compatibility shims — they will conflict with the Next.js flat config export. |
| `pnpm ^9.x` | `turbo ^2.x` | pnpm 9 + Turbo 2 is the current Vercel-recommended pairing. Turbo 2's cache key computation is aware of pnpm lockfile format v9. |

---

## Sources

- `docs/planning/2026-03-06-furnitrack-planning.md` — All version numbers (verified via Context7 MCP, 2026-03-06) — HIGH confidence
- `.planning/PROJECT.md` — Milestone scope, out-of-scope items (no auth, no DB for MVP) — HIGH confidence
- Training data (knowledge cutoff Jan 2025) — Mock data strategy, Tailwind v4 CSS config approach, shadcn/ui CLI behavior, Recharts SSR compatibility — MEDIUM confidence where noted
- Web search unavailable at research time — items marked MEDIUM confidence should be verified against official docs before implementation begins

---

*Stack research for: FurniTrack — Next.js 16 pnpm monorepo, UI mockup milestone*
*Researched: 2026-03-06*
