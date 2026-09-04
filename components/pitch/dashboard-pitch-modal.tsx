"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { X, Send, Loader2, Sparkles, Building2 } from "lucide-react"
import { submitApplicationAction } from "@/lib/db/actions"

interface DashboardPitchModalProps {
  isOpen: boolean
  onClose: () => void
  campaign: any | null
  userWorkspace?: any
  onSubmitted?: () => void
}

export function DashboardPitchModal({
  isOpen,
  onClose,
  campaign,
  userWorkspace,
  onSubmitted,
}: DashboardPitchModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    communityName: "",
    communityType: "DAO",
    memberCount: "12500",
    xFollowerCount: "45000",
    xHandle: "",
    discordInvite: "",
    requestedSpots: "10",
    cmHandle: "",
    pitchMessage: "",
  })

  const [isFetchingDiscord, setIsFetchingDiscord] = useState(false)
  const [discordSyncSuccess, setDiscordSyncSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (userWorkspace) {
      setForm((prev) => ({
        ...prev,
        communityName: prev.communityName || userWorkspace.name || "",
        xHandle: prev.xHandle || (userWorkspace.handle ? `@${userWorkspace.handle.replace(/^@/, '')}` : ""),
      }))
    }
  }, [userWorkspace, isOpen])

  const isCampaignClosed = campaign?.status === "closed" || campaign?.status === "completed" || (campaign?.allocatedSpots || 0) >= (campaign?.totalSpots || 50)

  if (!isOpen || !campaign) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isCampaignClosed) {
      toast.error("This campaign is closed and is no longer accepting new collaboration pitches.")
      return
    }

    if (isCampaignClosed) {
      toast.error("No remaining slots available for this campaign.")
      return
    }

    if (!form.communityName.trim()) {
      toast.error("Please provide the community name you are representing.")
      return
    }

    setIsSubmitting(true)

    const res = await submitApplicationAction({
      campaignId: campaign.id,
      applicantWorkspaceId: userWorkspace?.id || "ws_alphaseekers",
      applicantType: form.cmHandle ? "cm" : "community",
      representedCommunityName: form.communityName,
      representedCommunityType: form.communityType,
      discordMemberCount: parseInt(form.memberCount, 10) || 12500,
      xFollowerCount: parseInt(form.xFollowerCount, 10) || 45000,
      xHandle: form.xHandle,
      requestedSpots: parseInt(form.requestedSpots, 10) || 10,
      pitchMessage: form.pitchMessage,
      discordInvite: form.discordInvite,
      cmHandle: form.cmHandle,
    })

    setIsSubmitting(false)

    if (res.success) {
      toast.success(`Pitch submitted successfully to ${campaign.title}!`)
      if (onSubmitted) onSubmitted()
      onClose()
    } else {
      toast.error(res.error || "Failed to submit pitch application")
    }
  }

  const handleSyncDiscordLive = async () => {

    if (!form.discordInvite.trim()) {
      toast.error("Please enter a Discord invite link first.")
      return
    }

    setIsFetchingDiscord(true)
    setDiscordSyncSuccess(null)

    try {
      const res = await fetch(`/api/integrations/discord/stats?invite=${encodeURIComponent(form.discordInvite)}`)
      const data = await res.json()

      setIsFetchingDiscord(false)

      if (data.success && data.memberCount > 0) {
        setForm((prev) => ({
          ...prev,
          memberCount: String(data.memberCount),
          communityName: prev.communityName || data.serverName || prev.communityName,
        }))
        setDiscordSyncSuccess(`${data.serverName || "Server"}: ${data.memberCount.toLocaleString()} members (${data.presenceCount.toLocaleString()} online)`)
        toast.success(`Fetched live Discord stats! Server: ${data.serverName} (${data.memberCount.toLocaleString()} members)`)
      } else {
        toast.error(data.error || "Could not fetch Discord server stats. Check the invite URL.")
      }
    } catch (err: any) {
      setIsFetchingDiscord(false)
      toast.error("Failed to connect to Discord Live API.")
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-zinc-200 z-10 overflow-hidden my-8"
        >
          {/* Top Banner Header */}
          <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white p-6 sm:p-7 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-1 pr-6">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Dashboard Pitching
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">/c/{campaign.workspaceHandle || "project"}/{campaign.slug}</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white leading-snug">
                  Pitch for {campaign.title}
                </h2>
                <p className="text-xs text-zinc-400">
                  By {campaign.workspaceName || "Project Partner"} • {campaign.allocatedSpots || 0} / {campaign.totalSpots || 50} Spots Allocated
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Pitching Form Body */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto">
            {isCampaignClosed && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center justify-between">
                <span>🔒 Campaign Closed — All allocated spots for this campaign have been completed. No new pitches are accepted.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wide mb-1.5">
                  Represented Community *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={form.communityName}
                    onChange={(e) => setForm({ ...form, communityName: e.target.value })}
                    placeholder="e.g. Alpha Seekers DAO"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wide mb-1.5">
                  Community Category / Type
                </label>
                <select
                  value={form.communityType}
                  onChange={(e) => setForm({ ...form, communityType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
                >
                  <option value="DAO">DAO</option>
                  <option value="Alpha Group">Alpha Group</option>
                  <option value="NFT Community">NFT Community</option>
                  <option value="Gaming Guild">Gaming Guild</option>
                  <option value="KOL Network">KOL Network</option>
                  <option value="DeFi Hub">DeFi Hub</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wide mb-1.5">
                Discord Server Invite Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={form.discordInvite}
                  onChange={(e) => setForm({ ...form, discordInvite: e.target.value })}
                  placeholder="https://discord.gg/alphaseekers"
                  className="flex-1 px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={handleSyncDiscordLive}
                  disabled={isFetchingDiscord}
                  className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
                  title="Query Discord Live API for exact member count"
                >
                  {isFetchingDiscord ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>Sync Discord API</span>
                </button>
              </div>
              {discordSyncSuccess && (
                <div className="mt-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>✓ Live Discord API Data: {discordSyncSuccess}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wide mb-1.5">
                  Discord Members (Live)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.memberCount}
                  onChange={(e) => setForm({ ...form, memberCount: e.target.value })}
                  placeholder="12500"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wide mb-1.5">
                  X Followers
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.xFollowerCount}
                  onChange={(e) => setForm({ ...form, xFollowerCount: e.target.value })}
                  placeholder="45000"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wide mb-1.5">
                  Requested Spots
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={form.requestedSpots}
                  onChange={(e) => setForm({ ...form, requestedSpots: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50/50 border-emerald-200 focus:outline-none focus:border-emerald-600 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wide mb-1.5">
                  Community X Handle
                </label>
                <input
                  type="text"
                  value={form.xHandle}
                  onChange={(e) => setForm({ ...form, xHandle: e.target.value })}
                  placeholder="@alphaseekers"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wide mb-1.5">
                  Collab Manager (CM) Handle
                </label>
                <input
                  type="text"
                  value={form.cmHandle}
                  onChange={(e) => setForm({ ...form, cmHandle: e.target.value })}
                  placeholder="@alex_cm"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wide mb-1.5">
                Pitch Note & Value Proposition
              </label>
              <textarea
                rows={3}
                value={form.pitchMessage}
                onChange={(e) => setForm({ ...form, pitchMessage: e.target.value })}
                placeholder="Describe your community engagement, previous successful mints/allocations, and why the project should approve your pitch..."
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 rounded-xl hover:bg-zinc-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isCampaignClosed}
                className="px-6 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-emerald-400" />
                )}
                <span>Submit Pitch</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
