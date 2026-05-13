"use client"

import React, { useEffect, useState } from "react"
import {
  AlertCircle,
  ArrowLeft,
  Box,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  User,
  X,
} from "lucide-react"
import { cn } from "../lib/utils"

const AUTH_CLIENT_TIMEOUT_MS = 15000

type AuthSignInResult = {
  error?: {
    message?: string | null
  } | null
}

type AuthClient = {
  signIn: {
    email: (credentials: { email: string; password: string }) => Promise<AuthSignInResult>
  }
  signOut?: () => Promise<unknown>
}

type SessionUser = {
  email?: string | null
  name?: string | null
  role?: string | null
  status?: string | null
}

type SessionUserResponse = {
  error?: string
  user?: SessionUser | null
}

type RevealImageSource = {
  src: string
  alt: string
}

type SharedLoginPageProps = {
  authClient: AuthClient
  portal: "admin" | "storefront"
  eyebrow: string
  title?: string
  description: string
  emailPlaceholder: string
  submitLabel: string
  loadingLabel: string
  sessionErrorMessage: string
  invalidRoleMessage: string
  verifySessionUser: (user: SessionUser | null | undefined) => boolean
  getRedirectPath: (user: SessionUser | null | undefined) => string
  onValidSession?: (user: SessionUser, email: string) => void | Promise<void>
  backLink?: {
    href: string
    label: string
  }
  footer?: React.ReactNode
}

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

function RevealImageListItem({
  text,
  images,
}: {
  text: string
  images: readonly [RevealImageSource, RevealImageSource]
}) {
  const container = "absolute top-4 right-6 z-40 h-24 w-20 sm:right-10"
  const effect =
    "relative h-20 w-20 scale-0 overflow-hidden rounded-md opacity-0 shadow-none transition-all delay-100 duration-500 group-hover:h-full group-hover:w-full group-hover:scale-100 group-hover:opacity-100 group-hover:shadow-xl"

  return (
    <div className="group relative h-fit w-full max-w-[620px] overflow-visible py-2 text-center sm:py-3">
      <h3 className="text-center text-[3.1rem] leading-none font-black text-white transition-all duration-500 group-hover:opacity-40 sm:text-[4.9rem] xl:text-[5.6rem]">
        {text}
      </h3>
      <div className={container}>
        <div className={effect}>
          <img
            alt={images[1].alt}
            src={images[1].src}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <div
        className={cn(
          container,
          "translate-x-0 translate-y-0 rotate-0 transition-all delay-150 duration-500 group-hover:translate-x-6 group-hover:translate-y-6 group-hover:rotate-12"
        )}
      >
        <div className={cn(effect, "duration-200")}>
          <img
            alt={images[0].alt}
            src={images[0].src}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

function RevealImageList() {
  const items = [
    {
      text: "Office Tables",
      images: [
        {
          src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=240&auto=format&fit=crop&q=70",
          alt: "Office desk in a bright workspace",
        },
        {
          src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=240&auto=format&fit=crop&q=70",
          alt: "Modern office table setup",
        },
      ],
    },
    {
      text: "Pedestals",
      images: [
        {
          src: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=240&auto=format&fit=crop&q=70",
          alt: "Compact office storage near a desk",
        },
        {
          src: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=240&auto=format&fit=crop&q=70",
          alt: "Workspace drawer pedestal and desk",
        },
      ],
    },
    {
      text: "Cabinets",
      images: [
        {
          src: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=240&auto=format&fit=crop&q=70",
          alt: "Wood cabinet storage",
        },
        {
          src: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=240&auto=format&fit=crop&q=70",
          alt: "Office shelving and cabinet display",
        },
      ],
    },
  ] as const

  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-sm bg-transparent py-4 text-center">
      <p className="text-sm font-black text-white/45 uppercase">
        Office collection
      </p>
      {items.map((item) => (
        <RevealImageListItem
          key={item.text}
          text={item.text}
          images={item.images}
        />
      ))}
    </div>
  )
}

function AuthMarketingPanel({ eyebrow }: { eyebrow: string }) {
  return (
    <div className="bg-navy relative flex min-h-[560px] flex-col justify-between overflow-hidden p-8 text-white lg:min-h-screen lg:w-[45%] xl:p-14">
      <div className="pointer-events-none absolute top-[-10%] left-[-15%] h-[45rem] w-[45rem] rounded-full border-[60px] border-white/[0.03]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] h-[30rem] w-[30rem] rounded-full border-[40px] border-white/[0.03]" />
      <div className="pointer-events-none absolute top-[30%] right-[-15%] h-[50rem] w-[50rem] rounded-full border-[50px] border-white/[0.03]" />

      <div className="relative z-10 mt-4 flex items-center space-x-3 lg:mt-0">
        <div className="rounded-xl border border-white/5 bg-white/10 p-2.5 shadow-sm">
          <Box className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[17px] leading-tight font-semibold tracking-wide">
            FurniTrack
          </h1>
          <p className="mt-0.5 text-[11px] font-medium tracking-wider text-white/50 uppercase">
            {eyebrow}
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-12 mb-auto flex w-full max-w-[620px] flex-col items-center text-center">
        <p className="mb-6 max-w-[500px] text-[15px] leading-relaxed text-white/62 xl:text-[16px]">
          FurniTrack offers office tables, mobile pedestals, cabinets, and
          workspace storage built for organized, functional business spaces.
        </p>
        <RevealImageList />
      </div>

      <div className="relative z-10 mb-4 text-[12px] font-medium text-white/40 lg:mb-0 xl:pl-4">
        &copy; 2026 SIMS Co. All rights reserved.
      </div>
    </div>
  )
}

export function SharedLoginPage({
  authClient,
  portal,
  eyebrow,
  title = "Welcome back",
  description,
  emailPlaceholder,
  submitLabel,
  loadingLabel,
  sessionErrorMessage,
  invalidRoleMessage,
  verifySessionUser,
  getRedirectPath,
  onValidSession,
  backLink,
  footer,
}: SharedLoginPageProps) {
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

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    const emailLower = email.trim().toLowerCase()

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
            "We couldn't sign you in with that email and password. Please try again."
        )
        setIsLoading(false)
        return
      }

      const sessionUserResponse = await withTimeout(
        fetch("/api/session-user?fresh=1", { cache: "no-store" }),
        "The session check took too long to respond. Please try again."
      )
      const sessionUserResult = (await sessionUserResponse
        .json()
        .catch(() => ({}))) as SessionUserResponse

      if (!sessionUserResponse.ok) {
        setError(sessionUserResult.error ?? sessionErrorMessage)
        setIsLoading(false)
        return
      }

      const sessionUser = sessionUserResult.user

      if (!verifySessionUser(sessionUser)) {
        setError(invalidRoleMessage)
        setIsLoading(false)
        return
      }

      await onValidSession?.(sessionUser!, emailLower)
      window.location.href = getRedirectPath(sessionUser)
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
      <AuthMarketingPanel eyebrow={eyebrow} />

      <div className="relative flex flex-1 items-center justify-center bg-white p-8 lg:p-12">
        {backLink && (
          <a
            href={backLink.href}
            className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] font-medium text-[#6a7282] transition-colors hover:bg-[#f9fafb] hover:text-[#1a1a2e]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{backLink.label}</span>
          </a>
        )}

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
            <h2 className="mb-2.5 font-[family-name:var(--font-inter)] text-[28px] font-semibold tracking-tight text-[#1a1a2e]">
              {title}
            </h2>
            <p className="text-[14px] text-[#6a7282]">{description}</p>
          </div>

          <form className="space-y-5" onSubmit={handleSignIn}>
            <div className="space-y-2">
              <label
                className="text-[13px] font-medium text-[#2d2d2d]"
                htmlFor={`${portal}-email`}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <User className="h-[18px] w-[18px] text-[#99a1af]" />
                </div>
                <input
                  id={`${portal}-email`}
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={emailPlaceholder}
                  className="block w-full rounded-[10px] border border-[#d1d5dc] bg-white py-3 pr-4 pl-10 text-[14px] text-[#1a1a2e] transition-all placeholder:text-[#99a1af] focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e] focus:outline-none"
                />
              </div>
            </div>

            <div className="relative space-y-2">
              <label
                className="text-[13px] font-medium text-[#2d2d2d]"
                htmlFor={`${portal}-password`}
              >
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-[18px] w-[18px] text-[#99a1af]" />
                </div>
                <input
                  id={`${portal}-password`}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="block w-full rounded-[10px] border border-[#d1d5dc] bg-white py-3 pr-11 pl-10 text-[14px] text-[#1a1a2e] transition-all placeholder:text-[#99a1af] focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#99a1af] transition-colors hover:text-[#1a1a2e]"
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
              className="group !mt-8 flex h-[46px] w-full cursor-pointer items-center justify-center space-x-2 rounded-[10px] bg-[#1a1a2e] text-[14px] font-medium text-white transition-all hover:bg-[#1a1a2e]/90 disabled:opacity-60"
            >
              <LogIn className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
              <span>{isLoading ? loadingLabel : submitLabel}</span>
            </button>
          </form>

          {footer && (
            <div className="mt-8 border-t border-[#eef0f4] pt-6 text-center">
              {footer}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export type { SessionUser, SharedLoginPageProps }
