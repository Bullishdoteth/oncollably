import React from "react"
import Link from "next/link"
import { FolderGit2, Send, ArrowRight, UserCheck } from "lucide-react"
import { ensureSeedData } from "@/lib/db/seed"
import { getCmPortfolioItems, getApplicationsForApplicant } from "@/lib/db/queries"

export default async function CmDashboardPage() {
  await ensureSeedData()

  const workspaceId = "ws_collabmanager"
  const portfolioItems = await getCmPortfolioItems(undefined, workspaceId)
  const applications = await getApplicationsForApplicant(workspaceId)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-900 tracking-tight">
              Collab Manager Hub
            </span>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              Verified CM
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Overview
          </h1>
          <p className="text-xs text-zinc-500 font-normal">
            Manage your project roster, verified portfolio, partnership applications, and client outreach.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/cm/portfolio"
            className="px-4 py-2 bg-zinc-900 text-white text-xs font-medium hover:bg-black transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Manage Portfolio</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Portfolio Projects</span>
            <FolderGit2 className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-zinc-900">{portfolioItems.length}</div>
          <p className="text-xs text-emerald-600 font-medium">Verified Work Record</p>
        </div>

        <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Pitches Submitted</span>
            <Send className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-zinc-900">{applications.length}</div>
          <p className="text-xs text-zinc-500 font-normal">To top-tier projects</p>
        </div>

        <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Profile Status</span>
            <UserCheck className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-zinc-900">VERIFIED</div>
          <p className="text-xs text-zinc-500 font-normal">Public profile live</p>
        </div>
      </div>

      {/* Portfolio Preview */}
      <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">
              Recent Portfolio Highlights
            </h2>
            <p className="text-xs text-zinc-500 font-normal">
              Featured work history items on your public profile.
            </p>
          </div>
          <Link
            href="/cm/portfolio"
            className="text-xs font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
        </div>

        <div className="divide-y divide-zinc-100">
          {portfolioItems.length > 0 ? (
            portfolioItems.slice(0, 3).map((item) => (
              <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900 truncate">{item.title}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-zinc-100 text-zinc-600">
                      {item.role}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 truncate">{item.description}</p>
                </div>

                <div className="shrink-0 text-right text-xs">
                  <div className="font-semibold text-emerald-600">{item.stats}</div>
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
