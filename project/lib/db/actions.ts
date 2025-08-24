"use server"
import { createQueries, deleteQueries, getQueries, queries, updateQueries } from "@/lib/db/queries"
import type { NewUser, NewProject, NewProjectMember, NewTask, NewTaskAssignee } from "@/lib/db/schema"
import { projects, taskAssignees, tasks } from "@/lib/db/schema"
import { db } from "@/lib/db/connection"
import { pusherServer } from "../pusher/server"
import { eq } from "drizzle-orm"
import { projectMembers } from './schema';


// Return = users
// that is not a member of the project or not yet invited
export async function getNonProjectMembersAction(projectId: string){
  return await queries.projectMembers.getNonProjectMembers(projectId);
}

// Return = tasks
// of the given userId
export async function getUserTasksAction(userId: string){
  return await queries.tasks.getUserTasks(userId);
}

// Create user
export async function createUserAction(newUser: NewUser){
  return await queries.users.createUser(newUser);
}


// Update = "updatedAt"
// of given projectId
export async function updateProjectTimeAction(projectId: string){
  await queries.projects.updateProjectTime(projectId);
}

// Requires: clerk id
// Return: user id
export async function getUserIdAction(clerkId: string){
  return await queries.users.getUserId(clerkId);
}


// Require: project id
// Return: project with tasks
export async function getProjectWithTasksAction(projectId: string){
  return await queries.projects.getProjectWithTasks(projectId);
}

// Require: project id
// Return: project data
export async function getProjectAction(projectId: string){
  return await queries.projects.getProject(projectId);
}

// Require: project id
// Return: project members
export async function getProjectMembersAction(projectId: string){
  return await queries.projectMembers.getProjectMembers(projectId);
}

// Delete task
export async function deleteTaskAction(projectId: string, taskId: string, socketId?: string){
  const [result] = await db
    .delete(tasks)
    .where(eq(tasks.id, taskId))
    .returning();

  if(result){
    await pusherServer.trigger(`kanban-channel-${projectId}`, "task-update", { task: result },
      socketId ? { socket_id: socketId } : undefined
    );
  }
}















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

// UPDATE ACTIONS
export async function updateProjectAction(projectId: string, updProject: Partial<typeof projects.$inferInsert>){
  await updateQueries.updateProject(projectId, updProject);
}
export async function updateProjectMemberAction(pmId: string, updPm: Partial<typeof projectMembers.$inferInsert>){
  await updateQueries.updateProjectMember(pmId, updPm);
}

// DELETE ACTIONS
export async function deleteProjectAction(projectId: string){
  await deleteQueries.deleteProject(projectId);
}
export async function deleteProjectMemberAction(pmId: string){
  await deleteQueries.deleteProjectMember(pmId);
}
export async function deleteTaskAssigneeAction(projectId: string, userId: string){
  await deleteQueries.deleteTaskAssignee(projectId, userId);
}
export async function deleteCommentAction(projectId: string, userId: string){
  await deleteQueries.deleteComment(projectId, userId);
}