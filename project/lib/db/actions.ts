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