# Phase 1 Context: Monorepo Foundation

**Phase:** 1 — Monorepo Foundation
**Created:** 2026-03-06
**Status:** Ready for research and planning

---

## What This Phase Builds

The shared infrastructure layer: 4 packages (config, validators, db/mock, ui) and scaffolded
app directories — no screens, no routes, no real data. Every downstream phase imports from
these packages without touching the package internals.

**Phase boundary is fixed. Nothing below changes it.**

---

## Decision Area 1: Mock Data Depth

### Products
- **Count:** 10–12 products total
- **Categories represented:** Living Room, Bedroom, Dining, Office, Storage, Lighting (enough for filter sidebar to have content)
- **Required fields per product:**
  ```
  id, slug, name, category, material, price, originalPrice (nullable),
  badge (BEST_SELLER | SALE | HOT | null), stockStatus (IN_STOCK | LOW_STOCK | OUT_OF_STOCK),
  colorVariants: [{ name: string, hex: string }],
  images: string[],
  rating: number, reviewCount: number,
  description: string,
  dimensions: { width: number, depth: number, height: number, weight: number }
  ```
- **Note:** No `qty_available` / `qty_reserved` / `qty_in_production` at the product level.
  Those fields live on the warehouse stock fixtures (Phase 5 territory). Product carries
  `stockStatus` enum only.

### Non-product entities (moderate dataset — realistic list fills)
| Entity | Count | Notes |
|--------|-------|-------|
| leads | 5–8 | Spread across CRM stages (New/Quoted/Negotiating/Confirmed/Closed) |
| quotations | 5–8 | Mix of statuses (Draft/Sent/In Review/Confirmed/Rejected) |
| orders | 3–5 | Referenced by quotations for lineage display |
| payments | 3–5 | Down Payment / Partial / Full entries |
| KPIs | 1 object | All management dashboard fields (see below) |
| warehouses | 2–3 | Branch names for multi-warehouse toggle |
| users | 5 | One per role (MANAGEMENT, SALES, ACCOUNTING, INVENTORY, ADMIN) |

### KPI fixture shape (covers MGMT-01 through MGMT-03)
```
{
  dailySales: number,
  monthlySales: number,
  revenue: number,
  profitMargin: number,       // percentage
  activeOrders: number,
  pendingOrders: number,
  outstandingReceivables: number,
  supplierLeadTimeDays: number,
  lowStockAlertCount: number,
  stockTurnover: number,      // ratio
  // trend indicators (for MGMT-01 stat cards)
  revenueChange: number,      // % vs last period
  salesChange: number,
  profitChange: number,
  ordersChange: number
}
```

### Fixture file location
`packages/db/src/mock/` — one file per entity:
`products.ts`, `leads.ts`, `quotations.ts`, `orders.ts`, `payments.ts`,
`kpis.ts`, `warehouses.ts`, `users.ts`

All exported from `packages/db/src/mock/index.ts` as `@furnitrack/db/mock`.

---

## Decision Area 2: Tailwind v4 vs v3.4 Fallback

### Resolution protocol
1. Scaffold one app (`apps/storefront`) first
2. Run `shadcn/ui init` — if CLI errors, immediately fall back
3. Render a smoke-test page using brand tokens + at least one shadcn component (Button)
4. If any styles render incorrectly (wrong colors, broken utility classes), fall back to v3.4.x
5. Document outcome in PROJECT.md Key Decisions table

### Fallback trigger
**Any** rendering failure — colors wrong, utilities not applying, component unstyled. Do not
attempt workarounds; just pin to v3.4.x and document the specific error encountered.

### Token definition strategy
- **If v4 confirmed:** Use `@theme inline` CSS variable syntax in `tokens.css`
- **If v3.4.x fallback:** Use `tailwind.config.ts` `extend.colors` / `extend.spacing`
- Token names stay identical either way — only the syntax differs

### Decision record location
`PROJECT.md` Key Decisions table + both apps pin the same resolved version.
The `packages/config` Tailwind base config reflects whichever version was chosen.

---

## Decision Area 3: Shared UI Components (packages/ui)

### Phase 1 scope — primitives only
Build only what's needed to verify the design system works. All other components are built
in the phase that first uses them.

**Phase 1 builds:**
| Component | Purpose |
|-----------|---------|
| Button | Primary, secondary, ghost variants; brand token colors |
| Badge | BEST_SELLER, SALE, HOT, OUT_OF_STOCK, LOW_STOCK variants |
| Card | Base container with shadow and padding tokens |
| Input | Text input with label and error state |
| Smoke-test page | Renders Button + Badge + Card with brand tokens in both apps |

**Built in later phases (not Phase 1):**
Select, DataTable, StatCard, ChartWrapper, Modal, Tabs, Sidebar, Notification, form primitives

### shadcn/ui integration pattern
- `shadcn/ui init` runs inside `packages/ui`
- Each shadcn primitive is **wrapped** with a FurniTrack-specific component that:
  - Applies brand token class names by default
  - Exposes only the prop surface needed by FurniTrack screens
  - Is the only export — consuming code never imports raw shadcn directly
- Example: `import { Button } from "@furnitrack/ui"` — not `import { Button } from "@/components/ui/button"`

### ProductCard boundary
**Lives in `apps/storefront`**, not `packages/ui`. It is a storefront-specific composition
built from shared primitives (Card, Badge). Phase 3 builds it.

### Smoke test definition
A single `/design-system` route in both apps that renders:
- One Button in each variant (primary, secondary, ghost)
- One Badge in each variant (BEST_SELLER, SALE, HOT, OUT_OF_STOCK)
- One Card with sample content
- Colors must match: navy header, coral/red prices, gold CTA
If it renders correctly → design system verified. Captured in Phase 1 success criteria.

---

## Decision Area 4: Brand Identity

### Storefront brand name
**FurniTrack** — used as-is on the storefront nav, footer, and homepage hero.
No separate consumer-facing name.

### Logo treatment (Phase 1)
Placeholder: `<span className="font-bold text-xl">FurniTrack</span>` — no SVG, no image asset.
Real logo deferred to a later polish phase.

### Design token naming
**Literal color names** — matches the reference designs and is self-documenting:

```css
/* packages/config/src/tailwind/tokens.css */
--color-navy: #1a1a2e;           /* primary background, nav, footer */
--color-coral: #e74c3c;          /* prices, sale badges, danger */
--color-gold: #c9a84c;           /* CTA buttons, accent highlights */
--color-beige: #f5f0e8;          /* neutral background, product card bg */
--color-charcoal: #2d2d2d;       /* body text */
--color-muted: #9ca3af;          /* secondary text, strikethrough prices */
--color-white: #ffffff;          /* card backgrounds, clean spacing */
```

**Hex values above are approximate** — Phase 1 should verify against the reference designs
using the image analyzer output. Adjust if off.

### Token file location
`packages/config/src/tailwind/tokens.css` — single source of truth.
Both apps import this file in their `globals.css`:
```css
@import "@furnitrack/config/tailwind/tokens.css";
```

---

## Code Context (from design analysis)

### What the reference designs confirmed

**Homepage (not logged in):**
- Dark navy header + footer, white/beige content area
- Hero: large banner + 3 room-type promo cards
- Product sections: "New Arrivals", "Curated For You", "Trending Now" — each 4-column grid
- Trust bar: Free shipping $500+ / 5-year warranty / 30-day returns / 24/7 support
- Badges: BEST SELLER (red), SALE (red), stock count visible on cards ("9 items left")
- Bottom CTA block: full-width banner

**Shop/Catalog page:**
- Left filter sidebar: Category (with counts), Material, Price slider ($0–$2000), Color swatches
- 3-column product grid
- Breadcrumb: Home > Furniture
- Result count: "13 results for furniture"
- Sort dropdown + Filter/Reset buttons
- Product card includes: posted date ("X days ago"), original price struck-through

**Product detail page:**
- Left: large product image
- Right: name, BEST SELLER badge (gold/yellow), star rating (4.9 / 203 reviews), price + savings,
  description, color variant picker (Emerald/Blush/Mustard), "Inquire Now — Message Us" CTA (gold)
- Trust indicators: Free shipping / 30-day returns / 5-year warranty
- Tabs: Description | Specifications | Reviews
- "You May Also Like" section: 4-product carousel

### Component inventory implied by designs
These are storefront components — built in Phase 3, not Phase 1. Listed here so Phase 1
mock data and shared primitives are shaped correctly to support them:

- `ProductCard` — image, category label, name, price, originalPrice, badge, stockCount
- `FilterSidebar` — category checkboxes with counts, material list, price range slider, color swatches
- `TrustBar` — 4 trust indicators with icons
- `HeroBanner` — full-width image with overlay text and CTA buttons
- `PromoCard` — room-type image card with label and discount text
- `ProductDetailGallery` — large image, possibly thumbnails
- `ColorVariantPicker` — swatch buttons with selected state
- `InquireButton` — gold CTA button with message icon
- `TabGroup` — Description / Specifications / Reviews
- `RelatedProducts` — 4-card carousel row

---

## Constraints Carried Forward

- **No `"Add to Cart"` button in Phase 3** — Cart is Phase 6 (STOR-04). Product detail shows
  "Inquire Now — Message Us" only. This is intentional per the B2B quotation flow.
- **No real auth in Phase 1** — MockAuthProvider context built in Phase 2 (SHEL-04).
  Phase 1 has no auth at all.
- **Prisma schema is reference-only** — `packages/db/prisma/schema.prisma` defines entity
  shapes but no migrations run. Mock fixture TypeScript types must align with Prisma-generated
  types when they exist.
- **React 19 peer dep warnings** — react-hook-form, Recharts, Zustand may warn at install.
  Verify actual compatibility before production component use. Document in STATE.md blockers.

---

## Deferred Ideas (out of scope — do not act on)

- Language/currency selector (designs show English + flag icon — not in requirements)
- "Recently viewed" product section
- Wishlist / favorites functionality
- Customer reviews form (read-only display only per STOR-03)
- Real-time stock count updates
- Promotional countdown timers

---

*Context created: 2026-03-06*
*Next step: Run `/gsd:plan-phase 1` — this file is the primary input for the planner*
