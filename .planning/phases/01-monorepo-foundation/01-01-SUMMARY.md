---
phase: "01"
plan: "01"
subsystem: monorepo-foundation
tags: [pnpm, turborepo, typescript, eslint, tailwind, config-package]
dependency_graph:
  requires: []
  provides:
    - "@furnitrack/config — TypeScript base + Next.js configs, ESLint 9 flat config, Tailwind v4 brand tokens CSS"
    - "pnpm workspace with apps/* and packages/* globs"
    - "Turborepo 2.x pipeline (build/typecheck/dev/lint)"
    - "@furnitrack/db, @furnitrack/ui, @furnitrack/validators — placeholder packages with export {} stubs"
  affects: []
tech_stack:
  added:
    - "turbo@2.8.14 — monorepo task orchestration"
    - "typescript@5.9.3 — shared compiler"
    - "prettier@3.8.1 + prettier-plugin-tailwindcss — code formatting"
    - "eslint@9.39.3 — flat config linting"
    - "pnpm@10.30.3 — package manager with workspace protocol"
  patterns:
    - "Turborepo 2.x requires packageManager field in root package.json — add it"
    - "Workspace packages are not symlinked to root node_modules unless a consumer declares workspace:* dependency"
    - "tsconfig.json is required in each package that runs tsc --noEmit directly; extends @furnitrack/config/typescript/base.json"
key_files:
  created:
    - package.json
    - pnpm-workspace.yaml
    - turbo.json
    - prettier.config.js
    - .gitignore
    - packages/config/package.json
    - packages/config/typescript/base.json
    - packages/config/typescript/nextjs.json
    - packages/config/eslint/base.mjs
    - packages/config/tailwind/tokens.css
    - packages/validators/package.json
    - packages/validators/tsconfig.json
    - packages/validators/src/index.ts
    - packages/db/package.json
    - packages/db/tsconfig.json
    - packages/db/src/index.ts
    - packages/db/src/mock/index.ts
    - packages/ui/package.json
    - packages/ui/tsconfig.json
    - packages/ui/src/index.ts
  modified: []
decisions:
  - "Turborepo 2.x requires packageManager field in package.json — added pnpm@10.30.3 (auto-fixed during verification)"
  - "tsconfig.json added to db/validators/ui packages — required for tsc --noEmit; extends @furnitrack/config/typescript/base.json"
  - "Tailwind v4 @theme CSS-first syntax used in tokens.css — to be validated by smoke test in Plan 04"
metrics:
  duration: "~15 minutes"
  tasks_completed: 2
  files_created: 20
  files_modified: 1
  completed_date: "2026-03-06"
---

# Phase 01 Plan 01: Monorepo Bootstrap + packages/config Summary

**One-liner:** pnpm workspace with Turborepo 2.x pipeline, @furnitrack/config exporting shared TypeScript/ESLint/Tailwind configs, and four placeholder workspace packages all passing typecheck.

## What Was Built

Bootstrap the pnpm monorepo from scratch and create the `packages/config` shared infrastructure package. This is the Wave 1 foundation that every subsequent plan depends on.

### Root workspace files

| File | Purpose |
|------|---------|
| `package.json` | Monorepo root — private, `packageManager: pnpm@10.30.3`, root scripts |
| `pnpm-workspace.yaml` | Workspace glob: `apps/*` and `packages/*` |
| `turbo.json` | Turborepo 2.x pipeline — build/typecheck/dev/lint tasks with `dependsOn` chaining |
| `prettier.config.js` | ESM prettier config with tailwindcss plugin |
| `.gitignore` | node_modules, .next, .turbo, .env variants |

### packages/config

| File | Purpose |
|------|---------|
| `typescript/base.json` | Strict TS config — bundler resolution, ESNext, noEmit, isolatedModules |
| `typescript/nextjs.json` | Extends base, adds Next.js language server plugin |
| `eslint/base.mjs` | ESLint 9 flat config — recommended JS + TypeScript rules |
| `tailwind/tokens.css` | Tailwind v4 `@theme` block — 7 brand colors, typography, layout spacing |

### Placeholder packages (scaffold only)

| Package | Entry | Notes |
|---------|-------|-------|
| `@furnitrack/db` | `src/index.ts` + `src/mock/index.ts` | `export {}` stubs; replaced in Plan 02 |
| `@furnitrack/validators` | `src/index.ts` | `export {}` stub; replaced in Plan 02 |
| `@furnitrack/ui` | `src/index.ts` | `export {}` stub; replaced in Plan 03 |

## Success Criteria Verification

- `pnpm install` runs without error from repo root — PASS (90 packages resolved)
- `node_modules/@furnitrack/{config,validators,db,ui}` symlinks — PASS (via `workspace:*` devDependency in each package)
- `packages/config/typescript/base.json` has `"strict": true` — PASS
- `packages/config/tailwind/tokens.css` contains all 7 `--color-*` variables — PASS
- `pnpm turbo typecheck` exits 0 — PASS (4/4 packages: config echo, db/validators/ui tsc --noEmit)
- FOUN-01: Four packages exist as workspace packages — PASS
- FOUN-02: `packages/config` exports TypeScript configs, ESLint config, and Tailwind tokens — PASS

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added missing `packageManager` field to root package.json**
- **Found during:** Task 2 verification (`pnpm turbo typecheck`)
- **Issue:** Turborepo 2.x fails with "Could not resolve workspaces — Missing `packageManager` field in package.json"
- **Fix:** Added `"packageManager": "pnpm@10.30.3"` to root `package.json`
- **Files modified:** `package.json`
- **Commit:** `0a9a1a4` (included in Task 2 commit)

**2. [Rule 2 - Missing Critical Functionality] Added tsconfig.json to db/validators/ui packages**
- **Found during:** Task 2 verification — `tsc --noEmit` printed help text and exited 1 with no tsconfig present
- **Issue:** The plan specified `tsc --noEmit` as the typecheck script but did not include tsconfig.json files for the three non-config packages
- **Fix:** Added `tsconfig.json` to each package extending `@furnitrack/config/typescript/base.json`; added `"@furnitrack/config": "workspace:*"` as devDependency so the extends path resolves
- **Files modified:** `packages/db/tsconfig.json`, `packages/validators/tsconfig.json`, `packages/ui/tsconfig.json`, `packages/db/package.json`, `packages/validators/package.json`, `packages/ui/package.json`
- **Commit:** `0a9a1a4`

## Commits

| Hash | Message |
|------|---------|
| `2cfa6af` | chore(01-01): bootstrap monorepo root with pnpm workspace |
| `0a9a1a4` | feat(01-01): add packages/config and scaffold placeholder packages |

## Self-Check

Files created during this plan:
- `package.json` — exists
- `pnpm-workspace.yaml` — exists
- `turbo.json` — exists
- `packages/config/tailwind/tokens.css` — contains `--color-navy`
- `packages/db/tsconfig.json` — exists
- All 20 created files accounted for

Commits:
- `2cfa6af` — present in git log
- `0a9a1a4` — present in git log

## Self-Check: PASSED
