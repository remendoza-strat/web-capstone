"use server"
import { queries } from "@/lib/db/queries"
import type { NewUser, NewProject, NewProjectMember, NewTask, NewTaskAssignee } from "@/lib/db/schema"
import { projects, tasks } from "@/lib/db/schema"






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

// Create project member
export async function createProjectMemberAction(newProjectMember: NewProjectMember){
  await queries.projectMembers.createProjectMember(newProjectMember);
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

// CREATE ACTIONS-----------------------------------------------------------------

// Create task
// Return: id
export async function createTaskAction(newTask: NewTask){
  return await queries.tasks.createTask(newTask);
}

// Create task assignee
// Return: none
export async function createTaskAssigneeAction(newTaskAssignee: NewTaskAssignee){
  await queries.taskAssignees.createTaskAssignee(newTaskAssignee);
}

// UPDATE ACTIONS-----------------------------------------------------------------

// Update project
export async function updateProjectAction(projectId: string, updProject: Partial<typeof projects.$inferInsert>){
  await queries.projects.updateProject(projectId, updProject);
}

// Update task
export async function updateTaskAction(taskId: string, updTask: Partial<typeof tasks.$inferInsert>){
  await queries.tasks.updateTask(taskId, updTask);
}

// DELETE ACTIONS-----------------------------------------------------------------

// Delete project
export async function deleteProjectAction(projectId: string){
  await queries.projects.deleteProject(projectId);
}

// Delete task
export async function deleteTaskAction(taskId: string){
  await queries.tasks.deleteTask(taskId);
}
//-----------------------------------------------DONE SECTION-----------------------------------------------/