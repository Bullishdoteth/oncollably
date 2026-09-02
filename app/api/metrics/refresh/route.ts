import { NextResponse } from "next/server"
import { db } from "@/lib/db/db"
import { workspace } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { fetchDiscordMemberCount } from "@/services/discord"
import { fetchXFollowerCount } from "@/services/x"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { workspaceId, discordUrl, xHandle } = body

    if (!workspaceId) {
      return NextResponse.json({ error: "Missing workspaceId" }, { status: 400 })
    }

    let discordMemberCount = 0
    let xFollowerCount = 0

    // Fetch Discord metrics if provided
    if (discordUrl) {
      const discordRes = await fetchDiscordMemberCount(discordUrl)
      if (discordRes.success) {
        discordMemberCount = discordRes.memberCount
      }
    }

    // Fetch X metrics if provided
    if (xHandle) {
      const xRes = await fetchXFollowerCount(xHandle)
      if (xRes.success) {
        xFollowerCount = xRes.followerCount
      }
    }

    // Update Postgres database
    await db
      .update(workspace)
      .set({
        discordMemberCount: discordMemberCount || undefined,
        xFollowerCount: xFollowerCount || undefined,
        verifiedMetricsUpdatedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(workspace.id, workspaceId))

    return NextResponse.json({
      success: true,
      workspaceId,
      discordMemberCount,
      xFollowerCount,
      updatedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Error refreshing workspace metrics:", error)
    return NextResponse.json({ error: error.message || "Failed to refresh metrics" }, { status: 500 })
  }
}
