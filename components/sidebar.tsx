"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { authClient, useSession, signOut } from "@/lib/auth/auth-client"
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
  ShieldCheck,
} from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { useWorkspaceStore } from "@/lib/store/use-workspace-store"
import { NewWorkspaceDialog } from "@/components/workspace/new-workspace-dialog"

type WorkspaceType = "project" | "community" | "cm"

interface NavItem {
  label: string
  href: string
  icon: any
}

const WORKSPACE_CONFIG: Record<
  WorkspaceType,
  {
    roleLabel: string
    icon: any
    nav: NavItem[]
  }
> = {
  project: {
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
    roleLabel: "Community Hub",
    icon: ShieldCheck,
    nav: [
      { label: "Dashboard", href: "/community", icon: LayoutDashboard },
      { label: "Project Campaigns", href: "/community/campaigns", icon: Compass },
      { label: "Applications Sent", href: "/community/applications", icon: Send },
      { label: "Collaborations", href: "/community/collaborations", icon: Handshake },
      { label: "Community Reps", href: "/community/representatives", icon: Users },
      { label: "History Log", href: "/community/history", icon: History },
      { label: "Integrations", href: "/community/integrations", icon: Zap },
      { label: "Settings", href: "/community/settings", icon: Settings },
    ],
  },
  cm: {
    roleLabel: "Collab Manager",
    icon: Briefcase,
    nav: [
      { label: "Dashboard", href: "/cm", icon: LayoutDashboard },
      { label: "Portfolio", href: "/cm/portfolio", icon: FolderGit2 },
      { label: "Applications", href: "/cm/applications", icon: Send },
      { label: "Deals", href: "/cm/collaborations", icon: Handshake },
      { label: "Communities", href: "/cm/communities", icon: Globe },
      { label: "Opportunities", href: "/cm/opportunities", icon: Rocket },
      { label: "Settings", href: "/cm/settings", icon: Settings },
    ],
  },
}

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  // Zustand Store Integration
  const dbWorkspaces = useWorkspaceStore((s) => s.dbWorkspaces)
  const setDbWorkspaces = useWorkspaceStore((s) => s.setDbWorkspaces)
  const isMobileOpen = useWorkspaceStore((s) => s.isMobileOpen)
  const setIsMobileOpen = useWorkspaceStore((s) => s.setIsMobileOpen)
  const isWorkspaceMenuOpen = useWorkspaceStore((s) => s.isWorkspaceMenuOpen)
  const setIsWorkspaceMenuOpen = useWorkspaceStore((s) => s.setIsWorkspaceMenuOpen)
  const selectWorkspace = useWorkspaceStore((s) => s.selectWorkspace)
  const openNewWorkspaceModal = useWorkspaceStore((s) => s.openNewWorkspaceModal)

  useEffect(() => {
    if (dbWorkspaces.length === 0) {
      fetch("/api/workspaces")
        .then((res) => res.json())
        .then((data) => {
          if (data?.workspaces) {
            setDbWorkspaces(data.workspaces)
          }
        })
        .catch(() => {})
    }
  }, [dbWorkspaces.length, setDbWorkspaces])

  // Determine active workspace type based on current path
  const getActiveWorkspaceType = (): WorkspaceType => {
    if (pathname.startsWith("/community")) return "community"
    if (pathname.startsWith("/cm")) return "cm"
    return "project"
  }

  const activeSpace = getActiveWorkspaceType()
  const spaceConfig = WORKSPACE_CONFIG[activeSpace]

  // Find active workspace details from DB
  const currentDbWorkspace = dbWorkspaces.find((w) => w.type === activeSpace) || dbWorkspaces[0]
  const activeWorkspaceName = currentDbWorkspace?.name || spaceConfig.roleLabel
  const activeWorkspaceHandle = currentDbWorkspace?.handle || null
  const activeWorkspaceAvatar = (currentDbWorkspace as any)?.avatarUrl || (currentDbWorkspace as any)?.image || null

  const handleSignOut = async () => {
    await signOut()
    window.location.href = "/sign-in"
  }

  const userName = session?.user?.name || "User Account"
  const userEmail = session?.user?.email || "user@oncollably.com"
  const userImage = session?.user?.image
  const initial = userName ? userName.charAt(0).toUpperCase() : "U"

  return (
    <>
      {/* Mobile Bar Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-zinc-100 px-6 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <Logo className="h-6 w-auto" />
          <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase border border-zinc-200 px-1.5 py-0.5 rounded-none">
            {spaceConfig.roleLabel}
          </span>
        </div>

        <button
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="p-2 text-zinc-600 hover:text-zinc-900 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-xs z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 shrink-0 bg-white border-r border-zinc-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:h-screen lg:sticky lg:top-0 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header & Branding */}
        <div>
          <div className="p-6 pb-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <Logo className="h-7 w-auto transition-transform group-hover:scale-[1.02]" />
            </Link>

            <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-none">
              Beta
            </span>
          </div>

          {/* Active Workspace Selector */}
          <div className="px-5 py-2 relative">
            <button
              onClick={() => setIsWorkspaceMenuOpen((prev) => !prev)}
              className="w-full flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-100/60 transition-all text-left group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {activeWorkspaceAvatar ? (
                  <img
                    src={activeWorkspaceAvatar}
                    alt={activeWorkspaceName}
                    className="w-8 h-8 object-cover border border-zinc-200/80 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {activeWorkspaceName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-bold text-zinc-900 truncate">
                    {activeWorkspaceName}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-medium truncate">
                    {activeWorkspaceHandle ? `@${activeWorkspaceHandle}` : spaceConfig.roleLabel}
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-transform ${isWorkspaceMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Live Workspace Switcher Dropdown */}
            <AnimatePresence>
              {isWorkspaceMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-5 right-5 top-22 bg-white border border-zinc-200/80 shadow-xl p-2 z-50 space-y-1"
                >
                  <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Active Workspaces
                  </div>

                  {dbWorkspaces.length > 0 ? (
                    dbWorkspaces.map((ws: any) => {
                      const wsPath = ws.type === "community" ? "/community" : ws.type === "cm" ? "/cm" : "/project"
                      const isSelected = activeSpace === ws.type

                      return (
                        <Link
                          key={ws.id}
                          href={wsPath}
                          onClick={() => {
                            selectWorkspace(ws.type, ws.handle)
                          }}
                          className={`flex items-center justify-between p-2.5 text-xs font-medium transition-all ${
                            isSelected
                              ? "bg-zinc-900 text-white font-semibold"
                              : "text-zinc-700 hover:bg-zinc-100/70"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {ws.avatarUrl ? (
                              <img
                                src={ws.avatarUrl}
                                alt={ws.name}
                                className="w-5 h-5 object-cover border border-zinc-200/60 shrink-0"
                              />
                            ) : (
                              <Rocket className="w-4 h-4 shrink-0 stroke-[1.75]" />
                            )}
                            <div className="truncate min-w-0">
                              <div className="truncate font-semibold">{ws.name}</div>
                              <div className={`text-[10px] ${isSelected ? "text-zinc-300" : "text-zinc-400"}`}>
                                {ws.type.toUpperCase()} • @{ws.handle}
                              </div>
                            </div>
                          </div>
                        </Link>
                      )
                    })
                  ) : (
                    <>
                      <Link
                        href="/project"
                        onClick={() => {
                          setIsWorkspaceMenuOpen(false)
                          setIsMobileOpen(false)
                        }}
                        className={`flex items-center gap-3 p-2.5 text-xs font-medium transition-all ${
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
                        className={`flex items-center gap-3 p-2.5 text-xs font-medium transition-all ${
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
                        className={`flex items-center gap-3 p-2.5 text-xs font-medium transition-all ${
                          activeSpace === "cm"
                            ? "bg-zinc-900 text-white font-semibold"
                            : "text-zinc-700 hover:bg-zinc-100/70"
                        }`}
                      >
                        <Briefcase className="w-4 h-4 shrink-0 stroke-[1.75]" />
                        <span>Collab Manager</span>
                      </Link>
                    </>
                  )}

                  <div className="border-t border-zinc-100 pt-1 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsWorkspaceMenuOpen(false)
                        setIsMobileOpen(false)
                        openNewWorkspaceModal()
                      }}
                      className="w-full flex items-center gap-2.5 p-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer text-left"
                    >
                      <Plus className="w-4 h-4 text-zinc-600" />
                      <span>Create New Workspace</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
            <div className="px-3 pb-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
              Navigation
            </div>
            {spaceConfig.nav.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-zinc-900 text-white font-semibold shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 stroke-[1.75]" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-zinc-100">
            <div className="flex items-center justify-between gap-3 p-2 bg-zinc-50 border border-zinc-200/80">
              <div className="flex items-center gap-3 min-w-0">
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    className="w-8 h-8 object-cover border border-zinc-200 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {initial}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-bold text-zinc-900 truncate">
                    {userName}
                  </div>
                  <div className="text-[11px] font-medium text-zinc-400 truncate">
                    {userEmail}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 stroke-[1.75]" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Global New Workspace Creation Dialog */}
      <NewWorkspaceDialog />
    </>
  )
}
