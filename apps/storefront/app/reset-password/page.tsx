"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, Lock, Loader2, CheckCircle, Mail } from "lucide-react"
import { validatePassword, passwordHint } from "@/lib/password-rules"

const inputClass =
  "w-full rounded-[12px] border border-[#d1d5dc] bg-white py-3 px-4 text-[14px] text-[#1a1a2e] placeholder:text-[#9ca3af] outline-none transition-colors focus:border-[#1a1a2e]"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Pre-fill email if coming from forgot-password page
  const [email, setEmail] = useState(searchParams.get("email") ?? "")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [show, setShow] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (otp.length !== 6) {
      setError("Enter the 6-digit code from your email.")
      return
    }
    const pwCheck = validatePassword(password)
    if (!pwCheck.ok) {
      setError(pwCheck.error)
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }

    setStatus("loading")

    const res = await fetch("/api/account/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim(), newPassword: password }),
    })

    const data = await res.json().catch(() => ({})) as { message?: string }

    if (res.ok) {
      setStatus("done")
      setTimeout(() => router.push("/sign-in"), 2500)
    } else {
      setError(data.message ?? "Reset failed. Please try again.")
      setStatus("error")
    }
  }

  if (status === "done") {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f0fdf4]">
          <CheckCircle className="h-7 w-7 text-[#16a34a]" />
        </div>
        <h2 className="text-[22px] font-semibold text-[#1a1a2e]">Password updated!</h2>
        <p className="mt-3 text-[14px] text-[#6a7282]">
          Your password has been reset. Redirecting you to sign in…
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-[24px] font-semibold text-[#1a1a2e]">Reset your password</h2>
        <p className="mt-2 text-[14px] text-[#6a7282]">
          Enter the 6-digit code from your email and choose a new password.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-[12px] border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-[13px] text-[#9f1239]">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email — pre-filled but editable */}
        <label className="grid gap-1.5">
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

        {/* OTP code */}
        <label className="grid gap-1.5">
          <span className="text-[13px] font-medium text-[#374151]">Reset code</span>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="6-digit code from email"
            maxLength={6}
            required
            className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-center text-[20px] font-mono tracking-[0.5em] text-[#1a1a2e] placeholder:text-[13px] placeholder:font-sans placeholder:tracking-normal placeholder:text-[#9ca3af] outline-none transition-colors focus:border-[#1a1a2e]"
          />
        </label>

        {/* New password */}
        <label className="grid gap-1.5">
          <span className="text-[13px] font-medium text-[#374151]">New password</span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[#9ca3af]" />
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              className="w-full rounded-[12px] border border-[#d1d5dc] bg-white py-3 pl-10 pr-11 text-[14px] text-[#1a1a2e] placeholder:text-[#9ca3af] outline-none transition-colors focus:border-[#1a1a2e]"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a1a2e]"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {password && (() => {
            const hint = passwordHint(password)
            return hint ? <p className={`text-[12px] ${hint.color}`}>{hint.text}</p> : null
          })()}
          <p className="text-[11px] text-[#9ca3af]">8–15 characters with at least one special character.</p>
        </label>

        {/* Confirm password */}
        <label className="grid gap-1.5">
          <span className="text-[13px] font-medium text-[#374151]">Confirm new password</span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[#9ca3af]" />
            <input
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your new password"
              required
              className={`w-full rounded-[12px] border py-3 pl-10 pr-4 text-[14px] outline-none transition-colors ${
                confirm && confirm !== password
                  ? "border-[#fca5a5] focus:border-[#ef4444]"
                  : "border-[#d1d5dc] focus:border-[#1a1a2e]"
              } bg-white text-[#1a1a2e] placeholder:text-[#9ca3af]`}
            />
          </div>
          {confirm && confirm !== password && (
            <p className="text-[12px] text-[#dc2626]">Passwords do not match.</p>
          )}
        </label>

        <button
          type="submit"
          disabled={status === "loading"}
          className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#1a1a2e] text-[14px] font-medium text-white transition-colors hover:bg-[#1a1a2e]/90 disabled:opacity-60"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Updating password…
            </>
          ) : (
            "Reset password"
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-[13px] text-[#6a7282]">
        Need a new code?{" "}
        <Link href="/forgot-password" className="font-medium text-[#1a1a2e] hover:underline">
          Request again
        </Link>
      </p>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f8f6] px-4 py-12">
      <div className="w-full max-w-[440px]">
        <Link
          href="/sign-in"
          className="mb-8 inline-flex items-center gap-2 text-[13px] font-medium text-[#6a7282] hover:text-[#1a1a2e] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>

        <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-8 shadow-sm">
          <Suspense fallback={null}>
            <ResetPasswordContent />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
