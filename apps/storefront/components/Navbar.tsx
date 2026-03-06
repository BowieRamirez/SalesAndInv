import Link from "next/link"
import { Search, User } from "lucide-react"

export function Navbar() {
  return (
    <header className="bg-[--color-navy] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-white shrink-0">
          FurniTrack
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-2xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--color-muted]" />
          <input
            type="text"
            placeholder="Search furniture, decor, collections..."
            className="w-full bg-white/10 border border-white/20 rounded-md pl-10 pr-4 py-2 text-sm text-white placeholder:text-[--color-muted] focus:outline-none focus:border-[--color-gold]"
          />
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80 shrink-0">
          <Link href="/shop" className="hover:text-white transition-colors">
            Shop
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            My Orders
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/sign-in"
            className="hidden md:block text-sm text-white/80 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="text-sm bg-[--color-gold] text-white px-4 py-1.5 rounded-md hover:bg-[--color-gold]/90 transition-colors"
          >
            Create Account
          </Link>
          <User className="w-5 h-5 text-white/70 md:hidden" />
        </div>
      </div>
    </header>
  )
}
