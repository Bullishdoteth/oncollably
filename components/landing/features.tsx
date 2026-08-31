"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

type CategoryId = "projects" | "communities" | "managers"

const categories = [
  {
    id: "projects" as CategoryId,
    title: "For Projects",
    badge: "Founders & Builders",
    headline: "Automate Whitelist Allocations & Eliminate DM Chaos",
    description:
      "Launch partnership campaigns with custom entry rules, verify partner authenticity, block bot farms, and export winner wallet lists in seconds.",
    accentColor: "from-indigo-600 to-violet-600",
    badgeStyles: "bg-indigo-50 text-indigo-700 border-indigo-200",
    ctaBg: "bg-indigo-600 hover:bg-indigo-700 text-white",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-data-41539-large.mp4",
    videoTag: "Project Launch Walkthrough",
    highlights: [
      "Dedicated collaboration portal for every project launch",
      "Sybil-resistant bot protection & community verification",
      "Real-time spot allocation tracking & CSV wallet exports",
      "Direct manager-to-manager proposal approvals",
    ],
  },
  {
    id: "communities" as CategoryId,
    title: "For Communities",
    badge: "DAOs & Guilds",
    headline: "Secure Guaranteed Whitelist Spots For Your Members",
    description:
      "Build official credibility with verified community badges, receive high-tier giveaway offers, and track member allocations transparently.",
    accentColor: "from-emerald-600 to-teal-600",
    badgeStyles: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ctaBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-interface-concept-41541-large.mp4",
    videoTag: "Community Hub Demo",
    highlights: [
      "Verified Community badge & trust ranking system",
      "Clean inbound collab request inbox with zero DM clutter",
      "Guaranteed whitelist spot pools from top-tier projects",
      "Automated member entry verification & winner logs",
    ],
  },
  {
    id: "managers" as CategoryId,
    title: "For Collab Managers",
    badge: "Collab Managers",
    headline: "Manage 10+ Project Portfolios From a Single Hub",
    description:
      "Supercharge your collab management agency with an official manager profile, real-time proof of delivery, and multi-client tracking.",
    accentColor: "from-amber-600 to-orange-600",
    badgeStyles: "bg-amber-50 text-amber-700 border-amber-200",
    ctaBg: "bg-amber-600 hover:bg-amber-700 text-white",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-working-on-a-digital-tablet-41535-large.mp4",
    videoTag: "Manager Dashboard Workflow",
    highlights: [
      "Official manager handle page (`oncollably.com/@username`)",
      "Multi-client campaign management dashboard",
      "Verifiable proof of delivery & ROI performance logs",
      "Instant partner verification & reputation badges",
    ],
  },
]

export function Features() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("projects")

  const activeData = categories.find((c) => c.id === activeCategory) || categories[0]

  return (
    <section id="features" className="scroll-mt-20 relative overflow-hidden py-16 sm:py-24 lg:py-32 border-t border-zinc-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <span className="inline-block px-3.5 py-1 bg-zinc-100 text-zinc-800 text-xs font-semibold uppercase tracking-widest rounded-full border border-zinc-200/80">
            Platform Capabilities
          </span>
          <h2 className="text-4xl sm:text-5xl font-regular tracking-tight text-black leading-[1.1]">
            Everything you need for Web3 collabs
          </h2>
          <p className="text-lg sm:text-xl text-zinc-600 font-normal leading-relaxed">
            Switch between workflows tailored for Project Founders, NFT Communities, and Collab Managers.
          </p>
        </motion.div>

        {/* Outer Unified Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden p-6 sm:p-10 lg:p-12 space-y-8 sm:space-y-10"
        >
          
          {/* Top Category Tab Switcher Bar */}
          <div className="flex justify-start sm:justify-center border-b border-zinc-100 pb-6 overflow-x-auto">
            <div className="inline-flex p-1 bg-zinc-100/90 border border-zinc-200/80 rounded-full text-xs sm:text-sm font-medium shrink-0">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-5 py-2.5 rounded-full transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-2 relative ${
                      isActive
                        ? "bg-black text-white shadow-md font-semibold scale-[1.02]"
                        : "text-zinc-600 hover:text-black hover:bg-zinc-200/50"
                    }`}
                  >
                    <span>{cat.title}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Dynamic 2-Column Layout */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch"
            >
              
              {/* Column 1: ~70% Width Content Section (lg:col-span-8) */}
              <div className="lg:col-span-8 space-y-6 sm:space-y-8 flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Category Badge & Headline */}
                  <div className="space-y-3">
                    <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${activeData.badgeStyles}`}>
                      {activeData.badge}
                    </span>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight leading-snug">
                      {activeData.headline}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-normal max-w-2xl">
                    {activeData.description}
                  </p>

                  {/* Capability Highlights Grid */}
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                      Core Capabilities
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeData.highlights.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.08 }}
                          className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 flex items-start gap-3 text-xs sm:text-sm text-zinc-800 font-medium"
                        >
                          <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-xs shrink-0 font-bold mt-0.5">
                            ✓
                          </div>
                          <span>{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA Action Button */}
                <div className="pt-4">
                  <Link
                    href="/create-account"
                    className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl ${activeData.ctaBg} font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer`}
                  >
                    <span>Get Started with {activeData.title}</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Column 2: 30% Width Full-Height Portrait Video Column (lg:col-span-4) */}
              <div className="lg:col-span-4 flex flex-col items-stretch h-full min-h-[380px] lg:min-h-[460px]">
                <div className="relative w-full h-full min-h-[380px] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950 group">
                  
                  {/* HTML5 Portrait Video */}
                  <video
                    key={activeData.id}
                    src={activeData.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Subtle top & bottom gradient overlay masks */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Video Header Tag */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-md">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      DEMO VIDEO
                    </span>
                    <span className="text-[10px] font-mono text-zinc-300 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                      HD 9:16
                    </span>
                  </div>

                  {/* Bottom Video Tag Label */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-white text-xs font-semibold">
                    <span className="px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-xl border border-white/15 text-zinc-100 shadow-md">
                      {activeData.videoTag}
                    </span>
                  </div>

                </div>
              </div>

            </motion.div>
          </AnimatePresence>

        </motion.div>

      </div>
    </section>
  )
}
