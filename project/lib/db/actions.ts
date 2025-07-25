"use server";
import { queries } from "@/lib/db/queries"
import type { NewProject } from "@/lib/db/schema"

// Action to create project
export async function createProjectAction(newProject: NewProject){
  await queries.projects.createProject(newProject);
}

// Action to get user id with clerk id
export async function getUserIdAction(clerkId: string){
    return await queries.users.getUserId(clerkId);
}