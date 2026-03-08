import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Admin Dashboard | FurniTrack",
  description: "FurniTrack internal management dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased bg-[#fcfcfc] text-charcoal`}>
        {children}
      </body>
    </html>
  )
}
