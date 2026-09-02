import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { constructMetadata } from "@/lib/og-builder"
import { PublicProjectClient } from "./public-project-client"
import { ensureSeedData } from "@/lib/db/seed"
import { getWorkspaceByHandle, getCampaignsForWorkspace } from "@/lib/db/queries"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const rawSlug = resolvedParams.slug || ""
  const slug = decodeURIComponent(rawSlug)

  const projectWorkspace = await getWorkspaceByHandle(slug)

  if (!projectWorkspace) {
    return constructMetadata({
      title: "Project Not Found | Oncollably",
      description: "The requested project channel does not exist on Oncollably.",
      path: `/c/${slug}`,
    })
  }

  const projectTitle = projectWorkspace.name
  const title = `${projectTitle} | Web3 Collab Campaign & Whitelist Allocations`
  const description = projectWorkspace.bio || `Apply for ${projectTitle} whitelist spot allocations, collab campaigns, and community partnerships on Oncollably.`

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
  await ensureSeedData()

  const projectWorkspace = await getWorkspaceByHandle(slug)

  // If project workspace does not exist in DB, invoke Next.js notFound()
  if (!projectWorkspace) {
    notFound()
  }

  const campaigns = await getCampaignsForWorkspace(projectWorkspace.id)

  return (
    <PublicProjectClient
      slug={slug}
      initialWorkspace={projectWorkspace}
      initialCampaigns={campaigns}
    />
  )
}
