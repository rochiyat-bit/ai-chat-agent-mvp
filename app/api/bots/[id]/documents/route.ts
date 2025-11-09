import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Bot, Document } from "@/models";
import { processDocument } from "@/lib/ai/document-processor";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bot = await Bot.findOne({
      where: {
        id: params.id,
        organization_id: session.user.organizationId,
      },
    });

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    const documents = await Document.findAll({
      where: { bot_id: params.id },
      order: [["created_at", "DESC"]],
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bot = await Bot.findOne({
      where: {
        id: params.id,
        organization_id: session.user.organizationId,
      },
    });

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    const body = await req.json();
    const { filename, file_url, file_size, file_type } = body;

    // Create document record
    const document = await Document.create({
      bot_id: params.id,
      filename,
      file_url,
      file_size,
      file_type,
      processing_status: "pending",
    });

    // Process document asynchronously
    processDocument(document.id)
      .then(async () => {
        // Update bot knowledge base status
        await bot.update({ knowledge_base_status: "ready" });
      })
      .catch((error) => {
        console.error("Document processing failed:", error);
      });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID required" },
        { status: 400 }
      );
    }

    const document = await Document.findByPk(documentId);
    if (!document || document.bot_id !== params.id) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    await document.destroy();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
