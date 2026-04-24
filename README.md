# FurniTrack

> Integrated E-Commerce & Furniture Business Management System

A dual-app monorepo for a furniture business — a public-facing storefront for browsing and inquiries, and an internal admin dashboard for managing sales, inventory, accounting, and operations. Built with a shared component library and type-safe data layer across both apps.

---

## Tech Stack

### Core
![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat&logo=typescript&logoColor=white)

### Monorepo
![pnpm](https://img.shields.io/badge/pnpm_9-F69220?style=flat&logo=pnpm&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo_2-EF4444?style=flat&logo=turborepo&logoColor=white)

### Data & Validation
![Prisma](https://img.shields.io/badge/Prisma_6-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Zod](https://img.shields.io/badge/Zod_3-3E67B1?style=flat&logo=zod&logoColor=white)

### UI
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat&logo=shadcnui&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_Icons-F56565?style=flat&logo=lucide&logoColor=white)

### State & Forms
![React Query](https://img.shields.io/badge/React_Query_5-FF4154?style=flat&logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand_4-433E38?style=flat&logo=zustand&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form_7-EC5990?style=flat&logo=reacthookform&logoColor=white)

---

## Monorepo Structure

```
furnitrack/
├── apps/
│   ├── storefront/          # Public e-commerce site (Next.js, port 3000)
│   └── admin/               # Internal management dashboard (Next.js, port 3001)
│
└── packages/
    ├── config/              # @furnitrack/config — shared TS, ESLint, and Tailwind configs
    ├── db/                  # @furnitrack/db — Prisma schema + Neon-backed data access
    ├── ui/                  # @furnitrack/ui — shared component library (shadcn/ui wrappers)
    └── validators/          # @furnitrack/validators — Zod schemas for all domain entities
```

---

## Key Features

### 🏢 Multi-Warehouse Inventory
*   **Location Tracking:** Monitor stock levels across multiple warehouses and branches.
*   **Real-time Stock Levels:** Instant visibility into product availability with SKU-level precision.
*   **Low Stock Alerts:** Automated indicators for items requiring replenishment.
*   **Capacity Management:** Visual tracking of warehouse storage utilization.

### 👥 Role-Based Dashboards
*   **Admin / Management:** User administration, company code control, reports, and audit oversight.
*   **Sales:** Lead management, quotation generation, approvals, and sales order processing.
*   **Accounting:** Payment verification, billing basis, and financial monitoring.
*   **Inventory:** Stock transfers, audits, and warehouse operations.
*   **Operations / Design:** Design handling, delivery readiness, and company code confirmation.

### 🛍️ Integrated Storefront
*   **Digital Catalog:** Modern, visually rich product browsing for customers.
*   **Seamless Inquiries:** Direct integration between the storefront and internal sales workflows.

### 🔐 Security & Reliability
*   **Neon Auth:** Secure authentication with role-based metadata for granular access control.
*   **Type-Safe Architecture:** Shared validators and business logic ensuring data integrity across both apps.

---

## User Roles

| Role | Description |
| --- | --- |
| `ADMIN_MANAGEMENT` | User management, company code ownership, reports, and audit oversight |
| `SALES` | Lead tracking, quotation creation, approvals, and sales order management |
| `INVENTORY` | Stock management, movement logging, and stock request approvals |
| `ACCOUNTING` | Payment tracking, verification, balances, and financial approval |
| `OPERATIONS_DESIGN` | Design handling, company code confirmation, and delivery scheduling |
| `CLIENT` | Limited portal access to matching-company records only |

---

## Test Accounts

Admin accounts are now managed via **Neon Auth** (powered by Better Auth) and stored in your Neon database — no hardcoded credentials.

### Creating Admin Accounts

1. Go to the [Neon Console](https://console.neon.tech) → your project → **Auth**
2. Under **Users**, click **Add user** to create accounts for each role
3. Set a `role` field in the user's metadata matching one of: `ADMIN_MANAGEMENT`, `SALES`, `INVENTORY`, `ACCOUNTING`, `OPERATIONS_DESIGN`, `CLIENT`

| Role / Dashboard | Suggested Email | `role` metadata value |
| --- | --- | --- |
| Admin / Management | `admin@sims.com` | `ADMIN_MANAGEMENT` |
| Sales | `sales@sims.com` | `SALES` |
| Inventory | `inventory@sims.com` | `INVENTORY` |
| Accounting | `accounting@sims.com` | `ACCOUNTING` |
| Operations / Design | `operations@sims.com` | `OPERATIONS_DESIGN` |
| Client | `client@acme.com` | `CLIENT` |

### Customer Portal (`localhost:3000/sign-in`)

| Role     | Email               | Password       |
| -------- | ------------------- | -------------- |
| Customer | `customer@sims.com` | *any password* |


---

## Prerequisites

- **Node.js** `>=20`
- **pnpm** `>=9` — install via `npm install -g pnpm`

---

## Getting Started

### Install dependencies

```bash
pnpm install
```

### Run in development

```bash
# Storefront — http://localhost:3000
pnpm --filter storefront dev

# Admin dashboard — http://localhost:3001
pnpm --filter admin devpnpm --filter admin dev

# Both apps simultaneously
pnpm dev
```

### Design system smoke test

```bash
# Verify brand tokens and shared components render correctly
open http://localhost:3000/design-system
open http://localhost:3001/design-system
```

### Typecheck & build

```bash
# Typecheck all packages
pnpm turbo typecheck

# Build all packages and apps
pnpm turbo build
```

---

## Project Status

| Phase | Name                              | Status     |
| ----- | --------------------------------- | ---------- |
| 1     | Monorepo Foundation               | ✅ Complete |
| 2     | Product Catalog & Storefront      | 🔜 Next     |
| 3     | Sales & Quotation Workflow        | ⏳ Planned  |
| 4     | Inventory & Warehouse Management  | ⏳ Planned  |
| 5     | Accounting & Financial Controls   | ⏳ Planned  |
| 6     | Reporting, Notifications & Polish | ⏳ Planned  |

## Solution Design

The updated minimized-role architecture, schema, workflow, permission matrix, API structure, and implementation notes live in [docs/minimized-role-business-system.md](./docs/minimized-role-business-system.md).
