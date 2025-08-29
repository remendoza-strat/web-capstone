import { Webhook } from "svix"
import { NextResponse } from "next/server"
import { updateUserAction } from "@/lib/db/actions"
import { NewUser } from "@/lib/db/schema"
import { createUserAction } from "@/lib/db/actions"

// Creating user event
type ClerkUserCreatedEvent = {
  type: "user.created";
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string;
    last_name: string;
  };
};

// Updating user event
type ClerkUserUpdatedEvent = {
  type: "user.updated";
  data: {
    id: string;
    first_name?: string;
    last_name?: string;
  };
};

export async function POST(req: Request){
  // Data from clerk
  const payload = await req.text();

  // No webhook secret set
  if(!process.env.CLERK_WEBHOOK_SECRET){
    return new NextResponse("Webhook verification secret not configured.", { status: 500 });
  }

  // Webhook verifier
  const svix = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  // Event type
  let evt: ClerkUserCreatedEvent | ClerkUserUpdatedEvent;

  // Verify payload
  try{
    evt = svix.verify(payload, {
      "svix-id": req.headers.get("svix-id")!,
      "svix-timestamp": req.headers.get("svix-timestamp")!,
      "svix-signature": req.headers.get("svix-signature")!
    }) as any;
  } 
  catch{
    return new NextResponse("Webhook verification failed.", { status: 401 });
  }

  // Create user event
  if(evt.type === "user.created"){
    // Get data
    const { id, email_addresses, first_name, last_name } = evt.data;

    // Create new user
    const newUser: NewUser = {
      clerkId: id,
      email: email_addresses?.[0]?.email_address,
      fname: first_name,
      lname: last_name
    };

    // Check creation of user
    const result = await createUserAction(newUser);
    if (result) return new NextResponse("User already exists.", { status: 409 });
    return new NextResponse("User created.", { status: 201 });
  }

  // Update user event
  if(evt.type === "user.updated"){
    // Get data
    const { id, first_name, last_name } = evt.data;
    
    // Update user
    updateUserAction(id, {fname: first_name, lname: last_name})
    return new NextResponse("User updated.", { status: 200 });
  }

  // Event not handled
  return new NextResponse(null, { status: 200 });
}