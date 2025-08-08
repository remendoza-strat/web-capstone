"use server"
import { queries } from "@/lib/db/queries"
import type { NewUser, NewProject, NewProjectMember, NewTask, NewTaskAssignee } from "@/lib/db/schema"

// Return = "id" 
// of user with given clerkId
export async function getUserIdAction(clerkId: string){
  return await queries.users.getUserId(clerkId);
}

// Return = "id"
// of the created newProject
export async function createProjectAction(newProject: NewProject){
  return await queries.projects.createProject(newProject);
}

// Return = "id"
// of the created newTask
export async function createTaskAction(newTask: NewTask){
  return await queries.tasks.createTask(newTask);
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

// Return = project information with its approved members and tasks
// of the given projectId
export async function getProjectByIdAction(projectId: string){
  return await queries.projects.getProjectById(projectId);
}

// Create user
export async function createUserAction(newUser: NewUser){
  return await queries.users.createUser(newUser);
}

// Create project member
export async function createProjectMemberAction(newProjectMember: NewProjectMember){
  await queries.projectMembers.createProjectMember(newProjectMember);
}

// Create task assignee
export async function createTaskAssigneeAction(newTaskAssignee: NewTaskAssignee){
  await queries.taskAssignees.createTaskAssignee(newTaskAssignee);
}

// Update = "updatedAt"
// of given projectId
export async function updateProjectTimeAction(projectId: string){
  await queries.projects.updateProjectTime(projectId);
}