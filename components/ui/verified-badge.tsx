import React from "react"

interface VerifiedBadgeProps {
  className?: string
  size?: "sm" | "md" | "lg"
  color?: "emerald" | "blue" | "violet"
}

export function VerifiedBadge({ className = "", size = "md", color = "emerald" }: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  const fillColors = {
    emerald: "text-emerald-500",
    blue: "text-blue-500",
    violet: "text-violet-500",
  }

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${fillColors[color]} ${className}`}
      title="Verified Collab Manager"
    >
      <svg
        className={`${sizeClasses[size]} fill-current`}
        viewBox="0 0 24 24"
        aria-label="Verified Badge"
      >
        <path d="M22.5 12.5c0-1.58-.8-2.97-2-3.79.44-1.55.05-3.24-1.07-4.36-1.12-1.12-2.81-1.51-4.36-1.07C14.25 2.08 12.86 1.28 11.28 1.28c-1.58 0-2.97.8-3.79 2C5.94 2.84 4.25 3.23 3.13 4.35 2.01 5.47 1.62 7.16 2.06 8.71 1.26 9.53.46 10.92.46 12.5c0 1.58.8 2.97 2 3.79-.44 1.55-.05 3.24 1.07 4.36 1.12 1.12 2.81 1.51 4.36 1.07.82 1.22 2.21 2.02 3.79 2.02 1.58 0 2.97-.8 3.79-2 .44.44 2.13.83 3.25-.29 1.12-1.12 1.51-2.81 1.07-4.36 1.2-0.82 2-2.21 2-3.79zM10.09 16.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
      </svg>
    </span>
  )
}
