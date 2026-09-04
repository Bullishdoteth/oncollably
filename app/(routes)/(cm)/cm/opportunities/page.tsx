import React from "react"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { ensureSeedData } from "@/lib/db/seed"
import { getAllActiveCampaigns, getUserWorkspaces } from "@/lib/db/queries"
import { CommunityCampaignsClient } from "@/app/(routes)/(community)/community/campaigns/community-campaigns-client"

export default async function CmOpportunitiesPage() {
  await ensureSeedData()

  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  const campaigns = await getAllActiveCampaigns()

  let cmWorkspace: any = null
  if (session?.user?.id) {
    const userWorkspaces = await getUserWorkspaces(session.user.id)
    cmWorkspace = userWorkspaces.find((w) => w.type === "cm" || w.type === "community") || userWorkspaces[0]
  }

  if (!cmWorkspace) {
    cmWorkspace = { id: "ws_alphaseekers", name: "Alpha Seekers DAO", handle: "alphaseekers" }
  }

  return (
    <CommunityCampaignsClient
      initialCampaigns={campaigns}
      userWorkspace={cmWorkspace}
    />
  )
}

