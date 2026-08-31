import React from "react"
import Link from "next/link"
import Image from "next/image"

interface LogoProps {
  className?: string
  href?: string
  textClassName?: string
  variant?: "text" | "png"
}

export function Logo({
  className = "",
  href = "/",
  textClassName = "text-black text-xl",
  variant = "text",
}: LogoProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 focus:outline-hidden ${className}`}
    >
      {variant === "png" ? (
        <Image
          src="/logo-white.png"
          alt="Oncollably Logo"
          width={180}
          height={48}
          className="h-8 w-auto object-contain"
          priority
        />
      ) : (
        <span className={`font-extrabold tracking-tight font-sans ${textClassName}`}>
          Oncollably
        </span>
      )}
    </Link>
  )
}

export function LogoWhite({
  className = "",
  href = "/",
  width = 180,
  height = 48,
}: {
  className?: string
  href?: string
  width?: number
  height?: number
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center focus:outline-hidden ${className}`}
    >
      <Image
        src="/logo-white.png"
        alt="Oncollably White Logo"
        width={width}
        height={height}
        className="h-8 w-auto object-contain"
        priority
      />
    </Link>
  )
}
