import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/db";
import { user, workspace } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { polar, POLAR_PRODUCT_ID } from "@/lib/polar";
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

    // 1. Create or update workspace in DB
    const workspaceId = `ws_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const isPaidOption = optionId === "launch_campaign";
    const initialStatus = isPaidOption ? "pending_payment" : "active";

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
      status: initialStatus,
      paid: !isPaidOption,
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

    // 2. If free workspace (Community / CM), mark user onboarded immediately
    if (!isPaidOption) {
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
    }

    // 3. If Paid Option ("launch_campaign"), generate Polar Checkout URL
    if (!POLAR_PRODUCT_ID) {
      return NextResponse.json(
        { error: "Polar Test Product ID is not set in environment variables" },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${appUrl}/onboarding?status=success&workspace_id=${workspaceId}`;

    const checkout = await polar.checkouts.create({
      products: [POLAR_PRODUCT_ID],
      successUrl,
      customerEmail: session.user.email,
      customerName: session.user.name || undefined,
      metadata: {
        userId: session.user.id,
        workspaceId,
        product_type: "workspace_activation",
      },
    });

    return NextResponse.json({
      success: true,
      requiresPayment: true,
      checkoutUrl: checkout.url,
      workspaceId,
      workspaceType,
    });
  } catch (error: any) {
    console.error("Onboarding API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process workspace onboarding" },
      { status: 500 }
    );
  }
}
