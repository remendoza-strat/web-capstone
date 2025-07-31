import type { Project } from "@/lib/db/schema"

// Priorities
export type Priority = "Low" | "Medium" | "High";

// Array for priorities select field
export const PriorityArr: Priority[] = ["Low", "Medium", "High"];

// Roles
export type Role = "Project Manager" | "Frontend Developer" | "Backend Developer" | "Fullstack Developer" | "UI/UX Designer"
  | "QA Engineer" | "DevOps Engineer" | "Product Manager"| "Team Lead";

// Array for roles select field
export const RoleArr: Role[] = ["Project Manager", "Frontend Developer", "Backend Developer", "Fullstack Developer", "UI/UX Designer", 
  "QA Engineer", "DevOps Engineer", "Product Manager", "Team Lead"];

// Getting brief project info
export interface QueryProject{
  projectId: string;
  projectName: string;
}

// Getting brief user info
export interface QueryUser{
  userId: string;
  userEmail: string; 
  userFname: string; 
  userLname: string;
}

// Getting project card info
export interface UserRecentProject{
  project: Project;
  memberCount: number;
  taskCount: number;
  progress: number;
}