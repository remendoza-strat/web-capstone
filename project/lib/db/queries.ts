import { and, eq, inArray } from "drizzle-orm"
import { db } from "@/lib/db/connection"
import { users, projects, projectMembers, tasks, taskAssignees, comments } from "@/lib/db/schema"
import type { NewUser, NewProject, NewProjectMember, NewTask, NewTaskAssignee } from "@/lib/db/schema"

export const queries = {

  // Users queries
  users: {
    createUser: async (newUser: NewUser) => {
      const result = await db.query.users.findFirst({
        where: eq(users.clerkId, newUser.clerkId)
      });

      if(!result){
        await db.insert(users).values(newUser).execute();
      }

      return result;
    },
    getUserId: async (clerkId: string) => {
      const result = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkId)
      });

      return result?.id;
    },
  },

  // Projects queries
  projects: {
    createProject: async (newProject: NewProject) => {
      const [result] = await db.insert(projects).values(newProject)
        .returning({ id: projects.id });

      return result.id;
    },
    deleteProject: async (projectId: string) => {
      await db.delete(projects).where(eq(projects.id, projectId));
    },
    updateProject: async (projectId: string, updProject: Partial<typeof projects.$inferInsert>) => {
      await db.update(projects)
      .set({...updProject})
      .where(eq(projects.id, projectId));
    },
    getUserProjects: async (userId: string) => {
      const query = await db.query.projectMembers.findMany({
        where: (pm, {and, eq}) => and(eq(pm.approved, true), eq(pm.userId, userId)),
        with: {project: {with: {members: {with: {user: true}}, tasks: true}}}
      })

      const result = query.map((q) => ({...q.project, members: q.project.members.filter((member) => member.approved === true)}));
      return result;
    },
    updateProjectTime: async (projectId: string) => {
      await db.update(projects)
        .set({ updatedAt: new Date() })
        .where(eq(projects.id, projectId));
    },
    getProjectData: async (projectId: string) => {
      const query = await db.query.projects.findFirst({
        where: (p, {eq}) => eq(p.id, projectId),
        with: {members: {with: {user: true}}, tasks: true}
      });

      const result = query? {...query, members: query.members.filter(member => member.approved === true)} : null
      return result;
    },
    getProjectWithTasks: async (projectId: string) => {
      const result = await db.query.projects.findFirst({
        where: (p, {eq}) => eq(p.id, projectId),
        with: {tasks: true}
      });
      
      return result;
    },
    getProject: async (projectId: string) => {
      const result = await db.query.projects.findFirst({
        where: eq(projects.id, projectId)
      })
      return result;
    }
  },

  // Project members queries
  projectMembers: {
    createProjectMember: async (newProjectMember: NewProjectMember) => {
      await db.insert(projectMembers).values(newProjectMember).execute();
    },
    getNonProjectMembers: async (projectId: string) => {
      const query1 = await db.query.projectMembers.findMany({
        where: (pm, {eq}) => eq(pm.projectId, projectId),
        with: {user: true}
      });

      const addedIds = query1.map((q) => q.user.id);
      
      const query2 = await db
        .select()
        .from(users);

      const result = query2.filter((q) => !addedIds.includes(q.id))
      return result;
    },
    getProjectMembers: async (projectId: string) => {
      const query = await db.query.projectMembers.findMany({
        where: (pm, {eq}) => eq(pm.projectId, projectId),
        with: {user: true}
      })

      const result = query.filter((member) => member.approved);
      return result;
    }
  },

  // Tasks queries
  tasks: {
    createTask: async (newTask: NewTask) => {
      const [result] = await db.insert(tasks).values(newTask)
        .returning({ id: tasks.id });

      return result.id;
    },
    deleteTask: async (taskId: string) => {
      await db.delete(tasks).where(eq(tasks.id, taskId));
    },
    updateTask: async (taskId: string, updTask: Partial<typeof tasks.$inferInsert>) => {
      await db.update(tasks)
      .set({...updTask})
      .where(eq(tasks.id, taskId));
    },
    getUserTasks: async (userId: string) => {
      const query = await db.query.taskAssignees.findMany({
        where: (ta, {eq}) => eq(ta.userId, userId),
        with: {task: true}
      });
      
      const result = query.map((q) => q.task);
      return result;
    },
  },

  // Task assignees queries
  taskAssignees: {
    createTaskAssignee: async (newTaskAssignee: NewTaskAssignee) => {
      await db.insert(taskAssignees).values(newTaskAssignee).execute();
    },
  },

};

























export const getQueries = {

  getUserProjectsWithMembers: async (userId: string) => {
    const result = await db.query.projectMembers.findMany({
      where: (pm, {and, eq}) => and(eq(pm.approved, true), eq(pm.userId, userId)),
      with: {project: {with: {members: {with: {user: true}}}}}
    });
    return result;
  },

  getAllUsers: async () => {
    const result = await db.select().from(users);
    return result;
  },

  getUserProjects: async (userId: string) => {
    const query = await db.query.projectMembers.findMany({
      where: (pm, {and, eq}) => and(eq(pm.approved, true), eq(pm.userId, userId)),
      with: {project: {with: {members: {with: {user: true}}, tasks: true}}}
    })
    const result = query.map((q) => ({...q.project, members: q.project.members.filter((member) => member.approved === true)}));
    return result;
  },
  
}

export const createQueries = {

  createProjectMember: async (newProjectMember: NewProjectMember) => {
    await db.insert(projectMembers).values(newProjectMember).execute();
  },

  createProject: async (newProject: NewProject) => {
    const [query] = await db.insert(projects).values(newProject)
      .returning({ id: projects.id });

    const result = query.id;
    return result;
  },
  
}

export const updateQueries = {

  updateProjectMember: async (pmId: string, updPm: Partial<typeof projectMembers.$inferInsert>) => {
    await db.update(projectMembers).set({...updPm}).where(eq(projectMembers.id, pmId));
  },

}

export const deleteQueries = {
  
  deleteProject: async (projectId: string) => {
    await db.delete(projects).where(eq(projects.id, projectId));
  },

  deleteProjectMember: async (pmId: string) => {
    await db.delete(projectMembers).where(eq(projectMembers.id, pmId));
  },

  deleteTaskAssignee: async (projectId: string, userId: string) => {
    await db.delete(taskAssignees).where(
      and(
        eq(taskAssignees.userId, userId),
        inArray(
          taskAssignees.taskId,
          db.select({ id: tasks.id }).from(tasks).where(eq(tasks.projectId, projectId))
        )
      )
    );
  },

  deleteComment: async (projectId: string, userId: string) => {
    await db.delete(comments).where(
      and(
        eq(comments.userId, userId),
        inArray(
          comments.taskId,
          db.select({ id: tasks.id }).from(tasks).where(eq(tasks.projectId, projectId))
        )
      )
    );
  },

}