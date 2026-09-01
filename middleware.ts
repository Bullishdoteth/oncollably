import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
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

  // Fast-path: if attempting to access a protected route with no session cookie, redirect immediately
  if (isProtectedRoute && !sessionToken) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // If a session cookie exists, verify validity via internal get-session API
  if (sessionToken) {
    try {
      const res = await fetch(new URL("/api/auth/get-session", request.url), {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      })

      const sessionData = res.ok ? await res.json() : null

      if (isProtectedRoute && (!sessionData || !sessionData.session)) {
        const signInUrl = new URL("/sign-in", request.url)
        signInUrl.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(signInUrl)
      }

      if (isAuthRoute && sessionData?.session) {
        return NextResponse.redirect(new URL("/onboarding", request.url))
      }
    } catch (error) {
      console.error("Middleware session verification error:", error)
    }
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
