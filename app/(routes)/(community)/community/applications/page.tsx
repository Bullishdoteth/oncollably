import React from "react"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { ensureSeedData } from "@/lib/db/seed"
import { getApplicationsForApplicant, getUserWorkspaces } from "@/lib/db/queries"
import { CommunityApplicationsClient } from "./community-applications-client"

export default async function CommunityApplicationsPage() {
  await ensureSeedData()

  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  let applications: any[] = []
  if (session?.user?.id) {
    const userWorkspaces = await getUserWorkspaces(session.user.id)
    const communityWorkspace = userWorkspaces.find((w) => w.type === "community") || userWorkspaces[0]
    if (communityWorkspace) {
      applications = await getApplicationsForApplicant(communityWorkspace.id)
    }
  }

  if (applications.length === 0) {
    applications = await getApplicationsForApplicant("ws_alphaseekers")
  }

  return <CommunityApplicationsClient initialApplications={applications} />
}
