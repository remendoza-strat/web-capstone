import { NextResponse, type NextRequest } from "next/server"
import { getAuth, clerkClient } from "@clerk/nextjs/server"
import { PasswordSchema } from "@/lib/validations"

export async function POST(req: NextRequest){
  try{
    // Get user and new password
    const { userId } = getAuth(req);
    const { newPassword } = await req.json();

    // Check if there is user id
    if(!userId){
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    // Check if there is password
    if(!newPassword){
      return NextResponse.json({ error: "Missing new password." }, { status: 400 });
    }

    // Validate input
    const result = PasswordSchema.safeParse({
      pword: newPassword
    });

    // Error from validation
    if(!result.success){
      return NextResponse.json({ error: "Incorrect password format." }, { status: 400 });
    }

    // Update the password
    const client = await clerkClient();
    await client.users.updateUser(userId, { password: newPassword });

    // Return success
    return NextResponse.json({ ok: true }, { status: 200 });
  } 
  catch(err: any){
    // Return error
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}