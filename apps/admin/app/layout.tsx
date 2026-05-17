import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Admin Portal | SIMS",
  description: "SIMS internal management portal — admin access only",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[#fcfcfc] text-charcoal">
        {children}
      </body>
    </html>
  )
}
