import { Input as ShadcnInput } from "./ui/input"
import type { InputProps } from "./ui/input"
import { cn } from "../lib/utils"

export interface FurniInputProps extends InputProps {
  label?: string
  error?: string
}

export function Input({ label, error, className, id, ...props }: FurniInputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-")
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-charcoal">
          {label}
        </label>
      )}
      <ShadcnInput
        id={inputId}
        className={cn(
          "border-muted/40 focus:border-navy focus:ring-1 focus:ring-navy",
          error && "border-coral focus:border-coral focus:ring-coral",
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className="text-sm text-coral">
          {error}
        </span>
      )}
    </div>
  )
}
