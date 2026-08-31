import React from "react"
import Link from "next/link"

interface LogoProps {
  className?: string
  href?: string
  textClassName?: string
}

export function Logo({ className = "", href = "/", textClassName = "text-black text-xl" }: LogoProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 focus:outline-hidden ${className}`}
    >
      <span className={`font-extrabold tracking-tight font-sans ${textClassName}`}>
        Oncollably
      </span>
    </Link>
  )
}

