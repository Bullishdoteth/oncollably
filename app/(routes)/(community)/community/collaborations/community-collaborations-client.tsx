"use client"

import { useState } from "react"
import Link from "next/link"
import { Handshake, CheckCircle2, ArrowRight, ExternalLink, FileSpreadsheet, Clock, AlertCircle } from "lucide-react"
import { WalletSubmissionSheet } from "@/components/sheets/wallet-submission-sheet"
import { SheetCountdown } from "@/components/sheets/sheet-countdown"


interface CommunityCollaborationsClientProps {
  initialCollaborations: any[]
  userWorkspaceId?: string
}

export function CommunityCollaborationsClient({
  initialCollaborations = [],
  userWorkspaceId = "ws_alphaseekers",
}: CommunityCollaborationsClientProps) {
  const [collaborations, setCollaborations] = useState(initialCollaborations)
  const [selectedCollab, setSelectedCollab] = useState<any | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleOpenSheet = (collab: any) => {
    setSelectedCollab(collab)
    setIsSheetOpen(true)
  }

  const handleSheetSuccess = () => {
    if (selectedCollab) {
      setCollaborations((prev) =>
        prev.map((c) =>
          c.id === selectedCollab.id
            ? { ...c, status: "completed", claimedSpots: c.allocatedSpots || 10 }
            : c
        )
      )
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <Handshake className="w-3.5 h-3.5 text-emerald-600" />
              <span>Active Partner Deals</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Community Collaborations
          </h1>
          <p className="text-xs text-zinc-500 font-normal">
            Manage accepted project deals and submit member whitelist wallets directly inside the platform.
          </p>
        </div>

        <Link
          href="/community/campaigns"
          className="px-4 py-2 bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer rounded-xl"
        >
          <span>Find New Deals</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Collaborations Grid */}
      <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
            <Handshake className="w-4 h-4 text-emerald-600" />
            <span>Active Partner Deals ({collaborations.length})</span>
          </div>
        </div>

        <div className="divide-y divide-zinc-100">
          {collaborations.length > 0 ? (
            collaborations.map((collab) => {
              const claimed = collab.claimedSpots || 0
              const total = collab.allocatedSpots || 10
              const isCompleted = collab.status === "completed" || claimed >= total
              const percent = Math.min(100, Math.round((claimed / total) * 100))

              return (
                <div key={collab.id} className="py-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base font-bold text-zinc-900">{collab.projectName}</h3>
                        <span className="px-2.5 py-0.5 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                          ✓ {collab.allocatedSpots || 10} Spots Granted
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">/c/{collab.projectHandle}/{collab.campaignSlug}</span>
                      </div>
                      <p className="text-xs text-zinc-500 font-normal">
                        Campaign: <span className="text-zinc-800 font-bold">{collab.campaignTitle}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <SheetCountdown deadline={collab.deadline} isCompleted={isCompleted} />

                      {isCompleted ? (
                        <span className="px-3 py-1 text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Deal Completed ({claimed}/{total} Wallets)</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-xl flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                          <span>Action Required: Submit Wallets</span>
                        </span>
                      )}


                      <button
                        onClick={() => handleOpenSheet(collab)}
                        className={`px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 rounded-xl cursor-pointer shadow-2xs ${
                          isCompleted
                            ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-900"
                            : "bg-zinc-900 hover:bg-black text-white"
                        }`}
                      >
                        <FileSpreadsheet className={`w-3.5 h-3.5 ${isCompleted ? "text-zinc-600" : "text-emerald-400"}`} />
                        <span>{isCompleted ? "View Wallet Sheet" : "Submit Wallet Sheet"}</span>
                      </button>

                      <Link
                        href={`/c/${collab.projectHandle}/${collab.campaignSlug}`}
                        target="_blank"
                        className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all"
                        title="View Public Campaign Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Claims Progress Bar */}
                  <div className="p-4 bg-zinc-50 border border-zinc-100 space-y-2 rounded-xl">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-700">Wallet Sheet Status</span>
                      <span className="font-bold text-zinc-900">
                        {claimed} / {total} Wallets Submitted ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="py-12 text-center space-y-3">
              <Handshake className="w-8 h-8 text-zinc-300 mx-auto" />
              <p className="text-sm font-semibold text-zinc-700">No active collaborations yet</p>
              <p className="text-xs text-zinc-400">
                Submit requests to active project campaigns to get whitelist spots allocated to your DAO.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Wallet Submission Sheet Modal */}
      <WalletSubmissionSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        collaboration={selectedCollab}
        userWorkspaceId={userWorkspaceId}
        onSuccess={handleSheetSuccess}
      />
    </div>
  )
}
