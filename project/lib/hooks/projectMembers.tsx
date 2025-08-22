import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProjectAction, createProjectMemberAction, createTaskAction, createTaskAssigneeAction, deleteCommentAction, deleteProjectAction, deleteProjectMemberAction, deleteTaskAssigneeAction, getAllUsersAction, getProjectMembersAction, getUserProjectsAction, getUserProjectsWithMembersAction, updateProjectAction, updateProjectMemberAction, getProjectDataAction } from "../db/actions";
import { NewProject, NewProjectMember, NewTask, NewTaskAssignee, projectMembers, projects } from "../db/schema";
import { getUserImageAction } from "../clerk/user-image";
import { getSocketId } from "../pusher/client";

// Uses getProjectMembers()
export function getProjectMembers(projectId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["project-members"],
    queryFn: async () => {
      const data = await getProjectMembersAction(projectId);
      return data ?? null;
    },
    enabled: options?.enabled ?? !!projectId
  });
}



























export function getUserImage(clerkId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["member-icon", clerkId],
    queryFn: async () => {
      const data = await getUserImageAction(clerkId);
      return data ?? null;
    },
    enabled: options?.enabled ?? !!clerkId
  });
}

export function getAllUsers(){
  return useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const data = await getAllUsersAction();
      return data ?? null;
    }
  });
}

export function getUserProjects(userId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["user-projects", userId],
    queryFn: async () => {
      const data = await getUserProjectsAction(userId);
      return data ?? null;
    },
    enabled: options?.enabled ?? !!userId
  });
}

export function getUserProjectsWithMembers(userId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["all-project-members", userId],
    queryFn: async () => {
      const data = await getUserProjectsWithMembersAction(userId);
      return data ?? null;
    },
    enabled: options?.enabled ?? !!userId
  });
}

export function getProjectData(projectId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["project-data", projectId],
    queryFn: async () => {
      const data = await getProjectDataAction(projectId);
      return data ?? null;
    },
    enabled: options?.enabled ?? !!projectId
  });
}

export function createProjectMember(userId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ newProjectMember } : { newProjectMember: NewProjectMember }) => {
      await createProjectMemberAction(newProjectMember);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-projects", userId] });
      queryClient.invalidateQueries({ queryKey: ["all-project-members", userId] });
    }
  });
}

export function updateProjectMember(userId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ pmId, updPm } : { pmId: string, updPm: Partial<typeof projectMembers.$inferInsert> }) => {
      await updateProjectMemberAction(pmId, updPm);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-projects", userId] });
      queryClient.invalidateQueries({ queryKey: ["all-project-members", userId] });
    }
  });
}

export function deleteProject(userId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId } : { projectId: string }) => {
      await deleteProjectAction(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-project-members", userId] });
    }
  });
}

export function kickMember(userId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ pmId, projectId, userId } : { pmId: string, projectId: string, userId: string }) => {
      await deleteProjectMemberAction(pmId);
      await deleteTaskAssigneeAction(projectId, userId);
      await deleteCommentAction(projectId, userId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-project-members", userId] });
    }
  });
}

export function createProject(userId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ newProject } : { newProject: NewProject }) => {
      const data = await createProjectAction(newProject);
      return data ?? null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-projects", userId] });
    }
  });
}

export function createTaskAssignee(){
  return useMutation({
    mutationFn: async (newTaskAssignee: NewTaskAssignee) => {
      await createTaskAssigneeAction(newTaskAssignee);
    }
  });
}

export function createTask(userId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, newTask } : { projectId: string, newTask: NewTask }) => {
      const socketId = getSocketId();
      return await createTaskAction(projectId, newTask, socketId || undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-projects", userId] });
    }
  });
}

export function updateProject(userId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, updProject } : { projectId: string; updProject: Partial<typeof projects.$inferInsert> }) => {
      const socketId = getSocketId(); 
      return await updateProjectAction(projectId, updProject, socketId || undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-projects", userId] });
    }
  });
}

export function deleteProjectMember(userId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ pmId } : { pmId: string }) => {
      await deleteProjectMemberAction(pmId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-projects", userId] });
    }
  });
}