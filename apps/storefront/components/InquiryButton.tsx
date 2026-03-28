"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Loader2, MessageCircle, X } from "lucide-react"

type InquiryButtonProps = {
  productId: string
  productName: string
  customerEmail?: string | null
  customerName?: string | null
  className?: string
  fullWidth?: boolean
}

export function InquiryButton({
  productId,
  productName,
  customerEmail,
  customerName,
  className = "",
  fullWidth = false,
}: InquiryButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [resolvedCustomerEmail, setResolvedCustomerEmail] = useState<string | null>(customerEmail ?? null)
  const [resolvedCustomerName, setResolvedCustomerName] = useState<string | null>(customerName ?? null)
  const [formState, setFormState] = useState({
    customerName: customerName ?? "",
    customerEmail: customerEmail ?? "",
    customerPhone: "",
    message: `Hi FurniTrack, I want to inquire about ${productName}. I would like to discuss custom sizing, finish options, and pricing.`,
  })

  useEffect(() => {
    setFormState((current) => ({
      ...current,
      customerName: resolvedCustomerName ?? customerName ?? current.customerName,
      customerEmail: resolvedCustomerEmail ?? customerEmail ?? current.customerEmail,
    }))
  }, [customerEmail, customerName, resolvedCustomerEmail, resolvedCustomerName])

  useEffect(() => {
    let isMounted = true

    async function loadSession() {
      const response = await fetch("/api/session-user", { cache: "no-store" })
      const result = (await response.json().catch(() => ({}))) as {
        user?: { email?: string | null; name?: string | null; role?: string | null }
      }
      const email = result.user?.role === "CLIENT" ? result.user.email ?? null : null
      const name = result.user?.role === "CLIENT" ? result.user.name ?? null : null

      if (!isMounted) {
        return
      }

      setResolvedCustomerEmail(email)
      setResolvedCustomerName(name)
    }

    void loadSession()

    return () => {
      isMounted = false
    }
  }, [])

  const isSignedIn = useMemo(
    () => Boolean(resolvedCustomerEmail ?? customerEmail),
    [customerEmail, resolvedCustomerEmail],
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setMessage(null)

    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        customerName: formState.customerName,
        customerEmail: formState.customerEmail,
        customerPhone: formState.customerPhone,
        message: formState.message,
      }),
    })

    const result = (await response.json().catch(() => ({}))) as { message?: string; productName?: string }

    if (!response.ok) {
      setError(result.message ?? "Unable to send your inquiry right now.")
      setIsSubmitting(false)
      return
    }

    setMessage(`Your inquiry for ${result.productName ?? productName} was sent to sales.`)
    setIsSubmitting(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`${fullWidth ? "w-full" : ""} ${className}`}
      >
        <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.5} />
        Inquire Now
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1a1a2e]/70 px-4">
          <div className="w-full max-w-[560px] rounded-[20px] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] uppercase tracking-[0.24em] text-[#99a1af]">Product inquiry</p>
                <h3 className="mt-2 text-[28px] font-medium text-[#1a1a2e]">{productName}</h3>
                <p className="mt-2 text-[13px] leading-[20px] text-[#6a7282]">
                  Tell sales what you need, especially if you want custom sizing, materials, or layout changes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-[#e5e7eb] p-2 text-[#6a7282] transition-colors hover:bg-[#f9fafb] hover:text-[#1a1a2e]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!isSignedIn && (
              <div className="mb-5 rounded-[14px] border border-[#f1d7a1] bg-[#fff7e6] px-4 py-3 text-[13px] text-[#694d16]">
                Sign in with your customer account first so you can track this inquiry on the new status page.
                <div className="mt-2">
                  <Link href="/sign-in" className="font-medium underline underline-offset-2">
                    Go to sign in
                  </Link>
                </div>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6a7282]">Name</span>
                  <input
                    value={formState.customerName}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, customerName: event.target.value }))
                    }
                    className="w-full rounded-[12px] border border-[#d1d5dc] px-4 py-3 text-[14px] text-[#1a1a2e] outline-none transition-colors focus:border-[#1a1a2e]"
                    placeholder="Your full name"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6a7282]">Email</span>
                  <input
                    type="email"
                    value={formState.customerEmail}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, customerEmail: event.target.value }))
                    }
                    className="w-full rounded-[12px] border border-[#d1d5dc] px-4 py-3 text-[14px] text-[#1a1a2e] outline-none transition-colors focus:border-[#1a1a2e]"
                    placeholder="you@example.com"
                    required
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6a7282]">Phone number</span>
                <input
                  value={formState.customerPhone}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, customerPhone: event.target.value }))
                  }
                  className="w-full rounded-[12px] border border-[#d1d5dc] px-4 py-3 text-[14px] text-[#1a1a2e] outline-none transition-colors focus:border-[#1a1a2e]"
                  placeholder="+63 9xx xxx xxxx"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#6a7282]">Inquiry chat</span>
                <textarea
                  value={formState.message}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, message: event.target.value }))
                  }
                  rows={5}
                  className="w-full rounded-[12px] border border-[#d1d5dc] px-4 py-3 text-[14px] text-[#1a1a2e] outline-none transition-colors focus:border-[#1a1a2e]"
                  placeholder="Tell us what you want to customize."
                  required
                />
              </label>

              {error && <p className="text-[13px] text-[#fb2c36]">{error}</p>}
              {message && <p className="text-[13px] text-[#00a86b]">{message}</p>}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-[12px] border border-[#d1d5dc] px-4 py-3 text-[13px] font-medium text-[#1a1a2e] transition-colors hover:bg-[#f9fafb]"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isSignedIn}
                  className="inline-flex items-center gap-2 rounded-[12px] bg-[#c9a96e] px-5 py-3 text-[13px] font-medium text-[#1a1a2e] transition-colors hover:bg-[#c9a96e]/90 disabled:cursor-not-allowed disabled:bg-[#ead8b6]"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Send inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
