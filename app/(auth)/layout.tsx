import React from "react"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between selection:bg-zinc-100 selection:text-zinc-900">
      {/* Header / Brand */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
            O
          </div>
          <span className="font-semibold text-lg tracking-tight text-zinc-900">
            OnCollably
          </span>
        </Link>
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
        <p>© {new Date().getFullYear()} OnCollably. All rights reserved.</p>
      </footer>
    </div>
  )
}
