import {
  Card as ShadcnCard,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "./ui/card"
import type { HTMLAttributes } from "react"
import { cn } from "../lib/utils"

export interface FurniCardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg"
}

const paddingClasses = {
  sm: "p-3",
  md: "p-5",
  lg: "p-8",
}

export function Card({ padding = "md", className, children, ...props }: FurniCardProps) {
  return (
    <ShadcnCard
      className={cn(
        "bg-white shadow-sm border border-beige rounded-lg",
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </ShadcnCard>
  )
}

// Re-export shadcn Card sub-components for use with FurniTrack Card
export { CardHeader, CardContent, CardFooter, CardTitle, CardDescription }
