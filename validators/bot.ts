import { z } from "zod";

export const botCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  system_prompt: z
    .string()
    .min(10, "System prompt must be at least 10 characters")
    .max(2000, "System prompt too long"),
  model: z.enum([
    "anthropic/claude-3.5-sonnet",
    "anthropic/claude-3-haiku",
    "openai/gpt-4-turbo",
    "openai/gpt-3.5-turbo",
    "google/gemini-pro",
  ]),
  temperature: z.number().min(0).max(2).default(0.7),
  max_tokens: z.number().min(100).max(4000).default(1000),
});

export const botUpdateSchema = botCreateSchema.partial();

export type BotCreateInput = z.infer<typeof botCreateSchema>;
export type BotUpdateInput = z.infer<typeof botUpdateSchema>;
