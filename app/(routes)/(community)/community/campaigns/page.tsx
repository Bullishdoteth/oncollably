import React from "react"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { ensureSeedData } from "@/lib/db/seed"
import { getAllActiveCampaigns, getUserWorkspaces } from "@/lib/db/queries"
import { CommunityCampaignsClient } from "./community-campaigns-client"

export default async function CommunityCampaignsPage() {
  await ensureSeedData()

  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  const campaigns = await getAllActiveCampaigns()

  let communityWorkspace: any = null
  if (session?.user?.id) {
    const userWorkspaces = await getUserWorkspaces(session.user.id)
    communityWorkspace = userWorkspaces.find((w) => w.type === "community" || w.type === "cm") || userWorkspaces[0]
  }

  if (!communityWorkspace) {
    communityWorkspace = { id: "ws_alphaseekers", name: "Alpha Seekers DAO", handle: "alphaseekers" }
  }

  return (
    <CommunityCampaignsClient
      initialCampaigns={campaigns}
      userWorkspace={communityWorkspace}
    />
  )
}

