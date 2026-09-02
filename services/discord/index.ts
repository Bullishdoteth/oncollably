/**
 * Discord Integration Service
 * Fetches real-time server member counts and guild information from public invite codes or guild widgets
 * without requiring expensive bot tokens or complex OAuth setup.
 */

export interface DiscordServerMetrics {
  success: boolean
  inviteCode?: string
  guildId?: string
  serverName?: string
  memberCount: number
  presenceCount: number
  iconUrl?: string
  error?: string
}

/**
 * Extracts a clean Discord invite code from a URL or raw input string.
 * Handles inputs like:
 * - "alphaseekers"
 * - "discord.gg/alphaseekers"
 * - "https://discord.com/invite/alphaseekers"
 * - "discord.app/invite/alphaseekers"
 */
export function extractDiscordInviteCode(input: string): string {
  if (!input) return ""
  let clean = input.trim()
  clean = clean.replace(/^https?:\/\//i, "")
  clean = clean.replace(/^(www\.)?(discord\.gg|discordapp\.com\/invite|discord\.com\/invite)\//i, "")
  clean = clean.split("?")[0].split("#")[0].trim()
  return clean
}

/**
 * Fetches live Discord server member & presence count using public invite endpoint.
 */
export async function fetchDiscordMemberCount(inviteOrUrl: string): Promise<DiscordServerMetrics> {
  const code = extractDiscordInviteCode(inviteOrUrl)
  if (!code) {
    return {
      success: false,
      memberCount: 0,
      presenceCount: 0,
      error: "Invalid or missing Discord invite code.",
    }
  }

  try {
    const res = await fetch(`https://discord.com/api/v9/invites/${encodeURIComponent(code)}?with_counts=true`, {
      method: "GET",
      headers: {
        "User-Agent": "OncollablyBot/1.0",
        Accept: "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!res.ok) {
      return {
        success: false,
        inviteCode: code,
        memberCount: 0,
        presenceCount: 0,
        error: `Discord API returned status ${res.status}`,
      }
    }

    const data = await res.json()
    const memberCount = data.approximate_member_count || 0
    const presenceCount = data.approximate_presence_count || 0
    const guildName = data.guild?.name || ""
    const guildId = data.guild?.id || ""
    const iconHash = data.guild?.icon

    let iconUrl = undefined
    if (guildId && iconHash) {
      iconUrl = `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.png`
    }

    return {
      success: true,
      inviteCode: code,
      guildId,
      serverName: guildName,
      memberCount,
      presenceCount,
      iconUrl,
    }
  } catch (error: any) {
    console.error("Error fetching Discord member count:", error)
    return {
      success: false,
      inviteCode: code,
      memberCount: 0,
      presenceCount: 0,
      error: error.message || "Failed to fetch Discord metrics.",
    }
  }
}
