"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Users, UserCheck, Plus, Trash2, X, Loader2, AtSign, ShieldCheck, Briefcase } from "lucide-react"
import { addCommunityRepresentativeAction, removeCommunityRepresentativeAction } from "@/lib/db/actions"

interface CommunityRepsClientProps {
  communityWorkspaceId: string
  initialReps: any[]
}

export function CommunityRepsClient({ communityWorkspaceId, initialReps = [] }: CommunityRepsClientProps) {
  const [reps, setReps] = useState(initialReps)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "",
    handle: "",
    email: "",
    role: "Collab Manager",
  })

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.handle.trim()) {
      toast.error("Please enter representative name and X handle")
      return
    }

    setIsSubmitting(true)
    const res = await addCommunityRepresentativeAction({
      communityWorkspaceId,
      name: form.name,
      handle: form.handle,
      email: form.email,
      role: form.role,
    })
    setIsSubmitting(false)

    if (res.success) {
      toast.success(`Collab Manager @${form.handle.replace(/^@/, '')} added as community representative!`)
      setReps((prev) => [
        {
          id: res.representativeId,
          name: form.name,
          handle: form.handle.replace(/^@/, ''),
          email: form.email || null,
          role: form.role,
          status: "active",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ])
      setIsAddModalOpen(false)
      setForm({ name: "", handle: "", email: "", role: "Collab Manager" })
    } else {
      toast.error(res.error || "Failed to add representative")
    }
  }

  const handleRemove = async (id: string, name: string) => {
    setRemovingId(id)
    const res = await removeCommunityRepresentativeAction(id)
    setRemovingId(null)

    if (res.success) {
      toast.success(`${name} removed from community representatives`)
      setReps((prev) => prev.filter((r) => r.id !== id))
    } else {
      toast.error(res.error || "Failed to remove representative")
    }
  }

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
            Add and manage Collab Managers (CMs) authorized to pitch and secure whitelist spots on behalf of your community.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-zinc-900 text-white text-xs font-medium hover:bg-black transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add CM Representative</span>
        </button>
      </div>

      {/* Roster Card */}
      <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Authorized Managers ({reps.length})</span>
          </div>
        </div>

        <div className="divide-y divide-zinc-100">
          {reps.length > 0 ? (
            reps.map((rep) => (
              <div key={rep.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-900 text-white font-bold text-sm rounded-xl flex items-center justify-center shrink-0 shadow-2xs">
                    {rep.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-zinc-900">{rep.name}</h3>
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified CM
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-500 pt-0.5">
                      <span className="font-mono text-zinc-700">@{rep.handle}</span>
                      {rep.email && <span>&bull; {rep.email}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-2.5 py-1 text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200 uppercase tracking-wider">
                    {rep.role || "Collab Manager"}
                  </span>

                  <button
                    disabled={removingId === rep.id}
                    onClick={() => handleRemove(rep.id, rep.name)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    title="Remove representative"
                  >
                    {removingId === rep.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center space-y-2">
              <Briefcase className="w-8 h-8 text-zinc-300 mx-auto" />
              <p className="text-sm font-semibold text-zinc-700">No representatives added yet</p>
              <p className="text-xs text-zinc-400">
                Click "Add CM Representative" to authorize Collab Managers to apply for spots for your community.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div className="bg-white max-w-lg w-full p-6 space-y-6 shadow-2xl border border-zinc-100 rounded-2xl">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <h3 className="text-base font-bold text-zinc-900">Add Collab Manager Representative</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  Manager Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-4 py-2.5 border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                    X / Twitter Handle *
                  </label>
                  <div className="relative flex items-center">
                    <AtSign className="w-4 h-4 absolute left-3.5 text-zinc-400" />
                    <input
                      type="text"
                      required
                      value={form.handle}
                      onChange={(e) => setForm({ ...form, handle: e.target.value })}
                      placeholder="alex_cm"
                      className="w-full pl-9 pr-4 py-2.5 border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="Collab Manager"
                    className="w-full px-4 py-2.5 border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="alex@collabagency.io"
                  className="w-full px-4 py-2.5 border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 rounded-xl"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Authorize Representative</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
