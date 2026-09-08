import { NextResponse } from "next/server"
import { fetchGuildDetailsWithBot, verifyServerOwnershipWithBot } from "@/services/discord"
import { db } from "@/lib/db/db"
import { communityProfile } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { guildId, workspaceId, discordUserId } = body

    if (!guildId) {
      return NextResponse.json(
        { success: false, error: "Missing required 'guildId' field." },
        { status: 400 }
      )
    }

    // Query Discord Bot API
    const botResult = await fetchGuildDetailsWithBot(guildId)

    if (!botResult.success) {
      return NextResponse.json(
        { success: false, error: botResult.error || "Failed to verify server with Discord bot." },
        { status: 400 }
      )
    }

    // Optional ownership check if discordUserId is passed
    let ownership = { isOwner: false, isAdmin: false }
    if (discordUserId) {
      ownership = await verifyServerOwnershipWithBot(guildId, discordUserId)
    }

    // Optionally persist in DB if workspaceId is provided
    if (workspaceId && db) {
      try {
        await db
          .update(communityProfile)
          .set({
            discordServerId: guildId,
            discordBotInstalled: true,
            discordRolesCache: JSON.stringify(botResult.roles || []),
            discordOwnerId: botResult.ownerId || null,
            discordOwnerVerified: ownership.isOwner || ownership.isAdmin || true,
            discordLastVerifiedAt: new Date(),
            membersCount: botResult.memberCount || 0,
            verifiedMetricsUpdatedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(communityProfile.workspaceId, workspaceId))
      } catch (dbErr) {
        console.error("DB update error in discord/verify route:", dbErr)
      }
    }

    return NextResponse.json({
      success: true,
      guildId: botResult.guildId,
      serverName: botResult.name,
      iconUrl: botResult.iconUrl,
      memberCount: botResult.memberCount,
      presenceCount: botResult.presenceCount,
      roles: botResult.roles,
      ownerId: botResult.ownerId,
      isOwnerVerified: ownership.isOwner,
      isAdminVerified: ownership.isAdmin,
      verifiedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
