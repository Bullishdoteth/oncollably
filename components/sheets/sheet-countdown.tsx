"use client"

import React, { useState, useEffect } from "react"
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react"

interface SheetCountdownProps {
  deadline?: Date | string | null
  isCompleted?: boolean
  className?: string
}

export function SheetCountdown({ deadline, isCompleted = false, className = "" }: SheetCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number
    minutes: number
    seconds: number
    isExpired: boolean
  } | null>(null)

  useEffect(() => {
    if (!deadline || isCompleted) return

    const target = new Date(deadline).getTime()

    const updateTimer = () => {
      const now = Date.now()
      const diff = target - now

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true })
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeLeft({ hours, minutes, seconds, isExpired: false })
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [deadline, isCompleted])

  if (isCompleted) {
    return (
      <span className={`px-2.5 py-0.5 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md flex items-center gap-1 ${className}`}>
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        <span>Submitted ✓</span>
      </span>
    )
  }

  if (!deadline) {
    return (
      <span className={`px-2.5 py-0.5 text-[11px] font-bold bg-zinc-100 text-zinc-600 border border-zinc-200 rounded-md flex items-center gap-1 ${className}`}>
        <Clock className="w-3 h-3 text-zinc-500" />
        <span>No Deadline</span>
      </span>
    )
  }

  if (timeLeft?.isExpired) {
    return (
      <span className={`px-2.5 py-0.5 text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 rounded-md flex items-center gap-1 ${className}`}>
        <AlertTriangle className="w-3 h-3 text-rose-600" />
        <span>Deadline Expired / Deal Closed</span>
      </span>
    )
  }

  const isUrgent = (timeLeft?.hours || 0) < 6

  return (
    <span
      className={`px-2.5 py-0.5 text-[11px] font-bold border rounded-md flex items-center gap-1.5 font-mono ${
        isUrgent
          ? "bg-rose-50 text-rose-800 border-rose-200 animate-pulse"
          : "bg-amber-50 text-amber-800 border-amber-200"
      } ${className}`}
    >
      <Clock className={`w-3 h-3 ${isUrgent ? "text-rose-600" : "text-amber-600"}`} />
      <span>
        {timeLeft
          ? `${String(timeLeft.hours).padStart(2, "0")}h ${String(timeLeft.minutes).padStart(2, "0")}m ${String(timeLeft.seconds).padStart(2, "0")}s left`
          : "Calculating..."}
      </span>
    </span>
  )
}
