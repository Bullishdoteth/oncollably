"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Check, X, Inbox, Loader2, MessageSquare } from "lucide-react"
import { updateApplicationStatusAction } from "@/lib/db/actions"
import { DiscordIcon } from "@/components/ui/icons"

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
      toast.success(`Application mark as ${status}!`)
      setApplications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      )
    } else {
      toast.error(res.error || "Failed to update application status")
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
              Applications Inbox
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Incoming Collab Applications
          </h1>
          <p className="text-sm text-zinc-500 font-normal">
            Review and approve whitelist allocation requests from DAOs and Collab Managers.
          </p>
        </div>
      </div>

      {/* Applications List */}
      <div className="p-8 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
            <Inbox className="w-4 h-4 text-zinc-700" />
            <span>All Requests ({applications.length})</span>
          </div>
        </div>

        <div className="divide-y divide-zinc-100">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app.id} className="py-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-zinc-900">{app.applicantName}</h3>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-zinc-100 text-zinc-700 uppercase">
                        {app.applicantType || "DAO"}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {app.requestedSpots} Spots Requested
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Campaign: <span className="font-semibold text-zinc-800">{app.campaignTitle}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {app.status === "pending" ? (
                      <>
                        <button
                          disabled={loadingId === app.id}
                          onClick={() => handleStatusChange(app.id, "accepted")}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
                          className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          app.status === "accepted"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {app.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Pitch Message & Links */}
                {(app.pitchMessage || app.discordInvite || app.cmHandle) && (
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs space-y-2 text-zinc-600">
                    {app.pitchMessage && (
                      <p className="font-medium text-zinc-800 flex items-start gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                        <span>"{app.pitchMessage}"</span>
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-zinc-500 pt-1">
                      {app.discordInvite && (
                        <span>Discord: <strong className="text-zinc-800">{app.discordInvite}</strong></span>
                      )}
                      {app.cmHandle && (
                        <span>Manager Handle: <strong className="text-zinc-800">{app.cmHandle}</strong></span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-zinc-400">
              No incoming applications right now.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
