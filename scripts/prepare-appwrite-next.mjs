import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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
const appPublicDir = join(appDir, "public");

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

const rootStandaloneServerPath = join(rootStandaloneDir, "server.js");
const appStandaloneServerPath = join(appStandaloneDir, "server.js");
const rootStaticDir = join(rootNextDir, "static");
const appStandaloneStaticDir = join(appStandaloneDir, ".next", "static");
const appStandalonePublicDir = join(appStandaloneDir, "public");
const rootStandaloneNodeModulesDir = join(rootStandaloneDir, "node_modules");
const pnpmHoistedNodeModulesDir = join(rootStandaloneNodeModulesDir, ".pnpm", "node_modules");
const appStandaloneNodeModulesDir = join(appStandaloneDir, "node_modules");

if (existsSync(appStandaloneServerPath)) {
  const serverSource = readFileSync(appStandaloneServerPath, "utf8");
  writeFileSync(
    appStandaloneServerPath,
    serverSource.replace(
      "const hostname = process.env.HOSTNAME || '0.0.0.0'",
      "const hostname = process.env.APP_HOSTNAME || '0.0.0.0'",
    ),
  );
}

if (existsSync(rootStaticDir)) {
  rmSync(appStandaloneStaticDir, { force: true, recursive: true });
  mkdirSync(appStandaloneStaticDir, { recursive: true });
  cpSync(rootStaticDir, appStandaloneStaticDir, { recursive: true });
}

if (existsSync(appPublicDir)) {
  rmSync(appStandalonePublicDir, { force: true, recursive: true });
  cpSync(appPublicDir, appStandalonePublicDir, { recursive: true });
}

const styledJsxSourceDir = join(pnpmHoistedNodeModulesDir, "styled-jsx");
const styledJsxRootTargetDir = join(rootStandaloneNodeModulesDir, "styled-jsx");
const styledJsxAppTargetDir = join(appStandaloneNodeModulesDir, "styled-jsx");

if (existsSync(styledJsxSourceDir)) {
  rmSync(styledJsxRootTargetDir, { force: true, recursive: true });
  rmSync(styledJsxAppTargetDir, { force: true, recursive: true });
  cpSync(styledJsxSourceDir, styledJsxRootTargetDir, { recursive: true });
  cpSync(styledJsxSourceDir, styledJsxAppTargetDir, { recursive: true });
}

writeFileSync(
  rootStandaloneServerPath,
  `const path = require("node:path");
const Module = require("node:module");

process.env.NODE_PATH = [
  path.join(__dirname, "node_modules", ".pnpm", "node_modules"),
  path.join(__dirname, "node_modules"),
  process.env.NODE_PATH,
].filter(Boolean).join(path.delimiter);

Module._initPaths();

require("./apps/${appName}/server.js");
`,
);
