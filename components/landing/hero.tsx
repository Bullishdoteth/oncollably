"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"

const partners = [
  { name: "Apex DAOs", category: "DAO Ecosystem" },
  { name: "Alpha Guild", category: "Community Hub" },
  { name: "Solana Collective", category: "Ecosystem" },
  { name: "EVM Builders", category: "Developer Network" },
  { name: "CyberSquad", category: "NFT Project" },
  { name: "BlockNexus", category: "Web3 Agency" },
  { name: "HyperVerse", category: "Gaming Guild" },
  { name: "MetaSpace", category: "Collab Network" },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      <div className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-12 text-center space-y-8">
        
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-4xl sm:text-6xl md:text-7xl font-regular tracking-tight text-black max-w-4xl mx-auto leading-[1.08]"
        >
          Stop doing Web3 collabs in messy DMs.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-xl text-zinc-600 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Manage collaboration applications, verify communities and collab managers, allocate whitelist spots, and track every deal in one unified dashboard.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <Link
            href="/create-account"
            className="w-full sm:w-auto px-8 py-4 bg-black hover:bg-zinc-800 active:bg-zinc-900 text-white font-semibold text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
          >
            Get Started Oncollably
          </Link>
          <Link
            href="#pricing"
            className="w-full sm:w-auto px-8 py-4 bg-zinc-100 hover:bg-zinc-200/80 active:bg-zinc-200 text-zinc-900 font-semibold text-base rounded-full transition-colors cursor-pointer"
          >
            View Pricing
          </Link>
        </motion.div>
      </div>

      {/* Marquee Component with Framer Motion reveal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="mt-20 sm:mt-28 pt-10 border-t border-zinc-100"
      >
        <div className="max-w-6xl mx-auto px-4 mb-8 text-center">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Trusted by 500+ Web3 Communities, DAOs & Collab Managers
          </p>
        </div>

        {/* Marquee Track with Fade Masks and Pause on Hover */}
        <div className="relative w-full overflow-hidden py-6">
          {/* Left & Right Gradient Fade Masks */}
          <div className="absolute top-0 bottom-0 left-0 w-32 sm:w-48 bg-gradient-to-r from-white via-white/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-32 sm:w-48 bg-gradient-to-l from-white via-white/90 to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex items-center gap-16 sm:gap-24 px-8 hover:[animation-play-state:paused] cursor-pointer">
            {/* Duplicated array for seamless infinite marquee loop */}
            {[...partners, ...partners, ...partners].map((partner, index) => (
              <div
                key={index}
                className="group shrink-0 flex items-center gap-4 bg-transparent py-2 transition-opacity hover:opacity-80"
              >
                {/* Square Emblem without rounded corners */}
                <div className="w-9 h-9 bg-zinc-900 text-white flex items-center justify-center font-bold text-xs uppercase tracking-wider">
                  {partner.name.slice(0, 2)}
                </div>

                <div className="text-left space-y-0.5">
                  <p className="text-sm font-bold text-zinc-900 tracking-tight">
                    {partner.name}
                  </p>
                  <p className="text-[11px] text-zinc-400 font-medium">
                    {partner.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
