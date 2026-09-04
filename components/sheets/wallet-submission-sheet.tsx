"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  X,
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Download,
  Copy,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react"
import { submitBulkWalletsAction } from "@/lib/db/actions"

interface WalletRow {
  walletAddress: string
  discordTag: string
  xHandle: string
}

interface WalletSubmissionSheetProps {
  isOpen: boolean
  onClose: () => void
  collaboration: any | null
  userWorkspaceId?: string
  onSuccess?: () => void
}

export function WalletSubmissionSheet({
  isOpen,
  onClose,
  collaboration,
  userWorkspaceId = "ws_alphaseekers",
  onSuccess,
}: WalletSubmissionSheetProps) {
  const [activeTab, setActiveTab] = useState<"grid" | "bulk">("grid")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const allocatedSpots = collaboration?.allocatedSpots || 10
  const isAlreadyCompleted = collaboration?.status === "completed" || (collaboration?.claimedSpots || 0) >= allocatedSpots

  // State for rows in interactive sheet
  const [rows, setRows] = useState<WalletRow[]>([])
  const [bulkText, setBulkText] = useState("")

  useEffect(() => {
    if (collaboration && isOpen) {
      // Pre-fill existing entries if any or initialize empty rows matching allocatedSpots
      const existing = collaboration.entries || []
      const initialRows: WalletRow[] = []

      for (let i = 0; i < allocatedSpots; i++) {
        if (existing[i]) {
          initialRows.push({
            walletAddress: existing[i].walletAddress || "",
            discordTag: existing[i].discordTag || "",
            xHandle: existing[i].xHandle || "",
          })
        } else {
          initialRows.push({ walletAddress: "", discordTag: "", xHandle: "" })
        }
      }
      setRows(initialRows)
      setBulkText(initialRows.map((r) => r.walletAddress).filter(Boolean).join("\n"))
    }
  }, [collaboration, isOpen, allocatedSpots])

  if (!isOpen || !collaboration) return null

  const handleRowChange = (index: number, field: keyof WalletRow, value: string) => {
    setRows((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleAddRow = () => {
    setRows((prev) => [...prev, { walletAddress: "", discordTag: "", xHandle: "" }])
  }

  const handleRemoveRow = (index: number) => {
    if (rows.length <= 1) return
    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  const handleParseBulkText = () => {
    const lines = bulkText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0)

    if (lines.length === 0) {
      toast.error("Please paste at least one wallet address in the bulk input area.")
      return
    }

    const newRows: WalletRow[] = lines.map((line) => {
      // Split CSV or space separated lines if applicable
      const parts = line.split(/[,;\t]+/).map((p) => p.trim())
      return {
        walletAddress: parts[0] || "",
        discordTag: parts[1] || "",
        xHandle: parts[2] || "",
      }
    })

    setRows(newRows)
    setActiveTab("grid")
    toast.success(`Parsed ${newRows.length} wallet rows into the sheet!`)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        setBulkText(content)
        const lines = content
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0)
        const newRows: WalletRow[] = lines.map((line) => {
          const parts = line.split(/[,;\t]+/).map((p) => p.trim())
          return {
            walletAddress: parts[0] || "",
            discordTag: parts[1] || "",
            xHandle: parts[2] || "",
          }
        })
        setRows(newRows)
        setActiveTab("grid")
        toast.success(`Loaded ${newRows.length} wallets from CSV file!`)
      }
    }
    reader.readAsText(file)
  }

  const validFilledCount = rows.filter((r) => r.walletAddress.trim().length > 10).length

  const handleSubmitWallets = async (e: React.FormEvent) => {
    e.preventDefault()

    const validWallets = rows.filter((r) => r.walletAddress.trim().length > 0)

    if (validWallets.length === 0) {
      toast.error("Please enter at least 1 valid wallet address.")
      return
    }

    setIsSubmitting(true)

    const res = await submitBulkWalletsAction({
      allocationId: collaboration.id,
      campaignId: collaboration.campaignId,
      communityWorkspaceId: userWorkspaceId,
      wallets: validWallets,
    })

    setIsSubmitting(false)

    if (res.success) {
      toast.success(`Successfully submitted ${validWallets.length} wallets! Deal fully completed.`)
      if (onSuccess) onSuccess()
      onClose()
    } else {
      toast.error(res.error || "Failed to submit wallet sheet.")
    }
  }

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + ["Wallet Address,Discord Tag,X Handle", ...rows.map((r) => `${r.walletAddress},${r.discordTag},${r.xHandle}`)].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${collaboration.projectName || "project"}_wallets.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Downloaded wallet sheet CSV!")
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

        {/* Sheet Dialog Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-zinc-200 z-10 overflow-hidden my-8"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white p-6 sm:p-7 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <FileSpreadsheet className="w-3 h-3 text-emerald-400" /> Platform Wallet Sheet
                </span>
                <span className="text-xs text-zinc-400 font-mono">/c/{collaboration.projectHandle}/{collaboration.campaignSlug}</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white leading-snug">
                Submit Member Wallets — {collaboration.projectName}
              </h2>
              <p className="text-xs text-zinc-400">
                Campaign: <span className="text-white font-medium">{collaboration.campaignTitle}</span> • {allocatedSpots} Spots Allocated
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="px-6 pt-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("grid")}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "grid"
                    ? "border-zinc-900 text-zinc-900 bg-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Interactive Grid Sheet ({rows.length} rows)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("bulk")}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "bulk"
                    ? "border-zinc-900 text-zinc-900 bg-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Bulk Paste / CSV Upload
              </button>
            </div>

            <div className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5 pb-2 sm:pb-0">
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                validFilledCount === allocatedSpots
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-amber-100 text-amber-800 border border-amber-200"
              }`}>
                {validFilledCount} / {allocatedSpots} Filled
              </span>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmitWallets} className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
            {/* Tab 1: Interactive Table Grid */}
            {activeTab === "grid" && (
              <div className="space-y-4">
                <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-zinc-100/80 border-b border-zinc-200 text-zinc-700 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3 w-12 text-center">#</th>
                        <th className="py-2.5 px-3">Wallet Address ({collaboration.ecosystem || "Solana"}) *</th>
                        <th className="py-2.5 px-3">Discord Tag</th>
                        <th className="py-2.5 px-3">X Handle</th>
                        <th className="py-2.5 px-3 w-10 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 bg-white">
                      {rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50/80 transition-colors">
                          <td className="py-2 px-3 text-center font-bold text-zinc-400 font-mono">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              required={idx < allocatedSpots}
                              value={row.walletAddress}
                              onChange={(e) => handleRowChange(idx, "walletAddress", e.target.value)}
                              placeholder="e.g. 7xKXtg2CW8... or 0x71C..."
                              disabled={isAlreadyCompleted}
                              className="w-full px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono font-medium focus:outline-none focus:border-zinc-900 focus:bg-white transition-all disabled:opacity-75"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.discordTag}
                              onChange={(e) => handleRowChange(idx, "discordTag", e.target.value)}
                              placeholder="username#0000"
                              disabled={isAlreadyCompleted}
                              className="w-full px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-medium focus:outline-none focus:border-zinc-900 focus:bg-white transition-all disabled:opacity-75"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.xHandle}
                              onChange={(e) => handleRowChange(idx, "xHandle", e.target.value)}
                              placeholder="@handle"
                              disabled={isAlreadyCompleted}
                              className="w-full px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-medium focus:outline-none focus:border-zinc-900 focus:bg-white transition-all disabled:opacity-75"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            {!isAlreadyCompleted && (
                              <button
                                type="button"
                                onClick={() => handleRemoveRow(idx)}
                                className="p-1 text-zinc-400 hover:text-rose-600 rounded cursor-pointer transition-colors"
                                title="Remove row"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {!isAlreadyCompleted && (
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleAddRow}
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Row</span>
                    </button>

                    <p className="text-xs text-zinc-400">
                      * Enter all allocated member wallets to finish the deal.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Bulk Paste / CSV Upload */}
            {activeTab === "bulk" && (
              <div className="space-y-5">
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wide">
                      Bulk Paste Wallets (One address per line or CSV)
                    </label>
                    <label className="px-3 py-1.5 bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-800 text-xs font-semibold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-zinc-600" />
                      <span>Upload .CSV File</span>
                      <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>

                  <textarea
                    rows={6}
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder={`Paste ${allocatedSpots} wallet addresses here...\nExample:\n7xKXtg2CW8..., user#1234, @handle\n0x71C839..., user#5678, @handle2`}
                    disabled={isAlreadyCompleted}
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-mono font-medium focus:outline-none focus:border-zinc-900 resize-none disabled:opacity-75"
                  />

                  {!isAlreadyCompleted && (
                    <button
                      type="button"
                      onClick={handleParseBulkText}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Parse & Fill Interactive Sheet Grid</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV Sheet</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 rounded-xl cursor-pointer"
                >
                  Close
                </button>

                {!isAlreadyCompleted ? (
                  <button
                    type="submit"
                    disabled={isSubmitting || validFilledCount === 0}
                    className="px-6 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    <span>Submit {validFilledCount} Wallets & Complete Deal</span>
                  </button>
                ) : (
                  <span className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Deal Fully Completed ✓
                  </span>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
