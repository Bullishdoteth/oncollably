"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  X,
  FileSpreadsheet,
  Download,
  Search,
  Users,
  CheckCircle2,
  Filter,
  Copy,
  Layers,
} from "lucide-react"

interface MasterEntry {
  id: string
  walletAddress: string
  discordTag?: string
  xHandle?: string
  communityName: string
  cmHandle?: string
  submittedAt: string | Date
}

interface MasterWalletSheetModalProps {
  isOpen: boolean
  onClose: () => void
  campaignTitle: string
  ecosystem?: string
  entries: MasterEntry[]
}

export function MasterWalletSheetModal({
  isOpen,
  onClose,
  campaignTitle,
  ecosystem = "Solana",
  entries = [],
}: MasterWalletSheetModalProps) {
  const [activeTab, setActiveTab] = useState<"master" | "by_cm">("master")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCommunity, setSelectedCommunity] = useState<string>("all")

  if (!isOpen) return null

  // Extract unique communities
  const communities = Array.from(new Set(entries.map((e) => e.communityName))).filter(Boolean)

  // Filter entries based on search and selected community
  const filteredEntries = entries.filter((item) => {
    const matchesSearch =
      item.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.discordTag && item.discordTag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.xHandle && item.xHandle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.communityName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCommunity = selectedCommunity === "all" || item.communityName === selectedCommunity

    return matchesSearch && matchesCommunity
  })

  // Export Master CSV
  const handleExportMasterCSV = () => {
    if (entries.length === 0) {
      toast.error("No submitted wallets to export.")
      return
    }

    const csvLines = [
      "Wallet Address,Community Partner,CM Handle,Discord Tag,X Handle,Submission Date",
      ...filteredEntries.map((e) =>
        `"${e.walletAddress}","${e.communityName}","${e.cmHandle || ""}","${e.discordTag || ""}","${e.xHandle || ""}","${new Date(e.submittedAt).toLocaleDateString()}"`
      ),
    ]

    const csvContent = "data:text/csv;charset=utf-8," + csvLines.join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${campaignTitle.replace(/\s+/g, "_")}_Master_Wallets.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Exported ${filteredEntries.length} wallets to Master CSV!`)
  }

  const copyAllWallets = () => {
    const addresses = filteredEntries.map((e) => e.walletAddress).join("\n")
    navigator.clipboard.writeText(addresses)
    toast.success(`Copied ${filteredEntries.length} wallet addresses to clipboard!`)
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
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-zinc-200 z-10 overflow-hidden my-8"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white p-6 sm:p-7 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <FileSpreadsheet className="w-3 h-3 text-emerald-400" /> Unified Master Sheet
                </span>
                <span className="text-xs text-zinc-400 font-mono">{ecosystem} Network</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white leading-snug">
                Master Wallet Sheet — {campaignTitle}
              </h2>
              <p className="text-xs text-zinc-400">
                Combined member wallet entries across all accepted CM partner allocations.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="p-4 bg-zinc-50 border-b border-zinc-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white border border-zinc-200 rounded-xl space-y-0.5">
              <span className="text-zinc-400 font-medium block text-[10px] uppercase">Total Combined Wallets</span>
              <span className="text-lg font-extrabold text-zinc-900">{entries.length}</span>
            </div>
            <div className="p-3 bg-white border border-zinc-200 rounded-xl space-y-0.5">
              <span className="text-zinc-400 font-medium block text-[10px] uppercase">CM Partners Submitted</span>
              <span className="text-lg font-extrabold text-emerald-600">{communities.length}</span>
            </div>
            <div className="p-3 bg-white border border-zinc-200 rounded-xl space-y-0.5">
              <span className="text-zinc-400 font-medium block text-[10px] uppercase">Filtered Entries</span>
              <span className="text-lg font-extrabold text-indigo-600">{filteredEntries.length}</span>
            </div>
            <div className="p-3 bg-white border border-zinc-200 rounded-xl space-y-0.5">
              <span className="text-zinc-400 font-medium block text-[10px] uppercase">Export Format</span>
              <span className="text-xs font-bold text-zinc-800">CSV / Raw Text</span>
            </div>
          </div>

          {/* Controls Bar: Search & Community Filter */}
          <div className="p-4 bg-white border-b border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search wallet, tag, or partner..."
                  className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-zinc-900"
                />
              </div>

              {communities.length > 0 && (
                <div className="relative shrink-0">
                  <select
                    value={selectedCommunity}
                    onChange={(e) => setSelectedCommunity(e.target.value)}
                    className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:outline-none focus:border-zinc-900"
                  >
                    <option value="all">All CM Partners ({communities.length})</option>
                    {communities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={copyAllWallets}
                className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Addresses</span>
              </button>

              <button
                type="button"
                onClick={handleExportMasterCSV}
                className="px-4 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Master CSV</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="p-6 max-h-[50vh] overflow-y-auto">
            {filteredEntries.length > 0 ? (
              <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-100/80 border-b border-zinc-200 text-zinc-700 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3 w-12 text-center">#</th>
                      <th className="py-2.5 px-3">Wallet Address</th>
                      <th className="py-2.5 px-3">CM / Community Partner</th>
                      <th className="py-2.5 px-3">Discord Tag</th>
                      <th className="py-2.5 px-3">X Handle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 bg-white">
                    {filteredEntries.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-2.5 px-3 text-center font-bold text-zinc-400 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-medium text-zinc-900">
                          {item.walletAddress}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-zinc-900">{item.communityName}</span>
                            {item.cmHandle && (
                              <span className="text-[10px] font-mono text-zinc-400">({item.cmHandle})</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-zinc-600 font-medium">
                          {item.discordTag || "—"}
                        </td>
                        <td className="py-2.5 px-3 text-zinc-600 font-medium">
                          {item.xHandle || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <FileSpreadsheet className="w-8 h-8 text-zinc-300 mx-auto" />
                <p className="text-sm font-semibold text-zinc-700">No matching submitted wallets found</p>
                <p className="text-xs text-zinc-400">
                  Accepted CM partners will submit their member wallet sheets here.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
