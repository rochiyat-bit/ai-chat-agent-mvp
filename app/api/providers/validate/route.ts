import { NextRequest, NextResponse } from "next/server";
import { validateAgentRouterKey } from "@/lib/ai/agentrouter";

export async function POST(req: NextRequest) {
  try {
    const { provider, apiKey } = await req.json();

    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: "Provider and API key are required" },
        { status: 400 }
      );
    }

    let isValid = false;

    if (provider === "agentrouter") {
      isValid = await validateAgentRouterKey(apiKey);
    } else {
      return NextResponse.json(
        { error: "Unsupported provider" },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error("Key validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate API key" },
      { status: 500 }
    );
  }
}
