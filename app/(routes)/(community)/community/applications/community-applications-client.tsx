"use client"

import { useState } from "react"
import Link from "next/link"
import { Layers, ArrowRight, Inbox, Clock, CheckCircle2, XCircle, MessageSquare } from "lucide-react"

interface CommunityApplicationsClientProps {
  initialApplications: any[]
}

export function CommunityApplicationsClient({ initialApplications = [] }: CommunityApplicationsClientProps) {
  const [applications] = useState(initialApplications)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
              Community Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Collab Requests & Applications
          </h1>
          <p className="text-xs text-zinc-500 font-normal">
            Track all outgoing whitelist allocation requests submitted to project campaigns.
          </p>
        </div>

        <Link
          href="/community/campaigns"
          className="px-4 py-2 bg-zinc-900 text-white text-xs font-medium hover:bg-black transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <span>Explore Open Campaigns</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Applications List */}
      <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
            <Inbox className="w-4 h-4 text-zinc-500" />
            <span>Sent Requests ({applications.length})</span>
          </div>
        </div>

        <div className="divide-y divide-zinc-100">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app.id} className="py-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-zinc-900">{app.projectName || "Project"}</h3>
                      {app.projectHandle && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-zinc-100 text-zinc-600 font-mono">
                          /c/{app.projectHandle}
                        </span>
                      )}
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {app.requestedSpots} Spots Requested
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Campaign: <span className="font-medium text-zinc-800">{app.campaignTitle}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                        app.status === "accepted"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : app.status === "rejected"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {app.status === "accepted" && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {app.status === "rejected" && <XCircle className="w-3.5 h-3.5" />}
                      {app.status === "pending" && <Clock className="w-3.5 h-3.5 animate-pulse" />}
                      <span>{app.status}</span>
                    </span>

                    {app.projectHandle && (
                      <Link
                        href={`/c/${app.projectHandle}`}
                        target="_blank"
                        className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <span>View Project</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>

                {app.pitchMessage && (
                  <div className="p-3.5 bg-zinc-50 border border-zinc-100 text-xs text-zinc-600 font-normal flex items-start gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                    <span>"{app.pitchMessage}"</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-12 text-center space-y-3">
              <Inbox className="w-8 h-8 text-zinc-300 mx-auto" />
              <p className="text-sm font-semibold text-zinc-700">No outgoing requests submitted yet</p>
              <p className="text-xs text-zinc-400">
                Explore open project campaigns to request whitelist allocations for your community.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
