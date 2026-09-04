"use client"

import React, { useState } from "react"
import { Loader2, CheckCircle2, Link2, RefreshCw } from "lucide-react"
import { DiscordIcon, XSocialIcon } from "@/components/ui/icons"
import { toast } from "sonner"

interface IntegrationItem {
  id: string
  name: string
  description: string
  status: "Connected" | "Disconnected"
  icon: any
}

export function CommunityIntegrationsClient() {
  const [discordInviteUrl, setDiscordInviteUrl] = useState("https://discord.gg/alphaseekers")
  const [isFetchingDiscord, setIsFetchingDiscord] = useState(false)
  const [isSavingDiscord, setIsSavingDiscord] = useState(false)
  const [discordData, setDiscordData] = useState<{
    guildId?: string
    serverName?: string
    memberCount: number
    presenceCount: number
    iconUrl?: string
  } | null>({
    guildId: "10849283749283749",
    serverName: "Alpha Seekers DAO",
    memberCount: 12450,
    presenceCount: 3820,
    iconUrl: "",
  })

  const [integrations, setIntegrations] = useState<IntegrationItem[]>([
    {
      id: "discord_bot",
      name: "Discord Server & Live Member API",
      description: "Auto-sync live member counts, online presence, and Discord invite validation.",
      status: "Connected",
      icon: DiscordIcon,
    },
    {
      id: "x_verify",
      name: "X (Twitter) Verification API",
      description: "Verify follower handles and social requirement compliance for members.",
      status: "Connected",
      icon: XSocialIcon,
    },
    {
      id: "wallet_guard",
      name: "Web3 Sybil & Wallet Guard",
      description: "Verify cryptographic ownership proof and prevent multi-account claims.",
      status: "Connected",
      icon: Link2,
    },
  ])

  const handleFetchDiscordLive = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!discordInviteUrl.trim()) {
      toast.error("Please enter a Discord invite URL.")
      return
    }

    setIsFetchingDiscord(true)

    try {
      const res = await fetch(`/api/integrations/discord/stats?invite=${encodeURIComponent(discordInviteUrl)}`)
      const data = await res.json()

      setIsFetchingDiscord(false)

      if (data.success && data.memberCount > 0) {
        setDiscordData({
          guildId: data.guildId,
          serverName: data.serverName,
          memberCount: data.memberCount,
          presenceCount: data.presenceCount,
          iconUrl: data.iconUrl,
        })
        toast.success(`Synced live stats for ${data.serverName || "Discord Server"}!`)
      } else {
        toast.error(data.error || "Could not fetch Discord server stats. Check invite URL.")
      }
    } catch (err) {
      setIsFetchingDiscord(false)
      toast.error("Failed to query Discord API.")
    }
  }

  const handleLinkDiscordServer = async () => {
    setIsSavingDiscord(true)

    try {
      const res = await fetch("/api/metrics/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: "ws_alphaseekers",
          discordUrl: discordInviteUrl,
        }),
      })

      setIsSavingDiscord(false)

      if (res.ok) {
        toast.success("Discord server live metrics saved to workspace profile.")
      } else {
        toast.error("Failed to save workspace metrics.")
      }
    } catch (err) {
      setIsSavingDiscord(false)
      toast.error("An error occurred while linking Discord server.")
    }
  }

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === "Connected" ? "Disconnected" : "Connected"
          toast.success(`${item.name} set to ${nextStatus}`)
          return { ...item, status: nextStatus }
        }
        return item
      })
    )
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Header */}
      <div className="border-b border-zinc-200/80 pb-6 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
          Integrations & API Sync
        </h1>
        <p className="text-xs text-zinc-500">
          Link official Discord servers and API connectors to verify live community metrics.
        </p>
      </div>

      {/* Discord Live API Card */}
      <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <DiscordIcon className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-zinc-900">Discord Live API Integration</h2>
            </div>
            <p className="text-xs text-zinc-500">
              Fetch real-time member counts and online presence from Discord's REST API.
            </p>
          </div>

          <span className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 self-start sm:self-auto">
            ✓ Live API Ready
          </span>
        </div>

        {/* Form Input */}
        <form onSubmit={handleFetchDiscordLive} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={discordInviteUrl}
            onChange={(e) => setDiscordInviteUrl(e.target.value)}
            placeholder="https://discord.gg/alphaseekers"
            className="flex-1 px-3.5 py-2 bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
          />

          <button
            type="submit"
            disabled={isFetchingDiscord}
            className="px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isFetchingDiscord ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>Query Live Stats</span>
          </button>
        </form>

        {/* Live Discord Metrics Display */}
        {discordData && (
          <div className="p-4 bg-zinc-50 border border-zinc-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {discordData.iconUrl ? (
                  <img
                    src={discordData.iconUrl}
                    alt={discordData.serverName || "Discord Guild"}
                    className="w-10 h-10 object-cover border border-zinc-200 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                    <DiscordIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-bold text-zinc-900">{discordData.serverName || "Discord Guild"}</h3>
                  <p className="text-xs text-zinc-400 font-mono">Guild ID: {discordData.guildId || "Public Invite"}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLinkDiscordServer}
                disabled={isSavingDiscord}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 self-start sm:self-auto shadow-2xs"
              >
                {isSavingDiscord ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>Save to Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-zinc-200/60">
              <div>
                <span className="text-zinc-400 font-medium block">Total Members</span>
                <span className="text-base font-bold text-zinc-900">
                  {discordData.memberCount.toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-zinc-400 font-medium block">Online Now</span>
                <span className="text-base font-bold text-emerald-600">
                  {discordData.presenceCount.toLocaleString()}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <span className="text-zinc-400 font-medium block">Verification Source</span>
                <span className="text-xs font-semibold text-zinc-700">Discord REST API (v9)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Integration Services List */}
      <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-6">
        <h2 className="text-base font-bold text-zinc-900 border-b border-zinc-100 pb-3">
          Configured Services
        </h2>

        <div className="divide-y divide-zinc-100">
          {integrations.map((item) => {
            const Icon = item.icon
            const isConnected = item.status === "Connected"

            return (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-zinc-900">{item.name}</h3>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold border ${
                          isConnected
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-zinc-100 text-zinc-600 border-zinc-200"
                        }`}
                      >
                        {isConnected ? "Connected" : "Not Configured"}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 font-normal">{item.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleIntegration(item.id)}
                  className={`px-3 py-1.5 text-xs font-medium transition-all cursor-pointer shrink-0 ${
                    isConnected
                      ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
                      : "bg-zinc-900 hover:bg-black text-white"
                  }`}
                >
                  {isConnected ? "Configure" : "Connect"}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
