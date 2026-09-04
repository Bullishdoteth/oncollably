import React from "react"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { ensureSeedData } from "@/lib/db/seed"
import { getCmPortfolioItems, getUserWorkspaces } from "@/lib/db/queries"
import { db } from "@/lib/db/db"
import { workspace } from "@/lib/db/schema"
import { CmPortfolioClient } from "./cm-portfolio-client"

export default async function CmPortfolioPage() {
  await ensureSeedData()

  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  let userId: string | undefined = session?.user?.id
  let workspaceId: string | undefined

  if (userId) {
    const userWorkspaces = await getUserWorkspaces(userId)
    const cmWorkspace = userWorkspaces.find((w) => w.type === "cm") || userWorkspaces[0]
    if (cmWorkspace) {
      workspaceId = cmWorkspace.id
    }
  }

  if (!workspaceId) {
    const [firstWs] = await db.select().from(workspace).limit(1)
    if (firstWs) {
      workspaceId = firstWs.id
      userId = userId || firstWs.userId || undefined
    }
  }

  const items = await getCmPortfolioItems(userId, workspaceId)

  return (
    <CmPortfolioClient
      initialItems={items}
      userId={userId}
      workspaceId={workspaceId}
    />
  )
}
