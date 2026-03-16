import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { requireRole } from "@/lib/requireRole";
import { withErrorHandling } from "@/lib/errorHandler";
import { createExpense, getExpenses } from "@/services/expense.service";
import { expenseSchema } from "@/validators/expense";

export const POST = withErrorHandling(async (req: Request) => {
  const { user, error } = await requireRole(["USER"]);
  if (error) return error;

  const body = expenseSchema.parse(await req.json());

  const expense = await createExpense((user as any).userId, body);

  return NextResponse.json(expense);
});

export const GET = withErrorHandling(async (req: Request) => {
  const { user, error } = await requireRole(["CLIENT"]);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") || undefined;

  const expenses = await getExpenses((user as any).userId, month);


  return NextResponse.json(expenses);
});