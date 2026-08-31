"use client"

import React, { useState } from "react"
import { Logo } from "@/components/ui/logo"

export function PoweredBadge() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return (
      <button
        type="button"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 px-4 py-2.5 bg-black hover:bg-zinc-900 text-white text-xs font-semibold rounded-full shadow-2xl border border-zinc-800 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
        title="Show Powered by badge"
        aria-label="Show Powered by badge"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-zinc-300 group-hover:text-white transition-colors font-mono text-[11px] uppercase font-bold tracking-wider">
          Powered by Oncollably
        </span>
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="relative group flex items-center gap-2 select-none">
        
        {/* Black Pill Badge Container (No outer white background box) */}
        <div className="bg-black hover:bg-zinc-900 text-white px-5 py-2.5 rounded-full shadow-2xl border border-zinc-800 flex items-center gap-3 transition-all duration-200">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase font-mono shrink-0">
            Powered by:
          </span>
          <Logo textClassName="text-white text-xs sm:text-sm font-extrabold tracking-tight" />
          <span className="relative flex h-2 w-2 shrink-0 ml-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        {/* Dismiss Button Beside Badge */}
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="w-7 h-7 rounded-full bg-black hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 shadow-lg transition-all flex items-center justify-center cursor-pointer shrink-0"
          title="Dismiss"
          aria-label="Close widget"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

      </div>
    </div>
  )
}
