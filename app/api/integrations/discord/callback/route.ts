import { NextResponse } from "next/server"
import { fetchGuildDetailsWithBot } from "@/services/discord"
import { db } from "@/lib/db/db"
import { communityProfile } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const guildId = searchParams.get("guild_id")
    const permissions = searchParams.get("permissions")
    const stateRaw = searchParams.get("state")
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    let workspaceId = ""
    if (stateRaw) {
      try {
        const decoded = JSON.parse(decodeURIComponent(stateRaw))
        workspaceId = decoded.workspaceId || ""
      } catch (e) {
        // Fallback if state is plain string
        workspaceId = stateRaw
      }
    }

    if (!guildId) {
      return NextResponse.redirect(`${appUrl}/community/integrations?error=missing_guild_id`)
    }

    // Verify guild using Bot Token
    const botStats = await fetchGuildDetailsWithBot(guildId)

    if (!botStats.success) {
      console.warn(`[Discord Callback] Failed bot verification for guild ${guildId}: ${botStats.error}`)
    }

    // Attempt to update database if workspaceId is present
    if (workspaceId && db) {
      try {
        await db
          .update(communityProfile)
          .set({
            discordServerId: guildId,
            discordBotInstalled: true,
            discordRolesCache: JSON.stringify(botStats.roles || []),
            discordOwnerId: botStats.ownerId || null,
            discordOwnerVerified: true,
            discordLastVerifiedAt: new Date(),
            membersCount: botStats.memberCount || 0,
            verifiedMetricsUpdatedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(communityProfile.workspaceId, workspaceId))
      } catch (dbErr) {
        console.error("[Discord Callback] DB update error:", dbErr)
      }
    }

    const redirectUrl = new URL(`${appUrl}/community/integrations`)
    redirectUrl.searchParams.set("bot_connected", "true")
    redirectUrl.searchParams.set("guild_id", guildId)
    if (botStats.name) redirectUrl.searchParams.set("server_name", botStats.name)
    if (botStats.memberCount) redirectUrl.searchParams.set("member_count", botStats.memberCount.toString())

    return NextResponse.redirect(redirectUrl.toString())
  } catch (error: any) {
    console.error("[Discord Callback] Error:", error)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    return NextResponse.redirect(`${appUrl}/community/integrations?error=callback_failed`)
  }
}
