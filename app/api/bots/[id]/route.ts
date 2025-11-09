import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Bot } from "@/models";
import { botUpdateSchema } from "@/validators/bot";
import { ZodError } from "zod";

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

    return NextResponse.json(bot);
  } catch (error) {
    console.error("Error fetching bot:", error);
    return NextResponse.json(
      { error: "Failed to fetch bot" },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const validated = botUpdateSchema.parse(body);

    await bot.update(validated);

    return NextResponse.json(bot);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating bot:", error);
    return NextResponse.json(
      { error: "Failed to update bot" },
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

    const bot = await Bot.findOne({
      where: {
        id: params.id,
        organization_id: session.user.organizationId,
      },
    });

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    await bot.destroy();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting bot:", error);
    return NextResponse.json(
      { error: "Failed to delete bot" },
      { status: 500 }
    );
  }
}
