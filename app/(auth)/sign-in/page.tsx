import Link from "next/link"
import { GoogleButton } from "@/components/auth/google-button"

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-zinc-500">
          Sign in to your OnCollably account to manage your collaborations
        </p>
      </div>

      <div className="pt-2">
        <GoogleButton label="Sign in with Google" callbackURL="/dashboard" />
      </div>

      <div className="pt-4 border-t border-zinc-100 text-center">
        <p className="text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/create-account"
            className="font-semibold text-zinc-900 hover:text-zinc-700 underline underline-offset-4 decoration-zinc-300 transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
