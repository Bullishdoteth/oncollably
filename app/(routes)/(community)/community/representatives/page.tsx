import React from "react"
import { Users, UserCheck } from "lucide-react"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { ensureSeedData } from "@/lib/db/seed"
import { getTeamMembers } from "@/lib/db/queries"

export default async function CommunityRepsPage() {
  await ensureSeedData()

  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  const workspaceId = "ws_alphaseekers"
  const dbMembers = await getTeamMembers(workspaceId)

  const reps = dbMembers.length > 0 ? dbMembers.map((m) => ({
    id: m.id,
    displayName: m.email.split("@")[0],
    email: m.email,
    role: m.role || "Representative",
  })) : [
    {
      id: "rep_1",
      displayName: session?.user?.name || "Alpha Manager",
      email: session?.user?.email || "rep@alphaseekers.io",
      role: "Head Representative",
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
            <Users className="w-4 h-4 text-zinc-500" />
            <span>Community Roster</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Community Representatives
          </h1>
          <p className="text-xs text-zinc-500 font-normal">
            Manage staff, collab managers, and moderators representing your community.
          </p>
        </div>
      </div>

      {/* Roster Card */}
      <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
            <UserCheck className="w-4 h-4 text-zinc-500" />
            <span>Verified Representatives ({reps.length})</span>
          </div>
        </div>

        <div className="divide-y divide-zinc-100">
          {reps.map((rep) => (
            <div key={rep.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {rep.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">{rep.displayName}</div>
                  <div className="text-xs text-zinc-400">{rep.email}</div>
                </div>
              </div>

              <span className="px-2.5 py-0.5 text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
                {rep.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
