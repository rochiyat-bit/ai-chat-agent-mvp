import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Lead, Conversation, Bot } from "@/models";
import { leadCaptureSchema } from "@/validators/chat";
import { ZodError } from "zod";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const leads = await Lead.findAll({
      include: [
        {
          model: Conversation,
          as: "conversation",
        },
        {
          model: Bot,
          as: "bot",
          where: { organization_id: session.user.organizationId },
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, name, email, phone, company } =
      leadCaptureSchema.parse(body);

    // Validate conversation exists
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Check if lead already exists for this conversation
    const existingLead = await Lead.findOne({
      where: { conversation_id: conversationId },
    });

    if (existingLead) {
      return NextResponse.json(
        { error: "Lead already exists for this conversation" },
        { status: 400 }
      );
    }

    const lead = await Lead.create({
      conversation_id: conversationId,
      bot_id: conversation.bot_id,
      name,
      email,
      phone,
      company,
      qualification_status: "new",
      lead_score: 50,
    });

    // Update conversation status
    await conversation.update({
      status: "qualified",
      visitor_name: name,
      visitor_email: email,
      visitor_phone: phone,
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
