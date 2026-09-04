import React from "react"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { ensureSeedData } from "@/lib/db/seed"
import { getApplicationsForProject, getUserWorkspaces } from "@/lib/db/queries"
import { db } from "@/lib/db/db"
import { workspace } from "@/lib/db/schema"
import { ProjectApplicationsClient } from "./project-applications-client"

export default async function ProjectApplicationsPage() {
  await ensureSeedData()

  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  let applications: any[] = []
  if (session?.user?.id) {
    const userWorkspaces = await getUserWorkspaces(session.user.id)
    const projectWorkspace = userWorkspaces.find((w) => w.type === "project") || userWorkspaces[0]
    if (projectWorkspace) {
      applications = await getApplicationsForProject(projectWorkspace.id)
    }
  }

  if (applications.length === 0) {
    const [firstWs] = await db.select().from(workspace).limit(1)
    if (firstWs) {
      applications = await getApplicationsForProject(firstWs.id)
    }
  }

  return <ProjectApplicationsClient initialApplications={applications} />
}
