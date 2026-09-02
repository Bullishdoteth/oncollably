/**
 * X (Twitter) Public Metrics Fetcher & Web Scraper Service
 * Extracts real-time public X follower counts directly using syndication endpoints & lightweight page parsing
 * without incurring expensive official Twitter API v2 monthly tier costs.
 */

export interface XProfileMetrics {
  success: boolean
  handle: string
  name?: string
  followerCount: number
  isVerified?: boolean
  profileImageUrl?: string
  error?: string
}

/**
 * Extracts a clean X handle from a URL or raw string input.
 * Handles inputs like:
 * - "@cybersamurai"
 * - "cybersamurai"
 * - "https://x.com/cybersamurai"
 * - "https://twitter.com/cybersamurai"
 */
export function extractXHandle(input: string): string {
  if (!input) return ""
  let clean = input.trim()
  clean = clean.replace(/^https?:\/\/(x|twitter)\.com\//i, "")
  clean = clean.replace(/^@/, "")
  clean = clean.split("?")[0].split("/")[0].trim()
  return clean
}

/**
 * Parses numeric follower count string like "12.4K", "1.2M", "500" into integer.
 */
function parseAbbreviatedCount(str: string): number {
  if (!str) return 0
  const cleanStr = str.trim().toUpperCase().replace(/,/g, "")

  if (cleanStr.endsWith("K")) {
    return Math.round(parseFloat(cleanStr.slice(0, -1)) * 1000)
  }
  if (cleanStr.endsWith("M")) {
    return Math.round(parseFloat(cleanStr.slice(0, -1)) * 1000000)
  }
  return parseInt(cleanStr, 10) || 0
}

/**
 * Fetches live public X follower count using fast syndication API endpoints & HTML scraping fallback.
 */
export async function fetchXFollowerCount(usernameOrUrl: string): Promise<XProfileMetrics> {
  const handle = extractXHandle(usernameOrUrl)
  if (!handle) {
    return {
      success: false,
      handle: "",
      followerCount: 0,
      error: "Invalid or missing X handle.",
    }
  }

  // 1. Primary Method: Syndication Follow Button Endpoint (Fast, Free, No API key)
  try {
    const syndicationUrl = `https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=${encodeURIComponent(handle)}`
    const res = await fetch(syndicationUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        const info = data[0]
        const count = parseInt(info.followers_count || info.followers_count_str || "0", 10)

        if (count > 0 || info.screen_name) {
          return {
            success: true,
            handle: info.screen_name || handle,
            name: info.name,
            followerCount: count,
            profileImageUrl: info.profile_image_url_https,
          }
        }
      }
    }
  } catch (err) {
    console.warn("Syndication X lookup failed, attempting HTML scraper fallback:", err)
  }

  // 2. Secondary Method: Scraping Timeline/Profile Page Endpoint
  try {
    const profileUrl = `https://syndication.twitter.com/srv/timeline-profile/pk/twitter_id/${encodeURIComponent(handle)}`
    const htmlRes = await fetch(profileUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      next: { revalidate: 300 },
    })

    if (htmlRes.ok) {
      const htmlText = await htmlRes.text()

      // Match "followers_count":12345 or data-followers-count
      const matchExact = htmlText.match(/"followers_count":\s*(\d+)/i) || htmlText.match(/data-followers-count="(\d+)"/i)
      if (matchExact && matchExact[1]) {
        return {
          success: true,
          handle,
          followerCount: parseInt(matchExact[1], 10),
        }
      }

      // Match visual text regex e.g. "12.4K Followers"
      const matchText = htmlText.match(/([\d\.,KkMm]+)\s+Followers/i)
      if (matchText && matchText[1]) {
        return {
          success: true,
          handle,
          followerCount: parseAbbreviatedCount(matchText[1]),
        }
      }
    }
  } catch (err: any) {
    console.error("HTML scraper fallback failed for X handle:", handle, err)
  }

  return {
    success: false,
    handle,
    followerCount: 0,
    error: `Could not extract public follower count for @${handle}`,
  }
}
