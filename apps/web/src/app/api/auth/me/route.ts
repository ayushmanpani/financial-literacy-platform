import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/getUser";
import { withErrorHandling } from "@/lib/errorHandler";

export const GET = withErrorHandling(async () => {
  const user = await getUserFromCookie();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(user);
});