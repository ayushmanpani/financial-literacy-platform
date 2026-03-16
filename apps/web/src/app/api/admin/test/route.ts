import { NextResponse } from "next/server";
import { requireRole } from "@/lib/requireRole";
import { withErrorHandling } from "@/lib/errorHandler";

export const GET = withErrorHandling(async () => {
  const { user, error } = await requireRole(["ADMIN"]);

  if (error) return error;

  return NextResponse.json({
    message: "Welcome Admin",
    user,
  });
});