"use client"

import React, { useState } from "react"
import Link from "next/link"

export type MenuCategory = "projects" | "communities" | "managers" | null

export interface MegaMenuItem {
  id: string
  title: string
  description: string
  href: string
  badge?: string
}

export interface CategoryData {
  heading: string
  caption: string
  items: MegaMenuItem[]
  highlight: {
    title: string
    description: string
    cta: string
    href: string
  }
}

// Sleek SVG Icon renderer replacing emojis
function ItemIcon({ id }: { id: string }) {
  const iconClasses = "w-4 h-4 text-zinc-800 group-hover:text-black transition-colors"

  switch (id) {
    case "spot-allocation":
      return (
        <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      )
    case "verification":
      return (
        <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    case "anti-sybil":
      return (
        <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    case "campaign":
      return (
        <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    case "portal":
      return (
        <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      )
    case "sync":
      return (
        <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    case "giveaway":
      return (
        <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 13C10.832 19.877 8 17.062 8 13.5V12h8v1.5c0 3.562-2.832 6.377-4 7.5z" />
        </svg>
      )
    case "analytics":
      return (
        <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    case "public-profile":
      return (
        <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    case "unified-inbox":
      return (
        <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    case "proof-of-work":
      return (
        <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    default:
      return (
        <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
  }
}

export const menuData: Record<"projects" | "communities" | "managers", CategoryData> = {
  projects: {
    heading: "For Web3 Projects & DAOs",
    caption: "Streamline your partner outreach and whitelist spot distribution",
    items: [
      {
        id: "spot-allocation",
        title: "Spot Allocation Engine",
        description: "Automate whitelist spot distribution across 500+ partner communities seamlessly.",
        href: "/#features",
        badge: "Popular",
      },
      {
        id: "verification",
        title: "Community Verification",
        description: "Verify authentic Collab Managers and eliminate fake DM impersonators.",
        href: "/#features",
      },
      {
        id: "anti-sybil",
        title: "Anti-Sybil Analytics",
        description: "Track wallet allocations and prevent duplicate bot spot claims.",
        href: "/#features",
      },
      {
        id: "campaign",
        title: "Campaign Management",
        description: "Launch co-marketing campaigns with automated winner tracking.",
        href: "/#features",
      },
    ],
    highlight: {
      title: "Launch a Campaign",
      description: "Get your project in front of top verified Web3 communities instantly.",
      cta: "Create Project",
      href: "/create-account",
    },
  },
  communities: {
    heading: "For NFT & Crypto Communities",
    caption: "Empower your members with exclusive whitelist access",
    items: [
      {
        id: "portal",
        title: "Application Portal",
        description: "Receive structured collaboration requests from top Web3 projects.",
        href: "/#features",
      },
      {
        id: "sync",
        title: "Discord & Twitter Sync",
        description: "Automate role assignment and giveaway announcements in your server.",
        href: "/#features",
        badge: "Automated",
      },
      {
        id: "giveaway",
        title: "Member Giveaway Hub",
        description: "Fair, transparent raffles for your community members without spreadsheets.",
        href: "/#features",
      },
      {
        id: "analytics",
        title: "Community Analytics",
        description: "Monitor member engagement and collaboration claim rates.",
        href: "/#features",
      },
    ],
    highlight: {
      title: "Onboard Your Community",
      description: "Set up your community portal in less than 2 minutes.",
      cta: "Get Started",
      href: "/create-account",
    },
  },
  managers: {
    heading: "For Collab Managers (CMs)",
    caption: "Build your reputation and manage all your collabs in one inbox",
    items: [
      {
        id: "public-profile",
        title: "Public CM Profile Page",
        description: "Share your dedicated @username landing page for direct collab requests.",
        href: "/collabmanager",
        badge: "New",
      },
      {
        id: "unified-inbox",
        title: "Unified Collab Inbox",
        description: "Say goodbye to chaotic Twitter & Discord DMs. Track all requests in one place.",
        href: "/#features",
      },
      {
        id: "proof-of-work",
        title: "Proof-of-Work Score",
        description: "Build a verified track record of successful collaborations and spot fills.",
        href: "/#features",
      },
      {
        id: "multi-community",
        title: "Multi-Community Hub",
        description: "Manage multiple projects and communities under a single login.",
        href: "/#features",
      },
    ],
    highlight: {
      title: "Claim Your @Username",
      description: "Reserve your official Collab Manager profile link today.",
      cta: "Claim Handle",
      href: "/create-account",
    },
  },
}

interface MegaMenuProps {
  activeMenu: MenuCategory
  onMouseEnter: (category: MenuCategory) => void
  onMouseLeave: () => void
  onClose: () => void
}

export function MegaMenu({
  activeMenu,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: MegaMenuProps) {
  if (!activeMenu) return null

  const currentData = menuData[activeMenu]

  return (
    <div
      className="hidden md:block absolute left-0 right-0 top-full pt-3 px-4 max-w-6xl mx-auto z-50"
      onMouseEnter={() => onMouseEnter(activeMenu)}
      onMouseLeave={onMouseLeave}
    >
      <div className="bg-white border border-zinc-200/90 rounded-[2rem] shadow-2xl shadow-zinc-900/10 p-8 grid grid-cols-3 gap-8 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
        {/* Feature Grid (2 Columns) */}
        <div className="col-span-2 space-y-6">
          <div className="space-y-1 border-b border-zinc-100 pb-4">
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
              {currentData.heading}
            </h3>
            <p className="text-xs text-zinc-500 font-medium">
              {currentData.caption}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {currentData.items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="group p-4 rounded-2xl border border-zinc-100 hover:border-zinc-200/90 hover:bg-zinc-50/70 transition-all duration-200 flex items-start gap-3.5"
              >
                <div className="w-8 h-8 rounded-xl bg-zinc-100/80 group-hover:bg-zinc-200/60 flex items-center justify-center shrink-0 transition-colors">
                  <ItemIcon id={item.id} />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-900 group-hover:text-black truncate">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-900 text-white shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 font-normal">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Highlight Card (1 Column) */}
        <div className="bg-zinc-900 text-white rounded-2xl p-7 flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
              Featured
            </span>
            <h4 className="text-lg font-bold tracking-tight text-white leading-snug">
              {currentData.highlight.title}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              {currentData.highlight.description}
            </p>
          </div>

          <div className="relative z-10 pt-2">
            <Link
              href={currentData.highlight.href}
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-zinc-900 hover:bg-zinc-100 font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              <span>{currentData.highlight.cta}</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-zinc-800/50 blur-2xl pointer-events-none" />
        </div>
      </div>
    </div>
  )
}

// Collapsible Dropdown Accordion for Mobile Navigation
export function MobileAccordionMenu({ onClose }: { onClose: () => void }) {
  const [openCategory, setOpenCategory] = useState<MenuCategory>(null)

  const toggleCategory = (cat: MenuCategory) => {
    setOpenCategory(openCategory === cat ? null : cat)
  }

  const categories = [
    { key: "projects" as const, label: "For Projects" },
    { key: "communities" as const, label: "For Communities" },
    { key: "managers" as const, label: "For Collab Managers" },
  ]

  return (
    <div className="space-y-3">
      {categories.map(({ key, label }) => {
        const isOpen = openCategory === key
        const data = menuData[key]

        return (
          <div key={key} className="border border-zinc-100 rounded-2xl overflow-hidden bg-zinc-50/50">
            {/* Accordion Trigger Header */}
            <button
              type="button"
              onClick={() => toggleCategory(key)}
              className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-zinc-900 hover:bg-zinc-100/60 transition-colors"
            >
              <span>{label}</span>
              <svg
                className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-black" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Collapsible Content */}
            {isOpen && (
              <div className="p-4 pt-1 bg-white border-t border-zinc-100 space-y-3 animate-in fade-in duration-200">
                <p className="text-xs text-zinc-500 mb-2 font-medium">
                  {data.caption}
                </p>
                <div className="space-y-2">
                  {data.items.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-100 transition-all"
                    >
                      <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5">
                        <ItemIcon id={item.id} />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-zinc-900">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-zinc-900 text-white">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-snug">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
