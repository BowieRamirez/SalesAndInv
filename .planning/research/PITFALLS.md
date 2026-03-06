# Pitfalls Research

**Domain:** Next.js 16 pnpm monorepo — ERP admin dashboard + e-commerce storefront (UI mockup phase)
**Researched:** 2026-03-06
**Confidence:** MEDIUM — training knowledge through Jan 2025; web sources unavailable during this session. Tailwind v4 and Next.js 16 specifics based on beta/RC knowledge; flag for verification against final release docs.

---

## Critical Pitfalls

### Pitfall 1: Tailwind v4 CSS-first config breaks every shadcn/ui assumption

**What goes wrong:**
shadcn/ui was designed against Tailwind v3, which uses `tailwind.config.js` with a `content` array, a `theme.extend` object, and CSS variable tokens mapped through JS. Tailwind v4 abandons the JS config file entirely — configuration moves to `@import "tailwindcss"` and `@theme` blocks in CSS. shadcn/ui's component registry, its `components.json`, and the CLI that injects components all assume the v3 JS config shape. When you run `shadcn init` against a v4 project, it either fails silently, writes a v3 config that overrides v4's CSS-first setup, or installs components with broken CSS variable references (e.g., `--background`, `--primary`, `--ring`) that don't resolve because the v4 `@theme` block and the v3 CSS var naming conventions differ.

**Why it happens:**
Teams see "shadcn/ui supports Tailwind v4" in docs or blog posts without verifying whether their exact shadcn/ui CLI version has shipped that support. The shadcn/ui team tracks Tailwind releases but there is typically a lag. Beta/RC shadcn changes for v4 compatibility can be incomplete.

**How to avoid:**
1. Before initializing the monorepo, verify the current shadcn/ui CLI version's stated Tailwind v4 compatibility status in the official changelog at `https://ui.shadcn.com/docs/changelog`.
2. If v4 support is confirmed: use the CSS `@theme` block in `packages/config/tailwind/global.css` to define all design tokens, not `tailwind.config.js`.
3. If v4 support is NOT yet confirmed: pin Tailwind to `^3.4.x` for the UI mockup phase and migrate to v4 in a dedicated hardening phase — the visual output is identical for this project's needs.
4. Never mix v3 `tailwind.config.js` `theme.extend.colors` with v4 `@theme` CSS variables in the same project.

**Warning signs:**
- shadcn/ui `Button` renders with no background color despite Tailwind classes being present.
- CSS variables like `--primary` or `--card` resolve to `undefined` in browser DevTools.
- `npx shadcn init` produces a `tailwind.config.ts` file after you've already set up v4 CSS-first config.
- Dark mode toggle has no visible effect despite `dark:` classes existing.

**Phase to address:** Phase 1 (Monorepo Bootstrap) — must be resolved before any UI component work begins.

---

### Pitfall 2: Shared `packages/ui` CSS not compiled into consuming apps

**What goes wrong:**
The `packages/ui` package exports React components that use Tailwind utility classes. The consuming apps (`apps/admin`, `apps/storefront`) run their own Tailwind builds. If Tailwind's content scanner doesn't reach the source files inside `packages/ui`, all Tailwind classes used in shared components are purged from the final CSS. Components render as unstyled HTML.

**Why it happens:**
Tailwind's content scanner only processes files within each app's own file tree by default. A `packages/ui/src/components/Button.tsx` that uses `className="bg-primary px-4 py-2"` is outside the app's directory and its classes get stripped at build time. This is one of the most common monorepo Tailwind mistakes and it's silent — no build error, just missing styles.

**How to avoid:**
In each app's Tailwind config (or `@import` directive in v4), explicitly include the `packages/ui/src` path:

For Tailwind v3 in `tailwind.config.ts`:
```ts
content: [
  "./src/**/*.{ts,tsx}",
  "../../packages/ui/src/**/*.{ts,tsx}",  // ← required
]
```

For Tailwind v4 in the app's CSS entry point:
```css
@import "tailwindcss";
@source "../../packages/ui/src";  /* ← required */
```

Additionally, `transpilePackages` in `next.config.ts` must include `@furnitrack/ui` so Next.js processes the JSX from the package (already present in the planning doc, but easy to omit when adding new packages).

**Warning signs:**
- Shared components look unstyled in the browser but styled in Storybook.
- Adding a class to an app-local component works; the same class in a `packages/ui` component has no effect.
- `npm run build` produces smaller CSS than expected.

**Phase to address:** Phase 1 (Monorepo Bootstrap) — verify with a styled smoke-test component before building any real UI.

---

### Pitfall 3: Mock data architecture that blocks real backend integration

**What goes wrong:**
During the UI mockup phase, mock data gets embedded directly into components, pages, and layouts as inline `const` arrays or hardcoded JSX. When backend integration begins, every single component must be refactored to accept data as props or fetch it from a real source. This is not just tedious — it reveals that component APIs were never designed to handle loading states, empty states, error states, or pagination because mock data always "succeeds" instantly with a full dataset.

**Why it happens:**
Speed. `const products = [{ id: 1, name: "Sofa" }]` is faster to write than a proper data layer. During mockup phase there's no perceived cost — it all looks correct. The cost surfaces entirely in the backend integration milestone.

**How to avoid:**
Establish a mock data layer at `packages/mock-data/` (or `apps/admin/lib/mock/`) from day one. Components never import mock data directly — they receive data via props or a data-fetching hook interface. Mock data is injected at the page/route level only.

Pattern to enforce:
```ts
// WRONG — in a component
const orders = [{ id: 1, status: "pending" }]

// RIGHT — component is agnostic
function OrderTable({ orders }: { orders: Order[] }) { ... }

// RIGHT — page injects mock data (swappable with real fetch later)
import { mockOrders } from "@/lib/mock/orders"
export default function OrdersPage() {
  return <OrderTable orders={mockOrders} />
}
```

Also: define TypeScript interfaces for all data shapes in `packages/validators/` (as Zod schemas) now, not later. The mock data must conform to the same schema the real API will return. This ensures zero type changes at integration time.

**Warning signs:**
- Components import from `"../data/mockProducts"` or similar paths.
- No `loading`, `error`, or `empty` prop/state on any data-displaying component.
- Mock arrays are defined inside component files rather than in a central location.
- TypeScript types for mock data are `any` or inline ad-hoc shapes.

**Phase to address:** Phase 1 establishes the pattern; enforced in every subsequent phase of the UI mockup milestone.

---

### Pitfall 4: Role-based layout via URL structure without a mock auth context

**What goes wrong:**
The admin app has 5 distinct roles, each with different sidebar items, accessible routes, and visible components. In a UI mockup, there's no real Auth.js session. Teams commonly build layouts with hardcoded role checks (`if (role === "SALES")`) where `role` is a hardcoded string constant — or worse, they build only one role's UI and leave the others for "later." The result: role switching never gets tested, the management mobile view never gets built, and cross-role navigation reveals broken layouts when a demo is given.

**Why it happens:**
Auth UI is deferred because "it's not real auth." But the role context affects the entire layout tree — sidebar, breadcrumbs, header, accessible routes, and visible action buttons all depend on role.

**How to avoid:**
Create a `MockAuthProvider` (React context) at the app level that stores the current demo role and exposes it via a `useRole()` hook. Add a visible "Demo Role Switcher" component to the admin app layout — a dropdown that lets anyone switch between all 5 roles. Every layout, sidebar, and guard component reads from `useRole()`, not from a hardcoded constant.

```ts
// apps/admin/lib/mock-auth.tsx
export const MockAuthContext = createContext<{ role: Role; setRole: ... }>()
export function useRole() { return useContext(MockAuthContext).role }

// Layout uses:
const role = useRole()
const navItems = NAV_CONFIG[role]
```

This provider is replaced by the real Auth.js session in the backend milestone — but the `useRole()` hook interface stays identical, meaning zero component changes.

**Warning signs:**
- Role is imported as a top-level constant (`const CURRENT_ROLE = "SALES"`).
- Sidebar navigation items are hardcoded rather than driven by a config object keyed by role.
- No way to see what the Management or Inventory UI looks like without code changes.
- The `/management`, `/sales`, `/inventory` routes all render the same sidebar.

**Phase to address:** Phase 1 (admin app shell setup) — the mock auth context must be in place before any role-specific UI is built.

---

### Pitfall 5: pnpm monorepo workspace protocol violations causing phantom dependency bugs

**What goes wrong:**
Packages in the monorepo reference each other using `"@furnitrack/ui": "workspace:*"`. If any package in `packages/` is imported by an app without being listed in that app's `package.json` dependencies, pnpm resolves it anyway in development (hoisting) but the build fails on CI or Vercel because `workspace:*` resolution is not available in production installs without the explicit declaration. Alternatively, a package is listed as a dependency but its own `package.json` `exports` map doesn't include the right entry points, causing `Cannot find module` errors only during `turbo run build`.

**Why it happens:**
Development works because Node.js module resolution finds packages through the hoisted `node_modules`. The problem only surfaces in isolated builds or fresh CI environments where hoisting behavior differs.

**How to avoid:**
- Every app's `package.json` must explicitly list every `@furnitrack/*` package it uses: `"@furnitrack/ui": "workspace:*"`.
- Every `packages/*` package must have a correct `exports` field in `package.json` pointing to its compiled or source entry point.
- Add `"strict-peer-dependencies": false` and `"shamefully-hoist": false` in `.npmrc` to prevent accidental phantom dependency reliance.
- Run `pnpm install --frozen-lockfile` locally before every push to catch lockfile drift.
- Turbo's `dependsOn: ["^build"]` in `turbo.json` ensures packages are built before apps — do not remove this.

**Warning signs:**
- `Cannot find module '@furnitrack/ui'` errors only in CI, not locally.
- `turbo run build` succeeds but `turbo run build --filter=apps/admin` fails.
- Adding a new shared package works locally but breaks the Vercel deployment.
- TypeScript can resolve types but runtime crashes with module not found.

**Phase to address:** Phase 1 (Monorepo Bootstrap) — verify with `pnpm install --frozen-lockfile && turbo run build` from root on a clean checkout.

---

### Pitfall 6: Recharts (and other client-only libraries) breaking Server Components

**What goes wrong:**
Next.js App Router defaults all components to React Server Components (RSC). Recharts, Zustand, react-hook-form, and any library using React hooks or browser APIs (`window`, `document`, `useEffect`) cannot run in RSC context. The error — `Error: useState can only be called in a Client Component` — appears at runtime, not build time. In an ERP dashboard with many charts and interactive forms, this affects a large portion of the codebase.

**Why it happens:**
The App Router's RSC default is new behavior vs. Pages Router. Teams migrating patterns from tutorials or copying components forget to add `"use client"` directives. The problem compounds in a monorepo because shared components in `packages/ui` that use hooks need `"use client"` at their level, but if the package doesn't ship that directive (e.g., because it's compiled away), consuming apps fail.

**How to avoid:**
- Any component in `packages/ui` that uses React hooks must include `"use client"` as its first line.
- Chart wrapper components, form components, and any component with interactive state belong in a `client-components/` subdirectory with explicit `"use client"`.
- Page-level Server Components should fetch/provide data; Client Components handle interactivity. Keep this boundary explicit.
- For the `packages/ui` package: do NOT compile/transpile the package (keep it as source files transpiled by each consuming app via `transpilePackages`). This preserves the `"use client"` directive. If you publish compiled output, ensure your bundler config preserves the directive.

**Warning signs:**
- `Error: Hooks can only be called inside of the body of a function component` in dashboard pages.
- Chart pages throw on first render with no clear error message.
- Components work in a Pages Router app but fail after moving to App Router.

**Phase to address:** Phase 1 establishes the boundary; must be enforced when building chart-heavy reporting UI in Phase 6 equivalent.

---

### Pitfall 7: Shared Tailwind config not actually shared — each app drifts independently

**What goes wrong:**
The plan correctly includes `packages/config/tailwind/` for a shared Tailwind configuration. In practice, teams add one-off color tokens, font sizes, or spacing values directly into an individual app's config when they're in a hurry. After 3-4 features, the storefront and admin have different color scales, slightly different `primary` values, and inconsistent spacing. The "shared design system" becomes three diverging design systems.

**Why it happens:**
It's faster to add `colors: { brand: '#2563EB' }` in the app's local config than to update the shared package and re-import. There is no enforcement mechanism.

**How to avoid:**
- The shared Tailwind config in `packages/config/tailwind/` must be the single source of truth for all design tokens. Apps import and extend it but never redefine tokens it already provides.
- Enforce via ESLint rule or PR checklist: any new design token must go in `packages/config/tailwind/` first.
- Name tokens semantically, not literally: `--color-primary` not `--color-blue-600`. This prevents the "I'll just add blue here" bypass.
- Run a visual regression smoke test (even manual screenshot comparison) between storefront and admin when adding tokens.

**Warning signs:**
- `packages/config/tailwind/` hasn't been touched in weeks but individual app configs are growing.
- Storefront buttons are a slightly different shade than admin buttons.
- A developer asks "where do I add a new color?" and the answer isn't immediately obvious.

**Phase to address:** Phase 1 (establish the shared config); ongoing vigilance in every phase.

---

### Pitfall 8: Mock-to-real transition blocked by missing loading / error / empty states

**What goes wrong:**
Every data display in the UI mockup renders immediately with full, perfect mock data. When real API calls replace mock data, every table, card, and chart needs three additional states: loading skeleton, error message, and empty state (no data). These are not trivial — a loading skeleton for the Management KPI dashboard is a full layout design task. If these states aren't designed during the mockup phase, the backend integration milestone gets unexpectedly large.

**Why it happens:**
Mock data makes every component appear "done." Stakeholders approve screens without ever seeing them in a loading or empty state. Developers assume they'll "add loading states later."

**How to avoid:**
During the UI mockup phase, design and build all three states for every data-displaying component:
- **Loading:** Use shadcn/ui `Skeleton` component to mirror the layout.
- **Error:** A consistent error card with retry affordance.
- **Empty:** Illustrated or text empty state (e.g., "No orders yet").

Use a `status: "loading" | "success" | "error" | "empty"` prop pattern on data components so these states are testable in the mockup via the Role Switcher or a status toggle.

**Warning signs:**
- Every component only has a "success" code path.
- No `Skeleton` components are used anywhere in the codebase.
- "Loading states are a backend integration task" appears in planning notes.

**Phase to address:** Every UI phase of the mockup milestone — build loading/empty/error states at the same time as the success state.

---

### Pitfall 9: TypeScript path aliases misconfigured between monorepo packages

**What goes wrong:**
Next.js apps configured with `@/*` path aliases in `tsconfig.json` only resolve within that app. When `packages/ui` also uses `@/*` aliases internally, or when there's a mismatch between `tsconfig.json` `paths` and the package's actual `exports` map, TypeScript reports false "cannot find module" errors in editor, or — worse — the editor resolves types correctly but the build fails because `tsc` uses a different resolution strategy than the editor's language server.

**Why it happens:**
Each app and package in a monorepo needs its own `tsconfig.json` that extends the shared base from `packages/config/typescript/`. Teams copy a `tsconfig.json` without adjusting `baseUrl` and `paths` for the package's actual location in the directory tree. The `../../` relative paths for shared configs become wrong.

**How to avoid:**
- The shared `packages/config/typescript/base.tsconfig.json` should NOT define `paths` — paths are app-specific.
- Each app defines only its own app-local `@/*` alias.
- `packages/ui` should NOT use `@/*` aliases internally at all — use relative imports within packages to avoid confusion.
- Run `tsc --noEmit` from each app directory (not just root) to catch per-app errors independently.
- Turborepo's `typecheck` task should run per-workspace, not once at root.

**Warning signs:**
- VSCode shows no TypeScript errors but `turbo run typecheck` fails.
- Importing `@furnitrack/ui/Button` works in one app but not the other.
- `tsconfig.json` in a package has `"baseUrl": "../.."` pointing to the wrong relative root.

**Phase to address:** Phase 1 (Monorepo Bootstrap) — validate with `turbo run typecheck` passing across all workspaces before writing any feature code.

---

### Pitfall 10: ERP complexity creep — building real business logic in the mockup phase

**What goes wrong:**
The stock state machine (Available → Reserved → Deducted), the VAT calculation engine, and the approval workflow are complex business rules. During the UI mockup phase, teams are tempted to implement partial versions of this logic in mock data transformations ("the mock just shows reserved items differently"). This creates business logic embedded in mock utilities that then either gets thrown away (wasted effort) or — worse — copied into real implementation code, bypassing proper architecture.

**Why it happens:**
The UI for these features requires showing different states. To make the UI look realistic, a developer writes a `calculateVAT()` function in a mock utility. Six months later this function is used in production.

**How to avoid:**
Mock data represents outcomes, not logic. Show the result state in mock data without computing it:
```ts
// RIGHT — mock shows state, doesn't compute it
const mockOrders = [
  { id: 1, status: "reserved", vatAmount: 120.00 },  // values are hardcoded
]

// WRONG — mock computes real business logic
const mockOrders = orders.map(o => ({
  ...o,
  vatAmount: calculateVAT(o.subtotal, o.vatType),  // logic leaking into mock layer
}))
```

Real business logic (stock state machine, VAT engine, approval rules) belongs exclusively in the backend milestone. `packages/validators/` can hold Zod schemas (data shapes) but not business rule functions.

**Warning signs:**
- `packages/mock-data/` contains arithmetic or conditional business logic.
- A utility function in the mockup would be "useful to keep" when switching to real backend.
- Mock data is computed from other mock data through transformation pipelines.

**Phase to address:** Enforced across all UI mockup phases; explicitly called out in Phase 3 (Sales/Quotation), Phase 4 (Inventory), and Phase 5 (Accounting) equivalents.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Inline mock data in components | Faster initial rendering | Full component rewrite at backend integration | Never — use a mock data layer instead |
| Hardcoded role string in layout | Avoids building MockAuthProvider | Cannot demo role switching; each role must be coded separately | Never — MockAuthProvider takes 30 minutes to build |
| Skipping `"use client"` on interactive components | No extra thought required | Cryptic RSC runtime errors in production | Never |
| Copy-pasting Tailwind classes instead of design tokens | Fast ad-hoc styling | Design inconsistency across storefront vs admin | Only for one-off prototype screens, delete before merge |
| Skipping `transpilePackages` for new shared packages | Build seems to work locally | Breaks on Vercel / CI with module not found | Never |
| Using Tailwind v3 for mockup, deferring v4 migration | Proven shadcn/ui compatibility | Migration effort in later milestone, may conflict with backend work | Acceptable if v4 + shadcn/ui compatibility is unverified at project start |
| Single `tsconfig.json` at root for all workspaces | Simple setup | Wrong path resolution across packages; type errors only visible in CI | Never — each workspace needs its own tsconfig |
| No loading/error states during mockup | Faster screen completion | Backend integration doubles in scope | Never — build all three states per component |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| shadcn/ui + Tailwind v4 | Running `shadcn init` without verifying v4 support in current CLI version | Check shadcn changelog; if unsupported, pin Tailwind v3 for mockup |
| shadcn/ui + monorepo | Installing shadcn components into `packages/ui` via CLI without configuring `components.json` `tailwind.config` path correctly | Set `components.json` `tailwind.config` to point to the app's Tailwind config, not the package's |
| Turborepo + `dev` task | Setting `cache: true` on the `dev` task causes Turbo to cache dev servers and never restart them | Always set `"cache": false` and `"persistent": true` on dev tasks (already correct in planning doc) |
| pnpm + Next.js | Missing `public-hoist-pattern` for packages with native binaries (e.g., sharp for image optimization) | Add `public-hoist-pattern[]=*sharp*` to `.npmrc` if using Next.js image optimization |
| React 19 + older libraries | react-hook-form, Zustand, and other libraries may have peer dependency warnings against React 19 | Use `pnpm install --legacy-peer-deps` or verify each library's React 19 compatibility before installing |
| Recharts + RSC | Importing Recharts at page level causes RSC crash | Always import Recharts components inside a `"use client"` wrapper component |
| Next.js 16 Turbopack + monorepo | Turbopack's `root: '../../'` in `next.config.ts` is required for monorepo workspace resolution | Already present in planning doc — do not remove when copying config between apps |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Large mock data arrays in module scope | Page hydration is slow; bundle size grows | Keep mock data files under 50KB; paginate mock data | When mock datasets exceed ~200 items per entity |
| All dashboard charts rendered at page load | Management KPI page takes 3+ seconds to interactive | Lazy-load chart components with `next/dynamic` and `ssr: false` | With 5+ chart components on one page |
| No `React.memo` on heavy table rows | Sorting/filtering causes full table re-render with hundreds of rows | Memoize row components; use `useMemo` for filter/sort logic | At 50+ visible rows |
| `useEffect` for derived state | Unnecessary re-render cycles in role-filtered navigation | Compute derived state during render, not in effects | Noticeable at complex layouts with 10+ derived values |
| Shared `packages/ui` compiled as CommonJS | Bundler cannot tree-shake unused components; all shadcn components included in every app | Export as ESM; use `"type": "module"` in package.json | From day one — affects all bundle sizes |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Mock role switcher left in production build | Any user can switch to Management/Admin role | Gate `MockAuthProvider` behind `process.env.NODE_ENV === 'development'`; replace entirely at backend integration |
| Hardcoded demo credentials in source code | Credentials committed to repo history | Use `.env.local` even for mock credentials; add `*.env.local` to `.gitignore` |
| RBAC middleware using client-side role only | Role check bypassed by manipulating client state | In the mockup this is acceptable; at backend integration, middleware must read from server session, never client state |
| `dangerouslySetInnerHTML` in document preview UI | XSS if document content ever comes from user input | Avoid entirely; use controlled rendering for invoice/DR/OR previews |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| ERP dashboard with no visible role context | Users don't know which role they're viewing; confusing during demo | Show current role prominently in header; "You are viewing as: Sales" badge |
| Mobile management view as afterthought | Management cannot use the dashboard on mobile | Design mobile management view alongside desktop from Phase 1 (per PRD requirement for Karen Alonzo) |
| All 5 role sidebars as separate component trees | Code duplication; changes to one don't propagate | Single sidebar component driven by `NAV_CONFIG[role]` data structure |
| Multi-warehouse toggle reloading entire page | Inventory head loses scroll position and filter state on branch switch | Implement warehouse filter as client-side state, not route change |
| Quotation builder without inline inventory availability | Sales team has to leave the quotation to check stock | Embed inventory inquiry directly in quotation line item (per PRD — this is a stated feature requirement) |
| Approval workflow with no pending count badge | Managers miss queued approvals | Show pending count on navigation items using mock data |
| Forms with no inline validation feedback | Users submit form and get error list at top | Use react-hook-form with per-field validation display from the start |

---

## "Looks Done But Isn't" Checklist

- [ ] **Role-based navigation:** Does switching from Sales to Accounting role actually change sidebar items AND hide/show the correct routes? Verify all 5 roles, not just 2.
- [ ] **Management mobile view:** Is the condensed mobile layout built, or is it just the desktop layout on a small screen? Check against PRD's "condensed: sales summary, high-value alerts, profit snapshot" spec.
- [ ] **Loading states:** Does every table, KPI card, and chart have a skeleton loading state? Or does it only show the success/data state?
- [ ] **Empty states:** What does the Orders table look like with zero orders? What does the Stock Dashboard look like for a new warehouse with no items?
- [ ] **Multi-warehouse toggle:** Does switching warehouse actually filter the stock data, or does it just change a label?
- [ ] **Quotation line items:** Can you add, edit, and remove line items in the quotation builder? Or is the line item list static?
- [ ] **Follow-up tracker:** Can lead status be changed through all stages (New → Contacted → Quoted → Won/Lost), or is the status column static?
- [ ] **Dark mode:** If dark mode is implemented, does it apply to both storefront AND admin? Does it persist across route navigations?
- [ ] **Shared components:** Are `packages/ui` components actually being used by both apps, or did each app build its own Button/Card/Table independently?
- [ ] **TypeScript:** Does `turbo run typecheck` pass with zero errors across all workspaces? Not just no red squiggles in VSCode.
- [ ] **Responsive tables:** Do inventory and order tables degrade gracefully on tablet width, or do they overflow horizontally with no scroll container?

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Tailwind v4 + shadcn/ui incompatibility discovered mid-project | MEDIUM | Pin to Tailwind v3.4.x; update `packages/config/tailwind/` to v3 format; re-run `shadcn init`; note: visual output identical for this project |
| Inline mock data in components | HIGH | Extract all mock data to `lib/mock/`; refactor each component to accept data via props; validate against Zod schemas; estimate 1-2 days per major feature area |
| Shared CSS not reaching `packages/ui` components | LOW | Add `@source` (v4) or `content` path (v3) to each app's Tailwind config; verify with a build |
| pnpm phantom dependencies in CI | LOW | Add explicit `"@furnitrack/*": "workspace:*"` to each app's `package.json`; run `pnpm install --frozen-lockfile` |
| TypeScript path alias misconfiguration | MEDIUM | Audit each workspace's `tsconfig.json` `paths`; run `tsc --noEmit` per workspace; fix `baseUrl` relative paths |
| RSC / "use client" errors in production | MEDIUM | Add `"use client"` to all hook-using components in `packages/ui`; audit with `next build` output |
| Business logic embedded in mock utilities | HIGH | Quarantine mock utilities behind a `MOCK_ONLY` comment convention; do not reuse in backend; rewrite from scratch in backend milestone |
| Mock role switcher shipped to production | HIGH | Immediate rollback; gate behind environment variable; treat as security incident |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Tailwind v4 + shadcn/ui incompatibility | Phase 1 — Monorepo Bootstrap | `shadcn add button` and visually inspect in browser; CSS variables resolve in DevTools |
| Shared CSS not reaching `packages/ui` | Phase 1 — Monorepo Bootstrap | Build smoke-test: styled component from `packages/ui` renders correctly in both apps |
| Mock data architecture | Phase 1 — Establish pattern | No component file contains a `const` array of domain objects; all data arrives via props |
| Mock auth / role context | Phase 1 — Admin app shell | All 5 roles switchable via UI; sidebar items change per role |
| pnpm workspace protocol | Phase 1 — Monorepo Bootstrap | `pnpm install --frozen-lockfile && turbo run build` passes on clean checkout |
| RSC / "use client" | Phase 1 + every phase | `turbo run build` completes with zero RSC errors across all phases |
| Design token drift | Phase 1 + enforced ongoing | `packages/config/tailwind/` is the only place new tokens are added; verified in PR review |
| Loading / error / empty states | Every UI phase | Each data component has 3 states; reviewable via status prop toggle |
| TypeScript path aliases | Phase 1 — Monorepo Bootstrap | `turbo run typecheck` passes across all workspaces from a clean state |
| ERP logic in mock layer | Phase 2 onward | `packages/mock-data/` contains only static data structures, no functions that compute business outcomes |
| Mock role switcher in production | Pre-backend integration | MockAuthProvider gated behind `NODE_ENV === 'development'` check confirmed before any deployment |

---

## Sources

- Tailwind CSS v4 upgrade guide and breaking changes: training knowledge through Jan 2025 (MEDIUM confidence — verify against `https://tailwindcss.com/docs/upgrade-guide` before Phase 1)
- shadcn/ui monorepo documentation: training knowledge (MEDIUM confidence — verify against `https://ui.shadcn.com/docs/monorepo`)
- Next.js App Router RSC boundary rules: training knowledge, HIGH confidence (stable since Next.js 13.4)
- pnpm workspace protocol behavior: training knowledge, HIGH confidence (stable spec)
- Turborepo task configuration patterns: training knowledge, HIGH confidence (Turbo v2 stable)
- React 19 peer dependency compatibility: training knowledge, MEDIUM confidence — verify each library at install time
- ERP UI mockup-to-production transition patterns: synthesized from common patterns (LOW-MEDIUM confidence — no specific post-mortems available without web access)

---
*Pitfalls research for: FurniTrack — Next.js 16 pnpm monorepo ERP dashboard + storefront UI mockup*
*Researched: 2026-03-06*
