import type { Comment, Project, ProjectMember, Task, TaskAssignee, User } from "@/lib/db/schema"

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

// Custom Types
export interface ProjectMemberUser extends ProjectMember{
  user: User;
}
export interface UserProjects extends Project{
  members: ProjectMemberUser[];
  tasks: Task[];
}
export interface ProjectsWithTasks extends Project{
  tasks: Task[];
}
export interface MembersWithData extends ProjectMember{
  user: User;
}
export interface ProjectsWithMembers extends Project{
  members: ProjectMemberUser[];
}
export interface TaskAssigneeUser extends TaskAssignee{
  user: User;
}
export interface TaskWithAssignees extends Task{
  assignees: TaskAssigneeUser[];
}
export interface ProjectData extends Project{
  members: ProjectMemberUser[]; 
  tasks: TaskWithAssignees[];
}
export interface CommentsWithUser extends Comment{
  user: User;
}
export interface TaskWithProject extends Task{
  project: Project;
}
export interface UserTask extends TaskAssignee{
  task: TaskWithProject;
}