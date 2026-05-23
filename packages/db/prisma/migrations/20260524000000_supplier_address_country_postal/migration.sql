-- Add country and postalCode columns to supplier_addresses
ALTER TABLE "supplier_addresses"
  ADD COLUMN IF NOT EXISTS "country" TEXT,
  ADD COLUMN IF NOT EXISTS "postalCode" TEXT;
