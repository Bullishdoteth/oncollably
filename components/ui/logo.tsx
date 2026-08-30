import React from "react"
import Link from "next/link"

interface LogoProps {
  className?: string
  href?: string
}

export function Logo({ className = "", href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 focus:outline-hidden ${className}`}
    >
      <span className="font-extrabold text-xl tracking-tight text-black font-sans">
        Oncollably
      </span>
    </Link>
  )
}
