"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { X, Send, MessageSquare, Loader2, User, Building2, UserCheck, ShieldCheck, Clock } from "lucide-react"
import { formatTimestamp, getRelativeTimeString } from "@/lib/utils/dates"

interface ApplicationDiscussionModalProps {
  isOpen: boolean
  onClose: () => void
  application: any
  currentWorkspaceId: string
  currentWorkspaceName: string
  currentUserRole: "project" | "cm" | "community"
}

export function ApplicationDiscussionModal({
  isOpen,
  onClose,
  application,
  currentWorkspaceId,
  currentWorkspaceName,
  currentUserRole,
}: ApplicationDiscussionModalProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchMessages = async () => {
    if (!application?.id) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/applications/${application.id}/messages`)
      const data = await res.json()
      if (data.success) {
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error("Error loading negotiation thread:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && application?.id) {
      fetchMessages()
    }
  }, [isOpen, application?.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!isOpen || !application) return null

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    try {
      const res = await fetch(`/api/applications/${application.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderWorkspaceId: currentWorkspaceId,
          senderName: currentWorkspaceName,
          senderRole: currentUserRole,
          message: newMessage.trim(),
        }),
      })

      const data = await res.json()
      if (data.success) {
        setMessages((prev) => [...prev, data.message])
        setNewMessage("")
        toast.success("Message posted to negotiation thread!")
      } else {
        toast.error(data.error || "Failed to send message")
      }
    } catch (error) {
      toast.error("Error sending message")
    } finally {
      setIsSending(false)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "project":
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200 rounded flex items-center gap-1">
            <Building2 className="w-3 h-3 text-indigo-600" />
            <span>Project Owner</span>
          </span>
        )
      case "cm":
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 rounded flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-amber-600" />
            <span>Collab Manager</span>
          </span>
        )
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Community Leader</span>
          </span>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-zinc-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200/80 bg-zinc-900 text-white flex items-center justify-between">
          <div className="space-y-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold tracking-tight text-white truncate">
                {application.projectName || application.applicantName || "Collab Deal Thread"}
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 rounded uppercase">
                {application.requestedSpots || 10} Spots
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-normal truncate">
              Campaign: <span className="font-semibold text-zinc-200">{application.campaignTitle}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pitch Summary Context Card */}
        <div className="p-4 bg-zinc-50 border-b border-zinc-200/70 text-xs space-y-2 shrink-0">
          <div className="flex items-center justify-between text-zinc-500 font-medium text-[11px]">
            <span>Initial Pitch Context</span>
            <span>Status: <strong className="uppercase text-zinc-900">{application.status}</strong></span>
          </div>

          {application.pitchMessage ? (
            <p className="text-zinc-800 italic bg-white p-2.5 rounded-lg border border-zinc-200 text-xs">
              "{application.pitchMessage}"
            </p>
          ) : (
            <p className="text-zinc-500 italic">No pitch note provided.</p>
          )}

          <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
            <span>Sent: {formatTimestamp(application.createdAt)}</span>
            {application.reviewedAt && <span>Reviewed: {formatTimestamp(application.reviewedAt)}</span>}
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-white">
          {isLoading ? (
            <div className="py-16 text-center space-y-2">
              <Loader2 className="w-6 h-6 text-zinc-400 animate-spin mx-auto" />
              <p className="text-xs text-zinc-500 font-medium">Loading negotiation thread...</p>
            </div>
          ) : messages.length > 0 ? (
            messages.map((msg) => {
              const isSelf = msg.senderWorkspaceId === currentWorkspaceId

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col space-y-1 max-w-[85%] ${
                    isSelf ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                    <span className="font-bold text-zinc-900">{msg.senderName}</span>
                    {getRoleBadge(msg.senderRole)}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                      isSelf
                        ? "bg-zinc-900 text-white rounded-br-none shadow-2xs"
                        : "bg-zinc-100 text-zinc-900 rounded-bl-none border border-zinc-200/80"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    <div
                      className={`text-[10px] flex items-center justify-end gap-1 ${
                        isSelf ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      <Clock className="w-2.5 h-2.5" />
                      <span>{formatTimestamp(msg.createdAt)}</span>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="py-16 text-center space-y-2 border-2 border-dashed border-zinc-100 rounded-2xl p-6">
              <MessageSquare className="w-8 h-8 text-zinc-300 mx-auto" />
              <h4 className="text-xs font-bold text-zinc-800">No negotiation messages yet</h4>
              <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                Start the conversation to discuss terms, spot count, wallet deadlines, or launch schedules.
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Footer */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-200 bg-white space-y-3 shrink-0">
          <div className="relative">
            <textarea
              rows={3}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder="Write a message to negotiate terms (Press Enter to send)..."
              className="w-full p-3 pr-10 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none text-zinc-900"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-400">Shift + Enter for new line</span>

            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-40 rounded-xl"
            >
              {isSending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>Send Message</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
