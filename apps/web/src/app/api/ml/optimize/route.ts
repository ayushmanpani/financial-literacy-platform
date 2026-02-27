import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { requireRole } from "../../../../lib/requireRole";

export async function GET() {
  const { user, error } = await requireRole(["CLIENT"]);
  if (error) return error;

  const profile = await prisma.profile.findUnique({
    where: { userId: (user as any).userId },
  });

  const expenses = await prisma.expense.findMany({
    where: { userId: (user as any).userId },
  });

  const expenseAmounts = expenses.map((e) => e.amount);

  const response = await fetch("http://localhost:8000/optimize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      income: profile?.income,
      expenses: expenseAmounts,
    }),
  });

  const data = await response.json();

  return NextResponse.json(data);
}