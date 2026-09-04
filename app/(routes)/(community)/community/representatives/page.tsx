import React from "react"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { ensureSeedData } from "@/lib/db/seed"
import { getCommunityRepresentatives, getUserWorkspaces } from "@/lib/db/queries"
import { CommunityRepsClient } from "./community-reps-client"

export default async function CommunityRepsPage() {
  await ensureSeedData()

  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  let workspaceId = "ws_alphaseekers"
  if (session?.user?.id) {
    const userWorkspaces = await getUserWorkspaces(session.user.id)
    const communityWorkspace = userWorkspaces.find((w) => w.type === "community") || userWorkspaces[0]
    if (communityWorkspace) {
      workspaceId = communityWorkspace.id
    }
  }

  const reps = await getCommunityRepresentatives(workspaceId)

  return <CommunityRepsClient communityWorkspaceId={workspaceId} initialReps={reps} />
}
