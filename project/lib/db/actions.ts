"use server"
import { queries } from "@/lib/db/queries"
import type { NewProject, NewProjectMember, NewTask, NewTaskAssignee } from "@/lib/db/schema"

// Action to get user id with clerk id
export async function getUserIdAction(clerkId: string){
  return await queries.users.getUserId(clerkId);
}

// Action to create project
export async function createProjectAction(newProject: NewProject){
  return await queries.projects.createProject(newProject);
}

// Action to add member to a project
export async function addProjectMemberAction(newProjectMember: NewProjectMember){
  await queries.projectMembers.addProjectMember(newProjectMember);
}

// Action to get projects a user is member in
export async function getUserMembershipAction(userId: string){
  return await queries.projectMembers.getUserMembership(userId);
}

// Action to get users that is not yet a member of a project
export async function getNonProjectMembersAction(projectId: string, query: string){
  return await queries.projectMembers.getNonProjectMembers(projectId, query);
}

// Action to get project members
export async function getProjectMembersAction(projectId: string, query: string){
  return await queries.projectMembers.getProjectMembers(projectId, query);
}

// Action to create task
export async function createTaskAction(newTask: NewTask){
  return await queries.tasks.createTask(newTask);
}

// Action to assign user to a task
export async function assignTaskAction(taskAssignee: NewTaskAssignee){
  await queries.taskAssignees.assignTask(taskAssignee);
}

// Action to get project deadline
export async function getProjectDeadlineAction(projectId: string){
  return await queries.projects.getProjectDeadline(projectId);
}

// Action to get all active projects of user
export async function getUserActiveProjectCountAction(userId: string){
  return await queries.projects.getUserActiveProjectCount(userId);
}

// Action to get all overdue projects of user
export async function getUserOverdueProjectCountAction(userId: string){
  return await queries.projects.getUserOverdueProjectCount(userId);
}

// Action to get all active tasks of user
export async function getUserActiveTaskCountAction(userId: string){
  return await queries.tasks.getUserActiveTaskCount(userId);
}

// Action to get all overdue tasks of user
export async function getUserOverdueTaskCountAction(userId: string){
  return await queries.tasks.getUserOverdueTaskCount(userId);
}

// Action to get brief information of user projects
export async function getUserProjectsInfoAction(userId: string){
  return await queries.projects.getUserProjectsInfo(userId);
}