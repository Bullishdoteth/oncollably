"use client"

import React, { useState, useRef } from "react"
import { toast } from "sonner"
import {
  Rocket,
  ShieldCheck,
  Save,
  Upload,
  Globe,
  Loader2,
  ExternalLink,
  CheckCircle2,
} from "lucide-react"
import { DiscordIcon, XSocialIcon } from "@/components/ui/icons"
import { updateWorkspaceSettingsAction } from "@/lib/db/actions"
import { verifyProjectWorkspace } from "@/services/verification"

interface ProjectSettingsClientProps {
  initialWorkspace: any
}

export function ProjectSettingsClient({ initialWorkspace }: ProjectSettingsClientProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [form, setForm] = useState({
    name: initialWorkspace?.name || "CyberSamurai NFT",
    handle: initialWorkspace?.handle || "cybersamurai",
    bio: initialWorkspace?.bio || "Gaming project building on Solana. Request whitelist spot allocations.",
    discord: initialWorkspace?.discord || "discord.gg/cybersamurai",
    twitter: initialWorkspace?.twitter || "@CyberSamuraiNFT",
    website: initialWorkspace?.website || "https://cybersamurai.io",
    ecosystems: initialWorkspace?.ecosystems || "Solana,Ethereum",
  })

  const [avatarUrl, setAvatarUrl] = useState(initialWorkspace?.avatarUrl || "")

  const verification = verifyProjectWorkspace({
    ...initialWorkspace,
    name: form.name,
    handle: form.handle,
    discord: form.discord,
    twitter: form.twitter,
    website: form.website,
    avatarUrl,
  })

  const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "https://oncollably.com")
  const publicChannelUrl = `${rawAppUrl.replace(/\/$/, "")}/c/${form.handle}`

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size limit", { description: "Please upload an image smaller than 5MB." })
      return
    }

    // 1. Immediately render local preview for fast UI
    const localPreview = URL.createObjectURL(file)
    setAvatarUrl(localPreview)
    toast.success("Logo updated! Click Save to apply changes.")

    // 2. Upload to Cloudinary in background
    const data = new FormData()
    data.append("file", file)
    fetch("/api/upload", { method: "POST", body: data })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.url) {
          setAvatarUrl(resData.url)
        }
      })
      .catch((err) => console.warn("Cloudinary upload fallback to local preview:", err))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const workspaceId = initialWorkspace?.id || "ws_cybersamurai"

    const res = await updateWorkspaceSettingsAction(workspaceId, {
      name: form.name,
      handle: form.handle,
      bio: form.bio,
      discord: form.discord,
      twitter: form.twitter,
      website: form.website,
      avatarUrl,
      ecosystems: form.ecosystems,
    })

    setIsSaving(false)

    if (res.success) {
      toast.success("Project settings updated successfully!")
    } else {
      toast.error(res.error || "Failed to update workspace settings")
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-6 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
              Project Workspace
            </span>
            {verification.isVerified ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Unverified
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Project Settings
          </h1>
          <p className="text-sm text-zinc-500 font-normal">
            Manage your project branding, public channel handle, and social connections.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Settings</span>
        </button>
      </div>

      {/* Public Channel Banner Info */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-black text-white border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Public Channel URL
          </div>
          <div className="text-sm font-mono font-semibold text-emerald-400 truncate">
            {publicChannelUrl}
          </div>
          <p className="text-xs text-zinc-400">
            Share this link with communities and collab managers to collect applications.
          </p>
        </div>
        <a
          href={publicChannelUrl}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 backdrop-blur-sm transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <span>View Channel</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-xs">
        {/* Avatar Upload */}
        <div className="space-y-3 border-b border-zinc-100 pb-6">
          <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
            Project Logo / Avatar
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarFileChange}
            className="hidden"
          />

          <div className="flex items-center gap-5">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Project Logo"
                className="w-20 h-20 rounded-2xl object-cover border border-zinc-300 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                {form.name.charAt(0)}
              </div>
            )}

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-900 text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-zinc-600" />
                <span>Upload New Logo</span>
              </button>
              <p className="text-[11px] text-zinc-400">
                Recommended 400x400 PNG or JPG (max 5MB).
              </p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Project Name"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
              Workspace Handle *
            </label>
            <input
              type="text"
              required
              value={form.handle}
              onChange={(e) => setForm({ ...form, handle: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "") })}
              placeholder="handle"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
            />
          </div>
        </div>

        {/* Social Connections */}
        <div className="space-y-4 border-t border-zinc-100 pt-6">
          <div className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
            Social & Verification Links
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-zinc-400">
                <XSocialIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={form.twitter}
                onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                placeholder="X / Twitter (@handle)"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
              />
            </div>

            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-zinc-400">
                <DiscordIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={form.discord}
                onChange={(e) => setForm({ ...form, discord: e.target.value })}
                placeholder="Discord Server Invite"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
              />
            </div>

            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-zinc-400">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="Official Website"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5 border-t border-zinc-100 pt-6">
          <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
            Project Bio & Description
          </label>
          <textarea
            rows={4}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Describe your project, roadmap, or whitelist terms..."
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
          />
        </div>

        {/* Action Bar */}
        <div className="border-t border-zinc-100 pt-6 flex items-center justify-between">
          <div className="text-xs text-zinc-400">
            Changes will update your live public channel immediately.
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Project Settings</span>
          </button>
        </div>
      </form>
    </div>
  )
}
