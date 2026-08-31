import { Suspense } from "react"
import Link from "next/link"
import { GoogleButton } from "@/components/auth/google-button"
import { AuthToastListener } from "@/components/auth/auth-toast-listener"

export default function SignInPage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={null}>
        <AuthToastListener />
      </Suspense>

      <div className="space-y-3 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black leading-tight">
          Welcome back
        </h1>
        <p className="text-base text-zinc-600 font-normal leading-relaxed max-w-sm mx-auto">
          Sign in to your Oncollably account to manage your collaborations and whitelist allocations.
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <GoogleButton label="Sign in with Google" callbackURL="/dashboard" />
      </div>

      <p className="text-xs text-center text-zinc-400 leading-relaxed max-w-sm mx-auto">
        By signing in, you agree to Oncollably&apos;s{" "}
        <Link href="/terms" className="underline underline-offset-2 hover:text-zinc-800 transition-colors font-medium">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-zinc-800 transition-colors font-medium">
          Privacy Policy
        </Link>
        .
      </p>

      <div className="pt-6 border-t border-zinc-100 text-center">
        <p className="text-sm text-zinc-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/create-account"
            className="font-semibold text-zinc-900 hover:text-black underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-800 transition-all"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
