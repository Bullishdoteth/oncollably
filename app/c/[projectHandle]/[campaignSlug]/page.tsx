import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { constructMetadata } from "@/lib/og-builder"
import { PublicCampaignClient } from "./public-campaign-client"
import { ensureSeedData } from "@/lib/db/seed"
import { getCampaignByProjectAndSlug } from "@/lib/db/queries"

interface PageProps {
  params: Promise<{ projectHandle: string; campaignSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const projectHandle = decodeURIComponent(resolvedParams.projectHandle || "")
  const campaignSlug = decodeURIComponent(resolvedParams.campaignSlug || "")

  const data = await getCampaignByProjectAndSlug(projectHandle, campaignSlug)

  if (!data || !data.campaign) {
    return constructMetadata({
      title: "Campaign Not Found | Oncollably",
      description: "The requested campaign does not exist on Oncollably.",
      path: `/c/${projectHandle}/${campaignSlug}`,
    })
  }

  const campaignTitle = data.campaign.title
  const projectTitle = data.workspace.name
  const title = `${campaignTitle} - ${projectTitle} | Oncollably`
  const description = data.campaign.description || `Apply for ${campaignTitle} whitelist spot allocations from ${projectTitle} on Oncollably.`

  return constructMetadata({
    title,
    description,
    imageTitle: campaignTitle,
    imageDescription: `${projectTitle} Whitelist Allocation Campaign`,
    badge: "Whitelist Campaign",
    path: `/c/${projectHandle}/${campaignSlug}`,
    type: "website",
  })
}

export default async function PublicCampaignPage({ params }: PageProps) {
  const { projectHandle, campaignSlug } = await params
  await ensureSeedData()

  const data = await getCampaignByProjectAndSlug(projectHandle, campaignSlug)

  if (!data || !data.campaign || !data.workspace) {
    notFound()
  }

  return (
    <PublicCampaignClient
      projectHandle={projectHandle}
      campaignSlug={campaignSlug}
      campaignData={data.campaign}
      workspaceData={data.workspace}
    />
  )
}
