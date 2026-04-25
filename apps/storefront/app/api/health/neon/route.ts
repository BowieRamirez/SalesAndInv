import { NextResponse } from "next/server"
import { prisma } from "@furnitrack/db"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

type CountRow = {
  count: number | bigint | string
}

function hasEnv(name: string) {
  return Boolean(process.env[name]?.trim())
}

function toNumber(value: number | bigint | string | null | undefined) {
  if (value == null) {
    return 0
  }

  return Number(value)
}

export async function GET() {
  const env = {
    DATABASE_URL: hasEnv("DATABASE_URL"),
    NEON_AUTH_BASE_URL: hasEnv("NEON_AUTH_BASE_URL"),
    NEON_AUTH_COOKIE_SECRET: hasEnv("NEON_AUTH_COOKIE_SECRET"),
  }

  try {
    const [database, productRows, publishedFinishedProductRows, userRows, clientRows] =
      await Promise.all([
        prisma.$queryRaw<Array<{ current_database: string }>>`SELECT current_database()`,
        prisma.$queryRaw<CountRow[]>`SELECT COUNT(*) AS count FROM public.products`,
        prisma.$queryRaw<CountRow[]>`
          SELECT COUNT(*) AS count
          FROM public.products p
          INNER JOIN public.stock_items s
            ON s.id = p."stockItemId"
          WHERE p."isPublished" = true
            AND s."itemType" = 'FINISHED_PRODUCT'
        `,
        prisma.$queryRaw<CountRow[]>`SELECT COUNT(*) AS count FROM public.users`,
        prisma.$queryRaw<CountRow[]>`
          SELECT COUNT(*) AS count
          FROM public.users
          WHERE role = 'CLIENT'::"UserRole"
            AND status = 'ACTIVE'::"AccountStatus"
        `,
      ])

    return NextResponse.json({
      ok: true,
      env,
      database: database[0]?.current_database ?? null,
      counts: {
        products: toNumber(productRows[0]?.count),
        publishedFinishedProducts: toNumber(publishedFinishedProductRows[0]?.count),
        users: toNumber(userRows[0]?.count),
        activeClients: toNumber(clientRows[0]?.count),
      },
    })
  } catch (error) {
    console.error("[storefront.health.neon] Neon health check failed", error)

    return NextResponse.json(
      {
        ok: false,
        env,
        error: error instanceof Error ? error.message : "Unknown Neon health check failure",
      },
      { status: 500 }
    )
  }
}
