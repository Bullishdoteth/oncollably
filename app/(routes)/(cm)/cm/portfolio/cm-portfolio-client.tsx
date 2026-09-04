"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { FolderGit2, Plus, Calendar, ArrowRight, Loader2, X, CheckCircle2 } from "lucide-react"
import { addPortfolioItemAction } from "@/lib/db/actions"

interface CmPortfolioClientProps {
  initialItems: any[]
  userId?: string
  workspaceId?: string
}

export function CmPortfolioClient({ initialItems = [], userId, workspaceId }: CmPortfolioClientProps) {
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
      userId,
      workspaceId,
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Portfolio & Work Record
          </h1>
          <p className="text-xs text-zinc-500 font-normal">
            Showcase your successful collab partnerships and allocation metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-zinc-900 text-white text-xs font-medium hover:bg-black transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Work History</span>
          </button>
        </div>
      </div>

      {/* Portfolio Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-4 hover:border-zinc-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200 uppercase">
                    {item.role}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.dateStr}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-zinc-900 tracking-tight">{item.title}</h3>
                  <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {item.stats}
                  </div>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-10 text-center text-xs text-zinc-400 bg-white border border-zinc-200">
            No portfolio items added yet. Click "Add Work History" to create your first portfolio entry.
          </div>
        )}
      </div>

      {/* Add Portfolio Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div className="bg-white max-w-lg w-full p-6 space-y-6 shadow-2xl border border-zinc-100">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <h3 className="text-base font-bold text-zinc-900">Add Portfolio Work History</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. CyberSamurai Solana Launch"
                  className="w-full px-4 py-2.5 border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                    Your Role
                  </label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="Lead Collab Manager"
                    className="w-full px-4 py-2.5 border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                    Date Range
                  </label>
                  <input
                    type="text"
                    value={form.dateStr}
                    onChange={(e) => setForm({ ...form, dateStr: e.target.value })}
                    placeholder="Aug 2026"
                    className="w-full px-4 py-2.5 border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  Results & Metrics
                </label>
                <input
                  type="text"
                  value={form.stats}
                  onChange={(e) => setForm({ ...form, stats: e.target.value })}
                  placeholder="50 WL Spots • 300+ Entries"
                  className="w-full px-4 py-2.5 border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
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
                  placeholder="Describe your responsibilities, community outreach, and partnership success..."
                  className="w-full px-4 py-2.5 border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>Add Item To Portfolio</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
