import { auth } from "@/lib/auth/auth"
import { NextRequest, NextResponse } from "next/server"

function getFallbackRedirectPath(request: NextRequest): string {
  const referer = request.headers.get("referer") || ""
  if (referer.includes("/create-account")) {
    return "/create-account"
  }
  return "/sign-in"
}

export async function GET(request: NextRequest) {
  try {
    const response = await auth.handler(request)
    return response
  } catch (error) {
    console.error("[Google OAuth Callback Error]:", error)
    const url = request.nextUrl.clone()
    url.pathname = getFallbackRedirectPath(request)
    url.searchParams.set("error", "oauth_callback_failed")
    return NextResponse.redirect(url)
  }
}

export async function POST(request: NextRequest) {
  try {
    const response = await auth.handler(request)
    return response
  } catch (error) {
    console.error("[Google OAuth Callback Error]:", error)
    const url = request.nextUrl.clone()
    url.pathname = getFallbackRedirectPath(request)
    url.searchParams.set("error", "oauth_callback_failed")
    return NextResponse.redirect(url)
  }
}
