"use client"

import React, { useState } from "react"
import { Users, UserPlus, X } from "lucide-react"
import { toast } from "sonner"

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  status: string
  avatar: string
}

interface ProjectTeamClientProps {
  workspaceId: string
  initialMembers: TeamMember[]
}

export function ProjectTeamClient({ workspaceId, initialMembers }: ProjectTeamClientProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<"Admin" | "Collab Manager">("Collab Manager")
  const [members, setMembers] = useState<TeamMember[]>(initialMembers)

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return

    const newMem: TeamMember = {
      id: `mem_${Date.now()}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      status: "Pending",
      avatar: inviteEmail.charAt(0).toUpperCase(),
    }

    setMembers([...members, newMem])
    toast.success(`Invite sent to ${inviteEmail}!`)
    setInviteEmail("")
    setIsInviteModalOpen(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Team & Permissions
          </h1>
          <p className="text-xs text-zinc-500 font-normal">
            Invite team members, assign admin roles, and delegate collaboration management.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="px-4 py-2 bg-zinc-900 text-white text-xs font-medium hover:bg-black transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Team Members List */}
      <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
            <Users className="w-4 h-4 text-zinc-500" />
            <span>Active Team Roster ({members.length})</span>
          </div>
        </div>

        <div className="divide-y divide-zinc-100">
          {members.map((mem) => (
            <div key={mem.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {mem.avatar}
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                    <span>{mem.name}</span>
                    {mem.status === "Pending" && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        Pending Invite
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400">{mem.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
                  {mem.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full p-6 space-y-6 shadow-2xl border border-zinc-100">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <h3 className="text-base font-bold text-zinc-900">Invite Team Member</h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="collabmanager@domain.com"
                  className="w-full px-4 py-2.5 border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-4 py-2.5 border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                >
                  <option value="Collab Manager">Collab Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition-all shadow-xs"
              >
                Send Member Invitation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
