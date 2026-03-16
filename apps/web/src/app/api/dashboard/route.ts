import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { requireRole } from "@/lib/requireRole";
import { withErrorHandling } from "@/lib/errorHandler";

export const GET = withErrorHandling(async () => {
  const { user, error } = await requireRole(["USER","ADMIN"]);
  if (error) return error;

  const userId = (user as any).userId;

  const profile = await prisma.profile.findUnique({
    where: { userId }
  });

  const expenses = await prisma.expense.findMany({
    where: { userId }
  });

  const goals = await prisma.financialGoal.findMany({
    where: { userId }
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryBreakdown = expenses.reduce((acc: any, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const savings = (profile?.income || 0) - totalExpenses;

  return NextResponse.json({
    income: profile?.income || 0,
    totalExpenses,
    savings,
    categoryBreakdown,
    goals
  });
});