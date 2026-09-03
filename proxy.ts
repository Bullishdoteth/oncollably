import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes: (auth)/onboarding and all (routes) subroutes (/cm, /community, /project)
  const isProtectedRoute =
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/cm") ||
    pathname.startsWith("/community") ||
    pathname.startsWith("/project")

  const isAuthRoute = pathname === "/sign-in" || pathname === "/create-account"

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
  // 2. Authenticated user visiting sign-in/create-account -> redirect to main workspace hub
  else if (isAuthRoute && sessionToken) {
    response = NextResponse.redirect(new URL("/project", request.url))
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
    "/onboarding/:path*",
    "/cm/:path*",
    "/community/:path*",
    "/project/:path*",
    "/sign-in",
    "/create-account",
  ],
}
