"use server"
import { queries } from "@/lib/db/queries"
import type { NewProject, NewProjectMember } from "@/lib/db/schema"

// Action to get user id with clerk id
export async function getUserIdAction(clerkId: string){
  return await queries.users.getUserId(clerkId);
}

// Action to create a project
export async function createProjectAction(newProject: NewProject){
  return await queries.projects.createProject(newProject);
}

// Action to add member to a project
export async function addProjectMemberAction(newProjectMember: NewProjectMember){
  await queries.projectMembers.addProjectMember(newProjectMember);
}