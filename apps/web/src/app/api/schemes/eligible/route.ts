import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { requireRole } from "@/lib/requireRole";;
import { evaluateEligibility } from "@/lib/evaluateEligibility";

export async function GET() {
  const { user, error } = await requireRole(["CLIENT"]);
  if (error) return error;

  const profile = await prisma.profile.findUnique({
    where: { userId: (user as any).userId },
  });

  if (!profile) {
    return NextResponse.json(
      { error: "Profile required" },
      { status: 400 }
    );
  }

  const schemes = await prisma.governmentScheme.findMany();

  const eligible = schemes.filter((scheme) =>
    evaluateEligibility(profile, scheme.eligibilityRules)
  );

  return NextResponse.json(eligible);
}