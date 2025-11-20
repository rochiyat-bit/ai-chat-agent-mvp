import { NextRequest, NextResponse } from "next/server";
import { getAgentRouterModels } from "@/lib/ai/agentrouter";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const provider = searchParams.get("provider");

    if (!provider) {
      return NextResponse.json(
        { error: "Provider is required" },
        { status: 400 }
      );
    }

    let models: string[] = [];

    if (provider === "agentrouter") {
      models = await getAgentRouterModels();
    } else if (provider === "openrouter") {
      // OpenRouter models
      models = [
        "anthropic/claude-3.5-sonnet",
        "anthropic/claude-3-haiku",
        "openai/gpt-4-turbo",
        "openai/gpt-3.5-turbo",
        "google/gemini-pro",
        "google/gemini-flash",
        "meta-llama/llama-3.1-70b-instruct",
        "meta-llama/llama-3.1-8b-instruct",
      ];
    } else {
      return NextResponse.json(
        { error: "Unsupported provider" },
        { status: 400 }
      );
    }

    return NextResponse.json({ models });
  } catch (error) {
    console.error("Get models error:", error);
    return NextResponse.json(
      { error: "Failed to get models" },
      { status: 500 }
    );
  }
}
