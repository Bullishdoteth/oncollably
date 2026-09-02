import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { workspace, user } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const handleParam = searchParams.get("handle");

    if (!handleParam || !handleParam.trim()) {
      return NextResponse.json({ available: true });
    }

    const cleanHandle = handleParam.trim().toLowerCase().replace(/^@/, "");

    // Check workspace table
    const existingWorkspace = await db
      .select({ id: workspace.id })
      .from(workspace)
      .where(or(eq(workspace.handle, cleanHandle), eq(workspace.id, cleanHandle)));

    if (existingWorkspace.length > 0) {
      return NextResponse.json({ available: false, reason: "Handle already taken by another workspace" });
    }

    // Check user table
    const existingUser = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.handle, cleanHandle));

    if (existingUser.length > 0) {
      return NextResponse.json({ available: false, reason: "Handle already taken by another user" });
    }

    return NextResponse.json({ available: true });
  } catch (error: any) {
    console.error("Error checking handle availability:", error);
    return NextResponse.json({ available: true, error: error?.message });
  }
}
