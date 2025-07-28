// Roles
export type Role = "Viewer" | "Project Manager" | "Developer" | "Designer" | "QA Engineer";

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
  userLname: string
}