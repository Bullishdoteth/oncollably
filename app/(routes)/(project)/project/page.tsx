import React from "react"
import Link from "next/link"
import { headers } from "next/headers"
import { Rocket, Inbox, Handshake, ArrowRight, Plus, ExternalLink, ShieldCheck } from "lucide-react"
import { auth } from "@/lib/auth/auth"
import { ensureSeedData } from "@/lib/db/seed"
import { getUserWorkspaces, getWorkspaceByHandle, getCampaignsForWorkspace, getApplicationsForProject } from "@/lib/db/queries"
import { verifyProjectWorkspace } from "@/services/verification"

export default async function ProjectDashboardPage() {
  await ensureSeedData()

  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  let currentWorkspace = null

  if (session?.user) {
    const userWorkspaces = await getUserWorkspaces(session.user.id)
    currentWorkspace = userWorkspaces.find((w) => w.type === "project") || null
  }

  const workspaceId = currentWorkspace?.id || "ws_cybersamurai"
  const campaigns = await getCampaignsForWorkspace(workspaceId)
  const applications = await getApplicationsForProject(workspaceId)

  const activeCampaigns = campaigns.filter((c) => c.status === "active")
  const totalAllocated = campaigns.reduce((acc, c) => acc + (c.allocatedSpots || 0), 0)
  const totalCapacity = campaigns.reduce((acc, c) => acc + (c.totalSpots || 0), 0)
  const pendingApplications = applications.filter((a) => a.status === "pending")

  const verification = verifyProjectWorkspace(currentWorkspace)
  const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const publicChannelUrl = `${rawAppUrl.replace(/\/$/, "")}/c/${currentWorkspace?.handle || "cybersamurai"}`

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-900 tracking-tight">
              {currentWorkspace?.name || "CyberSamurai NFT"}
            </span>
            <span className="text-zinc-300">•</span>
            {verification.isVerified ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            ) : (
              <span className="text-xs text-zinc-400 font-medium">Unverified</span>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Overview
          </h1>
          <p className="text-xs text-zinc-500 font-normal">
            Manage giveaway campaigns, whitelist spot distribution, and community applications.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={publicChannelUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-900 hover:border-zinc-300 text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <span>Public Channel</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>

          <Link
            href="/project/campaigns/new"
            className="px-4 py-2 bg-zinc-900 text-white text-xs font-medium hover:bg-black transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Campaign</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Active Campaigns</span>
            <Rocket className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-zinc-900">{activeCampaigns.length}</div>
          <p className="text-xs text-zinc-500 font-normal">Running on {currentWorkspace?.ecosystems || "Solana"} Ecosystem</p>
        </div>

        <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Allocated Whitelist Spots</span>
            <Handshake className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-zinc-900">
            {totalAllocated} <span className="text-sm font-normal text-zinc-400">/ {totalCapacity > 0 ? totalCapacity : 250}</span>
          </div>
          <p className="text-xs text-emerald-600 font-medium">Verified Sybil-Free Distribution</p>
        </div>

        <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Pending Applications</span>
            <Inbox className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-zinc-900">{pendingApplications.length}</div>
          <p className="text-xs text-zinc-500 font-normal">Awaiting team review</p>
        </div>
      </div>

      {/* Active Campaigns List */}
      <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">
              Active Campaigns
            </h2>
            <p className="text-xs text-zinc-500 font-normal">
              List of current giveaways receiving community applications.
            </p>
          </div>
          <Link
            href="/project/campaigns"
            className="text-xs font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
        </div>

        <div className="divide-y divide-zinc-100">
          {campaigns.length > 0 ? (
            campaigns.map((cmp) => (
              <div key={cmp.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900 truncate">{cmp.title}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-zinc-100 text-zinc-600 uppercase tracking-wider">
                      {cmp.allocationType || "Guaranteed"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 truncate">{cmp.description}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-xs">
                  <div className="text-right">
                    <div className="font-semibold text-zinc-900">{cmp.allocatedSpots} / {cmp.totalSpots} Spots</div>
                    <div className="text-[11px] text-zinc-400">Allocated</div>
                  </div>
                  <Link
                    href={`/project/campaigns`}
                    className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium text-xs transition-colors"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-zinc-400">
              No campaigns launched yet. Click "Launch Campaign" to create your first giveaway.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
