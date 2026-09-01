"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/ui/logo"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isOnboarding = pathname === "/onboarding"

  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between selection:bg-zinc-100 selection:text-zinc-900">
        {/* Top Header Bar */}
        <header className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-8 flex items-center justify-between border-b border-zinc-100">
          <Logo />
          <div className="text-xs text-zinc-400 font-medium tracking-wider uppercase">
            Account Setup
          </div>
        </header>

        {/* Center 1-Column Content Area */}
        <main className="flex-1 flex items-center justify-center py-12 sm:py-20 px-6 sm:px-12">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-8 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Oncollably. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-zinc-900 transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-zinc-900 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 grid grid-cols-1 lg:grid-cols-12 selection:bg-zinc-100 selection:text-zinc-900">
      
      {/* Column 1: Dark Background (Desktop ~45% width / lg:col-span-5) */}
      <div className="hidden lg:flex lg:col-span-5 bg-black text-white p-12 lg:p-16 flex-col justify-between relative overflow-hidden min-h-screen">
        {/* Subtle glowing ambient background effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-zinc-800/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-12 relative z-10">
          {/* White Logo */}
          <div>
            <Logo textClassName="text-white text-2xl font-extrabold" />
          </div>

          {/* Value Prop Headline & Details */}
          <div className="space-y-6 max-w-md">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Web3 Collab Engine
            </span>

            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Stop doing Web3 collabs in messy Discord DMs.
            </h2>

            <p className="text-zinc-400 text-sm lg:text-base leading-relaxed font-normal">
              Manage collaboration applications, verify communities, allocate whitelist spots, and track every deal in one unified dashboard.
            </p>
          </div>

          {/* Highlights */}
          <div className="space-y-3.5 pt-4 border-t border-zinc-800/80 max-w-md">
            {[
              "100% Sybil-resistant community verification",
              "Automated whitelist spot distribution & CSV exports",
              "Zero monthly subscription fees ($10 one-time access)",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs lg:text-sm text-zinc-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-zinc-900 text-white border border-zinc-800 flex items-center justify-center text-xs shrink-0 font-bold">
                  ✓
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info in Dark Column */}
        <div className="pt-8 border-t border-zinc-900 text-xs text-zinc-500 flex items-center justify-between relative z-10">
          <span>© {new Date().getFullYear()} Oncollably</span>
          <span className="text-zinc-400 font-medium">Trusted by 500+ Web3 Builders</span>
        </div>
      </div>

      {/* Column 2: White Background (Desktop ~55% width / lg:col-span-7) */}
      <div className="lg:col-span-7 bg-white p-6 sm:p-12 lg:p-16 flex flex-col justify-between min-h-screen">
        
        {/* Mobile Header Logo */}
        <div className="flex lg:hidden items-center justify-between pb-6 border-b border-zinc-100">
          <Logo />
        </div>

        {/* Center Content / Auth Form Container */}
        <div className="flex-1 flex items-center justify-center py-8 sm:py-12">
          <div className="w-full max-w-xl">
            {children}
          </div>
        </div>

        {/* Footer Legal Links */}
        <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Oncollably. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-zinc-900 transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-zinc-900 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>

      </div>

    </div>
  )
}

