import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { requireRole } from "@/lib/requireRole";

interface Params {
  params: {
    id: string;
  };
}

export async function PUT(req: Request, { params }: Params) {
  const { user, error } = await requireRole(["CLIENT"]);
  if (error) return error;

  const body = await req.json();

  const existing = await prisma.financialGoal.findUnique({
    where: { id: params.id },
  });

  if (!existing || existing.userId !== (user as any).userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.financialGoal.update({
    where: { id: params.id },
    data: {
      ...body,
      ...(body.deadline && { deadline: new Date(body.deadline) }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Params) {
  const { user, error } = await requireRole(["CLIENT"]);
  if (error) return error;

  const existing = await prisma.financialGoal.findUnique({
    where: { id: params.id },
  });

  if (!existing || existing.userId !== (user as any).userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.financialGoal.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ message: "Deleted" });
}