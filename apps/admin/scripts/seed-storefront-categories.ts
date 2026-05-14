import { prisma } from "@furnitrack/db"
import { randomUUID } from "crypto"

async function main() {
  try {
    // Get distinct categories already on products
    const rows = await prisma.$queryRaw<Array<{ category: string }>>`
      SELECT DISTINCT category FROM public.products
      WHERE category IS NOT NULL AND category != '' AND category != 'Uncategorized'
      ORDER BY category ASC
    `

    console.log(`Found ${rows.length} existing product categories:`, rows.map(r => r.category))

    for (const row of rows) {
      try {
        await prisma.$executeRawUnsafe(
          `INSERT INTO public.storefront_categories (id, name, "createdAt", "updatedAt")
           VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
           ON CONFLICT (name) DO NOTHING`,
          randomUUID(),
          row.category
        )
        console.log(`  ✓ "${row.category}"`)
      } catch (err: any) {
        console.log(`  ⚠ "${row.category}" - skipped: ${err.message}`)
      }
    }

    console.log("\nDone! Refresh the Storefront Filters tab in Operations.")
  } catch (err) {
    console.error("Error:", err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
