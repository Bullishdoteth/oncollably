"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Check, X, Inbox, Loader2, MessageSquare } from "lucide-react"
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
      toast.success(`Application marked as ${status}!`)
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
            Applications
          </h1>
          <p className="text-xs text-zinc-500 font-normal">
            Review and approve whitelist allocation requests from DAOs and Collab Managers.
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
            applications.map((app) => (
              <div key={app.id} className="py-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-zinc-900">{app.applicantName}</h3>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-zinc-100 text-zinc-600 uppercase tracking-wider">
                        {app.applicantType || "DAO"}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {app.requestedSpots} Spots Requested
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Campaign: <span className="font-medium text-zinc-800">{app.campaignTitle}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {app.status === "pending" ? (
                      <>
                        <button
                          disabled={loadingId === app.id}
                          onClick={() => handleStatusChange(app.id, "accepted")}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
                          className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
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
                  <div className="p-4 bg-zinc-50 border border-zinc-100 text-xs space-y-2 text-zinc-600">
                    {app.pitchMessage && (
                      <p className="font-normal text-zinc-800 flex items-start gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                        <span>"{app.pitchMessage}"</span>
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-zinc-500 pt-1">
                      {app.discordInvite && (
                        <span>Discord: <strong className="text-zinc-800 font-medium">{app.discordInvite}</strong></span>
                      )}
                      {app.cmHandle && (
                        <span>Manager Handle: <strong className="text-zinc-800 font-medium">{app.cmHandle}</strong></span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-xs text-zinc-400">
              No applications received yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
