"use client"

import React from "react"
import { Sidebar } from "@/components/sidebar"

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 flex flex-col lg:flex-row">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Page Area */}
      <main className="flex-1 min-w-0 pt-16 lg:pt-0">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
