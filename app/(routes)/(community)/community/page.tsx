import React from "react"
import Link from "next/link"
import { ShieldCheck, Handshake, Rocket, Send, ArrowRight } from "lucide-react"
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-900 tracking-tight">
              Alpha Seekers DAO
            </span>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">Community Hub</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Overview
          </h1>
          <p className="text-xs text-zinc-500 font-normal">
            Overview of requested whitelist spots, active project partnerships, and winner verification.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/community/campaigns"
            className="px-4 py-2 bg-zinc-900 text-white text-xs font-medium hover:bg-black transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Rocket className="w-4 h-4" />
            <span>Browse Campaigns</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Active Collaborations</span>
            <Handshake className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-zinc-900">{collaborations.length}</div>
          <p className="text-xs text-emerald-600 font-medium">Granted Whitelist Partners</p>
        </div>

        <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Total WL Spots Secured</span>
            <ShieldCheck className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-zinc-900">{totalGrantedSpots}</div>
          <p className="text-xs text-zinc-500 font-normal">Guaranteed for DAO Members</p>
        </div>

        <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Pending Collab Requests</span>
            <Send className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-zinc-900">{pendingApps.length}</div>
          <p className="text-xs text-zinc-500 font-normal">Under project review</p>
        </div>
      </div>

      {/* Granted Allocations List */}
      <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">
              Active Whitelist Collaborations
            </h2>
            <p className="text-xs text-zinc-500 font-normal">
              List of projects providing whitelist allocations to your community.
            </p>
          </div>
          <Link
            href="/community/collaborations"
            className="text-xs font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
        </div>

        <div className="divide-y divide-zinc-100">
          {collaborations.length > 0 ? (
            collaborations.map((col) => (
              <div key={col.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900 truncate">{col.projectName}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {col.allocatedSpots} Spots Secured
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 truncate">Campaign: {col.campaignTitle}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs">
                  <Link
                    href={`/c/${col.projectHandle}`}
                    target="_blank"
                    className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium transition-colors flex items-center gap-1"
                  >
                    <span>View Campaign</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
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
