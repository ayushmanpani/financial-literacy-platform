import { NextResponse } from "next/server";
import { requireRole } from "@/lib/requireRole";

export async function GET() {
  const { user, error } = await requireRole(["ADMIN"]);

  if (error) return error;

  return NextResponse.json({
    message: "Welcome Admin",
    user,
  });
}