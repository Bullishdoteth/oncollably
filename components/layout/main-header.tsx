"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { Sparkles, Radio } from "lucide-react"

export function MainHeader() {
  const pathname = usePathname()

  // Generate a clean page title based on current route
  const getPageTitle = () => {
    if (!pathname) return "Workspace Overview"
    if (pathname.includes("/community/collaborations")) return "Community Collaborations"
    if (pathname.includes("/community/campaigns")) return "Project Campaigns & Opportunities"
    if (pathname.includes("/community/applications")) return "Collab Applications & Whitelists"
    if (pathname.includes("/community/representatives")) return "Community Representatives Roster"
    if (pathname.includes("/community/integrations")) return "Discord & Social Integrations"
    if (pathname.includes("/community/settings")) return "Community Settings"
    if (pathname === "/community") return "Community Workspace Overview"
    
    if (pathname.includes("/project/applications")) return "Project Applications Inbox"
    if (pathname.includes("/project/campaigns")) return "Campaign Management"
    if (pathname.includes("/project/collaborations")) return "Active Partner Deals"
    if (pathname.includes("/project/communities")) return "Partner Communities Roster"
    if (pathname.includes("/project/team")) return "Team & Access Control"
    if (pathname.includes("/project/settings")) return "Project Workspace Settings"
    if (pathname === "/project") return "Project Dashboard Overview"
    
    if (pathname.includes("/cm/portfolio")) return "Work History & Verified Portfolio"
    if (pathname.includes("/cm/opportunities")) return "Collab Opportunities & Pitches"
    if (pathname.includes("/cm/applications")) return "Client Pitches & Requests"
    if (pathname.includes("/cm/collaborations")) return "Active CM Partnerships"
    if (pathname.includes("/cm/settings")) return "CM Profile & Workspace Settings"
    if (pathname === "/cm") return "Collab Manager Hub"

    return "OnCollably Workspace"
  }

  const getWorkspaceCategory = () => {
    if (!pathname) return "Workspace"
    if (pathname.startsWith("/project")) return "Project Lead"
    if (pathname.startsWith("/community")) return "Community Admin"
    if (pathname.startsWith("/cm")) return "Collab Manager"
    return "Workspace"
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 transition-all shadow-2xs">
      {/* Left: Page Title & Path */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-md">
              {getWorkspaceCategory()}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight truncate">
              {getPageTitle()}
            </h1>
          </div>
        </div>
      </div>

      {/* Right: Live Stream Status & Notification Center */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-semibold">
          <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
          <span>Live Notifications</span>
        </div>

        {/* Main Content Area Notification Center */}
        <div className="flex items-center gap-2 pl-3 border-l border-zinc-200/80">
          <NotificationCenter />
        </div>
      </div>
    </header>
  )
}
