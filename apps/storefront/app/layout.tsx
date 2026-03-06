import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "FurniTrack",
  description: "Premium furniture for every space",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
