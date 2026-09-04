import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import {
  getWorkspaceNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/services/notifications";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId") || undefined;
    const userId = session?.user?.id || undefined;

    const notifications = await getWorkspaceNotifications(workspaceId, userId);

    return NextResponse.json({
      success: true,
      notifications,
    });
  } catch (error: any) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ notifications: [] }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { notificationId, workspaceId, markAll } = body;

    if (markAll && workspaceId) {
      const res = await markAllNotificationsAsRead(workspaceId);
      return NextResponse.json(res);
    }

    if (notificationId) {
      const res = await markNotificationAsRead(notificationId);
      return NextResponse.json(res);
    }

    return NextResponse.json({ error: "Missing arguments" }, { status: 400 });
  } catch (error: any) {
    console.error("PATCH /api/notifications error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
