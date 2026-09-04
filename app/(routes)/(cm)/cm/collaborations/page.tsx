import React from "react"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { ensureSeedData } from "@/lib/db/seed"
import { getCollaborationsForCommunity, getUserWorkspaces } from "@/lib/db/queries"
import { db } from "@/lib/db/db"
import { workspace } from "@/lib/db/schema"
import { CmCollaborationsClient } from "./cm-collaborations-client"

export default async function CmCollaborationsPage() {
  await ensureSeedData()

  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  let collaborations: any[] = []
  if (session?.user?.id) {
    const userWorkspaces = await getUserWorkspaces(session.user.id)
    const cmWorkspace = userWorkspaces.find((w) => w.type === "cm") || userWorkspaces[0]
    if (cmWorkspace) {
      collaborations = await getCollaborationsForCommunity(cmWorkspace.id)
    }
  }

  if (collaborations.length === 0) {
    const [firstWs] = await db.select().from(workspace).limit(1)
    if (firstWs) {
      collaborations = await getCollaborationsForCommunity(firstWs.id)
    }
  }

  return <CmCollaborationsClient initialCollaborations={collaborations} />
}
