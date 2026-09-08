import { NextResponse } from "next/server";
import { getCommunitiesWithProfiles } from "@/lib/db/queries";

export async function GET() {
  try {
    const communities = await getCommunitiesWithProfiles();
    return NextResponse.json({
      success: true,
      communities,
    });
  } catch (error: any) {
    console.error("GET /api/workspaces/communities Error:", error);
    return NextResponse.json({ success: false, communities: [] }, { status: 500 });
  }
}
