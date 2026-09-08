import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(`${origin}/onboarding?error=missing_code`);
  }

  // Redirect back to onboarding or settings with OAuth code
  return NextResponse.redirect(`${origin}/onboarding?discord_code=${encodeURIComponent(code)}`);
}
