"use client"

import React, { useState } from "react"
import { Zap, CheckCircle2, RefreshCw, Lock, ExternalLink } from "lucide-react"
import { DiscordIcon, XSocialIcon } from "@/components/ui/icons"
import { toast } from "sonner"

interface Integration {
  id: string
  name: string
  description: string
  status: "Connected" | "Not Configured"
  icon: any
}

export default function ProjectIntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "discord",
      name: "Discord Bot & Webhook",
      description: "Automatically grant Discord roles to accepted whitelist winners.",
      status: "Connected",
      icon: DiscordIcon,
    },
    {
      id: "twitter",
      name: "X (Twitter) Verification API",
      description: "Verify follow, retweet, and like requirements for giveaway entries.",
      status: "Connected",
      icon: XSocialIcon,
    },
    {
      id: "solana_wallet",
      name: "Solana / EVM Wallet Verifier",
      description: "Check holder balances and prevent Sybil bot submissions.",
      status: "Connected",
      icon: Zap,
    },
  ])

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus = item.status === "Connected" ? "Not Configured" : "Connected"
          toast.success(`${item.name} status updated to ${newStatus}`)
          return { ...item, status: newStatus }
        }
        return item
      })
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
              Project Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Integrations & API Webhooks
          </h1>
          <p className="text-sm text-zinc-500 font-normal">
            Connect Discord bots, X API verification, and automated wallet verification tools.
          </p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {integrations.map((item) => {
          const Icon = item.icon
          const isConnected = item.status === "Connected"

          return (
            <div
              key={item.id}
              className="p-8 rounded-3xl bg-white border border-zinc-200/80 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      isConnected
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-zinc-100 text-zinc-600 border-zinc-200"
                    }`}
                  >
                    {isConnected ? "✓ Active" : "Disconnected"}
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-900 tracking-tight">
                  {item.name}
                </h3>

                <p className="text-xs text-zinc-500 font-normal leading-relaxed">
                  {item.description}
                </p>
              </div>

              <button
                onClick={() => toggleIntegration(item.id)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isConnected
                    ? "bg-zinc-100 hover:bg-zinc-200/80 text-zinc-900"
                    : "bg-zinc-900 hover:bg-black text-white"
                }`}
              >
                {isConnected ? "Configure Webhook" : "Connect Integration"}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
