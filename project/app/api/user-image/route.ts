import { clerkClient } from "@clerk/clerk-sdk-node"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest){
  // Get clerk id from url parameter
  const { searchParams } = new URL(req.url);
  const clerkId = searchParams.get("clerkId");

  // Validate the clerk id
  if(!clerkId) return;

  try{
    // Fetch user
    const user = await clerkClient.users.getUser(clerkId);

    // Return image url
    return NextResponse.json({ imageUrl: user.imageUrl ?? null });
  } 
  catch{return}
}