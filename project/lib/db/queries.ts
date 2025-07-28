import { and, or, eq, ne, notInArray, ilike } from "drizzle-orm"
import { db } from "@/lib/db/connection"
import { users, projects, projectMembers } from "@/lib/db/schema"
import type { NewUser, NewProject, NewProjectMember } from "@/lib/db/schema"

export const queries = {

  // Users queries
  users: {
    createUser: async (newUser: NewUser) => {
      const user = await db.query.users.findFirst({
        where: eq(users.clerkId, newUser.clerkId)
      });

      if(!user){
        await db
          .insert(users)
          .values(newUser)
          .execute();
      }

      return user;
    },
    getUserId: async (clerkId: string) => {
      const user = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkId),
        columns: { id: true }
      });

      return user?.id ?? null;
    },
  },

  // Projects queries
  projects: {
    createProject: async (newProject: NewProject) => {
      const [project] = await db
        .insert(projects)
        .values(newProject)
        .returning({ id: projects.id });

      return project.id;
    },
  },

  // Project members queries
  projectMembers: {
    addCreatorAsProjectMember: async (newProjectMember: NewProjectMember) => {
      await db
        .insert(projectMembers)
        .values(newProjectMember)
        .execute();
    },
    getProjectsUserCanAdd: async (userId: string) => {
      const result = await db
        .select({
          projectId: projects.id,
          projectName: projects.name
        })
        .from(projectMembers)
        .innerJoin(projects, eq(projects.id, projectMembers.projectId))
        .where(
          and(eq(projectMembers.userId, userId), ne(projectMembers.role, "Viewer"))
        )
        
      return result;
    },
    getNonMembersOfProject: async (projectId: string, query: string) => {
      if (!query) return [];

      const existingMembers = await db
        .select({ userId: projectMembers.userId })
        .from(projectMembers)
        .where(eq(projectMembers.projectId, projectId));

      const existingUserIds = existingMembers.map((m) => m.userId);

      const matchedUsers = await db
        .select()
        .from(users)
        .where(
          and(
            notInArray(users.id, existingUserIds),
            or(
              ilike(users.fname, `%${query}%`),
              ilike(users.lname, `%${query}%`),
              ilike(users.email, `%${query}%`)
            )
          )
        );

      return matchedUsers;
    },
  },

};