"use client"

import React from "react"
import { Sidebar } from "@/components/sidebar"

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col lg:flex-row antialiased selection:bg-zinc-900 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Page Area */}
      <main className="flex-1 min-w-0 bg-white">
        <div className="w-full max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
