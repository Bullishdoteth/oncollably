"use client"

import { useState } from "react"
import Link from "next/link"
import { Clock, ArrowRight, Compass, Sparkles, ExternalLink, Handshake } from "lucide-react"
import { DashboardPitchModal } from "@/components/pitch/dashboard-pitch-modal"

interface CommunityCampaignsClientProps {
  initialCampaigns: any[]
  userWorkspace?: any
}

export function CommunityCampaignsClient({
  initialCampaigns = [],
  userWorkspace,
}: CommunityCampaignsClientProps) {
  const [campaigns] = useState(initialCampaigns)
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null)
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false)

  const handleOpenPitchModal = (cmp: any) => {
    setSelectedCampaign(cmp)
    setIsPitchModalOpen(true)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>Explore & Pitch Opportunities</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            Project Campaigns
          </h1>
          <p className="text-xs text-zinc-500 font-normal">
            Pitch for community whitelist allocations directly from your dashboard without leaving OnCollably.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/community/applications"
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <span>My Submitted Pitches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.length > 0 ? (
          campaigns.map((cmp) => (
            <div
              key={cmp.id}
              className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-5 hover:border-zinc-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                    {cmp.status}
                  </span>
                  <span className="text-xs font-medium text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {cmp.allocationType?.toUpperCase() || "GUARANTEED"}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-zinc-400 font-medium">{cmp.workspaceName || "Project Partner"}</div>
                  <h3 className="text-lg font-bold text-zinc-900 tracking-tight">{cmp.title}</h3>
                  {cmp.workspaceHandle && (
                    <p className="text-xs text-zinc-400 font-mono">/c/{cmp.workspaceHandle}/{cmp.slug}</p>
                  )}
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                  {cmp.description || "Allocations for verified DAOs, Web3 alpha groups, and Discord communities."}
                </p>

                <div className="p-4 bg-zinc-50 border border-zinc-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-zinc-400 font-medium">Allocated Spots</span>
                    <div className="text-base font-bold text-zinc-900">
                      {cmp.allocatedSpots || 0} / {cmp.totalSpots || 50}
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-400 font-medium">Claimed Entries</span>
                    <div className="text-base font-bold text-emerald-600">{cmp.claimedSpots || 0}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  onClick={() => handleOpenPitchModal(cmp)}
                  className="w-full sm:flex-1 py-2.5 px-4 bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer rounded-xl"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pitch for Allocation</span>
                </button>

                {cmp.workspaceHandle && (
                  <Link
                    href={`/c/${cmp.workspaceHandle}/${cmp.slug}`}
                    target="_blank"
                    className="w-full sm:w-auto py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium transition-colors flex items-center justify-center gap-1 rounded-xl"
                    title="View Public Campaign Page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="sm:hidden">Public View</span>
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-12 text-center space-y-3 bg-white border border-zinc-200/80">
            <Handshake className="w-8 h-8 text-zinc-300 mx-auto" />
            <p className="text-sm font-semibold text-zinc-700">No active project campaigns currently available</p>
            <p className="text-xs text-zinc-400">
              Check back soon for new project whitelist allocation campaigns.
            </p>
          </div>
        )}
      </div>

      {/* Dashboard Pitch Modal */}
      <DashboardPitchModal
        isOpen={isPitchModalOpen}
        onClose={() => setIsPitchModalOpen(false)}
        campaign={selectedCampaign}
        userWorkspace={userWorkspace}
      />
    </div>
  )
}
