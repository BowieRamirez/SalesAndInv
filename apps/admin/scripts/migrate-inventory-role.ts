import { prisma } from "@furnitrack/db"

async function main() {
  try {
    const result = await prisma.$executeRawUnsafe(
      `UPDATE public.users SET role = 'OPERATIONS_DESIGN' WHERE role = 'INVENTORY'`
    )
    console.log(`Updated ${result} user(s) from INVENTORY to OPERATIONS_DESIGN`)

    // Also update the neon_auth user metadata if role is stored there
    const users = await prisma.$queryRawUnsafe<{ id: string; email: string; role: string }[]>(
      `SELECT id, email, role FROM public.users WHERE role = 'OPERATIONS_DESIGN' ORDER BY email`
    )
    console.log("Current OPERATIONS_DESIGN users:", JSON.stringify(users, null, 2))
  } catch (err) {
    console.error("Error:", err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
