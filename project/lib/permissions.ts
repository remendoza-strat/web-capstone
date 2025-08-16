import { Role } from "@/lib/customtype"

// Permissions
export interface Permissions {
  editProject: boolean;
  addMember: boolean;
}

// Permission per role
export const RolePermissions: Record<Role, Permissions> = {
  "Project Manager": {
    editProject: true,
    addMember: true
  },
  "Frontend Developer": {
    editProject: false,
    addMember: false
  },
  "Backend Developer": {
    editProject: false,
    addMember: false
  },
  "Fullstack Developer": {
    editProject: false,
    addMember: false
  },
  "UI/UX Designer": {
    editProject: false,
    addMember: false
  },
  "QA Engineer": {
    editProject: false,
    addMember: false
  },
  "DevOps Engineer": {
    editProject: false,
    addMember: false
  },
  "Product Manager": {
    editProject: true,
    addMember: true
  },
  "Team Lead": {
    editProject: true,
    addMember: false
  }
};

// Permission checker
export const hasPermission = (role: Role, action: keyof Permissions) => {
  return RolePermissions[role][action];
};