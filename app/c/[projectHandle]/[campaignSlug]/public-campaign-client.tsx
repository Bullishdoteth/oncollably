"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Rocket,
  ShieldCheck,
  ShieldAlert,
  Globe,
  ArrowRight,
  ArrowLeft,
  X,
  Send,
  Clock,
  Loader2,
  CheckCircle2,
  Wallet,
  Building2,
} from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { DiscordIcon, XSocialIcon } from "@/components/ui/icons"
import { Footer } from "@/components/landing/footer"
import { submitApplicationAction, submitWalletEntryAction } from "@/lib/db/actions"
import { verifyProjectWorkspace } from "@/services/verification"

interface PublicCampaignClientProps {
  projectHandle: string
  campaignSlug: string
  campaignData: any
  workspaceData: any
}

export function PublicCampaignClient({
  projectHandle,
  campaignSlug,
  campaignData,
  workspaceData,
}: PublicCampaignClientProps) {
  const [modalMode, setModalMode] = useState<"wallet_entry" | "collab_app" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Wallet Entry Form State
  const [walletForm, setWalletForm] = useState({
    walletAddress: "",
    discordTag: "",
    xHandle: "",
  })

  // Collab Application Form State
  const [appForm, setAppForm] = useState({
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

  // Local live state for spots
  const [claimedCount, setClaimedCount] = useState(campaignData?.claimedSpots || 0)

  const projectTitle = workspaceData?.name || projectHandle
  const avatarUrl = workspaceData?.avatarUrl || workspaceData?.image || ""
  const verification = verifyProjectWorkspace(workspaceData)

  const totalAllocated = campaignData.allocatedSpots || 0
  const totalCapacity = campaignData.totalSpots || 50
  const openSpots = Math.max(0, totalCapacity - totalAllocated)

  const handleWalletSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!walletForm.walletAddress.trim()) {
      toast.error("Please enter a valid wallet address")
      return
    }

    setIsSubmitting(true)
    const res = await submitWalletEntryAction({
      campaignId: campaignData.id,
      walletAddress: walletForm.walletAddress,
      discordTag: walletForm.discordTag,
      xHandle: walletForm.xHandle,
    })
    setIsSubmitting(false)

    if (res.success) {
      setClaimedCount((prev: number) => prev + 1)
      setModalMode(null)
      toast.success(`Wallet address submitted successfully for ${campaignData.title}!`)
      setWalletForm({ walletAddress: "", discordTag: "", xHandle: "" })
    } else {
      toast.error(res.error || "Failed to submit wallet entry")
    }
  }

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const res = await submitApplicationAction({
      campaignId: campaignData.id,
      applicantWorkspaceId: "ws_alphaseekers",
      applicantType: appForm.cmHandle ? "cm" : "community",
      representedCommunityName: appForm.communityName,
      representedCommunityType: appForm.communityType,
      discordMemberCount: parseInt(appForm.memberCount, 10) || 12500,
      xFollowerCount: parseInt(appForm.xFollowerCount, 10) || 45000,
      xHandle: appForm.xHandle,
      requestedSpots: parseInt(appForm.requestedSpots, 10) || 10,
      pitchMessage: appForm.pitchMessage,
      discordInvite: appForm.discordInvite,
      cmHandle: appForm.cmHandle,
    })

    setIsSubmitting(false)

    if (res.success) {
      setModalMode(null)
      toast.success(`Collab Application submitted for ${campaignData.title}!`)
      setAppForm({
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
    } else {
      toast.error(res.error || "Failed to submit application")
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-100 selection:text-zinc-900 flex flex-col justify-between">
      <div>
        {/* Banner Section */}
        <div className="relative w-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white overflow-hidden">
          {avatarUrl ? (
            <div
              className="absolute -top-24 -left-24 w-[600px] h-[600px] rounded-full blur-[140px] opacity-40 pointer-events-none bg-cover bg-center scale-150"
              style={{ backgroundImage: `url(${avatarUrl})` }}
            />
          ) : (
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-zinc-800/40 rounded-full blur-3xl pointer-events-none" />
          )}

          {/* Header */}
          <header className="w-full border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-30">
            <div className="max-w-5xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
              <Logo textClassName="text-white text-xl font-extrabold" />

              <div className="flex items-center gap-3">
                <Link
                  href={`/c/${projectHandle}`}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>All Campaigns</span>
                </Link>

                <button
                  onClick={() => setModalMode("wallet_entry")}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Submit Wallet</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Hero Container */}
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12 sm:py-16 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-8 border-b border-white/10">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={projectTitle}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-2xl shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-zinc-800 border-2 border-white/20 flex items-center justify-center font-bold text-2xl text-white shrink-0">
                  {projectTitle.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="space-y-2 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-zinc-300 border border-white/10">
                    /c/{projectHandle}/{campaignSlug}
                  </span>

                  {verification.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Verified Project
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      Unverified
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {campaignData.title}
                </h1>
                <p className="text-sm text-zinc-400 font-medium">By {projectTitle}</p>
              </div>
            </div>

            {/* Campaign Meta Bar */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-zinc-400 font-medium">Allocated Spots</div>
                <div className="text-xl font-bold text-white">{totalAllocated} / {totalCapacity}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-zinc-400 font-medium">Claimed Entries</div>
                <div className="text-xl font-bold text-emerald-400">{claimedCount} Entries</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-zinc-400 font-medium">Ecosystem</div>
                <div className="text-xl font-bold text-white">{campaignData.ecosystem || "Solana"}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-zinc-400 font-medium">Status</div>
                <div className="text-xl font-bold text-emerald-400 capitalize">{campaignData.status || "Active"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12 space-y-8">
          <div className="p-8 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Campaign Details</h2>
            <p className="text-base text-zinc-600 leading-relaxed">
              {campaignData.description || "Allocations for verified DAOs, Web3 alpha groups, and Discord communities with active members."}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setModalMode("wallet_entry")}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>Submit Wallet Address</span>
              </button>

              <button
                onClick={() => setModalMode("collab_app")}
                className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-black text-white text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>Apply for DAO Allocation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Entry Modal */}
      <AnimatePresence>
        {modalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalMode(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 z-10 my-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">
                    {modalMode === "wallet_entry" ? "Submit Whitelist Wallet" : "Apply for Community Allocation"}
                  </h3>
                  <p className="text-xs text-zinc-500">{campaignData.title}</p>
                </div>
                <button
                  onClick={() => setModalMode(null)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mode 1: Wallet Entry */}
              {modalMode === "wallet_entry" && (
                <form onSubmit={handleWalletSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                      Wallet Address ({campaignData.ecosystem || "Solana"}) *
                    </label>
                    <input
                      type="text"
                      required
                      value={walletForm.walletAddress}
                      onChange={(e) => setWalletForm({ ...walletForm, walletAddress: e.target.value })}
                      placeholder="e.g. 7xKXtg2CW8... or 0x71C..."
                      className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-mono font-medium focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                        Discord Tag / ID
                      </label>
                      <input
                        type="text"
                        value={walletForm.discordTag}
                        onChange={(e) => setWalletForm({ ...walletForm, discordTag: e.target.value })}
                        placeholder="username#0000"
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                        X / Twitter Handle
                      </label>
                      <input
                        type="text"
                        value={walletForm.xHandle}
                        onChange={(e) => setWalletForm({ ...walletForm, xHandle: e.target.value })}
                        placeholder="@yourhandle"
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => setModalMode(null)}
                      className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Wallet className="w-4 h-4" />
                      )}
                      <span>Submit Entry</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Mode 2: Collab Application */}
              {modalMode === "collab_app" && (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                      Community / DAO Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={appForm.communityName}
                      onChange={(e) => setAppForm({ ...appForm, communityName: e.target.value })}
                      placeholder="e.g. Alpha Seekers DAO"
                      className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                        Requested Spots
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={appForm.requestedSpots}
                        onChange={(e) => setAppForm({ ...appForm, requestedSpots: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                        Discord Invite
                      </label>
                      <input
                        type="text"
                        value={appForm.discordInvite}
                        onChange={(e) => setAppForm({ ...appForm, discordInvite: e.target.value })}
                        placeholder="https://discord.gg/yourdao"
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                      Pitch / Message
                    </label>
                    <textarea
                      rows={3}
                      value={appForm.pitchMessage}
                      onChange={(e) => setAppForm({ ...appForm, pitchMessage: e.target.value })}
                      placeholder="Introduce your community and why you'd be a great partner..."
                      className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:border-zinc-900 resize-none"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => setModalMode(null)}
                      className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>Submit Application</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
