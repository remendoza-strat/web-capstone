import { Role } from "@/lib/customtype"

// Permissions
export interface Permissions {
  editProject: boolean;
  addMember: boolean;
  editMember: boolean;
  addTask: boolean;
}

// Permission per role
export const RolePermissions: Record<Role, Permissions> = {
  "Project Manager": {
    editProject: true,
    addMember: true,
    editMember: true,
    addTask: true
  },
  "Frontend Developer": {
    editProject: false,
    addMember: false,
    editMember: false,
    addTask: false
  },
  "Backend Developer": {
    editProject: false,
    addMember: false,
    editMember: false,
    addTask: false
  },
  "Fullstack Developer": {
    editProject: false,
    addMember: false,
    editMember: false,
    addTask: false
  },
  "UI/UX Designer": {
    editProject: false,
    addMember: false,
    editMember: false,
    addTask: false
  },
  "QA Engineer": {
    editProject: false,
    addMember: false,
    editMember: false,
    addTask: false
  },
  "DevOps Engineer": {
    editProject: false,
    addMember: false,
    editMember: false,
    addTask: false
  },
  "Product Manager": {
    editProject: true,
    addMember: true,
    editMember: true,
    addTask: true
  },
  "Team Lead": {
    editProject: true,
    addMember: true,
    editMember: true,
    addTask: true
  }
};

// Permission checker
export const hasPermission = (role: Role, action: keyof Permissions) => {
  return RolePermissions[role][action];
};