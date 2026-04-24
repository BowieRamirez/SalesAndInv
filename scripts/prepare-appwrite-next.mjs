import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const appName = process.argv[2];

if (!appName) {
  console.error("Usage: node scripts/prepare-appwrite-next.mjs <app-name>");
  process.exit(1);
}

const rootDir = process.cwd();
const appDir = join(rootDir, "apps", appName);
const appNextDir = join(appDir, ".next");
const rootNextDir = join(rootDir, ".next");
const rootStandaloneDir = join(rootNextDir, "standalone");
const appStandaloneDir = join(rootStandaloneDir, "apps", appName);
const appConfigPath = join(appDir, "next.config.ts");
const rootConfigPath = join(rootDir, "next.config.ts");

if (!existsSync(appNextDir)) {
  console.error(`Missing Next.js build output: ${appNextDir}`);
  process.exit(1);
}

if (!existsSync(appConfigPath)) {
  console.error(`Missing Next.js config: ${appConfigPath}`);
  process.exit(1);
}

rmSync(rootNextDir, { force: true, recursive: true });
mkdirSync(rootNextDir, { recursive: true });
cpSync(appNextDir, rootNextDir, { recursive: true });
cpSync(appConfigPath, rootConfigPath);

if (existsSync(appStandaloneDir)) {
  cpSync(appStandaloneDir, rootStandaloneDir, { recursive: true });
}
