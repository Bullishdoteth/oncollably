"use client"

import { useState } from "react"
import { signIn } from "@/lib/auth/auth-client"

interface GoogleButtonProps {
  label?: string
  callbackURL?: string
}

export function GoogleButton({
  label = "Continue with Google",
  callbackURL = "/dashboard",
}: GoogleButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await signIn.social({
        provider: "google",
        callbackURL,
      })
      if (res?.error) {
        console.error("Sign in failed:", res.error)
        setError(res.error.message || "Failed to initiate Google sign-in. Please try again.")
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error("Sign in failed:", err)
      setError(err?.message || "Failed to initiate Google sign-in. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-3">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl text-center font-medium">
          {error}
        </div>
      )}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full relative flex items-center justify-center gap-3 px-5 py-3.5 bg-white hover:bg-zinc-50 active:bg-zinc-100 text-zinc-800 font-medium text-sm rounded-xl border border-zinc-200 shadow-xs hover:border-zinc-300 hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer group"
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-zinc-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-5 h-5 transition-transform duration-200 group-hover:scale-105"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
        )}
        <span>{isLoading ? "Connecting to Google..." : label}</span>
      </button>
    </div>
  )
}
