import React from "react"

export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-zinc-100" />
          <div className="h-8 w-64 bg-zinc-200" />
          <div className="h-4 w-96 bg-zinc-100" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-32 bg-zinc-100 shrink-0" />
          <div className="h-9 w-36 bg-zinc-200 shrink-0" />
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 bg-white border border-zinc-100 space-y-3">
          <div className="h-4 w-28 bg-zinc-100" />
          <div className="h-9 w-16 bg-zinc-200" />
          <div className="h-3 w-40 bg-zinc-100" />
        </div>
        <div className="p-6 bg-white border border-zinc-100 space-y-3">
          <div className="h-4 w-28 bg-zinc-100" />
          <div className="h-9 w-16 bg-zinc-200" />
          <div className="h-3 w-40 bg-zinc-100" />
        </div>
        <div className="p-6 bg-white border border-zinc-100 space-y-3">
          <div className="h-4 w-28 bg-zinc-100" />
          <div className="h-9 w-16 bg-zinc-200" />
          <div className="h-3 w-40 bg-zinc-100" />
        </div>
      </div>

      {/* Main Box Skeleton */}
      <div className="p-6 bg-white border border-zinc-100 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="h-5 w-48 bg-zinc-200" />
          <div className="h-4 w-20 bg-zinc-100" />
        </div>

        <div className="space-y-4">
          <div className="h-16 bg-zinc-50 border border-zinc-100" />
          <div className="h-16 bg-zinc-50 border border-zinc-100" />
          <div className="h-16 bg-zinc-50 border border-zinc-100" />
        </div>
      </div>
    </div>
  )
}
