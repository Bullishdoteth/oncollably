import type { Metadata } from "next"
import { constructMetadata } from "@/lib/og-builder"
import { PublicProjectClient } from "./public-project-client"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const rawSlug = resolvedParams.slug || "cybersamurai"
  const slug = decodeURIComponent(rawSlug)
  const projectTitle = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "CyberSamurai"

  const title = `${projectTitle} | Web3 Collab Campaign & Whitelist Allocations`
  const description = `Apply for ${projectTitle} whitelist spot allocations, collab campaigns, and community partnerships on Oncollably. Verified Web3 collaboration management platform.`

  return constructMetadata({
    title,
    description,
    imageTitle: projectTitle,
    imageDescription: description,
    badge: "Public Collab Campaign",
    path: `/c/${slug}`,
    type: "website",
  })
}

export default async function PublicProjectPage({ params }: PageProps) {
  const { slug } = await params
  return <PublicProjectClient slug={slug} />
}
