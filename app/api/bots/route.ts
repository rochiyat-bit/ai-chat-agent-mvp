import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Bot } from "@/models";
import { botCreateSchema } from "@/validators/bot";
import { ZodError } from "zod";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bots = await Bot.findAll({
      where: { organization_id: session.user.organizationId },
      order: [["created_at", "DESC"]],
    });

    return NextResponse.json(bots);
  } catch (error) {
    console.error("Error fetching bots:", error);
    return NextResponse.json(
      { error: "Failed to fetch bots" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = botCreateSchema.parse(body);

    const bot = await Bot.create({
      ...validated,
      organization_id: session.user.organizationId,
      is_active: true,
      knowledge_base_status: "empty",
    });

    return NextResponse.json(bot, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating bot:", error);
    return NextResponse.json(
      { error: "Failed to create bot" },
      { status: 500 }
    );
  }
}
