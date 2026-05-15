import { prisma } from "@furnitrack/db"

async function main() {
  try {
    const result = await prisma.$executeRawUnsafe(
      `UPDATE neon_auth."user" SET role = 'OPERATIONS_DESIGN' WHERE LOWER(email) = 'inventory@sims.com'`
    )
    console.log(`Updated ${result} neon_auth user(s) — inventory@sims.com → OPERATIONS_DESIGN`)
  } catch (err) {
    console.error("Error:", err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
