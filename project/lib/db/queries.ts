import { and, or, eq, ne, notInArray, ilike, inArray } from "drizzle-orm"
import { db } from "@/lib/db/connection"
import { users, projects, projectMembers, tasks, taskAssignees } from "@/lib/db/schema"
import type { NewUser, NewProject, NewProjectMember, NewTask, NewTaskAssignee } from "@/lib/db/schema"

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
    addProjectMember: async (newProjectMember: NewProjectMember) => {
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

      const existingMembersIds = existingMembers.map((m) => m.userId);

      const result = await db
        .select({
          userId: users.id,
          userEmail: users.email,
          userFname: users.fname,
          userLname: users.lname
        })
        .from(users)
        .where(
          and(
            notInArray(users.id, existingMembersIds),
            or(
              ilike(users.fname, `%${query}%`),
              ilike(users.lname, `%${query}%`),
              ilike(users.email, `%${query}%`)
            )
          )
        );

      return result;
    },
    getMembersOfProject: async (projectId: string) => {
      const existingMembers = await db
        .select({ userId: projectMembers.userId })
        .from(projectMembers)
        .where(eq(projectMembers.projectId, projectId));

      const existingMembersIds = existingMembers.map((m) => m.userId);

      const result = await db
        .select({
          userId: users.id,
          userEmail: users.email,
          userFname: users.fname,
          userLname: users.lname
        })
        .from(users)
        .where(inArray(users.id, existingMembersIds));

      return result;
    },
  },

  // Tasks queries
  tasks: {
    createTask: async (newTask: NewTask) => {
      const [task] = await db
        .insert(tasks)
        .values(newTask)
        .returning({ id: tasks.id });

      return task.id;
    },
  },

  // Task assignees queries
  taskAssignees: {
    assignTask: async (taskAssignee: NewTaskAssignee) => {
      await db
        .insert(taskAssignees)
        .values(taskAssignee)
        .execute();
    },
  },

};