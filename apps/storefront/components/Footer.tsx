import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[--color-navy] text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <p className="text-2xl font-bold mb-4">FurniTrack</p>
            <p className="text-white/60 text-sm leading-relaxed">
              Premium furniture for every space. Curated collections, expert
              craftsmanship.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" aria-label="Instagram" className="text-white/60 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Facebook" className="text-white/60 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-white/60 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">Shop</p>
            <ul className="space-y-3 text-sm text-white/70">
              {["Living Room", "Bedroom", "Dining", "Office", "All Products"].map((item) => (
                <li key={item}>
                  <Link href="/shop" className="hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">Company</p>
            <ul className="space-y-3 text-sm text-white/70">
              {["About Us", "Careers", "Newsroom", "Press"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">Support</p>
            <ul className="space-y-3 text-sm text-white/70">
              {["Contact Us", "FAQs", "Shipping & Returns", "Warranty"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>© 2026 FurniTrack. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white/70 transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
