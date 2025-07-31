import { and, or, eq, notInArray, ilike, inArray, count, gt, lt, desc } from "drizzle-orm"
import { db } from "@/lib/db/connection"
import { users, projects, projectMembers, tasks, taskAssignees } from "@/lib/db/schema"
import type { NewUser, NewProject, NewProjectMember, NewTask, NewTaskAssignee } from "@/lib/db/schema"

export const queries = {

  // Users queries
  users: {
    createUser: async (newUser: NewUser) => {
      const result = await db.query.users.findFirst({
        where: eq(users.clerkId, newUser.clerkId)
      });

      if(!result){
        await db
          .insert(users)
          .values(newUser)
          .execute();
      }

      return result;
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
    getProjectDeadline: async (projectId: string) => {
      const result = await db
        .select({ dueDate: projects.dueDate })
        .from(projects)
        .where(eq(projects.id, projectId));
      return result;
    },
    getUserActiveProjectCount: async (userId: string) => {
      const memberships = await queries.projectMembers.getUserMembership(userId);
      const projectIds = memberships.map((m) => m.projectId);

      if (projectIds.length === 0) return 0;

      const now = new Date();

      const result = await db
        .select({ count: count() })
        .from(projects)
        .innerJoin(tasks, eq(tasks.projectId, projects.id))
        .where(
          and(
            inArray(projects.id, projectIds),
            gt(projects.dueDate, now),
            lt(tasks.position, 100)
          )
        );

      return Number(result[0].count);
    },
    getUserOverdueProjectCount: async (userId: string) => {
      const memberships = await queries.projectMembers.getUserMembership(userId);
      const projectIds = memberships.map((m) => m.projectId);

      if (projectIds.length === 0) return 0;

      const now = new Date();

      const result = await db
        .select({ count: count() })
        .from(projects)
        .innerJoin(tasks, eq(tasks.projectId, projects.id))
        .where(
          and(
            inArray(projects.id, projectIds),
            lt(projects.dueDate, now),
            lt(tasks.position, 100)
          )
        );

      return Number(result[0].count);
    },
    getUserProjectsInfo: async (userId: string) => {
      const memberships = await queries.projectMembers.getUserMembership(userId);
      const projectIds = memberships.map((m) => m.projectId);

      if (projectIds.length === 0) return [];

      const projectsRaw = await db
        .select({
          project: projects,
          memberCount: count(projectMembers.id).as("memberCount")
        })
        .from(projects)
        .leftJoin(projectMembers, 
          and(
            eq(projects.id, projectMembers.projectId),
            eq(projectMembers.approved, true)
          )
        )
        .where(inArray(projects.id, projectIds))
        .groupBy(projects.id)
        .orderBy(desc(projects.updatedAt));

      const allTasks = await db
        .select({
          id: tasks.id,
          position: tasks.position,
          columnCount: tasks.columnCount,
          projectId: tasks.projectId
        })
        .from(tasks)
        .where(inArray(tasks.projectId, projectIds));

      const computeTaskProgress = (position: number, columnCount: number) => {
        if (position === 100) return 100;
        if (columnCount <= 0) return 0;
        return Math.round((position / columnCount) * 100);
      };

      const result = projectsRaw.map((proj) => {
        const projectTasks = allTasks.filter((task) => task.projectId === proj.project.id);
        const taskCount = projectTasks.length;

        const totalProgress = projectTasks.reduce((acc, task) => {
          return acc + computeTaskProgress(task.position, task.columnCount);
        }, 0);

        const progress = taskCount > 0 ? Math.round(totalProgress / taskCount) : 0;

        return{
          project: proj.project,
          memberCount: Number(proj.memberCount),
          taskCount,
          progress
        };
      });

      return result;
    },
    updateProjectTime: async (projectId: string) => {
      await db
        .update(projects)
        .set({updatedAt: new Date()})
        .where(eq(projects.id, projectId));
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
    getUserMembership: async (userId: string) => {
      const result = await db
        .select({
          projectId: projects.id,
          projectName: projects.name
        })
        .from(projectMembers)
        .innerJoin(projects, eq(projects.id, projectMembers.projectId))
        .where(
          and(
            eq(projectMembers.userId, userId),
            eq(projectMembers.approved, true)
          )
        )
      return result;
    },
    getNonProjectMembers: async (projectId: string, query: string) => {
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
    getProjectMembers: async (projectId: string, query: string) => {
      if (!query) return []; 
      
      const existingMembers = await db
        .select({ userId: projectMembers.userId })
        .from(projectMembers)
        .where(
          and(
            eq(projectMembers.projectId, projectId),
            eq(projectMembers.approved, true)
          )
        );

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
            inArray(users.id, existingMembersIds),
            or(
              ilike(users.fname, `%${query}%`),
              ilike(users.lname, `%${query}%`),
              ilike(users.email, `%${query}%`)
            )
          )
        );

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
    getUserActiveTaskCount: async (userId: string) => {
      const now = new Date();

      const result = await db
        .select({ count: count() })
        .from(taskAssignees)
        .innerJoin(tasks, eq(taskAssignees.taskId, tasks.id))
        .where(
          and(
            eq(taskAssignees.userId, userId),
            gt(tasks.dueDate, now),
            lt(tasks.position, 100)
          )
        );

      return Number(result[0].count);
    },
    getUserOverdueTaskCount: async (userId: string) => {
      const now = new Date();

      const result = await db
        .select({ count: count() })
        .from(taskAssignees)
        .innerJoin(tasks, eq(taskAssignees.taskId, tasks.id))
        .where(
          and(
            eq(taskAssignees.userId, userId),
            lt(tasks.dueDate, now),
            lt(tasks.position, 100)
          )
        );
        
      return Number(result[0].count);
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