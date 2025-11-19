import pdf from "pdf-parse";
import { Document, DocumentChunk } from "@/models";
import { generateEmbeddings } from "./embeddings";

export async function processDocument(documentId: string) {
  const document = await Document.findByPk(documentId);
  if (!document) throw new Error("Document not found");

  await document.update({ processing_status: "processing" });

  try {
    // Download file
    const response = await fetch(document.file_url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text based on file type
    let text: string;
    if (document.file_type === "application/pdf") {
      const pdfData = await pdf(buffer);
      text = pdfData.text;
    } else if (
      document.file_type === "text/plain" ||
      document.file_type === "text/markdown"
    ) {
      text = new TextDecoder().decode(buffer);
    } else {
      throw new Error("Unsupported file type");
    }

    // Chunk text
    const chunks = chunkText(text, 500, 50); // 500 chars, 50 overlap

    // Generate embeddings
    const embeddings = await generateEmbeddings(chunks);

    // Save chunks with embeddings
    const chunkRecords = chunks.map((content, index) => ({
      document_id: documentId,
      content,
      embedding: embeddings[index],
      chunk_index: index,
      metadata: {},
    }));

    await DocumentChunk.bulkCreate(chunkRecords);

    await document.update({
      processing_status: "completed",
      chunk_count: chunks.length,
    });
  } catch (error: any) {
    await document.update({
      processing_status: "error",
      error_message: error.message,
    });
    throw error;
  }
}

function chunkText(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;

  // Clean text
  const cleanedText = text.replace(/\s+/g, " ").trim();

  while (start < cleanedText.length) {
    const end = Math.min(start + chunkSize, cleanedText.length);
    chunks.push(cleanedText.slice(start, end));
    start += chunkSize - overlap;
  }

  return chunks.filter((chunk) => chunk.length > 0);
}
