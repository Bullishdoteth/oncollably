import React from "react"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { ensureSeedData } from "@/lib/db/seed"
import { getCollaborationsForCommunity, getUserWorkspaces } from "@/lib/db/queries"
import { CommunityCollaborationsClient } from "./community-collaborations-client"

export default async function CommunityCollaborationsPage() {
  await ensureSeedData()

  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  let collaborations: any[] = []
  if (session?.user?.id) {
    const userWorkspaces = await getUserWorkspaces(session.user.id)
    const communityWorkspace = userWorkspaces.find((w) => w.type === "community") || userWorkspaces[0]
    if (communityWorkspace) {
      collaborations = await getCollaborationsForCommunity(communityWorkspace.id)
    }
  }

  if (collaborations.length === 0) {
    collaborations = await getCollaborationsForCommunity("ws_alphaseekers")
  }

  return <CommunityCollaborationsClient initialCollaborations={collaborations} />
}
