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
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false)

  // Auth session
  const { data: session } = useSession()
  const [dbWorkspaces, setDbWorkspaces] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/workspaces")
      .then((res) => res.json())
      .then((data) => {
        if (data?.workspaces) {
          setDbWorkspaces(data.workspaces)
        }
      })
      .catch(() => {})
  }, [])

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
  const activeWorkspaceAvatar = currentDbWorkspace?.avatarUrl || currentDbWorkspace?.image || null

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
        <Logo />
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
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

          {/* Live Workspace Switcher ("Workspace Swatch") */}
          <div className="p-5 relative">
            <button
              type="button"
              onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
              className="w-full p-3.5 bg-zinc-50/80 hover:bg-zinc-100/80 border border-zinc-200/60 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                {activeWorkspaceAvatar ? (
                  <img
                    src={activeWorkspaceAvatar}
                    alt={activeWorkspaceName}
                    className="w-8 h-8 object-cover border border-zinc-200 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 bg-zinc-900 text-white flex items-center justify-center shrink-0">
                    <spaceConfig.icon className="w-4 h-4 stroke-[1.75]" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-bold text-zinc-900 truncate">
                    {activeWorkspaceName}
                  </div>
                  <div className="text-[11px] font-medium text-zinc-400 truncate flex items-center gap-1">
                    <span>{spaceConfig.roleLabel}</span>
                    {activeWorkspaceHandle && (
                      <span className="text-[10px] text-zinc-400 font-mono">
                        @{activeWorkspaceHandle}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-transform ${
                  isWorkspaceMenuOpen ? "rotate-180" : ""
                }`}
              />
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
                    dbWorkspaces.map((ws) => {
                      const wsPath = ws.type === "community" ? "/community" : ws.type === "cm" ? "/cm" : "/project"
                      const isSelected = activeSpace === ws.type

                      return (
                        <Link
                          key={ws.id}
                          href={wsPath}
                          onClick={async () => {
                            setIsWorkspaceMenuOpen(false)
                            setIsMobileOpen(false)
                            try {
                              await fetch("/api/workspaces/select", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ workspaceType: ws.type, handle: ws.handle }),
                              })
                            } catch (e) {
                              console.error("Failed to set active workspace:", e)
                            }
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
                    <Link
                      href="/onboarding?mode=new_workspace"
                      onClick={() => {
                        setIsWorkspaceMenuOpen(false)
                        setIsMobileOpen(false)
                      }}
                      className="flex items-center gap-2.5 p-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-zinc-600" />
                      <span>Create New Workspace</span>
                    </Link>
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-zinc-900 text-white shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80"
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[1.75]" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-zinc-100">
          <div className="p-3 bg-zinc-50/80 border border-zinc-200/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
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
      </aside>
    </>
  )
}
