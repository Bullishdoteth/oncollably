"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Rocket,
  ShieldCheck,
  ShieldAlert,
  Globe,
  ArrowRight,
  X,
  Send,
  Clock,
  Loader2,
} from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { DiscordIcon, XSocialIcon } from "@/components/ui/icons"
import { Footer } from "@/components/landing/footer"
import { submitApplicationAction } from "@/lib/db/actions"
import { verifyProjectWorkspace } from "@/services/verification"

interface PublicProjectClientProps {
  slug: string
  initialWorkspace: any
  initialCampaigns: any[]
}

export function PublicProjectClient({
  slug,
  initialWorkspace,
  initialCampaigns = [],
}: PublicProjectClientProps) {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    initialCampaigns[0]?.id || ""
  )
  const [selectedCampaignTitle, setSelectedCampaignTitle] = useState<string>(
    initialCampaigns[0]?.title || "Guaranteed Whitelist Allocation"
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const projectTitle = initialWorkspace?.name || slug
  const projectBio = initialWorkspace?.bio || ""
  const ecosystems = initialWorkspace?.ecosystems || ""
  const avatarUrl = initialWorkspace?.avatarUrl || initialWorkspace?.image || ""

  const websiteUrl = initialWorkspace?.website
    ? (initialWorkspace.website.startsWith("http") ? initialWorkspace.website : `https://${initialWorkspace.website}`)
    : ""
  const discordUrl = initialWorkspace?.discord
    ? (initialWorkspace.discord.startsWith("http") ? initialWorkspace.discord : `https://${initialWorkspace.discord}`)
    : ""
  const twitterUrl = initialWorkspace?.twitter
    ? (initialWorkspace.twitter.startsWith("http") ? initialWorkspace.twitter : `https://x.com/${initialWorkspace.twitter.replace(/^@/, '')}`)
    : ""

  const totalAllocated = initialCampaigns.reduce(
    (acc, c) => acc + (c.allocatedSpots || 0),
    0
  )
  const totalCapacity = initialCampaigns.reduce(
    (acc, c) => acc + (c.totalSpots || 50),
    0
  )
  const progressPercent = totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100) : 70

  const areAllCampaignsClosed = initialCampaigns.length > 0 && initialCampaigns.every(
    (c) => c.status === "closed" || c.status === "completed" || (c.allocatedSpots || 0) >= c.totalSpots
  )

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const targetCampaignId = selectedCampaignId || initialCampaigns[0]?.id || "cmp_cybersamurai_1"
    const targetCmp = initialCampaigns.find((c) => c.id === targetCampaignId)
    const isTargetClosed = targetCmp
      ? (targetCmp.status === "closed" || targetCmp.status === "completed" || (targetCmp.allocatedSpots || 0) >= targetCmp.totalSpots)
      : false

    if (isTargetClosed) {
      toast.error("No remaining slots available for this campaign.")
      return
    }

    setIsSubmitting(true)

    const res = await submitApplicationAction({
      campaignId: targetCampaignId,
      applicantWorkspaceId: "ws_alphaseekers", // Default target community workspace
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
      setIsApplyModalOpen(false)
      toast.success(`Collab Application submitted to ${projectTitle}!`)
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
        {/* Banner Section with Dynamic Avatar Color Blur & Glassmorphism Effect */}
        <div className="relative w-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white overflow-hidden">
          {/* Dynamic Ambient Glow from Avatar Image */}
          {avatarUrl ? (
            <>
              <div
                className="absolute -top-24 -left-24 w-[600px] h-[600px] rounded-full blur-[140px] opacity-40 pointer-events-none bg-cover bg-center scale-150 transition-all duration-700"
                style={{ backgroundImage: `url(${avatarUrl})` }}
              />
              <div
                className="absolute top-10 right-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-30 pointer-events-none bg-cover bg-center transition-all duration-700"
                style={{ backgroundImage: `url(${avatarUrl})` }}
              />
            </>
          ) : (
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-zinc-800/40 rounded-full blur-3xl pointer-events-none" />
          )}

          {/* Top Header inside Banner with Glass Blur Effect */}
          <header className="w-full border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-30">
            <div className="max-w-5xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
              <Logo textClassName="text-white text-xl font-extrabold" />

              <div className="flex items-center gap-4">
                {initialCampaigns.length > 0 && (
                  <button
                    onClick={() => {
                      if (areAllCampaignsClosed) {
                        toast.error("No remaining slots available for this project's campaigns.")
                        return
                      }
                      setIsApplyModalOpen(true)
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      areAllCampaignsClosed
                        ? "bg-white/20 text-white/60 cursor-not-allowed border border-white/10"
                        : "bg-white hover:bg-zinc-100 text-zinc-900 shadow-xs hover:shadow-md cursor-pointer"
                    }`}
                  >
                    <span>{areAllCampaignsClosed ? "No Slots Remaining" : "Apply for Collab"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Banner Hero Body */}
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-20 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-4">
                  {/* Dynamic Logo Avatar Image fetched from DB */}
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={projectTitle}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-2xl shrink-0 bg-zinc-900"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 text-emerald-400 flex items-center justify-center font-bold text-2xl shrink-0 shadow-lg">
                      {projectTitle.charAt(0)}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                        {projectTitle}
                      </h1>
                      {(() => {
                        const verification = verifyProjectWorkspace(initialWorkspace)
                        if (verification.isVerified) {
                          return (
                            <div className="group relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-sm cursor-help">
                              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>Verified Project</span>

                              {/* Rich Verification Breakdown Tooltip */}
                              <div className="absolute left-0 top-full mt-2 w-64 p-3.5 rounded-2xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-40 space-y-2">
                                <div className="font-bold text-white flex items-center justify-between border-b border-zinc-800 pb-1.5">
                                  <span>Project Verification</span>
                                  <span className="text-emerald-400 font-semibold">✓ Verified</span>
                                </div>
                                <div className="space-y-1.5 text-[11px]">
                                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                    <span>✓</span> Project Access Pass ($10)
                                  </div>
                                  {verification.checks.xConnected && (
                                    <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                      <span>✓</span> X (Twitter) Account
                                    </div>
                                  )}
                                  {verification.checks.discordConnected && (
                                    <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                      <span>✓</span> Discord Server
                                    </div>
                                  )}
                                  {verification.checks.websiteConnected && (
                                    <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                      <span>✓</span> Personal Website
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800/80 text-zinc-400 border border-zinc-700/80 backdrop-blur-sm">
                            <ShieldAlert className="w-4 h-4 text-zinc-400 shrink-0" />
                            <span>Unverified</span>
                          </div>
                        )
                      })()}
                    </div>
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                      {ecosystems}
                    </p>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed">
                  {projectBio}
                </p>

                {/* Social & Website Links */}
                <div className="flex items-center gap-3 pt-2">
                  {twitterUrl && (
                    <a
                      href={twitterUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors border border-white/10 backdrop-blur-sm"
                      aria-label="Twitter Profile"
                    >
                      <XSocialIcon className="w-4 h-4" />
                    </a>
                  )}
                  {discordUrl && (
                    <a
                      href={discordUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors border border-white/10 backdrop-blur-sm"
                      aria-label="Discord Server"
                    >
                      <DiscordIcon className="w-4 h-4" />
                    </a>
                  )}
                  {websiteUrl && (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-zinc-300 hover:text-white transition-colors border border-white/10 backdrop-blur-sm flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Official Website
                    </a>
                  )}
                </div>
              </div>

              {/* Metrics Pill in Banner */}
              <div className="w-full sm:w-auto p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3 shrink-0">
                <span className="text-[11px] font-semibold text-zinc-300 block uppercase tracking-widest">
                  Whitelist Spots
                </span>
                <div className="text-2xl font-bold text-white">
                  {totalAllocated} / {totalCapacity > 0 ? totalCapacity : 250} Allocated
                </div>
                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(10, progressPercent))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Campaigns */}
        <main className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-20 space-y-10">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
              Open Campaigns
            </span>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
              <Rocket className="w-5 h-5 stroke-[1.75]" />
              Active Collaboration Campaigns
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {initialCampaigns.length > 0 ? (
              initialCampaigns.map((cmp) => {
                const isCmpClosed = cmp.status === "closed" || cmp.status === "completed" || (cmp.allocatedSpots || 0) >= cmp.totalSpots
                const openSpots = Math.max(0, cmp.totalSpots - (cmp.allocatedSpots || 0))

                return (
                  <div
                    key={cmp.id}
                    className="p-8 sm:p-9 rounded-3xl bg-white border border-zinc-200/80 hover:border-zinc-900 transition-all duration-300 flex flex-col justify-between space-y-8 hover:shadow-xl"
                  >
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          isCmpClosed
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-zinc-100 text-zinc-700 border-zinc-200"
                        }`}>
                          {isCmpClosed ? "0 Spots Open (Closed)" : `${openSpots} Spots Open (${cmp.allocationType?.toUpperCase() || 'GUARANTEED'})`}
                        </span>
                        <span className={`text-xs font-medium flex items-center gap-1 ${isCmpClosed ? "text-rose-500" : "text-zinc-400"}`}>
                          <Clock className="w-3.5 h-3.5" />
                          {isCmpClosed ? "Closed" : "Active"}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                        {cmp.title}
                      </h3>

                      <p className="text-sm text-zinc-500 font-normal leading-relaxed">
                        {cmp.description || "Allocations for verified DAOs, Web3 alpha groups, and Discord communities with active members."}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (isCmpClosed) {
                          toast.error("No remaining slots available for this campaign.")
                          return
                        }
                        setSelectedCampaignId(cmp.id)
                        setSelectedCampaignTitle(cmp.title)
                        setIsApplyModalOpen(true)
                      }}
                      className={`w-full py-3.5 px-4 rounded-xl text-xs font-semibold tracking-tight shadow-xs transition-all flex items-center justify-center gap-2 ${
                        isCmpClosed
                          ? "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed"
                          : "bg-zinc-900 hover:bg-black text-white hover:shadow-md cursor-pointer"
                      }`}
                    >
                      <span>{isCmpClosed ? "No Spots Remaining" : "Apply for Allocation"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )
              })
            ) : (
              <div className="col-span-2 p-8 text-center text-zinc-500 bg-zinc-50 rounded-2xl border border-zinc-200">
                No active public campaigns at this moment.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsApplyModalOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 my-8 border border-zinc-100"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-zinc-100 pb-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                    {selectedCampaignTitle}
                  </span>
                  <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                    Apply for Collaboration
                  </h3>
                </div>
                <button
                  onClick={() => setIsApplyModalOpen(false)}
                  className="p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                      Community Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={appForm.communityName}
                      onChange={(e) =>
                        setAppForm({ ...appForm, communityName: e.target.value })
                      }
                      placeholder="e.g. Alpha Seekers DAO"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                      Community Type
                    </label>
                    <select
                      value={appForm.communityType}
                      onChange={(e) =>
                        setAppForm({ ...appForm, communityType: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
                    >
                      <option value="DAO">DAO</option>
                      <option value="Discord Server">Discord Server</option>
                      <option value="Alpha Group">Alpha Group</option>
                      <option value="Gaming Guild">Gaming Guild</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                      Discord Invite *
                    </label>
                    <input
                      type="text"
                      required
                      value={appForm.discordInvite}
                      onChange={(e) =>
                        setAppForm({ ...appForm, discordInvite: e.target.value })
                      }
                      placeholder="discord.gg/yourserver"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                      Requested Spots
                    </label>
                    <select
                      value={appForm.requestedSpots}
                      onChange={(e) =>
                        setAppForm({ ...appForm, requestedSpots: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
                    >
                      <option value="5">5 Spots</option>
                      <option value="10">10 Spots</option>
                      <option value="15">15 Spots</option>
                      <option value="25">25 Spots</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                    Manager Twitter / Handle
                  </label>
                  <input
                    type="text"
                    value={appForm.cmHandle}
                    onChange={(e) =>
                      setAppForm({ ...appForm, cmHandle: e.target.value })
                    }
                    placeholder="@yourhandle"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                    Pitch Note
                  </label>
                  <textarea
                    rows={3}
                    value={appForm.pitchMessage}
                    onChange={(e) =>
                      setAppForm({ ...appForm, pitchMessage: e.target.value })
                    }
                    placeholder="Short message to the project team..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-sm font-semibold tracking-tight shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Submit Collab Application</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
