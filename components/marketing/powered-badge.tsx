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
        className="fixed bottom-5 right-5 z-50 group flex items-center gap-2 px-3.5 py-2 bg-zinc-900/90 hover:bg-black text-white text-xs font-semibold rounded-full shadow-xl backdrop-blur-md border border-zinc-800 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
        title="Show Powered by badge"
        aria-label="Show Powered by badge"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-zinc-300 group-hover:text-white transition-colors">Powered by Oncollably</span>
      </button>
    )
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="relative group bg-white/90 backdrop-blur-xl border border-zinc-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.12)] rounded-2xl p-3.5 pr-9 flex flex-col items-start gap-1.5 transition-all duration-300 hover:border-zinc-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.16)] select-none">
        
        {/* Cancel / Close Button */}
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-zinc-100/80 hover:bg-zinc-200 text-zinc-400 hover:text-zinc-800 transition-all flex items-center justify-center cursor-pointer"
          title="Dismiss"
          aria-label="Close widget"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Top Text Header */}
        <div className="flex items-center gap-1.5 pl-0.5">
          <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
            Powered by:
          </span>
        </div>

        {/* Rounded Black Background Element */}
        <div className="bg-black hover:bg-zinc-900 text-white px-4 py-2 rounded-xl shadow-md border border-zinc-800 flex items-center justify-center gap-2 group/btn transition-all duration-200">
          <Logo textClassName="text-white text-xs sm:text-sm font-extrabold tracking-tight" />
          <span className="relative flex h-2 w-2 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
      </div>
    </div>
  )
}
