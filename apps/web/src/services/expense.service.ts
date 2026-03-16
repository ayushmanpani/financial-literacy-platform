import { prisma } from "@repo/db";

export async function createExpense(userId: string, data: any) {
  return prisma.expense.create({
    data: {
      userId,
      ...data
    }
  });
}

export async function getExpenses(userId: string, month?: string) {
  return prisma.expense.findMany({
    where: {
      userId,
      ...(month ? { month } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateExpense(id: string, data: any) {
  return prisma.expense.update({
    where: { id },
    data
  });
}

export async function deleteExpense(id: string) {
  return prisma.expense.delete({
    where: { id }
  });
}