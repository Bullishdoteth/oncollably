import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId") || ""
    const clientId = process.env.DISCORD_CLIENT_ID || "10849283749283749"
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const redirectUri = `${appUrl}/api/integrations/discord/callback`

    // Permissions: View Channels (1024), Manage Roles (268435456), Read Message History (65536) = 268568576
    const permissions = "268568576"
    const scope = encodeURIComponent("bot applications.commands")
    const state = encodeURIComponent(JSON.stringify({ workspaceId }))

    const botUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&scope=${scope}&permissions=${permissions}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${state}`

    return NextResponse.json({
      success: true,
      botUrl,
      permissions,
      clientId,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate Bot authorization URL" },
      { status: 500 }
    )
  }
}
