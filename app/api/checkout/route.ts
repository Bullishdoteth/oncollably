import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { polar, POLAR_PRODUCT_ID } from "@/lib/polar";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { workspaceId, redirectPath = "/onboarding" } = body;

    if (!POLAR_PRODUCT_ID) {
      return NextResponse.json(
        { error: "Polar Product ID is missing in environment variables" },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${appUrl}${redirectPath}?status=success&checkout_id={CHECKOUT_ID}`;

    const checkout = await polar.checkouts.create({
      products: [POLAR_PRODUCT_ID],
      successUrl,
      customerEmail: session.user.email,
      customerName: session.user.name || undefined,
      metadata: {
        userId: session.user.id,
        workspaceId: workspaceId || "",
        product_type: "workspace_activation",
      },
    });

    return NextResponse.json({
      checkoutUrl: checkout.url,
      checkoutId: checkout.id,
    });
  } catch (error: any) {
    console.error("Polar Checkout Creation Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
