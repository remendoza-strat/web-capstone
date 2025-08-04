import type { Project, ProjectMember, Task, User } from "@/lib/db/schema"

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

// Getting user projects info
export interface ProjectMemberUser extends ProjectMember{
  user: User;
}
export interface UserProjects extends Project{
  members: ProjectMemberUser[];
  tasks: Task[];
}