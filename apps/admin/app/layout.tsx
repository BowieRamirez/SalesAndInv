import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "../components/Sidebar"

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
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
