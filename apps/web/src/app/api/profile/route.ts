import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { profileSchema } from "@/validators/profile";
import { requireRole } from "@/lib/requireRole";
import { withErrorHandling } from "@/lib/errorHandler";
import { createProfile } from "@/services/profile.service";

export const POST = withErrorHandling(async (req: Request) => {
  try {
    const { user, error } = await requireRole(["USER"]);
    if (error) return error;

    const body = profileSchema.parse(await req.json());
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

    const profile = await createProfile((user as any).userId, body);

    return NextResponse.json(profile);
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid Request Data" },
      { status: 400 }
    );
  }
});

export const GET = withErrorHandling(async () => {
  const { user, error } = await requireRole(["USER"]);
  if (error) return error;

  const profile = await prisma.profile.findUnique({
    where: { userId: (user as any).userId },
  });

  return NextResponse.json(profile);
});

export const PUT = withErrorHandling(async (req: Request) => {
  const { user, error } = await requireRole(["USER"]);
  if (error) return error;

  const body = await req.json();

  const updated = await prisma.profile.update({
    where: { userId: (user as any).userId },
    data: body,
  });

  return NextResponse.json(updated);
});