import { prisma } from "@repo/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "User exists" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed },
  });

  const token = signToken({ userId: user.id, role: user.role });

  const response = NextResponse.json({ message: "User created" });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  return response;
}