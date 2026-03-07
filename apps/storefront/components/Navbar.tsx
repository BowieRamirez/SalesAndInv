import Link from "next/link"
import { Search, MapPin, Globe, User } from "lucide-react"

export function Navbar() {
  return (
    <header className="w-full bg-[#1a1a2e] text-white">
      <div className="max-w-[1336px] mx-auto px-[38px] h-[64px] flex items-center justify-between gap-[32px]">
        {/* Logo */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="font-[family-name:var(--font-inter)] text-xl font-bold tracking-[0.9px] text-white flex items-center gap-2">
            <span className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </span>
            FurniTrack
          </Link>
        </div>

        {/* Search */}
        <div className="flex-[1_0_0] h-[36px] flex overflow-hidden lg:max-w-xl">
          <input
            type="text"
            placeholder="Search furniture, decor, collections..."
            className="flex-1 bg-white h-full px-[16px] text-[13px] font-[family-name:var(--font-inter)] text-[#0a0a0a] placeholder:text-[#0a0a0a]/50 focus:outline-none"
          />
          <button className="bg-[#c9a96e] px-[20px] flex items-center justify-center gap-[6px] transition-colors hover:bg-[#c9a96e]/90 shrink-0">
            <Search className="w-4 h-4 text-[#1a1a2e]" />
            <span className="font-[family-name:var(--font-inter)] font-medium text-[13px] text-[#1a1a2e]">Search</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-[20px] shrink-0 font-[family-name:var(--font-inter)]">
          
          <div className="flex items-center gap-[6px]">
            <MapPin className="w-[14px] h-[14px] text-white" />
            <div className="flex flex-col">
              <span className="text-[10px] text-white/50 leading-[12px]">Deliver to</span>
              <span className="text-[11px] text-white leading-[14px]">Worldwide</span>
            </div>
          </div>
          
          <div className="flex items-center gap-[4px] border-l border-white/20 pl-[20px]">
            <Globe className="w-[14px] h-[14px] text-white" />
            <span className="text-[11px] text-white leading-[16.5px]">English</span>
          </div>
          
          <Link href="/sign-in" className="flex items-center gap-[6px] border-l border-white/20 pl-[20px] hover:opacity-80 transition-opacity">
            <User className="w-[16px] h-[16px] text-white" />
            <span className="text-[11px] font-medium text-white/80 leading-[16.5px]">Sign in</span>
          </Link>
          
          <Link href="/sign-up" className="bg-[#c9a96e] h-[28px] px-[16px] ml-2 flex items-center justify-center text-[11px] font-medium text-[#1a1a2e] hover:bg-[#c9a96e]/90 transition-colors">
            Create account
          </Link>

        </div>
      </div>
    </header>
  )
}
