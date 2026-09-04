import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { constructMetadata } from "@/lib/og-builder"
import { PublicProjectClient } from "./public-project-client"
import { ensureSeedData } from "@/lib/db/seed"
import { getWorkspaceByHandle, getCampaignsForWorkspace } from "@/lib/db/queries"

interface PageProps {
  params: Promise<{ projectHandle: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const rawHandle = resolvedParams.projectHandle || ""
  const projectHandle = decodeURIComponent(rawHandle)

  const projectWorkspace = await getWorkspaceByHandle(projectHandle)

  if (!projectWorkspace) {
    return constructMetadata({
      title: "Project Not Found | Oncollably",
      description: "The requested project channel does not exist on Oncollably.",
      path: `/c/${projectHandle}`,
    })
  }

  const projectTitle = projectWorkspace.name
  const title = `${projectTitle} | Web3 Collab Channel & Whitelist Allocations`
  const description = projectWorkspace.bio || `Apply for ${projectTitle} whitelist spot allocations, collab campaigns, and community partnerships on Oncollably.`

  return constructMetadata({
    title,
    description,
    imageTitle: projectTitle,
    imageDescription: description,
    badge: "Public Collab Channel",
    path: `/c/${projectHandle}`,
    type: "website",
  })
}

export default async function PublicProjectChannelPage({ params }: PageProps) {
  const { projectHandle } = await params
  await ensureSeedData()

  const projectWorkspace = await getWorkspaceByHandle(projectHandle)

  if (!projectWorkspace) {
    notFound()
  }

  const campaigns = await getCampaignsForWorkspace(projectWorkspace.id)

  return (
    <PublicProjectClient
      slug={projectHandle}
      initialWorkspace={projectWorkspace}
      initialCampaigns={campaigns}
    />
  )
}
