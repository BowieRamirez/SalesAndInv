"use client";

import React, { useState } from "react";
import { Box, CheckCircle2, BarChart3, Package, User, Lock, Eye, LogIn } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    // Map email prefixes to specific Admin Dashboards
    const emailLower = email.toLowerCase();
    
    if (emailLower.includes("sales")) {
      window.location.href = "http://localhost:3001/sales";
    } else if (emailLower.includes("accounting")) {
      window.location.href = "http://localhost:3001/accounting";
    } else if (emailLower.includes("inventory")) {
      window.location.href = "http://localhost:3001/inventory";
    } else if (emailLower.includes("analytics")) {
      window.location.href = "http://localhost:3001/analytics";
    } else if (emailLower.includes("customer")) {
      // Route customer to the storefront homepage
      if (typeof window !== "undefined") {
        localStorage.setItem("customerSession", emailLower);
      }
      window.location.href = "/";
    } else {
      // Default / Executive admin
      window.location.href = "http://localhost:3001/";
    }
  };

  return (
    <main className="min-h-screen py-10 lg:py-0 flex lg:flex-row flex-col bg-[#fcfcfc] font-[family-name:var(--font-inter)]">
      {/* Left Sidebar */}
      <div className="lg:w-[45%] bg-navy relative overflow-hidden flex flex-col justify-between p-8 xl:p-14 text-white min-h-[500px] lg:min-h-screen">
        {/* Background decorative circles */}
        <div className="absolute top-[-10%] left-[-15%] w-[45rem] h-[45rem] rounded-full border-[60px] border-white/[0.03] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] rounded-full border-[40px] border-white/[0.03] pointer-events-none" />
        <div className="absolute top-[30%] right-[-15%] w-[50rem] h-[50rem] rounded-full border-[50px] border-white/[0.03] pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center space-x-3 mt-4 lg:mt-0">
          <div className="p-2.5 bg-white/10 rounded-xl border border-white/5 shadow-sm">
            <Box className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
             <h1 className="font-semibold text-[17px] tracking-wide leading-tight">Sales & Inventory</h1>
             <p className="text-[11px] text-white/50 tracking-wider uppercase font-medium mt-0.5">Management System</p>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-lg mt-16 mb-auto xl:pl-4">
          {/* Sparkle icon - approximate */}
          <div className="absolute -top-10 -left-6 text-coral opacity-90 animate-pulse">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 2L13.4 9.6L21 12L13.4 14.4L12 22L10.6 14.4L3 12L10.6 9.6L12 2Z"/>
             </svg>
          </div>
          
          <h2 className="text-[2.5rem] xl:text-[3.2rem] font-semibold leading-[1.1] mb-6 tracking-tight">
            Streamline your<br />business operations
          </h2>
          <p className="text-white/60 text-[15px] xl:text-[16px] mb-10 leading-relaxed max-w-[420px]">
            Track sales, manage inventory, generate reports, and
            control finances &mdash; all from one unified dashboard tailored
            to your role.
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-2 transition-colors cursor-default backdrop-blur-sm">
              <CheckCircle2 className="w-[15px] h-[15px] text-white/80" />
              <span className="text-[13px] font-medium text-white/90">Role-Based Access</span>
            </div>
            <div className="flex items-center space-x-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-2 transition-colors cursor-default backdrop-blur-sm">
              <BarChart3 className="w-[15px] h-[15px] text-white/80" />
              <span className="text-[13px] font-medium text-white/90">Real-Time Analytics</span>
            </div>
            <div className="flex items-center space-x-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-2 transition-colors cursor-default backdrop-blur-sm">
              <Package className="w-[15px] h-[15px] text-white/80" />
              <span className="text-[13px] font-medium text-white/90">Inventory Control</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-[12px] text-white/40 font-medium mb-4 lg:mb-0 xl:pl-4">
          &copy; 2026 SIMS Co. All rights reserved.
        </div>
      </div>

      {/* Right Sidebar - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative bg-white">
        {/* Subtle sparkle for form */}
        <div className="absolute top-[28%] right-[22%] text-coral opacity-60 pointer-events-none hidden lg:block">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 2L13.4 9.6L21 12L13.4 14.4L12 22L10.6 14.4L3 12L10.6 9.6L12 2Z"/>
             </svg>
        </div>
        
        <div className="w-full max-w-[400px]">
          <div className="text-center mb-12">
            <h2 className="text-[28px] font-semibold text-navy mb-2.5 tracking-tight">Welcome back</h2>
            <p className="text-[14px] text-muted">Sign in to your account to access your dashboard.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSignIn}>
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-charcoal/80" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-[18px] w-[18px] text-muted/70" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email (e.g. sales@sims.com)"
                  className="block w-full pl-10 pr-4 py-3 border border-border/80 rounded-[10px] text-[14px] text-charcoal bg-white placeholder:text-muted/70 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              {/* password sparkle */}
              <div className="absolute -top-1 left-[70px] text-[10px] text-coral opacity-80 pointer-events-none">
                   <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M12 2L13.4 9.6L21 12L13.4 14.4L12 22L10.6 14.4L3 12L10.6 9.6L12 2Z"/>
                   </svg>
              </div>
              <label className="text-[13px] font-medium text-charcoal/80" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-[18px] w-[18px] text-muted/70" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full pl-10 pr-11 py-3 border border-border/80 rounded-[10px] text-[14px] text-charcoal bg-white placeholder:text-muted/70 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted/70 hover:text-charcoal transition-colors">
                  <Eye className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-[46px] flex items-center justify-center space-x-2 bg-navy hover:bg-navy/95 text-white rounded-[10px] text-[14px] font-medium transition-all !mt-8 group cursor-pointer"
            >
              <LogIn className="w-[18px] h-[18px] group-hover:translate-x-0.5 transition-transform" />
              <span>Sign In</span>
            </button>
          </form>

          <div className="mt-8 text-center pt-4">
            <p className="text-[12px] text-muted hover:text-charcoal cursor-pointer transition-colors">
              Login to Sales, Accounting, Inventory, Analytics, Executive, or Customer role.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
