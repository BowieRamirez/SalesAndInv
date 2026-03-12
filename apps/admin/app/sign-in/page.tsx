"use client";

import React, { useState } from "react";
import {
    Shield,
    CheckCircle2,
    BarChart3,
    Package,
    User,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    AlertCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth/client";

// ---------------------------------------------------------------------------
// Role → dashboard mapping (used after sign-in to redirect to the right page)
// The role is stored as user metadata in Neon Auth.
// ---------------------------------------------------------------------------
const ROLE_REDIRECT: Record<string, string> = {
    SALES: "/sales",
    ACCOUNTING: "/accounting",
    INVENTORY: "/inventory",
    ANALYTICS: "/analytics",
    MANAGEMENT: "/",
    ADMIN: "/",
};

export default function AdminSignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const emailLower = email.trim().toLowerCase();

        // Block customer emails on this portal
        if (emailLower.includes("customer")) {
            setError("Customer accounts are not permitted here. Please use the customer portal.");
            setIsLoading(false);
            return;
        }

        try {
            // Authenticate via Neon Auth (Better Auth under the hood)
            const result = await authClient.signIn.email({
                email: emailLower,
                password,
            });

            if (result.error) {
                setError(
                    result.error.message ??
                    "Invalid email or password. Please check your credentials and try again."
                );
                setIsLoading(false);
                return;
            }

            // Sign-in successful — read the role from user metadata to redirect
            const sessionResult = await authClient.getSession();
            const role =
                (sessionResult?.data?.user as { role?: string })?.role?.toUpperCase() ?? "";

            const redirect = ROLE_REDIRECT[role] ?? "/";
            window.location.href = redirect;
        } catch {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen py-10 lg:py-0 flex lg:flex-row flex-col bg-[#fcfcfc] font-[family-name:var(--font-inter)]">
            {/* Left Panel */}
            <div className="lg:w-[45%] bg-[#1a1c29] relative overflow-hidden flex flex-col justify-between p-8 xl:p-14 text-white min-h-[500px] lg:min-h-screen">
                {/* Background decorative circles */}
                <div className="absolute top-[-10%] left-[-15%] w-[45rem] h-[45rem] rounded-full border-[60px] border-white/[0.03] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] rounded-full border-[40px] border-white/[0.03] pointer-events-none" />
                <div className="absolute top-[30%] right-[-15%] w-[50rem] h-[50rem] rounded-full border-[50px] border-white/[0.03] pointer-events-none" />

                {/* Header */}
                <div className="relative z-10 flex items-center space-x-3 mt-4 lg:mt-0">
                    <div className="p-2.5 bg-white/10 rounded-xl border border-white/5 shadow-sm">
                        <Shield className="w-6 h-6 text-[#818cf8]" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-semibold text-[17px] tracking-wide leading-tight">
                            Sales &amp; Inventory
                        </h1>
                        <p className="text-[11px] text-white/50 tracking-wider uppercase font-medium mt-0.5">
                            Admin Portal
                        </p>
                    </div>
                </div>

                {/* Admin badge */}
                <div className="relative z-10 mt-6">
                    <span className="inline-flex items-center space-x-1.5 bg-[#6366f1]/20 border border-[#6366f1]/30 text-[#818cf8] text-[11px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
                        <Shield className="w-3 h-3" />
                        <span>Admin Access Only</span>
                    </span>
                </div>

                {/* Center Content */}
                <div className="relative z-10 max-w-lg mt-10 mb-auto xl:pl-4">
                    <div className="absolute -top-10 -left-6 text-[#818cf8] opacity-90 animate-pulse">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L13.4 9.6L21 12L13.4 14.4L12 22L10.6 14.4L3 12L10.6 9.6L12 2Z" />
                        </svg>
                    </div>

                    <h2 className="text-[2.5rem] xl:text-[3.2rem] font-semibold leading-[1.1] mb-6 tracking-tight">
                        Internal staff
                        <br />
                        management hub
                    </h2>
                    <p className="text-white/60 text-[15px] xl:text-[16px] mb-10 leading-relaxed max-w-[420px]">
                        Access role-specific dashboards for sales, accounting, inventory,
                        analytics, and executive reporting &mdash; restricted to authorised
                        personnel only.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center space-x-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-2 transition-colors cursor-default backdrop-blur-sm">
                            <CheckCircle2 className="w-[15px] h-[15px] text-white/80" />
                            <span className="text-[13px] font-medium text-white/90">
                                Role-Based Access
                            </span>
                        </div>
                        <div className="flex items-center space-x-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-2 transition-colors cursor-default backdrop-blur-sm">
                            <BarChart3 className="w-[15px] h-[15px] text-white/80" />
                            <span className="text-[13px] font-medium text-white/90">
                                Real-Time Analytics
                            </span>
                        </div>
                        <div className="flex items-center space-x-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-2 transition-colors cursor-default backdrop-blur-sm">
                            <Package className="w-[15px] h-[15px] text-white/80" />
                            <span className="text-[13px] font-medium text-white/90">
                                Inventory Control
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 text-[12px] text-white/40 font-medium mb-4 lg:mb-0 xl:pl-4">
                    &copy; 2026 SIMS Co. All rights reserved.
                </div>
            </div>

            {/* Right Panel — Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative bg-white">
                {/* Subtle sparkle */}
                <div className="absolute top-[28%] right-[22%] text-[#818cf8] opacity-60 pointer-events-none hidden lg:block">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L13.4 9.6L21 12L13.4 14.4L12 22L10.6 14.4L3 12L10.6 9.6L12 2Z" />
                    </svg>
                </div>

                <div className="w-full max-w-[400px]">
                    {/* Admin badge */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center space-x-2 bg-[#f0f0ff] border border-[#c7c9f5] rounded-xl px-4 py-2.5">
                            <Shield className="w-4 h-4 text-[#6366f1]" />
                            <span className="text-[13px] font-semibold text-[#4f46e5] tracking-wide uppercase">
                                Admin Login
                            </span>
                        </div>
                    </div>

                    <div className="text-center mb-10">
                        <h2 className="text-[28px] font-semibold text-[#1a1c29] mb-2.5 tracking-tight">
                            Welcome back
                        </h2>
                        <p className="text-[14px] text-[#9ca3af]">
                            Sign in with your admin credentials to access your dashboard.
                        </p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-5 flex items-start space-x-2.5 bg-red-50 border border-red-200 rounded-[10px] px-4 py-3">
                            <AlertCircle className="w-[16px] h-[16px] text-red-500 mt-0.5 shrink-0" />
                            <p className="text-[13px] text-red-600 leading-snug">{error}</p>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSignIn}>
                        <div className="space-y-2">
                            <label
                                className="text-[13px] font-medium text-[#2d2d2d]/80"
                                htmlFor="admin-email"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <User className="h-[18px] w-[18px] text-[#9ca3af]/70" />
                                </div>
                                <input
                                    id="admin-email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="e.g. sales@sims.com"
                                    className="block w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-[10px] text-[14px] text-[#2d2d2d] bg-white placeholder:text-[#9ca3af]/70 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 relative">
                            {/* Sparkle decoration */}
                            <div className="absolute -top-1 left-[70px] text-[10px] text-[#818cf8] opacity-80 pointer-events-none">
                                <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 2L13.4 9.6L21 12L13.4 14.4L12 22L10.6 14.4L3 12L10.6 9.6L12 2Z" />
                                </svg>
                            </div>
                            <label
                                className="text-[13px] font-medium text-[#2d2d2d]/80"
                                htmlFor="admin-password"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock className="h-[18px] w-[18px] text-[#9ca3af]/70" />
                                </div>
                                <input
                                    id="admin-password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="block w-full pl-10 pr-11 py-3 border border-[#e5e7eb] rounded-[10px] text-[14px] text-[#2d2d2d] bg-white placeholder:text-[#9ca3af]/70 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9ca3af]/70 hover:text-[#2d2d2d] transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-[18px] w-[18px]" />
                                    ) : (
                                        <Eye className="h-[18px] w-[18px]" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-[46px] flex items-center justify-center space-x-2 bg-[#1a1c29] hover:bg-[#252839] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-[10px] text-[14px] font-medium transition-all !mt-8 group cursor-pointer border border-[#2a2c3d]"
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin w-[18px] h-[18px] text-white/70"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-[18px] h-[18px] group-hover:translate-x-0.5 transition-transform" />
                                    <span>Sign In to Admin</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-4 border-t border-[#f3f4f6]">
                        <p className="text-[12px] text-[#9ca3af]">
                            Not an admin?{" "}
                            <a
                                href="http://localhost:3000/sign-in"
                                className="text-[#6366f1] font-medium hover:underline cursor-pointer"
                            >
                                Go to customer login →
                            </a>
                        </p>
                        <p className="text-[11px] text-[#9ca3af]/70 mt-2">
                            Admin roles: Executive · Sales · Accounting · Inventory · Analytics
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
