import { Role } from "@/lib/customtype"

// Permissions
export interface Permissions {
  editProject: boolean;
  addMember: boolean;
  editMember: boolean;
}

// Permission per role
export const RolePermissions: Record<Role, Permissions> = {
  "Project Manager": {
    editProject: true,
    addMember: true,
    editMember: true
  },
  "Frontend Developer": {
    editProject: false,
    addMember: false,
    editMember: false
  },
  "Backend Developer": {
    editProject: false,
    addMember: false,
    editMember: false
  },
  "Fullstack Developer": {
    editProject: false,
    addMember: false,
    editMember: false
  },
  "UI/UX Designer": {
    editProject: false,
    addMember: false,
    editMember: false
  },
  "QA Engineer": {
    editProject: false,
    addMember: false,
    editMember: false
  },
  "DevOps Engineer": {
    editProject: false,
    addMember: false,
    editMember: false
  },
  "Product Manager": {
    editProject: true,
    addMember: true,
    editMember: true
  },
  "Team Lead": {
    editProject: true,
    addMember: true,
    editMember: true
  }
};

// Permission checker
export const hasPermission = (role: Role, action: keyof Permissions) => {
  return RolePermissions[role][action];
};