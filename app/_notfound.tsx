"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Home,
  Search,
  Sparkles,
  ShieldCheck,
  Users,
  Compass,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  Layers,
} from "lucide-react"
import { toast } from "sonner"

const QUICK_DESTINATIONS = [
  {
    title: "Explore Collabs & Projects",
    description: "Browse verified Web3 projects allocating whitelist spots & partnerships.",
    href: "/c",
    icon: Layers,
    badge: "Popular",
    color: "from-blue-500/10 to-indigo-500/10 border-blue-200/50 hover:border-blue-400",
    iconBg: "bg-blue-50 text-blue-600",
  },
  {
    title: "Verified Communities",
    description: "Connect with alpha DAOs, Discord hubs, and Web3 communities.",
    href: "/community",
    icon: Users,
    badge: "Verified",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-200/50 hover:border-emerald-400",
    iconBg: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Collab Managers Directory",
    description: "Find trusted collab managers with proven track records & analytics.",
    href: "/create-account",
    icon: ShieldCheck,
    badge: "Featured",
    color: "from-amber-500/10 to-orange-500/10 border-amber-200/50 hover:border-amber-400",
    iconBg: "bg-amber-50 text-amber-600",
  },
  {
    title: "Platform Overview",
    description: "Learn how Oncollably streamlines whitelist allocations & partnership tracking.",
    href: "/",
    icon: Compass,
    badge: "Info",
    color: "from-purple-500/10 to-pink-500/10 border-purple-200/50 hover:border-purple-400",
    iconBg: "bg-purple-50 text-purple-600",
  },
]

export default function NotFoundPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [copied, setCopied] = useState(false)

  const filteredDestinations = QUICK_DESTINATIONS.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCopyTrace = () => {
    const traceInfo = `Error 404: Route Not Found on Oncollably\nTimestamp: ${new Date().toISOString()}\nUserAgent: ${typeof window !== "undefined" ? window.navigator.userAgent : "N/A"}`
    navigator.clipboard.writeText(traceInfo)
    setCopied(true)
    toast.success("Error trace copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = "/"
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-100 selection:text-zinc-900 flex flex-col justify-between overflow-x-hidden relative">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-zinc-200/40 via-zinc-100/60 to-transparent blur-3xl rounded-full opacity-70" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-gradient-to-br from-indigo-100/30 to-purple-100/20 blur-3xl rounded-full" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-to-bl from-amber-100/30 to-rose-100/20 blur-3xl rounded-full" />
      </div>

      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center">
        {/* Hero 404 Visual Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative flex items-center justify-center my-2 select-none"
        >
          {/* Big Stylized 404 Text */}
          <h1 className="text-8xl sm:text-9xl md:text-[13rem] font-black tracking-tighter text-zinc-100 leading-none drop-shadow-xs">
            404
          </h1>

          {/* Overlay Dynamic Card */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="bg-white/90 backdrop-blur-md border border-zinc-200/90 shadow-xl rounded-2xl p-4 sm:p-5 flex items-center gap-4 max-w-xs sm:max-w-sm text-left transform -rotate-1">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 leading-snug">
                  Target destination missing
                </h3>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Title & Description */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center max-w-xl mx-auto space-y-3 mt-4"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Looks like this page hasn&apos;t been mined yet.
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 leading-relaxed">
            The page, project campaign, or collaboration link you are searching for doesn&apos;t exist, was moved, or requires specific permissions.
          </p>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-8"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-black text-white font-medium text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-98"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <button
            type="button"
            onClick={handleGoBack}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700 font-medium text-sm rounded-full shadow-xs transition-all duration-200 cursor-pointer active:scale-98"
          >
            <RotateCcw className="w-4 h-4 text-zinc-500" />
            <span>Go Back</span>
          </button>

          <button
            type="button"
            onClick={handleCopyTrace}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-zinc-100 hover:bg-zinc-200/80 text-zinc-600 hover:text-zinc-900 font-medium text-xs rounded-full transition-all duration-200 cursor-pointer"
            title="Copy technical debug info"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? "Copied" : "Copy Trace"}</span>
          </button>
        </motion.div>

        {/* Quick Search & Destination Hub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-3xl mt-14 pt-10 border-t border-zinc-100"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">
                Where would you like to go?
              </h3>
              <p className="text-xs text-zinc-500">
                Navigate directly to top sections of the Oncollably platform.
              </p>
            </div>

            {/* Live Quick Filter Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200/80 rounded-full text-xs text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:border-zinc-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Destination Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredDestinations.map((dest) => {
                const IconComponent = dest.icon
                return (
                  <motion.div
                    key={dest.title}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={dest.href}
                      className={`group block p-4 rounded-2xl bg-gradient-to-br border shadow-xs hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between ${dest.color}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className={`p-2.5 rounded-xl ${dest.iconBg} transition-transform group-hover:scale-105`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/80 border border-zinc-200/60 text-zinc-600">
                          {dest.badge}
                        </span>
                      </div>

                      <div className="mt-4 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-sm text-zinc-900 group-hover:text-black">
                          <span>{dest.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          {dest.description}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {filteredDestinations.length === 0 && (
            <div className="text-center py-8 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
              <p className="text-xs text-zinc-500 font-medium">
                No matching destinations found for &quot;{searchQuery}&quot;
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-2 text-xs font-semibold text-zinc-900 hover:underline cursor-pointer"
              >
                Clear search filter
              </button>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}