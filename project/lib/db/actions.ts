"use server"
import { queries } from "@/lib/db/queries"
import type { NewProject, NewProjectMember } from "@/lib/db/schema"

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

// Action to get projects a user can add member to
export async function getProjectsUserCanAddAction(userId: string){
  return await queries.projectMembers.getProjectsUserCanAdd(userId);
}

// Action to get list of users that is not yet a member of a project
export async function getNonMembersOfProjectAction(projectId: string, query: string){
  return await queries.projectMembers.getNonMembersOfProject(projectId, query);
}