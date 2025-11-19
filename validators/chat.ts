import { z } from "zod";

export const chatMessageSchema = z.object({
  message: z.string().min(1, "Message is required").max(1000, "Message too long"),
  conversationId: z.string().uuid().optional(),
  visitorEmail: z.string().email().optional(),
});

export const leadCaptureSchema = z.object({
  conversationId: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email"),
  phone: z.string().max(50).optional(),
  company: z.string().max(100).optional(),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type LeadCaptureInput = z.infer<typeof leadCaptureSchema>;
