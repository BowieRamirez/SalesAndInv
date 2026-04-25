"use client"

import React, { useEffect, useState } from "react"
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  User,
  UserPlus,
  X,
} from "lucide-react"
import Link from "next/link"
import { AuthMarketingPanel } from "@/components/AuthMarketingPanel"
import { authClient } from "@/lib/auth/client"

const AUTH_CLIENT_TIMEOUT_MS = 15000

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

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!error) {
      return
    }

    const timeout = window.setTimeout(() => {
      setError("")
    }, 5000)

    return () => window.clearTimeout(timeout)
  }, [error])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await withTimeout(
        authClient.signIn.email({
          email: email.trim().toLowerCase(),
          password,
        }),
        "The sign-in service took too long to respond. Check the Neon Auth environment variables."
      )

      if (result.error) {
        setError(
          "We couldn't sign you in with that email and password. Please try again."
        )
        setIsLoading(false)
        return
      }

      const sessionUserResponse = await withTimeout(
        fetch("/api/session-user", { cache: "no-store" }),
        "The session check took too long to respond. Please try again."
      )
      const sessionUserResult = (await sessionUserResponse
        .json()
        .catch(() => ({}))) as {
        error?: string
        user?: {
          email?: string | null
          name?: string | null
          role?: string | null
          status?: string | null
        }
      }

      if (!sessionUserResponse.ok) {
        setError(
          sessionUserResult.error ??
            "We signed you in, but couldn't verify your customer profile. Please try again."
        )
        setIsLoading(false)
        return
      }
      const sessionUser = sessionUserResult.user

      if (
        !sessionUser ||
        sessionUser.role !== "CLIENT" ||
        sessionUser.status !== "ACTIVE"
      ) {
        await authClient.signOut()
        setError(
          "That sign-in belongs to our staff workspace. Please use a customer account to continue shopping."
        )
        setIsLoading(false)
        return
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "customerSession",
          sessionUser.email ?? email.trim().toLowerCase()
        )
      }

      window.location.href = "/"
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
      <AuthMarketingPanel eyebrow="Client Portal" />

      <div className="relative flex flex-1 items-center justify-center bg-white p-8 lg:p-12">
        <Link
          href="/"
          className="text-charcoal/70 hover:text-navy absolute top-6 left-6 inline-flex items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] font-medium transition-colors hover:bg-[#f9fafb]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to products</span>
        </Link>

        <div className="w-full max-w-[400px]">
          {error && (
            <div className="fixed top-6 right-6 z-50 w-full max-w-[360px] rounded-[18px] border border-[#f1d7a1] bg-white/95 p-4 shadow-[0_18px_50px_rgba(26,26,46,0.14)] backdrop-blur">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff7e6] text-[#c89211]">
                  <AlertCircle className="h-[18px] w-[18px]" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-[#1a1a2e]">
                    Sign-in note
                  </p>
                  <p className="mt-1 text-[13px] leading-[20px] text-[#6a7282]">
                    {error}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setError("")}
                  className="rounded-full p-1 text-[#99a1af] transition-colors hover:bg-[#f9fafb] hover:text-[#1a1a2e]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="mb-10 text-center">
            <h2 className="text-navy mb-2.5 text-[28px] font-semibold tracking-tight">
              Welcome back
            </h2>
            <p className="text-muted text-[14px]">
              Sign in to your customer account to browse live finished products.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSignIn}>
            <div className="space-y-2">
              <label
                className="text-charcoal/80 text-[13px] font-medium"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <User className="text-muted/70 h-[18px] w-[18px]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your customer email"
                  className="border-border/80 text-charcoal placeholder:text-muted/70 focus:border-navy focus:ring-navy block w-full rounded-[10px] border bg-white py-3 pr-4 pl-10 text-[14px] transition-all focus:ring-1 focus:outline-none"
                />
              </div>
            </div>

            <div className="relative space-y-2">
              <label
                className="text-charcoal/80 text-[13px] font-medium"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="text-muted/70 h-[18px] w-[18px]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="border-border/80 text-charcoal placeholder:text-muted/70 focus:border-navy focus:ring-navy block w-full rounded-[10px] border bg-white py-3 pr-11 pl-10 text-[14px] transition-all focus:ring-1 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted/70 hover:text-charcoal absolute inset-y-0 right-0 flex items-center pr-3.5 transition-colors"
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
              className="bg-navy hover:bg-navy/95 group !mt-8 flex h-[46px] w-full cursor-pointer items-center justify-center space-x-2 rounded-[10px] text-[14px] font-medium text-white transition-all disabled:opacity-60"
            >
              <LogIn className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
              <span>{isLoading ? "Signing In..." : "Sign In"}</span>
            </button>
          </form>

          <div className="mt-8 border-t border-[#eef0f4] pt-6 text-center">
            <p className="text-muted text-[13px]">
              New to FurniTrack?{" "}
              <Link
                href="/sign-up"
                className="text-navy hover:text-navy/80 inline-flex items-center gap-1.5 font-semibold transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
