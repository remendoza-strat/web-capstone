import { Role } from "@/lib/customtype"

// Permissions
export interface Permissions {
  editProject: boolean;
  addMember: boolean;
  editMember: boolean;
  addTask: boolean;
  editTask: boolean;
  editComment: boolean;
}

// Permission per role
export const RolePermissions: Record<Role, Permissions> = {
  "Project Manager": {
    editProject: true,
    addMember: true,
    editMember: true,
    addTask: true,
    editTask: true,
    editComment: true
  },
  "Frontend Developer": {
    editProject: false,
    addMember: false,
    editMember: false,
    addTask: false,
    editTask: false,
    editComment: false
  },
  "Backend Developer": {
    editProject: false,
    addMember: false,
    editMember: false,
    addTask: false,
    editTask: false,
    editComment: false
  },
  "Fullstack Developer": {
    editProject: false,
    addMember: false,
    editMember: false,
    addTask: false,
    editTask: false,
    editComment: false
  },
  "UI/UX Designer": {
    editProject: false,
    addMember: false,
    editMember: false,
    addTask: false,
    editTask: false,
    editComment: false
  },
  "QA Engineer": {
    editProject: false,
    addMember: false,
    editMember: false,
    addTask: false,
    editTask: false,
    editComment: false
  },
  "DevOps Engineer": {
    editProject: false,
    addMember: false,
    editMember: false,
    addTask: false,
    editTask: false,
    editComment: false
  },
  "Product Manager": {
    editProject: true,
    addMember: true,
    editMember: true,
    addTask: true,
    editTask: true,
    editComment: true
  },
  "Team Lead": {
    editProject: true,
    addMember: true,
    editMember: true,
    addTask: true,
    editTask: true,
    editComment: true
  }
};

// Permission checker
export const hasPermission = (role: Role, action: keyof Permissions) => {
  return RolePermissions[role][action];
};