import React from "react"
import { Logo } from "@/components/ui/logo"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 selection:bg-zinc-100 selection:text-zinc-900 flex flex-col">
      {/* Top Dashboard Nav */}
      <header className="w-full bg-white border-b border-zinc-200/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Authenticated
            </span>
          </div>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-500">
            Welcome to OnCollably! Manage your active collaborations, spot allocations, and requests.
          </p>
        </div>

        {/* Dashboard Grid Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-2">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Campaigns</p>
            <p className="text-3xl font-bold text-zinc-900">0</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-2">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Whitelist Spots</p>
            <p className="text-3xl font-bold text-zinc-900">0</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-2">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Pending Requests</p>
            <p className="text-3xl font-bold text-zinc-900">0</p>
          </div>
        </div>

        <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-200 bg-white space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold text-lg">
            ⚡
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-900">Your Collaboration Hub is Ready</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Create your first project campaign or claim your public manager profile handle to start accepting requests.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
