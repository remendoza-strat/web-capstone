"use server"
import { createQueries, deleteQueries, getQueries, updateQueries } from "@/lib/db/queries"
import type { NewUser, NewProject, NewProjectMember, NewTask, NewTaskAssignee, NewComment, comments } from "@/lib/db/schema"
import { projects, taskAssignees, tasks } from "@/lib/db/schema"
import { db } from "@/lib/db/connection"
import { pusherServer } from "../pusher/server"
import { eq } from "drizzle-orm"
import { projectMembers } from './schema';

// KANBAN ACTIONS
export async function KanbanUpdateTaskAction
  (projectId: string, taskId: string, updTask: Partial<typeof tasks.$inferInsert>){
    
  // Update the task
  await db.update(tasks).set({ ...updTask }).where(eq(tasks.id, taskId));

  // Get full task info to return
  const fullTask = await db.query.tasks.findFirst({ 
    where: eq(tasks.id, taskId),
    with: {assignees: {with: {user: true}}}
  });

  // Broadcast
  await pusherServer.trigger(
    `kanban-channel-${projectId}`,
    "kanban-update",
    { action: "update", task: fullTask }
  );
}
export async function KanbanUpdateProjectAction
  (projectId: string, updProject: Partial<typeof projects.$inferInsert>){
    
  // Update the project
  const updatedProject = await db
    .update(projects)
    .set(updProject)
    .where(eq(projects.id, projectId))
    .returning();

  // Broadcast
  await pusherServer.trigger(
    `kanban-channel-${projectId}`,
    "kanban-update",
    { action: "project", project: updatedProject[0] }
  );
}
export async function KanbanDeleteTaskAction
  (projectId: string, taskId: string){

  // Delete the task
  await db.delete(tasks).where(eq(tasks.id, taskId));

  // Broadcast
  await pusherServer.trigger(
    `kanban-channel-${projectId}`,
    "kanban-update",
    { action: "delete", taskId }
  );
}
export async function KanbanCreateTaskAction
  (projectId: string, newTask: NewTask, assignees: string[]){
  
  // Create task
  const [inserted] = await db
    .insert(tasks)
    .values(newTask)
    .returning({ id: tasks.id });

  // Create task assignees
  if(assignees.length > 0){
    await db.insert(taskAssignees).values(
      assignees.map((userId) => ({
        taskId: inserted.id,
        userId
      }))
    );
  }

  // Get full task info to return
  const fullTask = await db.query.tasks.findFirst({
    where: eq(tasks.id, inserted.id),
    with: {assignees: {with: {user: true}}}
  });

  // Broadcast
  await pusherServer.trigger(
    `kanban-channel-${projectId}`,
    "kanban-update",
    { action: "update", task: fullTask }
  );
}

// GET ACTIONS
export async function getUserIdAction(clerkId: string){
  return await getQueries.getUserId(clerkId);
}
export async function getUserProjectsWithMembersAction(userId: string){
  return await getQueries.getUserProjectsWithMembers(userId);
}
export async function getAllUsersAction(){
  return await getQueries.getAllUsers();
}
export async function getUserProjectsAction(userId: string){
  return await getQueries.getUserProjects(userId);
}
export async function getProjectDataAction(projectId: string){
  return await getQueries.getProjectData(projectId);
}
export async function getTaskDataAction(taskId: string){
  return await getQueries.getTaskData(taskId);
}

// CREATE ACTIONS
export async function createUserAction(newUser: NewUser){
  return await createQueries.createUser(newUser);
}
export async function createProjectAction(newProject: NewProject){
  return await createQueries.createProject(newProject);
}
export async function createTaskAction(newTask: NewTask){
  return await createQueries.createTask(newTask);
}
export async function createTaskAssigneeAction(newTaskAssignee: NewTaskAssignee){
  await createQueries.createTaskAssignee(newTaskAssignee);
}
export async function createProjectMemberAction(newProjectMember: NewProjectMember){
  await createQueries.createProjectMember(newProjectMember);
}
export async function createCommentAction(newComment: NewComment){
  await createQueries.createComment(newComment);
}

// UPDATE ACTIONS
export async function updateProjectAction(projectId: string, updProject: Partial<typeof projects.$inferInsert>){
  await updateQueries.updateProject(projectId, updProject);
}
export async function updateProjectMemberAction(pmId: string, updPm: Partial<typeof projectMembers.$inferInsert>){
  await updateQueries.updateProjectMember(pmId, updPm);
}
export async function updateCommentAction(cId: string, updComment: Partial<typeof comments.$inferInsert>){
  await updateQueries.updateComment(cId, updComment);
}

// DELETE ACTIONS
export async function deleteProjectAction(projectId: string){
  await deleteQueries.deleteProject(projectId);
}
export async function deleteProjectMemberAction(pmId: string){
  await deleteQueries.deleteProjectMember(pmId);
}
export async function deleteTaskAssigneeAction(taId: string){
  await deleteQueries.deleteTaskAssignee(taId);
}
export async function deleteCommentAction(cId: string){
  await deleteQueries.deleteComment(cId);
}
export async function deleteAllTaskAssigneeAction(projectId: string, userId: string){
  await deleteQueries.deleteAllTaskAssignee(projectId, userId);
}
export async function deleteAllCommentAction(projectId: string, userId: string){
  await deleteQueries.deleteAllComment(projectId, userId);
}