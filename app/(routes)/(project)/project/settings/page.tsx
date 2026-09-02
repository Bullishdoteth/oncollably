import React from "react"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { getUserWorkspaces, getWorkspaceByHandle } from "@/lib/db/queries"
import { ProjectSettingsClient } from "./project-settings-client"

export default async function ProjectSettingsPage() {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  let workspaceData = null

  if (session?.user) {
    const userWorkspaces = await getUserWorkspaces(session.user.id)
    workspaceData = userWorkspaces.find((w) => w.type === "project") || userWorkspaces[0]
  }

  if (!workspaceData) {
    workspaceData = await getWorkspaceByHandle("cybersamurai")
  }

  return <ProjectSettingsClient initialWorkspace={workspaceData} />
}
