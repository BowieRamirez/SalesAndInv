---
phase: 01-monorepo-foundation
plan: "03"
subsystem: ui
tags: [shadcn, tailwind, react, components, design-system, typescript]

# Dependency graph
requires:
  - phase: 01-01
    provides: "@furnitrack/config with Tailwind v4 brand tokens CSS (tokens.css with @theme syntax)"

provides:
  - "@furnitrack/ui — 4 FurniTrack wrapper components (Button, Badge, Card, Input) over shadcn primitives"
  - "packages/ui/src/components/ui/ — 4 hand-written shadcn-compatible primitives (shadcn CLI skipped — not a Next.js app)"
  - "packages/ui/src/lib/utils.ts — cn() helper function"
  - "packages/ui/components.json — shadcn-compatible config file"
  - "Barrel export at packages/ui/src/index.ts — all 4 components + prop types"

affects:
  - 01-04 (smoke-test plan imports from @furnitrack/ui)
  - Phase 2+ (all phases import UI primitives from @furnitrack/ui)

# Tech tracking
tech-stack:
  added:
    - "react@19.2.4 + react-dom@19.2.4 — runtime peer dependency for packages/ui"
    - "@types/react + @types/react-dom — TypeScript type declarations (required for JSX resolution)"
    - "class-variance-authority — variant API for shadcn button/badge primitives"
    - "clsx + tailwind-merge — class merging utilities, cn() helper"
    - "lucide-react — icon library for shadcn components"
    - "@radix-ui/react-slot — asChild pattern for shadcn Button primitive"
  patterns:
    - "FurniTrack wrapper pattern: each component wraps a shadcn primitive and applies brand token classes as defaults"
    - "Consuming code imports from @furnitrack/ui only — never from packages/ui/src/components/ui/* directly"
    - "shadcn CLI does not work in library packages (no framework detected) — hand-write primitives from shadcn source"

key-files:
  created:
    - packages/ui/components.json
    - packages/ui/src/lib/utils.ts
    - packages/ui/src/components/ui/button.tsx
    - packages/ui/src/components/ui/badge.tsx
    - packages/ui/src/components/ui/card.tsx
    - packages/ui/src/components/ui/input.tsx
    - packages/ui/src/components/Button.tsx
    - packages/ui/src/components/Badge.tsx
    - packages/ui/src/components/Card.tsx
    - packages/ui/src/components/Input.tsx
  modified:
    - packages/ui/tsconfig.json (added outDir: "dist" and dist to exclude)
    - packages/ui/src/index.ts (replaced export {} placeholder with full barrel export)
    - packages/ui/package.json (added react, lucide-react, clsx, tailwind-merge, CVA, @radix-ui/react-slot, @types/react)

key-decisions:
  - "shadcn CLI exits with 'unsupported framework' in packages/ui — hand-wrote all 4 shadcn-compatible primitives from shadcn source patterns instead of running the CLI"
  - "@types/react devDependency required in packages/ui even with React 19 (which ships own types) — noEmit tsc fails without it due to missing JSX.IntrinsicElements"
  - "components.json created manually at packages/ui/components.json to satisfy plan artifact requirement and document shadcn configuration intent"

patterns-established:
  - "FurniTrack wrapper pattern: import shadcn primitive, map custom variants to brand token classes via cn(), export FurniXxxProps interface extending Omit<ShadcnProps, 'variant'>"
  - "Brand token classes: bg-gold (CTA), bg-navy (secondary), bg-coral (danger/sale), bg-beige (ghost/neutral), text-charcoal (body)"
  - "Never export raw shadcn primitives from packages/ui/src/index.ts"

requirements-completed: [FOUN-05, FOUN-06]

# Metrics
duration: 12min
completed: 2026-03-06
---

# Phase 01 Plan 03: shadcn/ui + FurniTrack UI Primitives Summary

**shadcn primitives hand-written in packages/ui with 4 FurniTrack brand-aware wrapper components (Button, Badge, Card, Input) exported from @furnitrack/ui**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-03-06T15:33:13Z
- **Completed:** 2026-03-06T15:45:00Z
- **Tasks:** 2
- **Files modified:** 13

## Accomplishments

- Installed all packages/ui dependencies (react, lucide-react, clsx, tailwind-merge, CVA, @radix-ui/react-slot, @types/react)
- Hand-wrote 4 shadcn-compatible primitives (button, badge, card, input) in packages/ui/src/components/ui/
- Built 4 FurniTrack wrappers that map business variants (primary/secondary/ghost, BEST_SELLER/SALE/HOT/etc.) to brand token Tailwind classes
- Wired clean barrel export at packages/ui/src/index.ts — no raw shadcn paths exposed publicly
- `pnpm turbo typecheck --filter=@furnitrack/ui` exits 0 (2 tasks successful)

## Task Commits

Each task was committed atomically:

1. **Task 1: Initialize shadcn/ui in packages/ui and install dependencies** — `96fffa2` (feat)
2. **Task 2: Build 4 FurniTrack wrapper components and wire the barrel export** — `23a47a8` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `packages/ui/components.json` — shadcn configuration (manually created; CLI cannot auto-init in library packages)
- `packages/ui/src/lib/utils.ts` — cn() helper using clsx + tailwind-merge
- `packages/ui/src/components/ui/button.tsx` — shadcn Button primitive with CVA variant API
- `packages/ui/src/components/ui/badge.tsx` — shadcn Badge primitive with CVA variant API
- `packages/ui/src/components/ui/card.tsx` — shadcn Card primitive with forwardRef sub-components
- `packages/ui/src/components/ui/input.tsx` — shadcn Input primitive with forwardRef
- `packages/ui/src/components/Button.tsx` — FurniTrack Button (primary=gold, secondary=navy, ghost=beige)
- `packages/ui/src/components/Badge.tsx` — FurniTrack Badge (BEST_SELLER/SALE/HOT/OUT_OF_STOCK/LOW_STOCK) with auto-labels
- `packages/ui/src/components/Card.tsx` — FurniTrack Card with sm/md/lg padding, beige border, white bg
- `packages/ui/src/components/Input.tsx` — FurniTrack Input with label, error state, aria-invalid
- `packages/ui/src/index.ts` — Barrel export for all 4 components + prop types
- `packages/ui/tsconfig.json` — Added outDir: dist and dist to exclude list
- `packages/ui/package.json` — Added all required dependencies

## Decisions Made

- **shadcn CLI skipped**: `npx shadcn@latest init --yes` exits with "We could not detect a supported framework" when run inside `packages/ui` — it only supports Next.js/Vite apps. All 4 primitives were hand-written from standard shadcn source patterns per the plan's fallback instructions.
- **@types/react required**: Even though React 19 ships its own type declarations, running `tsc --noEmit` with `moduleResolution: bundler` and `jsx: preserve` requires `@types/react` in the package's devDependencies for `JSX.IntrinsicElements` to resolve.
- **components.json placed at packages/ui/components.json**: Manually created to document the intended shadcn configuration and satisfy the plan's artifact requirement confirming the `--cwd` intent.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] shadcn CLI cannot init in a non-Next.js library package**
- **Found during:** Task 1 (shadcn init)
- **Issue:** `npx shadcn@latest init --yes` exited with exit code 1 — "We could not detect a supported framework" — packages/ui has no Next.js app structure
- **Fix:** Hand-wrote all 4 shadcn primitive files from standard shadcn source patterns (as explicitly instructed by plan fallback path: "hand-write the src/lib/utils.ts and the 4 component files manually")
- **Files modified:** packages/ui/src/components/ui/button.tsx, badge.tsx, card.tsx, input.tsx, packages/ui/src/lib/utils.ts, packages/ui/components.json
- **Verification:** pnpm --filter @furnitrack/ui typecheck exits 0
- **Committed in:** 96fffa2 (Task 1 commit)

**2. [Rule 2 - Missing Critical] @types/react not installed — TypeScript JSX resolution fails**
- **Found during:** Task 2 typecheck run
- **Issue:** tsc --noEmit failed with "Could not find a declaration file for module 'react'" across all 4 primitive files + JSX.IntrinsicElements errors
- **Fix:** `pnpm add -D @types/react @types/react-dom --filter @furnitrack/ui`
- **Files modified:** packages/ui/package.json, pnpm-lock.yaml
- **Verification:** All TypeScript errors cleared; typecheck passes
- **Committed in:** 23a47a8 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 missing critical)
**Impact on plan:** Both auto-fixes were necessary for correctness. The shadcn CLI fallback was explicitly anticipated in the plan's action instructions. No scope creep.

## Issues Encountered

- The shadcn CLI's framework detection is based on presence of next.config.* or vite.config.* — library-only packages will always fail. This is a known limitation documented in the deviation above. The plan already anticipated this scenario with a manual fallback path.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `@furnitrack/ui` is ready for import in apps/storefront and apps/admin
- All 4 primitive components typecheck cleanly
- Plan 04 (smoke test) should now import Button, Badge, Card from @furnitrack/ui and verify brand token rendering in a browser
- FOUN-05 (Phase 1 UI primitives) and FOUN-06 (design token integration) are both complete

---
*Phase: 01-monorepo-foundation*
*Completed: 2026-03-06*

## Self-Check: PASSED

All files verified present. All commits verified in git history.
