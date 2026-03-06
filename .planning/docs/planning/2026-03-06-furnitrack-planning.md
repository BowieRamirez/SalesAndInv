# FurniTrack — Project Planning Document

**Date:** 2026-03-06
**Version:** 1.0
**Project:** FurniTrack — Integrated E-Commerce & Management System
**Business:** Furniture retail/B2B with multi-branch operations

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack (Verified Versions)](#2-tech-stack-verified-versions)
3. [Monorepo Architecture](#3-monorepo-architecture)
4. [Application Breakdown](#4-application-breakdown)
5. [Database Schema Overview](#5-database-schema-overview)
6. [API Design](#6-api-design)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [Environment & Infrastructure](#8-environment--infrastructure)
9. [Implementation Phases](#9-implementation-phases)
10. [Success Criteria](#10-success-criteria)

---

## 1. Project Overview

FurniTrack replaces manual Google Drive and Excel workflows with a real-time integrated system consisting of:

- **Public Storefront** (`apps/storefront`) — customer-facing furniture catalog and order placement
- **Admin Dashboard** (`apps/admin`) — internal management for sales, inventory, accounting, and reporting

Both applications share a single monorepo, a unified database layer, and a shared component library.

**Core problems solved:**
- Eliminates data latency and human error from manual spreadsheets
- Enforces correct stock reservation/deduction rules (quote → confirm → P.O.)
- Provides role-based access for Management, Sales, Accounting, and Inventory teams
- Supports multi-branch/multi-warehouse operations in real time

---

## 2. Tech Stack (Verified Versions)

All versions confirmed via Context7 MCP documentation as of 2026-03-06.

### Core Framework

| Package | Version | Purpose |
|---|---|---|
| `next` | `^16.1.x` | App framework (App Router, Server Components, Turbopack) |
| `react` | `^19.x` | UI runtime |
| `react-dom` | `^19.x` | DOM rendering |
| `typescript` | `^5.x` | Type safety across all packages |

### Monorepo Tooling

| Package | Version | Purpose |
|---|---|---|
| `pnpm` | `^9.x` | Package manager with workspace support |
| `turbo` | `^2.x` | Build orchestration, task caching, parallel execution |

### Database & ORM

| Package | Version | Purpose |
|---|---|---|
| `prisma` | `^6.x` | ORM, schema management, migrations |
| `@prisma/client` | `^6.x` | Type-safe database client |
| `@prisma/adapter-pg` | `^6.x` | PostgreSQL driver adapter |
| `pg` | `^8.x` | PostgreSQL Node.js driver |

### Authentication

| Package | Version | Purpose |
|---|---|---|
| `next-auth` | `^5.x` (Auth.js v5) | Session management, RBAC, credentials provider |
| `@auth/prisma-adapter` | `^2.x` | Auth.js ↔ Prisma session persistence |
| `bcryptjs` | `^2.x` | Password hashing |

### UI & Styling

| Package | Version | Purpose |
|---|---|---|
| `tailwindcss` | `^4.x` | Utility-first CSS framework |
| `@shadcn/ui` | `latest` | Accessible component primitives |
| `lucide-react` | `^0.4x` | Icon library |
| `recharts` | `^2.x` | Charts for dashboards and forecasting |

### Forms & Validation

| Package | Version | Purpose |
|---|---|---|
| `react-hook-form` | `^7.x` | Performant form state management |
| `zod` | `^3.x` | Schema validation (shared between client and server) |
| `@hookform/resolvers` | `^3.x` | Zod ↔ react-hook-form bridge |

### State Management & Data Fetching

| Package | Version | Purpose |
|---|---|---|
| `@tanstack/react-query` | `^5.x` | Server state, caching, optimistic updates |
| `zustand` | `^4.x` | Lightweight client state (cart, UI state) |

### Developer Tooling

| Package | Version | Purpose |
|---|---|---|
| `eslint` | `^9.x` | Linting (flat config) |
| `eslint-config-next` | `^16.x` | Next.js ESLint rules |
| `prettier` | `^3.x` | Code formatting |
| `husky` | `^9.x` | Git hooks |
| `lint-staged` | `^15.x` | Pre-commit linting |

---

## 3. Monorepo Architecture

### Directory Structure

```
furnitrack/                         ← repo root
├── apps/
│   ├── storefront/                 ← Public e-commerce site (Next.js 16)
│   │   ├── app/
│   │   │   ├── (catalog)/          ← Product listing, detail pages
│   │   │   ├── (checkout)/         ← Cart, checkout flow
│   │   │   ├── (account)/          ← Customer account, order history
│   │   │   └── api/                ← Storefront API routes
│   │   ├── components/
│   │   ├── next.config.ts
│   │   └── package.json
│   │
│   └── admin/                      ← Internal dashboard (Next.js 16)
│       ├── app/
│       │   ├── (auth)/             ← Login page
│       │   ├── (dashboard)/        ← Role-gated dashboard routes
│       │   │   ├── management/     ← Executive overview
│       │   │   ├── sales/          ← Quotations, leads, orders
│       │   │   ├── inventory/      ← Stock, warehouses, transfers
│       │   │   ├── accounting/     ← Payments, documents, approvals
│       │   │   └── reports/        ← Analytics, forecasting
│       │   └── api/                ← Admin API routes
│       ├── components/
│       ├── middleware.ts            ← Auth + RBAC enforcement
│       ├── next.config.ts
│       └── package.json
│
├── packages/
│   ├── db/                         ← Prisma schema + generated client (shared)
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── src/
│   │   │   └── index.ts            ← Re-exports PrismaClient singleton
│   │   └── package.json
│   │
│   ├── ui/                         ← Shared React component library
│   │   ├── src/
│   │   │   ├── components/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── validators/                 ← Shared Zod schemas (used by both apps)
│   │   ├── src/
│   │   │   ├── order.ts
│   │   │   ├── product.ts
│   │   │   ├── inventory.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── config/                     ← Shared configs (TS, ESLint, Tailwind)
│       ├── typescript/
│       ├── eslint/
│       ├── tailwind/
│       └── package.json
│
├── pnpm-workspace.yaml
├── turbo.json
├── package.json                    ← Root package.json (dev scripts)
└── .env.example
```

### pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "db:generate": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    }
  }
}
```

### Key next.config.ts Pattern (both apps)

```typescript
// apps/admin/next.config.ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  transpilePackages: ['@furnitrack/ui', '@furnitrack/validators'],
  turbopack: {
    root: '../../'
  }
}

export default config
```

---

## 4. Application Breakdown

### 4.1 `apps/storefront` — Public E-Commerce Site

**Purpose:** Customer-facing furniture catalog, product browsing, and order placement.

**Key Pages & Features:**

| Route | Feature |
|---|---|
| `/` | Homepage — featured collections, promotions |
| `/products` | Product catalog with filtering (category, material, price) |
| `/products/[slug]` | Product detail — dimensions, finishes, stock availability |
| `/cart` | Cart with real-time stock check |
| `/checkout` | Checkout form — contact details, delivery date, P.O. upload |
| `/account/orders` | Customer order history and status tracking |
| `/account/quotes` | Submitted quotation requests and status |

**Storefront Rules:**
- Stock availability shown in real time (no reservation at browse/cart stage)
- Quotation requests captured with: client name, company, email, business type, budget, target date
- Orders only confirmed after payment proof upload

---

### 4.2 `apps/admin` — Internal Management Dashboard

**Purpose:** Role-gated internal tool for all back-office operations.

#### Role: Management (Executive)
| Feature | Detail |
|---|---|
| KPI Cards | Daily/monthly sales, total revenue, profit margins |
| Inventory Health | Stock turnover rate, low-stock alerts |
| Operational Snapshot | Pending orders, receivables, supplier lead times |
| Mobile View | Condensed: sales summary, high-value alerts, profit snapshot |

#### Role: Sales Team
| Feature | Detail |
|---|---|
| Lead Intake | Client name, company, email, business type, budget, target date |
| Quotation Builder | Custom quotes by dimension and finish |
| Inventory Inquiry | Real-time availability check during quoting |
| Follow-up Tracker | CRM-style status management per lead |
| Sales Hand-off | Enforces P.O. details, payment confirmation, SOO request, delivery date |

#### Role: Accounting
| Feature | Detail |
|---|---|
| Calculation Engine | Auto-compute VAT (inclusive/exclusive), discounts, profit margins |
| Payment Tracker | Log Down Payment / Partial / Full with proof upload |
| Approval Portal | Price overrides, discounts, cancellations require management sign-off |
| Document Generator | One-click: Invoice, Delivery Receipt, Official Receipt (VAT-exempt option) |

#### Role: Inventory Head
| Feature | Detail |
|---|---|
| Centralized Stock Dashboard | Real-time stock status across all warehouses |
| Multi-Warehouse Toggle | Filter by branch location |
| Transfer Module | Record and track inter-branch stock transfers |
| Barcode/QR Scanner | Stock IN / Stock OUT via hardware scanner integration |
| Audit Logs | Immutable movement logs for all stock changes |
| Quality Assurance Log | Track damaged items flagged for repair/resale |
| Adjustment Approvals | Only Inventory Head can authorize stock level adjustments |

#### Role: Reports / Analytics
| Feature | Detail |
|---|---|
| Cash Flow View | Generate Cash Flow Statements |
| Project Costing | Cost breakdown per project (materials, labor, overhead) |
| Forecasting Charts | Visual forecasting: sales, inventory, material consumption |
| Performance Reports | Inventory, production, supplier performance dashboards |

---

## 5. Database Schema Overview

All models live in `packages/db/prisma/schema.prisma`. Both apps import `@furnitrack/db`.

### Core Models

```
User               → id, name, email, hashedPassword, role, branchId, createdAt
Role (enum)        → MANAGEMENT | SALES | ACCOUNTING | INVENTORY | ADMIN

Branch             → id, name, location, warehouses[]
Warehouse          → id, name, branchId, stockItems[]

Product            → id, sku, name, slug, description, category, basePrice, images[]
ProductVariant     → id, productId, finish, dimensions, priceModifier
StockItem          → id, productId (or variantId), warehouseId, qty, reservedQty, minThreshold
RawMaterial        → id, name, unit, warehouseId, qty, minThreshold

Customer           → id, name, company, email, businessType, phone
Lead               → id, customerId, budget, targetDate, status, assignedSalesId

Quotation          → id, leadId, lineItems[], totalAmount, status, createdAt
QuotationLineItem  → id, quotationId, productVariantId, qty, unitPrice, note

Order              → id, quotationId, customerId, status, poNumber, soNumber
                     deliveryDate, isRush, paymentStatus, totalAmount
OrderLineItem      → id, orderId, productVariantId, qty, unitPrice

Payment            → id, orderId, type (DOWN|PARTIAL|FULL), amount, proofUrl, confirmedAt
StockMovement      → id, stockItemId, type (IN|OUT|TRANSFER|ADJUSTMENT|DAMAGED)
                     qty, referenceId, performedBy, note, createdAt
StockTransfer      → id, fromWarehouseId, toWarehouseId, items[], status, requestedBy

Invoice            → id, orderId, invoiceNumber, vatType, totalAmount, generatedAt
DeliveryReceipt    → id, orderId, drNumber, deliveredAt
OfficialReceipt    → id, invoiceId, orNumber, isVatExempt, issuedAt

Notification       → id, type, targetRole, message, referenceId, isRead, createdAt
AuditLog           → id, action, entityType, entityId, performedBy, changedData, createdAt
```

### Stock State Machine

```
Available Stock
    ↓ (order confirmed)
Reserved Stock
    ↓ (P.O. confirmed)
Deducted / In Production (SOO created)
    ↓ (production complete)
Finished Goods → Delivered
```

Custom items trigger automatic raw material deduction at the SOO creation stage.

---

## 6. API Design

Both apps use **Next.js Route Handlers** (`app/api/`) with typed request/response using Zod validators from `@furnitrack/validators`.

### Convention

```
POST   /api/[resource]          → Create
GET    /api/[resource]          → List (with query params for filter/pagination)
GET    /api/[resource]/[id]     → Get single
PATCH  /api/[resource]/[id]     → Update
DELETE /api/[resource]/[id]     → Delete (soft delete where applicable)
```

### Admin API Route Groups

```
/api/auth/[...nextauth]         → Auth.js handlers

/api/products                   → Product CRUD
/api/products/[id]/variants     → Variant management

/api/stock                      → Stock levels by warehouse
/api/stock/[id]/adjust          → Inventory Head only — stock adjustment
/api/stock/movements            → Movement log (append-only)
/api/stock/transfers            → Inter-branch transfer requests

/api/leads                      → Lead management
/api/quotations                 → Quotation CRUD + line items
/api/orders                     → Order management + status transitions
/api/orders/[id]/reserve        → Trigger stock reservation
/api/orders/[id]/confirm        → Trigger stock deduction (P.O. confirmed)

/api/payments                   → Payment logging with proof upload
/api/approvals                  → Price override / discount / cancel approvals

/api/documents/invoice/[id]     → Generate invoice PDF
/api/documents/dr/[id]          → Generate delivery receipt PDF
/api/documents/or/[id]          → Generate official receipt PDF

/api/reports/cashflow           → Cash flow statement data
/api/reports/forecasting        → Sales + inventory forecasting data
/api/reports/performance        → Inventory, production, supplier reports

/api/notifications              → Alert feed for authenticated user
```

### Storefront API Route Groups

```
/api/products                   → Public product catalog (read-only)
/api/products/[slug]            → Product detail + real-time stock check
/api/quotes/request             → Submit quotation request
/api/orders/[id]/status         → Customer order status (authenticated)
```

---

## 7. Authentication & Authorization

### Auth.js v5 (next-auth ^5.x) with Credentials Provider

- Sessions stored via JWT strategy (stateless, edge-compatible)
- Passwords hashed with `bcryptjs`
- `@auth/prisma-adapter` persists sessions to PostgreSQL

### Role Definitions

| Role | Access Scope |
|---|---|
| `ADMIN` | Full system access |
| `MANAGEMENT` | Executive dashboard, all read access, approval actions |
| `SALES` | Leads, quotations, orders, inventory inquiry (read) |
| `ACCOUNTING` | Payments, documents, approval portal, financial reports |
| `INVENTORY` | Stock dashboard, movements, transfers, adjustments |

### Middleware (apps/admin/middleware.ts)

```typescript
import { auth } from "@/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const role = req.auth?.user?.role

  if (!req.auth) {
    return Response.redirect(new URL("/login", req.nextUrl))
  }

  // Route-level RBAC guards
  const guards: Record<string, string[]> = {
    "/inventory":  ["ADMIN", "INVENTORY", "MANAGEMENT"],
    "/accounting": ["ADMIN", "ACCOUNTING", "MANAGEMENT"],
    "/sales":      ["ADMIN", "SALES", "MANAGEMENT"],
    "/reports":    ["ADMIN", "MANAGEMENT", "ACCOUNTING"],
    "/management": ["ADMIN", "MANAGEMENT"],
  }

  for (const [prefix, allowedRoles] of Object.entries(guards)) {
    if (pathname.startsWith(prefix) && !allowedRoles.includes(role ?? "")) {
      return Response.redirect(new URL("/unauthorized", req.nextUrl))
    }
  }
})

export const config = {
  matcher: ["/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)"]
}
```

---

## 8. Environment & Infrastructure

### Environment Variables

```bash
# .env (shared via packages/db)
DATABASE_URL="postgresql://user:password@localhost:5432/furnitrack"

# apps/admin/.env.local
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3001"

# apps/storefront/.env.local
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# File uploads (payment proofs, product images)
UPLOAD_STORAGE="local" # or "s3"
AWS_S3_BUCKET="..."
AWS_REGION="..."
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
```

### Local Dev Ports

| App | Port |
|---|---|
| `apps/storefront` | `3000` |
| `apps/admin` | `3001` |
| PostgreSQL | `5432` |

### Scripts (root package.json)

```json
{
  "scripts": {
    "dev":        "turbo run dev",
    "build":      "turbo run build",
    "lint":       "turbo run lint",
    "typecheck":  "turbo run typecheck",
    "db:generate":"turbo run db:generate --filter=@furnitrack/db",
    "db:migrate": "turbo run db:migrate --filter=@furnitrack/db",
    "db:studio":  "pnpm --filter=@furnitrack/db prisma studio"
  }
}
```

### Deployment Strategy

| App | Target |
|---|---|
| `apps/storefront` | Vercel (automatic preview + prod deployments) |
| `apps/admin` | Vercel or self-hosted (restricted access, VPN optional) |
| PostgreSQL | Neon (serverless Postgres) or Supabase |
| File Storage | AWS S3 or Cloudflare R2 |

---

## 9. Implementation Phases

### Phase 1 — Foundation (Monorepo Bootstrap)
- Initialize pnpm workspace + Turborepo
- Create `apps/storefront`, `apps/admin`, `packages/db`, `packages/ui`, `packages/validators`, `packages/config`
- Configure shared TypeScript, ESLint, Tailwind configs
- Set up PostgreSQL + Prisma schema (core models: User, Product, Branch, Warehouse, StockItem)
- Implement Auth.js v5 with credentials provider + RBAC middleware in admin app
- Basic login page and role-based layout shells for admin

**Deliverable:** Working monorepo, authenticated admin shell, DB connected

---

### Phase 2 — Product Catalog & Storefront
- Build storefront product catalog (listing, detail, filtering)
- Implement real-time stock availability check on product detail page
- Quotation request form (lead intake)
- Basic cart (no payment yet — storefront is inquiry/order-first)
- Product management CRUD in admin (Inventory Head / Admin roles)

**Deliverable:** Customers can browse furniture and submit quotation requests

---

### Phase 3 — Sales & Quotation Workflow (Admin)
- Lead intake and management UI
- Quotation builder with line items, dimensions, finishes
- Inventory inquiry tool within quotation builder
- Follow-up tracker (CRM-style status board)
- Sales hand-off enforcement: P.O., payment confirmation, SOO request, delivery date fields
- Stock reservation trigger on order confirmation

**Deliverable:** Full sales → quotation → order confirmation flow

---

### Phase 4 — Inventory & Warehouse Management (Admin)
- Centralized stock dashboard with multi-warehouse toggle
- Stock movement logging (IN/OUT/TRANSFER/ADJUSTMENT/DAMAGED)
- Inter-branch transfer module with approval workflow
- Barcode/QR scan integration (Web API or mobile-compatible interface)
- Minimum threshold configuration + automated low-stock alerts
- Audit log viewer (immutable, append-only)
- Quality assurance log for damaged items

**Deliverable:** Full inventory control replacing Google Drive sheets

---

### Phase 5 — Accounting & Financial Controls (Admin)
- VAT calculation engine (inclusive/exclusive) per order
- Payment tracking module (Down Payment / Partial / Full + proof upload)
- Approval portal for price overrides, discounts, cancellations
- Document generator: Invoice, Delivery Receipt, Official Receipt (PDF)
- P.O. deduction trigger → stock officially deducted

**Deliverable:** Complete accounting workflow with document generation

---

### Phase 6 — Reporting & Analytics (Admin)
- Management KPI dashboard (daily/monthly sales, revenue, margins)
- Cash Flow Statement view
- Project costing breakdown (materials, labor, overhead)
- Forecasting charts (sales, inventory, material consumption) using Recharts
- Performance reports: inventory, production, supplier

**Deliverable:** Full analytics and reporting layer

---

### Phase 7 — Notifications, Polish & Production Hardening
- Real-time notification system (low-stock alerts, movement alerts, approval requests)
- Mobile-optimized management view
- End-to-end testing (critical business logic: stock rules, RBAC, order flow)
- Performance audit (image optimization, query optimization, caching)
- Production deployment setup (Vercel + Neon)

**Deliverable:** Production-ready system

---

## 10. Success Criteria

### Technical
- [ ] Monorepo builds cleanly with `turbo run build` from root
- [ ] Zero cross-app dependency leakage (apps only import from `packages/`)
- [ ] All API routes are typed end-to-end (Zod validators + Prisma types)
- [ ] RBAC enforced at middleware level — no role can access unauthorized routes
- [ ] All stock movements logged to immutable audit table

### Business Logic
- [ ] Stock is NOT reserved during quotation stage
- [ ] Stock IS reserved automatically on order confirmation
- [ ] Stock IS deducted only after P.O. confirmation
- [ ] Custom items trigger raw material deduction at SOO creation
- [ ] Cancelled orders are voided (not deleted) in the system
- [ ] Returns only accepted when error originates from company; returned items restore available stock immediately
- [ ] Low-stock alerts fire at minimum threshold per item

### User Experience
- [ ] Management dashboard loads KPI cards in under 2 seconds
- [ ] Sales team can complete a full quotation in under 5 minutes
- [ ] Inventory head can scan and record a stock movement in under 30 seconds
- [ ] Document generation (Invoice/DR/OR) completes in under 3 seconds

---

*Document maintained alongside implementation. Update version and date on significant changes.*
