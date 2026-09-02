import React from "react"
import { Globe, Users, ShieldCheck, ArrowRight, ExternalLink } from "lucide-react"

interface CommunityPartner {
  id: string
  name: string
  handle: string
  type: string
  membersCount: string
  ecosystem: string
  discord: string
  twitter: string
}

const DEMO_PARTNER_COMMUNITIES: CommunityPartner[] = [
  {
    id: "com_1",
    name: "Alpha Seekers DAO",
    handle: "alphaseekers",
    type: "DAO",
    membersCount: "12,400 members",
    ecosystem: "Solana & Ethereum",
    discord: "discord.gg/alphaseekers",
    twitter: "@AlphaSeekersDAO",
  },
  {
    id: "com_2",
    name: "Apex Solana Guild",
    handle: "apexsolana",
    type: "Gaming Guild",
    membersCount: "8,900 members",
    ecosystem: "Solana Ecosystem",
    discord: "discord.gg/apexsolana",
    twitter: "@ApexSolana",
  },
  {
    id: "com_3",
    name: "Monad Alpha Lounge",
    handle: "monadalpha",
    type: "Alpha Group",
    membersCount: "5,200 members",
    ecosystem: "Monad & EVM",
    discord: "discord.gg/monadalpha",
    twitter: "@MonadAlpha",
  },
]

export default function PartnerCommunitiesPage() {
  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
              Partner Communities
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Verified Partner Communities
          </h1>
          <p className="text-sm text-zinc-500 font-normal">
            Browse verified Web3 alpha groups, DAOs, and gaming guilds for cross-community giveaways.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DEMO_PARTNER_COMMUNITIES.map((com) => (
          <div
            key={com.id}
            className="p-8 rounded-3xl bg-white border border-zinc-200/80 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
                  {com.type}
                </span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
                  {com.name}
                </h3>
                <div className="text-xs text-zinc-400 font-mono">@{com.handle}</div>
              </div>

              <div className="space-y-1 text-xs text-zinc-500">
                <div className="flex items-center gap-1.5 font-medium text-zinc-700">
                  <Users className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{com.membersCount}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{com.ecosystem}</span>
                </div>
              </div>
            </div>

            <a
              href={`/c/${com.handle}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <span>View Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
