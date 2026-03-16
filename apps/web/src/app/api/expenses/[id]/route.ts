import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { requireRole } from "@/lib/requireRole";
import { withErrorHandling } from "@/lib/errorHandler";
import { updateExpense, deleteExpense } from "@/services/expense.service";


interface Params {
  params: {
    id: string;
  };
}

export const PUT = withErrorHandling(async (req: Request, { params }: Params) => {
  const { user, error } = await requireRole(["USER"]);
  if (error) return error;

  const body = await req.json();

  const existing = await prisma.expense.findUnique({
    where: { id: params.id },
  });

  if (!existing || existing.userId !== (user as any).userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await updateExpense(params.id, body);

  return NextResponse.json(updated);
});

export const DELETE = withErrorHandling(async (req: Request, { params }: Params) => {
  const { user, error } = await requireRole(["USER"]);
  if (error) return error;

  const existing = await prisma.expense.findUnique({
    where: { id: params.id },
  });

  if (!existing || existing.userId !== (user as any).userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await deleteExpense(params.id);

  return NextResponse.json({ message: "Deleted" });
});