import { NextResponse, type NextRequest } from "next/server"
import { auth } from "@/lib/auth/auth"

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  const { pathname } = request.nextUrl

  // Protected routes: (auth)/onboarding and all (routes) subroutes (/cm, /community, /project)
  const isProtectedRoute =
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/cm") ||
    pathname.startsWith("/community") ||
    pathname.startsWith("/project")

  // If user is trying to access a protected route without a valid session
  if (isProtectedRoute && !session) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // If authenticated user attempts to visit sign-in or create-account pages
  if (session && (pathname === "/sign-in" || pathname === "/create-account")) {
    return NextResponse.redirect(new URL("/onboarding", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/onboarding/:path*",
    "/cm/:path*",
    "/community/:path*",
    "/project/:path*",
    "/sign-in",
    "/create-account",
  ],
}
