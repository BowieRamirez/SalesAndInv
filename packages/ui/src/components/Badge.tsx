import { Badge as ShadcnBadge } from "./ui/badge"
import type { BadgeProps } from "./ui/badge"
import { cn } from "../lib/utils"

export type FurniBadgeVariant =
  | "BEST_SELLER"
  | "SALE"
  | "HOT"
  | "OUT_OF_STOCK"
  | "LOW_STOCK"
  | "default"

export interface FurniBadgeProps extends Omit<BadgeProps, "variant"> {
  variant?: FurniBadgeVariant
}

const badgeClasses: Record<FurniBadgeVariant, string> = {
  BEST_SELLER: "bg-gold text-white",
  SALE: "bg-coral text-white",
  HOT: "bg-coral text-white",
  OUT_OF_STOCK: "bg-charcoal text-white",
  LOW_STOCK: "bg-gold/20 text-charcoal border-gold/40",
  default: "bg-muted/20 text-charcoal",
}

const badgeLabels: Record<FurniBadgeVariant, string> = {
  BEST_SELLER: "Best Seller",
  SALE: "Sale",
  HOT: "Hot",
  OUT_OF_STOCK: "Out of Stock",
  LOW_STOCK: "Low Stock",
  default: "",
}

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: FurniBadgeProps) {
  return (
    <ShadcnBadge
      variant="outline"
      className={cn(badgeClasses[variant], className)}
      {...props}
    >
      {children ?? badgeLabels[variant]}
    </ShadcnBadge>
  )
}
