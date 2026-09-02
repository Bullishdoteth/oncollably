import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/auth"
import { getUserWorkspaces } from "@/lib/db/queries"

export default async function CmLayout({ children }: { children: React.ReactNode }) {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  if (!session || !session.user) {
    redirect("/sign-in")
  }

  const userWorkspaces = await getUserWorkspaces(session.user.id)
  const hasCmWorkspace = userWorkspaces.some((w) => w.type === "cm")

  // If user does NOT have a Collab Manager workspace, redirect them to their actual workspace hub
  if (!hasCmWorkspace) {
    const alternativeWorkspace = userWorkspaces[0]
    if (alternativeWorkspace) {
      const dest = alternativeWorkspace.type === "project" ? "/project" : alternativeWorkspace.type === "community" ? "/community" : "/onboarding"
      redirect(dest)
    } else {
      redirect("/onboarding")
    }
  }

  return <>{children}</>
}
