import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/db";
import { user, workspace } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendWorkspaceWelcomeEmail } from "@/services/email";
import { createInAppNotification } from "@/services/notifications";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { optionId, name, handle, discord, twitter, website, bio, avatarUrl, selectedEcosystems } = body;

    let workspaceType = "project";
    if (optionId === "connect_community") {
      workspaceType = "community";
    } else if (optionId === "manage_collaborations") {
      workspaceType = "cm";
    }

    const formattedName = name?.trim() ? name.trim() : session.user.name;
    const formattedHandle = handle?.trim() ? handle.trim() : `ws_${Date.now()}`;
    const ecosystemsStr = Array.isArray(selectedEcosystems)
      ? selectedEcosystems.join(",")
      : "";

    // 1. Create workspace in DB with active and free status
    const workspaceId = `ws_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    await db.insert(workspace).values({
      id: workspaceId,
      userId: session.user.id,
      name: formattedName,
      handle: formattedHandle,
      type: workspaceType,
      discord: discord?.trim() || null,
      twitter: twitter?.trim() || null,
      website: website?.trim() || null,
      bio: bio?.trim() || null,
      ecosystems: ecosystemsStr,
      avatarUrl: avatarUrl?.trim() || null,
      status: "active",
      paid: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Fire welcome email & in-app notification asynchronously
    if (session.user.email) {
      sendWorkspaceWelcomeEmail({
        to: session.user.email,
        name: session.user.name || "Creator",
        workspaceName: formattedName,
        workspaceType,
      }).catch((err) => console.error("Error sending workspace welcome email:", err));
    }

    createInAppNotification({
      userId: session.user.id,
      workspaceId,
      title: "Workspace Created",
      message: `Welcome to Oncollably! Workspace '${formattedName}' has been successfully created.`,
      type: "system",
      link: `/${workspaceType}`,
    }).catch((err) => console.error("Error creating welcome notification:", err));

    // 2. Mark user onboarded immediately
    await db
      .update(user)
      .set({
        onboarded: true,
        workspaceType,
        handle: formattedHandle,
        discord: discord?.trim() || null,
        twitter: twitter?.trim() || null,
        bio: bio?.trim() || null,
        image: avatarUrl?.trim() || null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({
      success: true,
      requiresPayment: false,
      workspaceType,
      redirectUrl: `/${workspaceType}`,
    });
  } catch (error: any) {
    console.error("Onboarding API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process workspace onboarding" },
      { status: 500 }
    );
  }
}
