import OpenAI from "openai";

if (!process.env.OPENROUTER_API_KEY) {
  console.warn("⚠️  OPENROUTER_API_KEY not set");
}

export const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "dummy-key",
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "AI Chat Agent Platform",
  },
});

export async function streamChatCompletion(
  messages: Array<{ role: string; content: string }>,
  model: string = "anthropic/claude-3.5-sonnet",
  temperature: number = 0.7,
  max_tokens: number = 1000
) {
  const stream = await openrouter.chat.completions.create({
    model,
    messages,
    stream: true,
    temperature,
    max_tokens,
  });

  return stream;
}

export async function createChatCompletion(
  messages: Array<{ role: string; content: string }>,
  model: string = "anthropic/claude-3.5-sonnet",
  temperature: number = 0.7,
  max_tokens: number = 1000
) {
  const response = await openrouter.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens,
  });

  return response.choices[0]?.message?.content || "";
}
