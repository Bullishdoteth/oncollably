import React from "react"
import Link from "next/link"

export default function CollabManagerProfilePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-100 selection:text-zinc-900">
      {/* Cover Header Banner */}
      <div className="h-44 w-full bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border-b border-zinc-200 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Profile Details Header */}
        <div className="relative -mt-16 mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-zinc-100">
          <div className="flex items-end gap-5">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-2xl bg-zinc-900 text-white font-bold text-3xl flex items-center justify-center border-4 border-white shadow-md">
              CM
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                  Collab Manager
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 12 12">
                    <path d="M10.28 2.28L3.99 8.57 1.71 6.29A1 1 0 00.29 7.71l3 3a1 1 0 001.42 0l7-7a1 1 0 00-1.43-1.43z" />
                  </svg>
                  Verified CM
                </span>
              </div>
              <p className="text-sm text-zinc-500 font-mono">@collabmanager</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-xl shadow-xs transition-colors"
            >
              Request Collaboration
            </Link>
          </div>
        </div>

        {/* Bio & Links */}
        <div className="space-y-6">
          <div className="prose prose-zinc max-w-none">
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
              Managing community collaborations, whitelist spot allocations, and partner giveaways. 
              Submit your collaboration requests directly through OnCollably.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
              <p className="text-xs font-medium text-zinc-500">Active Collabs</p>
              <p className="text-2xl font-bold text-zinc-900">12</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
              <p className="text-xs font-medium text-zinc-500">WL Spots Given</p>
              <p className="text-2xl font-bold text-zinc-900">450+</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
              <p className="text-xs font-medium text-zinc-500">Communities</p>
              <p className="text-2xl font-bold text-zinc-900">5</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
              <p className="text-xs font-medium text-zinc-500">Response Rate</p>
              <p className="text-2xl font-bold text-zinc-900">98%</p>
            </div>
          </div>

          {/* Active Collaborations Section Placeholder */}
          <div className="space-y-4 pt-4">
            <h2 className="text-lg font-bold text-zinc-900">Open Collaborations</h2>
            <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                ⚡
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-zinc-800">
                  No public collaboration applications open right now
                </p>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Check back soon or sign in to send a direct collaboration inquiry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
