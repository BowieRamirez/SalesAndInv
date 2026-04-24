import { createNeonAuth } from "@neondatabase/auth/next/server"

const authBaseUrl = process.env.NEON_AUTH_BASE_URL?.trim().replace(/\/+$/, "")

export const auth = createNeonAuth({
  baseUrl: authBaseUrl!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
})
