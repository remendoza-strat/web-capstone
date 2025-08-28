
import { updateUserAction } from "@/lib/db/actions";
import { Webhook } from "svix"
import { NextResponse } from "next/server"
import { NewUser } from "@/lib/db/schema"
import { createUserAction, deleteUserAction } from "@/lib/db/actions"
import { clerkClient } from "@clerk/clerk-sdk-node";

type ClerkUserUpdatedEvent = {
  type: "user.updated";
  data: {
    id: string;
    first_name?: string;
    last_name?: string;
  };
};

type ClerkUserCreatedEvent = {
  type: "user.created";
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string;
    last_name: string;
  }
};

export async function POST(req: Request) {
  const payload = await req.text();

  const svix = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: ClerkUserCreatedEvent | ClerkUserUpdatedEvent;

  try {
    evt = svix.verify(payload, {
      "svix-id": req.headers.get("svix-id")!,
      "svix-timestamp": req.headers.get("svix-timestamp")!,
      "svix-signature": req.headers.get("svix-signature")!
    }) as any;
  } catch (err) {
    return new NextResponse("Webhook verification failed", { status: 400 });
  }

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    const newUser: NewUser = {
      clerkId: id,
      email: email_addresses?.[0]?.email_address,
      fname: first_name,
      lname: last_name,
    };

    const result = await createUserAction(newUser);

    if (result) return new NextResponse("User already exists", { status: 409 });

    return new NextResponse("User created", { status: 200 });
  }

  if (evt.type === "user.updated") {
    const { id, first_name, last_name } = evt.data;

  updateUserAction(id, {fname: first_name, lname: last_name})

    return new NextResponse("User updated", { status: 200 });
  }

  return new NextResponse(null, { status: 200 });
}



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