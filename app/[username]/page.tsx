import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { Briefcase, MapPin, Link2, Globe, Calendar, Activity } from "lucide-react"
import { PoweredBadge } from "@/components/marketing/powered-badge"
import { VerifiedBadge } from "@/components/ui/verified-badge"
import { XSocialIcon, DiscordIcon, TelegramIcon } from "@/components/ui/icons"
import { constructMetadata } from "@/lib/og-builder"

interface ProfilePageProps {
  params: Promise<{
    username: string
  }>
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const resolvedParams = await params
  const rawUsername = resolvedParams.username || "collabmanager"
  const username = decodeURIComponent(rawUsername).replace(/^@/, "")
  const formattedName = username.charAt(0).toUpperCase() + username.slice(1)

  const title = `${formattedName} (@${username}) | Verified Collab Manager on Oncollably`
  const description = `View @${username}'s official Web3 collaboration profile, verified activity history, community partnerships, and whitelist giveaways.`

  return constructMetadata({
    title,
    description,
    imageTitle: `${formattedName} (@${username})`,
    imageDescription: description,
    badge: "Verified CM Profile",
    path: `/@${username}`,
    type: "profile",
  })
}

const recentWorkHistory = [
  {
    id: "act-1",
    title: "Apex DAOs x CyberSquad Collab",
    role: "Lead Collab Manager",
    type: "Whitelist Allocation",
    date: "Aug 28, 2026",
    status: "Completed",
    stats: "50 WL Spots • 340 Entries Verified",
    description: "Successfully orchestrated cross-community whitelist allocation with 100% sybil protection and verified wallet exports.",
  },
  {
    id: "act-2",
    title: "Solana Collective Partnership Launch",
    role: "Community Growth Strategist",
    type: "Verification & Onboarding",
    date: "Aug 15, 2026",
    status: "Verified",
    stats: "Official CM Badge • 5 Communities Partnered",
    description: "Verified community manager credentials and set up automated collab request routing for 5 top-tier Solana DAOs.",
  },
  {
    id: "act-3",
    title: "Alpha Guild Whitelist Giveaway",
    role: "Campaign Director",
    type: "Giveaway Campaign",
    date: "Jul 30, 2026",
    status: "Completed",
    stats: "100 Guaranteed Spots • 1,200 Participants",
    description: "Executed high-converting whitelist campaign for 1,200 participants with real-time winner verification logs.",
  },
  {
    id: "act-4",
    title: "EVM Builders Guild Onboarding",
    role: "Collab Advisor",
    type: "Network Expansion",
    date: "Jul 12, 2026",
    status: "Completed",
    stats: "12 Collab Deals • $10 Pass Activated",
    description: "Managed portfolio of 12 parallel project proposals with zero DM clutter using Oncollably unified inbox.",
  },
]

export default async function CollabManagerProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await params
  const rawUsername = resolvedParams.username || "collabmanager"
  const username = decodeURIComponent(rawUsername).replace(/^@/, "")
  const formattedName = username.charAt(0).toUpperCase() + username.slice(1)

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 selection:bg-zinc-100 selection:text-zinc-900 flex flex-col justify-between">
      <div>
        {/* Top Cover Banner */}
        <div className="h-48 sm:h-56 w-full bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-950 border-b border-zinc-200 relative overflow-hidden">
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Top Right Floating Badge */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/90 backdrop-blur-md text-zinc-800 text-xs font-semibold rounded-full border border-white/40 shadow-xs">
              Social Profile
            </span>
          </div>
        </div>

        {/* Main Content Container with Crisp Border Styling */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Centered Profile Header Card with Border */}
          <div className="bg-white border border-zinc-200 rounded-3xl -mt-20 mb-6 p-6 sm:p-8 shadow-xs text-center relative space-y-4">
            
            {/* Centered Circular Avatar Overlapping Header */}
            <div className="-mt-16 sm:-mt-20 mb-2 flex justify-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-zinc-900 text-white font-black text-3xl sm:text-4xl flex items-center justify-center border-4 border-white shadow-md uppercase tracking-tight">
                {username.slice(0, 2)}
              </div>
            </div>

            {/* Name + Verified Badge */}
            <div className="space-y-1">
              <div className="inline-flex items-center justify-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                  {formattedName}
                </h1>
                <VerifiedBadge size="lg" color="emerald" />
              </div>
              <p className="text-sm font-medium text-zinc-500 font-mono">@{username}</p>
            </div>

            {/* Subtitle / Bio */}
            <p className="text-sm sm:text-base text-zinc-600 max-w-lg mx-auto font-normal leading-relaxed">
              Full Stack Web3 Collab Manager & Growth Strategist. Managing community partnerships, whitelist allocations, and giveaways for top-tier DAOs.
            </p>

            {/* CTA Button */}
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/sign-in"
                className="px-6 py-2.5 bg-black hover:bg-zinc-800 active:bg-zinc-900 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Request Collaboration
              </Link>
            </div>
          </div>

          {/* Section 1: Info Grid Box (Clean Icons, No Emojis) */}
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden mb-6 text-xs sm:text-sm divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 grid grid-cols-1 sm:grid-cols-3">
            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="text-zinc-400 text-[11px] font-medium uppercase tracking-wider">Role</p>
                <p className="font-semibold text-zinc-800">Collab Manager</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-zinc-400 text-[11px] font-medium uppercase tracking-wider">Region</p>
                <p className="font-semibold text-zinc-800">Global / Web3</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 shrink-0">
                <Link2 className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-zinc-400 text-[11px] font-medium uppercase tracking-wider">Profile Link</p>
                <a href={`https://oncollably.com/@${username}`} className="font-semibold text-zinc-900 hover:underline truncate block">
                  oncollably.com/@{username}
                </a>
              </div>
            </div>
          </div>

          {/* Section 2: Social Links Section (Official Brand SVG Icons) */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 mb-6 space-y-3">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Social Links & Channels
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
              >
                <XSocialIcon className="w-3.5 h-3.5 text-zinc-900" />
                <span>X (Twitter)</span>
                <span className="text-[10px] font-mono text-zinc-400 bg-white px-1.5 py-0.5 rounded border border-zinc-200">
                  12.4K Followers
                </span>
              </a>

              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
              >
                <DiscordIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>Discord</span>
                <span className="text-[10px] font-mono text-zinc-400 bg-white px-1.5 py-0.5 rounded border border-zinc-200">
                  Verified Mod
                </span>
              </a>

              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
              >
                <TelegramIcon className="w-3.5 h-3.5 text-sky-500" />
                <span>Telegram</span>
                <span className="text-[10px] font-mono text-zinc-400 bg-white px-1.5 py-0.5 rounded border border-zinc-200">
                  Active
                </span>
              </a>

              <a
                href={`https://oncollably.com/@${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-zinc-600" />
                <span>Website</span>
                <span className="text-[10px] font-mono text-zinc-400 bg-white px-1.5 py-0.5 rounded border border-zinc-200">
                  Official
                </span>
              </a>
            </div>
          </div>

          {/* Section 3: Recent Activities Vertical History Line Graph (Work History) */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-7 mb-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Recent Activities & Work History</span>
                </h2>
                <p className="text-xs text-zinc-500 font-normal">
                  Verified campaign logs, spot distribution history, and partner deals.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                Live Audit
              </span>
            </div>

            {/* Vertical History Line Timeline Graph */}
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
              {recentWorkHistory.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Timeline Node Icon */}
                  <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-white border-2 border-black flex items-center justify-center group-hover:border-emerald-600 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-black group-hover:bg-emerald-600 transition-colors" />
                  </div>

                  {/* Content Box with Clean Border */}
                  <div className="p-4 sm:p-5 rounded-xl bg-zinc-50/70 border border-zinc-200/90 space-y-2 hover:border-zinc-300 transition-all shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="text-sm sm:text-base font-bold text-zinc-900">
                        {item.title}
                      </h3>
                      <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-zinc-200/80 text-zinc-800 font-medium rounded-md">
                        {item.role}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded-md">
                        {item.type}
                      </span>
                      <span className="text-zinc-500 font-mono">
                        {item.stats}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal pt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Pinned Collaborations / Campaigns (Border Box) */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 mb-8 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Pinned Collaborations
              </h3>
              <span className="text-xs font-semibold text-zinc-500 font-mono">2 Active</span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-zinc-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-300 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-zinc-900">Apex Genesis Pass</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      25 Spots Remaining
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Requirements: Follow @ApexDAOs on X, Join Discord, Verify Wallet
                  </p>
                </div>
                <Link
                  href="/sign-in"
                  className="px-4 py-2 bg-black hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg text-center cursor-pointer shrink-0"
                >
                  Apply Spot
                </Link>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-300 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-zinc-900">CyberSquad WL Raid</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      Closing Soon
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Requirements: Verified Collab Manager Submission Only
                  </p>
                </div>
                <Link
                  href="/sign-in"
                  className="px-4 py-2 bg-black hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg text-center cursor-pointer shrink-0"
                >
                  Apply Spot
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Powered by badge rendered at the bottom of [username] directory page */}
      <footer className="border-t border-zinc-200 mt-12 bg-white">
        <PoweredBadge />
      </footer>
    </div>
  )
}
