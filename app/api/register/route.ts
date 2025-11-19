import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Organization, User } from "@/models";
import { registerSchema } from "@/validators/auth";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, organizationName } =
      registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create organization slug from name
    const slug = organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check if organization slug exists
    const existingOrg = await Organization.findOne({ where: { slug } });
    if (existingOrg) {
      return NextResponse.json(
        { error: "Organization name already taken" },
        { status: 400 }
      );
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create organization
    const organization = await Organization.create({
      name: organizationName,
      slug,
      email,
      subscription_tier: "free",
      message_quota: 1000,
      messages_used: 0,
      branding_config: {},
    });

    // Create user
    const user = await User.create({
      organization_id: organization.id,
      email,
      password_hash,
      name,
      role: "owner",
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
