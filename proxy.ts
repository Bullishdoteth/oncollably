import { NextResponse, type NextRequest } from "next/server"
import { auth } from "@/lib/auth/auth"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes: (auth)/onboarding and all (routes) subroutes (/cm, /community, /project)
  const isProtectedRoute =
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/cm") ||
    pathname.startsWith("/community") ||
    pathname.startsWith("/project")

  const isAuthRoute = pathname === "/sign-in" || pathname === "/create-account"
  const isOnboardingRoute = pathname === "/onboarding"
  const isRootRoute = pathname === "/"

  // Retrieve session token from cookies
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value

  // Identify any legacy bloated better-auth session_data cookies (and chunks) to purge
  const legacyCookiesToPurge = request.cookies.getAll().filter((c) =>
    c.name.includes("better-auth.session_data")
  )

  let response: NextResponse

  // 1. Unauthenticated user trying to access protected route -> redirect to sign-in
  if (isProtectedRoute && !sessionToken) {
    const signInUrl = new URL("/sign-in", request.url)
    response = NextResponse.redirect(signInUrl)
  }
  // 2. Authenticated user
  else if (sessionToken) {
    let session = null
    try {
      session = await auth.api.getSession({
        headers: request.headers,
      })
    } catch (e) {
      console.error("[Proxy] Error retrieving session:", e)
    }

    const isUserOnboarded = Boolean(session?.user && (session.user as any).onboarded)
    const userWorkspaceType = (session?.user as any)?.workspaceType || "project"
    const targetWorkspaceUrl = new URL(`/${userWorkspaceType}`, request.url)

    // A. Previously onboarded user visiting /, auth routes, or onboarding -> redirect directly to active workspace
    if (isUserOnboarded && (isRootRoute || isAuthRoute || isOnboardingRoute)) {
      response = NextResponse.redirect(targetWorkspaceUrl)
    }
    // B. New user (not onboarded) attempting to access /, auth routes, or main workspace routes -> redirect to onboarding
    else if (!isUserOnboarded && (isRootRoute || isAuthRoute || (isProtectedRoute && !isOnboardingRoute))) {
      response = NextResponse.redirect(new URL("/onboarding", request.url))
    } else {
      response = NextResponse.next()
    }
  } else {
    response = NextResponse.next()
  }

  // Purge any legacy bloated session data cookies if present
  if (legacyCookiesToPurge.length > 0) {
    for (const cookie of legacyCookiesToPurge) {
      response.cookies.delete(cookie.name)
    }
  }

  return response
}

export const config = {
  matcher: [
    "/",
    "/onboarding/:path*",
    "/cm/:path*",
    "/community/:path*",
    "/project/:path*",
    "/sign-in",
    "/create-account",
  ],
}
