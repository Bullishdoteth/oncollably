import { NextResponse } from "next/server";
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";
import { POLAR_WEBHOOK_SECRET } from "@/lib/polar";
import { db } from "@/lib/db/db";
import { user, workspace, workspaceSubscription } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const requestBody = await request.text();
    const headers = Object.fromEntries(request.headers.entries());

    if (!POLAR_WEBHOOK_SECRET) {
      console.error("POLAR_WEBHOOK_SECRET is missing");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    let event: any;
    try {
      event = validateEvent(requestBody, headers, POLAR_WEBHOOK_SECRET);
    } catch (err: any) {
      if (err instanceof WebhookVerificationError) {
        console.error("Polar Webhook Verification Failed:", err.message);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
      console.error("Polar Webhook Parsing Error:", err);
      return NextResponse.json({ error: "Webhook error" }, { status: 400 });
    }

    const eventType = event.type;
    const data = event.data;

    console.log(`Polar Webhook Event Received: ${eventType}`);

    if (eventType === "order.created" || eventType === "checkout.updated") {
      const checkoutStatus = data?.status;
      const metadata = data?.metadata || data?.checkout_metadata || {};
      const userId = metadata?.userId;
      const workspaceId = metadata?.workspaceId;

      const isSuccessful =
        eventType === "order.created" || checkoutStatus === "succeeded";

      if (isSuccessful && userId) {
        const orderId = data?.id || `ord_${Date.now()}`;
        const checkoutId = data?.checkout_id || data?.id;
        const customerId = data?.customer_id;
        const amount = data?.amount || 1000;
        const currency = data?.currency || "usd";

        // 1. Mark User as Onboarded
        await db
          .update(user)
          .set({
            onboarded: true,
            updatedAt: new Date(),
          })
          .where(eq(user.id, userId));

        // 2. If Workspace ID is present, update workspace status to active & paid
        if (workspaceId) {
          await db
            .update(workspace)
            .set({
              status: "active",
              paid: true,
              updatedAt: new Date(),
            })
            .where(eq(workspace.id, workspaceId));

          // 3. Record payment order in workspaceSubscription table
          const subId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          await db.insert(workspaceSubscription).values({
            id: subId,
            userId,
            workspaceId,
            polarCheckoutId: checkoutId || null,
            polarOrderId: orderId || null,
            polarCustomerId: customerId || null,
            amount: typeof amount === "number" ? amount : 1000,
            currency,
            status: "succeeded",
            productType: metadata?.product_type || "workspace_activation",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error processing Polar Webhook:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
