"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Rocket, ArrowLeft, Loader2 } from "lucide-react"
import { createCampaignAction } from "@/lib/db/actions"
import { useWorkspaceStore } from "@/lib/store/use-workspace-store"

export default function NewCampaignPage() {
  const router = useRouter()
  const { dbWorkspaces, activeSpace, activeHandle } = useWorkspaceStore()
  const currentWorkspace = dbWorkspaces.find((w) => w.type === activeSpace || w.handle === activeHandle) || dbWorkspaces[0]

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    totalSpots: "50",
    allocationType: "guaranteed" as "guaranteed" | "fcfs",
    ecosystem: "Solana",
    expiresInDays: "7",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error("Please enter a campaign title")
      return
    }

    setIsSubmitting(true)
    const res = await createCampaignAction({
      workspaceId: currentWorkspace?.id,
      handle: currentWorkspace?.handle,
      title: form.title,
      description: form.description,
      totalSpots: parseInt(form.totalSpots, 10) || 50,
      allocationType: form.allocationType,
      ecosystem: form.ecosystem,
      expiresInDays: parseInt(form.expiresInDays, 10) || 7,
    })

    setIsSubmitting(false)

    if (res.success) {
      toast.success("Campaign launched successfully!")
      router.push("/project/campaigns")
    } else {
      toast.error(res.error || "Failed to create campaign")
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
        <div className="space-y-1">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Campaigns</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Launch New Campaign
          </h1>
          <p className="text-sm text-zinc-500 font-normal">
            Configure entry criteria, whitelist allocation numbers, and community requirements.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
            Campaign Title *
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Guaranteed Whitelist Allocation"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
            Description
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Brief description for applicants and communities..."
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
              Total WL Spots
            </label>
            <input
              type="number"
              required
              min="1"
              value={form.totalSpots}
              onChange={(e) => setForm({ ...form, totalSpots: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
              Allocation Type
            </label>
            <select
              value={form.allocationType}
              onChange={(e) => setForm({ ...form, allocationType: e.target.value as any })}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
            >
              <option value="guaranteed">Guaranteed</option>
              <option value="fcfs">FCFS (First Come First Serve)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
              Duration (Days)
            </label>
            <select
              value={form.expiresInDays}
              onChange={(e) => setForm({ ...form, expiresInDays: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
            >
              <option value="3">3 Days</option>
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
              <option value="30">30 Days</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Rocket className="w-4 h-4" />
            )}
            <span>Publish Campaign</span>
          </button>
        </div>
      </form>
    </div>
  )
}
