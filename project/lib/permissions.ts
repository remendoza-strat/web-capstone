import { Role } from "@/lib/customtype"

// Permissions
export interface Permissions {
  editProject: boolean;
}

// Permission per role
export const RolePermissions: Record<Role, Permissions> = {
  "Project Manager": {
    editProject: true
  },
  "Frontend Developer": {
    editProject: false
  },
  "Backend Developer": {
    editProject: false
  },
  "Fullstack Developer": {
    editProject: false
  },
  "UI/UX Designer": {
    editProject: false
  },
  "QA Engineer": {
    editProject: false
  },
  "DevOps Engineer": {
    editProject: false
  },
  "Product Manager": {
    editProject: true
  },
  "Team Lead": {
    editProject: true
  }
};

// Permission checker
export const hasPermission = (role: Role, action: keyof Permissions) => {
  return RolePermissions[role][action];
};