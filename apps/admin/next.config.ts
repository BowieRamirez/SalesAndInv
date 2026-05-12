import type { NextConfig } from "next"

const storefrontUrl =
  process.env.NEXT_PUBLIC_STOREFRONT_URL?.trim().replace(/\/+$/, "") ??
  "http://localhost:3000"

const nextConfig: NextConfig = {
  transpilePackages: [
    "@furnitrack/ui",
    "@furnitrack/validators",
    "@furnitrack/db",
    "@neondatabase/auth",
  ],
  async redirects() {
    return [
      {
        source: "/sign-in",
        destination: `${storefrontUrl}/sign-in?portal=admin`,
        permanent: false,
      },
    ]
  },
}

export default nextConfig
