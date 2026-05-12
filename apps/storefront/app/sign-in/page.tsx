"use client"

import { SharedLoginPage } from "@furnitrack/ui"
import { Shield, UserPlus } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { authClient } from "@/lib/auth/client"

type AppRole =
  | "ADMIN_MANAGEMENT"
  | "SALES"
  | "INVENTORY"
  | "ACCOUNTING"
  | "OPERATIONS_DESIGN"
  | "CLIENT"

const ROLE_REDIRECT: Record<AppRole, string> = {
  ADMIN_MANAGEMENT: "/",
  SALES: "/sales",
  INVENTORY: "/inventory",
  ACCOUNTING: "/accounting",
  OPERATIONS_DESIGN: "/operations",
  CLIENT: "/",
}

const ROLE_LABELS: Record<AppRole, string> = {
  ADMIN_MANAGEMENT: "Admin / Management",
  SALES: "Sales",
  INVENTORY: "Inventory",
  ACCOUNTING: "Accounting",
  OPERATIONS_DESIGN: "Operations / Design",
  CLIENT: "Client",
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

export default function SignInPage() {
  const searchParams = useSearchParams()
  const isAdminPortal = searchParams.get("portal") === "admin"
  const returnTo = searchParams.get("returnTo")

  if (isAdminPortal) {
    return (
      <SharedLoginPage
        authClient={authClient}
        portal="admin"
        eyebrow="Staff Portal"
        title="Staff access"
        description="Sign in with your internal account to access your assigned dashboard."
        emailPlaceholder="e.g. sales@sims.com"
        submitLabel="Sign In to Admin"
        loadingLabel="Verifying..."
        sessionErrorMessage="We signed you in, but couldn't verify your admin profile. Please try again."
        invalidRoleMessage="Client accounts are not permitted here. Please use the customer portal."
        verifySessionUser={(user) => normalizeAppRole(user?.role) !== "CLIENT" && user?.status === "ACTIVE"}
        getRedirectPath={(user) => getSafeAdminRedirect(returnTo, user?.role)}
        onValidSession={async () => {
          const response = await fetch("/api/portal-session", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ portal: "admin" }),
          })

          if (!response.ok) {
            throw new Error("We signed you in, but couldn't save your staff portal session. Please try again.")
          }
        }}
        backLink={{ href: "/sign-in", label: "Customer login" }}
        footer={
          <>
            <p className="text-[13px] text-[#6a7282]">
              Looking for customer access?{" "}
              <Link
                href="/sign-in"
                className="font-semibold text-[#1a1a2e] transition-colors hover:text-[#1a1a2e]/70"
              >
                Use customer login
              </Link>
            </p>
            <p className="mt-2 text-[11px] text-[#6a7282]/70">
              Staff roles: {" "}
              {Object.values(ROLE_LABELS)
                .filter((role) => role !== "Client")
                .join(" · ")}
            </p>
          </>
        }
      />
    )
  }

  return (
    <SharedLoginPage
      authClient={authClient}
      portal="storefront"
      eyebrow="Client Portal"
      description="Sign in to your customer account to browse live finished products."
      emailPlaceholder="Enter your customer email"
      submitLabel="Sign In"
      loadingLabel="Signing In..."
      sessionErrorMessage="We signed you in, but couldn't verify your customer profile. Please try again."
      invalidRoleMessage="That sign-in belongs to our staff workspace. Please use the staff login instead."
      verifySessionUser={(user) => user?.role === "CLIENT" && user?.status === "ACTIVE"}
      getRedirectPath={() => "/"}
      onValidSession={async (user, email) => {
        const response = await fetch("/api/portal-session", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ portal: "storefront" }),
        })

        if (!response.ok) {
          throw new Error("We signed you in, but couldn't save your customer portal session. Please try again.")
        }

        localStorage.setItem("customerSession", user.email ?? email)
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
          <p className="mt-3 text-[13px] text-[#6a7282]">
            Internal user?{" "}
            <Link
              href="/sign-in?portal=admin"
              className="inline-flex items-center gap-1.5 font-semibold text-[#1a1a2e] transition-colors hover:text-[#1a1a2e]/70"
            >
              <Shield className="h-4 w-4" />
              Staff login
            </Link>
          </p>
        </>
      }
    />
  )
}
