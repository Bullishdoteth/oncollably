import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Briefcase, MapPin, Link2, Globe, Calendar } from "lucide-react"
import { PoweredBadge } from "@/components/marketing/powered-badge"
import { VerifiedBadge } from "@/components/ui/verified-badge"
import { XSocialIcon, DiscordIcon } from "@/components/ui/icons"
import { constructMetadata } from "@/lib/og-builder"
import { ensureSeedData } from "@/lib/db/seed"
import { getWorkspaceByHandle, getCmPortfolioItems } from "@/lib/db/queries"

interface ProfilePageProps {
  params: Promise<{
    username: string
  }>
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const resolvedParams = await params
  const rawUsername = resolvedParams.username || ""
  const username = decodeURIComponent(rawUsername).replace(/^@/, "")
  const formattedName = username ? username.charAt(0).toUpperCase() + username.slice(1) : "Profile"

  const title = `${formattedName} (@${username}) | Verified Profile on Oncollably`
  const description = `View @${username}'s official Web3 collaboration profile, verified activity history, and community partnerships.`

  return constructMetadata({
    title,
    description,
    imageTitle: `${formattedName} (@${username})`,
    imageDescription: description,
    badge: "Verified Profile",
    path: `/@${username}`,
    type: "profile",
  })
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await params
  const rawUsername = resolvedParams.username || ""
  const username = decodeURIComponent(rawUsername).replace(/^@/, "")

  await ensureSeedData()

  const workspaceData = await getWorkspaceByHandle(username)

  if (!workspaceData) {
    notFound()
  }

  const portfolioItems = await getCmPortfolioItems(undefined, workspaceData.id)

  const name = workspaceData.name
  const handle = workspaceData.handle
  const bio = workspaceData.bio || "Verified Web3 profile managing community partnerships, whitelist allocations, and giveaways."
  const twitterUrl = workspaceData.twitter ? (workspaceData.twitter.startsWith("http") ? workspaceData.twitter : `https://x.com/${workspaceData.twitter.replace(/^@/, '')}`) : ""
  const discordUrl = workspaceData.discord ? (workspaceData.discord.startsWith("http") ? workspaceData.discord : `https://${workspaceData.discord}`) : ""
  const websiteUrl = workspaceData.website ? (workspaceData.website.startsWith("http") ? workspaceData.website : `https://${workspaceData.website}`) : ""

  const xFollowerCount = workspaceData.xFollowerCount || 0
  const discordMemberCount = workspaceData.discordMemberCount || 0

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white flex flex-col justify-between antialiased">
      <div>
        {/* Header Cover */}
        <div className="h-48 sm:h-56 w-full bg-gradient-to-r from-zinc-900 via-zinc-800 to-black border-b border-zinc-200 relative overflow-hidden">
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* Profile Card & Info */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-zinc-200 -mt-20 mb-6 p-6 sm:p-8 shadow-2xs text-center relative space-y-4">
            
            {/* Avatar */}
            <div className="-mt-16 sm:-mt-20 mb-2 flex justify-center">
              {workspaceData.avatarUrl ? (
                <img
                  src={workspaceData.avatarUrl}
                  alt={name}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-zinc-900 text-white font-bold text-3xl sm:text-4xl flex items-center justify-center border-4 border-white shadow-md uppercase tracking-tight">
                  {handle.slice(0, 2)}
                </div>
              )}
            </div>

            {/* Name + Badge */}
            <div className="space-y-1">
              <div className="inline-flex items-center justify-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                  {name}
                </h1>
                <VerifiedBadge size="lg" color="emerald" />
              </div>
              <p className="text-xs font-semibold text-zinc-500 font-mono">@{handle}</p>
            </div>

            {/* Bio */}
            <p className="text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto font-normal leading-relaxed">
              {bio}
            </p>

            {/* Action CTA */}
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/sign-in"
                className="px-6 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                Request Collaboration
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="bg-white border border-zinc-200 mb-6 text-xs divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 grid grid-cols-1 sm:grid-cols-3">
            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-100 flex items-center justify-center text-zinc-600 shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="text-zinc-400 text-[10px] font-semibold uppercase tracking-wider">Type</p>
                <p className="font-bold text-zinc-900 uppercase">{workspaceData.type}</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-100 flex items-center justify-center text-zinc-600 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-zinc-400 text-[10px] font-semibold uppercase tracking-wider">Ecosystems</p>
                <p className="font-bold text-zinc-900">{workspaceData.ecosystems || "Multi-Chain"}</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-100 flex items-center justify-center text-zinc-600 shrink-0">
                <Link2 className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-zinc-400 text-[10px] font-semibold uppercase tracking-wider">Profile Channel</p>
                <span className="font-mono text-zinc-900 truncate block font-bold">
                  /c/{handle}
                </span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          {(twitterUrl || discordUrl || websiteUrl) && (
            <div className="bg-white border border-zinc-200 p-5 mb-6 space-y-3">
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
                Social Links & Connected Channels
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {twitterUrl && (
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 flex items-center gap-2 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
                  >
                    <XSocialIcon className="w-3.5 h-3.5 text-zinc-900" />
                    <span>X (Twitter)</span>
                    {xFollowerCount > 0 && (
                      <span className="text-[10px] font-mono text-zinc-500 bg-white px-1.5 py-0.5 border border-zinc-200 font-bold">
                        {xFollowerCount.toLocaleString()} Followers
                      </span>
                    )}
                  </a>
                )}

                {discordUrl && (
                  <a
                    href={discordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 flex items-center gap-2 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
                  >
                    <DiscordIcon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Discord</span>
                    {discordMemberCount > 0 && (
                      <span className="text-[10px] font-mono text-zinc-500 bg-white px-1.5 py-0.5 border border-zinc-200 font-bold">
                        {discordMemberCount.toLocaleString()} Members
                      </span>
                    )}
                  </a>
                )}

                {websiteUrl && (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 flex items-center gap-2 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-zinc-600" />
                    <span>Official Website</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Work Record & Portfolio */}
          <div className="bg-white border border-zinc-200 p-6 sm:p-7 mb-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                  Verified Work History & Portfolio
                </h2>
                <p className="text-xs text-zinc-500 font-normal">
                  Recorded giveaway allocations and partnership deals.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {portfolioItems.length > 0 ? (
                portfolioItems.map((item) => (
                  <div key={item.id} className="p-4 bg-zinc-50/70 border border-zinc-200/90 space-y-2 hover:border-zinc-300 transition-all shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="text-sm font-bold text-zinc-900">
                        {item.title}
                      </h3>
                      <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.dateStr}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-zinc-200/80 text-zinc-800 font-medium text-[10px]">
                        {item.role}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[10px]">
                        {item.type}
                      </span>
                      <span className="text-zinc-500 font-mono text-[11px]">
                        {item.stats}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-600 leading-relaxed font-normal pt-1">
                      {item.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-zinc-400">
                  No portfolio items listed for @{handle} yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-zinc-200 mt-12 bg-white">
        <PoweredBadge />
      </footer>
    </div>
  )
}
