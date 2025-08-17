"use server"
import { createQueries, getQueries, queries } from "@/lib/db/queries"
import type { NewUser, NewProject, NewProjectMember, NewTask, NewTaskAssignee } from "@/lib/db/schema"
import { projects, tasks } from "@/lib/db/schema"
import { db } from "@/lib/db/connection"
import { pusherServer } from "../pusher/server"
import { eq } from "drizzle-orm"






//----------------------------------------
// Return = "id"
// of the created newProject
export async function createProjectAction(newProject: NewProject){
  return await queries.projects.createProject(newProject);
}

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

// Return = projects with its approved project members and tasks
// of the given userId
export async function getUserProjectsAction(userId: string){
  return await queries.projects.getUserProjects(userId);
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
//----------------------------------------









//-----------------------------------------------DONE SECTION-----------------------------------------------/
// QUERY ACTIONS-----------------------------------------------------------------

// Requires: clerk id
// Return: user id
export async function getUserIdAction(clerkId: string){
  return await queries.users.getUserId(clerkId);
}

// Require: project id
// Return: project with members and tasks
export async function getProjectDataAction(projectId: string){
  return await queries.projects.getProjectData(projectId);
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

// CREATE ACTIONS-----------------------------------------------------------------

// Create task assignee
// Return: none
export async function createTaskAssigneeAction(newTaskAssignee: NewTaskAssignee){
  await queries.taskAssignees.createTaskAssignee(newTaskAssignee);
}

// DELETE ACTIONS-----------------------------------------------------------------

// Delete project
export async function deleteProjectAction(projectId: string){
  await queries.projects.deleteProject(projectId);
}
//-----------------------------------------------DONE SECTION-----------------------------------------------/









//-----------------------------------------------DONE SECTION-----------------------------------------------/
// Create task
export async function createTaskAction(projectId: string, newTask: NewTask, socketId?: string){
  const [result] = await db
    .insert(tasks)
    .values(newTask)
    .returning({ id: tasks.id });

  if(result.id){
    await pusherServer.trigger(`kanban-channel-${projectId}`, "task-update", { task: { ...newTask, id: result.id } },
      socketId ? { socket_id: socketId } : undefined
    );
  }

  return result.id;
}

// Update task
export async function updateTaskAction(projectId: string, taskId: string, updTask: Partial<typeof tasks.$inferInsert>, socketId?: string){
  const [result] = await db
    .update(tasks)
    .set({...updTask})
    .where(eq(tasks.id, taskId))
    .returning();

  if(result){
    await pusherServer.trigger(`kanban-channel-${projectId}`, "task-update", { task: result },
      socketId ? { socket_id: socketId } : undefined
    );
  }
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

// Update project
export async function updateProjectAction(projectId: string, updProject: Partial<typeof projects.$inferInsert>, socketId?: string){
  const [result] = await db
    .update(projects)
    .set({...updProject})
    .where(eq(projects.id, projectId))
    .returning();
  
  if(result){
    await pusherServer.trigger(`kanban-channel-${projectId}`, "project-update", { project: result },
      socketId ? { socket_id: socketId } : undefined
    );
  }
}
//-----------------------------------------------DONE SECTION-----------------------------------------------/

















// Used in: team page
// Require: userId
// Result: user projects with its members (approved && not)
export async function getUserProjectsWithMembersAction(userId: string){
  return await getQueries.getUserProjectsWithMembers(userId);
}

// Used in: members-modal/add
// Require: NONE
// Result: all users
export async function getAllUsersAction(){
  return await getQueries.getAllUsers();
}

// Used in: members-modal/add
// Require: newProjectMember
// Result: NONE
export async function createProjectMemberAction(newProjectMember: NewProjectMember){
  await createQueries.createProjectMember(newProjectMember);
}