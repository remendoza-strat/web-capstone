import { and, eq, inArray } from "drizzle-orm"
import { db } from "@/lib/db/connection"
import { users, projects, projectMembers, tasks, taskAssignees, comments } from "@/lib/db/schema"
import type { NewUser, NewProject, NewProjectMember, NewTask, NewTaskAssignee, NewComment } from "@/lib/db/schema"

export const getQueries = {

  getUserId: async (clerkId: string) => {
    const result = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId)
    });
    return result?.id;
  },

  getUserProjectsWithMembers: async (userId: string) => {
    const result = await db.query.projectMembers.findMany({
      where: (pm, {and, eq}) => and(pm.approved, eq(pm.userId, userId)),
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
      where: (pm, {eq}) => eq(pm.userId, userId),
      with: {project: {with: {members: {with: {user: true}}, tasks: true}}}
    })
    const result = query.map((q) => ({...q.project}));
    return result;
  },

  getProjectData: async (projectId: string) => {
    const result = await db.query.projects.findFirst({
      where: (p, {eq}) => eq(p.id, projectId),
      with: {members: {with: {user: true}}, tasks: {with: {assignees: {with: {user: true}}}}}
    });
    return result;
  },
  
  getTaskData: async (taskId: string) => {
    const result = await db.query.tasks.findFirst({
      where: (t, {eq}) => eq(t.id, taskId),
      with: {project: {with: {members: {where: (pm, {eq}) => eq(pm.approved, true), with: {user: true}}}}, assignees: {with: {user: true}}, comments: {with: {user: true}}}
    });
    return result;
  },

}

export const createQueries = {

  createUser: async (newUser: NewUser) => {
    const result = await db.query.users.findFirst({
      where: eq(users.clerkId, newUser.clerkId)
    });
    if(!result){
      await db.insert(users).values(newUser).execute();
    }
    return result;
  },

  createProjectMember: async (newProjectMember: NewProjectMember) => {
    await db.insert(projectMembers).values(newProjectMember).execute();
  },

  createTaskAssignee: async (newTaskAssignee: NewTaskAssignee) => {
    await db.insert(taskAssignees).values(newTaskAssignee).execute();
  },

  createProject: async (newProject: NewProject) => {
    const [query] = await db.insert(projects).values(newProject)
      .returning({ id: projects.id });
    const result = query.id;
    return result;
  },

  createTask: async (newTask: NewTask) => {
    const [query] = await db.insert(tasks).values(newTask)
      .returning({ id: tasks.id });
    const result = query.id;
    return result;
  },

  createComment: async (newComment: NewComment) => {
    await db.insert(comments).values(newComment).execute();
  },

}

export const updateQueries = {

  updateProjectMember: async (pmId: string, updPm: Partial<typeof projectMembers.$inferInsert>) => {
    await db.update(projectMembers).set({...updPm}).where(eq(projectMembers.id, pmId));
  },

  updateProject: async (projectId: string, updProject: Partial<typeof projects.$inferInsert>) => {
    await db.update(projects).set({...updProject}).where(eq(projects.id, projectId));
  },

  updateComment: async (cId: string, updComment: Partial<typeof comments.$inferInsert>) => {
    await db.update(comments).set({...updComment}).where(eq(comments.id, cId));
  },

}

export const deleteQueries = {
  
  deleteProject: async (projectId: string) => {
    await db.delete(projects).where(eq(projects.id, projectId));
  },

  deleteProjectMember: async (pmId: string) => {
    await db.delete(projectMembers).where(eq(projectMembers.id, pmId));
  },

  deleteComment: async (cId: string) => {
    await db.delete(comments).where(eq(comments.id, cId));
  },

  deleteAllTaskAssignee: async (projectId: string, userId: string) => {
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

  deleteAllComment: async (projectId: string, userId: string) => {
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