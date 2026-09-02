import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/auth"
import { getUserWorkspaces } from "@/lib/db/queries"

export default async function ProjectLayout({ children }: { children: React.ReactNode }) {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  if (!session || !session.user) {
    redirect("/sign-in")
  }

  const userWorkspaces = await getUserWorkspaces(session.user.id)
  const hasProjectWorkspace = userWorkspaces.some((w) => w.type === "project")

  // If user does NOT have a Project workspace, redirect them to their actual workspace hub
  if (!hasProjectWorkspace) {
    const alternativeWorkspace = userWorkspaces[0]
    if (alternativeWorkspace) {
      const dest = alternativeWorkspace.type === "community" ? "/community" : alternativeWorkspace.type === "cm" ? "/cm" : "/onboarding"
      redirect(dest)
    } else {
      redirect("/onboarding")
    }
  }

  return <>{children}</>
}
