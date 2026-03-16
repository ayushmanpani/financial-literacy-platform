import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { requireRole } from "../../../../lib/requireRole";
import { withErrorHandling } from "@/lib/errorHandler";

export const GET = withErrorHandling(async () => {
  const { user, error } = await requireRole(["USER","ADMIN"]);
  if (error) return error;

  const userId = (user as any).userId;

  const profile = await prisma.profile.findUnique({
    where: { userId: (user as any).userId },
  });

  const expenses = await prisma.expense.findMany({
    where: { userId: (user as any).userId },
  });

  const expenseAmounts = expenses.map((e) => e.amount);

  const response = await fetch("http://ml:8000/optimize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      income: profile?.income,
      expenses: expenseAmounts,
    }),
  });

  const data = await response.json();

  await prisma.budgetAnalysis.create({
    data: {
      userId,
      totalExpense: data.total_expense,
      savings: data.savings,
      suggestion: data.suggestion
    }
  });

  return NextResponse.json(data);
});