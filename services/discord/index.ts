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

export interface DiscordRole {
  id: string
  name: string
  color: number
  position: number
  permissions: string
  managed: boolean
}

export interface DiscordBotGuildDetails {
  success: boolean
  guildId?: string
  name?: string
  iconUrl?: string
  ownerId?: string
  memberCount: number
  presenceCount: number
  roles: DiscordRole[]
  error?: string
}

/**
 * Gets the configured Discord Bot token from environment variables.
 */
export function getDiscordBotToken(): string | undefined {
  return process.env.DISCORD_BOT_TOKEN
}

/**
 * Fetches verified server information, member counts, and roles using the Oncollably Discord Bot.
 */
export async function fetchGuildDetailsWithBot(guildId: string): Promise<DiscordBotGuildDetails> {
  const token = getDiscordBotToken()

  if (!token) {
    return {
      success: false,
      memberCount: 0,
      presenceCount: 0,
      roles: [],
      error: "DISCORD_BOT_TOKEN is not configured on the server.",
    }
  }

  try {
    const [guildRes, rolesRes] = await Promise.all([
      fetch(`https://discord.com/api/v10/guilds/${encodeURIComponent(guildId)}?with_counts=true`, {
        method: "GET",
        headers: {
          Authorization: `Bot ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }),
      fetch(`https://discord.com/api/v10/guilds/${encodeURIComponent(guildId)}/roles`, {
        method: "GET",
        headers: {
          Authorization: `Bot ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }),
    ])

    if (!guildRes.ok) {
      return {
        success: false,
        memberCount: 0,
        presenceCount: 0,
        roles: [],
        error: `Bot failed to fetch guild details (${guildRes.status}). Ensure bot is added to server.`,
      }
    }

    const guildData = await guildRes.json()
    let rolesData: DiscordRole[] = []

    if (rolesRes.ok) {
      const rawRoles = await rolesRes.json()
      rolesData = (rawRoles || [])
        .filter((r: any) => r.name !== "@everyone")
        .map((r: any) => ({
          id: r.id,
          name: r.name,
          color: r.color,
          position: r.position,
          permissions: r.permissions,
          managed: r.managed,
        }))
        .sort((a: DiscordRole, b: DiscordRole) => b.position - a.position)
    }

    const memberCount = guildData.approximate_member_count || guildData.member_count || 0
    const presenceCount = guildData.approximate_presence_count || 0
    const iconHash = guildData.icon
    const iconUrl = iconHash ? `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.png` : undefined

    return {
      success: true,
      guildId,
      name: guildData.name,
      iconUrl,
      ownerId: guildData.owner_id,
      memberCount,
      presenceCount,
      roles: rolesData,
    }
  } catch (error: any) {
    console.error("Error in fetchGuildDetailsWithBot:", error)
    return {
      success: false,
      memberCount: 0,
      presenceCount: 0,
      roles: [],
      error: error.message || "Failed to query Discord API using bot.",
    }
  }
}

/**
 * Verifies if a given Discord user is the Owner or Administrator of the Discord Guild.
 */
export async function verifyServerOwnershipWithBot(guildId: string, discordUserId: string): Promise<{
  isOwner: boolean
  isAdmin: boolean
  error?: string
}> {
  const token = getDiscordBotToken()
  if (!token) return { isOwner: false, isAdmin: false, error: "Bot token not set" }

  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${encodeURIComponent(guildId)}/members/${encodeURIComponent(discordUserId)}`, {
      method: "GET",
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      return { isOwner: false, isAdmin: false, error: `Member not found in guild (${res.status})` }
    }

    const memberData = await res.json()
    const guildDetails = await fetchGuildDetailsWithBot(guildId)

    const isOwner = guildDetails.ownerId === discordUserId
    // Administrator permission flag bit check: 0x8 or ADMINISTRATOR
    const isAdmin = isOwner || Boolean(memberData.permissions && (BigInt(memberData.permissions) & BigInt(0x8)) !== BigInt(0))

    return { isOwner, isAdmin }
  } catch (err: any) {
    return { isOwner: false, isAdmin: false, error: err.message }
  }
}

