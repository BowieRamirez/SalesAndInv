import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: [
    "@furnitrack/ui",
    "@furnitrack/validators",
    "@furnitrack/db",
    "@neondatabase/auth",
  ],
}

export default nextConfig
