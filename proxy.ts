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

  // 1. Unauthenticated user trying to access protected route -> redirect to sign-in
  if (isProtectedRoute && !sessionToken) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // 2. Authenticated user visiting sign-in/create-account -> redirect to main workspace hub
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/project", request.url))
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
