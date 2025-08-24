import { Role } from "@/lib/customtype"

// Permissions
export interface Permissions {
  editProject: boolean;
  addMember: boolean;
  editMember: boolean;
  addTask: boolean;
  editTask: boolean;
}

// Permission per role
export const RolePermissions: Record<Role, Permissions> = {
  "Project Manager": {
    editProject: true,
    addMember: true,
    editMember: true,
    addTask: true,
    editTask: true
  },
  "Frontend Developer": {
    editProject: false,
    addMember: false,
    editMember: false,
    addTask: false,
    editTask: false
  },
  "Backend Developer": {
    editProject: false,
    addMember: false,
    editMember: false,
    addTask: false,
    editTask: false
  },
  "Fullstack Developer": {
    editProject: false,
    addMember: false,
    editMember: false,
    addTask: false,
    editTask: false
  },
  "UI/UX Designer": {
    editProject: false,
    addMember: false,
    editMember: false,
    addTask: false,
    editTask: false
  },
  "QA Engineer": {
    editProject: false,
    addMember: false,
    editMember: false,
    addTask: false,
    editTask: false
  },
  "DevOps Engineer": {
    editProject: false,
    addMember: false,
    editMember: false,
    addTask: false,
    editTask: false
  },
  "Product Manager": {
    editProject: true,
    addMember: true,
    editMember: true,
    addTask: true,
    editTask: true
  },
  "Team Lead": {
    editProject: true,
    addMember: true,
    editMember: true,
    addTask: true,
    editTask: true
  }
};

// Permission checker
export const hasPermission = (role: Role, action: keyof Permissions) => {
  return RolePermissions[role][action];
};