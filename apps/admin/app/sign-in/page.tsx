"use client"

import React, { useState } from "react"
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Package,
  Shield,
  User,
} from "lucide-react"
import { authClient } from "@/lib/auth/client"
import { normalizeAppRole, ROLE_LABELS, ROLE_REDIRECT } from "@/lib/rbac"

const AUTH_CLIENT_TIMEOUT_MS = 15000

const storefrontSignInUrl = `${
  process.env.NEXT_PUBLIC_STOREFRONT_URL?.trim().replace(/\/+$/, "") ??
  "https://furnitrack.page"
}/sign-in`

async function withTimeout<T>(
  promise: Promise<T>,
  message: string
): Promise<T> {
  let timeout: number
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = window.setTimeout(
      () => reject(new Error(message)),
      AUTH_CLIENT_TIMEOUT_MS
    )
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    window.clearTimeout(timeout!)
  }
}

export default function AdminSignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const emailLower = email.trim().toLowerCase()

    if (emailLower.includes("customer") || emailLower.includes("client@")) {
      setError(
        "Client accounts are not permitted here. Please use the customer portal."
      )
      setIsLoading(false)
      return
    }

    try {
      const result = await withTimeout(
        authClient.signIn.email({
          email: emailLower,
          password,
        }),
        "The sign-in service took too long to respond. Check the Neon Auth environment variables."
      )

      if (result.error) {
        setError(
          result.error.message ??
            "Invalid email or password. Please check your credentials and try again."
        )
        setIsLoading(false)
        return
      }

      const sessionResult = await withTimeout(
        authClient.getSession(),
        "The session check took too long to respond. Please try again."
      )
      const roleFromSession = normalizeAppRole(
        (sessionResult?.data?.user as { role?: string })?.role
      )

      const sessionUserResponse = await withTimeout(
        fetch("/api/session-user", { cache: "no-store" }),
        "The admin profile check took too long to respond. Please try again."
      )
      if (!sessionUserResponse.ok) {
        setError(
          "We signed you in, but couldn't verify your admin profile. Please try again."
        )
        setIsLoading(false)
        return
      }
      const sessionUserResult = (await sessionUserResponse
        .json()
        .catch(() => ({}))) as {
        user?: { role?: string | null }
      }
      const role = normalizeAppRole(
        sessionUserResult.user?.role ?? roleFromSession
      )

      if (role === "CLIENT") {
        await authClient.signOut()
        setError(
          "Client accounts are not permitted here. Please use the customer portal."
        )
        setIsLoading(false)
        return
      }

      const redirect = ROLE_REDIRECT[role] ?? "/"

      window.location.href = redirect
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      )
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#fcfcfc] py-10 font-[family-name:var(--font-inter)] lg:flex-row lg:py-0">
      <div className="relative flex min-h-[500px] flex-col justify-between overflow-hidden bg-[#1a1c29] p-8 text-white lg:min-h-screen lg:w-[45%] xl:p-14">
        <div className="pointer-events-none absolute top-[-10%] left-[-15%] h-[45rem] w-[45rem] rounded-full border-[60px] border-white/[0.03]" />
        <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] h-[30rem] w-[30rem] rounded-full border-[40px] border-white/[0.03]" />
        <div className="pointer-events-none absolute top-[30%] right-[-15%] h-[50rem] w-[50rem] rounded-full border-[50px] border-white/[0.03]" />

        <div className="relative z-10 mt-4 flex items-center space-x-3 lg:mt-0">
          <div className="rounded-xl border border-white/5 bg-white/10 p-2.5 shadow-sm">
            <Shield className="h-6 w-6 text-[#818cf8]" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[17px] leading-tight font-semibold tracking-wide">
              FurniTrack
            </h1>
            <p className="mt-0.5 text-[11px] font-medium tracking-wider text-white/50 uppercase">
              Admin Portal
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-6">
          <span className="inline-flex items-center space-x-1.5 rounded-full border border-[#6366f1]/30 bg-[#6366f1]/20 px-3 py-1.5 text-[11px] font-semibold tracking-wider text-[#818cf8] uppercase">
            <Shield className="h-3 w-3" />
            <span>Internal Access Only</span>
          </span>
        </div>

        <div className="relative z-10 mt-10 mb-auto max-w-lg xl:pl-4">
          <div className="absolute -top-10 -left-6 animate-pulse text-[#818cf8] opacity-90">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.4 9.6L21 12L13.4 14.4L12 22L10.6 14.4L3 12L10.6 9.6L12 2Z" />
            </svg>
          </div>

          <h2 className="mb-6 text-[2.5rem] leading-[1.1] font-semibold tracking-tight xl:text-[3.2rem]">
            Minimized role-based
            <br />
            business management
          </h2>
          <p className="mb-10 max-w-[420px] text-[15px] leading-relaxed text-white/60 xl:text-[16px]">
            Sales, inventory, accounting, operations, and management work from
            one shared workflow with backend company-code enforcement for client
            security.
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <CheckCircle2 className="h-[15px] w-[15px] text-white/80" />
              <span className="text-[13px] font-medium text-white/90">
                Role-Based Access
              </span>
            </div>
            <div className="flex items-center space-x-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <BarChart3 className="h-[15px] w-[15px] text-white/80" />
              <span className="text-[13px] font-medium text-white/90">
                Shared Workflow
              </span>
            </div>
            <div className="flex items-center space-x-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Package className="h-[15px] w-[15px] text-white/80" />
              <span className="text-[13px] font-medium text-white/90">
                Company-Code Security
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mb-4 text-[12px] font-medium text-white/40 lg:mb-0 xl:pl-4">
          &copy; 2026 SIMS Co. All rights reserved.
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center bg-white p-8 lg:p-12">
        <div className="pointer-events-none absolute top-[28%] right-[22%] hidden text-[#818cf8] opacity-60 lg:block">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.4 9.6L21 12L13.4 14.4L12 22L10.6 14.4L3 12L10.6 9.6L12 2Z" />
          </svg>
        </div>

        <div className="w-full max-w-[400px]">
          <div className="mb-8 flex justify-center">
            <div className="flex items-center space-x-2 rounded-xl border border-[#c7c9f5] bg-[#f0f0ff] px-4 py-2.5">
              <Shield className="h-4 w-4 text-[#6366f1]" />
              <span className="text-[13px] font-semibold tracking-wide text-[#4f46e5] uppercase">
                Staff Login
              </span>
            </div>
          </div>

          <div className="mb-10 text-center">
            <h2 className="mb-2.5 text-[28px] font-semibold tracking-tight text-[#1a1c29]">
              Welcome back
            </h2>
            <p className="text-[14px] text-[#9ca3af]">
              Sign in with your internal account to access your assigned
              dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start space-x-2.5 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle className="mt-0.5 h-[16px] w-[16px] shrink-0 text-red-500" />
              <p className="text-[13px] leading-snug text-red-600">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSignIn}>
            <div className="space-y-2">
              <label
                className="text-[13px] font-medium text-[#2d2d2d]/80"
                htmlFor="admin-email"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <User className="h-[18px] w-[18px] text-[#9ca3af]/70" />
                </div>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sales@sims.com"
                  className="block w-full rounded-[10px] border border-[#e5e7eb] bg-white py-3 pr-4 pl-10 text-[14px] text-[#2d2d2d] transition-all placeholder:text-[#9ca3af]/70 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-[13px] font-medium text-[#2d2d2d]/80"
                htmlFor="admin-password"
              >
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-[18px] w-[18px] text-[#9ca3af]/70" />
                </div>
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full rounded-[10px] border border-[#e5e7eb] bg-white py-3 pr-11 pl-10 text-[14px] text-[#2d2d2d] transition-all placeholder:text-[#9ca3af]/70 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#9ca3af]/70 transition-colors hover:text-[#2d2d2d]"
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group !mt-8 flex h-[46px] w-full cursor-pointer items-center justify-center space-x-2 rounded-[10px] border border-[#2a2c3d] bg-[#1a1c29] text-[14px] font-medium text-white transition-all hover:bg-[#252839] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <svg
                    className="h-[18px] w-[18px] animate-spin text-white/70"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
                  <span>Sign In to Admin</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-[#f3f4f6] pt-4 text-center">
            <p className="text-[12px] text-[#9ca3af]">
              Not an internal user?{" "}
              <a
                href={storefrontSignInUrl}
                className="cursor-pointer font-medium text-[#6366f1] hover:underline"
              >
                Go to customer login -&gt;
              </a>
            </p>
            <p className="mt-2 text-[11px] text-[#9ca3af]/70">
              Admin roles:{" "}
              {Object.values(ROLE_LABELS)
                .filter((role) => role !== "Client")
                .join(" · ")}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
