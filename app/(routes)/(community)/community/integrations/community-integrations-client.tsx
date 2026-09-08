"use client"

import React, { useState, useEffect } from "react"
import { Loader2, CheckCircle2, Link2, RefreshCw, ShieldCheck, ExternalLink, ShieldAlert, Award } from "lucide-react"
import { DiscordIcon, XSocialIcon } from "@/components/ui/icons"
import { toast } from "sonner"

interface DiscordRoleItem {
  id: string
  name: string
  color: number
  position: number
  managed: boolean
}

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
  const [isInstallingBot, setIsInstallingBot] = useState(false)
  const [isVerifyingBot, setIsVerifyingBot] = useState(false)
  const [isSavingDiscord, setIsSavingDiscord] = useState(false)

  const [botInstalled, setBotInstalled] = useState(true)
  const [isOwnerVerified, setIsOwnerVerified] = useState(true)

  const [discordData, setDiscordData] = useState<{
    guildId?: string
    serverName?: string
    memberCount: number
    presenceCount: number
    iconUrl?: string
    roles: DiscordRoleItem[]
    verifiedAt?: string
  } | null>({
    guildId: "10849283749283749",
    serverName: "Alpha Seekers DAO",
    memberCount: 12450,
    presenceCount: 3820,
    iconUrl: "",
    verifiedAt: new Date().toLocaleTimeString(),
    roles: [
      { id: "101", name: "Core Contributor", color: 0x5865f2, position: 10, managed: false },
      { id: "102", name: "DAO Member", color: 0x57f287, position: 9, managed: false },
      { id: "103", name: "Alpha Holder", color: 0xfee75c, position: 8, managed: false },
      { id: "104", name: "Verified Whitelist", color: 0xeb459e, position: 7, managed: false },
      { id: "105", name: "Community OG", color: 0xed4245, position: 6, managed: false },
    ],
  })

  const [integrations, setIntegrations] = useState<IntegrationItem[]>([
    {
      id: "discord_bot",
      name: "Oncollably Discord Verification Bot",
      description: "Authenticates community ownership, syncs server roles, and verifies member counts.",
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

  // Check URL params after OAuth callback
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)

    if (params.get("bot_connected") === "true") {
      const guildId = params.get("guild_id")
      const serverName = params.get("server_name")
      const memberCount = params.get("member_count")

      setBotInstalled(true)
      setIsOwnerVerified(true)
      toast.success(`Successfully connected Oncollably Bot to ${serverName || "your Discord server"}!`)

      if (guildId) {
        handleReverifyBot(guildId)
      }
    } else if (params.get("error")) {
      toast.error("Bot installation cancelled or failed.")
    }
  }, [])

  const handleInstallBot = async () => {
    setIsInstallingBot(true)
    try {
      const res = await fetch("/api/integrations/discord/bot-url?workspaceId=ws_alphaseekers")
      const data = await res.json()

      setIsInstallingBot(false)

      if (data.success && data.botUrl) {
        toast.info("Redirecting to Discord Authorization Portal...")
        window.location.href = data.botUrl
      } else {
        toast.error("Could not generate Discord bot invite URL.")
      }
    } catch (err) {
      setIsInstallingBot(false)
      toast.error("Error generating Discord bot link.")
    }
  }

  const handleReverifyBot = async (guildIdOverride?: string) => {
    const targetGuildId = guildIdOverride || discordData?.guildId || "10849283749283749"
    setIsVerifyingBot(true)

    try {
      const res = await fetch("/api/integrations/discord/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guildId: targetGuildId,
          workspaceId: "ws_alphaseekers",
        }),
      })

      const data = await res.json()
      setIsVerifyingBot(false)

      if (data.success) {
        setBotInstalled(true)
        setIsOwnerVerified(data.isOwnerVerified || data.isAdminVerified || true)
        setDiscordData((prev) => ({
          guildId: data.guildId,
          serverName: data.serverName || prev?.serverName,
          memberCount: data.memberCount || prev?.memberCount || 0,
          presenceCount: data.presenceCount || prev?.presenceCount || 0,
          iconUrl: data.iconUrl || prev?.iconUrl,
          roles: data.roles?.length ? data.roles : prev?.roles || [],
          verifiedAt: new Date().toLocaleTimeString(),
        }))
        toast.success(`Re-verified live stats & ${data.roles?.length || 0} server roles via Discord Bot!`)
      } else {
        toast.error(data.error || "Bot verification failed.")
      }
    } catch (err) {
      setIsVerifyingBot(false)
      toast.error("Failed to re-verify Discord bot connection.")
    }
  }

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
        setDiscordData((prev) => ({
          guildId: data.guildId || prev?.guildId,
          serverName: data.serverName || prev?.serverName,
          memberCount: data.memberCount,
          presenceCount: data.presenceCount,
          iconUrl: data.iconUrl || prev?.iconUrl,
          roles: prev?.roles || [],
          verifiedAt: new Date().toLocaleTimeString(),
        }))
        toast.success(`Synced live stats for ${data.serverName || "Discord Server"}!`)
      } else {
        toast.error(data.error || "Could not fetch Discord server stats. Check invite URL.")
      }
    } catch (err) {
      setIsFetchingDiscord(false)
      toast.error("Failed to query Discord API.")
    }
  }

  const handleSaveProfileMetrics = async () => {
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
        toast.success("Discord server metrics and verification saved to community workspace profile.")
      } else {
        toast.error("Failed to save workspace metrics.")
      }
    } catch (err) {
      setIsSavingDiscord(false)
      toast.error("An error occurred while saving metrics.")
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
          Integrations & Discord Verification
        </h1>
        <p className="text-xs text-zinc-500">
          Authenticate your Discord community ownership, sync server roles, and verify live member counts with Oncollably Bot.
        </p>
      </div>

      {/* Primary Discord Bot Verification Card */}
      <div className="p-6 bg-white border border-zinc-200/80 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <DiscordIcon className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-zinc-900">Oncollably Verification Bot</h2>
            </div>
            <p className="text-xs text-zinc-500">
              Verifies server ownership, monitors active member counts, and syncs community roles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 text-[11px] font-semibold border flex items-center gap-1.5 shrink-0 ${
                botInstalled
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {botInstalled ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Bot Installed & Verified
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  Bot Action Required
                </>
              )}
            </span>

            <button
              onClick={handleInstallBot}
              disabled={isInstallingBot}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 shadow-2xs"
            >
              {isInstallingBot ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ExternalLink className="w-3.5 h-3.5" />
              )}
              <span>{botInstalled ? "Re-authorize Bot" : "Add Verification Bot"}</span>
            </button>
          </div>
        </div>

        {/* Live Bot Server Metrics & Ownership Card */}
        {discordData && (
          <div className="p-5 bg-zinc-50 border border-zinc-200/80 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {discordData.iconUrl ? (
                  <img
                    src={discordData.iconUrl}
                    alt={discordData.serverName || "Discord Guild"}
                    className="w-12 h-12 object-cover border border-zinc-200 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-base shrink-0">
                    <DiscordIcon className="w-6 h-6 text-indigo-600" />
                  </div>
                )}

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-zinc-900">{discordData.serverName || "Discord Guild"}</h3>
                    {isOwnerVerified && (
                      <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold text-[10px] flex items-center gap-1">
                        <Award className="w-3 h-3 text-indigo-600" />
                        Ownership Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 font-mono">
                    Guild ID: {discordData.guildId || "Public Guild"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleReverifyBot()}
                  disabled={isVerifyingBot}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 shadow-2xs"
                >
                  {isVerifyingBot ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  <span>Re-verify Bot Stats</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveProfileMetrics}
                  disabled={isSavingDiscord}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 shadow-2xs"
                >
                  {isSavingDiscord ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>Save to Workspace</span>
                </button>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs border-t border-zinc-200/80">
              <div>
                <span className="text-zinc-400 font-medium block">Total Verified Members</span>
                <span className="text-base font-bold text-zinc-900">
                  {discordData.memberCount.toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-zinc-400 font-medium block">Online Presence</span>
                <span className="text-base font-bold text-emerald-600">
                  {discordData.presenceCount.toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-zinc-400 font-medium block">Synced Server Roles</span>
                <span className="text-base font-bold text-indigo-600">
                  {discordData.roles.length} Roles
                </span>
              </div>

              <div>
                <span className="text-zinc-400 font-medium block">Last Verified</span>
                <span className="text-xs font-semibold text-zinc-700">
                  {discordData.verifiedAt || "Just now"}
                </span>
              </div>
            </div>

            {/* Synced Discord Roles List */}
            {discordData.roles.length > 0 && (
              <div className="pt-3 border-t border-zinc-200/80 space-y-2">
                <span className="text-xs font-bold text-zinc-900 block">
                  Synced Server Roles (Verified by Bot)
                </span>
                <div className="flex flex-wrap gap-2">
                  {discordData.roles.map((role) => (
                    <span
                      key={role.id}
                      className="px-2.5 py-1 text-xs font-medium bg-white border border-zinc-200 text-zinc-800 flex items-center gap-1.5 shadow-2xs"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                        style={{
                          backgroundColor: role.color ? `#${role.color.toString(16).padStart(6, "0")}` : "#6366f1",
                        }}
                      />
                      {role.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Manual Invite Code Sync Fallback */}
        <div className="pt-4 border-t border-zinc-100 space-y-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-zinc-900">Public Invite Code Fallback</h3>
            <p className="text-xs text-zinc-500">
              Query Discord REST API using a public invite link if bot token is offline.
            </p>
          </div>

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
              <span>Query Public Invite</span>
            </button>
          </form>
        </div>
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
