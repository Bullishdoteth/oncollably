"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { FolderGit2, Plus, Calendar, ArrowRight, Loader2, X, CheckCircle2 } from "lucide-react"
import { addPortfolioItemAction } from "@/lib/db/actions"

interface CmPortfolioClientProps {
  initialItems: any[]
}

export function CmPortfolioClient({ initialItems = [] }: CmPortfolioClientProps) {
  const [items, setItems] = useState(initialItems)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    title: "",
    role: "Lead Collab Manager",
    type: "Whitelist Allocation",
    stats: "50 WL Spots • 300+ Entries",
    dateStr: "Aug 2026",
    description: "",
  })

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Please fill out all required fields")
      return
    }

    setIsSubmitting(true)
    const res = await addPortfolioItemAction({
      userId: "usr_demo_1",
      workspaceId: "ws_collabmanager",
      title: form.title,
      role: form.role,
      type: form.type,
      dateStr: form.dateStr,
      stats: form.stats,
      description: form.description,
    })
    setIsSubmitting(false)

    if (res.success) {
      toast.success("Portfolio item added successfully!")
      setItems((prev) => [
        {
          id: res.portfolioId,
          ...form,
          status: "Completed",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ])
      setIsAddModalOpen(false)
      setForm({
        title: "",
        role: "Lead Collab Manager",
        type: "Whitelist Allocation",
        stats: "50 WL Spots • 300+ Entries",
        dateStr: "Aug 2026",
        description: "",
      })
    } else {
      toast.error(res.error || "Failed to add portfolio item")
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
              Manager Portfolio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Verified Portfolio & History
          </h1>
          <p className="text-sm text-zinc-500 font-normal">
            Showcase your successful collab partnerships, allocation metrics, and project track record on your public profile (`/@collabmanager`).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/@collabmanager"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <span>View Public Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Work History</span>
          </button>
        </div>
      </div>

      {/* Portfolio Items Timeline / Grid */}
      <div className="p-8 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
            <FolderGit2 className="w-4 h-4 text-zinc-700" />
            <span>Verified Work History ({items.length})</span>
          </div>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="relative group">
                <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-white border-2 border-black flex items-center justify-center group-hover:border-emerald-600 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-black group-hover:bg-emerald-600 transition-colors" />
                </div>

                <div className="p-5 rounded-2xl bg-zinc-50/80 border border-zinc-200/90 space-y-3 hover:border-zinc-300 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-base font-bold text-zinc-900">{item.title}</h3>
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.dateStr}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-zinc-200/80 text-zinc-800 font-medium rounded-md">
                      {item.role}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded-md">
                      {item.type}
                    </span>
                    <span className="text-zinc-500 font-mono">{item.stats}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-zinc-400">
              No portfolio items added yet. Click "Add Work History" above!
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border border-zinc-100">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Add Work History</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  Campaign / Partnership Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Apex DAOs x CyberSquad Collab"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                    Your Role
                  </label>
                  <input
                    type="text"
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="e.g. Lead Collab Manager"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                    Date / Timeframe
                  </label>
                  <input
                    type="text"
                    required
                    value={form.dateStr}
                    onChange={(e) => setForm({ ...form, dateStr: e.target.value })}
                    placeholder="e.g. Aug 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  Key Metrics / Stats
                </label>
                <input
                  type="text"
                  required
                  value={form.stats}
                  onChange={(e) => setForm({ ...form, stats: e.target.value })}
                  placeholder="e.g. 50 WL Spots • 340 Entries Verified"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Summary of what you executed..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-sm font-semibold tracking-tight shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Save Portfolio Item</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
