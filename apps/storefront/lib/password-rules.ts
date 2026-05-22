export const PASSWORD_RULES = {
  min: 8,
  max: 15,
  specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/,
}

export type PasswordValidationResult =
  | { ok: true }
  | { ok: false; error: string }

export function validatePassword(password: string): PasswordValidationResult {
  if (password.length < PASSWORD_RULES.min) {
    return { ok: false, error: `Password must be at least ${PASSWORD_RULES.min} characters.` }
  }
  if (password.length > PASSWORD_RULES.max) {
    return { ok: false, error: `Password must be no more than ${PASSWORD_RULES.max} characters.` }
  }
  if (!PASSWORD_RULES.specialChar.test(password)) {
    return { ok: false, error: "Password must include at least one special character (e.g. !@#$%^&*)." }
  }
  return { ok: true }
}

/** Live strength indicator text shown while the user types */
export function passwordHint(password: string): { text: string; color: string } | null {
  if (!password) return null
  const tooShort = password.length < PASSWORD_RULES.min
  const tooLong = password.length > PASSWORD_RULES.max
  const noSpecial = !PASSWORD_RULES.specialChar.test(password)

  if (tooLong) return { text: `Too long — maximum ${PASSWORD_RULES.max} characters.`, color: "text-[#dc2626]" }
  if (tooShort) return { text: `Too short — ${PASSWORD_RULES.min - password.length} more character${PASSWORD_RULES.min - password.length === 1 ? "" : "s"} needed.`, color: "text-[#dc2626]" }
  if (noSpecial) return { text: "Add a special character (e.g. !@#$%^&*).", color: "text-[#a16207]" }
  return { text: "Password looks good ✓", color: "text-[#16a34a]" }
}
