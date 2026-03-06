import { Button as ShadcnButton } from "./ui/button"
import type { ButtonProps } from "./ui/button"
import { cn } from "../lib/utils"

export interface FurniButtonProps extends Omit<ButtonProps, "variant"> {
  variant?: "primary" | "secondary" | "ghost"
}

export function Button({ variant = "primary", className, ...props }: FurniButtonProps) {
  const variantClasses: Record<string, string> = {
    primary: "bg-gold text-white hover:bg-gold/90 border-transparent",
    secondary: "bg-navy text-white hover:bg-navy/90 border-transparent",
    ghost: "bg-transparent text-charcoal hover:bg-beige border-transparent",
  }
  return (
    <ShadcnButton
      variant="default"
      className={cn(variantClasses[variant], className)}
      {...props}
    />
  )
}
