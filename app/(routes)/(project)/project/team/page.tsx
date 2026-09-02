import React from "react"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { ensureSeedData } from "@/lib/db/seed"
import { getUserWorkspaces, getWorkspaceByHandle, getTeamMembers } from "@/lib/db/queries"
import { ProjectTeamClient } from "./project-team-client"

export default async function ProjectTeamPage() {
  await ensureSeedData()

  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  let currentWorkspace = null
  if (session?.user) {
    const userWorkspaces = await getUserWorkspaces(session.user.id)
    currentWorkspace = userWorkspaces.find((w) => w.type === "project") || userWorkspaces[0]
  }
  if (!currentWorkspace) {
    currentWorkspace = await getWorkspaceByHandle("cybersamurai")
  }

  const workspaceId = currentWorkspace?.id || "ws_cybersamurai"
  const dbMembers = await getTeamMembers(workspaceId)

  // Format initial members from DB or session
  const initialMembers = dbMembers.length > 0 ? dbMembers.map((m) => ({
    id: m.id,
    name: m.email.split("@")[0],
    email: m.email,
    role: m.role || "Collab Manager",
    status: m.status || "Active",
    avatar: m.email.charAt(0).toUpperCase(),
  })) : [
    {
      id: session?.user?.id || "owner_1",
      name: session?.user?.name || "Workspace Lead",
      email: session?.user?.email || "lead@cybersamurai.io",
      role: "Owner",
      status: "Active",
      avatar: (session?.user?.name || "W").charAt(0).toUpperCase(),
    }
  ]

  return <ProjectTeamClient workspaceId={workspaceId} initialMembers={initialMembers} />
}
