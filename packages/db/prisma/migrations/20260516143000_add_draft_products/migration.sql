CREATE TABLE IF NOT EXISTS public.draft_products (
  id text PRIMARY KEY,
  "createdById" text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name text,
  payload jsonb NOT NULL,
  "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" timestamp without time zone
);

CREATE INDEX IF NOT EXISTS draft_products_created_by_updated_idx
  ON public.draft_products ("createdById", "deletedAt", "updatedAt");
