"use client"

import { useState } from "react"
import Link from "next/link"
import { Handshake, CheckCircle2, ArrowRight, FileSpreadsheet, Clock, Download, Layers } from "lucide-react"
import { WalletSubmissionSheet } from "@/components/sheets/wallet-submission-sheet"
import { MasterWalletSheetModal } from "@/components/sheets/master-wallet-sheet-modal"

interface ProjectCollaborationsClientProps {
  initialCollaborations: any[]
}

export function ProjectCollaborationsClient({ initialCollaborations = [] }: ProjectCollaborationsClientProps) {
  const [collaborations] = useState(initialCollaborations)
  const [selectedCollab, setSelectedCollab] = useState<any | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false)

  // Construct combined master entries across all accepted CM partner allocations
  const masterEntries = collaborations.flatMap((c) => {
    const communityName = c.applicantName || c.representedCommunityName || "Partner DAO"
    const cmHandle = c.cmHandle || (c.applicantHandle ? `@${c.applicantHandle}` : "")
    if (c.entries && Array.isArray(c.entries) && c.entries.length > 0) {
      return c.entries.map((e: any, idx: number) => ({
        id: e.id || `m_${c.id}_${idx}`,
        walletAddress: e.walletAddress,
        discordTag: e.discordTag || "",
        xHandle: e.xHandle || "",
        communityName,
        cmHandle,
        submittedAt: e.submittedAt || new Date(),
      }))
    }
    return []
  })

  const handleOpenSheet = (collab: any) => {
    setSelectedCollab({
      id: collab.id,
      campaignId: collab.campaignId,
      campaignTitle: collab.campaignTitle || "Campaign",
      campaignSlug: collab.campaignSlug || "campaign",
      projectName: collab.applicantName || "Partner DAO",
      projectHandle: collab.applicantHandle || "community",
      allocatedSpots: collab.requestedSpots || 10,
      claimedSpots: collab.claimedSpots || 0,
      status: collab.claimedSpots >= (collab.requestedSpots || 10) ? "completed" : "accepted",
      ecosystem: collab.ecosystem || "Solana",
      entries: collab.entries || [],
    })
    setIsSheetOpen(true)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            Project Collaborations
          </h1>
          <p className="text-xs text-zinc-500 font-normal">
            Inspect individual CM wallet sheets or export the Unified Master Sheet containing all combined partner wallets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMasterModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer rounded-xl"
          >
            <Layers className="w-4 h-4 text-emerald-200" />
            <span>Unified Master Sheet ({masterEntries.length} Wallets)</span>
          </button>

          <Link
            href="/project/applications"
            className="px-4 py-2 bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer rounded-xl"
          >
            <span>Inbox</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Accepted Collaborations List */}
      <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
            <Handshake className="w-4 h-4 text-emerald-600" />
            <span>Active Partner Deals ({collaborations.length})</span>
          </div>
        </div>

        <div className="divide-y divide-zinc-100">
          {collaborations.length > 0 ? (
            collaborations.map((app) => {
              const allocated = app.requestedSpots || 10
              const claimed = app.claimedSpots || 0
              const isCompleted = claimed >= allocated || app.status === "completed"

              return (
                <div key={app.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-sm font-bold text-zinc-900">
                        {app.applicantName || app.representedCommunityName || "Partner DAO"}
                      </h3>
                      <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                        ✓ {allocated} Spots Granted
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Campaign: <span className="text-zinc-800 font-medium">{app.campaignTitle}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs shrink-0 flex-wrap">
                    {isCompleted ? (
                      <span className="px-3 py-1 text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Wallets Submitted ({claimed}/{allocated})</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-xl flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                        <span>Awaiting CM Sheet</span>
                      </span>
                    )}

                    <button
                      onClick={() => handleOpenSheet(app)}
                      className="px-3.5 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 rounded-xl cursor-pointer shadow-2xs"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Inspect CM Sheet</span>
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="py-12 text-center space-y-2">
              <Handshake className="w-8 h-8 text-zinc-300 mx-auto" />
              <p className="text-sm font-semibold text-zinc-700">No approved collaborations yet</p>
              <p className="text-xs text-zinc-400">
                Review pending applications in your Inbox to accept community spot requests.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Wallet Sheet Viewer Dialog */}
      <WalletSubmissionSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        collaboration={selectedCollab}
      />

      {/* Unified Master Sheet Viewer Modal */}
      <MasterWalletSheetModal
        isOpen={isMasterModalOpen}
        onClose={() => setIsMasterModalOpen(false)}
        campaignTitle={collaborations[0]?.campaignTitle || "Project Campaign"}
        ecosystem={collaborations[0]?.ecosystem || "Solana"}
        entries={masterEntries}
      />
    </div>
  )
}

