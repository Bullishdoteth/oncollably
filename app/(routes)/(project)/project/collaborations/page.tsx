import React from "react"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { ensureSeedData } from "@/lib/db/seed"
import { getUserWorkspaces, getCollaborationsForProject } from "@/lib/db/queries"
import { db } from "@/lib/db/db"
import { workspace } from "@/lib/db/schema"
import { ProjectCollaborationsClient } from "./project-collaborations-client"

export default async function ProjectCollaborationsPage() {
  await ensureSeedData()

  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  let currentWorkspace = null
  if (session?.user) {
    const userWorkspaces = await getUserWorkspaces(session.user.id)
    currentWorkspace = userWorkspaces.find((w) => w.type === "project") || userWorkspaces[0]
  }

  if (!currentWorkspace) {
    const [firstWs] = await db.select().from(workspace).limit(1)
    if (firstWs) {
      currentWorkspace = firstWs
    }
  }

  const workspaceId = currentWorkspace?.id
  const acceptedCollabs = workspaceId ? await getCollaborationsForProject(workspaceId) : []

  return <ProjectCollaborationsClient initialCollaborations={acceptedCollabs} />
}

