import { NextResponse } from "next/server";
import { getUserFromCookie } from "./getUser";

export async function requireRole(allowedRoles: string[]) {
  const user = await getUserFromCookie();

  if (!user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      user: null,
    };
  }

  console.log("User role:", (user as any).role);
  console.log("Allowed roles:", allowedRoles);
  if (!allowedRoles.includes((user as any).role)) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      user: null,
    };
  }

  return { user, error: null };
}