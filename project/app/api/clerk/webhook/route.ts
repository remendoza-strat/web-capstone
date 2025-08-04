import { Webhook } from "svix"
import { NextResponse } from "next/server"
import { NewUser } from "@/lib/db/schema"
import { createUserAction } from "@/lib/db/actions"

// Payload from user.created webhook
type ClerkUserCreatedEvent = {
  type: "user.created";
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string;
    last_name: string;
  }
};

export async function POST(req: Request){
  // Get raw request body
  const payload = await req.text();

  // Webhook verifier
  const svix = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  
  // Variable for webhook data
  let evt: ClerkUserCreatedEvent;

  // Verify the webhook payload
  try{
    evt = svix.verify(payload, {
      "svix-id": req.headers.get("svix-id")!,
      "svix-timestamp": req.headers.get("svix-timestamp")!,
      "svix-signature": req.headers.get("svix-signature")!
    }) as ClerkUserCreatedEvent;
  } 
  catch(err){
    return new NextResponse("Webhook verification failed", { status: 400 });
  }

  // Process event if it is user.created
  if(evt.type === "user.created"){
    // Get data
    const { id, email_addresses, first_name, last_name } = evt.data;

    // Create object of new user
    const newUser: NewUser = {
      clerkId: id,
      email: email_addresses?.[0]?.email_address,
      fname: first_name,
      lname: last_name
    }

    // Try to create user in database
    const result = await createUserAction(newUser);

    // When user with same clerkId already exist
    if(result){
      return new NextResponse("User already exists", { status: 409 });
    }

    // New user is created
    return new NextResponse("User created", { status: 200 });
  }

  // Proceed if event type is not handled
  return new NextResponse(null, { status: 200 });
}