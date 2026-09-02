import React from "react"
import { ensureSeedData } from "@/lib/db/seed"
import { getApplicationsForProject } from "@/lib/db/queries"
import { ProjectApplicationsClient } from "./project-applications-client"

export default async function ProjectApplicationsPage() {
  await ensureSeedData()

  const workspaceId = "ws_cybersamurai"
  const applications = await getApplicationsForProject(workspaceId)

  return <ProjectApplicationsClient initialApplications={applications} />
}
