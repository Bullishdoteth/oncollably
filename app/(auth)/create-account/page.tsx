import { Suspense } from "react"
import Link from "next/link"
import { GoogleButton } from "@/components/auth/google-button"
import { AuthToastListener } from "@/components/auth/auth-toast-listener"

export default function CreateAccountPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <AuthToastListener />
      </Suspense>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-zinc-500">
          Get started with OnCollably using your Google account
        </p>
      </div>

      <div className="pt-2">
        <GoogleButton label="Sign up with Google" callbackURL="/dashboard" />
      </div>

      <p className="text-xs text-center text-zinc-400 leading-relaxed px-2">
        By continuing, you agree to OnCollably&apos;s{" "}
        <a href="#" className="underline underline-offset-2 hover:text-zinc-600">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-2 hover:text-zinc-600">
          Privacy Policy
        </a>
        .
      </p>

      <div className="pt-4 border-t border-zinc-100 text-center">
        <p className="text-sm text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-zinc-900 hover:text-zinc-700 underline underline-offset-4 decoration-zinc-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
