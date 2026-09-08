"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Rocket, ArrowLeft, Loader2, ShieldCheck, Users, Sliders, CheckSquare, Layers } from "lucide-react"
import { createCampaignAction } from "@/lib/db/actions"
import { useWorkspaceStore } from "@/lib/store/use-workspace-store"

const COMMUNITY_TYPES = ["DAO", "Alpha Group", "NFT Community", "Gaming Guild", "KOL Network", "DeFi Hub"]

export default function NewCampaignPage() {
  const router = useRouter()
  const { dbWorkspaces, activeSpace, activeHandle } = useWorkspaceStore()
  const currentWorkspace = dbWorkspaces.find((w) => w.type === activeSpace || w.handle === activeHandle) || dbWorkspaces[0]

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    totalSpots: "50",
    spotsPerCommunity: "10",
    allocationType: "guaranteed" as "guaranteed" | "fcfs",
    ecosystem: "Solana",
    expiresInDays: "7",
    minDiscordMembers: "500",
    minXFollowers: "1000",
    minCmExperienceYears: "1",
    requireDiscordVerification: true,
    requireXVerification: true,
    allowedCommunityTypes: ["DAO", "Alpha Group", "NFT Community", "Gaming Guild", "KOL Network", "DeFi Hub"],
    customRequirements: "",
  })

  const totalSpotsNum = parseInt(form.totalSpots, 10) || 50
  const spotsPerCommNum = parseInt(form.spotsPerCommunity, 10) || 10
  const calculatedPartners = Math.floor(totalSpotsNum / (spotsPerCommNum || 1))

  const handleToggleCommunityType = (type: string) => {
    setForm((prev) => {
      const exists = prev.allowedCommunityTypes.includes(type)
      const updated = exists
        ? prev.allowedCommunityTypes.filter((t) => t !== type)
        : [...prev.allowedCommunityTypes, type]
      return { ...prev, allowedCommunityTypes: updated }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error("Please enter a campaign title")
      return
    }

    if (spotsPerCommNum <= 0) {
      toast.error("Spots per community must be at least 1")
      return
    }

    setIsSubmitting(true)
    const res = await createCampaignAction({
      workspaceId: currentWorkspace?.id,
      handle: currentWorkspace?.handle,
      title: form.title,
      description: form.description,
      totalSpots: totalSpotsNum,
      spotsPerCommunity: spotsPerCommNum,
      allocationType: form.allocationType,
      ecosystem: form.ecosystem,
      expiresInDays: parseInt(form.expiresInDays, 10) || 7,
      minDiscordMembers: parseInt(form.minDiscordMembers, 10) || 0,
      minXFollowers: parseInt(form.minXFollowers, 10) || 0,
      minCmExperienceYears: parseInt(form.minCmExperienceYears, 10) || 0,
      requireDiscordVerification: form.requireDiscordVerification,
      requireXVerification: form.requireXVerification,
      allowedCommunityTypes: form.allowedCommunityTypes.join(","),
      customRequirements: form.customRequirements,
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
    <div className="w-full max-w-7xl mx-auto py-8 px-6 space-y-8">
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
            Configure whitelist allocations and set strict requirement checks for vetting communities and Collab Managers.
          </p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Campaign Overview */}
        <div className="p-8 bg-white border border-zinc-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
            <Rocket className="w-4 h-4 text-emerald-600" />
            <h2 className="text-base font-bold text-zinc-900">Campaign Basic Details</h2>
          </div>

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
              className="w-full px-4 py-3 border border-zinc-200 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
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
              className="w-full px-4 py-3 border border-zinc-200 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
                Allocation Type
              </label>
              <select
                value={form.allocationType}
                onChange={(e) => setForm({ ...form, allocationType: e.target.value as any })}
                className="w-full px-4 py-3 border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
              >
                <option value="guaranteed">Guaranteed Whitelist</option>
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
                className="w-full px-4 py-3 border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
              >
                <option value="3">3 Days</option>
                <option value="7">7 Days</option>
                <option value="14">14 Days</option>
                <option value="30">30 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Project-Set Spot Allocation */}
        <div className="p-8 bg-white border border-zinc-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base font-bold text-zinc-900">Project-Controlled Spot Allocation</h2>
            </div>
            <span className="px-2.5 py-0.5 text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Project Sets Spot Limits
            </span>
          </div>

          <p className="text-xs text-zinc-500">
            Define total whitelist capacity and specify exactly how many spots are granted per approved community or Collab Manager.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
                Total Campaign WL Spots *
              </label>
              <input
                type="number"
                required
                min="1"
                value={form.totalSpots}
                onChange={(e) => setForm({ ...form, totalSpots: e.target.value })}
                className="w-full px-4 py-3 border border-zinc-200 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
                Spots Available Per Community / CM *
              </label>
              <input
                type="number"
                required
                min="1"
                value={form.spotsPerCommunity}
                onChange={(e) => setForm({ ...form, spotsPerCommunity: e.target.value })}
                className="w-full px-4 py-3 border border-emerald-300 text-sm font-bold text-emerald-900 bg-emerald-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="p-4 bg-zinc-50 border border-zinc-200/80 flex items-center justify-between text-xs text-zinc-700">
            <div>
              <span className="text-zinc-500 font-medium">Estimated Collab Capacity:</span>{" "}
              <strong className="text-zinc-900 font-bold">{calculatedPartners} Communities / CM Deals</strong>
            </div>
            <span className="text-[11px] text-zinc-500 font-medium">
              ({spotsPerCommNum} spots × {calculatedPartners} communities = {spotsPerCommNum * calculatedPartners} spots)
            </span>
          </div>
        </div>

        {/* Section 3: Requirement Checks & Vetting Rules */}
        <div className="p-8 bg-white border border-zinc-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-bold text-zinc-900">Applicant Vetting & Requirement Checks</h2>
            </div>
            <span className="px-2.5 py-0.5 text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
              Automated Vetting
            </span>
          </div>

          <p className="text-xs text-zinc-500">
            Set mandatory thresholds so the platform can automatically vet incoming applications and flag unqualified submissions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
                Min Discord Members
              </label>
              <input
                type="number"
                min="0"
                value={form.minDiscordMembers}
                onChange={(e) => setForm({ ...form, minDiscordMembers: e.target.value })}
                placeholder="500"
                className="w-full px-4 py-3 border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
                Min X / Twitter Followers
              </label>
              <input
                type="number"
                min="0"
                value={form.minXFollowers}
                onChange={(e) => setForm({ ...form, minXFollowers: e.target.value })}
                placeholder="1000"
                className="w-full px-4 py-3 border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
                Min CM Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                value={form.minCmExperienceYears}
                onChange={(e) => setForm({ ...form, minCmExperienceYears: e.target.value })}
                placeholder="1"
                className="w-full px-4 py-3 border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
              />
            </div>
          </div>

          {/* Social Verification Toggles */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
              Required Social Verification
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3.5 border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.requireDiscordVerification}
                  onChange={(e) => setForm({ ...form, requireDiscordVerification: e.target.checked })}
                  className="w-4 h-4 text-zinc-900 accent-zinc-900"
                />
                <div>
                  <div className="text-xs font-bold text-zinc-900">Require Discord Server Link</div>
                  <div className="text-[11px] text-zinc-500">Applicant must provide an active Discord invite URL</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.requireXVerification}
                  onChange={(e) => setForm({ ...form, requireXVerification: e.target.checked })}
                  className="w-4 h-4 text-zinc-900 accent-zinc-900"
                />
                <div>
                  <div className="text-xs font-bold text-zinc-900">Require X / Twitter Handle</div>
                  <div className="text-[11px] text-zinc-500">Applicant must link official X community handle</div>
                </div>
              </label>
            </div>
          </div>

          {/* Allowed Community Categories */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
              Allowed Community Types
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {COMMUNITY_TYPES.map((type) => {
                const isSelected = form.allowedCommunityTypes.includes(type)
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleToggleCommunityType(type)}
                    className={`px-3.5 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    {isSelected ? `✓ ${type}` : `+ ${type}`}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Custom Requirements / Notes */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
              Custom Vetting Rules & Instructions
            </label>
            <textarea
              rows={2}
              value={form.customRequirements}
              onChange={(e) => setForm({ ...form, customRequirements: e.target.value })}
              placeholder="e.g. Must host an announcement within 24h of allocation approval..."
              className="w-full px-4 py-3 border border-zinc-200 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
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

