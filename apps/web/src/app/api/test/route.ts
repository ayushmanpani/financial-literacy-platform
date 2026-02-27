import { NextResponse } from "next/server";
import { prisma } from "@repo/db";

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}