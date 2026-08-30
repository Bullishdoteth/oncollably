import React from "react"
import { Logo } from "@/components/ui/logo"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between selection:bg-zinc-100 selection:text-zinc-900">
      {/* Header / Brand */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Logo />
      </header>

      {/* Main Form Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white border border-zinc-200/80 shadow-xl shadow-zinc-100/60 rounded-3xl p-8 sm:p-10">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-zinc-400">
        <p>© {new Date().getFullYear()} Oncollably. All rights reserved.</p>
      </footer>
    </div>
  )
}
