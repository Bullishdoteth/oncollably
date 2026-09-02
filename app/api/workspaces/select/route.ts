import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { db } from "@/lib/db/db"
import { user } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { invalidateUserCache, setCachedActiveWorkspace } from "@/lib/redis/cache"

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { workspaceType, handle } = await request.json()

    if (!workspaceType) {
      return NextResponse.json({ error: "Missing workspaceType" }, { status: 400 })
    }

    const targetHandle = handle || session.user.handle

    await db
      .update(user)
      .set({
        workspaceType,
        handle: targetHandle,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    // Serverless Redis Cache Update & Invalidation (Fail-Open)
    await setCachedActiveWorkspace(session.user.id, {
      userId: session.user.id,
      workspaceType,
      handle: targetHandle,
    })
    await invalidateUserCache(session.user.id)

    return NextResponse.json({
      success: true,
      workspaceType,
    })
  } catch (error: any) {
    console.error("Error switching active workspace:", error)
    return NextResponse.json({ error: error.message || "Failed to switch workspace" }, { status: 500 })
  }
}

