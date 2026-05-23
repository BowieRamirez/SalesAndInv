import { execSync } from "child_process"
import { join } from "path"

const root = join(__dirname, "..")
const prismaPath = join(root, "apps", "admin", "node_modules", ".bin", "prisma.CMD")

try {
  execSync(`"${prismaPath}" generate --schema="${join(root, "packages", "db", "prisma", "schema.prisma")}"`, {
    stdio: "inherit",
    cwd: root,
  })
} catch (e: any) {
  process.exit(e.status ?? 1)
}
