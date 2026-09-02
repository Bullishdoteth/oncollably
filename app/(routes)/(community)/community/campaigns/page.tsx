import React from "react"
import Link from "next/link"
import { Rocket, ArrowRight, Clock, ShieldCheck } from "lucide-react"
import { ensureSeedData } from "@/lib/db/seed"
import { getAllActiveCampaigns } from "@/lib/db/queries"

export default async function CommunityBrowseCampaignsPage() {
  await ensureSeedData()

  const campaigns = await getAllActiveCampaigns()

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
              Community Browse
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Browse Project Campaigns
          </h1>
          <p className="text-sm text-zinc-500 font-normal">
            Discover verified Web3 projects offering guaranteed whitelist spot allocations for DAOs.
          </p>
        </div>
      </div>

      {/* Grid of active campaigns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.length > 0 ? (
          campaigns.map((cmp) => (
            <div
              key={cmp.id}
              className="p-7 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs space-y-6 hover:border-zinc-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {cmp.workspaceName}
                  </span>
                  <span className="text-xs font-medium text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {cmp.allocationType?.toUpperCase() || 'GUARANTEED'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-zinc-900 tracking-tight">{cmp.title}</h3>
                  <p className="text-xs text-zinc-400">Ecosystem: {cmp.ecosystem || 'Solana'}</p>
                </div>

                <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                  {cmp.description || "Open whitelist spot allocation for partner communities."}
                </p>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-zinc-400 font-medium">Spots Open</span>
                    <div className="text-base font-bold text-zinc-900">
                      {cmp.totalSpots - cmp.allocatedSpots} / {cmp.totalSpots}
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-400 font-medium">Claimed</span>
                    <div className="text-base font-bold text-emerald-600">{cmp.claimedSpots}</div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/c/${cmp.workspaceHandle || 'cybersamurai'}`}
                  target="_blank"
                  className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold tracking-tight shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Apply for Allocation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-12 text-center text-zinc-500 bg-white rounded-3xl border border-zinc-200">
            No active project campaigns available at this moment.
          </div>
        )}
      </div>
    </div>
  )
}
