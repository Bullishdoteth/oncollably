import React from "react"
import { History, CheckCircle2, Clock, Calendar, UserCheck } from "lucide-react"
import { ensureSeedData } from "@/lib/db/seed"
import { getApplicationsForApplicant } from "@/lib/db/queries"
import { formatTimestamp, getRelativeTimeString } from "@/lib/utils/dates"

export default async function CommunityHistoryPage() {
  await ensureSeedData()

  const communityWorkspaceId = "ws_alphaseekers"
  const applications = await getApplicationsForApplicant(communityWorkspaceId)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
            <History className="w-4 h-4 text-zinc-500" />
            <span>Audit Trail</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Allocation History
          </h1>
          <p className="text-xs text-zinc-500 font-normal">
            Historical record of all past project allocations and winner distribution logs.
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
            <History className="w-4 h-4 text-zinc-500" />
            <span>Past Collab History ({applications.length})</span>
          </div>
        </div>

        <div className="divide-y divide-zinc-100">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-zinc-900">{app.projectName}</h3>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        app.status === "accepted"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : app.status === "rejected"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                      }`}
                    >
                      {app.status}
                    </span>

                    {app.isPitchedByCm ? (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 rounded flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-amber-600" />
                        <span>Pitched by CM {app.pitchedByCmHandle || `@${app.cmHandle || 'manager'}`}</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-900 border border-blue-200 rounded">
                        Directly Submitted
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">Campaign: {app.campaignTitle} • Requested: {app.requestedSpots} Spots</p>
                </div>

                <div className="flex flex-col sm:items-end text-[11px] text-zinc-500 space-y-1">
                  <div className="flex items-center gap-1 font-medium text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200/60">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span>Sent: {formatTimestamp(app.createdAt)} ({getRelativeTimeString(new Date(app.createdAt)) || 'recently'})</span>
                  </div>
                  {app.status !== 'pending' && (app.reviewedAt || app.updatedAt) && (
                    <div className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                      <Calendar className="w-3 h-3 text-emerald-600" />
                      <span>{app.status === 'accepted' ? 'Approved:' : 'Rejected:'} {formatTimestamp(app.reviewedAt || app.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-xs text-zinc-400">
              No historical allocation logs recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
