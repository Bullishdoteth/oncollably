import React from "react"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { ensureSeedData } from "@/lib/db/seed"
import { getApplicationsForApplicant, getUserWorkspaces } from "@/lib/db/queries"
import { db } from "@/lib/db/db"
import { workspace } from "@/lib/db/schema"
import { CmApplicationsClient } from "./cm-applications-client"

export default async function CmApplicationsPage() {
  await ensureSeedData()

  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  let applications: any[] = []
  if (session?.user?.id) {
    const userWorkspaces = await getUserWorkspaces(session.user.id)
    const cmWorkspace = userWorkspaces.find((w) => w.type === "cm") || userWorkspaces[0]
    if (cmWorkspace) {
      applications = await getApplicationsForApplicant(cmWorkspace.id)
    }
  }

  if (applications.length === 0) {
    const [firstWs] = await db.select().from(workspace).limit(1)
    if (firstWs) {
      applications = await getApplicationsForApplicant(firstWs.id)
    }
  }

  return <CmApplicationsClient initialApplications={applications} />
}
