"use client"

import React from "react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-100 bg-white text-zinc-900 pt-12 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-8">
        {/* Top Footer Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-zinc-100">
          {/* Brand */}
          <div className="space-y-1.5 max-w-sm">
            <Logo />
            <p className="text-xs text-zinc-500 leading-relaxed font-normal pt-1">
              The Web3 collaboration standard. Manage whitelist spot allocations, verify CMs, and track partnerships in one place.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-zinc-600">
            <Link href="/privacy-policy" className="hover:text-black transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-black transition-colors">
              Terms
            </Link>
          </div>
        </div>

        {/* Bottom Footer Section: Copyright & Built By */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Oncollably. All rights reserved.</p>

          <p className="flex items-center gap-1 font-medium">
            <span>Built by</span>
            <a
              href="https://x.com/bullishdoteth"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-zinc-900 hover:text-black underline underline-offset-4 decoration-zinc-300 transition-colors"
            >
              Bullish.eth
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
