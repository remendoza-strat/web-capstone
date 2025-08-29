import { deleteUserAction } from "@/lib/db/actions";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    await deleteUserAction(userId);
    await clerkClient.users.deleteUser(userId);
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Error deleting user" },
      { status: 500 }
    );
  }
}