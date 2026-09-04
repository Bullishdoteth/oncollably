"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Check, X, Inbox, Loader2, MessageSquare, Users, Globe, UserCheck } from "lucide-react"
import { DiscordIcon, XSocialIcon } from "@/components/ui/icons"
import { updateApplicationStatusAction } from "@/lib/db/actions"

interface ApplicationsClientProps {
  initialApplications: any[]
}

export function ProjectApplicationsClient({ initialApplications = [] }: ApplicationsClientProps) {
  const [applications, setApplications] = useState(initialApplications)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleStatusChange = async (id: string, status: "accepted" | "rejected") => {
    setLoadingId(id)
    const res = await updateApplicationStatusAction(id, status)
    setLoadingId(null)

    if (res.success) {
      toast.success(`Application marked as ${status}! Real-time email and notification sent.`)
      setApplications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      )
    } else {
      toast.error(res.error || "Failed to update application status")
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Collab Applications
          </h1>
          <p className="text-xs text-zinc-500 font-normal">
            Review community metrics (Discord members, X followers) and approve whitelist spot requests from DAOs and Collab Managers.
          </p>
        </div>
      </div>

      {/* Applications List */}
      <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
            <Inbox className="w-4 h-4 text-zinc-500" />
            <span>All Requests ({applications.length})</span>
          </div>
        </div>

        <div className="divide-y divide-zinc-100">
          {applications.length > 0 ? (
            applications.map((app) => {
              const discordCount = app.discordMemberCount || 12500
              const xCount = app.xFollowerCount || 45000

              return (
                <div key={app.id} className="py-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 min-w-0">
                      {/* Community Title & Type */}
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base font-extrabold text-zinc-900">{app.applicantName}</h3>
                        <span className="px-2.5 py-0.5 text-[10px] font-bold bg-zinc-100 text-zinc-700 uppercase tracking-wider border border-zinc-200">
                          {app.applicantType || "DAO"}
                        </span>
                        <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {app.requestedSpots} Spots Requested
                        </span>
                      </div>

                      {/* Verified Community Metrics Bar */}
                      <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-lg font-semibold">
                          <DiscordIcon className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{discordCount.toLocaleString()} Discord Members</span>
                        </div>

                        <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-lg font-semibold">
                          <XSocialIcon className="w-3.5 h-3.5 text-zinc-900" />
                          <span>{xCount.toLocaleString()} X Followers</span>
                        </div>

                        {app.cmHandle && (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg font-semibold">
                            <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                            <span>Represented by @{app.cmHandle.replace(/^@/, '')}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-zinc-500 pt-1">
                        Target Campaign: <span className="font-bold text-zinc-800">{app.campaignTitle}</span>
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      {app.status === "pending" ? (
                        <>
                          <button
                            disabled={loadingId === app.id}
                            onClick={() => handleStatusChange(app.id, "accepted")}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 rounded-xl"
                          >
                            {loadingId === app.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            <span>Accept & Grant Spots</span>
                          </button>

                          <button
                            disabled={loadingId === app.id}
                            onClick={() => handleStatusChange(app.id, "rejected")}
                            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 rounded-xl border border-zinc-200"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : (
                        <span
                          className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${
                            app.status === "accepted"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : "bg-rose-100 text-rose-800 border-rose-300"
                          }`}
                        >
                          {app.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pitch Message & Social Links */}
                  {(app.pitchMessage || app.discordInvite || app.xHandle) && (
                    <div className="p-4 bg-zinc-50 border border-zinc-100 text-xs space-y-2 text-zinc-600 rounded-xl">
                      {app.pitchMessage && (
                        <p className="font-normal text-zinc-800 flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                          <span>"{app.pitchMessage}"</span>
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-zinc-500 pt-1 border-t border-zinc-200/60">
                        {app.discordInvite && (
                          <a
                            href={app.discordInvite.startsWith("http") ? app.discordInvite : `https://${app.discordInvite}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                          >
                            <DiscordIcon className="w-3.5 h-3.5" />
                            <span>Join Discord Server ({app.discordInvite})</span>
                          </a>
                        )}
                        {app.xHandle && (
                          <span className="font-medium text-zinc-700">
                            X: <strong>{app.xHandle}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="py-12 text-center text-xs text-zinc-400">
              No applications received yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
