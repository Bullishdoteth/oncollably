import React from "react"
import Link from "next/link"
import { Clock, ArrowRight, Rocket } from "lucide-react"
import { ensureSeedData } from "@/lib/db/seed"
import { getAllActiveCampaigns } from "@/lib/db/queries"

export default async function CmOpportunitiesPage() {
  await ensureSeedData()

  const campaigns = await getAllActiveCampaigns()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
            <Rocket className="w-4 h-4 text-zinc-500" />
            <span>Client Opportunities</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Collab Opportunities
          </h1>
          <p className="text-xs text-zinc-500 font-normal">
            Pitch your represented communities to active project giveaway campaigns.
          </p>
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
                  <div className="text-xs text-zinc-400 font-medium">{cmp.workspaceName}</div>
                  <h3 className="text-lg font-bold text-zinc-900 tracking-tight">{cmp.title}</h3>
                  <p className="text-xs text-zinc-400 font-mono">/c/{cmp.slug}</p>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                  {cmp.description || "Allocations for verified DAOs, Web3 alpha groups, and Discord communities."}
                </p>

                <div className="p-4 bg-zinc-50 border border-zinc-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-zinc-400 font-medium">Allocated Spots</span>
                    <div className="text-base font-bold text-zinc-900">
                      {cmp.allocatedSpots} / {cmp.totalSpots}
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-400 font-medium">Claimed Entries</span>
                    <div className="text-base font-bold text-emerald-600">{cmp.claimedSpots}</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  href={`/c/${cmp.slug}`}
                  target="_blank"
                  className="flex-1 py-2 px-4 bg-zinc-900 hover:bg-black text-white text-xs font-medium text-center transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Pitch Community Allocation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-10 text-center text-xs text-zinc-400 bg-white border border-zinc-200">
            No project campaign opportunities open at this time.
          </div>
        )}
      </div>
    </div>
  )
}
