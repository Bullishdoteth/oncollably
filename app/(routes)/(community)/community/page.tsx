import React from "react"
import Link from "next/link"
import { ShieldCheck, Handshake, Rocket, Send, ArrowRight, Sparkles } from "lucide-react"
import { ensureSeedData } from "@/lib/db/seed"
import {
  getCollaborationsForCommunity,
  getApplicationsForApplicant,
} from "@/lib/db/queries"

export default async function CommunityDashboardPage() {
  await ensureSeedData()

  const communityWorkspaceId = "ws_alphaseekers"
  const collaborations = await getCollaborationsForCommunity(communityWorkspaceId)
  const applications = await getApplicationsForApplicant(communityWorkspaceId)

  const totalGrantedSpots = collaborations.reduce(
    (acc, col) => acc + (col.allocatedSpots || 0),
    0
  )
  const pendingApps = applications.filter((a) => a.status === "pending")

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Alpha Seekers DAO Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Community Overview & Allocations
          </h1>
          <p className="text-sm text-zinc-500 font-normal">
            Overview of requested whitelist spots, active project partnerships, and winner verification.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/community/campaigns"
            className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Rocket className="w-4 h-4" />
            <span>Browse Project Campaigns</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Collaborations</span>
            <Handshake className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-900">{collaborations.length}</div>
          <p className="text-xs text-emerald-600 font-semibold">Granted Whitelist Partners</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total WL Spots Secured</span>
            <ShieldCheck className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-900">{totalGrantedSpots}</div>
          <p className="text-xs text-zinc-500 font-medium">Guaranteed for DAO Members</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Collab Requests</span>
            <Send className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-900">{pendingApps.length}</div>
          <p className="text-xs text-zinc-500 font-medium">Under project review</p>
        </div>
      </div>

      {/* Granted Allocations List */}
      <div className="p-8 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-zinc-900 font-bold text-base tracking-tight">
            <Sparkles className="w-5 h-5 text-zinc-700" />
            <span>Active Whitelist Collaborations</span>
          </div>
          <Link
            href="/community/collaborations"
            className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-zinc-100">
          {collaborations.length > 0 ? (
            collaborations.map((col) => (
              <div key={col.id} className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-900 truncate">{col.projectName}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {col.allocatedSpots} Spots Secured
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 truncate">Campaign: {col.campaignTitle}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs">
                  <Link
                    href={`/c/${col.projectHandle}`}
                    target="_blank"
                    className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>View Campaign</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-zinc-400">
              No active collaborations yet. Browse project campaigns to request whitelist allocations!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
