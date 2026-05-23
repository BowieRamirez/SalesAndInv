"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react"
import { authClient } from "@/lib/auth/client"

export default function VerifyEmailPage() {
  const [code, setCode] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "resending" | "resent" | "error">("idle")
  const [error, setError] = useState("")

  // Get the current user's email from the session so we can pass it to the SDK
  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      const userEmail = (data?.user as { email?: string } | null)?.email
      if (userEmail) setEmail(userEmail)
    }).catch(() => {})
  }, [])

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setStatus("loading")

    if (!email) {
      setError("Could not determine your email address. Please sign in again.")
      setStatus("error")
      return
    }

    // Use the Neon Auth SDK directly — this is the correct way to verify an OTP
    const { error: sdkError } = await authClient.emailOtp.verifyEmail({
      email,
      otp: code.trim(),
    })

    if (sdkError) {
      setError(
        (sdkError as { message?: string }).message ??
        "Invalid or expired code. Please try again."
      )
      setStatus("error")
      return
    }

    // SDK verified — now stamp emailVerifiedAt in our own users table
    await fetch("/api/account/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ syncOnly: true }),
    }).catch(() => {})

    setStatus("done")
    // Force a fresh session reload so the navbar reflects verified status
    setTimeout(() => {
      window.location.href = "/?verified=1"
    }, 2000)
  }

  async function handleResend() {
    setStatus("resending")
    setError("")

    if (!email) {
      setError("Could not determine your email address. Please sign in again.")
      setStatus("error")
      return
    }

    // Use the Neon Auth SDK to resend the verification OTP
    const { error: sdkError } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    })

    if (sdkError) {
      setError(
        (sdkError as { message?: string }).message ??
        "Failed to resend. Please try again."
      )
      setStatus("error")
    } else {
      setStatus("resent")
    }
  }

  if (status === "done") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f6] px-4 py-12">
        <div className="w-full max-w-[420px] rounded-[24px] border border-[#e5e7eb] bg-white p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f0fdf4]">
            <CheckCircle className="h-7 w-7 text-[#16a34a]" />
          </div>
          <h2 className="text-[22px] font-semibold text-[#1a1a2e]">Email verified!</h2>
          <p className="mt-3 text-[14px] text-[#6a7282]">
            Your email has been verified. Redirecting you to the homepage…
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f8f6] px-4 py-12">
      <div className="w-full max-w-[420px]">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-[13px] font-medium text-[#6a7282] hover:text-[#1a1a2e] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-8 shadow-sm">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#eff6ff]">
              <Mail className="h-7 w-7 text-[#1d4ed8]" />
            </div>
            <h2 className="text-[24px] font-semibold text-[#1a1a2e]">Verify your email</h2>
            <p className="mt-2 text-[14px] leading-[22px] text-[#6a7282]">
              Enter the 6-digit code we sent to your email address to verify your account.
            </p>
          </div>

          {error ? (
            <div className="mb-4 rounded-[12px] border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-[13px] text-[#9f1239]">
              {error}
            </div>
          ) : null}

          {status === "resent" ? (
            <div className="mb-4 rounded-[12px] border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-[13px] text-[#166534]">
              A new verification code has been sent to your email.
            </div>
          ) : null}

          <form onSubmit={handleVerify} className="space-y-4">
            <label className="grid gap-2">
              <span className="text-[13px] font-medium text-[#374151]">Verification code</span>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
                className="w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-center text-[20px] font-mono tracking-[0.5em] text-[#1a1a2e] placeholder:text-[13px] placeholder:font-sans placeholder:tracking-normal placeholder:text-[#9ca3af] outline-none transition-colors focus:border-[#1a1a2e]"
              />
            </label>

            <button
              type="submit"
              disabled={status === "loading" || code.length < 6}
              className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#1a1a2e] text-[14px] font-medium text-white transition-colors hover:bg-[#1a1a2e]/90 disabled:opacity-60"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                "Verify email"
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-[13px] text-[#6a7282]">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={status === "resending"}
              className="font-medium text-[#1a1a2e] hover:underline disabled:opacity-60"
            >
              {status === "resending" ? "Sending…" : "Resend code"}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
