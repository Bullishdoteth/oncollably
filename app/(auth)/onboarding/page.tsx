"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Rocket,
  Users,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Upload,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  AtSign,
} from "lucide-react"
import { DiscordIcon, XSocialIcon } from "@/components/ui/icons"

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

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const [avatarUrl, setAvatarUrl] = useState("")

  const [handleStatus, setHandleStatus] = useState<"idle" | "checking" | "available" | "taken">("idle")
  const [handleError, setHandleError] = useState("")

  const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "https://oncollably.com")
  const cleanAppUrl = rawAppUrl.replace(/\/$/, "")

  // Projects use /c/handle as public channel for community/CM applications
  const isProject = selectedOptionId === "launch_campaign"
  const urlPrefix = isProject ? `${cleanAppUrl}/c/` : `${cleanAppUrl}/@`

  // Handle Polar Checkout Return Success URL (?status=success)
  useEffect(() => {
    const status = searchParams.get("status")
    if (status === "success") {
      toast.success("Payment verified! Your workspace has been activated.", {
        description: "Redirecting you to your project dashboard...",
      })
      const timeout = setTimeout(() => {
        router.push("/project")
      }, 1500)
      return () => clearTimeout(timeout)
    }
  }, [searchParams, router])

  // Auto-generate handle when name changes: translate spaces to hyphens (-)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    const slugifiedHandle = newName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]+/g, "")
      .replace(/\s+/g, "-")

    setFormData({
      ...formData,
      name: newName,
      handle: slugifiedHandle,
    })
  }

  // Check handle availability on server ONLY when user finishes typing (onBlur)
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
        setHandleError(data.reason || "This handle is already taken. Please choose a different workspace name.")
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

  // Instant optimistic logo preview + background upload to Cloudinary
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size limit", { description: "Please upload an image smaller than 5MB." })
      return
    }

    // 1. Immediately display image preview locally for fast UX
    const localPreview = URL.createObjectURL(file)
    setAvatarUrl(localPreview)

    // 2. Silently upload to Cloudinary in the background
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
        console.warn("Background Cloudinary upload warning, using local preview:", err)
      })
  }

  const selectedOption = CARDS.find((c) => c.id === selectedOptionId) || CARDS[0]

  const handleSelect = (option: CardOption) => {
    setSelectedOptionId(option.id)
    setStep(2)
  }

  const toggleEcosystem = (eco: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedEcosystems: prev.selectedEcosystems.includes(eco)
        ? prev.selectedEcosystems.filter((e) => e !== eco)
        : [...prev.selectedEcosystems, eco],
    }))
  }

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault()

    if (handleStatus === "taken") {
      toast.error("Handle Taken", {
        description: "Please choose an available workspace name before proceeding.",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          optionId: selectedOptionId,
          avatarUrl,
          ...formData,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to complete onboarding")
      }

      if (data.requiresPayment && data.checkoutUrl) {
        toast.info("Redirecting to Polar payment checkout...")
        window.location.href = data.checkoutUrl
        return
      }

      toast.success("Workspace setup complete! Redirecting to dashboard...")
      router.push(data.redirectUrl || `/${data.workspaceType || "project"}`)
    } catch (err: any) {
      console.error("Onboarding submission error:", err)
      toast.error("Onboarding Error", {
        description: err?.message || "Failed to save onboarding settings. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full py-4">
      {/* Header Stepper with generous spacing */}
      <div className="mb-16 max-w-lg mx-auto space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          <span className="flex items-center gap-2 text-zinc-900 font-bold">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-white text-[10px]">
              {step}
            </span>
            Step {step} of 2
          </span>
          <span>{step === 1 ? "Select Goal" : "Workspace Profile"}</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-zinc-900 rounded-full"
            initial={{ width: "50%" }}
            animate={{ width: step === 1 ? "50%" : "100%" }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {/* 3 Cards Grid - Full Width & Spacious */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 w-full">
              {CARDS.map((card) => {
                const Icon = card.icon

                return (
                  <div
                    key={card.id}
                    onClick={() => handleSelect(card)}
                    className="group relative p-9 sm:p-11 rounded-3xl bg-white border border-zinc-200 hover:border-zinc-900 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 min-h-[320px]"
                  >
                    <div className="space-y-8">
                      {/* Row 1: Tag Badge */}
                      <div>
                        <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200/80 tracking-wide">
                          {card.tag}
                        </span>
                      </div>

                      {/* Row 2: Icon + Title */}
                      <div className="flex items-center gap-4">
                        <Icon className="w-9 h-9 text-zinc-900 shrink-0 stroke-[1.75]" />
                        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight leading-snug">
                          {card.title}
                        </h2>
                      </div>

                      {/* Row 3: Description */}
                      <p className="text-base text-zinc-500 leading-relaxed font-normal">
                        {card.subtitle}
                      </p>
                    </div>

                    {/* Subtle Bottom Action Bar */}
                    <div className="pt-10 flex items-center justify-between text-xs font-semibold text-zinc-900 group-hover:text-black">
                      <span>Select option</span>
                      <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="max-w-xl mx-auto space-y-8"
          >
            {/* Header & Back Button */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors bg-zinc-100 hover:bg-zinc-200/70 px-3.5 py-2 rounded-xl cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to step 1
              </button>

              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
                {selectedOption.tag}
              </span>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                Configure your {selectedOption.tag.replace("For ", "")} profile
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Provide basic details to complete your workspace setup.
              </p>
            </div>

            {/* Form Container */}
            <form onSubmit={handleComplete} className="space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-xs">
              {/* Logo / Avatar Upload via Cloudinary */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  Profile Logo / Avatar
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />

                {avatarUrl ? (
                  <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={avatarUrl}
                        alt="Workspace Logo"
                        className="w-14 h-14 rounded-xl object-cover border border-zinc-300 shadow-xs"
                      />
                      <div>
                        <div className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Logo Selected
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Ready for workspace setup
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-white border border-zinc-300 text-zinc-800 text-xs font-semibold hover:bg-zinc-100 transition-colors cursor-pointer"
                    >
                      Change Logo
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-200 hover:border-zinc-400 transition-colors rounded-2xl p-6 text-center bg-zinc-50/50 flex flex-col items-center justify-center cursor-pointer group"
                  >
                    <Upload className="w-6 h-6 text-zinc-400 group-hover:text-zinc-900 transition-colors mb-2 stroke-[1.75]" />
                    <p className="text-xs font-semibold text-zinc-700">
                      Click to upload logo or drag and drop
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      PNG, JPG, SVG, or WebP (max 5MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Name & Handle Grid */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleNameChange}
                      onBlur={handleNameBlur}
                      placeholder="Workspace / Profile Name"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                        Handle (Read Only) *
                      </label>
                      {handleStatus === "checking" && (
                        <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin text-zinc-600" />
                          Checking...
                        </span>
                      )}
                      {handleStatus === "available" && (
                        <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Available
                        </span>
                      )}
                      {handleStatus === "taken" && (
                        <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          Taken
                        </span>
                      )}
                    </div>

                    <input
                      type="text"
                      required
                      readOnly
                      value={formData.handle}
                      placeholder="auto-generated-handle"
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-mono font-medium transition-all bg-zinc-50/80 cursor-not-allowed select-none ${
                        handleStatus === "taken"
                          ? "border-rose-300 text-rose-900 bg-rose-50/40"
                          : handleStatus === "available"
                          ? "border-emerald-300 text-zinc-900"
                          : "border-zinc-200 text-zinc-700"
                      }`}
                    />
                  </div>
                </div>

                {/* Dedicated Fully-Visible Handle URL Display Banner */}
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs flex items-center gap-2 overflow-x-auto">
                  <Globe className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="text-zinc-500 font-semibold shrink-0">Live Public URL:</span>
                  <span className="font-mono text-zinc-900 font-bold break-all">
                    {urlPrefix}{formData.handle || "your-handle"}
                  </span>
                </div>

                {/* Handle Notification Banner if Taken */}
                {handleStatus === "taken" && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{handleError}</span>
                  </div>
                )}
              </div>

              {/* Social Connections & Website Links */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  Verification & Social Links
                </label>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* X (Twitter) Username Input */}
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 text-zinc-400 font-semibold text-xs select-none flex items-center gap-1">
                        <XSocialIcon className="w-3.5 h-3.5" />
                        <span>@</span>
                      </div>
                      <input
                        type="text"
                        value={formData.twitter}
                        onChange={(e) => {
                          const cleanVal = e.target.value.replace(/^https?:\/\/(x|twitter)\.com\//, "").replace(/^@/, "").trim()
                          setFormData({ ...formData, twitter: cleanVal })
                        }}
                        placeholder="Username"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all bg-white"
                      />
                    </div>

                    {/* Discord Server Invite / Handle */}
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 text-zinc-400">
                        <DiscordIcon className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={formData.discord}
                        onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                        placeholder="Discord Server Invite / Handle"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all bg-white"
                      />
                    </div>
                  </div>

                  {/* Personal / Project Website Link */}
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-zinc-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="Official Website (e.g. https://cybersamurai.io)"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Ecosystem Selection - Only for Projects */}
              {selectedOption.id === "launch_campaign" && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                    Primary Ecosystems
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ECOSYSTEMS.map((eco) => {
                      const isSelected = formData.selectedEcosystems.includes(eco)
                      return (
                        <button
                          key={eco}
                          type="button"
                          onClick={() => toggleEcosystem(eco)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                            isSelected
                              ? "bg-zinc-900 text-white border-zinc-900"
                              : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
                          }`}
                        >
                          {isSelected ? "✓ " : "+ "}
                          {eco}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Short bio or description..."
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all bg-white"
                />
              </div>

              {/* One-Time Creation Fee Summary */}
              {selectedOption.id === "launch_campaign" && (
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-zinc-900">
                      Project Creation Fee
                    </div>
                    <p className="text-xs text-zinc-500">
                      One-time payment to verify authenticity & launch campaigns
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xl font-bold text-zinc-900">$10</span>
                    <span className="text-xs text-zinc-400 block font-normal">one-time</span>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting || handleStatus === "taken"}
                  className="w-full py-4 px-6 rounded-2xl bg-zinc-900 hover:bg-black text-white text-sm font-semibold tracking-tight shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <>
                      <span>
                        {selectedOption.id === "launch_campaign"
                          ? "Pay $10 & Create Workspace"
                          : "Complete Setup & Enter Dashboard"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-zinc-400">
                  {selectedOption.id === "launch_campaign"
                    ? "One-time access fee. No recurring monthly subscription."
                    : "You can update your workspace info anytime in Account Settings."}
                </p>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-zinc-400">Loading onboarding...</div>}>
      <OnboardingContent />
    </Suspense>
  )
}
