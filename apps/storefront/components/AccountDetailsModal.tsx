"use client"

import { useState, useEffect } from "react"
import { X, User, Lock, CheckCircle, Loader2, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react"
import { validatePassword, passwordHint } from "@/lib/password-rules"

type AccountUser = {
  id: string
  name: string
  email: string
  phone: string | null
  address: string | null
  emailVerifiedAt: string | null
  createdAt: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
}

const inputClass =
  "w-full rounded-[12px] border border-[#d1d5dc] bg-white px-4 py-3 text-[14px] text-[#1a1a2e] placeholder:text-[#9ca3af] outline-none transition-colors focus:border-[#1a1a2e]"

export function AccountDetailsModal({ isOpen, onClose }: Props) {
  const [tab, setTab] = useState<"details" | "password">("details")
  const [user, setUser] = useState<AccountUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [saveError, setSaveError] = useState("")

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)
  const [pwStatus, setPwStatus] = useState<"idle" | "loading" | "done" | "error">("idle")
  const [pwError, setPwError] = useState("")

  // Editable fields
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    fetch("/api/account/details")
      .then((r) => r.json())
      .then((data: { user?: AccountUser }) => {
        if (data.user) {
          setUser(data.user)
          setName(data.user.name)
          setPhone(data.user.phone ?? "")
          setAddress(data.user.address ?? "")
        }
      })
      .catch(() => undefined)
      .finally(() => setLoading(false))
  }, [isOpen])

  async function handleSaveDetails(e: React.FormEvent) {
    e.preventDefault()
    setSaveStatus("saving")
    setSaveError("")

    const response = await fetch("/api/account/details", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone: phone || null, address: address || null }),
    })

    if (response.ok) {
      setSaveStatus("saved")
      if (user) setUser({ ...user, name, phone: phone || null, address: address || null })
      setTimeout(() => setSaveStatus("idle"), 2000)
    } else {
      setSaveStatus("error")
      setSaveError("Failed to save changes. Please try again.")
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwError("")

    const pwCheck = validatePassword(newPassword)
    if (!pwCheck.ok) {
      setPwError(pwCheck.error)
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError("Passwords do not match.")
      return
    }

    setPwStatus("loading")

    try {
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json().catch(() => ({})) as { message?: string }

      if (!res.ok) {
        throw new Error(data.message ?? "Password change failed. Check your current password.")
      }

      setPwStatus("done")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setPwStatus("idle"), 3000)
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Password change failed. Check your current password.")
      setPwStatus("error")
    }
  }

  if (!isOpen) return null

  const isVerified = !!user?.emailVerifiedAt
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/50 px-4 py-8">
      <div className="w-full max-w-[520px] rounded-[24px] bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f1f5f9] px-6 py-5">
          <div>
            <h3 className="text-[18px] font-semibold text-[#1a1a2e]">Account details</h3>
            <p className="mt-0.5 text-[13px] text-[#6a7282]">Manage your profile and password</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e7eb] text-[#6a7282] hover:bg-[#f9fafb] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#f1f5f9]">
          {(["details", "password"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-[13px] font-medium transition-colors ${
                tab === t
                  ? "border-b-2 border-[#1a1a2e] text-[#1a1a2e]"
                  : "text-[#6a7282] hover:text-[#1a1a2e]"
              }`}
            >
              {t === "details" ? (
                <><User className="h-4 w-4" /> Profile details</>
              ) : (
                <><Lock className="h-4 w-4" /> Change password</>
              )}
            </button>
          ))}
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-[#9ca3af]" />
            </div>
          ) : tab === "details" ? (
            <div className="space-y-5">
              {/* Email verification status */}
              <div className={`flex items-center gap-3 rounded-[14px] px-4 py-3 ${isVerified ? "bg-[#f0fdf4] border border-[#bbf7d0]" : "bg-[#fffbeb] border border-[#fde68a]"}`}>
                {isVerified ? (
                  <ShieldCheck className="h-5 w-5 shrink-0 text-[#16a34a]" />
                ) : (
                  <AlertCircle className="h-5 w-5 shrink-0 text-[#a16207]" />
                )}
                <div>
                  <p className={`text-[13px] font-medium ${isVerified ? "text-[#15803d]" : "text-[#a16207]"}`}>
                    {isVerified ? "Email verified" : "Email not verified"}
                  </p>
                  {!isVerified && (
                    <p className="text-[12px] text-[#92400e]">
                      Go to the account menu → Verify Email to confirm your address.
                    </p>
                  )}
                </div>
              </div>

              {/* Read-only info */}
              <div className="grid gap-4 rounded-[14px] bg-[#f8fafc] px-4 py-4 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Email</p>
                  <p className="mt-1 text-[14px] font-medium text-[#1a1a2e]">{user?.email ?? "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">Member since</p>
                  <p className="mt-1 text-[14px] font-medium text-[#1a1a2e]">{joinedDate}</p>
                </div>
              </div>

              {/* Editable fields */}
              <form onSubmit={handleSaveDetails} className="space-y-4">
                <label className="grid gap-1.5">
                  <span className="text-[13px] font-medium text-[#374151]">Full name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-[13px] font-medium text-[#374151]">
                    Phone number <span className="font-normal text-[#9ca3af]">(optional)</span>
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 09XX XXX XXXX"
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-[13px] font-medium text-[#374151]">
                    Address <span className="font-normal text-[#9ca3af]">(optional)</span>
                  </span>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Your delivery address"
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </label>

                {saveError && (
                  <p className="text-[13px] text-[#9f1239]">{saveError}</p>
                )}

                <button
                  type="submit"
                  disabled={saveStatus === "saving"}
                  className="flex h-[42px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#1a1a2e] text-[14px] font-medium text-white transition-colors hover:bg-[#1a1a2e]/90 disabled:opacity-60"
                >
                  {saveStatus === "saving" ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                  ) : saveStatus === "saved" ? (
                    <><CheckCircle className="h-4 w-4" /> Saved!</>
                  ) : (
                    "Save changes"
                  )}
                </button>
              </form>
            </div>
          ) : (
            // Password tab
            <form onSubmit={handleChangePassword} className="space-y-4">
              {pwStatus === "done" && (
                <div className="rounded-[12px] border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-[13px] text-[#166534]">
                  ✓ Password updated successfully.
                </div>
              )}
              {pwError && (
                <div className="rounded-[12px] border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-[13px] text-[#9f1239]">
                  {pwError}
                </div>
              )}

              <label className="grid gap-1.5">
                <span className="text-[13px] font-medium text-[#374151]">Current password</span>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Your current password"
                    required
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a1a2e]"
                  >
                    {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <label className="grid gap-1.5">
                <span className="text-[13px] font-medium text-[#374151]">New password</span>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  className={inputClass}
                />
                {newPassword && (() => {
                  const hint = passwordHint(newPassword)
                  return hint ? <p className={`text-[12px] ${hint.color}`}>{hint.text}</p> : null
                })()}
                <p className="text-[11px] text-[#9ca3af]">8–15 characters with at least one special character.</p>
              </label>

              <label className="grid gap-1.5">
                <span className="text-[13px] font-medium text-[#374151]">Confirm new password</span>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  className={inputClass}
                />
              </label>

              <button
                type="submit"
                disabled={pwStatus === "loading"}
                className="flex h-[42px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#1a1a2e] text-[14px] font-medium text-white transition-colors hover:bg-[#1a1a2e]/90 disabled:opacity-60"
              >
                {pwStatus === "loading" ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Updating…</>
                ) : (
                  "Update password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
