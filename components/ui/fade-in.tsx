"use client"

import React from "react"
import { motion } from "framer-motion"

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  duration?: number
  fullWidth?: boolean
}

export function FadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.5,
  fullWidth = false,
}: FadeInProps) {
  const getDirectionOffset = () => {
    switch (direction) {
      case "up":
        return { y: 24, x: 0 }
      case "down":
        return { y: -24, x: 0 }
      case "left":
        return { y: 0, x: 24 }
      case "right":
        return { y: 0, x: -24 }
      case "none":
        return { y: 0, x: 0 }
    }
  }

  const offset = getDirectionOffset()

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={`${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
}: {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
