import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: [
    "@furnitrack/ui",
    "@furnitrack/validators",
    "@furnitrack/db",
  ],
}

export default nextConfig
