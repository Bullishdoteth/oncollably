"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { MegaMenu, MobileAccordionMenu, MenuCategory } from "./mega-menu"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState<MenuCategory>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleMouseEnter = (category: MenuCategory) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveMenu(category)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
    }, 150)
  }

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 ease-out px-4 sm:px-6 pt-2 pb-2">
      {/* Header Bar */}
      <div
        className={`w-full mx-auto transition-all duration-300 ease-out ${
          isScrolled
            ? "max-w-6xl bg-white/90 backdrop-blur-md border border-zinc-200/80 shadow-lg shadow-zinc-900/5 rounded-full px-6 py-3 mt-2"
            : "max-w-7xl bg-white border-b border-zinc-100/80 rounded-none px-4 py-4"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Column 1: Logo */}
          <div className="flex items-center shrink-0">
            <Logo />
          </div>

          {/* Column 2: Navigation Items (Megamenu Trigger Buttons) */}
          <nav className="hidden md:flex items-center gap-1 font-medium text-sm text-zinc-600">
            {(["projects", "communities", "managers"] as const).map((category) => {
              const labelMap = {
                projects: "For Projects",
                communities: "For Communities",
                managers: "For Collab Managers",
              }
              const isActive = activeMenu === category

              return (
                <div
                  key={category}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(category)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    onClick={() => setActiveMenu(isActive ? null : category)}
                    className={`px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? "bg-zinc-100 text-black font-semibold"
                        : "hover:text-black hover:bg-zinc-50"
                    }`}
                  >
                    <span>{labelMap[category]}</span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isActive ? "rotate-180 text-black" : "text-zinc-400"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </nav>

          {/* Column 3: Actions (Sign in + Create Account) */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-zinc-700 hover:text-black transition-colors px-2 py-1"
            >
              Sign in
            </Link>
            <Link
              href="/create-account"
              className="px-5 py-2.5 bg-black hover:bg-zinc-800 active:bg-zinc-900 text-white font-medium text-sm rounded-full shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              Create account
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-zinc-700 hover:bg-zinc-100 transition-colors"
              aria-label="Toggle Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Reusable MegaMenu Component */}
      <MegaMenu
        activeMenu={activeMenu}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClose={() => setActiveMenu(null)}
      />

      {/* Mobile Drawer Navigation with Collapsible Accordions */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 bg-white border border-zinc-200/90 rounded-3xl p-5 space-y-6 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <MobileAccordionMenu onClose={() => setMobileMenuOpen(false)} />

          <div className="pt-4 border-t border-zinc-100 flex flex-col gap-3">
            <Link
              href="/sign-in"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 font-medium text-sm text-zinc-700 hover:text-black"
            >
              Sign in
            </Link>
            <Link
              href="/create-account"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 bg-black text-white font-medium text-sm rounded-full shadow-xs"
            >
              Create account
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
