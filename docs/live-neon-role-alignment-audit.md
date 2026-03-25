# FurniTrack Live Neon Audit for Minimized 6-Role Alignment

Date: 2026-03-25
Project: `FurniTrack`
Project ID: `autumn-hall-59133506`
Production Branch: `production`
Branch ID: `br-crimson-fire-a14d158d`
Database: `neondb`

## 1. Live database state

The live Neon production database is still at a very early bootstrap state.

### Existing schemas
- `neon_auth`
- `public`

### Existing tables
- `neon_auth.account`
- `neon_auth.invitation`
- `neon_auth.jwks`
- `neon_auth.member`
- `neon_auth.organization`
- `neon_auth.project_config`
- `neon_auth.session`
- `neon_auth.user`
- `neon_auth.verification`
- `public.playing_with_neon`

### Existing business tables from the minimized-role reference schema
- None

### Existing sample / non-business public data
- `public.playing_with_neon`
- Current row count observed during audit: `10`

### Existing PostgreSQL enums
- None

### Existing foreign keys
- `neon_auth.account.userId -> neon_auth.user.id`
- `neon_auth.invitation.inviterId -> neon_auth.user.id`
- `neon_auth.invitation.organizationId -> neon_auth.organization.id`
- `neon_auth.member.organizationId -> neon_auth.organization.id`
- `neon_auth.member.userId -> neon_auth.user.id`
- `neon_auth.session.userId -> neon_auth.user.id`

## 2. Live auth and role state

Production role values are currently stored directly in `neon_auth.user.role`.

### Live role counts in `neon_auth.user`
- `ACCOUNTING`: 1
- `ADMIN`: 1
- `ANALYTICS`: 1
- `INVENTORY`: 1
- `SALES`: 1

### Current auth record counts
- `neon_auth.user`: 5
- `neon_auth.organization`: 0
- `neon_auth.member`: 0
- `neon_auth.invitation`: 0

### Important auth observations
- No `neon_auth.organization` rows exist yet.
- No `neon_auth.member` rows exist yet.
- No invitation-based org membership appears to be in use yet.
- The admin app currently reads the signed-in session user role directly, so `neon_auth.user.role` is the live role source of truth today.

## 3. Gap against the minimized 6-role reference schema

### Target roles
- `ADMIN_MANAGEMENT`
- `SALES`
- `INVENTORY`
- `ACCOUNTING`
- `OPERATIONS_DESIGN`
- `CLIENT`

### Current live-to-target role mismatch
- `SALES` already matches.
- `INVENTORY` already matches.
- `ACCOUNTING` already matches.
- `ADMIN` must be remapped to `ADMIN_MANAGEMENT`.
- `ANALYTICS` does not exist in the target model and needs a deliberate remap decision.
- `OPERATIONS_DESIGN` does not exist yet in live auth records.
- `CLIENT` does not exist yet in live auth records.

### Missing live schemas/modules
- Companies
- Internal app users table
- Leads
- Quotations and quotation line items
- Sales orders and sales order line items
- Warehouses
- Stock items and stock movements
- Stock requests and stock request line items
- Design requests and design assets
- Payment records
- Delivery schedules
- Approval history
- Audit logs

### Repo-side legacy data-access note
- `packages/db/src/catalog.ts` is now a temporary live adapter for optional legacy storefront catalog tables only.
- It no longer uses mock data.
- It currently returns an empty array against production because `public.products` and related catalog tables do not exist in live Neon yet.

### Missing live control/data features
- Company-code ownership model
- Backend company-code filtering tables and snapshots
- Account status and expiration fields
- Approval history records
- Audit logs
- Delivery readiness state model
- Client company isolation model

## 4. Major risks

### Risk 1: role cutover can lock people out
Because the app reads role directly from the current auth session user, changing code to only recognize the 6 new roles before remapping live auth rows would break routing and authorization for users with `ADMIN` and `ANALYTICS`.

### Risk 2: no business schema exists yet
The local Prisma reference schema is not a live migration from the current production business schema. It is effectively a first real application schema layered onto a Neon Auth-only database.

### Risk 3: client security requirements are not yet enforceable in SQL
Strict backend company-code filtering cannot be enforced until `companies`, `users`, and transaction tables exist and are wired together.

### Risk 4: auth identity and app identity are separate concerns
The reference schema expects a `users.authUserId` link back to Neon Auth. That link does not exist yet because the `public.users` table does not exist yet.

### Risk 5: `ANALYTICS` has no direct home in the minimized model
This is a business decision, not just a schema migration. The likely destination is `ADMIN_MANAGEMENT`, but that should be explicitly approved before any live auth role update.

## 5. Safe migration plan

This plan is intentionally staged to avoid damaging the live production database.

### Phase 0: preserve read-only posture
- Do not change production data yet.
- Keep inspection queries read-only until the migration SQL is reviewed.

### Phase 1: finalize role remap policy
- Approve exact role mapping for live auth users:
- `ADMIN -> ADMIN_MANAGEMENT`
- `ANALYTICS -> ADMIN_MANAGEMENT` or another explicitly approved destination
- Keep `SALES`, `INVENTORY`, and `ACCOUNTING` unchanged
- Define whether any initial `CLIENT` or `OPERATIONS_DESIGN` users need to be created now

### Phase 2: create app schema without mutating auth rows first
- Create the business enums
- Create `companies`
- Create `users` with `authUserId` unique link to `neon_auth.user.id`
- Create all workflow and audit tables from the minimized reference design
- Add foreign keys and indexes
- Keep this initial schema additive

### Phase 3: backfill internal app users from Neon Auth
- Insert one `public.users` row per live `neon_auth.user`
- Copy stable identity fields like auth user id, email, and name
- Map roles into the approved 6-role model during backfill
- Default account status to `ACTIVE`
- Leave `companyId` null for internal staff until company/client structure is introduced

### Phase 4: introduce company model and client-safe scoping
- Create real `companies` records
- Link client users to exactly one company
- Add transaction tables that store both `companyId` and `companyCodeSnapshot`
- Enforce backend scoping in service code using the app `users` table rather than trusting frontend filters

### Phase 5: cut app code over to app-side user records
- Stop treating `neon_auth.user.role` as the long-term sole business authorization source
- Resolve session auth user id first
- Load the matching `public.users` record
- Enforce role, account status, access window, and company scoping there

### Phase 6: optional auth metadata cleanup
- After the app uses `public.users` as the source of truth, decide whether `neon_auth.user.role` remains:
- mirrored for convenience
- retained only for sign-in bootstrap
- or deprecated entirely

## 6. Recommended first live migration scope

The safest first production migration should be additive only:

1. Create all missing enums
2. Create `companies`
3. Create `users` with `authUserId`
4. Create `approval_history`
5. Create `audit_logs`

This gives the app a durable authorization and audit foundation before full quotations, inventory, accounting, design, delivery, and client portal tables are introduced.

## 7. Local repo follow-up already done

- The checked-in generated Prisma client was stale and still reflected the older role model.
- `prisma generate` was run locally in `packages/db`, so generated Prisma artifacts now match the minimized reference schema.

## 8. Recommended next implementation step

Implement app-side session-to-`public.users` resolution and a staged migration script that:
- creates the first additive tables
- backfills current Neon Auth users safely
- remaps roles with explicit handling for `ANALYTICS`
- avoids destructive auth-table changes during the first rollout
