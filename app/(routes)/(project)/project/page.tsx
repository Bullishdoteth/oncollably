import React from "react"
import Link from "next/link"
import { headers } from "next/headers"
import { Rocket, Inbox, Handshake, Users, ArrowRight, Plus, Sparkles, ExternalLink, ShieldCheck } from "lucide-react"
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
    currentWorkspace = userWorkspaces.find((w) => w.type === "project") || userWorkspaces[0]
  }

  if (!currentWorkspace) {
    currentWorkspace = await getWorkspaceByHandle("cybersamurai")
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
    <div className="w-full max-w-6xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {currentWorkspace?.name || "CyberSamurai NFT"} Workspace
            </span>
            {verification.isVerified ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200">
                Unverified
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Project Overview & Analytics
          </h1>
          <p className="text-sm text-zinc-500 font-normal">
            Manage giveaway campaigns, whitelist spot distribution, and community applications.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={publicChannelUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-900 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <span>Public Channel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <Link
            href="/project/campaigns/new"
            className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Campaign</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Campaigns</span>
            <Rocket className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-900">{activeCampaigns.length}</div>
          <p className="text-xs text-zinc-500 font-medium">Running on {currentWorkspace?.ecosystems || "Solana"} Ecosystem</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Allocated Whitelist Spots</span>
            <Handshake className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-900">
            {totalAllocated} <span className="text-sm font-normal text-zinc-400">/ {totalCapacity > 0 ? totalCapacity : 250}</span>
          </div>
          <p className="text-xs text-emerald-600 font-semibold">Verified Sybil-Free Distribution</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Applications</span>
            <Inbox className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-900">{pendingApplications.length}</div>
          <p className="text-xs text-zinc-500 font-medium">Awaiting team review</p>
        </div>
      </div>

      {/* Active Campaigns List */}
      <div className="p-8 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-zinc-900 font-bold text-base tracking-tight">
            <Sparkles className="w-5 h-5 text-zinc-700" />
            <span>Active Collaboration Campaigns</span>
          </div>
          <Link
            href="/project/campaigns"
            className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-zinc-100">
          {campaigns.length > 0 ? (
            campaigns.map((cmp) => (
              <div key={cmp.id} className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-900 truncate">{cmp.title}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-700 uppercase">
                      {cmp.allocationType || "Guaranteed"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 truncate">{cmp.description}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-xs">
                  <div className="text-right">
                    <div className="font-bold text-zinc-900">{cmp.allocatedSpots} / {cmp.totalSpots} Spots</div>
                    <div className="text-[11px] text-zinc-400">Allocated</div>
                  </div>
                  <Link
                    href={`/project/campaigns`}
                    className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold transition-colors"
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
