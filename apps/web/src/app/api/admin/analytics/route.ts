import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { requireRole } from "@/lib/requireRole";
import { withErrorHandling } from "@/lib/errorHandler";
import { getAdminAnalytics } from "@/services/analytics.service";

export const GET = withErrorHandling(async () => {

  const { error } = await requireRole(["ADMIN"]);
  if (error) return error;

  const analytics = await getAdminAnalytics();

  return NextResponse.json(analytics);
});