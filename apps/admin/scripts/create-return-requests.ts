import { prisma } from "@furnitrack/db"

async function main() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS public.return_requests (
        id text PRIMARY KEY,
        "inquiryId" text NOT NULL,
        "customerUserId" text,
        status text NOT NULL DEFAULT 'SUBMITTED',
        reason text NOT NULL,
        details text,
        "imageUrls" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "salesNote" text,
        "pickupScheduledAt" timestamp(3),
        "approvedById" text,
        "approvedAt" timestamp(3),
        "completedById" text,
        "completedAt" timestamp(3),
        "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("✓ return_requests table created (or already exists)")

    // Index for common lookups
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS return_requests_inquiry_id_idx
        ON public.return_requests ("inquiryId")
    `)
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS return_requests_customer_user_id_idx
        ON public.return_requests ("customerUserId")
    `)
    console.log("✓ Indexes created")
  } catch (err) {
    console.error("Error:", err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
