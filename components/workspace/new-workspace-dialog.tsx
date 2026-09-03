"use client"

import { useState } from "react"
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
  Loader2,
  Globe,
  AtSign,
  Plus,
} from "lucide-react"
import { DiscordIcon, XSocialIcon } from "@/components/ui/icons"
import { useWorkspaceStore } from "@/lib/store/use-workspace-store"

interface CardOption {
  id: string
  tag: string
  title: string
  subtitle: string
  icon: any
}

const CARDS: CardOption[] = [
  {
    id: "launch_campaign",
    tag: "For Projects",
    title: "Launch Campaign",
    subtitle: "Launch giveaway campaigns, verify community entries, and allocate whitelist spots automatically.",
    icon: Rocket,
  },
  {
    id: "connect_community",
    tag: "For Communities",
    title: "Community",
    subtitle: "Connect your Discord server or DAO to request and receive guaranteed whitelist allocations for your members.",
    icon: Users,
  },
  {
    id: "manage_collaborations",
    tag: "For Collab Managers",
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
  const { isNewWorkspaceDialogOpen, setIsNewWorkspaceDialogOpen, selectWorkspace } = useWorkspaceStore()

  const [step, setStep] = useState<1 | 2>(1)
  const [selectedOptionId, setSelectedOptionId] = useState<string>("launch_campaign")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    discord: "",
    twitter: "",
    website: "",
    bio: "",
    selectedEcosystems: ["Ethereum", "Solana"] as string[],
  })

  const resetForm = () => {
    setStep(1)
    setSelectedOptionId("launch_campaign")
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
    if (isSubmitting) return

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
          selectedEcosystems: formData.selectedEcosystems,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to create workspace")
      }

      if (data.requiresPayment && data.checkoutUrl) {
        toast.success("Workspace initialized! Redirecting to checkout...")
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
                  {step === 1 ? "Choose your workspace purpose" : "Configure workspace details"}
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
                                <span
                                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                    isSelected
                                      ? "bg-zinc-800 text-zinc-300"
                                      : "bg-zinc-100 text-zinc-600"
                                  }`}
                                >
                                  {card.tag}
                                </span>

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

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white font-medium text-sm rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      <span>Continue to Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateWorkspace} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-zinc-800">
                      Workspace Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Web3 Project"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        onChange={(e) =>
                          setFormData({ ...formData, handle: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "") })
                        }
                        className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:border-zinc-900 transition-colors"
                      />
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

                  {/* Socials */}
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
                      disabled={isSubmitting || !formData.name || !formData.handle}
                      className="flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-zinc-800 text-white font-medium text-sm rounded-xl shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Creating Workspace...</span>
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
