import { and, eq, inArray } from "drizzle-orm"
import { db } from "@/lib/db/connection"
import { users, projects, projectMembers, tasks, taskAssignees, comments } from "@/lib/db/schema"
import type { NewUser, NewProject, NewProjectMember, NewTask, NewTaskAssignee, NewComment } from "@/lib/db/schema"

export const checkQueries = {

  getUser: async (userId: string) => {
    const result = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });
    return result;
  },

  getProject: async (projectId: string) => {
    const result = await db.query.projects.findFirst({
      where: eq(projects.id, projectId)
    });
    return result;
  },

  getProjectMember: async (projectMemberId: string) => {
    const result = await db.query.projectMembers.findFirst({
      where: eq(projectMembers.id, projectMemberId)
    });
    return result;
  },

  getTask: async (taskId: string) => {
    const result = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId)
    });
    return result;
  },

  getTaskAssignee: async (taskAssigneeId: string) => {
    const result = await db.query.taskAssignees.findFirst({
      where: eq(taskAssignees.id, taskAssigneeId)
    });
    return result;
  },

  getComment: async (commentId: string) => {
    const result = await db.query.comments.findFirst({
      where: eq(comments.id, commentId)
    });
    return result;
  },

  getMembership: async (userId: string, projectId: string) => {
    const result = await db.query.projectMembers.findFirst({
      where: (pm, {eq, and}) => and(
        eq(pm.userId, userId),
        eq(pm.projectId, projectId),
        eq(pm.approved, true)
      )
    });
    return result;
  },

}

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

  getUserTasks: async (userId: string) => {
    const result = await db.query.taskAssignees.findMany({
      where: (ta, { eq }) => eq(ta.userId, userId),
      with: { task: {with: {project: true}}}
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

  updateProjectMember: async (projectMemberId: string, updProjectMember: Partial<typeof projectMembers.$inferInsert>) => {
    await db.update(projectMembers).set({...updProjectMember}).where(eq(projectMembers.id, projectMemberId));
  },

  updateProject: async (projectId: string, updProject: Partial<typeof projects.$inferInsert>) => {
    await db.update(projects).set({...updProject}).where(eq(projects.id, projectId));
  },

  updateComment: async (commentId: string, updComment: Partial<typeof comments.$inferInsert>) => {
    await db.update(comments).set({...updComment}).where(eq(comments.id, commentId));
  },

  updateUser: async (clerkId: string, updUser: Partial<typeof users.$inferInsert>) => {
    await db.update(users).set({...updUser}).where(eq(users.clerkId, clerkId));
  },

}

export const deleteQueries = {
  
  deleteProject: async (projectId: string) => {
    await db.delete(projects).where(eq(projects.id, projectId));
  },

  deleteProjectMember: async (projectMemberId: string) => {
    await db.delete(projectMembers).where(eq(projectMembers.id, projectMemberId));
  },

  deleteTaskAssignee: async (taskAssigneeId: string) => {
    await db.delete(taskAssignees).where(eq(taskAssignees.id, taskAssigneeId));
  },

  deleteComment: async (commentId: string) => {
    await db.delete(comments).where(eq(comments.id, commentId));
  },

  deleteUser: async (clerkId: string) => {
    await db.delete(users).where(eq(users.clerkId, clerkId));
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