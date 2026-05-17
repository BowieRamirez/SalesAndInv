"use client"

import { useId, useState } from "react"

type PasswordFieldProps = {
  name: string
  placeholder?: string
  className?: string
}

export function PasswordField({ name, placeholder, className }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false)
  const inputId = useId()

  return (
    <div className="grid gap-2">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
        <input
          id={inputId}
          name={name}
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete="new-password"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className={className}
        />
        <button
          type="button"
          aria-controls={inputId}
          aria-pressed={isVisible}
          onClick={() => setIsVisible((current) => !current)}
          className="rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-2.5 text-[13px] font-medium text-[#334155] transition-colors hover:border-[#94a3b8] hover:bg-white"
        >
          {isVisible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  )
}
