"use client"

import { SharedLoginPage } from "@furnitrack/ui"
import { UserPlus } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { authClient } from "@/lib/auth/client"

type AppRole =
  | "ADMIN_MANAGEMENT"
  | "SALES"
  | "INVENTORY"
  | "ACCOUNTING"
  | "OPERATIONS_DESIGN"
  | "CUSTOM"
  | "CLIENT"

const ROLE_REDIRECT: Record<AppRole, string> = {
  ADMIN_MANAGEMENT: "/",
  SALES: "/sales",
  INVENTORY: "/inventory",
  ACCOUNTING: "/accounting",
  OPERATIONS_DESIGN: "/operations",
  CUSTOM: "/",
  CLIENT: "/",
}

const adminUrl =
  process.env.NEXT_PUBLIC_ADMIN_URL?.trim().replace(/\/+$/, "") ??
  "http://localhost:3001"

function normalizeAppRole(role?: string | null): AppRole {
  const normalized = role?.trim().toUpperCase()

  if (
    normalized === "ADMIN_MANAGEMENT" ||
    normalized === "SALES" ||
    normalized === "INVENTORY" ||
    normalized === "ACCOUNTING" ||
    normalized === "OPERATIONS_DESIGN" ||
    normalized === "CUSTOM" ||
    normalized === "CLIENT"
  ) {
    return normalized
  }

  if (normalized === "ADMIN" || normalized === "ANALYTICS") {
    return "ADMIN_MANAGEMENT"
  }

  return "CLIENT"
}

function getSafeAdminRedirect(returnTo: string | null, role?: string | null) {
  if (returnTo?.startsWith(adminUrl)) {
    return returnTo
  }

  return `${adminUrl}${ROLE_REDIRECT[normalizeAppRole(role)]}`
}

function SignInContent() {
  const searchParams = useSearchParams()
  const returnTo = searchParams.get("returnTo")

  return (
    <SharedLoginPage
      authClient={authClient}
      portal="storefront"
      eyebrow="FurniTrack Portal"
      description="Sign in with your account to continue to your assigned workspace."
      emailPlaceholder="Enter your email"
      submitLabel="Sign In"
      loadingLabel="Signing In..."
      sessionErrorMessage="We signed you in, but couldn't verify your profile. Please try again."
      invalidRoleMessage="Your account is inactive or does not have an assigned portal role."
      verifySessionUser={(user) => Boolean(user?.status === "ACTIVE" && user?.role)}
      getRedirectPath={(user) => {
        const role = normalizeAppRole(user?.role)

        return role === "CLIENT" ? "/" : getSafeAdminRedirect(returnTo, role)
      }}
      onValidSession={async (user, email) => {
        const role = normalizeAppRole(user.role)
        const response = await fetch("/api/portal-session", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ portal: role === "CLIENT" ? "storefront" : "admin" }),
        })

        if (!response.ok) {
          throw new Error("We signed you in, but couldn't save your portal session. Please try again.")
        }

        if (role === "CLIENT") {
          localStorage.setItem("customerSession", user.email ?? email)
        }
      }}
      backLink={{ href: "/", label: "Back to products" }}
      footer={
        <>
          <p className="text-[14px] text-[#6a7282]">
            New to FurniTrack?{" "}
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-1.5 font-semibold text-[#1a1a2e] transition-colors hover:text-[#1a1a2e]/70"
            >
              <UserPlus className="h-4 w-4" />
              Create an account
            </Link>
          </p>
        </>
      }
    />
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  )
}
