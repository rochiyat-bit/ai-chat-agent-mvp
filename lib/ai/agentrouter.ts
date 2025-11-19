import OpenAI from "openai";

if (!process.env.AGENT_ROUTER_TOKEN) {
  console.warn("⚠️  AGENT_ROUTER_TOKEN not set");
}

export const agentrouter = new OpenAI({
  apiKey: process.env.AGENT_ROUTER_TOKEN || "dummy-key",
  baseURL: "https://agentrouter.org/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "AI Chat Agent Platform",
  },
  timeout: 300000, // 5 minutes for streaming
});

export async function streamChatCompletionAgentRouter(
  messages: Array<{ role: string; content: string }>,
  model: string = "gpt-4o-mini",
  temperature: number = 0.7,
  max_tokens: number = 1000
) {
  const stream = await agentrouter.chat.completions.create({
    model,
    messages,
    stream: true,
    temperature,
    max_tokens,
  });

  return stream;
}

export async function createChatCompletionAgentRouter(
  messages: Array<{ role: string; content: string }>,
  model: string = "gpt-4o-mini",
  temperature: number = 0.7,
  max_tokens: number = 1000
) {
  const response = await agentrouter.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens,
  });

  return response.choices[0]?.message?.content || "";
}

// Validate Agent Router API key
export async function validateAgentRouterKey(apiKey: string): Promise<boolean> {
  try {
    const client = new OpenAI({
      apiKey,
      baseURL: "https://agentrouter.org/v1",
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hi" }],
      max_tokens: 5,
    });

    return !!response.choices[0]?.message?.content;
  } catch (error) {
    console.error("Agent Router key validation failed:", error);
    return false;
  }
}

// Get available models from Agent Router
export async function getAgentRouterModels(): Promise<string[]> {
  // Common models available through Agent Router
  return [
    "gpt-4o",
    "gpt-4o-mini",
    "gpt-4-turbo",
    "gpt-3.5-turbo",
    "claude-3-5-sonnet-20241022",
    "claude-3-5-haiku-20241022",
    "claude-3-opus-20240229",
    "gemini-2.0-flash-exp",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
  ];
}
