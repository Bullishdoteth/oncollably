"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Bell,
  Check,
  CheckCheck,
  Inbox,
  Handshake,
  Rocket,
  Wallet,
  Sparkles,
  ExternalLink,
  X,
  Radio,
} from "lucide-react"
import { useWorkspaceStore } from "@/lib/store/use-workspace-store"

interface NotificationItem {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  link: string | null
  createdAt: string
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isLive, setIsLive] = useState(false)

  const { dbWorkspaces, activeSpace } = useWorkspaceStore()
  const currentWorkspace = dbWorkspaces.find((w) => w.type === activeSpace) || dbWorkspaces[0]
  const workspaceId = currentWorkspace?.id

  const fetchNotifications = async () => {
    try {
      const url = workspaceId ? `/api/notifications?workspaceId=${workspaceId}` : `/api/notifications`
      const res = await fetch(url)
      const data = await res.json()
      if (data?.notifications) {
        setNotifications(data.notifications)
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err)
    }
  }

  // Real-time SSE / WebSocket Stream Connection
  useEffect(() => {
    fetchNotifications()

    if (typeof window === "undefined" || !window.EventSource) return

    const streamUrl = workspaceId
      ? `/api/notifications/stream?workspaceId=${workspaceId}`
      : `/api/notifications/stream`

    const eventSource = new EventSource(streamUrl)

    eventSource.onopen = () => {
      setIsLive(true)
    }

    eventSource.onmessage = (event) => {
      try {
        const notif: NotificationItem = JSON.parse(event.data)
        if (notif && notif.id) {
          setNotifications((prev) => [notif, ...prev.filter((n) => n.id !== notif.id)])
          toast.info(notif.title, {
            description: notif.message,
            duration: 5000,
          })
        }
      } catch {
        // Ignore heartbeats
      }
    }

    eventSource.onerror = () => {
      setIsLive(false)
    }

    return () => {
      eventSource.close()
    }
  }, [workspaceId])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      })
    } catch (err) {
      console.error("Failed to mark notification as read:", err)
    }
  }

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    if (!workspaceId) return
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, markAll: true }),
      })
    } catch (err) {
      console.error("Failed to mark all as read:", err)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "application":
        return <Inbox className="w-4 h-4 text-emerald-600" />
      case "allocation":
        return <Handshake className="w-4 h-4 text-indigo-600" />
      case "campaign":
        return <Rocket className="w-4 h-4 text-amber-600" />
      case "entry":
        return <Wallet className="w-4 h-4 text-blue-600" />
      default:
        return <Sparkles className="w-4 h-4 text-zinc-600" />
    }
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen((prev) => !prev)
          if (!isOpen) fetchNotifications()
        }}
        className="relative p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 stroke-[1.75]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse border-2 border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-zinc-200/90 shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-900">Notifications</h3>
                {isLive && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-500" />
                    Real-time
                  </span>
                )}
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 transition-colors flex items-start gap-3 ${
                      notif.read ? "bg-white" : "bg-emerald-50/30"
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-zinc-100 shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-zinc-900 truncate">
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                        {notif.message}
                      </p>

                      {notif.link && (
                        <Link
                          href={notif.link}
                          onClick={() => {
                            handleMarkAsRead(notif.id)
                            setIsOpen(false)
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-900 hover:underline pt-1"
                        >
                          <span>View Details</span>
                          <ExternalLink className="w-3 h-3 text-zinc-400" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center space-y-2">
                  <Bell className="w-7 h-7 text-zinc-300 mx-auto" />
                  <p className="text-xs font-semibold text-zinc-700">No notifications yet</p>
                  <p className="text-[11px] text-zinc-400">
                    Activity updates and campaign notifications will appear here.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
