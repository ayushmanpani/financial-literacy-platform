import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { requireRole } from "@/lib/requireRole";

export async function POST(req: Request) {
  const { error } = await requireRole(["ADMIN"]);
  if (error) return error;

  const body = await req.json();
  const { name, description, eligibilityRules } = body;

  const scheme = await prisma.governmentScheme.create({
    data: {
      name,
      description,
      eligibilityRules,
    },
  });

  return NextResponse.json(scheme);
}

export async function GET() {
  const { error } = await requireRole(["ADMIN"]);
  if (error) return error;

  const schemes = await prisma.governmentScheme.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(schemes);
}