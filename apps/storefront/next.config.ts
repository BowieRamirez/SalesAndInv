import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: [
    "@furnitrack/ui",
    "@furnitrack/validators",
    "@furnitrack/db",
    "@neondatabase/auth",
  ],
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
}

export default nextConfig
