import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

const handlers = toNextJsHandler(auth);

export async function GET(request: NextRequest) {
  try {
    const res = await handlers.GET(request);
    return res;
  } catch (error) {
    console.error("[BetterAuth API GET Error]:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const res = await handlers.POST(request);
    return res;
  } catch (error) {
    console.error("[BetterAuth API POST Error]:", error);
    throw error;
  }
}
