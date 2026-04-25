"use client"

import React, { useState } from "react"
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  User,
} from "lucide-react"
import Link from "next/link"
import { AuthMarketingPanel } from "@/components/AuthMarketingPanel"

const REGISTER_TIMEOUT_MS = 15000

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit) {
  const controller = new AbortController()
  const timeout = window.setTimeout(
    () => controller.abort(),
    REGISTER_TIMEOUT_MS
  )

  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    window.clearTimeout(timeout)
  }
}

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await fetchWithTimeout("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      const result = (await response.json().catch(() => ({}))) as {
        message?: string
      }

      if (!response.ok) {
        setError(result.message ?? "Unable to create account.")
        setIsLoading(false)
        return
      }

      setSuccess("Your account has been created in Neon. You can sign in now.")
      setForm({ name: "", email: "", password: "" })
      setIsLoading(false)
    } catch {
      setError(
        "The registration request timed out. Check Neon Auth configuration and try again."
      )
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#fcfcfc] py-10 font-[family-name:var(--font-inter)] lg:flex-row lg:py-0">
      <AuthMarketingPanel eyebrow="Customer Registration" />

      <div className="relative flex flex-1 items-center justify-center bg-white p-8 lg:p-12">
        <Link
          href="/"
          className="text-charcoal/70 hover:text-navy absolute top-6 left-6 inline-flex items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] font-medium transition-colors hover:bg-[#f9fafb]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to products</span>
        </Link>

        <div className="w-full max-w-[400px]">
          <div className="mb-10 text-center">
            <h2 className="text-navy mb-2.5 text-[28px] font-semibold tracking-tight">
              Create an account
            </h2>
            <p className="text-muted text-[14px]">
              Register as a client to browse the live finished-product catalog.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start space-x-2.5 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle className="mt-0.5 h-[16px] w-[16px] shrink-0 text-red-500" />
              <p className="text-[13px] leading-snug text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-[10px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="text-charcoal/80 text-[13px] font-medium"
                htmlFor="name"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <User className="text-muted/70 h-[18px] w-[18px]" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, name: e.target.value }))
                  }
                  placeholder="Enter your full name"
                  className="border-border/80 text-charcoal placeholder:text-muted/70 focus:border-navy focus:ring-navy block w-full rounded-[10px] border bg-white py-3 pr-4 pl-10 text-[14px] transition-all focus:ring-1 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-charcoal/80 text-[13px] font-medium"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="text-muted/70 h-[18px] w-[18px]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Enter your email"
                  className="border-border/80 text-charcoal placeholder:text-muted/70 focus:border-navy focus:ring-navy block w-full rounded-[10px] border bg-white py-3 pr-4 pl-10 text-[14px] transition-all focus:ring-1 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
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
                  value={form.password}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Create a strong password"
                  className="border-border/80 text-charcoal placeholder:text-muted/70 focus:border-navy focus:ring-navy block w-full rounded-[10px] border bg-white py-3 pr-11 pl-10 text-[14px] transition-all focus:ring-1 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
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
              className="bg-navy hover:bg-navy/95 group !mt-8 flex h-[46px] w-full items-center justify-center space-x-2 rounded-[10px] text-[14px] font-medium text-white transition-all disabled:opacity-60"
            >
              <LogIn className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
              <span>{isLoading ? "Creating..." : "Create Account"}</span>
            </button>
          </form>

          <div className="mt-8 pt-2 text-center">
            <p className="text-muted text-[13px]">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-navy hover:text-navy/80 font-semibold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
