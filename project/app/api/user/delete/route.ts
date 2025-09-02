import { NextRequest, NextResponse } from "next/server"
import { deleteUserAction } from "@/lib/db/user_actions"
import { clerkClient } from "@clerk/clerk-sdk-node"
import { getAuth } from "@clerk/nextjs/server"

export async function DELETE(req: NextRequest){
  try{
    // Get id of requesting deletion
    const { userId } = getAuth(req);

    // Check if there is user id
    if(!userId){
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    // Delete user in db and clerk
    await deleteUserAction(userId);
    await clerkClient.users.deleteUser(userId);
    return NextResponse.json({ ok: true }, { status: 200 });
  } 
  catch(err: any){
    // Return error
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}