import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { withErrorHandling } from "@/lib/errorHandler";

export const GET = withErrorHandling(async () => {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
});