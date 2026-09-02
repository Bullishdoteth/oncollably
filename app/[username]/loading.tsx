import React from "react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between animate-pulse">
      <div>
        {/* Cover Skeleton */}
        <div className="h-48 sm:h-56 w-full bg-zinc-200" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Profile Card Skeleton */}
          <div className="bg-white border border-zinc-200 -mt-20 mb-6 p-6 sm:p-8 text-center space-y-4">
            <div className="-mt-16 sm:-mt-20 mb-2 flex justify-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-zinc-300 border-4 border-white shadow-md" />
            </div>

            <div className="space-y-2 flex flex-col items-center">
              <div className="h-7 w-48 bg-zinc-200" />
              <div className="h-4 w-24 bg-zinc-100 font-mono" />
            </div>

            <div className="h-4 w-96 max-w-full mx-auto bg-zinc-100" />

            <div className="pt-2 flex justify-center">
              <div className="h-9 w-40 bg-zinc-300" />
            </div>
          </div>

          {/* Quick Metrics Bar Skeleton */}
          <div className="bg-white border border-zinc-200 mb-6 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 grid grid-cols-1 sm:grid-cols-3">
            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-100" />
              <div className="space-y-1">
                <div className="h-3 w-12 bg-zinc-100" />
                <div className="h-4 w-24 bg-zinc-200" />
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-100" />
              <div className="space-y-1">
                <div className="h-3 w-12 bg-zinc-100" />
                <div className="h-4 w-24 bg-zinc-200" />
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-100" />
              <div className="space-y-1">
                <div className="h-3 w-12 bg-zinc-100" />
                <div className="h-4 w-24 bg-zinc-200" />
              </div>
            </div>
          </div>

          {/* Portfolio Section Skeleton */}
          <div className="bg-white border border-zinc-200 p-6 space-y-4">
            <div className="h-5 w-64 bg-zinc-200 border-b border-zinc-100 pb-4" />
            <div className="h-20 bg-zinc-50 border border-zinc-100" />
            <div className="h-20 bg-zinc-50 border border-zinc-100" />
          </div>
        </div>
      </div>
    </div>
  )
}
