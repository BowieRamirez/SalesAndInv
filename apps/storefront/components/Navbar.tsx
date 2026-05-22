"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Search, MapPin, Globe, User, LogOut, ChevronDown, ShieldCheck, Settings, ClipboardList } from "lucide-react"
import { AccountDetailsModal } from "./AccountDetailsModal"

type SessionUser = {
  email?: string | null
  name?: string | null
  role?: string | null
  status?: string | null
  emailVerifiedAt?: string | null
}

export function Navbar() {
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [accountModalOpen, setAccountModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true

    // Step 1: Show name immediately from localStorage (no flicker)
    const cachedEmail = typeof window !== "undefined" ? localStorage.getItem("customerSession") : null
    if (cachedEmail && isMounted) {
      setSessionUser({ email: cachedEmail })
    }

    // Step 2: Fetch fresh session in the background (non-blocking)
    async function loadSession() {
      try {
        const response = await fetch("/api/session-user", { cache: "no-store" })
        const result = (await response.json().catch(() => ({}))) as { user?: SessionUser }
        const user = result.user

        if (user?.role === "CLIENT" && user.status === "ACTIVE" && isMounted) {
          localStorage.setItem("customerSession", user.email ?? "")
          setSessionUser(user)
          return
        }

        // If the API returned nothing valid, keep the localStorage fallback
      } catch {
        // Network error — keep showing the cached session
      }
    }

    if (typeof window !== "undefined") {
      void loadSession()
    }

    return () => { isMounted = false }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    // Fire the session deletion without waiting — don't block navigation
    fetch("/api/portal-session", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ portal: "storefront" }),
    }).catch(() => undefined)

    if (typeof window !== "undefined") {
      localStorage.removeItem("customerSession")
      setSessionUser(null)
      setDropdownOpen(false)
      window.location.href = "/"
    }
  }

  const displayName = sessionUser?.name ?? sessionUser?.email?.split("@")[0] ?? ""
  const isVerified = !!sessionUser?.emailVerifiedAt

  return (
    <>
      <header className="w-full bg-[#1a1a2e] text-white">
        <div className="max-w-[1336px] mx-auto px-[38px] h-[64px] flex items-center justify-between gap-[32px]">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="font-[family-name:var(--font-inter)] text-xl font-bold tracking-[0.9px] text-white flex items-center gap-2">
              <span className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </span>
              FurniTrack
            </Link>
          </div>

          {/* Search */}
          <form action="/shop" className="flex-[1_0_0] h-[36px] flex overflow-hidden lg:max-w-xl">
            <input
              name="q"
              type="text"
              placeholder="Search furniture, decor, collections..."
              className="flex-1 bg-white h-full px-[16px] text-[13px] font-[family-name:var(--font-inter)] text-[#0a0a0a] placeholder:text-[#0a0a0a]/50 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#c9a96e] px-[20px] flex items-center justify-center gap-[6px] transition-colors hover:bg-[#c9a96e]/90 shrink-0"
            >
              <Search className="w-4 h-4 text-[#1a1a2e]" />
              <span className="font-[family-name:var(--font-inter)] font-medium text-[13px] text-[#1a1a2e]">Search</span>
            </button>
          </form>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-[20px] shrink-0 font-[family-name:var(--font-inter)]">
            <div className="flex items-center gap-[6px]">
              <MapPin className="w-[14px] h-[14px] text-white" />
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50 leading-[12px]">Deliver to</span>
                <span className="text-[11px] text-white leading-[14px]">Worldwide</span>
              </div>
            </div>

            <div className="flex items-center gap-[4px] border-l border-white/20 pl-[20px]">
              <Globe className="w-[14px] h-[14px] text-white" />
              <span className="text-[11px] text-white leading-[16.5px]">English</span>
            </div>

            {sessionUser ? (
              <>
                <Link
                  href="/account/status"
                  className="border-l border-white/20 pl-[20px] text-[11px] font-medium text-white/80 transition-opacity hover:opacity-80"
                >
                  Status
                </Link>

                {/* Clickable user name dropdown */}
                <div ref={dropdownRef} className="relative border-l border-white/20 pl-[20px]">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex items-center gap-[6px] transition-opacity hover:opacity-80"
                  >
                    <div className="relative">
                      <User className="w-[16px] h-[16px] text-white" />
                      {isVerified && (
                        <ShieldCheck className="absolute -bottom-1 -right-1 w-[10px] h-[10px] text-[#4ade80]" />
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-white/80 leading-[16.5px] max-w-[120px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className={`w-[12px] h-[12px] text-white/60 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[220px] overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-white shadow-xl">
                      {/* User info header */}
                      <div className="border-b border-[#f1f5f9] px-4 py-3">
                        <p className="text-[13px] font-semibold text-[#1a1a2e] truncate">{displayName}</p>
                        <p className="text-[11px] text-[#6a7282] truncate">{sessionUser.email}</p>
                        {isVerified ? (
                          <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-[#16a34a]">
                            <ShieldCheck className="h-3 w-3" /> Verified
                          </span>
                        ) : (
                          <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-[#a16207]">
                            ⚠ Not verified
                          </span>
                        )}
                      </div>

                      {/* Menu items */}
                      <div className="py-1">
                        {!isVerified && (
                          <Link
                            href="/verify-email"
                            onClick={() => setDropdownOpen(false)}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] text-[#374151] hover:bg-[#f9fafb] transition-colors"
                          >
                            <ShieldCheck className="h-4 w-4 text-[#1d4ed8]" />
                            Verify Email
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => { setAccountModalOpen(true); setDropdownOpen(false) }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] text-[#374151] hover:bg-[#f9fafb] transition-colors"
                        >
                          <Settings className="h-4 w-4 text-[#6b7280]" />
                          Account details
                        </button>
                        <Link
                          href="/account/status"
                          onClick={() => setDropdownOpen(false)}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] text-[#374151] hover:bg-[#f9fafb] transition-colors"
                        >
                          <ClipboardList className="h-4 w-4 text-[#6b7280]" />
                          My orders
                        </Link>
                      </div>

                      <div className="border-t border-[#f1f5f9] py-1">
                        <button
                          type="button"
                          onClick={() => { handleLogout(); setDropdownOpen(false) }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] text-[#9f1239] hover:bg-[#fff1f2] transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="flex items-center gap-[6px] border-l border-white/20 pl-[20px] hover:opacity-80 transition-opacity">
                  <User className="w-[16px] h-[16px] text-white" />
                  <span className="text-[11px] font-medium text-white/80 leading-[16.5px]">Sign in</span>
                </Link>
                <Link href="/sign-up" className="bg-[#c9a96e] h-[28px] px-[16px] ml-2 flex items-center justify-center text-[11px] font-medium text-[#1a1a2e] hover:bg-[#c9a96e]/90 transition-colors">
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <AccountDetailsModal isOpen={accountModalOpen} onClose={() => setAccountModalOpen(false)} />
    </>
  )
}
