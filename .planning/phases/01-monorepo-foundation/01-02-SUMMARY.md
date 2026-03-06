---
phase: 01-monorepo-foundation
plan: 02
subsystem: database
tags: [zod, typescript, mock-data, validators, fixtures, prisma]

# Dependency graph
requires:
  - phase: 01-01
    provides: monorepo scaffold, packages/validators and packages/db scaffolded with package.json and placeholder src/index.ts

provides:
  - 8 Zod entity schemas with inferred TypeScript types in @furnitrack/validators
  - Typed mock fixture arrays for all 8 domain entities in @furnitrack/db/mock
  - Type-safe data layer that every downstream phase imports from

affects:
  - 01-03 (apps/storefront)
  - 01-04 (apps/admin)
  - phase-2 (product catalog)
  - phase-3 (sales/quotation)
  - phase-4 (inventory)
  - phase-5 (accounting)

# Tech tracking
tech-stack:
  added:
    - "zod@^3 (runtime schema validation and TypeScript type inference)"
  patterns:
    - "Zod schema-first types: all domain types derived via z.infer<typeof Schema>"
    - "import type only in fixture files: no runtime Zod in mock data, types only"
    - "Barrel exports: both packages/validators/src/index.ts and packages/db/src/mock/index.ts export all entities"

key-files:
  created:
    - packages/validators/src/product.ts
    - packages/validators/src/user.ts
    - packages/validators/src/lead.ts
    - packages/validators/src/quotation.ts
    - packages/validators/src/order.ts
    - packages/validators/src/payment.ts
    - packages/validators/src/kpi.ts
    - packages/validators/src/warehouse.ts
    - packages/validators/src/stockItem.ts
    - packages/db/src/mock/products.ts
    - packages/db/src/mock/leads.ts
    - packages/db/src/mock/quotations.ts
    - packages/db/src/mock/orders.ts
    - packages/db/src/mock/payments.ts
    - packages/db/src/mock/kpis.ts
    - packages/db/src/mock/warehouses.ts
    - packages/db/src/mock/users.ts
  modified:
    - packages/validators/src/index.ts
    - packages/db/src/mock/index.ts
    - packages/db/src/index.ts

key-decisions:
  - "import type used in all fixture files — no runtime Zod validation in mock data prevents circular dep risks and keeps db package pure data"
  - "MOCK_KPIS exported as a single object (not array) — KPI data represents a single dashboard snapshot, not a collection"
  - "Philippine peso pricing range ₱2,800–₱45,000 used for realistic storefront filter sidebar content"
  - "StockStatus mix: 8 IN_STOCK, 2 LOW_STOCK, 1 OUT_OF_STOCK across 12 products for realistic filter sidebar testing"

patterns-established:
  - "Schema-first pattern: define Zod schema → export const Schema → export type Type = z.infer<typeof Schema>"
  - "Enum pattern: z.enum([...]) for all string union types — provides both runtime validation and TypeScript types"
  - "Nullable vs optional: use .nullable() for explicitly null-able DB fields, .optional() only for truly omit-able fields (e.g., quotation line item dimensions/finish)"
  - "Fixture type-safety: typed arrays as Type[] catch shape mismatches at authoring time without runtime cost"

requirements-completed: [FOUN-03, FOUN-04]

# Metrics
duration: 5min
completed: 2026-03-06
---

# Phase 01 Plan 02: Zod Schemas and Mock Fixtures Summary

**8 Zod entity schemas with inferred TypeScript types in @furnitrack/validators plus 12-product, 7-lead, 7-quotation, 4-order typed mock fixture arrays in @furnitrack/db/mock — complete type-safe data layer for all downstream phases**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-06T15:32:34Z
- **Completed:** 2026-03-06T15:37:21Z
- **Tasks:** 2
- **Files modified:** 20

## Accomplishments

- Implemented all 8 Zod entity schemas (Product, User, Lead, Quotation, Order, Payment, Kpi, Warehouse, StockItem) with inferred TypeScript types — single source of truth for all domain shapes
- Created 8 typed mock fixture files covering every downstream screen: 12 products across 6 categories, 7 leads across all 5 CRM stages, 7 quotations, 4 orders with lineage references, 4 payments, 1 KPI object, 3 warehouses, 5 users (one per role)
- Both `@furnitrack/validators` and `@furnitrack/db` typecheck cleanly via `pnpm turbo typecheck` with zero errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement all 8 Zod schemas in @furnitrack/validators** - `c2309ac` (feat)
2. **Task 2: Create all mock fixture files in @furnitrack/db/mock** - `0f15bb4` (feat)

**Plan metadata:** (see final commit below)

## Files Created/Modified

- `packages/validators/src/product.ts` - ProductSchema with StockStatusEnum, ProductBadgeEnum, ColorVariantSchema, DimensionsSchema
- `packages/validators/src/user.ts` - UserSchema with RoleEnum (5 roles: MANAGEMENT, SALES, ACCOUNTING, INVENTORY, ADMIN)
- `packages/validators/src/lead.ts` - LeadSchema with CrmStageEnum (5 stages), LeadStatusEnum
- `packages/validators/src/quotation.ts` - QuotationSchema with QuotationLineItemSchema, VAT fields
- `packages/validators/src/order.ts` - OrderSchema with OrderStatusEnum, rushOrder, poNumber nullable
- `packages/validators/src/payment.ts` - PaymentSchema with PaymentTypeEnum, PaymentStatusEnum
- `packages/validators/src/kpi.ts` - KpiSchema with 14 management dashboard metric fields
- `packages/validators/src/warehouse.ts` - WarehouseSchema (id, name, branchCode, address)
- `packages/validators/src/stockItem.ts` - StockItemSchema with StockStateEnum, StockMovementTypeEnum
- `packages/validators/src/index.ts` - Barrel export for all 8 schemas (replaced placeholder)
- `packages/db/src/mock/products.ts` - MOCK_PRODUCTS typed as Product[] — 12 entries, 6 categories, ₱2,800–₱45,000 range
- `packages/db/src/mock/leads.ts` - MOCK_LEADS typed as Lead[] — 7 entries across all 5 CRM stages
- `packages/db/src/mock/quotations.ts` - MOCK_QUOTATIONS typed as Quotation[] — 7 entries with 12% VAT computed correctly
- `packages/db/src/mock/orders.ts` - MOCK_ORDERS typed as Order[] — 4 entries with quotation lineage
- `packages/db/src/mock/payments.ts` - MOCK_PAYMENTS typed as Payment[] — 4 entries with proof URLs
- `packages/db/src/mock/kpis.ts` - MOCK_KPIS typed as Kpi (single object, not array)
- `packages/db/src/mock/warehouses.ts` - MOCK_WAREHOUSES typed as Warehouse[] — 3 branches
- `packages/db/src/mock/users.ts` - DEMO_USERS typed as User[] — 5 users, one per role
- `packages/db/src/mock/index.ts` - Barrel export for all 8 fixture exports (replaced placeholder)
- `packages/db/src/index.ts` - Top-level re-export from mock (replaced placeholder)

## Decisions Made

- **import type in fixtures:** All fixture files use `import type { X } from "@furnitrack/validators"` — pure type imports prevent circular dependency risks and ensure the db package remains a pure data package with no runtime Zod dependency
- **MOCK_KPIS as single object:** KPI is a dashboard snapshot, not a collection — exported as `Kpi` (not `Kpi[]`) to match how it will be consumed
- **Philippine peso pricing:** Products priced ₱2,800–₱45,000 for realistic storefront filter sidebar content
- **StockStatus distribution:** 8 IN_STOCK, 2 LOW_STOCK, 1 OUT_OF_STOCK across 12 products for realistic filter UI testing

## Deviations from Plan

None - plan executed exactly as written. The existing tsconfig.json files in validators and db packages (created in Plan 01) already contained equivalent configuration to what Plan 02 specified, so they were left unchanged.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `@furnitrack/validators` and `@furnitrack/db/mock` are ready to import in Plan 03 (apps/storefront) and Plan 04 (apps/admin)
- All product, lead, quotation, order, payment, KPI, warehouse, and user shapes are finalized — downstream components can be built against these types immediately
- Stock status mix and category distribution in MOCK_PRODUCTS validated for storefront filter sidebar content

---
*Phase: 01-monorepo-foundation*
*Completed: 2026-03-06*
