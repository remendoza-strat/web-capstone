// Roles
export type Role =   "Project Manager" | "Frontend Developer" | "Backend Developer" | "Fullstack Developer" | "UI/UX Designer"
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