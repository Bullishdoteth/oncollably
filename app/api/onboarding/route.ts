import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { db } from "@/lib/db/db"
import { user } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { optionId, name, handle, discord, twitter, bio } = body

    // Map optionId to workspace type
    let workspaceType = "project"
    if (optionId === "connect_community") {
      workspaceType = "community"
    } else if (optionId === "manage_collaborations") {
      workspaceType = "cm"
    }

    // Update user record in database
    await db
      .update(user)
      .set({
        onboarded: true,
        workspaceType,
        name: name?.trim() ? name.trim() : session.user.name,
        handle: handle?.trim() ? handle.trim() : null,
        discord: discord?.trim() ? discord.trim() : null,
        twitter: twitter?.trim() ? twitter.trim() : null,
        bio: bio?.trim() ? bio.trim() : null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    return NextResponse.json({
      success: true,
      workspaceType,
      redirectUrl: `/${workspaceType}`,
    })
  } catch (error: any) {
    console.error("Onboarding API Error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to save onboarding settings" },
      { status: 500 }
    )
  }
}
