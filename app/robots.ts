import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://oncollably.com"

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/terms", "/privacy-policy", "/c", "/c/*"],
        disallow: [
          "/project",
          "/project/*",
          "/cm",
          "/cm/*",
          "/community",
          "/community/*",
          "/onboarding",
          "/onboarding/*",
          "/api",
          "/api/*",
          "/sign-in",
          "/create-account",
        ],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "Google-Extended",
          "CCBot",
          "Bytespider",
        ],
        allow: ["/", "/terms", "/privacy-policy", "/c", "/c/*"],
        disallow: [
          "/project",
          "/project/*",
          "/cm",
          "/cm/*",
          "/community",
          "/community/*",
          "/onboarding",
          "/onboarding/*",
          "/api",
          "/api/*",
          "/sign-in",
          "/create-account",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
