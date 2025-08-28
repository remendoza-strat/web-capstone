import { NextResponse, type NextRequest } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    const { newPassword } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!newPassword) {
      return NextResponse.json({ error: "Missing new password" }, { status: 400 });
    }

    const client = await clerkClient();
    await client.users.updateUser(userId, { password: newPassword });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Password change error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
