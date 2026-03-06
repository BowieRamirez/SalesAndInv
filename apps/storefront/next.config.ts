import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: [
    "@furnitrack/ui",
    "@furnitrack/validators",
    "@furnitrack/db",
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
