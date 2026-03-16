import { prisma } from "@repo/db";

export async function getAdminAnalytics() {
  const totalUsers = await prisma.user.count();
  const schemes = await prisma.governmentScheme.count();
  const goals = await prisma.financialGoal.count();

  const expenses = await prisma.expense.findMany({
    select: { amount: true, category: true }
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryStats: Record<string, number> = {};

  expenses.forEach(e => {
    categoryStats[e.category] =
      (categoryStats[e.category] || 0) + e.amount;
  });

  return {
    totalUsers,
    totalExpenses,
    categoryStats,
    schemes,
    goals
  };
}