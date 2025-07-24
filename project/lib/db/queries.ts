import { eq } from "drizzle-orm"
import { db } from "@/lib/db/connection"
import { users } from "@/lib/db/schema"
import type { NewUser } from "@/lib/db/schema"

export const queries = {
  users: {
    createUser: async (newUser: NewUser) => {
      // Check if clerkId is already used
      const existing = await db.query.users.findFirst({
        where: eq(users.clerkId, newUser.clerkId)
      });

      // Create user if no duplication
      if(!existing){
        await db.insert(users).values(newUser).execute();
      }

      // Return account with existing clerkId
      return existing;
    }
  }
};