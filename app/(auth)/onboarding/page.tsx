"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Rocket,
  Users,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Upload,
  ChevronRight
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

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedOptionId, setSelectedOptionId] = useState<string>("launch_campaign")

  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    discord: "",
    twitter: "",
    bio: "",
    selectedEcosystems: ["Ethereum", "Solana"] as string[],
  })

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

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Workspace setup complete! Redirecting to dashboard...")
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
                className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors bg-zinc-100 hover:bg-zinc-200/70 px-3.5 py-2 rounded-xl"
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
              {/* Logo / Avatar Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  Profile Logo / Avatar
                </label>
                <div className="border-2 border-dashed border-zinc-200 hover:border-zinc-400 transition-colors rounded-2xl p-6 text-center bg-zinc-50/50 flex flex-col items-center justify-center cursor-pointer group">
                  <Upload className="w-6 h-6 text-zinc-400 group-hover:text-zinc-900 transition-colors mb-2 stroke-[1.75]" />
                  <p className="text-xs font-semibold text-zinc-700">
                    Click to upload logo or drag and drop
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    PNG, JPG, or SVG (max 4MB)
                  </p>
                </div>
              </div>

              {/* Name & Handle Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Workspace / Profile Name"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                    Handle *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-semibold text-zinc-400 select-none">
                      oncollably.com/
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.handle}
                      onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                      placeholder="handle"
                      className="w-full pl-28 pr-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Social Connections */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  Community Links
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-zinc-400">
                      <XSocialIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      placeholder="Twitter / X handle (@name)"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Ecosystem Selection */}
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
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
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
                  className="w-full py-4 px-6 rounded-2xl bg-zinc-900 hover:bg-black text-white text-sm font-semibold tracking-tight shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {selectedOption.id === "launch_campaign"
                      ? "Pay $10 & Create Workspace"
                      : "Complete Setup & Enter Dashboard"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
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
