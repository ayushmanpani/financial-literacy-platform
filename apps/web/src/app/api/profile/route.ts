import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { requireRole } from "@/lib/requireRole";

export async function POST(req: Request) {
  const { user, error } = await requireRole(["CLIENT"]);
  if (error) return error;

  const body = await req.json();
  const { income, occupation, familySize, location, savingsGoal } = body;

  const existing = await prisma.profile.findUnique({
    where: { userId: (user as any).userId },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Profile already exists" },
      { status: 400 }
    );
  }

  const profile = await prisma.profile.create({
    data: {
      userId: (user as any).userId,
      income,
      occupation,
      familySize,
      location,
      savingsGoal,
    },
  });

  return NextResponse.json(profile);
}

export async function GET() {
  const { user, error } = await requireRole(["CLIENT"]);
  if (error) return error;

  const profile = await prisma.profile.findUnique({
    where: { userId: (user as any).userId },
  });

  return NextResponse.json(profile);
}

export async function PUT(req: Request) {
  const { user, error } = await requireRole(["CLIENT"]);
  if (error) return error;

  const body = await req.json();

  const updated = await prisma.profile.update({
    where: { userId: (user as any).userId },
    data: body,
  });

  return NextResponse.json(updated);
}