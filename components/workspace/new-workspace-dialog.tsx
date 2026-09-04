"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Rocket,
  Users,
  Briefcase,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  AtSign,
  Plus,
  Upload,
  CreditCard,
  Sparkles,
} from "lucide-react"
import { DiscordIcon, XSocialIcon } from "@/components/ui/icons"
import { useWorkspaceStore } from "@/lib/store/use-workspace-store"

interface CardOption {
  id: string
  tag: string
  priceTag: string
  title: string
  subtitle: string
  icon: any
}

const CARDS: CardOption[] = [
  {
    id: "launch_campaign",
    tag: "For Projects",
    priceTag: "$10 Access Pass",
    title: "Launch Campaign",
    subtitle: "Launch giveaway campaigns, verify community entries, and allocate whitelist spots automatically.",
    icon: Rocket,
  },
  {
    id: "connect_community",
    tag: "For Communities",
    priceTag: "Free",
    title: "Community Hub",
    subtitle: "Connect your Discord server or DAO to request and receive guaranteed whitelist allocations for your members.",
    icon: Users,
  },
  {
    id: "manage_collaborations",
    tag: "For Collab Managers",
    priceTag: "Free",
    title: "Collaborations",
    subtitle: "Manage multiple client project rosters, pitch alpha communities, and track deal flows in one unified hub.",
    icon: Briefcase,
  },
]

const ECOSYSTEMS = [
  "Ethereum",
  "Solana",
  "Arbitrum",
  "Base",
  "Polygon",
  "Bitcoin Ordinals",
]

export function NewWorkspaceDialog() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { isNewWorkspaceDialogOpen, setIsNewWorkspaceDialogOpen, selectWorkspace } = useWorkspaceStore()

  const [step, setStep] = useState<1 | 2>(1)
  const [selectedOptionId, setSelectedOptionId] = useState<string>("launch_campaign")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState("")

  const [handleStatus, setHandleStatus] = useState<"idle" | "checking" | "available" | "taken">("idle")
  const [handleError, setHandleError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    discord: "",
    twitter: "",
    website: "",
    bio: "",
    selectedEcosystems: ["Ethereum", "Solana"] as string[],
  })

  const isProject = selectedOptionId === "launch_campaign"

  const resetForm = () => {
    setStep(1)
    setSelectedOptionId("launch_campaign")
    setAvatarUrl("")
    setHandleStatus("idle")
    setHandleError("")
    setFormData({
      name: "",
      handle: "",
      discord: "",
      twitter: "",
      website: "",
      bio: "",
      selectedEcosystems: ["Ethereum", "Solana"],
    })
  }

  const handleClose = () => {
    setIsNewWorkspaceDialogOpen(false)
    resetForm()
  }

  // Auto-slugify handle from Workspace Name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    const slugifiedHandle = newName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]+/g, "")
      .replace(/\s+/g, "-")

    setFormData((prev) => ({
      ...prev,
      name: newName,
      handle: slugifiedHandle,
    }))
  }

  // Check handle availability on server
  const checkHandleAvailability = async (handleToCheck: string) => {
    if (!handleToCheck.trim()) {
      setHandleStatus("idle")
      setHandleError("")
      return
    }

    setHandleStatus("checking")
    try {
      const res = await fetch(`/api/workspaces/check-handle?handle=${encodeURIComponent(handleToCheck)}`)
      const data = await res.json()
      if (data.available) {
        setHandleStatus("available")
        setHandleError("")
      } else {
        setHandleStatus("taken")
        setHandleError(data.reason || "This handle is already taken. Please choose a different workspace handle.")
      }
    } catch (err) {
      console.error("Failed to check handle:", err)
      setHandleStatus("idle")
    }
  }

  const handleNameBlur = () => {
    if (formData.handle) {
      checkHandleAvailability(formData.handle)
    }
  }

  // Instant optimistic logo preview + upload
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size limit", { description: "Please upload an image smaller than 5MB." })
      return
    }

    // Local preview
    const localPreview = URL.createObjectURL(file)
    setAvatarUrl(localPreview)

    // Upload to server/Cloudinary
    const data = new FormData()
    data.append("file", file)

    fetch("/api/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.url) {
          setAvatarUrl(result.url)
        }
      })
      .catch((err) => {
        console.warn("Background upload warning:", err)
      })
  }

  const toggleEcosystem = (eco: string) => {
    setFormData((prev) => {
      const exists = prev.selectedEcosystems.includes(eco)
      if (exists) {
        if (prev.selectedEcosystems.length === 1) return prev
        return {
          ...prev,
          selectedEcosystems: prev.selectedEcosystems.filter((item) => item !== eco),
        }
      } else {
        return {
          ...prev,
          selectedEcosystems: [...prev.selectedEcosystems, eco],
        }
      }
    })
  }

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || handleStatus === "taken") return

    try {
      setIsSubmitting(true)
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          optionId: selectedOptionId,
          name: formData.name,
          handle: formData.handle,
          discord: formData.discord,
          twitter: formData.twitter,
          website: formData.website,
          bio: formData.bio,
          avatarUrl,
          selectedEcosystems: formData.selectedEcosystems,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to create workspace")
      }

      // $10 Project Access Pass (Polar Checkout required)
      if (data.requiresPayment && data.checkoutUrl) {
        toast.success("Workspace initialized!", {
          description: "Redirecting to checkout for $10 Project Access Pass...",
        })
        window.location.href = data.checkoutUrl
        return
      }

      // Free workspace created
      const newWorkspaceType = data.workspaceType || "project"
      const targetHandle = formData.handle?.trim() || `ws_${Date.now()}`

      await selectWorkspace(newWorkspaceType, targetHandle)
      toast.success("New workspace created successfully!")
      handleClose()
      router.push(`/${newWorkspaceType}`)
    } catch (err: any) {
      console.error("[NewWorkspaceDialog] Creation failed:", err)
      toast.error("Failed to create workspace", {
        description: err.message || "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isNewWorkspaceDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
          />

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleAvatarFileChange}
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden z-10 my-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Create New Workspace</h2>
                <p className="text-xs text-zinc-500">
                  {step === 1 ? "Choose your workspace purpose" : "Configure profile & workspace details"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {step === 1 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {CARDS.map((card) => {
                      const Icon = card.icon
                      const isSelected = selectedOptionId === card.id

                      return (
                        <div
                          key={card.id}
                          onClick={() => setSelectedOptionId(card.id)}
                          className={`group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "border-black bg-zinc-900 text-white shadow-md"
                              : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/60 text-zinc-900"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-2.5 rounded-lg shrink-0 ${
                                isSelected
                                  ? "bg-zinc-800 text-white border border-zinc-700"
                                  : "bg-zinc-100 text-zinc-800"
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>

                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                      isSelected
                                        ? "bg-zinc-800 text-zinc-300"
                                        : "bg-zinc-100 text-zinc-600"
                                    }`}
                                  >
                                    {card.tag}
                                  </span>

                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                      card.id === "launch_campaign"
                                        ? isSelected
                                          ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : isSelected
                                        ? "bg-zinc-800 text-zinc-300 border-zinc-700"
                                        : "bg-zinc-100 text-zinc-600 border-zinc-200"
                                    }`}
                                  >
                                    {card.priceTag}
                                  </span>
                                </div>

                                <div
                                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                    isSelected
                                      ? "border-white bg-white text-zinc-950"
                                      : "border-zinc-300 bg-transparent"
                                  }`}
                                >
                                  {isSelected && <CheckCircle2 className="w-4 h-4 fill-black text-white" />}
                                </div>
                              </div>

                              <h3 className="font-bold text-base leading-snug">{card.title}</h3>
                              <p
                                className={`text-xs leading-relaxed ${
                                  isSelected ? "text-zinc-300" : "text-zinc-500"
                                }`}
                              >
                                {card.subtitle}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-zinc-100">
                    <div className="text-xs text-zinc-500">
                      {isProject ? (
                        <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                          <CreditCard className="w-4 h-4 text-emerald-600" />
                          Requires $10 Project Access Pass checkout
                        </span>
                      ) : (
                        <span>Free instant workspace activation</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white font-medium text-sm rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      <span>Continue to Profile</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateWorkspace} className="space-y-4">
                  {/* Profile Avatar Upload */}
                  <div className="flex items-center gap-4 p-3 bg-zinc-50 border border-zinc-200 rounded-2xl">
                    <div className="relative">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Workspace Avatar"
                          className="w-14 h-14 rounded-xl object-cover border border-zinc-300 shadow-2xs"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-zinc-200 border border-zinc-300 flex items-center justify-center text-zinc-500">
                          <Upload className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-bold text-zinc-900">Workspace Logo / Avatar</div>
                      <p className="text-[11px] text-zinc-500">Upload a logo for your project or community profile.</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{avatarUrl ? "Change Logo" : "Upload Logo"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-zinc-800">
                        Workspace Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acme Web3 Project"
                        value={formData.name}
                        onChange={handleNameChange}
                        onBlur={handleNameBlur}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:border-zinc-900 transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-zinc-800">
                        Workspace Handle <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <AtSign className="w-4 h-4 absolute left-3.5 text-zinc-400" />
                        <input
                          type="text"
                          required
                          placeholder="acmenft"
                          value={formData.handle}
                          onChange={(e) => {
                            const newHandle = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "")
                            setFormData({ ...formData, handle: newHandle })
                            setHandleStatus("idle")
                          }}
                          onBlur={() => checkHandleAvailability(formData.handle)}
                          className={`w-full pl-9 pr-8 py-2.5 bg-white border rounded-xl text-sm font-medium focus:outline-none transition-colors ${
                            handleStatus === "taken"
                              ? "border-red-400 focus:border-red-500"
                              : handleStatus === "available"
                              ? "border-emerald-400 focus:border-emerald-500"
                              : "border-zinc-200 focus:border-zinc-900"
                          }`}
                        />
                        {handleStatus === "checking" && (
                          <Loader2 className="w-4 h-4 absolute right-3 animate-spin text-zinc-400" />
                        )}
                        {handleStatus === "available" && (
                          <CheckCircle2 className="w-4 h-4 absolute right-3 text-emerald-500" />
                        )}
                        {handleStatus === "taken" && (
                          <AlertCircle className="w-4 h-4 absolute right-3 text-red-500" />
                        )}
                      </div>
                      {handleError && (
                        <p className="text-[11px] font-medium text-red-600 leading-tight">{handleError}</p>
                      )}
                    </div>
                  </div>

                  {/* Ecosystems */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-800">Supported Ecosystems</label>
                    <div className="flex flex-wrap gap-2">
                      {ECOSYSTEMS.map((eco) => {
                        const isSelected = formData.selectedEcosystems.includes(eco)
                        return (
                          <button
                            type="button"
                            key={eco}
                            onClick={() => toggleEcosystem(eco)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                              isSelected
                                ? "bg-zinc-900 text-white border-zinc-900 shadow-2xs"
                                : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                            }`}
                          >
                            {eco}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-zinc-800">Workspace Bio / Pitch</label>
                    <textarea
                      rows={2}
                      placeholder="Short bio or description of your project or community..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-zinc-900 resize-none"
                    />
                  </div>

                  {/* Social Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                        <DiscordIcon className="w-3.5 h-3.5 text-indigo-500" />
                        Discord Server
                      </label>
                      <input
                        type="text"
                        placeholder="https://discord.gg/acme"
                        value={formData.discord}
                        onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-zinc-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                        <XSocialIcon className="w-3.5 h-3.5 text-zinc-900" />
                        X / Twitter Handle
                      </label>
                      <input
                        type="text"
                        placeholder="@acme_nft"
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      disabled={isSubmitting}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.name || !formData.handle || handleStatus === "taken"}
                      className={`flex items-center gap-2 px-6 py-2.5 text-white font-medium text-sm rounded-xl shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                        isProject ? "bg-emerald-700 hover:bg-emerald-800" : "bg-black hover:bg-zinc-800"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Processing...</span>
                        </>
                      ) : isProject ? (
                        <>
                          <CreditCard className="w-4 h-4 text-white" />
                          <span>Pay $10 & Activate Project</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 text-white" />
                          <span>Create Workspace</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
