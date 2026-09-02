import React from "react"
import { headers } from "next/headers"
import Link from "next/link"
import { Handshake, Globe, CheckCircle2, ArrowRight } from "lucide-react"
import { auth } from "@/lib/auth/auth"
import { ensureSeedData } from "@/lib/db/seed"
import { getUserWorkspaces, getWorkspaceByHandle, getApplicationsForProject } from "@/lib/db/queries"

export default async function ProjectCollaborationsPage() {
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
  const applications = await getApplicationsForProject(workspaceId)
  const acceptedCollabs = applications.filter((a) => a.status === "accepted")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Collaborations
          </h1>
          <p className="text-xs text-zinc-500 font-normal">
            Track all approved giveaway spot allocations granted to partner DAOs and alpha groups.
          </p>
        </div>

        <Link
          href="/project/applications"
          className="px-4 py-2 bg-zinc-900 text-white text-xs font-medium hover:bg-black transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <span>View Inbox</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Accepted Collaborations List */}
      <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
            <Handshake className="w-4 h-4 text-emerald-600" />
            <span>Active Partner Deals ({acceptedCollabs.length})</span>
          </div>
        </div>

        <div className="divide-y divide-zinc-100">
          {acceptedCollabs.length > 0 ? (
            acceptedCollabs.map((app) => (
              <div key={app.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-bold text-zinc-900">{app.applicantWorkspaceId.replace("ws_", "").toUpperCase()}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ {app.requestedSpots} Spots Granted
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">{app.pitchMessage || "Approved community partner allocation."}</p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  {app.discordInvite && (
                    <a
                      href={app.discordInvite.startsWith("http") ? app.discordInvite : `https://${app.discordInvite}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium transition-colors flex items-center gap-1"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Discord</span>
                    </a>
                  )}
                  <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active Deal
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center space-y-2">
              <Handshake className="w-8 h-8 text-zinc-300 mx-auto" />
              <p className="text-sm font-semibold text-zinc-700">No approved collaborations yet</p>
              <p className="text-xs text-zinc-400">
                Review pending applications in your Inbox to accept community spot requests.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
