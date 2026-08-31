"use client"

import React from "react"
import Link from "next/link"

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 relative overflow-hidden py-16 sm:py-24 lg:py-32 border-t border-zinc-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
        {/* Header & One-time payment badge aligned */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-zinc-100 pb-8">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-regular tracking-tight text-black leading-[1.1]">
              Pricing
            </h2>
            <p className="text-lg sm:text-xl text-zinc-600 font-normal leading-relaxed">
              Suitable pricing option to support a project launch with complete peace of mind.
            </p>
          </div>

          <div className="shrink-0 flex items-center">
            <span className="inline-flex items-center gap-3 px-5 py-2.5 bg-zinc-900 text-zinc-100 font-semibold text-sm rounded-full shadow-md border border-zinc-800">
              <span>One time payment</span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </span>
          </div>
        </div>

        {/* 2-Column Single Card Layout */}
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          {/* Column 1: Pricing Card ($10) */}
          <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8 bg-zinc-50/50">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-zinc-200/70 text-zinc-800 text-xs font-bold uppercase tracking-wider rounded-md">
                  Project Launch Pass
                </span>
                <h3 className="text-2xl font-bold text-zinc-900">
                  Complete Collab Engine
                </h3>
              </div>

              {/* Price display */}
              <div className="flex items-baseline gap-2 pt-2">
                <span className="text-5xl sm:text-6xl font-extrabold text-black tracking-tight">
                  $10
                </span>
                <span className="text-zinc-500 text-sm sm:text-base font-medium">
                  / one-time payment
                </span>
              </div>

              <p className="text-sm text-zinc-600 leading-relaxed border-b border-zinc-200 pb-6">
                Pay once and unlock all collaboration management tools for your project launch. No recurring monthly fees or hidden costs.
              </p>

              {/* Features list */}
              <div className="space-y-3.5">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  What's included
                </p>
                <ul className="space-y-3 text-sm text-zinc-700 font-medium">
                  {[
                    "Unlimited collaboration requests & applications",
                    "Verified Community & Collab Manager badges",
                    "Automated Whitelist spot allocation & tracking",
                    "Unified collab dashboard (No messy DMs)",
                    "Exportable distribution data & analytics",
                    "Direct manager messaging & verification",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-xs shrink-0 font-bold">
                        ✓
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href="/create-account"
                className="w-full inline-flex items-center justify-center px-8 py-4 bg-black hover:bg-zinc-800 active:bg-zinc-900 text-white font-semibold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-center cursor-pointer"
              >
                Get Started Oncollably
              </Link>
            </div>
          </div>

          {/* Column 2: Black Background Text Container */}
          <div className="p-8 sm:p-10 lg:p-12 bg-black text-white flex flex-col justify-between space-y-8 relative overflow-hidden">
            {/* Ambient subtle glow background effect */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-zinc-800/40 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-8 relative z-10">
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-semibold uppercase tracking-widest rounded-full border border-zinc-700">
                  Why Oncollably?
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                  Built for seamless Web3 collaborations without subscription fatigue.
                </h3>
              </div>

              <div className="space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed">
                <p>
                  Web3 projects shouldn't be bogged down by recurring SaaS subscriptions just to handle partnerships and whitelist allocation.
                </p>
                <p>
                  With our simple <strong className="text-white font-semibold">$10 one-time fee</strong>, you gain immediate access to a unified system that eliminates chaotic Discord DMs, lost spreadsheets, and unverified collab proposals.
                </p>
              </div>

              {/* Highlights grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                <div className="space-y-1 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80">
                  <h4 className="text-white text-sm font-semibold">Zero Subscriptions</h4>
                  <p className="text-zinc-400 text-xs leading-normal">Pay $10 once per project launch with zero recurring monthly billing.</p>
                </div>
                <div className="space-y-1 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80">
                  <h4 className="text-white text-sm font-semibold">Sybil Resistant</h4>
                  <p className="text-zinc-400 text-xs leading-normal">Verified communities ensure authentic engagement & real whitelist winners.</p>
                </div>
                <div className="space-y-1 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80">
                  <h4 className="text-white text-sm font-semibold">Real-Time Tracking</h4>
                  <p className="text-zinc-400 text-xs leading-normal">Track every spot allocated across all partners from one dashboard.</p>
                </div>
                <div className="space-y-1 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80">
                  <h4 className="text-white text-sm font-semibold">Instant Setup</h4>
                  <p className="text-zinc-400 text-xs leading-normal">Launch your collab page in minutes with custom requirements.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 relative z-10">
              <span>Trusted by Web3 builders worldwide</span>
              <span className="font-semibold text-zinc-300">100% Transparent</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

