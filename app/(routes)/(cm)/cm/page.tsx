import React from "react"
import Link from "next/link"
import { Briefcase, FolderGit2, Send, ArrowRight, Sparkles, UserCheck } from "lucide-react"
import { ensureSeedData } from "@/lib/db/seed"
import { getCmPortfolioItems, getApplicationsForApplicant } from "@/lib/db/queries"

export default async function CmDashboardPage() {
  await ensureSeedData()

  const workspaceId = "ws_collabmanager"
  const portfolioItems = await getCmPortfolioItems(undefined, workspaceId)
  const applications = await getApplicationsForApplicant(workspaceId)

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified CM Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Collab Manager Dashboard
          </h1>
          <p className="text-sm text-zinc-500 font-normal">
            Manage your project roster, verified portfolio, partnership applications, and client outreach.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/cm/portfolio"
            className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Manage Portfolio</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Portfolio Projects</span>
            <FolderGit2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-900">{portfolioItems.length}</div>
          <p className="text-xs text-emerald-600 font-semibold">Verified Work Record</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pitches Submitted</span>
            <Send className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-900">{applications.length}</div>
          <p className="text-xs text-zinc-500 font-medium">To top-tier projects</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Profile Verification</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-900">VERIFIED</div>
          <p className="text-xs text-zinc-500 font-medium">Public profile live</p>
        </div>
      </div>

      {/* Portfolio Preview */}
      <div className="p-8 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-zinc-900 font-bold text-base tracking-tight">
            <Sparkles className="w-5 h-5 text-zinc-700" />
            <span>Recent Portfolio Highlights</span>
          </div>
          <Link
            href="/cm/portfolio"
            className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-zinc-100">
          {portfolioItems.length > 0 ? (
            portfolioItems.slice(0, 3).map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-900 truncate">{item.title}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-700">
                      {item.role}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 truncate">{item.description}</p>
                </div>

                <div className="shrink-0 text-right text-xs">
                  <div className="font-bold text-emerald-600">{item.stats}</div>
                  <div className="text-[11px] text-zinc-400">{item.dateStr}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-zinc-400">
              No portfolio items added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
