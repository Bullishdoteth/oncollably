import React from "react"
import { Globe, Users, ShieldCheck, ExternalLink } from "lucide-react"
import { ensureSeedData } from "@/lib/db/seed"
import { getWorkspacesByType } from "@/lib/db/queries"

export default async function PartnerCommunitiesPage() {
  await ensureSeedData()

  const communities = await getWorkspacesByType("community")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Communities
          </h1>
          <p className="text-xs text-zinc-500 font-normal">
            Browse verified Web3 alpha groups, DAOs, and gaming guilds for cross-community giveaways.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {communities.length > 0 ? (
          communities.map((com) => (
            <div
              key={com.id}
              className="p-6 bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between space-y-6 hover:border-zinc-300 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200 uppercase">
                    {com.type}
                  </span>
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Hub
                  </span>
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-zinc-900 tracking-tight">
                    {com.name}
                  </h3>
                  <div className="text-xs text-zinc-400 font-mono">@{com.handle}</div>
                </div>

                <div className="space-y-1 text-xs text-zinc-500">
                  <div className="flex items-center gap-1.5 font-medium text-zinc-700">
                    <Users className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{(com as any).membersCount || "Active Community"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{com.ecosystems || "Multi-Chain Ecosystem"}</span>
                  </div>
                </div>
              </div>

              <a
                href={`/c/${com.handle}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-4 bg-zinc-900 hover:bg-black text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))
        ) : (
          <div className="col-span-3 p-12 text-center text-xs text-zinc-400 bg-white border border-zinc-200">
            No community workspaces created yet in DB.
          </div>
        )}
      </div>
    </div>
  )
}
