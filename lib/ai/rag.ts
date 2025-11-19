import { sequelize } from "@/lib/sequelize";
import { generateEmbedding } from "./embeddings";
import { QueryTypes } from "sequelize";

export async function retrieveRelevantContext(
  botId: string,
  query: string,
  limit: number = 5
): Promise<string[]> {
  try {
    const queryEmbedding = await generateEmbedding(query);

    // Use pgvector for similarity search
    const results = await sequelize.query(
      `
      SELECT dc.content, dc.metadata,
             (dc.embedding <=> CAST(:embedding AS vector)) AS distance
      FROM "DocumentChunks" dc
      INNER JOIN "Documents" d ON dc.document_id = d.id
      WHERE d.bot_id = :botId
        AND d.processing_status = 'completed'
      ORDER BY distance ASC
      LIMIT :limit
    `,
      {
        replacements: {
          embedding: JSON.stringify(queryEmbedding),
          botId,
          limit,
        },
        type: QueryTypes.SELECT,
      }
    );

    return results.map((r: any) => r.content);
  } catch (error) {
    console.error("Error retrieving context:", error);
    return [];
  }
}

export async function buildPromptWithContext(
  systemPrompt: string,
  userQuery: string,
  context: string[],
  conversationHistory: Array<{ role: string; content: string }>
): Promise<Array<{ role: string; content: string }>> {
  const contextText =
    context.length > 0
      ? `\n\nRelevant knowledge base information:\n${context.join("\n\n")}`
      : "";

  const enhancedSystemPrompt = `${systemPrompt}${contextText}

Instructions:
- Answer based on the provided knowledge base when relevant
- If information is not in the knowledge base, clearly state that
- Be helpful, concise, and professional
- Always try to capture lead information naturally in conversation`;

  return [
    { role: "system", content: enhancedSystemPrompt },
    ...conversationHistory.slice(-10), // Last 10 messages for context
    { role: "user", content: userQuery },
  ];
}
