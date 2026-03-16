import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { requireRole } from "@/lib/requireRole";
import { withErrorHandling } from "@/lib/errorHandler";

export const POST = withErrorHandling(async (req: Request) => {
  const { user, error } = await requireRole(["USER"]);
  if (error) return error;

  const body = await req.json();
  const { targetAmount, deadline } = body;

  const goal = await prisma.financialGoal.create({
    data: {
      userId: (user as any).userId,
      targetAmount,
      deadline: new Date(deadline),
    },
  });

  return NextResponse.json(goal);
});

export const GET = withErrorHandling(async () => {
  const { user, error } = await requireRole(["CLIENT"]);
  if (error) return error;

  const goals = await prisma.financialGoal.findMany({
    where: {
      userId: (user as any).userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(goals);
});