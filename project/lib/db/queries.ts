import { eq } from "drizzle-orm"
import { db } from "@/lib/db/connection"
import { users, projects, projectMembers } from "@/lib/db/schema"
import type { NewUser, NewProject, NewProjectMember } from "@/lib/db/schema"

export const queries = {

  // Users queries
  users: {
    createUser: async (newUser: NewUser) => {
      const existing = await db.query.users.findFirst({
        where: eq(users.clerkId, newUser.clerkId)
      });
      if(!existing){
        await db.insert(users).values(newUser).execute();
      }
      return existing;
    },
    getUserId: async (clerkId: string) => {
      const user = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkId),
        columns: { id: true }
      });
      return user?.id ?? null;
    }
  },

  // Project queries
  projects: {
    createProject: async (newProject: NewProject) => {
      const [project] = await db.insert(projects).values(newProject).returning({ id: projects.id });
      return project.id;
    }
  },

  // Project members queries
  projectMembers: {
    addProjectMember: async (newProjectMember: NewProjectMember) => {
      await db.insert(projectMembers).values(newProjectMember).execute();
    }
  }
  
};