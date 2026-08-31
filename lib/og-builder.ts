import { Metadata } from "next"

interface OpenGraphBuilderOptions {
  title?: string
  description?: string
  imageTitle?: string
  imageDescription?: string
  badge?: string
  path?: string
  type?: "website" | "article" | "profile"
}

export function constructMetadata({
  title = "Oncollably — Stop doing Web3 collabs in messy DMs",
  description = "Manage collaboration applications, verify communities and collab managers, allocate whitelist spots, and track every deal in one unified dashboard.",
  imageTitle,
  imageDescription,
  badge = "Web3 Collab Engine",
  path = "/",
  type = "website",
}: OpenGraphBuilderOptions = {}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://oncollably.com"
  const canonicalUrl = `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`

  const ogTitle = imageTitle || title
  const ogDescription = imageDescription || description

  const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(
    ogTitle
  )}&description=${encodeURIComponent(ogDescription)}&badge=${encodeURIComponent(
    badge
  )}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Oncollably",
      type,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}
