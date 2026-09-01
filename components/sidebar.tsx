"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Rocket,
  Globe,
  Inbox,
  Handshake,
  Users,
  Zap,
  Settings,
  UserCheck,
  Send,
  History,
  Briefcase,
  FolderGit2,
  Compass,
  ChevronDown,
  Menu,
  X,
  Plus,
  LogOut,
  ShieldCheck
} from "lucide-react"
import { Logo } from "@/components/ui/logo"

type WorkspaceType = "project" | "community" | "cm"

interface NavItem {
  label: string
  href: string
  icon: any
}

const WORKSPACE_CONFIG: Record<
  WorkspaceType,
  {
    name: string
    roleLabel: string
    icon: any
    nav: NavItem[]
  }
> = {
  project: {
    name: "CyberSamurai NFT",
    roleLabel: "Project Workspace",
    icon: Rocket,
    nav: [
      { label: "Dashboard", href: "/project", icon: LayoutDashboard },
      { label: "Campaigns", href: "/project/campaigns", icon: Rocket },
      { label: "Partner Communities", href: "/project/communities", icon: Globe },
      { label: "Applications", href: "/project/applications", icon: Inbox },
      { label: "Collaborations", href: "/project/collaborations", icon: Handshake },
      { label: "Team Members", href: "/project/team", icon: Users },
      { label: "Integrations", href: "/project/integrations", icon: Zap },
      { label: "Settings", href: "/project/settings", icon: Settings },
    ],
  },
  community: {
    name: "Alpha Seekers DAO",
    roleLabel: "Community Hub",
    icon: ShieldCheck,
    nav: [
      { label: "Dashboard", href: "/community", icon: LayoutDashboard },
      { label: "Collaborations", href: "/community/collaborations", icon: Handshake },
      { label: "Browse Campaigns", href: "/community/campaigns", icon: Rocket },
      { label: "Representatives", href: "/community/representatives", icon: UserCheck },
      { label: "Applications", href: "/community/applications", icon: Send },
      { label: "Allocation History", href: "/community/history", icon: History },
      { label: "Integrations", href: "/community/integrations", icon: Zap },
      { label: "Settings", href: "/community/settings", icon: Settings },
    ],
  },
  cm: {
    name: "Alex (Apex CM)",
    roleLabel: "Collab Manager",
    icon: Briefcase,
    nav: [
      { label: "Dashboard", href: "/cm", icon: LayoutDashboard },
      { label: "Applications", href: "/cm/applications", icon: Send },
      { label: "Collaborations", href: "/cm/collaborations", icon: Handshake },
      { label: "Manager Portfolio", href: "/cm/portfolio", icon: FolderGit2 },
      { label: "Network Communities", href: "/cm/communities", icon: Users },
      { label: "Opportunities", href: "/cm/opportunities", icon: Compass },
      { label: "Settings", href: "/cm/settings", icon: Settings },
    ],
  },
}

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false)

  // Determine current active space based on path prefix
  const activeSpace: WorkspaceType = pathname.startsWith("/community")
    ? "community"
    : pathname.startsWith("/cm")
    ? "cm"
    : "project"

  const currentWorkspace = WORKSPACE_CONFIG[activeSpace]

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-zinc-100 px-6 flex items-center justify-between z-40">
        <Logo />
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-xs z-40"
        />
      )}

      {/* Sidebar Desktop & Mobile Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 z-50 w-72 h-screen bg-white border-r border-zinc-100 flex flex-col justify-between transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          {/* Minimal Header Logo */}
          <div className="px-6 py-6 border-b border-zinc-100 flex items-center justify-between">
            <Logo />
          </div>

          {/* Workspace Switcher */}
          <div className="p-5 relative">
            <button
              type="button"
              onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
              className="w-full p-3.5 rounded-2xl bg-zinc-50/80 hover:bg-zinc-100/80 border border-zinc-200/60 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0">
                  <currentWorkspace.icon className="w-4 h-4 stroke-[1.75]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-zinc-900 truncate">
                    {currentWorkspace.name}
                  </div>
                  <div className="text-[11px] font-medium text-zinc-400 truncate">
                    {currentWorkspace.roleLabel}
                  </div>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-transform ${
                  isWorkspaceMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Workspace Switcher Dropdown */}
            <AnimatePresence>
              {isWorkspaceMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-5 right-5 top-22 bg-white border border-zinc-200/80 rounded-2xl shadow-xl p-2 z-50 space-y-1"
                >
                  <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Switch Space
                  </div>

                  <Link
                    href="/project"
                    onClick={() => {
                      setIsWorkspaceMenuOpen(false)
                      setIsMobileOpen(false)
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium transition-all ${
                      activeSpace === "project"
                        ? "bg-zinc-900 text-white font-semibold"
                        : "text-zinc-700 hover:bg-zinc-100/70"
                    }`}
                  >
                    <Rocket className="w-4 h-4 shrink-0 stroke-[1.75]" />
                    <span>Project Workspace</span>
                  </Link>

                  <Link
                    href="/community"
                    onClick={() => {
                      setIsWorkspaceMenuOpen(false)
                      setIsMobileOpen(false)
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium transition-all ${
                      activeSpace === "community"
                        ? "bg-zinc-900 text-white font-semibold"
                        : "text-zinc-700 hover:bg-zinc-100/70"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0 stroke-[1.75]" />
                    <span>Community Hub</span>
                  </Link>

                  <Link
                    href="/cm"
                    onClick={() => {
                      setIsWorkspaceMenuOpen(false)
                      setIsMobileOpen(false)
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium transition-all ${
                      activeSpace === "cm"
                        ? "bg-zinc-900 text-white font-semibold"
                        : "text-zinc-700 hover:bg-zinc-100/70"
                    }`}
                  >
                    <Briefcase className="w-4 h-4 shrink-0 stroke-[1.75]" />
                    <span>Collab Manager</span>
                  </Link>

                  <div className="pt-1 border-t border-zinc-100">
                    <Link
                      href="/onboarding"
                      onClick={() => {
                        setIsWorkspaceMenuOpen(false)
                        setIsMobileOpen(false)
                      }}
                      className="flex items-center gap-2 p-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Workspace</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-5 py-2 space-y-1.5 overflow-y-auto">
            {currentWorkspace.nav.map((item) => {
              const Icon = item.icon
              const isActive =
                item.href === `/${activeSpace}`
                  ? pathname === `/${activeSpace}`
                  : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`group flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-zinc-900 text-white shadow-xs"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/60"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 stroke-[1.75] ${
                      isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-900"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Minimal User Profile Footer */}
        <div className="p-5 border-t border-zinc-100 bg-white">
          <div className="p-3 rounded-2xl bg-zinc-50/80 border border-zinc-200/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                U
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-zinc-900 truncate">
                  User Account
                </div>
                <div className="text-[11px] font-medium text-zinc-400 truncate">
                  user@oncollably.com
                </div>
              </div>
            </div>

            <Link
              href="/sign-in"
              title="Sign Out"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors"
            >
              <LogOut className="w-4 h-4 stroke-[1.75]" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
