import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"
import Image from "next/image"
import { FooterCtaLink } from "./FooterCtaLink"

export function Footer() {
  return (
    <>
      {/* Pre-Footer CTA */}
      <div className="w-full max-w-[1336px] mx-auto px-6 mb-[64px] font-[family-name:var(--font-inter)]">
        <div className="relative w-full h-[280px] flex flex-col items-center justify-center text-center overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1400&auto=format&fit=crop&q=80"
            alt="Modern office furniture collection"
            fill 
            className="object-cover pointer-events-none" 
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex flex-col items-center max-w-[500px] px-4">
            <span className="text-[#c9a96e] text-[10px] font-medium tracking-[2px] uppercase mb-[12px]">Members Only</span>
            <h2 className="text-white text-[32px] font-[family-name:var(--font-inter)] font-semibold leading-[38.4px] mb-[12px]">Build a Better Workspace</h2>
            <p className="text-[#d1d5dc] text-[13px] font-normal leading-[19.5px] mb-[24px]">
              Browse office tables, pedestals, cabinets, and storage pieces selected for business spaces.
            </p>
            <FooterCtaLink />
          </div>
        </div>
      </div>

      <footer className="bg-[#1a1a2e] w-full mt-auto font-[family-name:var(--font-inter)]">
      <div className="max-w-[1336px] mx-auto px-6 py-[64px] pb-0">
        <div className="flex flex-col md:flex-row justify-between gap-[32px] md:gap-[92px] mb-[64px]">
          {/* Brand */}
          <div className="flex flex-col gap-[16px] max-w-[304px]">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </span>
              <span className="text-white text-[10px] tracking-[0.9px] font-normal uppercase">FurniTrack</span>
            </Link>
            <p className="text-[#99a1af] text-[13px] leading-[19.5px]">
              Office tables, pedestals, cabinets, and workspace storage for organized business interiors.
            </p>
            <div className="flex gap-[12px] mt-2">
              <a href="#" aria-label="Instagram" className="w-[36px] h-[36px] bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="w-[36px] h-[36px] bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Twitter" className="w-[36px] h-[36px] bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="flex flex-1 justify-between flex-wrap gap-[32px]">
            {/* Shop */}
            <div className="flex flex-col gap-[16px] min-w-[120px]">
              <h4 className="text-[#d1d5dc] text-[13px] font-medium tracking-[0.65px] uppercase leading-[19.5px]">Shop</h4>
              <ul className="flex flex-col gap-[10px]">
                {["Tables", "Storage", "Office", "All Products"].map((item) => (
                  <li key={item}>
                    <Link href={`/shop${item !== "All Products" ? `?category=${item}` : ""}`} className="text-[#99a1af] text-[13px] font-normal leading-[19.5px] hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-[16px] min-w-[120px]">
              <h4 className="text-[#d1d5dc] text-[13px] font-medium tracking-[0.65px] uppercase leading-[19.5px]">Company</h4>
              <ul className="flex flex-col gap-[10px]">
                {["About Us", "Careers", "Showrooms", "Press"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[#99a1af] text-[13px] font-normal leading-[19.5px] hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="flex flex-col gap-[16px] min-w-[120px]">
              <h4 className="text-[#d1d5dc] text-[13px] font-medium tracking-[0.65px] uppercase leading-[19.5px]">Support</h4>
              <ul className="flex flex-col gap-[10px]">
                {["Contact Us", "FAQs", "Shipping & Returns", "Warranty"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[#99a1af] text-[13px] font-normal leading-[19.5px] hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 flex flex-col md:flex-row justify-between items-center py-[16px] gap-4">
          <p className="text-[#6a7282] text-[12px] font-normal leading-[18px]">
            2026 FurniTrack. All rights reserved.
          </p>
          <div className="flex gap-[24px]">
            <a href="#" className="text-[#6a7282] text-[12px] font-normal leading-[18px] hover:text-white/80 transition-colors">Privacy Policy</a>
            <a href="#" className="text-[#6a7282] text-[12px] font-normal leading-[18px] hover:text-white/80 transition-colors">Terms of Service</a>
            <a href="#" className="text-[#6a7282] text-[12px] font-normal leading-[18px] hover:text-white/80 transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
    </>
  )
}
