import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { requireRole } from "@/lib/requireRole";

export async function POST(req: Request) {
  const { user, error } = await requireRole(["CLIENT"]);
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
}

export async function GET() {
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
}