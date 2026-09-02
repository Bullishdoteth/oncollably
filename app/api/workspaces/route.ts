import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getUserWorkspaces } from "@/lib/db/queries";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json({ workspaces: [] });
    }

    const userWorkspaces = await getUserWorkspaces(session.user.id);

    return NextResponse.json({
      success: true,
      workspaces: userWorkspaces,
    });
  } catch (error: any) {
    console.error("GET /api/workspaces Error:", error);
    return NextResponse.json({ workspaces: [] }, { status: 500 });
  }
}
