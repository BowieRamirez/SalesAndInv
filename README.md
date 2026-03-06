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
    ├── db/                  # @furnitrack/db — Prisma schema + typed mock fixtures
    ├── ui/                  # @furnitrack/ui — shared component library (shadcn/ui wrappers)
    └── validators/          # @furnitrack/validators — Zod schemas for all domain entities
```

---

## User Roles

| Role | Description |
|------|-------------|
| `ADMIN` | Full system access — user management and configuration |
| `MANAGEMENT` | KPI dashboard, reports, and business overview |
| `SALES` | Lead tracking, quotation creation, and order management |
| `ACCOUNTING` | Payment verification, invoicing, and financial controls |
| `INVENTORY` | Stock management, warehouse tracking, and transfer requests |

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
pnpm --filter admin dev

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

| Phase | Name | Status |
|-------|------|--------|
| 1 | Monorepo Foundation | ✅ Complete |
| 2 | Product Catalog & Storefront | 🔜 Next |
| 3 | Sales & Quotation Workflow | ⏳ Planned |
| 4 | Inventory & Warehouse Management | ⏳ Planned |
| 5 | Accounting & Financial Controls | ⏳ Planned |
| 6 | Reporting, Notifications & Polish | ⏳ Planned |
