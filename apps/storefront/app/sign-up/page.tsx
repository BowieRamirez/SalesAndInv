"use client";

import React, { useState } from "react";
import { AlertCircle, Box, Eye, EyeOff, Lock, LogIn, Mail, User } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const result = (await response.json().catch(() => ({}))) as { message?: string };

    if (!response.ok) {
      setError(result.message ?? "Unable to create account.");
      setIsLoading(false);
      return;
    }

    setSuccess("Your account has been created in Neon. You can sign in now.");
    setForm({ name: "", email: "", password: "" });
    setIsLoading(false);
  }

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
            <p className="text-[11px] text-white/50 tracking-wider uppercase font-medium mt-0.5">Customer Registration</p>
          </div>
        </div>

        <div className="relative z-10 max-w-lg mt-16 mb-auto xl:pl-4">
          <h2 className="text-[2.5rem] xl:text-[3.2rem] font-semibold leading-[1.1] mb-6 tracking-tight">
            Create a customer account
            <br />
            saved in Neon
          </h2>
          <p className="text-white/60 text-[15px] xl:text-[16px] mb-10 leading-relaxed max-w-[420px]">
            New storefront registrations now create real customer accounts in Neon Auth and a matching `public.users` client record for the FurniTrack system.
          </p>
        </div>

        <div className="relative z-10 text-[12px] text-white/40 font-medium mb-4 lg:mb-0 xl:pl-4">
          &copy; 2026 SIMS Co. All rights reserved.
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative bg-white">
        <div className="w-full max-w-[400px]">
          <div className="text-center mb-10">
            <h2 className="text-[28px] font-semibold text-navy mb-2.5 tracking-tight">Create an account</h2>
            <p className="text-[14px] text-muted">Register as a client to browse the live finished-product catalog.</p>
          </div>

          {error && (
            <div className="mb-5 flex items-start space-x-2.5 bg-red-50 border border-red-200 rounded-[10px] px-4 py-3">
              <AlertCircle className="w-[16px] h-[16px] text-red-500 mt-0.5 shrink-0" />
              <p className="text-[13px] text-red-600 leading-snug">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-[10px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-charcoal/80" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-[18px] w-[18px] text-muted/70" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="block w-full pl-10 pr-4 py-3 border border-border/80 rounded-[10px] text-[14px] text-charcoal bg-white placeholder:text-muted/70 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-charcoal/80" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-[18px] w-[18px] text-muted/70" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="block w-full pl-10 pr-4 py-3 border border-border/80 rounded-[10px] text-[14px] text-charcoal bg-white placeholder:text-muted/70 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
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
                  value={form.password}
                  onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
                  placeholder="Create a strong password"
                  className="block w-full pl-10 pr-11 py-3 border border-border/80 rounded-[10px] text-[14px] text-charcoal bg-white placeholder:text-muted/70 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
                />
                <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted/70 hover:text-charcoal transition-colors">
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[46px] flex items-center justify-center space-x-2 bg-navy hover:bg-navy/95 disabled:opacity-60 text-white rounded-[10px] text-[14px] font-medium transition-all !mt-8 group"
            >
              <LogIn className="w-[18px] h-[18px] group-hover:translate-x-0.5 transition-transform" />
              <span>{isLoading ? "Creating..." : "Create Account"}</span>
            </button>
          </form>

          <div className="mt-8 text-center pt-2">
            <p className="text-[13px] text-muted">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-navy font-semibold hover:text-navy/80 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
