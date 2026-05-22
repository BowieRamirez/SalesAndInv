"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle")
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setError("")

    const res = await fetch("/api/account/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        redirectTo: `${window.location.origin}/reset-password`,
      }),
    })

    const data = await res.json().catch(() => ({})) as { message?: string }

    if (res.ok) {
      setStatus("sent")
    } else {
      setError(data.message ?? "Failed to send reset link. Please try again.")
      setStatus("error")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f8f6] px-4 py-12">
      <div className="w-full max-w-[420px]">
        <Link
          href="/sign-in"
          className="mb-8 inline-flex items-center gap-2 text-[13px] font-medium text-[#6a7282] hover:text-[#1a1a2e] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>

        <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-8 shadow-sm">
          {status === "sent" ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f0fdf4]">
                <CheckCircle className="h-7 w-7 text-[#16a34a]" />
              </div>
              <h2 className="text-[22px] font-semibold text-[#1a1a2e]">Check your email</h2>
              <p className="mt-3 text-[14px] leading-[22px] text-[#6a7282]">
                We sent a password reset link to{" "}
                <span className="font-medium text-[#1a1a2e]">{email}</span>.
                Check your inbox and follow the link to reset your password.
              </p>
              <p className="mt-4 text-[13px] text-[#9ca3af]">
                Didn&apos;t receive it? Check your spam folder or{" "}
                <button
                  type="button"
                  onClick={() => { setStatus("idle"); setError("") }}
                  className="text-[#1a1a2e] underline hover:no-underline"
                >
                  try again
                </button>
                .
              </p>
              <div className="mt-6">
                <a
                  href={`/reset-password?email=${encodeURIComponent(email)}`}
                  className="flex h-[42px] w-full items-center justify-center rounded-[12px] bg-[#1a1a2e] text-[14px] font-medium text-white hover:bg-[#1a1a2e]/90 transition-colors"
                >
                  Enter reset code →
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-[24px] font-semibold text-[#1a1a2e]">Forgot your password?</h2>
                <p className="mt-2 text-[14px] leading-[22px] text-[#6a7282]">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              {error ? (
                <div className="mb-5 rounded-[12px] border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-[13px] text-[#9f1239]">
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="grid gap-2">
                  <span className="text-[13px] font-medium text-[#374151]">Email address</span>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[#9ca3af]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full rounded-[12px] border border-[#d1d5dc] bg-white py-3 pl-10 pr-4 text-[14px] text-[#1a1a2e] placeholder:text-[#9ca3af] outline-none transition-colors focus:border-[#1a1a2e]"
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#1a1a2e] text-[14px] font-medium text-white transition-colors hover:bg-[#1a1a2e]/90 disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
