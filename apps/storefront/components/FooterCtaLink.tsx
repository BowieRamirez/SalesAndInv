"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function FooterCtaLink() {
  const [isCustomer, setIsCustomer] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadSession() {
      const cachedSession =
        typeof window !== "undefined"
          ? localStorage.getItem("customerSession")
          : null

      if (cachedSession && isMounted) {
        setIsCustomer(true)
      }

      const response = await fetch("/api/session-user", { cache: "no-store" })
      const result = (await response.json().catch(() => ({}))) as {
        user?: { role?: string | null; status?: string | null }
      }
      const user = result.user

      if (isMounted) {
        setIsCustomer(user?.role === "CLIENT" && user.status === "ACTIVE")
      }
    }

    void loadSession()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <Link
      href={isCustomer ? "/shop" : "/sign-up"}
      className="flex items-center justify-center gap-2 bg-white px-[24px] py-[12px] text-[13px] font-medium text-[#1a1a2e] transition-colors hover:bg-white/90"
    >
      {isCustomer ? "Browse Collection" : "Get Started Free"}
      <ArrowRight className="h-4 w-4" />
    </Link>
  )
}
