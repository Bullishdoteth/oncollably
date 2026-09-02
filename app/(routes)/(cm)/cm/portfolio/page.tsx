import React from "react"
import { ensureSeedData } from "@/lib/db/seed"
import { getCmPortfolioItems } from "@/lib/db/queries"
import { CmPortfolioClient } from "./cm-portfolio-client"

export default async function CmPortfolioPage() {
  await ensureSeedData()

  const workspaceId = "ws_collabmanager"
  const items = await getCmPortfolioItems(undefined, workspaceId)

  return <CmPortfolioClient initialItems={items} />
}
