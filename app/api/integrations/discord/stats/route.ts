import { NextResponse } from "next/server"
import { fetchDiscordMemberCount } from "@/services/discord"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const invite = searchParams.get("invite") || searchParams.get("url")

    if (!invite) {
      return NextResponse.json(
        { success: false, error: "Missing 'invite' or 'url' query parameter" },
        { status: 400 }
      )
    }

    const result = await fetchDiscordMemberCount(invite)
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to query Discord API" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const invite = body.inviteUrl || body.invite || body.code

    if (!invite) {
      return NextResponse.json(
        { success: false, error: "Missing 'inviteUrl' in request body" },
        { status: 400 }
      )
    }

    const result = await fetchDiscordMemberCount(invite)
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to query Discord API" },
      { status: 500 }
    )
  }
}
