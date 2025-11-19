import { NextRequest, NextResponse } from "next/server";
import { streamChatCompletion } from "@/lib/ai/openrouter";
import { streamChatCompletionAgentRouter } from "@/lib/ai/agentrouter";
import { retrieveRelevantContext, buildPromptWithContext } from "@/lib/ai/rag";
import { Bot, Conversation, Message } from "@/models";
import { chatMessageSchema } from "@/validators/chat";
import { ZodError } from "zod";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { message, conversationId, visitorEmail } = chatMessageSchema.parse(body);

    // Get bot
    const bot = await Bot.findByPk(params.id);
    if (!bot || !bot.is_active) {
      return NextResponse.json(
        { error: "Bot not found or inactive" },
        { status: 404 }
      );
    }

    // Get or create conversation
    let conversation: any;
    if (conversationId) {
      conversation = await Conversation.findByPk(conversationId);
    } else {
      conversation = await Conversation.create({
        bot_id: params.id,
        visitor_email: visitorEmail || null,
        status: "active",
        lead_score: 0,
      });
    }

    // Save user message
    await Message.create({
      conversation_id: conversation.id,
      role: "user",
      content: message,
      token_count: Math.ceil(message.length / 4),
    });

    // Get conversation history
    const history = await Message.findAll({
      where: { conversation_id: conversation.id },
      order: [["created_at", "ASC"]],
      limit: 20,
    });

    const conversationHistory = history.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // RAG: Retrieve relevant context
    const context = await retrieveRelevantContext(params.id, message);

    // Build prompt
    const messages = await buildPromptWithContext(
      bot.system_prompt,
      message,
      context,
      conversationHistory
    );

    // Stream response based on provider
    const stream = bot.provider === "agentrouter"
      ? await streamChatCompletionAgentRouter(
          messages,
          bot.model,
          bot.temperature,
          bot.max_tokens
        )
      : await streamChatCompletion(
          messages,
          bot.model,
          bot.temperature,
          bot.max_tokens
        );

    // Create SSE stream
    const encoder = new TextEncoder();
    let fullResponse = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          // Send conversation ID first
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ conversationId: conversation.id })}\n\n`
            )
          );

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            fullResponse += content;

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
            );
          }

          // Save assistant message
          await Message.create({
            conversation_id: conversation.id,
            role: "assistant",
            content: fullResponse,
            token_count: Math.ceil(fullResponse.length / 4),
          });

          // Update conversation
          await conversation.update({
            last_message_at: new Date(),
          });

          // Update bot stats
          await bot.increment("total_messages", { by: 2 });

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
          );
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
