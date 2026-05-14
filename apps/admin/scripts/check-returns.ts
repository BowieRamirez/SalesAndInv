import { prisma } from "@furnitrack/db"

async function main() {
  try {
    const rows = await prisma.$queryRawUnsafe(
      `SELECT id, status, reason, "createdAt" FROM public.return_requests ORDER BY "createdAt" DESC LIMIT 20`
    )
    console.log("Return requests found:", JSON.stringify(rows, null, 2))
  } catch (err) {
    console.error("Error:", err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
