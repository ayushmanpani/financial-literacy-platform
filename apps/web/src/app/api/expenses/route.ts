import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { requireRole } from "@/lib/requireRole";

export async function POST(req: Request) {
  const { user, error } = await requireRole(["CLIENT"]);
  if (error) return error;

  const body = await req.json();
  const { category, amount, month } = body;

  const expense = await prisma.expense.create({
    data: {
      userId: (user as any).userId,
      category,
      amount,
      month,
    },
  });

  return NextResponse.json(expense);
}

export async function GET(req: Request) {
  const { user, error } = await requireRole(["CLIENT"]);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");

  const expenses = await prisma.expense.findMany({
    where: {
      userId: (user as any).userId,
      ...(month ? { month } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(expenses);
}