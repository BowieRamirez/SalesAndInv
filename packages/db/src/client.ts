import { existsSync, readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { PrismaClient } from "./generated/prisma"

function stripWrappingQuotes(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}

function loadDatabaseUrlFromNearestEnv() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }

  const candidateEnvPaths = [
    join(process.cwd(), ".env"),
    resolve(__dirname, "../../../../.env"),
    resolve(__dirname, "../../../.env"),
    resolve(__dirname, "../../.env"),
  ]

  for (const envPath of candidateEnvPaths) {
    if (!existsSync(envPath)) {
      continue
    }

    const envContents = readFileSync(envPath, "utf8")
    const databaseUrlLine = envContents
      .split(/\r?\n/)
      .find((line) => line.trim().startsWith("DATABASE_URL="))

    if (!databaseUrlLine) {
      continue
    }

    const [, rawValue = ""] = databaseUrlLine.split("=", 2)
    const databaseUrl = stripWrappingQuotes(rawValue.trim())

    if (databaseUrl) {
      process.env.DATABASE_URL = databaseUrl
      return databaseUrl
    }
  }

  let currentDir = process.cwd()

  for (let i = 0; i < 6; i += 1) {
    const envPath = join(currentDir, ".env")

    if (existsSync(envPath)) {
      const envContents = readFileSync(envPath, "utf8")
      const databaseUrlLine = envContents
        .split(/\r?\n/)
        .find((line) => line.trim().startsWith("DATABASE_URL="))

      if (databaseUrlLine) {
        const [, rawValue = ""] = databaseUrlLine.split("=", 2)
        const databaseUrl = stripWrappingQuotes(rawValue.trim())

        if (databaseUrl) {
          process.env.DATABASE_URL = databaseUrl
          return databaseUrl
        }
      }
    }

    const parentDir = dirname(currentDir)

    if (parentDir === currentDir) {
      break
    }

    currentDir = parentDir
  }

  return undefined
}

const datasourceUrl = loadDatabaseUrlFromNearestEnv()

if (!datasourceUrl) {
  throw new Error(
    "DATABASE_URL is not configured. Add the Neon Postgres connection string to this deployment's environment variables."
  )
}

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl,
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
