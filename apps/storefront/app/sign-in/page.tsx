"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, BarChart3, Box, CheckCircle2, Eye, EyeOff, Lock, LogIn, Package, User, X } from "lucide-react";
import { authClient } from "@/lib/auth/client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setError("");
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [error]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await authClient.signIn.email({
      email: email.trim().toLowerCase(),
      password,
    });

    if (result.error) {
      setError("We couldn’t sign you in with that email and password. Please try again.");
      setIsLoading(false);
      return;
    }

    const sessionUserResponse = await fetch("/api/session-user", { cache: "no-store" });
    const sessionUserResult = (await sessionUserResponse.json().catch(() => ({}))) as {
      user?: { email?: string | null; name?: string | null; role?: string | null; status?: string | null };
    };
    const sessionUser = sessionUserResult.user;

    if (!sessionUser || sessionUser.role !== "CLIENT" || sessionUser.status !== "ACTIVE") {
      await authClient.signOut();
      setError("That sign-in belongs to our staff workspace. Please use a customer account to continue shopping.");
      setIsLoading(false);
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("customerSession", sessionUser.email ?? email.trim().toLowerCase());
    }

    window.location.href = "/";
  };

  return (
    <main className="min-h-screen py-10 lg:py-0 flex lg:flex-row flex-col bg-[#fcfcfc] font-[family-name:var(--font-inter)]">
      <div className="lg:w-[45%] bg-navy relative overflow-hidden flex flex-col justify-between p-8 xl:p-14 text-white min-h-[500px] lg:min-h-screen">
        <div className="absolute top-[-10%] left-[-15%] w-[45rem] h-[45rem] rounded-full border-[60px] border-white/[0.03] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] rounded-full border-[40px] border-white/[0.03] pointer-events-none" />
        <div className="absolute top-[30%] right-[-15%] w-[50rem] h-[50rem] rounded-full border-[50px] border-white/[0.03] pointer-events-none" />

        <div className="relative z-10 flex items-center space-x-3 mt-4 lg:mt-0">
          <div className="p-2.5 bg-white/10 rounded-xl border border-white/5 shadow-sm">
            <Box className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-semibold text-[17px] tracking-wide leading-tight">FurniTrack</h1>
            <p className="text-[11px] text-white/50 tracking-wider uppercase font-medium mt-0.5">Client Portal</p>
          </div>
        </div>

        <div className="relative z-10 max-w-lg mt-16 mb-auto xl:pl-4">
          <h2 className="text-[2.5rem] xl:text-[3.2rem] font-semibold leading-[1.1] mb-6 tracking-tight">
            Browse finished products
            <br />
            from the live inventory
          </h2>
          <p className="text-white/60 text-[15px] xl:text-[16px] mb-10 leading-relaxed max-w-[420px]">
            Sign in with your customer account to view the FurniTrack storefront powered by Neon-backed finished products only.
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2.5 bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <CheckCircle2 className="w-[15px] h-[15px] text-white/80" />
              <span className="text-[13px] font-medium text-white/90">Client Accounts</span>
            </div>
            <div className="flex items-center space-x-2.5 bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <BarChart3 className="w-[15px] h-[15px] text-white/80" />
              <span className="text-[13px] font-medium text-white/90">Live Inventory</span>
            </div>
            <div className="flex items-center space-x-2.5 bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <Package className="w-[15px] h-[15px] text-white/80" />
              <span className="text-[13px] font-medium text-white/90">Finished Products Only</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[12px] text-white/40 font-medium mb-4 lg:mb-0 xl:pl-4">
          &copy; 2026 SIMS Co. All rights reserved.
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative bg-white">
        <div className="w-full max-w-[400px]">
          {error && (
            <div className="fixed right-6 top-6 z-50 w-full max-w-[360px] rounded-[18px] border border-[#f1d7a1] bg-white/95 p-4 shadow-[0_18px_50px_rgba(26,26,46,0.14)] backdrop-blur">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff7e6] text-[#c89211]">
                  <AlertCircle className="h-[18px] w-[18px]" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-[#1a1a2e]">Sign-in note</p>
                  <p className="mt-1 text-[13px] leading-[20px] text-[#6a7282]">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setError("")}
                  className="rounded-full p-1 text-[#99a1af] transition-colors hover:bg-[#f9fafb] hover:text-[#1a1a2e]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="text-center mb-10">
            <h2 className="text-[28px] font-semibold text-navy mb-2.5 tracking-tight">Welcome back</h2>
            <p className="text-[14px] text-muted">Sign in to your customer account to browse live finished products.</p>
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
                  placeholder="Enter your customer email"
                  className="block w-full pl-10 pr-4 py-3 border border-border/80 rounded-[10px] text-[14px] text-charcoal bg-white placeholder:text-muted/70 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 relative">
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
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full pl-10 pr-11 py-3 border border-border/80 rounded-[10px] text-[14px] text-charcoal bg-white placeholder:text-muted/70 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted/70 hover:text-charcoal transition-colors"
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[46px] flex items-center justify-center space-x-2 bg-navy hover:bg-navy/95 disabled:opacity-60 text-white rounded-[10px] text-[14px] font-medium transition-all !mt-8 group cursor-pointer"
            >
              <LogIn className="w-[18px] h-[18px] group-hover:translate-x-0.5 transition-transform" />
              <span>{isLoading ? "Signing In..." : "Sign In"}</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
