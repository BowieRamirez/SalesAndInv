# Phase 1: Monorepo Foundation - Research

**Researched:** 2026-03-06
**Domain:** pnpm workspaces + Turborepo + Next.js 16 monorepo; Tailwind v4 + shadcn/ui design system; Zod v3 schemas; Prisma v6 schema-only mode
**Confidence:** MEDIUM-HIGH — All findings sourced from project's own pre-existing STACK.md and ARCHITECTURE.md (verified via Context7 MCP on 2026-03-06). Web search and WebFetch are unavailable in this environment. Tailwind v4 / shadcn compatibility section is explicitly MEDIUM until the smoke-test protocol in CONTEXT.md resolves it.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Mock Data Depth — Products:**
- 10–12 products total, covering 6 categories (Living Room, Bedroom, Dining, Office, Storage, Lighting)
- Required fields per product: `id, slug, name, category, material, price, originalPrice (nullable), badge (BEST_SELLER | SALE | HOT | null), stockStatus (IN_STOCK | LOW_STOCK | OUT_OF_STOCK), colorVariants: [{ name, hex }], images: string[], rating, reviewCount, description, dimensions: { width, depth, height, weight }`
- No `qty_available` / `qty_reserved` / `qty_in_production` at product level — those belong to warehouse stock fixtures in Phase 5. Product carries `stockStatus` enum only.

**Mock Data Depth — Non-product entities:**
| Entity | Count | Notes |
|--------|-------|-------|
| leads | 5–8 | Spread across CRM stages (New/Quoted/Negotiating/Confirmed/Closed) |
| quotations | 5–8 | Mix of statuses (Draft/Sent/In Review/Confirmed/Rejected) |
| orders | 3–5 | Referenced by quotations for lineage display |
| payments | 3–5 | Down Payment / Partial / Full entries |
| KPIs | 1 object | All management dashboard fields |
| warehouses | 2–3 | Branch names for multi-warehouse toggle |
| users | 5 | One per role (MANAGEMENT, SALES, ACCOUNTING, INVENTORY, ADMIN) |

**KPI fixture shape:**
```
{ dailySales, monthlySales, revenue, profitMargin, activeOrders, pendingOrders,
  outstandingReceivables, supplierLeadTimeDays, lowStockAlertCount, stockTurnover,
  revenueChange, salesChange, profitChange, ordersChange }
```

**Fixture file location:** `packages/db/src/mock/` — one file per entity, exported from `packages/db/src/mock/index.ts` as `@furnitrack/db/mock`.

**Tailwind v4 vs v3.4 fallback — resolution protocol:**
1. Scaffold `apps/storefront` first
2. Run `shadcn/ui init` — if CLI errors, immediately fall back to v3.4.x
3. Render smoke-test page with brand tokens + at least one shadcn component (Button)
4. If any styles render incorrectly, fall back to v3.4.x
5. Document outcome in PROJECT.md Key Decisions table
- Fallback trigger: **any** rendering failure — no workarounds, just pin to v3.4.x
- Token definition: v4 uses `@theme inline` CSS variable syntax; v3.4.x uses `tailwind.config.ts extend.colors/spacing`
- Token names are identical either way — only syntax differs
- Decision record: PROJECT.md Key Decisions table; both apps pin the same resolved version

**Shared UI Components (packages/ui) — Phase 1 scope is primitives only:**
| Component | Purpose |
|-----------|---------|
| Button | Primary, secondary, ghost variants; brand token colors |
| Badge | BEST_SELLER, SALE, HOT, OUT_OF_STOCK, LOW_STOCK variants |
| Card | Base container with shadow and padding tokens |
| Input | Text input with label and error state |
| Smoke-test page | Renders Button + Badge + Card with brand tokens in both apps |

**Built in later phases (NOT Phase 1):** Select, DataTable, StatCard, ChartWrapper, Modal, Tabs, Sidebar, Notification, form primitives

**shadcn/ui integration pattern:**
- `shadcn/ui init` runs inside `packages/ui`
- Each shadcn primitive is **wrapped** with a FurniTrack-specific component
- Consuming code imports `import { Button } from "@furnitrack/ui"` — never raw shadcn

**ProductCard boundary:** Lives in `apps/storefront`, NOT `packages/ui` — Phase 3 builds it.

**Smoke test definition:** A single `/design-system` route in both apps rendering Button (all variants), Badge (all variants), Card with sample content. Colors must match: navy header, coral/red prices, gold CTA.

**Brand identity / Design tokens:**
- Storefront brand name: FurniTrack (no separate consumer-facing name)
- Phase 1 logo: `<span className="font-bold text-xl">FurniTrack</span>` — no SVG
- Token file location: `packages/config/src/tailwind/tokens.css` — single source of truth
- Both apps import: `@import "@furnitrack/config/tailwind/tokens.css";` in `globals.css`

**Design token values (approximate — verify against reference designs):**
```css
--color-navy: #1a1a2e;
--color-coral: #e74c3c;
--color-gold: #c9a84c;
--color-beige: #f5f0e8;
--color-charcoal: #2d2d2d;
--color-muted: #9ca3af;
--color-white: #ffffff;
```

### Claude's Discretion

None specified in CONTEXT.md — all key decisions are locked above.

### Deferred Ideas (OUT OF SCOPE)

- Language/currency selector
- "Recently viewed" product section
- Wishlist / favorites functionality
- Customer reviews form (read-only display only per STOR-03)
- Real-time stock count updates
- Promotional countdown timers
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUN-01 | Monorepo bootstrapped with pnpm workspaces, Turborepo, and all four shared packages (`packages/config`, `packages/validators`, `packages/ui`, `packages/db`) | Turborepo 2.x pipeline config, pnpm-workspace.yaml patterns, package.json workspace protocol |
| FOUN-02 | `packages/config` exports shared TypeScript base config, ESLint flat config, and Tailwind base CSS; all apps extend from it | Tailwind v4 CSS-first config pattern, ESLint 9 flat config export pattern, tsconfig `extends` |
| FOUN-03 | `packages/validators` exports Zod schemas for all domain entities (Product, Order, Quotation, Lead, StockItem, Payment, User, KPI) | Zod v3 schema patterns, entity shapes defined in CONTEXT.md and ARCHITECTURE.md |
| FOUN-04 | `packages/db/src/mock/` contains all typed fixture files; both apps import from `@furnitrack/db/mock` | Mock data fixture pattern, barrel export structure, entity shapes from CONTEXT.md |
| FOUN-05 | `packages/ui` exports: Button, Input, Select, Card, Badge, DataTable, StatCard, ChartWrapper, Modal, Tabs, Sidebar, Notification, form primitives — all built on shadcn/ui — SCOPED: Phase 1 builds only Button, Badge, Card, Input | shadcn/ui monorepo install pattern, `transpilePackages` in Next.js, wrapper component pattern |
| FOUN-06 | Design tokens (brand colors, semantic colors, font sizes, spacing) defined as CSS variables in shared Tailwind config; consumed by both apps | Tailwind v4 `@theme` CSS variable syntax vs v3.4.x `extend.colors` fallback |
| FOUN-07 | Turborepo pipeline runs `typecheck` and `build` successfully across all workspaces | Turborepo 2.x `turbo.json` pipeline `dependsOn: ["^build"]` pattern |
| FOUN-08 | Tailwind v4 + shadcn/ui compatibility verified; fallback to v3.4.x documented if incompatible | Smoke-test protocol defined in CONTEXT.md; compatibility status is MEDIUM confidence |
| FOUN-09 | `packages/db/prisma/schema.prisma` defines full DB schema as reference document (not connected); mock fixture shapes align with Prisma-generated types | Prisma v6 schema-only mode, `prisma generate` without DB connection |
</phase_requirements>

---

## Summary

Phase 1 builds the non-negotiable infrastructure that every other phase depends on. It has no user-facing screens except smoke-test pages — its deliverable is a monorepo where all packages build cleanly, TypeScript resolves types across package boundaries, and the Tailwind v4 + shadcn/ui compatibility question is definitively answered.

The project's pre-existing STACK.md and ARCHITECTURE.md (researched via Context7 MCP on 2026-03-06) provide HIGH-confidence answers for the monorepo scaffold, Turborepo pipeline, `transpilePackages` pattern, and Zod schema shapes. The only genuinely uncertain area is Tailwind v4 + shadcn/ui compatibility, which is correctly handled by the smoke-test protocol already defined in CONTEXT.md — run the test, document the outcome, and both code paths (v4 confirmed vs v3.4.x fallback) have explicit implementation instructions.

The critical non-obvious insight for planning: `packages/ui` must NOT run `shadcn/ui init` in the way an app would. shadcn's CLI in monorepo mode requires the `--cwd` flag pointing to the package directory. Additionally, `packages/ui` ships JSX without a build step, so every consuming app must declare it in `transpilePackages` in `next.config.ts`. Without this, Next.js will fail to compile imports from `@furnitrack/ui`.

**Primary recommendation:** Follow the exact build order from ARCHITECTURE.md — Layer 0 (monorepo scaffold + packages/config) must complete and typecheck cleanly before any other package is started. The Tailwind v4 smoke test is the first real-code milestone and is the gate for all subsequent component work.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `pnpm` | `^9.x` | Package manager + workspace protocol | Strict symlink isolation prevents phantom dependencies; pnpm 9 + Turbo 2 is the Vercel-recommended pairing for Next.js monorepos |
| `turbo` | `^2.x` | Build orchestration, task pipeline | `dependsOn: ["^build"]` ensures correct build order across packages; remote cache API stable in v2 |
| `next` | `^16.1.x` | App framework for both apps | App Router, Turbopack dev server, Server Components; Next.js 16 requires React 19 |
| `react` / `react-dom` | `^19.x` | UI runtime | Required by Next.js 16; pin both to same major |
| `typescript` | `^5.x` | Type safety across all packages | `satisfies`, const type parameters; required for types to flow across package boundaries |
| `tailwindcss` | `^4.x` (v3.4.x fallback) | Utility-first CSS | v4 uses CSS-first config; v3.4.x fallback if shadcn/ui compatibility fails |
| `zod` | `^3.x` | Schema validation + mock data typing | Defined in `packages/validators`, shared across apps; schemas are single source of truth for entity shapes |
| `prisma` (CLI only) | `^6.x` | Schema reference document | `prisma generate` produces TypeScript types without a DB connection; no `@prisma/client` runtime needed for Phase 1 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `eslint` | `^9.x` | Linting | ESLint 9 uses flat config (`eslint.config.mjs`); `packages/config/eslint/` exports base flat config |
| `eslint-config-next` | `^16.x` | Next.js lint rules | Pin to match `next` version; includes App Router rules |
| `prettier` | `^3.x` | Code formatting | Single root `prettier.config.js`; add `prettier-plugin-tailwindcss` for class sorting |
| `prettier-plugin-tailwindcss` | latest | Tailwind class sorting | Prevents merge conflicts in component files; auto-sorts utility classes |
| `lucide-react` | `^0.4x` | Icon library | shadcn/ui default icon set; tree-shakeable; needed by Phase 1 Button/Badge primitives |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `pnpm ^9.x` | npm/yarn workspaces | npm/yarn have known cache invalidation issues with Turborepo; pnpm's strict isolation prevents phantom dependency bugs |
| Tailwind v4 CSS-first config | `tailwind.config.js` (v3 pattern) | v3 config is silently ignored or conflicts with v4 PostCSS plugin; do not mix |
| Prisma schema-only (no `@prisma/client`) | Full Prisma install | No DB needed for Phase 1; installing `@prisma/client` requires a live Postgres instance for `prisma migrate dev` which adds friction with zero benefit |

**Installation:**
```bash
# Workspace root
pnpm init
pnpm add -D turbo typescript -w
pnpm add -D eslint@^9 eslint-config-next@^16 prettier@^3 prettier-plugin-tailwindcss -w

# packages/config — no additional dependencies
# packages/validators
pnpm add zod@^3 --filter @furnitrack/validators

# packages/db (Prisma schema-only)
pnpm add -D prisma@^6 --filter @furnitrack/db

# packages/ui (shadcn/ui init runs as CLI, not npm install)
pnpm add lucide-react --filter @furnitrack/ui
cd packages/ui && npx shadcn@latest init --cwd .

# apps/storefront and apps/admin
pnpm add next@^16.1 react@^19 react-dom@^19 tailwindcss@^4 --filter storefront
pnpm add next@^16.1 react@^19 react-dom@^19 tailwindcss@^4 --filter admin
```

---

## Architecture Patterns

### Recommended Project Structure
```
furnitrack/
├── apps/
│   ├── storefront/          # Public e-commerce app (Next.js 16, port 3000)
│   └── admin/               # Internal ERP dashboard (Next.js 16, port 3001)
├── packages/
│   ├── config/              # Shared TS/ESLint/Tailwind configs (no runtime)
│   ├── validators/          # Shared Zod schemas (no build step)
│   ├── db/                  # Prisma schema + mock fixtures (no build step for MVP)
│   └── ui/                  # shadcn/ui wrapper components (no build step, transpilePackages)
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

### Pattern 1: pnpm Workspace Configuration

**What:** `pnpm-workspace.yaml` at repo root declares which directories are workspace packages. Internal packages reference each other using the `workspace:*` protocol.

**When to use:** Always — required foundation for all workspace resolution.

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

```json
// packages/ui/package.json
{
  "name": "@furnitrack/ui",
  "version": "0.0.1",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "@furnitrack/validators": "workspace:*"
  }
}
```

```json
// apps/admin/package.json — consuming the shared package
{
  "name": "admin",
  "dependencies": {
    "@furnitrack/ui": "workspace:*",
    "@furnitrack/validators": "workspace:*",
    "@furnitrack/db": "workspace:*",
    "@furnitrack/config": "workspace:*"
  }
}
```

### Pattern 2: Turborepo 2.x Pipeline Configuration

**What:** `turbo.json` at root defines task dependencies. `"dependsOn": ["^build"]` means "run build in all workspace dependencies first." This ensures `packages/validators` builds before `apps/admin` consumes it.

**When to use:** Every task that has cross-package dependencies.

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    }
  }
}
```

**Key insight:** For packages that use `transpilePackages` (no build step), the `build` task in their `package.json` should be a no-op: `"build": "echo 'No build step'"`. Turborepo still tracks the task; it just completes instantly. This prevents the pipeline from breaking when apps try to depend on `^build` for packages with no dist output.

### Pattern 3: No-Build-Step Packages via `transpilePackages`

**What:** `packages/ui`, `packages/validators`, and `packages/db` ship raw TypeScript/JSX with no compilation step. Each consuming app declares them in `transpilePackages` in `next.config.ts` so Next.js compiles them directly.

**When to use:** All shared packages in this monorepo for the MVP phase.

```typescript
// apps/admin/next.config.ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: [
    "@furnitrack/ui",
    "@furnitrack/validators",
    "@furnitrack/db",
  ],
}

export default nextConfig
```

```json
// packages/ui/package.json — exports point directly to source
{
  "name": "@furnitrack/ui",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

### Pattern 4: Shared TypeScript Configuration

**What:** `packages/config/typescript/base.json` is the root tsconfig. All packages and apps extend from it. Each app adds its own `paths` aliases.

```json
// packages/config/typescript/base.json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ES2022",
    "jsx": "preserve",
    "lib": ["dom", "dom.iterable", "esnext"],
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  }
}
```

```json
// packages/config/typescript/nextjs.json — extends base, adds Next.js settings
{
  "extends": "./base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }]
  },
  "include": ["**/*.ts", "**/*.tsx", ".next/types/**/*.d.ts"],
  "exclude": ["node_modules"]
}
```

```json
// apps/admin/tsconfig.json
{
  "extends": "@furnitrack/config/typescript/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**CRITICAL:** For `apps/admin/tsconfig.json` to resolve `@furnitrack/config`, the `packages/config/package.json` must export the TypeScript configs:

```json
// packages/config/package.json
{
  "name": "@furnitrack/config",
  "exports": {
    "./typescript/base.json": "./typescript/base.json",
    "./typescript/nextjs.json": "./typescript/nextjs.json",
    "./eslint/base": "./eslint/base.mjs",
    "./tailwind/tokens.css": "./tailwind/tokens.css"
  }
}
```

### Pattern 5: Tailwind v4 CSS-First Config (HIGH confidence if v4 confirmed)

**What:** Tailwind v4 eliminates `tailwind.config.js`. All configuration — including design tokens — lives in CSS using `@import "tailwindcss"` and `@theme` blocks. The `packages/config/src/tailwind/tokens.css` file is the single source of truth for brand tokens.

**When to use:** If smoke test confirms Tailwind v4 + shadcn/ui compatibility.

```css
/* packages/config/src/tailwind/tokens.css */
@import "tailwindcss";

@theme {
  --color-navy: #1a1a2e;
  --color-coral: #e74c3c;
  --color-gold: #c9a84c;
  --color-beige: #f5f0e8;
  --color-charcoal: #2d2d2d;
  --color-muted: #9ca3af;
  --color-white: #ffffff;

  --font-family-sans: "Inter", ui-sans-serif, system-ui, sans-serif;

  --spacing-sidebar: 16rem;
  --spacing-topbar: 4rem;
}
```

```css
/* apps/storefront/app/globals.css — consuming the shared tokens */
@import "@furnitrack/config/tailwind/tokens.css";
```

**Fallback (if v3.4.x required):**

```typescript
// packages/config/tailwind/base.ts (v3.4.x fallback path)
import type { Config } from "tailwindcss"

export const furnitrackTokens = {
  colors: {
    navy: "#1a1a2e",
    coral: "#e74c3c",
    gold: "#c9a84c",
    beige: "#f5f0e8",
    charcoal: "#2d2d2d",
    muted: "#9ca3af",
  },
} satisfies Partial<Config["theme"]>
```

```typescript
// apps/storefront/tailwind.config.ts (v3.4.x fallback path)
import type { Config } from "tailwindcss"
import { furnitrackTokens } from "@furnitrack/config/tailwind/base"

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: furnitrackTokens.colors,
    },
  },
} satisfies Config
```

### Pattern 6: shadcn/ui in a Shared Package

**What:** Run `npx shadcn@latest init` with `--cwd` pointing to `packages/ui`. This installs the component source files into `packages/ui/src/components/ui/`. Each primitive is then wrapped in a FurniTrack-specific component before being re-exported. Consuming apps never import raw shadcn — only the wrapped `@furnitrack/ui` exports.

**When to use:** Any shadcn primitive needed in both apps.

```
packages/ui/src/
├── components/
│   ├── ui/                    # shadcn-generated source (do not edit)
│   │   ├── button.tsx         # shadcn Button primitive
│   │   ├── badge.tsx          # shadcn Badge primitive
│   │   ├── card.tsx           # shadcn Card primitive
│   │   └── input.tsx          # shadcn Input primitive
│   ├── Button.tsx             # FurniTrack wrapper (exports brand-aware variants)
│   ├── Badge.tsx              # FurniTrack wrapper (exports FurniTrack-specific variants)
│   ├── Card.tsx               # FurniTrack wrapper (applies token-based shadow/padding)
│   └── Input.tsx              # FurniTrack wrapper (label + error state)
└── index.ts                   # Single barrel: export { Button, Badge, Card, Input }
```

```typescript
// packages/ui/src/components/Button.tsx
import { Button as ShadcnButton } from "./ui/button"
import type { ButtonProps } from "./ui/button"
import { cn } from "../lib/utils"

export interface FurniButtonProps extends ButtonProps {
  variant?: "primary" | "secondary" | "ghost"
}

export function Button({ variant = "primary", className, ...props }: FurniButtonProps) {
  const variantClasses = {
    primary: "bg-gold text-white hover:bg-gold/90",
    secondary: "bg-navy text-white hover:bg-navy/90",
    ghost: "bg-transparent text-charcoal hover:bg-beige",
  }
  return (
    <ShadcnButton
      className={cn(variantClasses[variant], className)}
      {...props}
    />
  )
}
```

```typescript
// packages/ui/src/index.ts
export { Button } from "./components/Button"
export { Badge } from "./components/Badge"
export { Card } from "./components/Card"
export { Input } from "./components/Input"
export type { FurniButtonProps } from "./components/Button"
```

**shadcn/ui CLI invocation for a monorepo package (MEDIUM confidence):**
```bash
# Run from packages/ui directory
cd packages/ui
npx shadcn@latest init --cwd .
# When prompted for component install location, specify: src/components/ui
```

**Critical note:** The shadcn/ui `components.json` file that the CLI generates lives in `packages/ui/`, not at the repo root. When adding new components later, run `npx shadcn@latest add button --cwd packages/ui` from the repo root or `npx shadcn@latest add button` from inside `packages/ui`.

### Pattern 7: Zod v3 Schema Design for Domain Entities

**What:** `packages/validators/src/` contains one file per domain entity. Schemas are defined with `z.object()` and exported as both the schema and its inferred type. Fixture files in `packages/db/src/mock/` use `z.infer<typeof Schema>[]` to enforce shape at the TypeScript level.

**When to use:** Every entity that appears in mock data or will later go through an API route.

```typescript
// packages/validators/src/product.ts
import { z } from "zod"

export const StockStatusEnum = z.enum(["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"])
export const ProductBadgeEnum = z.enum(["BEST_SELLER", "SALE", "HOT"]).nullable()

export const ColorVariantSchema = z.object({
  name: z.string(),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
})

export const DimensionsSchema = z.object({
  width: z.number().positive(),
  depth: z.number().positive(),
  height: z.number().positive(),
  weight: z.number().positive(),
})

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  category: z.string(),
  material: z.string(),
  price: z.number().positive(),
  originalPrice: z.number().positive().nullable(),
  badge: ProductBadgeEnum,
  stockStatus: StockStatusEnum,
  colorVariants: z.array(ColorVariantSchema),
  images: z.array(z.string().url()),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  description: z.string(),
  dimensions: DimensionsSchema,
})

export type Product = z.infer<typeof ProductSchema>
export type StockStatus = z.infer<typeof StockStatusEnum>
export type ProductBadge = z.infer<typeof ProductBadgeEnum>
```

```typescript
// packages/validators/src/user.ts
import { z } from "zod"

export const RoleEnum = z.enum(["MANAGEMENT", "SALES", "ACCOUNTING", "INVENTORY", "ADMIN"])

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: RoleEnum,
  branchId: z.string(),
})

export type User = z.infer<typeof UserSchema>
export type Role = z.infer<typeof RoleEnum>
```

```typescript
// packages/validators/src/kpi.ts
import { z } from "zod"

export const KpiSchema = z.object({
  dailySales: z.number(),
  monthlySales: z.number(),
  revenue: z.number(),
  profitMargin: z.number(),
  activeOrders: z.number().int(),
  pendingOrders: z.number().int(),
  outstandingReceivables: z.number(),
  supplierLeadTimeDays: z.number(),
  lowStockAlertCount: z.number().int(),
  stockTurnover: z.number(),
  revenueChange: z.number(),
  salesChange: z.number(),
  profitChange: z.number(),
  ordersChange: z.number(),
})

export type Kpi = z.infer<typeof KpiSchema>
```

### Pattern 8: Prisma v6 Schema-Only Mode

**What:** Install only the Prisma CLI (not `@prisma/client`) in `packages/db`. Run `prisma generate` to produce TypeScript types in a custom output directory. No DB connection string is required for type generation when using a file-based output.

**When to use:** Phase 1 only. The schema is a reference document that gives mock fixtures their type shapes.

```prisma
// packages/db/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id            String      @id @default(cuid())
  slug          String      @unique
  name          String
  category      String
  material      String
  price         Decimal
  originalPrice Decimal?
  badge         ProductBadge?
  stockStatus   StockStatus @default(IN_STOCK)
  description   String
  // ... relations
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

enum StockStatus {
  IN_STOCK
  LOW_STOCK
  OUT_OF_STOCK
}

enum ProductBadge {
  BEST_SELLER
  SALE
  HOT
}
```

**IMPORTANT:** `prisma generate` fails without a `DATABASE_URL`. For Phase 1, either:
1. Set `DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"` in a `.env` at `packages/db/` root (it does not need to be a real connection) — generation reads the URL but does not connect; OR
2. Use `prisma generate --no-engine` if available in v6 to skip engine download

The mock fixture types can also be hand-written TypeScript interfaces that mirror the Prisma schema shape — this avoids the `prisma generate` friction entirely for Phase 1 and is the recommended approach given no DB is needed.

### Anti-Patterns to Avoid

- **No `tailwind.config.js` if using v4:** Tailwind v4 ignores JS config; do not create one. If the fallback to v3.4.x is taken, then a `tailwind.config.ts` IS required.
- **No raw shadcn imports in app code:** `import { Button } from "@/components/ui/button"` is the wrong pattern. Always import from `@furnitrack/ui`.
- **No inline fixture data in page components:** All mock data lives in `packages/db/src/mock/`. Page components import from `@furnitrack/db/mock`.
- **No cross-app imports:** `apps/admin` never imports from `apps/storefront` and vice versa.
- **No Prisma client install in Phase 1:** `@prisma/client` requires a live database for `prisma generate` in standard mode. Defer to backend milestone.
- **No `pages/` directory:** Both apps are App Router only. No Pages Router.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Component primitives (Button, Badge, Input, Card) | Custom components from scratch | shadcn/ui via `packages/ui` | Accessibility (ARIA, keyboard nav, focus management) is built-in; hand-rolling misses dozens of edge cases |
| TypeScript base config | Custom `compilerOptions` per package | `packages/config/typescript/base.json` | Shared strict settings prevent per-package drift; one tsconfig change propagates everywhere |
| Zod-to-TypeScript type extraction | Manual `interface` definitions | `z.infer<typeof Schema>` | Schema and type are always in sync; manual interfaces diverge silently |
| Monorepo task orchestration | npm scripts with `--workspaces` | Turborepo 2.x | Turborepo handles topological build ordering, caching, and parallel execution; npm `--workspaces` has no caching and no dependency graph awareness |
| Design token CSS variables | Hardcoded color values in components | `packages/config/tailwind/tokens.css` | Hardcoded values require find-and-replace when tokens change; variables change in one place |
| Workspace package resolution | Symlinks or path aliases in `tsconfig.paths` only | `workspace:*` protocol in `package.json` | `tsconfig.paths` only resolves in TypeScript; pnpm `workspace:*` resolves in the runtime module system too |

**Key insight:** The value of this foundation phase is entirely in setting up the patterns that prevent technical debt in phases 2–6. Any shortcut taken here (inline mock data, per-app shadcn installs, manual type definitions) will compound across every subsequent phase.

---

## Common Pitfalls

### Pitfall 1: Tailwind CSS Not Purging Shared Package Styles
**What goes wrong:** Tailwind v3/v4 scans `content` globs for utility classes. If `packages/ui/**/*.tsx` is not in the `content` array (v3) or auto-detection misses the package dir (v4), classes used only in `packages/ui` are purged from the CSS output.
**Why it happens:** CSS content scanning only sees files explicitly in scope. Packages outside `apps/*/` are often missed.
**How to avoid:**
- v4: The PostCSS plugin auto-detects files via the JavaScript import graph, but verify with the smoke test — if brand token colors don't appear on the `/design-system` page, this is the culprit.
- v3.4.x fallback: Add `"../../packages/ui/src/**/*.{ts,tsx}"` to the `content` array in each app's `tailwind.config.ts`.
**Warning signs:** Smoke test page renders unstyled components or missing background colors.

### Pitfall 2: `transpilePackages` Missing for JSX Packages
**What goes wrong:** Import of `@furnitrack/ui` works at the TypeScript level but throws a runtime error: "SyntaxError: Unexpected token '<'" or "You may need a loader to handle this file type."
**Why it happens:** `packages/ui` ships JSX source without compilation. Node.js and Next.js cannot execute raw JSX without a transpilation step.
**How to avoid:** All three non-config shared packages must be in `transpilePackages` in BOTH apps' `next.config.ts`.
**Warning signs:** Build fails with SyntaxError on any import from `@furnitrack/*`.

### Pitfall 3: shadcn/ui CLI `components.json` at Wrong Level
**What goes wrong:** Running `npx shadcn@latest init` from the repo root creates `components.json` at the monorepo root and puts generated component files in the root's `components/` directory.
**Why it happens:** The CLI defaults to the current working directory.
**How to avoid:** Run from inside `packages/ui` or use `--cwd packages/ui`. Confirm `components.json` exists at `packages/ui/components.json`, not at repo root.
**Warning signs:** Component files appear at `./components/ui/` instead of `./packages/ui/src/components/ui/`.

### Pitfall 4: `workspace:*` Not Resolving Across Apps
**What goes wrong:** TypeScript errors like "Cannot find module '@furnitrack/ui'" even though the package exists.
**Why it happens:** The `package.json` `exports` field is missing or points to a non-existent path.
**How to avoid:** Verify each shared package's `package.json` has a valid `exports` entry pointing to an existing file (even if it's just the TypeScript source). Run `pnpm install` after adding workspace deps — pnpm creates symlinks in `node_modules/.pnpm/`.
**Warning signs:** `node_modules/@furnitrack/ui` is a symlink that points to `packages/ui` — if the symlink is missing, `pnpm install` was not run after adding the dep.

### Pitfall 5: Turborepo Build Order Not Respected
**What goes wrong:** `turbo run build` starts building `apps/admin` before `packages/validators` finishes, causing import errors.
**Why it happens:** Without `"dependsOn": ["^build"]` in the task config, Turborepo runs tasks in parallel without dependency ordering.
**How to avoid:** All `build` and `typecheck` tasks in `turbo.json` must have `"dependsOn": ["^build"]` / `"dependsOn": ["^typecheck"]`. Packages with no build step need a no-op `"build": "echo done"` script so Turborepo can mark them complete.
**Warning signs:** Intermittent build failures that succeed on retry (race condition in task execution).

### Pitfall 6: Prisma Generate Blocking on Missing DATABASE_URL
**What goes wrong:** `prisma generate` exits with "Error: Environment variable not found: DATABASE_URL."
**Why it happens:** Prisma's generator validates the datasource block at generation time.
**How to avoid:** Create `packages/db/.env` with a placeholder URL. This file should be in `.gitignore`. Alternatively, hand-write TypeScript interfaces for mock fixture types and skip `prisma generate` in Phase 1 entirely.
**Warning signs:** CI fails on `turbo run build` with Prisma environment variable error.

### Pitfall 7: React 19 Peer Dependency Warnings
**What goes wrong:** `pnpm install` outputs peer dependency warnings for `react-hook-form`, `recharts`, `zustand`.
**Why it happens:** Some packages have not yet updated their `peerDependencies` to include React 19.
**How to avoid:** These are warnings, not errors — the packages work at runtime. Document in STATE.md blockers. Do NOT downgrade to React 18 (Next.js 16 requires React 19). Suppress with `pnpm config set auto-install-peers true` or add `peerDependencyRules` in root `package.json` if warnings are noisy.
**Warning signs:** Peer dep warnings at install time — expected and documented; do not block Phase 1.

---

## Code Examples

### Root `package.json`
```json
{
  "name": "furnitrack",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "typecheck": "turbo run typecheck",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.0.0",
    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "latest",
    "eslint": "^9.0.0"
  }
}
```

### `packages/db/src/mock/products.ts` — Typed fixture pattern
```typescript
import type { Product } from "@furnitrack/validators"

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-001",
    slug: "ariston-oak-dining-chair",
    name: "Ariston Oak Dining Chair",
    category: "Dining",
    material: "Oak",
    price: 4500,
    originalPrice: 5200,
    badge: "SALE",
    stockStatus: "IN_STOCK",
    colorVariants: [
      { name: "Natural Oak", hex: "#c9a84c" },
      { name: "Dark Walnut", hex: "#3d2b1f" },
    ],
    images: ["/images/products/ariston-oak-chair.jpg"],
    rating: 4.8,
    reviewCount: 127,
    description: "Solid oak dining chair with ergonomic curved back and upholstered seat.",
    dimensions: { width: 45, depth: 52, height: 90, weight: 6.5 },
  },
  // ... 9–11 more products
]
```

### `packages/db/src/mock/index.ts` — Barrel export
```typescript
export { MOCK_PRODUCTS } from "./products"
export { MOCK_LEADS } from "./leads"
export { MOCK_QUOTATIONS } from "./quotations"
export { MOCK_ORDERS } from "./orders"
export { MOCK_PAYMENTS } from "./payments"
export { MOCK_KPIS } from "./kpis"
export { MOCK_WAREHOUSES } from "./warehouses"
export { DEMO_USERS } from "./users"
```

### `packages/validators/src/index.ts` — Barrel export
```typescript
export * from "./product"
export * from "./user"
export * from "./lead"
export * from "./order"
export * from "./quotation"
export * from "./payment"
export * from "./kpi"
export * from "./warehouse"
export * from "./stockItem"
```

### Smoke-test page in apps/storefront
```typescript
// apps/storefront/app/design-system/page.tsx
import { Button } from "@furnitrack/ui"
import { Badge } from "@furnitrack/ui"
import { Card } from "@furnitrack/ui"

export default function DesignSystemPage() {
  return (
    <div className="p-8 space-y-8" style={{ background: "var(--color-beige)" }}>
      <h1 className="text-2xl font-bold" style={{ color: "var(--color-navy)" }}>
        FurniTrack Design System
      </h1>

      {/* Buttons */}
      <section className="space-x-4">
        <Button variant="primary">Primary (Gold)</Button>
        <Button variant="secondary">Secondary (Navy)</Button>
        <Button variant="ghost">Ghost</Button>
      </section>

      {/* Badges */}
      <section className="space-x-4">
        <Badge variant="BEST_SELLER">BEST SELLER</Badge>
        <Badge variant="SALE">SALE</Badge>
        <Badge variant="HOT">HOT</Badge>
        <Badge variant="OUT_OF_STOCK">OUT OF STOCK</Badge>
      </section>

      {/* Card */}
      <Card className="max-w-xs p-6">
        <p className="text-sm" style={{ color: "var(--color-charcoal)" }}>
          Sample card content with design token colors and spacing.
        </p>
        <p className="text-lg font-bold" style={{ color: "var(--color-coral)" }}>
          ₱4,500.00
        </p>
      </Card>
    </div>
  )
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` with JS object | CSS-first config with `@import "tailwindcss"` and `@theme {}` | Tailwind v4 (2025) | No JS config file needed; tokens are CSS custom properties, shareable via CSS imports |
| ESLint `.eslintrc` format | Flat config `eslint.config.mjs` | ESLint v9 (2024) | Single config file; no more shareable config package format; use `export default [...]` array |
| `create-turbo` scaffolding examples showing `packages/ui` with build step (`tsup`) | No-build-step packages via `transpilePackages` | Turborepo 2.x + Next.js 13+ | Eliminates a build step and dist directory for shared packages; simpler setup |
| `shadcn-ui` npm package (old name) | `shadcn` CLI (`npx shadcn@latest`) | shadcn/ui 2024 rebrand | The old `shadcn-ui` package targets Tailwind v3; use `shadcn` CLI for v4 compatibility |
| Per-app shadcn component directories | Monorepo shared package with `--cwd` flag | shadcn/ui monorepo guide (2024) | Official support for shared packages; components installed once, used everywhere |

**Deprecated/outdated:**
- `tailwind.config.js`: Not used in Tailwind v4 projects — silently ignored
- `eslint-config-*` shareable packages in `.eslintrc` format: Incompatible with ESLint 9 flat config
- `shadcn-ui` (npm package name): Use `npx shadcn@latest`, not `npx shadcn-ui@latest`

---

## Open Questions

1. **Tailwind v4 + shadcn/ui exact compatibility status**
   - What we know: Project's prior STACK.md states "shadcn/ui's CLI updated to generate Tailwind v4-compatible components" (MEDIUM confidence, training data)
   - What's unclear: Whether the current `npx shadcn@latest init` flow in a `packages/ui` subdirectory correctly detects Tailwind v4 and produces working CSS output in a Next.js 16 monorepo
   - Recommendation: The smoke-test protocol in CONTEXT.md is the correct resolution. No workaround should be attempted — fall back to v3.4.x immediately if any rendering failure occurs. The answer will be known by end of Wave 1.

2. **`prisma generate` without DATABASE_URL in CI**
   - What we know: Prisma reads env vars at generation time even though no connection is made
   - What's unclear: Whether Prisma v6 supports a `--no-engine` flag or equivalent that skips the datasource validation
   - Recommendation: Use a placeholder `.env` at `packages/db/` level. If `prisma generate` is in the Turborepo `build` pipeline, it will run in CI — the placeholder URL must be committed as a `.env.example` with documented instructions. Alternatively, hand-write TypeScript interfaces for Phase 1 and defer `prisma generate` entirely until Phase 1's FOUN-09 implementation.

3. **shadcn/ui `components.json` configuration for v4**
   - What we know: The CLI generates a `components.json` that configures component paths, Tailwind version, and CSS variables
   - What's unclear: The exact prompts and options during `npx shadcn@latest init` in a package subdirectory for v4
   - Recommendation: Run the CLI interactively in `packages/ui`, choose the CSS variables approach when prompted (not inline Tailwind classes), and point the components directory to `src/components/ui`.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None yet — Wave 0 must establish TypeScript typecheck as primary validation gate |
| Config file | `turbo.json` (typecheck task) |
| Quick run command | `pnpm turbo typecheck --filter=@furnitrack/validators --filter=@furnitrack/db` |
| Full suite command | `pnpm turbo typecheck build` |

**Note:** Phase 1 is infrastructure — no unit tests are appropriate for config files, fixture data, or CSS tokens. Validation is TypeScript compilation and smoke-test visual confirmation. Any TypeScript error is a test failure.

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUN-01 | `pnpm turbo build` completes without errors | build pipeline | `pnpm turbo typecheck build` | ❌ Wave 0 |
| FOUN-02 | Apps can `extends` from `@furnitrack/config` TS/ESLint configs | typecheck | `pnpm turbo typecheck` | ❌ Wave 0 |
| FOUN-03 | Zod schemas export correct types; fixtures satisfy schemas | typecheck | `pnpm turbo typecheck --filter=@furnitrack/validators` | ❌ Wave 0 |
| FOUN-04 | Mock fixtures typed against Zod schemas; import resolves from `@furnitrack/db/mock` | typecheck | `pnpm turbo typecheck --filter=@furnitrack/db` | ❌ Wave 0 |
| FOUN-05 | `@furnitrack/ui` exports resolve; Button/Badge/Card/Input render in smoke-test | smoke test (visual) | `pnpm turbo build --filter=storefront --filter=admin` then open `/design-system` | ❌ Wave 0 |
| FOUN-06 | CSS variables (--color-navy etc) render on smoke-test page | smoke test (visual) | Open `/design-system` in browser, verify colors match spec | manual |
| FOUN-07 | `pnpm turbo typecheck build` exits 0 from repo root | build pipeline | `pnpm turbo typecheck build` | ❌ Wave 0 |
| FOUN-08 | Tailwind v4 + shadcn compatibility decision documented in PROJECT.md | smoke test (visual) | Open `/design-system`, check Button renders gold CTA | manual |
| FOUN-09 | `schema.prisma` exists; fixture shapes match schema entity shapes | typecheck | `pnpm turbo typecheck --filter=@furnitrack/db` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm turbo typecheck`
- **Per wave merge:** `pnpm turbo typecheck build`
- **Phase gate:** `pnpm turbo typecheck build` exits 0 from repo root AND smoke-test `/design-system` page renders correctly with brand tokens in both apps before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `pnpm-workspace.yaml` — monorepo workspace declaration
- [ ] `turbo.json` — pipeline with `build`, `typecheck`, `dev`, `lint` tasks
- [ ] `packages/config/package.json` — exports for typescript/eslint/tailwind configs
- [ ] `packages/config/typescript/base.json` — base tsconfig
- [ ] `packages/validators/package.json` — workspace package declaration
- [ ] `packages/db/package.json` — workspace package declaration
- [ ] `packages/ui/package.json` — workspace package declaration with `transpilePackages`-compatible exports
- [ ] Root `package.json` — turbo scripts

---

## Sources

### Primary (HIGH confidence)
- `.planning/research/STACK.md` — Full tech stack decisions, versions, rationale (Context7 MCP verified 2026-03-06)
- `.planning/research/ARCHITECTURE.md` — Monorepo structure, package patterns, build order, data flow patterns (Context7 MCP verified 2026-03-06)
- `.planning/phases/01-monorepo-foundation/01-CONTEXT.md` — Locked decisions: mock data shapes, Tailwind fallback protocol, component scope, brand tokens (user decisions 2026-03-06)

### Secondary (MEDIUM confidence)
- Training data (knowledge cutoff Aug 2025) — Tailwind v4 `@theme` CSS variable syntax, shadcn/ui `--cwd` flag for monorepo installs, Turborepo 2.x `turbo.json` task schema, Prisma v6 generate-without-connection behavior, ESLint 9 flat config export pattern
- Note: Web search and WebFetch were unavailable during this research session. All MEDIUM confidence items should be verified against official docs at implementation time.

### Tertiary (LOW confidence)
- None — no unverified single-source claims made.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions from Context7 MCP-verified planning docs
- Architecture: HIGH — sourced from project's own ARCHITECTURE.md (Context7 verified)
- Mock data shapes: HIGH — explicitly defined in CONTEXT.md by user
- Tailwind v4/shadcn compatibility: MEDIUM — smoke-test protocol defined; actual compatibility unknown until run
- Turborepo 2.x task syntax: MEDIUM — training data, stable API but verify `turbo.json` schema at implementation
- Prisma schema-only mode: MEDIUM — `prisma generate` without DB connection behavior needs verification
- Pitfalls: MEDIUM — training data + cross-referenced with project architecture decisions

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 for stable stack items; Tailwind v4 + shadcn/ui compatibility item is resolved by smoke test (not time-dependent)
