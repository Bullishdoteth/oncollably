"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

export function AuthToastListener() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get("error")
    if (error) {
      let message = "Authentication failed. Please try again."
      if (error === "oauth_callback_failed") {
        message = "Google sign-in was canceled or failed to complete."
      } else if (error === "access_denied") {
        message = "Access was denied by Google."
      } else if (error === "state_mismatch") {
        message = "Security session expired. Please sign in again."
      }
      
      toast.error("Authentication Error", {
        description: message,
      })
    }
  }, [searchParams])

  return null
}
