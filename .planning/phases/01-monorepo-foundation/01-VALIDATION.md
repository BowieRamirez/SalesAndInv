---
phase: 1
slug: monorepo-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-06
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript compiler (`tsc`) + Turborepo build pipeline |
| **Config file** | `turbo.json` (root) + `tsconfig.json` (per package/app) |
| **Quick run command** | `pnpm turbo typecheck` |
| **Full suite command** | `pnpm turbo typecheck build` |
| **Estimated runtime** | ~15–30 seconds |

> Note: Phase 1 has no runtime test framework (Jest/Vitest). Validation is TypeScript correctness + build success + manual smoke-test visual verification. Wave 0 does not need to install a test framework — the build pipeline IS the verification mechanism.

---

## Sampling Rate

- **After every task commit:** Run `pnpm turbo typecheck`
- **After every plan wave:** Run `pnpm turbo typecheck build`
- **Before `/gsd:verify-work`:** Full suite must be green + smoke-test page visually verified
- **Max feedback latency:** ~30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | FOUN-01 | build | `pnpm turbo typecheck build` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 1 | FOUN-02 | build | `pnpm turbo typecheck build` | ❌ W0 | ⬜ pending |
| 1-02-01 | 02 | 1 | FOUN-03 | typecheck | `pnpm turbo typecheck` | ❌ W0 | ⬜ pending |
| 1-02-02 | 02 | 1 | FOUN-04 | typecheck | `pnpm turbo typecheck` | ❌ W0 | ⬜ pending |
| 1-03-01 | 03 | 2 | FOUN-05 | typecheck | `pnpm turbo typecheck` | ❌ W0 | ⬜ pending |
| 1-03-02 | 03 | 2 | FOUN-06 | visual | smoke-test page manual check | manual | ⬜ pending |
| 1-04-01 | 04 | 2 | FOUN-07 | build | `pnpm turbo typecheck build` | ❌ W0 | ⬜ pending |
| 1-04-02 | 04 | 2 | FOUN-08 | visual | smoke-test page + PROJECT.md decision | manual | ⬜ pending |
| 1-04-03 | 04 | 2 | FOUN-09 | typecheck | `pnpm turbo typecheck` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Wave 0 sets up the monorepo scaffold so that subsequent waves have a valid build environment.

- [ ] `pnpm-workspace.yaml` — root workspace config listing `apps/*` and `packages/*`
- [ ] `turbo.json` — pipeline with `typecheck` and `build` tasks + `^build` dependsOn
- [ ] Root `package.json` — with `pnpm` engine constraint and workspace scripts
- [ ] `packages/config/`, `packages/validators/`, `packages/db/`, `packages/ui/` — directories created with minimal `package.json` so Turborepo resolves the graph

*These are bootstrap files, not test stubs. They enable `pnpm turbo typecheck build` to run at all.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Smoke-test page renders brand colors (navy, coral, gold, beige) correctly in browser | FOUN-06 | Visual rendering cannot be asserted via `tsc` | Run `pnpm dev` in `apps/storefront`, navigate to `/design-system`, confirm colors match token values |
| Smoke-test page renders correctly in `apps/admin` | FOUN-06 | Same — visual verification | Run `pnpm dev` in `apps/admin`, navigate to `/design-system`, confirm same brand tokens apply |
| Tailwind v4 + shadcn/ui decision documented in PROJECT.md | FOUN-08 | Decision is conditional on smoke-test outcome | Open `PROJECT.md`, confirm Key Decisions table has an entry for Tailwind version with rationale |
| Cross-package imports resolve with correct TypeScript types (no `any`) | FOUN-02 | Type correctness beyond build passing | Check that importing `Button` from `@furnitrack/ui` shows proper prop types in IDE |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
