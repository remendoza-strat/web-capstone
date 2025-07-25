import { eq } from "drizzle-orm"
import { db } from "@/lib/db/connection"
import { users, projects } from "@/lib/db/schema"
import type { NewUser, NewProject } from "@/lib/db/schema"

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
    },

    getUserId: async (clerkId: string) => {
      // Get user id with clerk id
      const user = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkId),
        columns: { id: true }
      });

      // Return user id
      return user?.id ?? null;
    }

  },

  projects: {

    // Create project in the database
    createProject: async (newProject: NewProject) => {
      await db.insert(projects).values(newProject).execute();
    }

  }

};