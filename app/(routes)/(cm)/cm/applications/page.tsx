"use client"

import React from "react"
import Link from "next/link"
import { Layers, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react"

export default function Page() {
  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
              Manager Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Manager Applications
          </h1>
          <p className="text-sm text-zinc-500 font-normal">
            Applications sent to projects and community collab opportunities.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-all">
            Action Button
          </button>
        </div>
      </div>

      {/* Main Content Placeholder Card */}
      <div className="p-8 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-3 text-zinc-900 font-semibold text-sm">
          <Sparkles className="w-4 h-4 text-zinc-700" />
          <span>Manager Applications Workspace</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
            <span className="text-xs text-zinc-400 font-medium">Status</span>
            <div className="text-lg font-bold text-zinc-900">Active</div>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
            <span className="text-xs text-zinc-400 font-medium">Total Records</span>
            <div className="text-lg font-bold text-zinc-900">0</div>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
            <span className="text-xs text-zinc-400 font-medium">Last Updated</span>
            <div className="text-lg font-bold text-zinc-900">Just Now</div>
          </div>
        </div>
      </div>
    </div>
  )
}
